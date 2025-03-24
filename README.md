# Chronos MCP Server 🔵

![Chronos Logo](public/ChronosLogo.png)

[![npm version](https://img.shields.io/npm/v/chronos-mcp.svg)](https://www.npmjs.com/package/chronos-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Chronos is a Model Context Protocol (MCP) server tailored for the Stellar blockchain and designed specifically for integration with Claude Desktop and similar AI applications. Chronos empowers your AI assistant with on-chain tools enabling streamlined interactions with the Stellar network.

## Overview

Chronos MCP provides the following capabilities:

- **Connect to Stellar Wallets:** Securely connect to your wallet using a secret key.
- **List Wallet Tokens:** Retrieve and list all tokens held in a Stellar wallet.
- **Query Balances:** Get real-time balances for your XLM and other assets.
- **Transfer Funds:** Initiate transfers between Stellar wallets with ease.

Chronos is built to be extensible and operates as a standard Node.js package, allowing it to be easily deployed, installed, and integrated—similar to other MCP servers such as base-mcp.

## Features

- **Stellar Integration:** Fully interacts with the Stellar mainnet via the Horizon API.
- **Easy Deployment:** Publish and install Chronos using npm.
- **Claude Desktop Compatibility:** Seamlessly integrate with Claude Desktop by updating MCP server configuration.
- **Extensible Architecture:** Designed for future enhancements and new tool integrations.

## Prerequisites

- Node.js (v14 or higher)
- npm
- Stellar wallet credentials (secret key for connection)
- Internet connectivity to interact with the Stellar network

## Installation

### Option 1: Install from npm (Recommended)

Install Chronos globally:

```bash
npm install -g chronos-mcp
```

Or use it directly with npx:

```bash
npx chronos-mcp@latest
```

### Option 2: Install from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chronos-mcp.git
   cd chronos-mcp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. (Optional) Link globally for easier access:

   ```bash
   npm link
   ```

## Configuration

Create a configuration file or set environment variables as needed. For example, to use Chronos with Claude Desktop, update your Claude Desktop configuration file located at:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Sample configuration for Claude Desktop:

```json
{
  "mcpServers": {
    "stellar": {
      "command": "npx",
      "args": ["chronos-mcp@latest"],
      "env": {
        "STELLAR_NETWORK": "mainnet"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Usage

Chronos MCP exposes the following tools via its MCP interface:

### connect_wallet

Connects to a Stellar wallet using the secret key.

**Example Command:**
> "Connect my wallet using secret key ______"

---

### list_tokens

Lists all tokens and assets in the specified Stellar wallet.

**Example Command:**
> "List my wallet tokens"

---

### get_balances

Retrieves the balance for XLM and any other assets.

**Example Command:**
> "What's my current XLM balance?"

---

### transfer_funds

Transfers funds from your wallet to another Stellar wallet.

**Parameters:**
- `secretKey`: Your wallet secret key.
- `destinationAddress`: The recipient's wallet address.
- `amount`: The amount to transfer.
- `asset` *(optional)*: Asset to transfer (defaults to XLM).

**Example Command:**
> "Transfer 0.5 XLM to [destination wallet address]"

## Testing

To test Chronos MCP locally:

```bash
npm test
```

This will run the project’s test suite and verify that your server is working as expected.

## Deployment

Chronos MCP is designed to function as a standard Node.js package and can be published to npm. Once published (e.g. via `npm publish`), Chronos can be installed globally or used via npx, just like any other MCP server.

For production deployment, consider wrapping Chronos in a system service (using systemd, launchd, etc.) for automatic restarts and monitoring.

## Extending Chronos

Chronos is built with extensibility in mind. To add new tools:

1. Create a new directory in the `src/tools` folder.
2. Implement your tool (include an `index.ts`, `schemas.ts`, and `handlers.ts`).
3. Export your tool in `src/tools/index.ts`.
4. Update the README with your tool's documentation and examples.
5. Write tests to ensure your new tool works correctly.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please consult the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting issues, submitting pull requests, and other contribution instructions.

──────────────────────────────
This README is tailored specifically for Chronos MCP and outlines its deployment as a Node.js package, integration with Claude Desktop, and a comprehensive set of features to interact with the Stellar blockchain.
