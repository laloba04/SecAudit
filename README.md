# 🛡️ SecAudit

**Herramienta open-source de auditoría de seguridad pasiva para sitios web.**

Analiza cabeceras HTTP, certificados SSL/TLS y dependencias públicas para detectar configuraciones inseguras, generando reportes técnicos con hallazgos y recomendaciones — sin realizar ninguna prueba invasiva.

> Construido con **Python + Go + React** — el mismo stack que usan herramientas profesionales de seguridad como Nuclei o httpx-toolkit.

---

## ✨ Funcionalidades

- 🔍 **Análisis de cabeceras HTTP** — HSTS, CSP, X-Frame-Options, CORS, cookies inseguras
- 🔒 **Verificación SSL/TLS** — protocolos débiles, certificados caducados, cipher suites inseguros
- ⚙️ **Detección de configuraciones inseguras** — métodos HTTP peligrosos, directory listing, info disclosure
- 📦 **Auditoría de dependencias públicas** — scripts JS/CSS con CVEs conocidos via OSV.dev API
- 📊 **Reportes en PDF y HTML** — hallazgos, severidades, puntuación de seguridad y pasos de remediación
- 🖥️ **Dashboard web** — historial de análisis, gráficas, comparativa entre auditorías
- 🧪 **Modo sandbox** — Docker Compose con OWASP Juice Shop y DVWA para practicar localmente

---

## 🛠️ Stack Tecnológico

| Área | Tecnología | Rol |
|---|---|---|
| Scanner | Python 3.12 + httpx | Análisis de headers, SSL, deps, configuración |
| API REST | Go + Gin | Backend de alto rendimiento, auth JWT |
| Base de datos | SQLite → PostgreSQL | Historial de scans y hallazgos |
| Reportes | Python + WeasyPrint + Jinja2 | Generación de PDF y HTML |
| Frontend | React + TailwindCSS + Recharts | Dashboard interactivo |
| Autenticación | JWT (golang-jwt + bcrypt) | Registro, login, protección de rutas |
| Sandbox | Docker Compose | Entorno de práctica local aislado |
| Tests | pytest + go test | Tests unitarios por módulo |
| CI/CD | GitHub Actions | Tests automáticos en cada commit |

---

## 📁 Estructura del Proyecto

```
secaudit/
├── api/                        # Go + Gin
│   ├── main.go                 # Entry point
│   ├── handlers/               # Controladores HTTP
│   ├── models/                 # Structs de BD (GORM)
│   ├── middleware/             # JWT auth
│   └── go.mod
├── scanner/                    # Python
│   ├── headers_scanner.py      # Análisis de cabeceras HTTP
│   ├── ssl_scanner.py          # Verificación SSL/TLS
│   ├── config_checker.py       # Configuraciones inseguras
│   ├── deps_auditor.py         # Dependencias con CVEs
│   ├── report_generator.py     # Generación PDF + HTML
│   ├── templates/              # Plantillas Jinja2
│   └── requirements.txt
├── frontend/                   # React + TailwindCSS
│   ├── src/
│   │   ├── pages/              # Dashboard, ScanDetail, History
│   │   └── components/         # FindingCard, ScoreChart, Badge
│   └── package.json
├── sandbox/
│   └── docker-compose.yml      # OWASP Juice Shop + DVWA
├── tests/
│   ├── test_scanner.py         # pytest
│   └── api_test.go             # go test
└── README.md
```

---

## 🚀 Instalación y Uso

### Requisitos

- Python 3.12+
- Go 1.22+
- Node.js 18+
- Docker (para modo sandbox)

### Scanner Python

```bash
cd scanner
pip install -r requirements.txt

# Análisis rápido desde terminal
python headers_scanner.py https://ejemplo.com
```

### API Go

```bash
cd api
go mod tidy
go run main.go
# API disponible en http://localhost:8080
```

### Frontend React

```bash
cd frontend
npm install
npm run dev
# Dashboard en http://localhost:5173
```

### Modo Sandbox (práctica local segura)

```bash
cd sandbox
docker-compose up -d
# OWASP Juice Shop → http://localhost:3000
# DVWA            → http://localhost:8080
```

---

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Login — devuelve JWT |
| `POST` | `/api/scans` | Lanza nueva auditoría |
| `GET` | `/api/scans` | Historial de auditorías |
| `GET` | `/api/scans/:id` | Detalle y hallazgos |
| `GET` | `/api/scans/:id/compare` | Compara dos auditorías |
| `GET` | `/api/reports/:id` | Descarga reporte PDF/HTML |

---

## 🗃️ Base de Datos

```sql
users     → id, email, password_hash, created_at
scans     → id, user_id, target_url, status, score, modules_run, created_at, ended_at
findings  → id, scan_id, module, severity, title, description, recommendation
```

---

## 🔒 Ética y Legalidad

SecAudit realiza **únicamente análisis pasivo**:

- Solo analiza información que los servidores exponen públicamente en sus respuestas HTTP
- No realiza fuzzing, inyecciones ni pruebas invasivas
- No explota vulnerabilidades
- Úsalo siempre sobre dominios que tengas permiso de analizar

---

## 🗺️ Roadmap

- [ ] **Fase 1** — Scanner Python en terminal (headers + SSL)
- [ ] **Fase 2** — API Go + Gin + base de datos SQLite
- [ ] **Fase 3** — Reportes PDF + módulos config_checker y deps_auditor
- [ ] **Fase 4** — Dashboard React + comparativa de auditorías
- [ ] **Fase 5** — Tests, CI/CD, despliegue público y portafolio

---

## 🧪 Tests

```bash
# Python
cd scanner && pytest ../tests/ -v

# Go
cd api && go test ./...
```

---

## 📄 Licencia

MIT — libre para usar, modificar y distribuir.

---

*SecAudit · Python + Go + React · Proyecto de aprendizaje en ciberseguridad · 2025*
