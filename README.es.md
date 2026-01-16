# MCP PDF Reader

**Idiomas Disponibles:** [🇬🇧 English](README.md) | [🇪🇸 Español](README.es.md)

Un poderoso servidor **Model Context Protocol (MCP)** que capacita a asistentes de IA como Claude y GitHub Copilot para interactuar inteligentemente con documentos PDF. Extrae texto, metadatos, busca contenido y recupera imágenes incrustadas, todo a través de una interfaz estandarizada compatible con LLM.
No utiliza OCR.

**Versión Actual:** 1.0.0  
**Paquete:** `@rturv/mcp-pdf-reader`  
**Licencia:** MIT

## Inicio Rápido

### Instalación

```bash
npm install -g @rturv/mcp-pdf-reader
```

### Ejecutar el Servidor

```bash
mcp-pdf-reader
```

## Configuración

### Claude Desktop

Añade a `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

**Ubicación:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/claude/claude_desktop_config.json`

### GitHub Copilot (VS Code)

Añade a `mcpServers.json`:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader",
      "args": [],
      "disabled": false
    }
  }
}
```

**Ubicación:** `%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json`

Consulta [COPILOT_CONFIG.md](COPILOT_CONFIG.md) para métodos de instalación adicionales.

## Características

- ✅ **Extracción Completa de Texto** - Extrae texto completo de archivos PDF
- ✅ **Extracción de Metadatos** - Obtén título, autor, fecha de creación y más
- ✅ **Lectura de Rango de Páginas** - Extrae texto de páginas específicas
- ✅ **Búsqueda de Texto** - Encuentra texto con contexto circundante
- ✅ **Conteo de Páginas** - Obtén el número total de páginas
- ✅ **Extracción de Imágenes** - Lista y extrae imágenes incrustadas en Base64
- ✅ **Compatible con Estándares** - Sigue la especificación MCP para integración perfecta

## Referencia de Herramientas

Este servidor MCP expone 7 herramientas para manipulación integral de PDF. Todas las herramientas son accesibles desde Claude Desktop, GitHub Copilot y otros clientes compatibles con MCP.

### 1. `read_pdf`

**Propósito:** Extrae todo el contenido de texto de un archivo PDF. Úsalo como tu método principal para entender el contenido del documento.

**Cuándo usar:**
- Leer contenido completo del documento
- Obtener texto completo para resumen o análisis
- Extraer contenido cuando se combina con metadatos

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF",
  "includeMetadata": "boolean (opcional, por defecto: false) - Incluir metadatos en la respuesta"
}
```

**Ejemplo de Request:**
```json
{
  "filePath": "C:/Documentos/informe.pdf",
  "includeMetadata": true
}
```

**Ejemplo de Response:**
```json
{
  "text": "Resumen Ejecutivo\n\nEste informe detalla el desempeño de Q4 2025...",
  "metadata": {
    "title": "Informe de Desempeño Q4 2025",
    "author": "Equipo de Análisis",
    "subject": "Informe Trimestral",
    "creator": "Microsoft Word",
    "producer": "iLovePDF",
    "creationDate": "D:20250115120000Z",
    "modificationDate": "D:20250115150000Z",
    "keywords": "Q4, informe, desempeño",
    "totalPages": 12
  },
  "pageCount": 12
}
```

---

### 2. `get_pdf_metadata`

**Propósito:** Extrae metadatos del documento sin leer el texto completo. Ideal para inspección rápida.

**Cuándo usar:**
- Identificar propiedades del documento (autor, título, fechas)
- Validación rápida del documento
- Construcción de catálogos de documentos
- Verificar fechas de modificación

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF"
}
```

**Ejemplo de Request:**
```json
{
  "filePath": "C:/Documentos/contrato.pdf"
}
```

**Ejemplo de Response:**
```json
{
  "title": "Acuerdo de Servicios 2025",
  "author": "Departamento Legal",
  "subject": "Términos y Condiciones de Servicio",
  "creator": "Adobe InDesign",
  "producer": "Adobe PDF Library",
  "creationDate": "D:20250101090000Z",
  "modificationDate": "D:20250110140000Z",
  "keywords": "servicio, acuerdo, contrato",
  "totalPages": 8
}
```

---

### 3. `read_pdf_pages`

**Propósito:** Extrae texto de una página específica o rango de páginas. Úsalo para extracción dirigida.

**Cuándo usar:**
- Leer secciones específicas de un documento
- Analizar capítulos o páginas particulares
- Extraer portadas o reportes específicos dentro de un documento multi-parte
- Manejar PDFs grandes leyendo secciones

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF",
  "startPage": "number (requerido) - Número de página inicial (basado en 1)",
  "endPage": "number (opcional) - Número de página final. Si se omite, por defecto es startPage"
}
```

