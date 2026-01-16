# MCP PDF Reader

**Available Languages:** [🇬🇧 English](README.md) | [🇪🇸 Español](README.es.md)

A powerful **Model Context Protocol (MCP)** server that empowers AI assistants like Claude and GitHub Copilot to intelligently interact with PDF documents. Extract text, metadata, search content, and retrieve embedded images—all through a standardized, LLM-friendly interface.
Not OCR-based.

**Current Version:** 1.0.0  
**Package:** `@rturv/mcp-pdf-reader`  
**License:** MIT

## Quick Start

### Installation

```bash
npm install -g @rturv/mcp-pdf-reader
```

### Run the Server

```bash
mcp-pdf-reader
```

## Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pdf-reader": {
      "command": "mcp-pdf-reader"
    }
  }
}
```

**Location:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/claude/claude_desktop_config.json`

### GitHub Copilot (VS Code)

Add to `mcpServers.json`:

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

**Location:** `%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json`

See [COPILOT_CONFIG.md](COPILOT_CONFIG.md) for additional installation methods.

## Features

- ✅ **Full Text Extraction** - Extract complete text from PDF files
- ✅ **Metadata Extraction** - Retrieve title, author, creation date, and more
- ✅ **Page Range Reading** - Extract text from specific pages
- ✅ **Text Search** - Find text with surrounding context
- ✅ **Page Count** - Get total page count
- ✅ **Image Extraction** - List and extract embedded images in Base64
- ✅ **Standards Compliant** - Follows MCP specification for seamless LLM integration

## Tools Reference

This MCP server exposes 7 tools for comprehensive PDF manipulation. All tools are accessible through Claude Desktop, GitHub Copilot, and other MCP-compatible clients.

### 1. `read_pdf`

**Purpose:** Extract all text content from a PDF file. Use this as your primary method for understanding PDF document content.

**When to use:**
- Reading entire document content
- Getting full document text for summarization or analysis
- Extracting content when combined with metadata

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file",
  "includeMetadata": "boolean (optional, default: false) - Include PDF metadata in response"
}
```

**Example Request:**
```json
{
  "filePath": "C:/Documents/report.pdf",
  "includeMetadata": true
}
```

**Example Response:**
```json
{
  "text": "Executive Summary\n\nThis report details Q4 2025 performance...",
  "metadata": {
    "title": "Q4 2025 Performance Report",
    "author": "Analytics Team",
    "subject": "Quarterly Report",
    "creator": "Microsoft Word",
    "producer": "iLovePDF",
    "creationDate": "D:20250115120000Z",
    "modificationDate": "D:20250115150000Z",
    "keywords": "Q4, report, performance",
    "totalPages": 12
  },
  "pageCount": 12
}
```

---

### 2. `get_pdf_metadata`

**Purpose:** Extract document metadata without reading the full text. Ideal for quick document inspection.

**When to use:**
- Identifying document properties (author, title, dates)
- Quick document validation
- Building document catalogs
- Checking modification dates

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file"
}
```

**Example Request:**
```json
{
  "filePath": "C:/Documents/contract.pdf"
}
```

**Example Response:**
```json
{
  "title": "Service Agreement 2025",
  "author": "Legal Department",
  "subject": "Service Terms & Conditions",
  "creator": "Adobe InDesign",
  "producer": "Adobe PDF Library",
  "creationDate": "D:20250101090000Z",
  "modificationDate": "D:20250110140000Z",
  "keywords": "service, agreement, contract",
  "totalPages": 8
}
```

---

### 3. `read_pdf_pages`

**Purpose:** Extract text from a specific page or range of pages. Use this for targeted content extraction.

**When to use:**
- Reading specific sections of a document
- Analyzing particular chapters or pages
- Extracting cover pages or specific reports within a multi-part document
- Handling large PDFs by reading sections

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file",
  "startPage": "number (required) - Starting page number (1-indexed)",
  "endPage": "number (optional) - Ending page number. If omitted, defaults to startPage"
}
```

**Example Request (single page):**
```json
{
  "filePath": "C:/Documents/thesis.pdf",
  "startPage": 1
}
```

**Example Request (page range):**
```json
{
  "filePath": "C:/Documents/thesis.pdf",
  "startPage": 5,
  "endPage": 12
}
```

**Example Response:**
```json
{
  "text": "Chapter 2: Literature Review\n\nThis chapter examines existing research...",
  "startPage": 5,
  "endPage": 12,
  "totalPages": 45
}
```

---

### 4. `search_pdf`

**Purpose:** Search for text within a PDF and retrieve all matches with surrounding context.

**When to use:**
- Finding specific terms or phrases
- Locating sections by keyword
- Validating content presence
- Building keyword-based summaries
- Compliance checking (finding specific clauses)

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file",
  "searchTerm": "string (required) - Text to search for",
  "caseSensitive": "boolean (optional, default: false) - Case-sensitive search"
}
```

**Example Request:**
```json
{
  "filePath": "C:/Documents/policy.pdf",
  "searchTerm": "termination clause",
  "caseSensitive": false
}
```

**Example Response:**
```json
[
  {
    "page": 3,
    "text": "termination clause",
    "context": "...either party may invoke the termination clause without prior written notice...",
    "position": 456
  },
  {
    "page": 7,
    "text": "termination clause",
    "context": "...In accordance with Section 4.2, the termination clause becomes effective...",
    "position": 1230
  }
]
```

---

### 5. `get_pdf_page_count`

**Purpose:** Get the total number of pages in a PDF without reading content.

