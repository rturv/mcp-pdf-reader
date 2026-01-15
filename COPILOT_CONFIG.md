# Configuración del servidor MCP PDF Reader para GitHub Copilot en VS Code

Este documento explica cómo configurar el servidor MCP PDF Reader para usarlo con GitHub Copilot en Visual Studio Code.

## Requisitos previos

- Visual Studio Code instalado
- GitHub Copilot con soporte MCP habilitado
- Node.js instalado (v18 o superior)
- El proyecto compilado (`npm run build`)

## Paso 1: Compilar el proyecto

Antes de configurar, asegúrate de que el proyecto está compilado:

```bash
cd c:\Proyectos\2025\IA\mio\mcp-pdf-reader
npm install
npm run build
```

## Paso 2: Ubicar el archivo de configuración de VS Code

El archivo de configuración de MCP para VS Code se encuentra en:

**Windows:**
```
%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

Ruta completa típica:
```
C:\Users\[TU_USUARIO]\AppData\Roaming\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

**macOS:**
```
~/Library/Application Support/Code/User/globalStorage/github.copilot-chat/mcpServers.json
```

**Linux:**
```
~/.config/Code/User/globalStorage/github.copilot-chat/mcpServers.json
```

## Paso 3: Editar la configuración

Abre el archivo `mcpServers.json` (créalo si no existe) y añade la siguiente configuración:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": [
        "c:\\Proyectos\\2025\\IA\\mio\\mcp-pdf-reader\\dist\\index.js"
      ],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

### ⚠️ Notas importantes:

1. **Ruta absoluta**: Asegúrate de usar la ruta absoluta completa a tu archivo `dist/index.js`
2. **Barras invertidas**: En Windows, usa doble barra invertida `\\` o barras normales `/`
3. **Si ya tienes otros servidores MCP**, añade esta entrada dentro del objeto `mcpServers` existente:

```json
{
  "mcpServers": {
    "otro-servidor": {
      "command": "...",
      "args": ["..."]
    },
    "pdf-reader": {
      "command": "node",
      "args": [
        "c:\\Proyectos\\2025\\IA\\mio\\mcp-pdf-reader\\dist\\index.js"
      ],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## Paso 4: Reiniciar VS Code

Después de guardar la configuración, reinicia completamente Visual Studio Code para que los cambios surtan efecto.

## Paso 5: Verificar la instalación

1. Abre GitHub Copilot Chat en VS Code (Ctrl+Shift+I o Cmd+Shift+I)
2. Escribe un mensaje como: "Lista las herramientas MCP disponibles"
3. Deberías ver las 7 herramientas del servidor PDF Reader:
   - `read_pdf`
   - `get_pdf_metadata`
   - `read_pdf_pages`
   - `search_pdf`
   - `get_pdf_page_count`
   - `list_pdf_images`
   - `extract_pdf_image`

## Ejemplo de uso

Una vez configurado, puedes usar el servidor desde Copilot Chat:

```
"Lee el PDF en C:/Documents/documento.pdf"

"Extrae los metadatos del PDF en C:/Users/usuario/archivo.pdf"

"Busca la palabra 'contrato' en el PDF C:/contratos/legal.pdf"

"Lista las imágenes del PDF en C:/presentacion.pdf"

"Extrae la página 5 del PDF en C:/informe.pdf"
```

## Solución de problemas

### El servidor no aparece en Copilot

1. **Verifica la ruta**: Asegúrate de que la ruta al archivo `dist/index.js` es correcta
2. **Verifica la compilación**: Ejecuta `npm run build` de nuevo
3. **Revisa los logs**: Abre la consola de desarrollador en VS Code (Help > Toggle Developer Tools)
4. **Reinicia VS Code**: Cierra completamente VS Code y vuelve a abrirlo

### Error al ejecutar el servidor

1. **Node.js no encontrado**: Verifica que Node.js está en tu PATH
2. **Dependencias**: Ejecuta `npm install` en el directorio del proyecto
3. **Permisos**: Asegúrate de tener permisos de lectura en la carpeta del proyecto

### Las herramientas no responden

1. **Rutas de archivos**: Asegúrate de usar rutas absolutas al PDF
2. **Formato de ruta**: En Windows puedes usar `C:/ruta/archivo.pdf` o `C:\\ruta\\archivo.pdf`
3. **Archivo existe**: Verifica que el archivo PDF existe y tienes permisos de lectura

## Configuración alternativa (usando npm start)

Si prefieres, puedes configurar el servidor para que use `npm start`:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "npm",
      "args": [
        "start",
        "--prefix",
        "c:\\Proyectos\\2025\\IA\\mio\\mcp-pdf-reader"
      ],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## Herramientas disponibles

### 📄 Herramientas de texto
- **read_pdf**: Extrae todo el texto del PDF
- **get_pdf_metadata**: Obtiene metadatos (autor, título, fechas, etc.)
- **read_pdf_pages**: Lee páginas específicas o rangos
- **search_pdf**: Busca texto con contexto
- **get_pdf_page_count**: Cuenta las páginas

### 🖼️ Herramientas de imágenes
- **list_pdf_images**: Lista todas las imágenes con metadatos
- **extract_pdf_image**: Extrae una imagen en Base64

## Más información

- [Documentación completa](README.md)
- [Resumen del proyecto](SUMMARY.md)
- [Tests](src/__tests__/pdf-tools.test.ts)

---

**Versión**: 1.0.0  
**Última actualización**: 14 de enero de 2026
