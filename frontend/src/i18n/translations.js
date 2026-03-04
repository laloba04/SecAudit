export const translations = {
  en: {
    // Header & Navigation
    appName: "SecAudit",
    vulnerabilityDashboard: "Vulnerability Dashboard",
    searchPlaceholder: "Search scans...",

    // Sidebar Menu
    mainMenu: "Main Menu",
    dashboard: "Dashboard",
    scanHistory: "Scan History",
    reports: "Reports",
    security: "Security",
    vulnerabilities: "Vulnerabilities",
    sslMonitor: "SSL Monitor",
    infrastructure: "Infrastructure",
    settings: "Settings",
    preferences: "Preferences",
    myProfile: "My Profile",
    logout: "Log Out",
    dbViewer: "SQLite Viewer",

    // Scan Section
    performSecurityAudit: "Perform Security Audit",
    auditDescription:
      "Analyze HTTP headers, SSL/TLS, and configurations (Passive Analysis Only)",
    enterWebsiteUrl: "Enter website URL (e.g., example.com)",
    auditNow: "Audit Now",
    scanning: "Scanning...",

    // Dashboard Cards
    auditScoreTrend: "Audit Score Trend",
    recentAudits: "Recent Audits",
    viewAll: "View All",

    // Table Headers
    targetUrl: "Target URL",
    status: "Status",
    score: "Score",
    date: "Date",
    action: "Action",

    // Status
    completed: "COMPLETED",
    processing: "PROCESSING",
    failed: "FAILED",
    pending: "PENDING",

    // Details Panel
    viewDetails: "View Details",
    scanId: "Scan ID",
    report: "Report",
    visit: "Visit",
    findings: "Findings",
    noScanSelected: "No Scan Selected",
    noScanSelectedDescription:
      "Select an audit from the table to view detailed vulnerabilities and fixes.",
    noSecurityIssues: "No security issues found! Good job.",
    recommendation: "Recommendation",

    // Messages
    loadingAudits: "Loading audits...",
    noAuditsFound: "No audits found. Start your first scan above!",
    loadingDetails: "Loading details...",
    scanCompleted: "Scan completed successfully!",
    startingAudit: "Starting audit... Please wait.",
    scanFailed: "Scan failed to initiate",

    // Auth & Settings
    signIn: "Sign In",
    createAccount: "Create Account",
    password: "Password",
    fullName: "Full Name",
    rememberMe: "Remember me",
    forgotPasswordQuestion: "Forgot your password?",
    noAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    registerHere: "Register",
    loginHere: "Sign In",
    joinSecAudit: "Join SecAudit",
    accessDashboard: "Access SecAudit dashboard",
    authenticating: "Authenticating...",
    loginButton: "Log In",
    creatingAccount: "Creating...",
    registerButton: "Register",
    passwordMinLength: "Password must be at least 8 characters",
    incorrectCredentials: "Incorrect credentials.",
    recoverPassword: "Recover Password",
    recoverDesc: "Enter your email and we'll send a reset link.",
    registeredEmail: "Registered Email",
    sending: "Sending...",
    sendLink: "Send Link",
    backToLogin: "Back to Login",
    linkSent: "Recovery link sent to",
    checkInbox: "! Check your inbox or spam.",

    // DB View & Prefs
    dbInspector: "SQLite Inspector",
    dbViewDesc: "Explore raw tables and records from secaudit.db",
    refresh: "Refresh",
    queryingDb: "Querying database...",
    table: "Table:",
    noData: "No data",
    emptyTable: "The table is empty.",
    dbError: "Error reading the database",
    general: "General",
    scanTimeout: "Scan Timeout (seconds)",
    scannerDepth: "Python Scanner Depth",
    depthFast: "Fast (Passive Headers + SSL)",
    depthStandard: "Standard (Fast + Config Detection)",
    depthFull: "Full (Add CVEs from OSV.dev)",
    sqliteDb: "SQLite Database",
    dbSize: "Database Size",
    purgeHistory: "Purge all histories",
    saveChanges: "Save Changes",
    masterNode: "Master Node",
    pythonScanner: "Python Scanner",
    goApiServer: "Go API Server",

    // Infrastructure
    infrastructureDesc: "Manage SecAudit nodes and Docker Sandbox environments.",
    port: "Port",
    open: "Open",
    startNode: "Start",
    stopNode: "Stop",

    // SSL Monitor
    sslMonitorDesc: "Monitor TLS certificate expiry and strength.",
    domain: "Domain",
    certificateAuthority: "Certificate Authority",
    expiration: "Expiration",
    validSsl: "Valid",
    warningSsl: "Review",
    expiredSsl: "Expired",

    // Vulnerabilities
    catHeaders: "HTTP Headers",
    catCrypto: "Cryptography / SSL",
    catConfig: "Config Detection",
    catCves: "CVEs / Dependencies",
    vulnSummaryDesc: "A global summary of the types of vulnerabilities found across all your scans.",
    signatureCatalog: "Signature Catalog",
    signatureCatalogDesc: "This catalog will show all vulnerabilities (CVEs and insecure configurations) that the Python engine can detect.",

    // Reports
    reportsDesc: "Download detailed analyses in PDF or HTML.",
    filter: "Filter",
    downloadReport: "Download Report (HTML)",
    reportGenerator: "Report Generator",
    reportGeneratorDesc: "Export active audits to an interactive HTML document (simulating Py/WeasyPrint).",
    generating: "Generating...",
    createReport: "Create Report",
    reportPlaceholder: "e.g. my-company.com",

    // Profile
    personalInfo: "Personal Information",
    changeAvatar: "Change Avatar",
    avatarFormats: "JPG, GIF or PNG. Max 1MB.",
    accountSecurity: "Account Security",
    currentPassword: "Current Password",
    newPassword: "New Password",
    minCharsHint: "Minimum 8 characters",
    savedOk: "Saved!",
    mustEnterCurrentPassword: "You must enter your current password to change it.",
    incorrectCurrentPassword: "Current password is incorrect.",
    newPasswordMinLength: "New password must be at least 8 characters.",

    // Preferences
    appearance: "Appearance",
    interfaceTheme: "Interface Theme",
    dark: "Dark",
    light: "Light",
    system: "System",
    notificationsAndAlerts: "Notifications & Alerts",
    uiNotifications: "UI Notifications",
    uiNotificationsDesc: "Show the notification bell on the dashboard.",
    emailAlerts: "Email Alerts",
    emailAlertsDesc: "Receive periodic email reports when scans complete.",

    // Notifications dropdown
    notificationsLabel: "Notifications",
    markAllRead: "Mark all read",
    noNotifications: "No notifications",

    // Profile page
    emailCannotChange: "Email cannot be changed",
    changePassword: "Change Password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    updatePassword: "Update Password",
    passwordUpdated: "Password updated",
    incorrectCurrentPassword: "Current password is incorrect",
    passwordsMismatch: "Passwords do not match",

    // Vulnerabilities page
    vulnDesc: "Summary of vulnerabilities detected across all scans.",
    totalFindings: "Total findings detected",
    topVulnerabilities: "Most frequent vulnerabilities",
    finding: "Finding",
    category: "Category",
    occurrences: "Occurrences",
    noVulnerabilities: "No vulnerabilities found!",
    scanToSeeVulns: "Run a scan from the Dashboard to see results here.",

    // SSL Monitor page
    sslDesc: "SSL/TLS status of scanned domains.",
    sslFinding: "SSL Result",
    scannedAt: "Scanned",
    noSSLData: "No SSL data yet.",
    scanToSeeSSL: "Run a scan from the Dashboard to see SSL status here.",
    valid: "Valid",
    warning: "Review",
    expired: "Issue",

    // Severities
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    info: "Info",

    // Categories
    catHeaders: "Headers",
    catSSL: "SSL/TLS",
    catConfig: "Configuration",
    catDeps: "Dependencies",
    catAI: "AI Inference",

    // Vulnerability Catalog (Translations for Scanner Findings)
    vulnCatalog: {
      "HSTS Not Enabled": {
        title: "HSTS Not Enabled",
        description: "The Strict-Transport-Security header was not found. Connections are not forced to HTTPS.",
        recommendation: "Enable HSTS. Add: Strict-Transport-Security: max-age=31536000; includeSubDomains",
      },
      "CSP Missing": {
        title: "CSP Missing",
        description: "Content-Security-Policy header is missing. Risk of XSS and injection attacks.",
        recommendation: "Implement a strict CSP policy.",
      },
      "Clickjacking Protection Missing": {
        title: "Clickjacking Protection Missing",
        description: "X-Frame-Options is not set. The site could be embedded in an iframe for clickjacking.",
        recommendation: "Set X-Frame-Options to DENY or SAMEORIGIN.",
      },
      "MIME Sniffing Protection Missing": {
        title: "MIME Sniffing Protection Missing",
        description: "X-Content-Type-Options is missing, allowing browser to sniff file types.",
        recommendation: "Set X-Content-Type-Options to nosniff.",
      },
      "Referrer Policy Missing": {
        title: "Referrer Policy Missing",
        description: "Referrer-Policy header not found. Leakage of referral info.",
        recommendation: "Set a clear Referrer-Policy.",
      },
      "XSS Protection Header Missing": {
        title: "XSS Protection Header Missing",
        description: "X-XSS-Protection header not found.",
        recommendation: "Enable XSS protection or use a strong CSP.",
      },
      "Unencrypted Connection": {
        title: "Unencrypted Connection",
        description: "The site is using plain HTTP.",
        recommendation: "Redirect all traffic to HTTPS.",
      },
      "SSL Certificate Expired": {
        title: "SSL Certificate Expired",
        description: "The certificate has expired.",
        recommendation: "Renew the SSL certificate immediately.",
      },
      "Server Information Disclosure": {
        title: "Server Information Disclosure",
        description: "Server version or technology is exposed in headers.",
        recommendation: "Disable server signature tokens.",
      },
      "Morpheus: Spear-Phishing Context Detection": {
        title: "Morpheus: Spear-Phishing Context Detection",
        description: "NVIDIA Triton applied BERT-based NLP analysis on the DOM. Found semantic similarity with phishing campaigns.",
        recommendation: "Block domain at DNS level and reset MFA.",
      },
      "Morpheus: Zero-Day Polymorphic Sequence": {
        title: "Morpheus: Zero-Day Polymorphic Sequence",
        description: "cuDF sequence analysis detected obfuscated JS attempting to bypass WAF signatures.",
        recommendation: "Isolate endpoint and export PCAP for deep analysis.",
      },
      "Morpheus: Algorithmic Domain Communication": {
        title: "Morpheus: Algorithmic Domain Communication",
        description: "Network graphs indicate background requests to a DGA pattern associated with Botnets.",
        recommendation: "Deploy strict egress filtering rules.",
      },
    }
  },
  es: {
    // Header & Navegación
    appName: "SecAudit",
    vulnerabilityDashboard: "Panel de Vulnerabilidades",
    searchPlaceholder: "Buscar escaneos...",

    // Menú Lateral
    mainMenu: "Menú Principal",
    dashboard: "Panel",
    scanHistory: "Historial",
    reports: "Reportes",
    security: "Seguridad",
    vulnerabilities: "Vulnerabilidades",
    sslMonitor: "Monitor SSL",
    infrastructure: "Infraestructura",
    settings: "Configuración",
    preferences: "Preferencias",
    myProfile: "Mi Perfil",
    logout: "Cerrar Sesión",
    dbViewer: "Visor SQLite",

    // Sección de Escaneo
    performSecurityAudit: "Realizar Auditoría de Seguridad",
    auditDescription:
      "Analiza cabeceras HTTP, SSL/TLS y configuraciones (Solo Análisis Pasivo)",
    enterWebsiteUrl: "Ingresa la URL del sitio (ej., ejemplo.com)",
    auditNow: "Auditar Ahora",
    scanning: "Escaneando...",

    // Tarjetas del Dashboard
    auditScoreTrend: "Tendencia de Puntuación",
    recentAudits: "Auditorías Recientes",
    viewAll: "Ver Todo",

    // Encabezados de Tabla
    targetUrl: "URL Objetivo",
    status: "Estado",
    score: "Puntuación",
    date: "Fecha",
    action: "Acción",

    // Estados
    completed: "COMPLETADO",
    processing: "PROCESANDO",
    failed: "FALLIDO",
    pending: "PENDIENTE",

    // Panel de Detalles
    viewDetails: "Ver Detalles",
    scanId: "ID de Escaneo",
    report: "Reporte",
    visit: "Visitar",
    findings: "Hallazgos",
    noScanSelected: "Ningún Escaneo Seleccionado",
    noScanSelectedDescription:
      "Selecciona una auditoría de la tabla para ver vulnerabilidades y soluciones detalladas.",
    noSecurityIssues:
      "¡No se encontraron problemas de seguridad! Buen trabajo.",
    recommendation: "Recomendación",

    // Mensajes
    loadingAudits: "Cargando auditorías...",
    noAuditsFound:
      "No se encontraron auditorías. ¡Inicia tu primer escaneo arriba!",
    loadingDetails: "Cargando detalles...",
    scanCompleted: "¡Escaneo completado exitosamente!",
    startingAudit: "Iniciando auditoría... Por favor espera.",
    scanFailed: "Error al iniciar el escaneo",

    // Auth & Settings
    signIn: "Iniciar Sesión",
    createAccount: "Crear Cuenta",
    password: "Contraseña",
    fullName: "Nombre Completo",
    rememberMe: "Recordarme",
    forgotPasswordQuestion: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes cuenta?",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    registerHere: "Regístrate",
    loginHere: "Inicia Sesión",
    joinSecAudit: "Únete a SecAudit",
    accessDashboard: "Accede al panel de SecAudit",
    authenticating: "Autenticando...",
    loginButton: "Ingresar",
    creatingAccount: "Creando...",
    registerButton: "Registrarse",
    passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
    incorrectCredentials: "Credenciales incorrectas.",
    recoverPassword: "Recuperar Contraseña",
    recoverDesc: "Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.",
    registeredEmail: "Email Registrado",
    sending: "Enviando...",
    sendLink: "Enviar Enlace",
    backToLogin: "Volver al Login",
    linkSent: "¡Enlace de recuperación enviado a",
    checkInbox: "! Revisa tu bandeja de entrada o spam.",

    // DB View & Prefs
    dbInspector: "Inspector SQLite",
    dbViewDesc: "Explora las tablas y registros en crudo de secaudit.db",
    refresh: "Refrescar",
    queryingDb: "Consultando base de datos...",
    table: "Tabla:",
    noData: "Sin datos",
    emptyTable: "La tabla está vacía.",
    dbError: "Error al leer la base de datos",
    general: "General",
    scanTimeout: "Timeout de Escaneo (segundos)",
    scannerDepth: "Profundidad del Scanner Python",
    depthFast: "Rápido (Passive Headers + SSL)",
    depthStandard: "Estándar (Rápido + Detección Config)",
    depthFull: "Completo (Añadir CVEs de OSV.dev)",
    sqliteDb: "Base de Datos SQLite",
    dbSize: "Tamaño de la BD",
    purgeHistory: "Purgar todos los historiales",
    saveChanges: "Guardar Cambios",
    masterNode: "Nodo Maestro",
    pythonScanner: "Escáner Python",
    goApiServer: "Servidor API Go",

    // Infrastructure
    infrastructureDesc: "Gestiona los nodos de SecAudit y los entornos Sandbox de Docker.",
    port: "Puerto",
    open: "Abrir",
    startNode: "Arrancar",
    stopNode: "Detener",

    // SSL Monitor
    sslMonitorDesc: "Vigila la caducidad y fortaleza de los certificados TLS.",
    domain: "Dominio",
    certificateAuthority: "Autoridad Certificadora",
    expiration: "Expiración",
    validSsl: "Válido",
    warningSsl: "Revisar",
    expiredSsl: "Caducado",

    // Vulnerabilities
    catHeaders: "Cabeceras HTTP",
    catCrypto: "Criptografía / SSL",
    catConfig: "Detección de Configs",
    catCves: "CVEs / Dependencias",
    vulnSummaryDesc: "Un resumen global de los tipos de vulnerabilidades encontradas en todos tus escaneos.",
    signatureCatalog: "Catálogo de Firmas",
    signatureCatalogDesc: "Aquí se mostrará el catálogo de todas las vulnerabilidades (CVEs y configuraciones inseguras) que el motor de Python es capaz de detectar.",

    // Reports
    reportsDesc: "Descarga los análisis detallados en PDF o HTML.",
    filter: "Filtrar",
    downloadReport: "Descargar Reporte (HTML)",
    reportGenerator: "Generador de Reportes",
    reportGeneratorDesc: "Exporta las auditorías activas a un documento interactivo HTML (simulando Py/WeasyPrint).",
    generating: "Generando...",
    createReport: "Crear Reporte",
    reportPlaceholder: "ej. mi-empresa.com",

    // Profile
    personalInfo: "Información Personal",
    changeAvatar: "Cambiar Avatar",
    avatarFormats: "JPG, GIF o PNG. Max 1MB.",
    accountSecurity: "Seguridad de la Cuenta",
    currentPassword: "Contraseña Actual",
    newPassword: "Nueva Contraseña",
    minCharsHint: "Mínimo 8 caracteres",
    savedOk: "¡Guardado!",
    mustEnterCurrentPassword: "Debes ingresar tu contraseña actual para cambiarla.",
    incorrectCurrentPassword: "Contraseña actual incorrecta.",
    newPasswordMinLength: "La nueva contraseña debe tener al menos 8 caracteres.",

    // Preferences
    appearance: "Apariencia",
    interfaceTheme: "Tema de la Interfaz",
    dark: "Oscuro",
    light: "Claro",
    system: "Sistema",
    notificationsAndAlerts: "Notificaciones y Alertas",
    uiNotifications: "Notificaciones Interfaz",
    uiNotificationsDesc: "Mostrar la campanita de notificaciones en el dashboard.",
    emailAlerts: "Alertas por Correo",
    emailAlertsDesc: "Recibir reportes periódicos al email cuando finalicen los escaneos.",

    // Notifications dropdown
    notificationsLabel: "Notificaciones",
    markAllRead: "Marcar leídas",
    noNotifications: "No hay notificaciones",

    // Página de Perfil
    emailCannotChange: "El email no se puede modificar",
    changePassword: "Cambiar Contraseña",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    updatePassword: "Actualizar Contraseña",
    passwordUpdated: "Contraseña actualizada",
    incorrectCurrentPassword: "La contraseña actual es incorrecta",
    passwordsMismatch: "Las contraseñas no coinciden",

    // Vulnerabilidades
    vulnDesc: "Resumen de vulnerabilidades detectadas en todos los escaneos.",
    totalFindings: "Total de hallazgos detectados",
    topVulnerabilities: "Vulnerabilidades más frecuentes",
    finding: "Hallazgo",
    category: "Categoría",
    occurrences: "Ocurrencias",
    noVulnerabilities: "¡Sin vulnerabilidades!",
    scanToSeeVulns: "Realiza un escaneo desde el Panel para ver resultados aquí.",

    // Monitor SSL
    sslDesc: "Estado SSL/TLS de los dominios escaneados.",
    sslFinding: "Resultado SSL",
    scannedAt: "Escaneado",
    noSSLData: "No hay datos SSL todavía.",
    scanToSeeSSL: "Realiza un escaneo desde el Panel para ver el estado SSL aquí.",
    valid: "Válido",
    warning: "Revisar",
    expired: "Problema",

    // Severidades
    critical: "Crítico",
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
    info: "Info",

    // Categorías
    catHeaders: "Cabeceras",
    catSSL: "SSL/TLS",
    catConfig: "Configuración",
    catDeps: "Dependencias",
    catAI: "Inferencia IA",

    // Catálogo de Vulnerabilidades (Traducciones para el motor de escaneo)
    vulnCatalog: {
      "HSTS Not Enabled": {
        title: "HSTS no habilitado",
        description: "No se encontró la cabecera Strict-Transport-Security. Las conexiones no se fuerzan a HTTPS.",
        recommendation: "Habilita HSTS. Añade: Strict-Transport-Security: max-age=31536000; includeSubDomains",
      },
      "CSP Missing": {
        title: "Falta CSP (Content-Security-Policy)",
        description: "Falta la cabecera CSP. Riesgo de ataques XSS e inyección de datos.",
        recommendation: "Implementa una política CSP estricta.",
      },
      "Clickjacking Protection Missing": {
        title: "Sin protección contra Clickjacking",
        description: "X-Frame-Options no está configurado. El sitio podría ser embebido en un iframe.",
        recommendation: "Configura X-Frame-Options a DENY o SAMEORIGIN.",
      },
      "MIME Sniffing Protection Missing": {
        title: "Falta protección de MIME Sniffing",
        description: "Falta X-Content-Type-Options, lo que permite al navegador adivinar tipos de archivo.",
        recommendation: "Configura X-Content-Type-Options a nosniff.",
      },
      "Referrer Policy Missing": {
        title: "Falta Referrer Policy",
        description: "No se encontró la cabecera Referrer-Policy. Filtrado de información de referencia.",
        recommendation: "Configura una Referrer-Policy clara.",
      },
      "XSS Protection Header Missing": {
        title: "Falta cabecera de protección XSS",
        description: "No se encontró la cabecera X-XSS-Protection.",
        recommendation: "Habilita la protección XSS o usa un CSP fuerte.",
      },
      "Unencrypted Connection": {
        title: "Conexión no cifrada",
        description: "El sitio está usando HTTP plano en lugar de HTTPS.",
        recommendation: "Redirige todo el tráfico a HTTPS.",
      },
      "SSL Certificate Expired": {
        title: "Certificado SSL Caducado",
        description: "El certificado de seguridad ha expirado.",
        recommendation: "Renueva el certificado SSL inmediatamente.",
      },
      "Server Information Disclosure": {
        title: "Exposición de información del servidor",
        description: "La versión o tecnología del servidor está expuesta en las cabeceras.",
        recommendation: "Desactiva los tokens de firma del servidor.",
      },
      "Morpheus: Spear-Phishing Context Detection": {
        title: "Morpheus: Detección de contexto Spear-Phishing",
        description: "Análisis NLP basado en BERT sobre el DOM. Similitud semántica con campañas conocidas de robo de credenciales.",
        recommendation: "Bloquea el dominio a nivel DNS y resetea el MFA de usuarios.",
      },
      "Morpheus: Zero-Day Polymorphic Sequence": {
        title: "Morpheus: Secuencia Polimórfica Zero-Day",
        description: "Análisis de secuencias cuDF detectó un payload JS ofuscado intentando evadir firmas WAF.",
        recommendation: "Aisla el equipo. Exporta el PCAP para análisis profundo con modelos de Ransomware.",
      },
      "Morpheus: Algorithmic Domain Communication": {
        title: "Morpheus: Comunicación de dominio algorítmico",
        description: "Grafos de red indican peticiones en segundo plano a un patrón DGA asociado con Botnets.",
        recommendation: "Despliega reglas estrictas de filtrado de salida.",
      },
    }
  },
  eu: {
    // Goiburua eta Nabigazioa
    appName: "SecAudit",
    vulnerabilityDashboard: "Ahultasunen Panela",
    searchPlaceholder: "Bilatu eskaneaketa...",

    // Alboko Menua
    mainMenu: "Menu Nagusia",
    dashboard: "Panela",
    scanHistory: "Historikoa",
    reports: "Txostenak",
    security: "Segurtasuna",
    vulnerabilities: "Ahultasunak",
    sslMonitor: "SSL Monitorea",
    infrastructure: "Azpiegitura",
    settings: "Ezarpenak",
    preferences: "Hobespenak",
    myProfile: "Nire Profila",
    logout: "Saioa Itxi",
    dbViewer: "SQLite Ikustailea",

    // Eskaneaketa Atala
    performSecurityAudit: "Segurtasun Auditoria Egin",
    auditDescription:
      "Aztertu HTTP goiburuak, SSL/TLS eta konfigurazioak (Analisi Pasiboa Soilik)",
    enterWebsiteUrl: "Sartu webgunearen URLa (adib., adibidea.com)",
    auditNow: "Auditatu Orain",
    scanning: "Eskaneatzen...",

    // Panelaren Txartelak
    auditScoreTrend: "Puntuazioaren Joera",
    recentAudits: "Azken Auditoriak",
    viewAll: "Ikusi Guztiak",

    // Taularen Goiburuak
    targetUrl: "Helburu URLa",
    status: "Egoera",
    score: "Puntuazioa",
    date: "Data",
    action: "Ekintza",

    // Egoerak
    completed: "OSATUTA",
    processing: "PROZESATZEN",
    failed: "HUTS EGIN DU",
    pending: "ZAIN",

    // Xehetasunen Panela
    viewDetails: "Ikusi Xehetasunak",
    scanId: "Eskaneaketa IDa",
    report: "Txostena",
    visit: "Bisitatu",
    findings: "Aurkikuntzak",
    noScanSelected: "Ez da Eskaneaketarik Hautatu",
    noScanSelectedDescription:
      "Hautatu auditoria bat taulatik ahultasunak eta konponketak ikusteko.",
    noSecurityIssues: "Ez da segurtasun arazorik aurkitu! Lan bikaina.",
    recommendation: "Gomendio",

    // Mezuak
    loadingAudits: "Auditoriak kargatzen...",
    noAuditsFound:
      "Ez da auditoria aurkitu. Hasi zure lehen eskaneaketa goian!",
    loadingDetails: "Xehetasunak kargatzen...",
    scanCompleted: "Eskaneaketa arrakastaz osatu da!",
    startingAudit: "Auditoria hasten... Itxaron mesedez.",
    scanFailed: "Errorea eskaneaketa hastean",

    // Auth & Settings
    signIn: "Hasi Saioa",
    createAccount: "Kontua Sortu",
    password: "Pasahitza",
    fullName: "Izen Osoa",
    rememberMe: "Gogoratu",
    forgotPasswordQuestion: "Pasahitza ahaztu duzu?",
    noAccount: "Ez duzu konturik?",
    alreadyHaveAccount: "Baduzu kontua?",
    registerHere: "Erregistratu",
    loginHere: "Hasi Saioa",
    joinSecAudit: "Batu SecAuditera",
    accessDashboard: "Sartu SecAudit panelera",
    authenticating: "Autentifikatzen...",
    loginButton: "Sartu",
    creatingAccount: "Sortzen...",
    registerButton: "Erregistratu",
    passwordMinLength: "Pasahitzak gutxienez 8 karaktere izan behar ditu",
    incorrectCredentials: "Egiazko okerrak.",
    recoverPassword: "Berreskuratu Pasahitza",
    recoverDesc: "Sartu helbide elektronikoa eta berrezartzeko esteka bidaliko dizugu.",
    registeredEmail: "Zure Posta Elektronikoa",
    sending: "Bidaltzen...",
    sendLink: "Bidali Esteka",
    backToLogin: "Itzuli Saio Harterat",
    linkSent: "Berreskuratze esteka bidalia hona: ",
    checkInbox: "! Egiaztatu sarrera ontzia edo spama.",

    // DB View & Prefs
    dbInspector: "SQLite Ikustailea",
    dbViewDesc: "Arakatu secaudit.db fitxategiko taula eta erregistroak",
    refresh: "Eguneratu",
    queryingDb: "Datu-basea kontsultatzen...",
    table: "Taula:",
    noData: "Daturik ez",
    emptyTable: "Taula hutsik dago.",
    dbError: "Errorea datu-basea irakurtzean",
    general: "Orokorra",
    scanTimeout: "Eskaneaketa Muga (segundoak)",
    scannerDepth: "Python Scanner Sakonera",
    depthFast: "Azkarra (Passive Headers + SSL)",
    depthStandard: "Estandarra (Azkarra + Config Detezioa)",
    depthFull: "Osoa (Gehitu OSV.dev CVEak)",
    sqliteDb: "SQLite Datu-basea",
    dbSize: "DB Tamaina",
    purgeHistory: "Garbitu historial guztiak",
    saveChanges: "Gorde Aldaketak",
    masterNode: "Nodo Maisua",
    pythonScanner: "Python Eskaner",
    goApiServer: "Go API Zerbitzaria",

    // Infrastructure
    infrastructureDesc: "Kudeatu SecAudit nodoak eta Docker Sandbox inguruneak.",
    port: "Portua",
    open: "Ireki",
    startNode: "Abiarazi",
    stopNode: "Gelditu",

    // SSL Monitor
    sslMonitorDesc: "Kontrolatu TLS ziurtagirien iraungitzea eta indarra.",
    domain: "Domeinua",
    certificateAuthority: "Ziurtagiri Agintaritza",
    expiration: "Iraungitzea",
    validSsl: "Baliozkoa",
    warningSsl: "Berrikusi",
    expiredSsl: "Iraungita",

    // Vulnerabilities
    catHeaders: "HTTP Goiburuak",
    catCrypto: "Kriptografia / SSL",
    catConfig: "Config Detezioa",
    catCves: "CVEak / Mendekotasunak",
    vulnSummaryDesc: "Zure eskaneatze guztietan aurkitutako ahultasun moten laburpen globala.",
    signatureCatalog: "Sinaduran Katalogoa",
    signatureCatalogDesc: "Hemen agertuko da Python motorrak detektatu ditzakeen ahultasun guztien katalogoa (CVEak eta konfigurazio ez-seguruak).",

    // Reports
    reportsDesc: "Deskargatu analisi xehatuak PDF edo HTML formatuan.",
    filter: "Iragazkia",
    downloadReport: "Deskargatu Txostena (HTML)",
    reportGenerator: "Txosten Sortzailea",
    reportGeneratorDesc: "Esportatu auditoriak HTML dokumentu interaktibo batera (Py/WeasyPrint simulatuz).",
    generating: "Sortzen...",
    createReport: "Txostena Sortu",
    reportPlaceholder: "adib. nire-enpresa.com",

    // Profile
    personalInfo: "Informazio Pertsonala",
    changeAvatar: "Aldatu Avatarra",
    avatarFormats: "JPG, GIF edo PNG. Max 1MB.",
    accountSecurity: "Kontuaren Segurtasuna",
    currentPassword: "Egungo Pasahitza",
    newPassword: "Pasahitz Berria",
    minCharsHint: "Gutxienez 8 karaktere",
    savedOk: "Gordeta!",
    mustEnterCurrentPassword: "Aldatzeko egungo pasahitza sartu behar duzu.",
    incorrectCurrentPassword: "Egungo pasahitza okerra da.",
    newPasswordMinLength: "Pasahitz berriak gutxienez 8 karaktere izan behar ditu.",

    // Preferences
    appearance: "Itxura",
    interfaceTheme: "Interfazearen Gaia",
    dark: "Iluna",
    light: "Argia",
    system: "Sistema",
    notificationsAndAlerts: "Jakinarazpenak eta Alertak",
    uiNotifications: "UI Jakinarazpenak",
    uiNotificationsDesc: "Erakutsi jakinarazpen-txirrina panelean.",
    emailAlerts: "Email Alertak",
    emailAlertsDesc: "Jaso aldizkako email txostenak eskaneatuak amaitutakoan.",

    // Notifications dropdown
    notificationsLabel: "Jakinarazpenak",
    markAllRead: "Irakurrita markatu",
    noNotifications: "Ez dago jakinarazpenik",

    // Profil orrialdea
    emailCannotChange: "Emaila ezin da aldatu",
    changePassword: "Pasahitza Aldatu",
    currentPassword: "Oraingo pasahitza",
    newPassword: "Pasahitz berria",
    confirmPassword: "Pasahitza berretsi",
    updatePassword: "Pasahitza Eguneratu",
    passwordUpdated: "Pasahitza eguneratua",
    incorrectCurrentPassword: "Oraingo pasahitza okerra da",
    passwordsMismatch: "Pasahitzak ez datoz bat",

    // Ahuleziak
    vulnDesc: "Eskaneatu guztietan detektatutako ahulezien laburpena.",
    totalFindings: "Detektatutako aurkikuntza guztira",
    topVulnerabilities: "Ahulezia ohikoenak",
    finding: "Aurkikuntza",
    category: "Kategoria",
    occurrences: "Agerpenak",
    noVulnerabilities: "Ez da ahuleziarik aurkitu!",
    scanToSeeVulns: "Egin eskaneatu bat Paneletik emaitzak hemen ikusteko.",

    // SSL Monitorea
    sslDesc: "Eskaneatutako domeinu-en SSL/TLS egoera.",
    sslFinding: "SSL Emaitza",
    scannedAt: "Eskaneatua",
    noSSLData: "Ez dago SSL daturik oraindik.",
    scanToSeeSSL: "Egin eskaneatu bat Paneletik SSL egoera hemen ikusteko.",
    valid: "Baliozkoa",
    warning: "Berrikusi",
    expired: "Arazoa",

    // Larritasuna
    critical: "Kritikoa",
    high: "Altua",
    medium: "Ertaina",
    low: "Baxua",
    info: "Info",

    // Kategoriak
    catHeaders: "Goiburuak",
    catSSL: "SSL/TLS",
    catConfig: "Konfigurazioa",
    catDeps: "Mendekotasunak",
    catAI: "AI Inferentzia",

    // Ahultasunen Katalogoa (Eskaner aurkikuntzen itzulpenak)
    vulnCatalog: {
      "HSTS Not Enabled": {
        title: "HSTS ez dago gaituta",
        description: "Ez da aurkitu Strict-Transport-Security goiburua. Konexioak ez dira HTTPSera behartzen.",
        recommendation: "Gaitu HSTS. Gehitu: Strict-Transport-Security: max-age=31536000; includeSubDomains",
      },
      "CSP Missing": {
        title: "CSP falta da",
        description: "Content-Security-Policy goiburua falta da. XSS eta injekzio erasotzeko arriskua.",
        recommendation: "Inplementatu CSP politika zorrotz bat.",
      },
      "Clickjacking Protection Missing": {
        title: "Clickjacking-aren aurkako babesik ez",
        description: "X-Frame-Options ez dago konfiguratuta. Webgunea iframe batean kapsulatu daiteke.",
        recommendation: "Ezarri X-Frame-Options DENY edo SAMEORIGIN moduan.",
      },
      "MIME Sniffing Protection Missing": {
        title: "MIME Sniffing babesa falta da",
        description: "X-Content-Type-Options falta da, nabigatzaileak fitxategi motak igartzea ahalbidetuz.",
        recommendation: "Ezarri X-Content-Type-Options nosniff gisa.",
      },
      "Referrer Policy Missing": {
        title: "Referrer Policy falta da",
        description: "Ez da aurkitu Referrer-Policy goiburua. Erreferentzia-informazioaren filtrazioa.",
        recommendation: "Konfiguratu Referrer-Policy argi bat.",
      },
      "XSS Protection Header Missing": {
        title: "XSS babes goiburua falta da",
        description: "Ez da aurkitu X-XSS-Protection goiburua.",
        recommendation: "Gaitu XSS babesa edo erabili CSP sendo bat.",
      },
      "Unencrypted Connection": {
        title: "Zifratu gabeko konexioa",
        description: "Webgunea HTTP arrunta erabiltzen ari da HTTPSren ordez.",
        recommendation: "Birbideratu trafiko guztia HTTPSera.",
      },
      "SSL Certificate Expired": {
        title: "SSL ziurtagiria iraungita",
        description: "Segurtasun ziurtagiria iraungitu egin da.",
        recommendation: "Berritu SSL ziurtagiria berehala.",
      },
      "Server Information Disclosure": {
        title: "Zerbitzariaren informazioa agerian",
        description: "Zerbitzariaren bertsioa edo teknologia goiburuetan agertzen da.",
        recommendation: "Desgaitu zerbitzariaren sinadura tokenak.",
      },
      "Morpheus: Spear-Phishing Context Detection": {
        title: "Morpheus: Spear-Phishing testuinguru detekzioa",
        description: "DOMaren gaineko NLP analisi BERTean oinarritua. Kredentzial-lapurreta kanpainekin antzekotasun semantikoa.",
        recommendation: "Blokeatu domeinua DNS mailan eta berrezarri erabiltzaileen MFA-a.",
      },
      "Morpheus: Zero-Day Polymorphic Sequence": {
        title: "Morpheus: Zero-Day sekuentzia polimorfikoa",
        description: "cuDF sekuentzia analisiak JS karga ofuskatu bat detektatu du WAF sinadurak saihestu nahian.",
        recommendation: "Isolatu ekipoa. Esportatu PCAPa Ransomware ereduekin analisi sakona egiteko.",
      },
      "Morpheus: Algorithmic Domain Communication": {
        title: "Morpheus: Domeinu komunikazio algoritmikoa",
        description: "Sare-grafoek Botnet-ekin lotutako DGA patroietara egindako atzeko planoko eskaerak adierazten dituzte.",
        recommendation: "Hedatu irteera-iragazki arau zorrotzak.",
      },
    }
  },
};
