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
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🛡️  SecAudit API running on http://localhost:%s\n", port)
	r.Run(":" + port)
}
