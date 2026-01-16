# GitHub Copilot Configuration

This guide explains how to configure the MCP PDF Reader server to work with GitHub Copilot in Visual Studio Code.

## Prerequisites

- Visual Studio Code v1.79 or later
- GitHub Copilot extension with MCP support enabled
- Node.js v18 or higher
- npm or another package manager

## Installation

### Option 1: Global npm Installation (Recommended)

```bash
npm install -g @rturv/mcp-pdf-reader
```

### Option 2: From Source (Development)

```bash
git clone https://github.com/rturv/mcp-pdf-reader.git
cd mcp-pdf-reader
npm install
npm run build
```

## Configuration Steps

### Step 1: Locate Configuration File

Find the MCP configuration file for VS Code:

**Windows:**
```
%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

Typical full path:
```
C:\Users\YourUsername\AppData\Roaming\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

**macOS:**
```
~/Library/Application Support/Code/User/globalStorage/github.copilot-chat/mcpServers.json
```

**Linux:**
```
~/.config/Code/User/globalStorage/github.copilot-chat/mcpServers.json
```

> **Tip:** Use VS Code's file explorer or `Ctrl+K Ctrl+O` to navigate to the folder, or search for `mcpServers.json` in your file system.

### Step 2: Edit Configuration

Create or edit `mcpServers.json` and add the PDF Reader configuration.

#### Option A: Using npm Package (Recommended)

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader",
      "args": [],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

**Advantages:**
- No manual paths needed
- Updates with `npm update -g`
- Works across different systems

#### Option B: From Source (Development)

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-pdf-reader/dist/index.js"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

**Important:**
- Use the **absolute path** to `dist/index.js`
- After pulling updates, run `npm run build`
- Windows paths: Use forward slashes `/` or double backslashes `\\`

#### With Other MCP Servers