**When to use:**
- Validating PDF integrity
- Determining if a PDF is empty
- Planning page range extractions
- Batch processing logic based on document size

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file"
}
```

**Example Request:**
```json
{
  "filePath": "C:/Documents/manual.pdf"
}
```

**Example Response:**
```json
{
  "pageCount": 247
}
```

---

### 6. `list_pdf_images`

**Purpose:** List all images embedded in a PDF with their metadata and locations.

**When to use:**
- Discovering embedded images before extraction
- Getting image dimensions and types
- Planning image extraction operations
- Validating image content presence

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file"
}
```

**Example Request:**
```json
{
  "filePath": "C:/Documents/presentation.pdf"
}
```

**Example Response:**
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

**Purpose:** Extract a specific image from a PDF and return it as Base64-encoded data.

**When to use:**
- Recovering images from PDFs
- Converting PDF images to standard formats
- Processing visual content for analysis
- Archiving embedded images

**Before using:** Call `list_pdf_images` first to discover available images and their indices.

**Input Parameters:**
```json
{
  "filePath": "string (required) - Absolute path to the PDF file",
  "imageIndex": "number (required) - Image index from list_pdf_images (0-indexed)"
}
```

**Example Request:**
```json
{
  "filePath": "C:/Documents/presentation.pdf",
  "imageIndex": 0
}
```

**Example Response:**
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

**Note:** Image data is Base64 encoded. Decode it to save as a file (e.g., using `atob()` in JavaScript or `base64 -d` in bash).

## Testing with MCP Inspector

The MCP Inspector is an interactive tool for testing and debugging MCP servers. It provides a web-based UI to invoke tools and inspect responses in real-time.

### Installation

```bash
npm install -g @modelcontextprotocol/inspector
```

### Running the Server with Inspector

1. **Start the MCP server in debug mode:**
   ```bash
   mcp-pdf-reader
   ```

2. **In a separate terminal, launch the Inspector:**
   ```bash
   mcp-inspector node dist/index.js
   ```

   Or if using the global npm package:
   ```bash
   mcp-inspector npx @rturv/mcp-pdf-reader
   ```

3. **Open the web UI:** The Inspector will provide a URL (typically `http://localhost:5173`). Open it in your browser.

### Using the Inspector

#### Example: Extract text from a PDF

1. In the Inspector UI, find the **`read_pdf`** tool in the left sidebar
2. Click on it to expand the tool interface
3. Enter the parameters:
   ```json
   {
     "filePath": "C:/path/to/your/document.pdf",
     "includeMetadata": true
   }
   ```
4. Click **"Call Tool"**
5. View the response in the right panel

#### Example: Search for text

1. Select the **`search_pdf`** tool
2. Enter parameters:
   ```json
   {
     "filePath": "C:/path/to/your/document.pdf",
     "searchTerm": "important keyword",
     "caseSensitive": false
   }
   ```
3. Click **"Call Tool"** and review the search results with context

#### Example: Extract an image

1. First, call **`list_pdf_images`** to discover images:
   ```json
   {
     "filePath": "C:/path/to/your/document.pdf"
   }
   ```
2. Note the index of the image you want (e.g., `index: 0`)
3. Call **`extract_pdf_image`** with that index:
   ```json
   {
     "filePath": "C:/path/to/your/document.pdf",
     "imageIndex": 0
   }
   ```
4. The response will include Base64-encoded image data ready for decoding and saving

### Troubleshooting Inspector Issues

- **Port already in use:** Change the port with `mcp-inspector --port 5174`
- **Connection refused:** Ensure the MCP server is running before starting the Inspector
- **Tool not appearing:** Verify the tool definition in `src/index.ts` and rebuild with `npm run build`

---

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

**Note:** Tests require a sample PDF at `test-files/sample.pdf`. Create one or skip PDF-dependent tests.

### Watch Tests

```bash
npm run test:watch
```

### Project Structure

```
mcp-pdf-reader/
├── src/
│   ├── index.ts              # MCP server implementation & tool definitions
│   ├── pdf-tools.ts          # Core PDF manipulation functions
│   ├── types.ts              # TypeScript interfaces & types
│   └── __tests__/
│       └── pdf-tools.test.ts  # Unit tests
├── dist/                      # Compiled JavaScript (generated)
├── test-files/                # Test PDF files
├── package.json
├── tsconfig.json
└── README.md
```

### Technology Stack

- **@modelcontextprotocol/sdk** (^1.25.2) - MCP protocol implementation
- **pdf-parse** (^2.4.5) - PDF text extraction
- **pdf-lib** (^1.17.1) - PDF image extraction
- **TypeScript** (^5.9.3) - Type-safe development
- **Jest** (^29.7.0) - Unit testing

---

## Limitations

- **No OCR:** Only extracts selectable text from PDFs (not scanned images)
- **Text-based PDFs:** Works best with PDFs containing embedded text. Scanned documents without OCR cannot be read
- **Image extraction:** Standard formats only (JPEG, PNG, TIFF)
- **Base64 encoding:** All images are returned as Base64 strings; large images may result in large responses
- **No PDF modification:** This server is read-only; it cannot edit or create PDFs

---

## Configuration Files

- [CLAUDE_CONFIG.md](CLAUDE_CONFIG.md) - Claude Desktop configuration guide
- [COPILOT_CONFIG.md](COPILOT_CONFIG.md) - GitHub Copilot setup instructions

---

## License

MIT - See LICENSE file for details

## Repository

[github.com/rturv/mcp-pdf-reader](https://github.com/rturv/mcp-pdf-reader)