**Ejemplo de Request (página única):**
```json
{
  "filePath": "C:/Documentos/tesis.pdf",
  "startPage": 1
}
```

**Ejemplo de Request (rango de páginas):**
```json
{
  "filePath": "C:/Documentos/tesis.pdf",
  "startPage": 5,
  "endPage": 12
}
```

**Ejemplo de Response:**
```json
{
  "text": "Capítulo 2: Revisión de Literatura\n\nEste capítulo examina la investigación existente...",
  "startPage": 5,
  "endPage": 12,
  "totalPages": 45
}
```

---

### 4. `search_pdf`

**Propósito:** Busca texto dentro de un PDF y recupera todas las coincidencias con contexto.

**Cuándo usar:**
- Encontrar términos o frases específicas
- Localizar secciones por palabra clave
- Validar presencia de contenido
- Construcción de resúmenes basados en palabras clave
- Verificación de cumplimiento (encontrar cláusulas específicas)

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF",
  "searchTerm": "string (requerido) - Texto a buscar",
  "caseSensitive": "boolean (opcional, por defecto: false) - Búsqueda sensible a mayúsculas"
}
```

**Ejemplo de Request:**
```json
{
  "filePath": "C:/Documentos/politica.pdf",
  "searchTerm": "cláusula de terminación",
  "caseSensitive": false
}
```

**Ejemplo de Response:**
```json
[
  {
    "page": 3,
    "text": "cláusula de terminación",
    "context": "...cualquiera de las partes puede invocar la cláusula de terminación sin notificación previa escrita...",
    "position": 456
  },
  {
    "page": 7,
    "text": "cláusula de terminación",
    "context": "...De conformidad con la Sección 4.2, la cláusula de terminación entra en vigor...",
    "position": 1230
  }
]
```

---

### 5. `get_pdf_page_count`

**Propósito:** Obtén el número total de páginas en un PDF sin leer contenido.

**Cuándo usar:**
- Validar integridad del PDF
- Determinar si un PDF está vacío
- Planificar extracciones de rango de páginas
- Lógica de procesamiento por lotes basada en tamaño del documento

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF"
}
```

**Ejemplo de Request:**
```json
{
  "filePath": "C:/Documentos/manual.pdf"
}
```

**Ejemplo de Response:**
```json
{
  "pageCount": 247
}
```

---

### 6. `list_pdf_images`

**Propósito:** Lista todas las imágenes incrustadas en un PDF con sus metadatos y ubicaciones.

