# Cloudflare Workers Example

This example demonstrates RxJS marble diagrams with both static SVG rendering and realtime WebSocket visualization.

## Prerequisites

Before running this example, make sure to build the svg-marbles library:

```bash
# From the root directory
cd ../..
npm install
npm run build
```

This creates the browser bundle that the WebSocket example uses.

## Setup

```bash
bun install
```

## Development

```bash
# Run the development server
bun dev

# In another terminal, run the WebSocket server for local testing
bun run ../../examples/websocket-server-bun.ts
```

## Features

- **Static marble diagrams** - Visit `/` to see RxJS operations visualized as SVG
- **Realtime WebSocket visualization** - Visit `/realtime` to see live Observable streams
- **Tailwind CSS styling** - Dark theme with responsive design
- **TypeScript + JSX** - Type-safe development with Hono JSX

## Routes

- `/` - Static marble diagram examples
- `/realtime` - Realtime WebSocket marble visualization
- `/ws` - WebSocket endpoint (using Cloudflare Workers WebSocketPair API)
- `/api/streams` - REST API for available Observable streams