If you already have other MCP servers configured:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "pdf-reader": {
      "command": "mcp-pdf-reader",
      "args": [],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

### Step 3: Restart VS Code

Close VS Code completely and reopen it for the changes to take effect.

### Step 4: Verify Installation

1. Open Copilot Chat in VS Code (`Ctrl+Shift+I` or `Cmd+Shift+I`)
2. Send a message like: *"What PDF tools are available?"*
3. Copilot should list the 7 available tools
4. Try a test prompt: *"Read the file C:/path/to/test.pdf"*

**Expected Available Tools:**
- `read_pdf` - Extract full text
- `get_pdf_metadata` - Get document metadata
- `read_pdf_pages` - Extract specific page ranges
- `search_pdf` - Search for text with context
- `get_pdf_page_count` - Get total page count
- `list_pdf_images` - List embedded images
- `extract_pdf_image` - Extract specific images

## Usage Examples

### Example 1: Extract and Analyze

```
Prompt: "Read C:/Documents/research_paper.pdf and extract the key findings"

Result: Copilot will:
1. Call read_pdf with the file path
2. Parse the content
3. Identify and summarize key findings
```

### Example 2: Search for Content

```
Prompt: "Search for 'conclusion' in C:/Documents/thesis.pdf and show me the context"

Result: Copilot will:
1. Call search_pdf with the term "conclusion"
2. Return all matches with surrounding text
3. Present results in an organized format
```

### Example 3: Extract Metadata

```
Prompt: "Tell me who wrote C:/Documents/presentation.pdf and when it was created"

Result: Copilot will:
1. Call get_pdf_metadata
2. Return author, creation date, and other document info
```

### Example 4: Analyze Images

```
Prompt: "List all images in C:/Documents/annual_report.pdf and extract the first one"

Result: Copilot will:
1. Call list_pdf_images to get inventory
2. Call extract_pdf_image for the specific image
3. Present image details and Base64 data
```

### Example 5: Page Range Analysis

```
Prompt: "Read pages 10-15 of C:/Documents/manual.pdf and summarize"

Result: Copilot will:
1. Call read_pdf_pages with startPage: 10, endPage: 15
2. Summarize the extracted content
```

## Troubleshooting

### Server Not Appearing in Copilot

**Problem:** Tools don't show up  
**Solutions:**
1. Verify JSON syntax in `mcpServers.json` (use a JSON validator)
2. Check that the file path is correct (Option B users)
3. Ensure `npm install -g @rturv/mcp-pdf-reader` was successful
4. Completely close and reopen VS Code
5. Check VS Code logs: `Help > Toggle Developer Tools` (Ctrl+Shift+I in DevTools)

### Command Not Found Error

**Problem:** "mcp-pdf-reader: command not found"  
**Solutions:**
```bash
# Check npm global path
npm config get prefix

# Reinstall globally
npm install -g @rturv/mcp-pdf-reader

# Verify installation
which mcp-pdf-reader    # macOS/Linux
where mcp-pdf-reader    # Windows
```

### File Not Found / Access Denied

**Problem:** PDF file can't be read  
**Solutions:**
1. Use **absolute paths**, not relative paths
2. Verify the file exists and you have read permissions
3. On Windows: Use forward slashes `/` or double backslashes `\\` in paths
4. Example: `C:/Users/YourName/Documents/file.pdf` or `C:\\Users\\YourName\\Documents\\file.pdf`

### Copilot Doesn't Call the Tools

**Problem:** Copilot doesn't use the PDF tools  
**Solutions:**
1. Explicitly ask Copilot to use a tool: *"Use the read_pdf tool to..."*
2. Provide full file paths in your prompts
3. Be specific about what you want extracted
4. Check VS Code output: `View > Output` and select "GitHub Copilot"

### Invalid Configuration Error

**Problem:** Error message about invalid JSON  
**Solutions:**
1. Validate JSON syntax (use jsonlint.com or VS Code built-in)
2. Check for missing commas or quotes
3. Ensure all strings are quoted with double quotes `"`
4. Verify no trailing commas in objects/arrays

## Advanced Configuration

### Disable/Enable Server

Temporarily disable the server without removing it:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader",
      "disabled": true
    }
  }
}
```

Set `"disabled": false` to re-enable.

### Always Allow Permissions

Some Copilot versions may ask for permission to use MCP tools. To skip confirmation:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader",
      "alwaysAllow": ["*"]
    }
  }
}
```

### Custom Server Name

You can give the server a different name in your configuration:

```json
{
  "mcpServers": {
    "my-pdf-tool": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

## Available Tools Detailed

| Tool | Purpose | Main Parameters |
|------|---------|-----------------|
| `read_pdf` | Extract all text | `filePath`, `includeMetadata` |
| `get_pdf_metadata` | Get document info | `filePath` |
| `read_pdf_pages` | Extract page range | `filePath`, `startPage`, `endPage` |
| `search_pdf` | Find text | `filePath`, `searchTerm`, `caseSensitive` |
| `get_pdf_page_count` | Count pages | `filePath` |
| `list_pdf_images` | Discover images | `filePath` |
| `extract_pdf_image` | Get image data | `filePath`, `imageIndex` |

See [Tools Reference](README.md#tools-reference) for complete documentation.

## Related Documentation

- [Main README](README.md) - Complete project documentation
- [Tools Reference](README.md#tools-reference) - Detailed tool documentation
- [Testing with MCP Inspector](README.md#testing-with-mcp-inspector) - Debug and test tools
- [Claude Configuration](CLAUDE_CONFIG.md) - Setup for Claude Desktop

## Version & Support

**Current Version:** 1.0.0  
**Package:** `@rturv/mcp-pdf-reader`  
**Repository:** [github.com/rturv/mcp-pdf-reader](https://github.com/rturv/mcp-pdf-reader)  
**Issues:** [Report bugs here](https://github.com/rturv/mcp-pdf-reader/issues)