**Cuándo usar:**
- Descubrir imágenes incrustadas antes de la extracción
- Obtener dimensiones y tipos de imagen
- Planificar operaciones de extracción de imágenes
- Validar presencia de contenido visual

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF"
}
```

**Ejemplo de Request:**
```json
{
  "filePath": "C:/Documentos/presentacion.pdf"
}
```

**Ejemplo de Response:**
```json
{
  "images": [
    {
      "index": 0,
      "page": 2,
      "name": "Image42",
      "width": 800,
      "height": 600,
      "type": "JPEG"
    },
    {
      "index": 1,
      "page": 5,
      "name": "Image43",
      "width": 1024,
      "height": 768,
      "type": "PNG"
    },
    {
      "index": 2,
      "page": 8,
      "name": "Image44",
      "width": 640,
      "height": 480,
      "type": "TIFF"
    }
  ]
}
```

---

### 7. `extract_pdf_image`

**Propósito:** Extrae una imagen específica de un PDF y la devuelve como datos codificados en Base64.

**Cuándo usar:**
- Recuperar imágenes de PDFs
- Convertir imágenes de PDF a formatos estándar
- Procesar contenido visual para análisis
- Archivar imágenes incrustadas

**Antes de usar:** Primero llama a `list_pdf_images` para descubrir imágenes disponibles e índices.

**Parámetros de Entrada:**
```json
{
  "filePath": "string (requerido) - Ruta absoluta al archivo PDF",
  "imageIndex": "number (requerido) - Índice de imagen de list_pdf_images (basado en 0)"
}
```

**Ejemplo de Request:**
```json
{
  "filePath": "C:/Documentos/presentacion.pdf",
  "imageIndex": 0
}
```

**Ejemplo de Response:**
```json
{
  "index": 0,
  "page": 2,
  "name": "Image42",
  "width": 800,
  "height": 600,
  "type": "JPEG",
  "data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**Nota:** Los datos de imagen están codificados en Base64. Decodifica para guardar como archivo (ej: usando `atob()` en JavaScript o `base64 -d` en bash).

## Prueba con MCP Inspector

MCP Inspector es una herramienta interactiva para probar y depurar servidores MCP. Proporciona una interfaz web para invocar herramientas e inspeccionar respuestas en tiempo real.

### Instalación

```bash
npm install -g @modelcontextprotocol/inspector
```

### Ejecutar el Servidor con Inspector

1. **Inicia el servidor MCP en modo depuración:**
   ```bash
   mcp-pdf-reader
   ```

2. **En una terminal separada, lanza el Inspector:**
   ```bash
   mcp-inspector node dist/index.js
   ```

   O si usas el paquete npm global:
   ```bash
   mcp-inspector npx @rturv/mcp-pdf-reader
   ```

3. **Abre la interfaz web:** El Inspector proporcionará una URL (típicamente `http://localhost:5173`). Ábrela en tu navegador.

### Usar el Inspector

#### Ejemplo: Extraer texto de un PDF

1. En la interfaz del Inspector, busca la herramienta **`read_pdf`** en la barra lateral izquierda
2. Haz clic en ella para expandir la interfaz
3. Ingresa los parámetros:
   ```json
   {
     "filePath": "C:/ruta/a/tu/documento.pdf",
     "includeMetadata": true
   }
   ```
4. Haz clic en **"Call Tool"**
5. Ve la respuesta en el panel derecho

#### Ejemplo: Buscar texto

1. Selecciona la herramienta **`search_pdf`**
2. Ingresa parámetros:
   ```json
   {
     "filePath": "C:/ruta/a/tu/documento.pdf",
     "searchTerm": "palabra clave importante",
     "caseSensitive": false
   }
   ```
3. Haz clic en **"Call Tool"** y revisa los resultados de búsqueda con contexto

#### Ejemplo: Extraer una imagen

1. Primero, llama a **`list_pdf_images`** para descubrir imágenes:
   ```json
   {
     "filePath": "C:/ruta/a/tu/documento.pdf"
   }
   ```
2. Anota el índice de la imagen deseada (ej: `index: 0`)
3. Llama a **`extract_pdf_image`** con ese índice:
   ```json
   {
     "filePath": "C:/ruta/a/tu/documento.pdf",
     "imageIndex": 0
   }
   ```
4. La respuesta incluirá datos de imagen codificados en Base64 listos para decodificar y guardar

### Solución de Problemas del Inspector

- **Puerto ya en uso:** Cambia el puerto con `mcp-inspector --port 5174`
- **Conexión rechazada:** Asegúrate de que el servidor MCP está en ejecución antes de iniciar el Inspector
- **Herramienta no aparece:** Verifica la definición de la herramienta en `src/index.ts` y reconstruye con `npm run build`

---

## Desarrollo

### Compilar

```bash
npm run build
```

### Modo Observación

```bash
npm run dev
```

### Ejecutar Tests

```bash
npm test
```

**Nota:** Los tests requieren un PDF de ejemplo en `test-files/sample.pdf`. Crea uno o salta los tests dependientes de PDF.

### Observar Tests

```bash
npm run test:watch
```

### Estructura del Proyecto

```
mcp-pdf-reader/
├── src/
│   ├── index.ts              # Implementación del servidor MCP y definiciones de herramientas
│   ├── pdf-tools.ts          # Funciones principales de manipulación de PDF
│   ├── types.ts              # Interfaces y tipos TypeScript
│   └── __tests__/
│       └── pdf-tools.test.ts  # Tests unitarios
├── dist/                      # JavaScript compilado (generado)
├── test-files/                # Archivos PDF de prueba
├── package.json
├── tsconfig.json
└── README.md
```

### Stack de Tecnologías

- **@modelcontextprotocol/sdk** (^1.25.2) - Implementación del protocolo MCP
- **pdf-parse** (^2.4.5) - Extracción de texto PDF
- **pdf-lib** (^1.17.1) - Extracción de imágenes PDF
- **TypeScript** (^5.9.3) - Desarrollo con tipado estático
- **Jest** (^29.7.0) - Testing unitario

---

## Limitaciones

- **Sin OCR:** Solo extrae texto seleccionable de PDFs (no imágenes escaneadas)
- **PDFs basados en texto:** Funciona mejor con PDFs que contienen texto incrustado. Los documentos escaneados sin OCR no se pueden leer
- **Extracción de imágenes:** Solo formatos estándar (JPEG, PNG, TIFF)
- **Codificación Base64:** Todas las imágenes se devuelven como cadenas Base64; las imágenes grandes pueden resultar en respuestas grandes
- **Sin modificación de PDF:** Este servidor es de solo lectura; no puede editar ni crear PDFs

---

## Archivos de Configuración

- [CLAUDE_CONFIG.md](CLAUDE_CONFIG.md) - Guía de configuración de Claude Desktop
- [COPILOT_CONFIG.md](COPILOT_CONFIG.md) - Instrucciones de configuración de GitHub Copilot

---

## Licencia

MIT - Consulta el archivo LICENSE para detalles

## Repositorio

[github.com/rturv/mcp-pdf-reader](https://github.com/rturv/mcp-pdf-reader)
