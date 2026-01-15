# Configuración de MCP PDF Reader para Claude Desktop

Para usar este servidor MCP con Claude Desktop, añade esta configuración a tu archivo de configuración de Claude Desktop.

## Windows

Archivo: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": ["C:/Proyectos/2025/IA/mio/mcp-pdf-reader/dist/index.js"]
    }
  }
}
```

## macOS/Linux

Archivo: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)  
Archivo: `~/.config/claude/claude_desktop_config.json` (Linux)

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": ["/ruta/completa/a/mcp-pdf-reader/dist/index.js"]
    }
  }
}
```

## Verificación

Después de configurar:

1. Reinicia Claude Desktop
2. Verifica que el servidor MCP está conectado buscando indicadores de herramientas disponibles
3. Prueba con un comando como: "Lee el contenido del PDF en C:/ruta/a/documento.pdf"

## Herramientas disponibles

Una vez conectado, tendrás acceso a:
- `read_pdf`: Extraer todo el texto de un PDF
- `get_pdf_metadata`: Obtener metadatos
- `read_pdf_pages`: Leer páginas específicas
- `search_pdf`: Buscar texto en el PDF
- `get_pdf_page_count`: Contar páginas
