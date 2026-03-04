package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// setupTestRouter crea un router de test con la misma configuración que main()
func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	// Inicializar DB en memoria para tests
	initDB()

	r := gin.Default()
	r.Use(cors.Default())

	api := r.Group("/api")
	{
		api.GET("/scans", getScans)
		api.POST("/scans", createScan)
		api.GET("/scans/:id", getScanDetail)
		api.GET("/dev/db", getDatabaseSummary)
	}

	return r
}

func TestGetScansEmpty(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/scans", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var scans []map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &scans); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	// Should return empty array, not null
	if scans == nil {
		t.Error("Expected empty array, got nil")
	}
}

func TestCreateScanRequiresURL(t *testing.T) {
	router := setupTestRouter()

	// Test sin URL — debe fallar
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/scans", strings.NewReader(`{}`))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 for missing URL, got %d", w.Code)
	}
}

func TestCreateScanSuccess(t *testing.T) {
	router := setupTestRouter()

	body := `{"url": "https://example.com"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/scans", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", w.Code)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &result); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if _, ok := result["scanId"]; !ok {
		t.Error("Response should contain scanId")
	}
	if result["status"] != "processing" {
		t.Errorf("Expected status 'processing', got '%s'", result["status"])
	}
}

func TestGetScanDetailNotFound(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/scans/99999", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404 for non-existent scan, got %d", w.Code)
	}
}

func TestGetScanDetailAfterCreate(t *testing.T) {
	router := setupTestRouter()

	// Crear un scan
	body := `{"url": "https://test.com"}`
	w1 := httptest.NewRecorder()
	req1, _ := http.NewRequest("POST", "/api/scans", strings.NewReader(body))
	req1.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w1, req1)

	var created map[string]interface{}
	json.Unmarshal(w1.Body.Bytes(), &created)

	// Obtener el scan creado
	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("GET", "/api/scans/1", nil)
	router.ServeHTTP(w2, req2)

	if w2.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w2.Code)
	}

	var scan map[string]interface{}
	json.Unmarshal(w2.Body.Bytes(), &scan)

	if scan["target_url"] != "https://test.com" {
		t.Errorf("Expected target_url 'https://test.com', got '%s'", scan["target_url"])
	}
}

func TestGetDatabaseSummary(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/dev/db", nil)
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &result); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if _, ok := result["tables"]; !ok {
		t.Error("Response should contain 'tables' key")
	}
}
