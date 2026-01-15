#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import {
  extractTextFromPDF,
  extractMetadata,
  extractTextFromPages,
  searchInPDF,
  getPageCount,
  listPDFImages,
  extractPDFImage,
} from './pdf-tools.js';
import type { PageRange } from './types.js';

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'read_pdf',
    description: 'Extract all text content from a PDF file',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
        includeMetadata: {
          type: 'boolean',
          description: 'Whether to include PDF metadata in the response',
          default: false,
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'get_pdf_metadata',
    description: 'Extract metadata information from a PDF file (title, author, creation date, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'read_pdf_pages',
    description: 'Extract text from specific pages or page range in a PDF',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
        startPage: {
          type: 'number',
          description: 'Starting page number (1-indexed)',
        },
        endPage: {
          type: 'number',
          description: 'Ending page number (optional, defaults to startPage)',
        },
      },
      required: ['filePath', 'startPage'],
    },
  },
  {
    name: 'search_pdf',
    description: 'Search for text in a PDF and return all matches with context',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
        searchTerm: {
          type: 'string',
          description: 'Text to search for in the PDF',
        },
        caseSensitive: {
          type: 'boolean',
          description: 'Whether the search should be case sensitive',
          default: false,
        },
      },
      required: ['filePath', 'searchTerm'],
    },
  },
  {
    name: 'get_pdf_page_count',
    description: 'Get the total number of pages in a PDF file',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'list_pdf_images',
    description: 'List all images embedded in a PDF file with their metadata (page, dimensions, type)',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'extract_pdf_image',
    description: 'Extract a specific image from a PDF by its index (use list_pdf_images to get available indices)',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
        imageIndex: {
          type: 'number',
          description: 'Index of the image to extract (0-based, from list_pdf_images)',
        },
      },
      required: ['filePath', 'imageIndex'],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: 'mcp-pdf-reader',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'read_pdf': {
        const { filePath, includeMetadata } = args as {
          filePath: string;
          includeMetadata?: boolean;
        };
        
        const result = await extractTextFromPDF(filePath);
        
        if (includeMetadata) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: result.text,
            },
          ],
        };
      }

      case 'get_pdf_metadata': {
        const { filePath } = args as { filePath: string };
        const metadata = await extractMetadata(filePath);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metadata, null, 2),
            },
          ],
        };
      }

      case 'read_pdf_pages': {
        const { filePath, startPage, endPage } = args as {
          filePath: string;
          startPage: number;
          endPage?: number;
        };
        
        const pageRange: PageRange = {
          start: startPage,
          end: endPage ?? undefined,
        };
        
        const text = await extractTextFromPages(filePath, pageRange);
        
        return {
          content: [
            {
              type: 'text',
              text,
            },
          ],
        };
      }

      case 'search_pdf': {
        const { filePath, searchTerm, caseSensitive } = args as {
          filePath: string;
          searchTerm: string;
          caseSensitive?: boolean;
        };
        
        const results = await searchInPDF(filePath, searchTerm, caseSensitive);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_pdf_page_count': {
        const { filePath } = args as { filePath: string };
        const pageCount = await getPageCount(filePath);
        
        return {
          content: [
            {
              type: 'text',
              text: `Total pages: ${pageCount}`,
            },
          ],
        };
      }

      case 'list_pdf_images': {
        const { filePath } = args as { filePath: string };
        const images = await listPDFImages(filePath);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                totalImages: images.length,
                images: images.map(img => ({
                  index: img.index,
                  page: img.page,
                  name: img.name,
                  dimensions: `${img.width}x${img.height}`,
                  type: img.type,
                })),
              }, null, 2),
            },
          ],
        };
      }

      case 'extract_pdf_image': {
        const { filePath, imageIndex } = args as { 
          filePath: string; 
          imageIndex: number;
        };
        const image = await extractPDFImage(filePath, imageIndex);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                index: image.index,
                page: image.page,
                name: image.name,
                width: image.width,
                height: image.height,
                type: image.type,
                dataSize: image.data.length,
                data: image.data, // Base64 encoded image
                note: 'Image data is Base64 encoded. Decode to save as file.',
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP PDF Reader server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
