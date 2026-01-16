# Claude Desktop Configuration

This guide explains how to configure the MCP PDF Reader server to work with Claude Desktop.

## Prerequisites

- Claude Desktop installed ([download here](https://claude.ai/download))
- Node.js v18 or higher
- npm or another package manager

## Installation

### Global Installation (Recommended)

```bash
npm install -g @rturv/mcp-pdf-reader
```

### From Source (Development)

```bash
git clone https://github.com/rturv/mcp-pdf-reader.git
cd mcp-pdf-reader
npm install
npm run build
```

## Configuration

### Step 1: Locate Configuration File

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/claude/claude_desktop_config.json
```

### Step 2: Add Configuration

Open your `claude_desktop_config.json` file and add the PDF Reader server:

#### Option A: Using npm Package (Recommended)

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

#### Option B: From Source (Development)

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-pdf-reader/dist/index.js"]
    }
  }
}
```

**Important:** Use the absolute path to `dist/index.js`. After cloning/pulling changes, run `npm run build`.

### Step 3: Restart Claude Desktop

Close and completely reopen Claude Desktop for changes to take effect.

## Verification

1. Open Claude Desktop
2. Start a new conversation
3. You should see a **Tools** icon or indicator showing available tools
4. Try a prompt like: *"List the available PDF tools"*

Expected tools (if configured correctly):
- `read_pdf` - Extract full text
- `get_pdf_metadata` - Get document metadata
- `read_pdf_pages` - Extract specific page ranges
- `search_pdf` - Search for text with context
- `get_pdf_page_count` - Get total page count
- `list_pdf_images` - List embedded images
- `extract_pdf_image` - Extract images as Base64

## Usage Examples

### Example 1: Extract Full Document

```
Prompt: Read the entire PDF at C:/Documents/report.pdf and provide a summary
```

Claude will:
1. Call `read_pdf` with `filePath: "C:/Documents/report.pdf"`
2. Receive the full text
3. Provide a summary and analysis

### Example 2: Search for Specific Content

```
Prompt: Search for the word "deadline" in C:/Documents/contract.pdf and show me all matches
```

Claude will:
1. Call `search_pdf` with the search term
2. Return all occurrences with context
3. Highlight important sections

### Example 3: Extract Metadata and Images

```
Prompt: Get the metadata from C:/Documents/presentation.pdf and tell me what images it contains
```

Claude will:
1. Call `get_pdf_metadata`
2. Call `list_pdf_images`
3. Present the document's properties and image inventory

## Troubleshooting

### Server Not Appearing

**Problem:** Tools don't show up in Claude Desktop  
**Solution:**
1. Verify the configuration file syntax is valid JSON
2. Check that the file path to `mcp-pdf-reader` or `dist/index.js` is correct
3. Restart Claude Desktop completely (close and reopen)
4. If using source code: ensure you've run `npm run build`

### File Path Errors

**Problem:** "Failed to read PDF" or file not found errors  
**Solution:**
- Use **absolute paths** (e.g., `C:/Users/YourName/Documents/file.pdf`)
- On macOS/Linux, use forward slashes `/` in paths
- On Windows, backslashes `\\` work but forward slashes `/` are more reliable in MCP

### Permission Denied

**Problem:** Server installed but command not found  
**Solution:**
```bash
# Verify npm global path
npm config get prefix

# If not in PATH, add it or reinstall
npm install -g @rturv/mcp-pdf-reader
```

## Advanced Configuration

### Multiple MCP Servers

If you have other MCP servers configured, add this alongside them:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "..."
    },
    "pdf-reader": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

### Custom Aliases

You can customize the server name:

```json
{
  "mcpServers": {
    "my-pdf-tool": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

Then refer to it as "my-pdf-tool" in your prompts.

## Further Documentation

- [Main README](README.md) - General project documentation
- [Tools Reference](README.md#tools-reference) - Detailed tool documentation
- [Testing with MCP Inspector](README.md#testing-with-mcp-inspector) - Debugging and testing

## Support

For issues, bugs, or feature requests, visit:
[github.com/rturv/mcp-pdf-reader/issues](https://github.com/rturv/mcp-pdf-reader/issues)
