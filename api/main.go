package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/glebarez/go-sqlite"
)

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite", "./secaudit.db")
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// Crear tablas
	schema := `
	CREATE TABLE IF NOT EXISTS scans (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		target_url TEXT NOT NULL,
		status TEXT DEFAULT 'pending',
		score INTEGER,
		findings_count INTEGER DEFAULT 0,
		modules_run TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		ended_at DATETIME
	);

	CREATE TABLE IF NOT EXISTS findings (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		scan_id INTEGER NOT NULL,
		category TEXT,
		severity TEXT,
		title TEXT,
		description TEXT,
		recommendation TEXT,
		FOREIGN KEY (scan_id) REFERENCES scans(id)
	);
	`
	_, err = db.Exec(schema)
	if err != nil {
		log.Fatal("Error creating tables:", err)
	}
	log.Println("✅ Database initialized (SQLite)")
}

// --- Handlers ---

// GET /api/scans — Historial de auditorías
func getScans(c *gin.Context) {
	rows, err := db.Query("SELECT id, target_url, status, score, findings_count, created_at FROM scans ORDER BY created_at DESC LIMIT 50")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var scans []gin.H
	for rows.Next() {
		var id, findingsCount int
		var score sql.NullInt64
		var targetURL, status, createdAt string
		err := rows.Scan(&id, &targetURL, &status, &score, &findingsCount, &createdAt)
		if err != nil {
			continue
		}
		scan := gin.H{
			"id":             id,
			"target_url":     targetURL,
			"status":         status,
			"findings_count": findingsCount,
			"created_at":     createdAt,
		}
		if score.Valid {
			scan["score"] = score.Int64
		} else {
			scan["score"] = nil
		}
		scans = append(scans, scan)
	}

	if scans == nil {
		scans = []gin.H{}
	}
	c.JSON(http.StatusOK, scans)
}

