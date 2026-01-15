# MCP PDF Reader

Un servidor MCP (Model Context Protocol) para leer y extraer información de archivos PDF.

## Características

- 📄 Extracción completa de texto de PDFs
- 📊 Extracción de metadatos (título, autor, fechas, etc.)
- 📖 Lectura de páginas específicas
- 🔍 Búsqueda de texto con contexto
- 📏 Conteo de páginas

## Instalación

```bash
npm install
npm run build
```

## Uso

### Como servidor MCP independiente

```bash
npm start
```

### Configuración en Claude Desktop

Añade esto a tu archivo de configuración de Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": ["C:/ruta/completa/a/mcp-pdf-reader/dist/index.js"]
    }
  }
}
```

## Herramientas disponibles

### 1. `read_pdf`
Extrae todo el texto de un archivo PDF.

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF
- `includeMetadata` (boolean, opcional): Incluir metadatos en la respuesta

**Ejemplo:**
```json
{
  "filePath": "C:/documentos/archivo.pdf",
  "includeMetadata": true
}
```

### 2. `get_pdf_metadata`
Extrae solo los metadatos del PDF.

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF

**Retorna:** Objeto JSON con metadatos (título, autor, fechas, etc.)

### 3. `read_pdf_pages`
Extrae texto de páginas específicas.

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF
- `startPage` (number, requerido): Página inicial (base 1)
- `endPage` (number, opcional): Página final (por defecto: startPage)

**Ejemplo:**
```json
{
  "filePath": "C:/documentos/archivo.pdf",
  "startPage": 1,
  "endPage": 5
}
```

### 4. `search_pdf`
Busca un término en el PDF y devuelve coincidencias con contexto.

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF
- `searchTerm` (string, requerido): Texto a buscar
- `caseSensitive` (boolean, opcional): Búsqueda sensible a mayúsculas (por defecto: false)

**Retorna:** Array de resultados con página, texto, contexto y posición.

### 5. `get_pdf_page_count`
Obtiene el número total de páginas del PDF.

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF

### 6. `list_pdf_images`
Lista todas las imágenes incrustadas en el PDF con sus metadatos.

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF

**Retorna:**
```json
{
  "totalImages": 1,
  "images": [
    {
      "index": 0,
      "page": 6,
      "name": "Image37",
      "dimensions": "599x898",
      "type": "JPEG"
    }
  ]
}
```

### 7. `extract_pdf_image`
Extrae una imagen específica del PDF por su índice (usa `list_pdf_images` para obtener los índices disponibles).

**Parámetros:**
- `filePath` (string, requerido): Ruta absoluta al archivo PDF
- `imageIndex` (number, requerido): Índice de la imagen a extraer (base 0)

**Retorna:**
```json
{
  "index": 0,
  "page": 6,
  "name": "Image37",
  "width": 599,
  "height": 898,
  "type": "JPEG",
  "dataSize": 84468,
  "data": "base64encodedimagedata...",
  "note": "Image data is Base64 encoded. Decode to save as file."
}
```

## Desarrollo

### Compilar el proyecto

```bash
npm run build
```

### Modo desarrollo (watch)

```bash
npm run dev
```

### Ejecutar tests

```bash
npm test
```

**Nota:** Para ejecutar los tests completamente, necesitas proporcionar un archivo PDF de prueba en `test-files/sample.pdf`.

### Ejecutar tests en modo watch

```bash
npm run test:watch
```

## Estructura del proyecto

```
mcp-pdf-reader/
├── src/
│   ├── __tests__/           # Tests unitarios
│   │   └── pdf-tools.test.ts
│   ├── index.ts             # Servidor MCP principal
│   ├── pdf-tools.ts         # Funciones de lectura de PDF
│   └── types.ts             # Definiciones de tipos TypeScript
├── test-files/              # PDFs de prueba
├── dist/                    # Código compilado
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Tecnologías utilizadas

- **@modelcontextprotocol/sdk**: SDK para el protocolo MCP
- **pdf-parse**: Librería para parsear archivos PDF (texto)
- **pdf-lib**: Librería para manipulación de PDFs (imágenes)
- **TypeScript**: Lenguaje de programación con tipado estático
- **Jest**: Framework de testing

## Limitaciones

- No incluye OCR (reconocimiento óptico de caracteres)
- Funciona mejor con PDFs bien formados que contienen texto seleccionable
- La extracción de imágenes funciona con formatos estándar (JPEG, PNG, TIFF)
- Las imágenes se devuelven en formato Base64

## Licencia

ISC
