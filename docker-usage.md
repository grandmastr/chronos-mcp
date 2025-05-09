# Docker Setup for Chronos MCP

This document explains how to use Docker with the Chronos MCP server.

## Prerequisites

- Docker installed on your system
- Git (to clone the repository)

## Building the Docker Image

To build the Docker image for Chronos MCP, run the following command from the project root:

```bash
docker build -t chronos-mcp .
```

This will create a Docker image named `chronos-mcp` using the multi-stage build process defined in the Dockerfile.

## Running the Container

Since Chronos MCP is designed to be used with Claude Desktop or other MCP clients, you'll need to run it in a way that allows for stdio communication.

### Basic Usage

```bash
docker run -it --rm chronos-mcp
```

This will start the Chronos MCP server in interactive mode, allowing it to communicate via stdio.

### With Environment Variables

To provide a Stellar secret key or other environment variables:

```bash
docker run -it --rm -e STELLAR_SECRET_KEY=your_secret_key chronos-mcp
```

### Integration with Claude Desktop

To use the Docker container with Claude Desktop, update your Claude Desktop configuration file to use Docker:

```json
{
  "mcpServers": {
    "stellar": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "chronos-mcp"],
      "env": {
        "STELLAR_NETWORK": "mainnet"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Docker Compose (Optional)

For more complex setups, you can use Docker Compose. Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  chronos-mcp:
    build: .
    environment:
      - NODE_ENV=production
      # Add other environment variables as needed
    stdin_open: true  # Required for stdio communication
    tty: true         # Allocate a pseudo-TTY
```

Then run:

```bash
docker-compose up
```

## Security Considerations

- The Docker container runs as a non-root user for improved security
- Sensitive information like secret keys should be provided via environment variables, not built into the image
- Consider using Docker secrets for production deployments

## Troubleshooting

If you encounter issues:

1. Check that the container has access to the internet to connect to the Stellar network
2. Verify that environment variables are correctly passed to the container
3. Ensure the container has the necessary permissions to access any mounted volumes

For more help, please open an issue on the GitHub repository.
