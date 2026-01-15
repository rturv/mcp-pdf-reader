# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-15

### Added
- Initial public release
- PDF text extraction with `read_pdf` tool
- PDF metadata extraction with `get_pdf_metadata` tool
- Page-specific reading with `read_pdf_pages` tool
- Text search functionality with `search_pdf` tool
- Page count retrieval with `get_pdf_page_count` tool
- Image listing with `list_pdf_images` tool
- Image extraction in Base64 with `extract_pdf_image` tool
- Support for MCP (Model Context Protocol)
- Compatible with GitHub Copilot and Claude Desktop
- Full TypeScript support
- Comprehensive test suite

### Dependencies
- @modelcontextprotocol/sdk: ^1.25.2
- pdf-parse: ^2.4.5
- pdf-lib: ^1.17.1

[1.0.0]: https://github.com/rturv/mcp-pdf-reader/releases/tag/v1.0.0
