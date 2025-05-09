# Chronos MCP Server - Project Architecture

This document provides an overview of the Chronos MCP server architecture and how the Docker setup integrates with it.

## Project Overview

Chronos is a Model Context Protocol (MCP) server tailored for the Stellar blockchain. It enables AI assistants like Claude to interact with the Stellar network through a standardized interface.

## Architecture Components

### Core Components

1. **MCP Server Implementation**
   - Uses `@modelcontextprotocol/sdk` to implement the MCP server
   - Communicates via stdio (standard input/output) with clients like Claude Desktop
   - Handles tool registration, request parsing, and response formatting

2. **Stellar Integration**
   - Uses `@stellar/stellar-sdk` to interact with the Stellar blockchain
   - Connects to the Stellar mainnet via Horizon API
   - Manages wallet operations, token listing, balance queries, and fund transfers

3. **Tools Implementation**
   - `connect_wallet`: Connects to a Stellar wallet using a secret key
   - `list_tokens`: Lists all tokens in a Stellar wallet
   - `get_balances`: Gets balances for all tokens in a wallet
   - `transfer_funds`: Transfers funds to another Stellar wallet

### Project Structure

```
chronos-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript output
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── docker-usage.md       # Docker usage documentation
├── package.json          # Project metadata and dependencies
└── tsconfig.json         # TypeScript configuration
```

## Docker Integration

The Docker setup for Chronos MCP is designed to provide a consistent, isolated environment for running the server. It follows a multi-stage build approach to optimize the final image size and security.

### Docker Architecture

1. **Build Stage**
   - Uses Node.js Alpine as the base image
   - Installs all dependencies (including development dependencies)
   - Compiles TypeScript code to JavaScript
   - Outputs to the `/app/build` directory

2. **Production Stage**
   - Uses Node.js Alpine as the base image
   - Installs only production dependencies
   - Copies the compiled code from the build stage
   - Runs as a non-root user for security
   - Configures proper signal handling

3. **Docker Compose Setup**
   - Defines a service for the Chronos MCP server
   - Configures environment variables
   - Sets up stdio communication
   - Creates a dedicated network
   - Provides restart policies

### Security Considerations

- The Docker container runs as a non-root user (`chronos`)
- Sensitive information is passed via environment variables
- The `.dockerignore` file prevents unnecessary files from being included
- Multi-stage builds reduce attack surface and image size

## Runtime Flow

1. The Docker container starts the Node.js application
2. The MCP server initializes and registers available tools
3. The server listens on stdio for incoming requests
4. When a request is received, it's parsed and routed to the appropriate handler
5. The handler interacts with the Stellar blockchain as needed
6. The response is formatted and sent back via stdio
7. The client (e.g., Claude Desktop) receives and processes the response

## Integration with Claude Desktop

Claude Desktop can be configured to use the Dockerized Chronos MCP server by updating the configuration to use Docker commands instead of direct Node.js commands.

## Extensibility

The architecture is designed to be extensible:
- New tools can be added by implementing handlers and schemas
- The Docker setup can be customized for different deployment scenarios
- Environment variables can be used to configure behavior

## Conclusion

The Chronos MCP server architecture, combined with the Docker setup, provides a robust, secure, and portable solution for integrating Stellar blockchain capabilities with AI assistants through the Model Context Protocol.
