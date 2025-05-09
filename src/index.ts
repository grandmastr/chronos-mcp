#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as stellar from '@stellar/stellar-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

// Initialize Stellar SDK (using testnet by default)
const stellarServer = new stellar.Horizon.Server('https://horizon.stellar.org');
const networkPassphrase = stellar.Networks.PUBLIC;
const secretKey = process.env.STELLAR_SECRET_KEY;

interface TokenListArgs {
  publicKey: string;
}

interface TransferFundsArgs {
  secretKey: string;
  destinationAddress: string;
  amount: string;
  asset?: string;
}

interface Balance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance?: string;
  liquidity_pool_id?: string;
}

class StellarMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'stellar-blockchain-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = error => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'connect_wallet',
          description: 'Connect to a Stellar wallet using secret key',
          inputSchema: {
            type: 'object',
            properties: {
              secretKey: {
                type: 'string',
                description: 'Stellar wallet secret key',
              },
            },
            required: ['secretKey'],
          },
        },
        {
          name: 'list_tokens',
          description: 'List all tokens in a Stellar wallet',
          inputSchema: {
            type: 'object',
            properties: {
              publicKey: {
                type: 'string',
                description: 'Stellar wallet public key',
              },
            },
            required: ['publicKey'],
          },
        },
        {
          name: 'get_balances',
          description: 'Get balances for all tokens in a Stellar wallet',
          inputSchema: {
            type: 'object',
            properties: {
              publicKey: {
                type: 'string',
                description: 'Stellar wallet public key',
              },
            },
            required: ['publicKey'],
          },
        },
        {
          name: 'transfer_funds',
          description: 'Transfer funds to another Stellar wallet',
          inputSchema: {
            type: 'object',
            properties: {
              secretKey: {
                type: 'string',
                description: 'Source wallet secret key',
              },
              destinationAddress: {
                type: 'string',
                description: 'Destination wallet public key',
              },
              amount: {
                type: 'string',
                description: 'Amount to transfer',
              },
              asset: {
                type: 'string',
                description: 'Asset to transfer (defaults to XLM)',
              },
            },
            required: ['secretKey', 'destinationAddress', 'amount'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const args = request.params.arguments as Record<string, unknown>;
      const secretKey = process.env.STELLAR_SECRET_KEY;

      switch (request.params.name) {
        case 'connect_wallet': {
          if (!secretKey) {
            throw new McpError(ErrorCode.InvalidParams, 'Secret key is required');
          }

          return await this.handleConnectWallet();
        }
        case 'list_tokens': {
          if (!(args && typeof args.publicKey === 'string')) {
            throw new McpError(ErrorCode.InvalidParams, 'Public key is required');
          }
          return await this.handleListTokens({ publicKey: args.publicKey });
        }
        case 'get_balances': {
          if (!(args && typeof args.publicKey === 'string')) {
            throw new McpError(ErrorCode.InvalidParams, 'Public key is required');
          }
          return await this.handleGetBalances({ publicKey: args.publicKey });
        }
        case 'transfer_funds': {
          if (!secretKey) {
            throw new McpError(ErrorCode.InvalidParams, 'Secret key is required');
          }

          if (
            !(args && typeof args.destinationAddress === 'string') ||
            !(args && typeof args.amount === 'string')
          ) {
            throw new McpError(
              ErrorCode.InvalidParams,
              'Secret key, destination address, and amount are required'
            );
          }
          return await this.handleTransferFunds({
            secretKey,
            destinationAddress: args.destinationAddress,
            amount: args.amount,
            asset: typeof args.asset === 'string' ? args.asset : undefined,
          });
        }
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    });
  }

  private async handleConnectWallet() {
    try {
      if (!secretKey) {
        return {
          content: [
            {
              type: 'text',
              text: 'No secret key provided',
            },
          ],
          isError: true,
        };
      }

      const keypair = stellar.Keypair.fromSecret(secretKey);
      const publicKey = keypair.publicKey();

      // Verify the account exists
      await stellarServer.loadAccount(publicKey);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                message: 'Successfully connected to wallet',
                publicKey: publicKey,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to connect wallet: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  private getAssetInfo(balance: Balance) {
    if (balance.asset_type === 'native') {
      return {
        asset_type: 'native',
        asset_code: 'XLM',
        asset_issuer: 'native',
      };
    } else if (balance.asset_type === 'liquidity_pool_shares') {
      return {
        asset_type: balance.asset_type,
        asset_code: 'POOL',
        asset_issuer: balance.liquidity_pool_id,
      };
    } else {
      return {
        asset_type: balance.asset_type,
        asset_code: balance.asset_code,
        asset_issuer: balance.asset_issuer,
      };
    }
  }

  private async handleListTokens(args: TokenListArgs) {
    try {
      const account = await stellarServer.loadAccount(args.publicKey);
      const tokens = (account.balances as Balance[]).map(balance => this.getAssetInfo(balance));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                tokens,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to list tokens: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleGetBalances(args: TokenListArgs) {
    try {
      const account = await stellarServer.loadAccount(args.publicKey);
      const balances = (account.balances as Balance[]).map(balance => ({
        ...this.getAssetInfo(balance),
        balance: balance.balance,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                balances,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to get balances: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleTransferFunds(args: TransferFundsArgs) {
    try {
      const secretKey = process.env.STELLAR_SECRET_KEY;
      if (!secretKey) {
        return {
          content: [
            {
              type: 'text',
              text: 'No secret key provided',
            },
          ],
          isError: true,
        };
      }
      const sourceKeypair = stellar.Keypair.fromSecret(secretKey);
      const sourcePublicKey = sourceKeypair.publicKey();

      // Load source account
      const sourceAccount = await stellarServer.loadAccount(sourcePublicKey);

      // Create transaction
      const baseFee = await stellarServer.fetchBaseFee();
      const transaction = new stellar.TransactionBuilder(sourceAccount, {
        fee: baseFee.toString(),
        networkPassphrase,
      })
        .addOperation(
          stellar.Operation.payment({
            destination: args.destinationAddress,
            asset: args.asset ? new stellar.Asset(args.asset) : stellar.Asset.native(),
            amount: args.amount,
          })
        )
        .setTimeout(30)
        .build();

      // Sign and submit transaction
      transaction.sign(sourceKeypair);
      const result = await stellarServer.submitTransaction(transaction);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                message: 'Transfer successful',
                hash: result.hash,
                source: sourcePublicKey,
                destination: args.destinationAddress,
                amount: args.amount,
                asset: args.asset || 'XLM',
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to transfer funds: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Stellar MCP server running on stdio');
  }
}

const mcpServer = new StellarMcpServer();
mcpServer.run().catch(console.error);