// POST /api/scans — Lanzar nueva auditoría
func createScan(c *gin.Context) {
	var body struct {
		URL string `json:"url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL is required"})
		return
	}

	// Insertar scan
	result, err := db.Exec("INSERT INTO scans (target_url, status) VALUES (?, 'processing')", body.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	scanID, _ := result.LastInsertId()

	// Ejecutar scanner Python
	go runScanner(scanID, body.URL)

	c.JSON(http.StatusCreated, gin.H{"scanId": scanID, "status": "processing"})
}

// GET /api/scans/:id — Detalle de auditoría con hallazgos
func getScanDetail(c *gin.Context) {
	id := c.Param("id")

	// Obtener scan
	var scanID, findingsCount int
	var score sql.NullInt64
	var targetURL, status, createdAt string
	err := db.QueryRow("SELECT id, target_url, status, score, findings_count, created_at FROM scans WHERE id = ?", id).
		Scan(&scanID, &targetURL, &status, &score, &findingsCount, &createdAt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Scan not found"})
		return
	}

	scan := gin.H{
		"id":             scanID,
		"target_url":     targetURL,
		"status":         status,
		"findings_count": findingsCount,
		"created_at":     createdAt,
	}
	if score.Valid {
		scan["score"] = score.Int64
	} else {
		scan["score"] = nil
	}

	// Obtener findings
	rows, err := db.Query("SELECT id, category, severity, title, description, recommendation FROM findings WHERE scan_id = ? ORDER BY CASE severity WHEN 'Critical' THEN 0 WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 END", id)
	if err != nil {
		scan["findings"] = []gin.H{}
		c.JSON(http.StatusOK, scan)
		return
	}
	defer rows.Close()

	var findings []gin.H
	for rows.Next() {
		var fID int
		var category, severity, title, description, recommendation string
		if err := rows.Scan(&fID, &category, &severity, &title, &description, &recommendation); err != nil {
			continue
		}
		findings = append(findings, gin.H{
			"id":             fID,
			"category":       category,
			"severity":       severity,
			"title":          title,
			"description":    description,
			"recommendation": recommendation,
		})
	}

	if findings == nil {
		findings = []gin.H{}
	}
	scan["findings"] = findings
	c.JSON(http.StatusOK, scan)
}

// GET /api/dev/db — Visor en crudo de la base de datos SQLite
func getDatabaseSummary(c *gin.Context) {
	// Obtener scans
	scansRows, _ := db.Query("SELECT * FROM scans ORDER BY id DESC")
	defer scansRows.Close()
	var scans []map[string]interface{}
	cols, _ := scansRows.Columns()
	for scansRows.Next() {
		columns := make([]interface{}, len(cols))
		columnPointers := make([]interface{}, len(cols))
		for i := range columns {
			columnPointers[i] = &columns[i]
		}
		scansRows.Scan(columnPointers...)
		row := make(map[string]interface{})
		for i, colName := range cols {
			val := columnPointers[i].(*interface{})
			row[colName] = *val
		}
		scans = append(scans, row)
	}

	// Obtener findings
	findRows, _ := db.Query("SELECT * FROM findings")
	defer findRows.Close()
	var findings []map[string]interface{}
	fCols, _ := findRows.Columns()
	for findRows.Next() {
		columns := make([]interface{}, len(fCols))
		columnPointers := make([]interface{}, len(fCols))
		for i := range columns {
			columnPointers[i] = &columns[i]
		}
		findRows.Scan(columnPointers...)
		row := make(map[string]interface{})
		for i, colName := range fCols {
			val := columnPointers[i].(*interface{})
			row[colName] = *val
		}
		findings = append(findings, row)
	}

	c.JSON(http.StatusOK, gin.H{
		"scans":    scans,
		"findings": findings,
		"tables":   []string{"scans", "findings"},
	})
}

// runScanner ejecuta el scanner Python y guarda resultados en la BD
func runScanner(scanID int64, url string) {
	// Buscar el directorio del scanner relativo al ejecutable
	scannerDir := filepath.Join("..", "scanner")
	scannerPath := filepath.Join(scannerDir, "scanner.py")

	cmd := exec.Command("python", scannerPath, url)
	cmd.Dir = scannerDir
	output, err := cmd.Output()
	if err != nil {
		log.Printf("❌ Scanner error for scan %d: %v", scanID, err)
		db.Exec("UPDATE scans SET status = 'failed', ended_at = ? WHERE id = ?", time.Now(), scanID)
		return
	}

	var result struct {
		Score         int      `json:"score"`
		FindingsCount int      `json:"findings_count"`
		ModulesRun    []string `json:"modules_run"`
		Findings      []struct {
			Category       string `json:"category"`
			Severity       string `json:"severity"`
			Title          string `json:"title"`
			Description    string `json:"description"`
			Recommendation string `json:"recommendation"`
		} `json:"findings"`
	}

	if err := json.Unmarshal(output, &result); err != nil {
		log.Printf("❌ Error parsing scanner output for scan %d: %v", scanID, err)
		db.Exec("UPDATE scans SET status = 'failed', ended_at = ? WHERE id = ?", time.Now(), scanID)
		return
	}

	// Guardar findings
	for _, f := range result.Findings {
		db.Exec("INSERT INTO findings (scan_id, category, severity, title, description, recommendation) VALUES (?, ?, ?, ?, ?, ?)",
			scanID, f.Category, f.Severity, f.Title, f.Description, f.Recommendation)
	}

	// Actualizar scan
	modulesJSON, _ := json.Marshal(result.ModulesRun)
	db.Exec("UPDATE scans SET status = 'completed', score = ?, findings_count = ?, modules_run = ?, ended_at = ? WHERE id = ?",
		result.Score, result.FindingsCount, string(modulesJSON), time.Now(), scanID)

	log.Printf("✅ Scan %d completed: score=%d, findings=%d", scanID, result.Score, result.FindingsCount)
}

func main() {
	initDB()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// CORS — permitir frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.GET("/scans", getScans)
		api.POST("/scans", createScan)
		api.GET("/scans/:id", getScanDetail)
		api.GET("/dev/db", getDatabaseSummary)
		api.GET("/stats/vulnerabilities", getVulnerabilityStats)
		api.GET("/stats/ssl", getSSLStats)
		api.GET("/infra/status", getInfraStatus)
		api.POST("/infra/start/:service", startInfraService)
		api.POST("/infra/stop/:service", stopInfraService)
		api.GET("/notifications", getNotifications)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🛡️  SecAudit API running on http://localhost:%s\n", port)
	r.Run(":" + port)
}

// GET /api/stats/vulnerabilities — Estadísticas de vulnerabilidades reales
func getVulnerabilityStats(c *gin.Context) {
	// Contar findings agrupados por severidad
	rows, err := db.Query(`
		SELECT severity, COUNT(*) as count 
		FROM findings 
		GROUP BY severity 
		ORDER BY CASE severity 
			WHEN 'Critical' THEN 1 
			WHEN 'High' THEN 2 
			WHEN 'Medium' THEN 3 
			WHEN 'Low' THEN 4 
		END
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	counts := gin.H{"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
	for rows.Next() {
		var severity string
		var count int
		if err := rows.Scan(&severity, &count); err == nil {
			counts[severity] = count
		}
	}

	// Top findings más recurrentes
	topRows, err := db.Query(`
		SELECT title, severity, category, COUNT(*) as occurrences 
		FROM findings 
		GROUP BY title 
		ORDER BY occurrences DESC, 
			CASE severity WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 END 
		LIMIT 20
	`)
	var topFindings []gin.H
	if err == nil {
		defer topRows.Close()
		for topRows.Next() {
			var title, severity, category string
			var occurrences int
			if err := topRows.Scan(&title, &severity, &category, &occurrences); err == nil {
				topFindings = append(topFindings, gin.H{
					"title":       title,
					"severity":    severity,
					"category":    category,
					"occurrences": occurrences,
				})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"counts":   counts,
		"findings": topFindings,
	})
}

// GET /api/stats/ssl — Datos SSL de escaneos completados
func getSSLStats(c *gin.Context) {
	// Obtener los dominios escaneados con sus findings SSL
	rows, err := db.Query(`
		SELECT DISTINCT s.target_url, s.score, s.created_at,
			COALESCE(f.title, '') as ssl_finding,
			COALESCE(f.severity, 'Low') as ssl_severity,
			COALESCE(f.description, '') as ssl_desc
		FROM scans s
		LEFT JOIN findings f ON f.scan_id = s.id AND f.category = 'SSL'
		WHERE s.status = 'completed'
		ORDER BY s.created_at DESC
		LIMIT 20
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var sslData []gin.H
	for rows.Next() {
		var targetURL, createdAt, sslFinding, sslSeverity, sslDesc string
		var score sql.NullInt64
		if err := rows.Scan(&targetURL, &score, &createdAt, &sslFinding, &sslSeverity, &sslDesc); err == nil {
			status := "valid"
			if sslFinding != "" {
				if sslSeverity == "Critical" || sslSeverity == "High" {
					status = "expired"
				} else {
					status = "warning"
				}
			}
			sslData = append(sslData, gin.H{
				"domain":     targetURL,
				"score":      score.Int64,
				"scanned_at": createdAt,
				"finding":    sslFinding,
				"severity":   sslSeverity,
				"status":     status,
			})
		}
	}

	c.JSON(http.StatusOK, sslData)
}

// --- Infrastructure (Docker) ---

var sandboxServices = map[string]string{
	"juice-shop":  "secaudit-juiceshop",
	"dvwa":        "secaudit-dvwa",
	"uptime-kuma": "secaudit-uptime",
	"dozzle":      "secaudit-dozzle",
}

// GET /api/infra/status — Estado de contenedores Docker
func getInfraStatus(c *gin.Context) {
	// Verificar si Docker está disponible
	dockerCheck := exec.Command("docker", "version", "--format", "{{.Server.Version}}")
	dockerOut, err := dockerCheck.Output()
	dockerAvailable := err == nil && len(dockerOut) > 0

	// Obtener contenedores corriendo
	runningContainers := make(map[string]bool)
	if dockerAvailable {
		cmd := exec.Command("docker", "ps", "--format", "{{.Names}}")
		out, err := cmd.Output()
		if err == nil {
			for _, name := range strings.Split(strings.TrimSpace(string(out)), "\n") {
				runningContainers[strings.TrimSpace(name)] = true
			}
		}
	}

	var services []gin.H
	for service, container := range sandboxServices {
		running := runningContainers[container]
		status := "stopped"
		if running {
			status = "running"
		}
		services = append(services, gin.H{
			"service":   service,
			"container": container,
			"status":    status,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"docker_available": dockerAvailable,
		"services":         services,
	})
}

// POST /api/infra/start/:service — Arrancar servicio Docker
func startInfraService(c *gin.Context) {
	service := c.Param("service")

	if _, ok := sandboxServices[service]; !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unknown service: " + service})
		return
	}

	// Encontrar ruta al docker-compose.yml
	composePath := filepath.Join("..", "sandbox", "docker-compose.yml")
	cmd := exec.Command("docker-compose", "-f", composePath, "up", "-d", service)
	out, err := cmd.CombinedOutput()
	if err != nil {
		// Intentar con "docker compose" (nueva sintaxis)
		cmd2 := exec.Command("docker", "compose", "-f", composePath, "up", "-d", service)
		out2, err2 := cmd2.CombinedOutput()
		if err2 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":  "Failed to start " + service,
				"detail": string(out) + "\n" + string(out2),
			})
			return
		}
		out = out2
	}

	c.JSON(http.StatusOK, gin.H{
		"message": service + " started",
		"output":  string(out),
	})
}

// POST /api/infra/stop/:service — Parar servicio Docker
func stopInfraService(c *gin.Context) {
	service := c.Param("service")

	if _, ok := sandboxServices[service]; !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unknown service: " + service})
		return
	}

	composePath := filepath.Join("..", "sandbox", "docker-compose.yml")
	cmd := exec.Command("docker-compose", "-f", composePath, "stop", service)
	out, err := cmd.CombinedOutput()
	if err != nil {
		cmd2 := exec.Command("docker", "compose", "-f", composePath, "stop", service)
		out2, err2 := cmd2.CombinedOutput()
		if err2 != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":  "Failed to stop " + service,
				"detail": string(out) + "\n" + string(out2),
			})
			return
		}
		out = out2
	}

	c.JSON(http.StatusOK, gin.H{
		"message": service + " stopped",
		"output":  string(out),
	})
}

// GET /api/notifications — Notificaciones reales basadas en escaneos
func getNotifications(c *gin.Context) {
	rows, err := db.Query(`
		SELECT s.id, s.target_url, s.status, s.score, s.findings_count, s.created_at
		FROM scans s
		ORDER BY s.created_at DESC
		LIMIT 10
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var notifs []gin.H
	id := 1
	for rows.Next() {
		var scanID, findingsCount int
		var score sql.NullInt64
		var targetURL, status, createdAt string
		if err := rows.Scan(&scanID, &targetURL, &status, &score, &findingsCount, &createdAt); err != nil {
			continue
		}

		if status == "completed" {
			notifs = append(notifs, gin.H{
				"id":    id,
				"title": "Escaneo completado",
				"desc":  fmt.Sprintf("%s — %d pts, %d hallazgos", targetURL, score.Int64, findingsCount),
				"type":  "success",
				"time":  createdAt,
			})
			id++
		} else if status == "failed" {
			notifs = append(notifs, gin.H{
				"id":    id,
				"title": "Escaneo fallido",
				"desc":  fmt.Sprintf("%s — error de conexión", targetURL),
				"type":  "error",
				"time":  createdAt,
			})
			id++
		}
	}

	// Buscar findings críticos/altos
	critRows, err := db.Query(`
		SELECT f.title, s.target_url
		FROM findings f
		JOIN scans s ON f.scan_id = s.id
		WHERE f.severity IN ('Critical', 'High')
		ORDER BY f.id DESC
		LIMIT 5
	`)
	if err == nil {
		defer critRows.Close()
		for critRows.Next() {
			var title, targetURL string
			if err := critRows.Scan(&title, &targetURL); err == nil {
				notifs = append(notifs, gin.H{
					"id":    id,
					"title": "⚠️ " + title,
					"desc":  targetURL,
					"type":  "error",
				})
				id++
			}
		}
	}

	c.JSON(http.StatusOK, notifs)
}
