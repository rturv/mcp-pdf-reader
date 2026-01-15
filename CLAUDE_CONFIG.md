# Configuración de MCP PDF Reader para Claude Desktop

Para usar este servidor MCP con Claude Desktop, añade esta configuración a tu archivo de configuración de Claude Desktop.

## Instalación

Primero, instala el paquete globalmente:

```bash
npm install -g @rturv/mcp-pdf-reader
```

## Configuración

### Windows

Archivo: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

### macOS/Linux

Archivo: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)  
Archivo: `~/.config/claude/claude_desktop_config.json` (Linux)

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

## Uso desde código fuente (desarrollo)

Si estás desarrollando o probando desde el código fuente:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": ["ruta/completa/a/mcp-pdf-reader/dist/index.js"]
    }
  }
}
```
> No olvides hacer npm build si vas a utilizar esta vía

## Verificación

Después de configurar:

1. Reinicia Claude Desktop
2. Verifica que el servidor MCP está conectado buscando indicadores de herramientas disponibles
3. Prueba con un comando como: "Lee el contenido del PDF en C:/ruta/a/documento.pdf"

## Herramientas disponibles

Una vez conectado, tendrás acceso a:
- `read_pdf`: Extraer todo el texto de un PDF (params: `path`)
- `get_pdf_metadata`: Obtener metadatos (título, autor, páginas, fechas)
- `read_pdf_pages`: Leer páginas específicas (params: `path`, `pages` como array o rango)
- `read_pdf_page`: Leer una sola página (params: `path`, `page`)
- `read_pdf_pages_with_positions`: Extraer texto con offsets/posiciones por palabra
- `search_pdf`: Buscar texto dentro del PDF (params: `path`, `query`, `maxResults`)
- `get_pdf_page_count`: Contar páginas (params: `path`)
- `get_pdf_outline`: Obtener tabla de contenidos / índice (bookmarks)
- `get_pdf_annotations`: Listar anotaciones y comentarios (params: `path`)
- `get_pdf_form_fields`: Obtener campos de formulario (AcroForm) y valores
- `extract_images`: Extraer imágenes incrustadas (devuelve base64 o rutas)
- `render_page_as_image`: Renderizar página a imagen (params: `path`, `page`, `format`, `dpi`)
- `split_pdf`: Dividir PDF por rango de páginas (params: `path`, `ranges`)
- `merge_pdfs`: Unir varios PDFs (params: `inputPaths`, `outputPath`)
- `rotate_pdf_pages`: Rotar páginas específicas (params: `path`, `pages`, `angle`)
- `summarize_pdf`: Generar resumen del contenido (params: `path`, `pages?`)
- `extract_tables`: Detectar y extraer tablas como CSV/JSON (params: `path`, `pages?`)
- `get_text_by_region`: Extraer texto de una región concreta de una página (params: `path`, `page`, `bbox`)
- `save_pdf_subset`: Guardar un subconjunto de páginas como nuevo PDF (params: `path`, `pages`, `outputPath`)
