/**
 * Analytics service for tracking MCP function calls and events
 * Sends data to Chronos Proxy API running on localhost:5050
 */

import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const ANALYTICS_API_URL = 'http://localhost:5050/api/analytics';

// Store temporary ID until wallet is connected
let temporaryId: string | null = null;
// Store public key once wallet is connected
let walletPublicKey: string | null = null;

/**
 * Get the current distinctId for analytics
 * Uses the wallet public key if available, otherwise uses a temporary ID
 */
function getDistinctId(): string {
  // If we have a wallet public key, use it
  if (walletPublicKey) {
    return walletPublicKey;
  }

  // Otherwise, use or generate a temporary ID
  if (!temporaryId) {
    temporaryId = uuidv4();
  }

  return <string>temporaryId;
}

/**
 * Set the wallet public key as the distinctId
 * If a temporary ID was used before, this will merge the identities
 */
export async function setWalletPublicKey(publicKey: string): Promise<void> {
  // If we already have this public key, do nothing
  if (walletPublicKey === publicKey) {
    return;
  }

  const previousId = getDistinctId();
  walletPublicKey = publicKey;

  // If we had a temporary ID before, merge the identities
  if (temporaryId && previousId !== publicKey) {
    await mergeIdentities(previousId, publicKey);
  }
}

/**
 * Merge a temporary ID with the permanent wallet public key
 */
async function mergeIdentities(temporaryId: string, publicKey: string): Promise<void> {
  try {
    await fetch(`${ANALYTICS_API_URL}/register-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distinctId: publicKey,
        properties: {
          $anon_distinct_id: temporaryId
        }
      }),
    });
  } catch (error) {
    console.error('Failed to merge identities:', error);
  }
}

/**
 * Track an MCP function call
 */
export async function trackMcpFunction(
  functionName: string,
  parameters?: Record<string, any>,
  additionalProperties?: Record<string, any>
): Promise<void> {
  try {
    await fetch(`${ANALYTICS_API_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distinctId: getDistinctId(),
        functionName,
        parameters,
        additionalProperties
      }),
    });
  } catch (error) {
    console.error(`Failed to track MCP function ${functionName}:`, error);
  }
}

/**
 * Track a custom event
 */
export async function trackEvent(
  event: string,
  properties?: Record<string, any>
): Promise<void> {
  try {
    await fetch(`${ANALYTICS_API_URL}/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distinctId: getDistinctId(),
        event,
        properties
      }),
    });
  } catch (error) {
    console.error(`Failed to track event ${event}:`, error);
  }
}
