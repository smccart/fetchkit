import type { IconConfig } from './types';

const FREEPIK_BASE = 'https://api.freepik.com';
const WEBHOOK_URL = 'https://httpbin.org/post';

interface FreepikTaskResponse {
  data: {
    task_id: string;
    status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    generated?: string[];
  };
}

/**
 * Generate a single AI icon via the Freepik preview endpoint.
 * Uses the fast preview path (~6s) which returns a PNG.
 * The PNG is wrapped in an SVG for compatibility with the icon system.
 * Returns null on failure or timeout.
 */
export async function generateFreepikIcon(
  prompt: string,
  apiKey: string,
  style: 'solid' | 'outline' | 'color' | 'flat' | 'sticker' = 'solid',
): Promise<IconConfig | null> {
  try {
    // 1. Submit preview task (much faster than full generation)
    const createRes = await fetch(`${FREEPIK_BASE}/v1/ai/text-to-icon/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt,
        webhook_url: WEBHOOK_URL,
        style,
      }),
    });

    if (!createRes.ok) return null;

    const createData: FreepikTaskResponse = await createRes.json();
    const taskId = createData.data.task_id;
    if (!taskId) return null;

    // 2. Poll for completion (max 20s, every 2s)
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(2000);

      const pollRes = await fetch(
        `${FREEPIK_BASE}/v1/ai/text-to-icon/${taskId}`,
        {
          method: 'GET',
          headers: {
            'x-freepik-api-key': apiKey,
          },
        },
      );

      if (!pollRes.ok) continue;

      const pollData: FreepikTaskResponse = await pollRes.json();

      if (pollData.data.status === 'FAILED') return null;
      if (pollData.data.status === 'COMPLETED' && pollData.data.generated?.length) {
        const imageUrl = pollData.data.generated[0];
        const name = prompt.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40);

        // Wrap the PNG in an SVG <image> element for icon system compatibility
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" width="64" height="64"><image href="${imageUrl}" width="64" height="64"/></svg>`;

        return {
          id: `freepik:${taskId}`,
          name,
          svg,
        };
      }
    }

    return null; // Timed out
  } catch {
    return null;
  }
}

/**
 * Generate multiple AI icons for a company name.
 * Fires 3 prompts in parallel and returns all successful results.
 */
export async function generateFreepikIcons(
  companyName: string,
  apiKey: string,
): Promise<IconConfig[]> {
  const prompts = [
    `${companyName} logo icon, minimal, clean`,
    `${companyName} brand symbol, simple, modern`,
    `${companyName} icon, flat design, professional`,
  ];

  const results = await Promise.allSettled(
    prompts.map((p) => generateFreepikIcon(p, apiKey)),
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<IconConfig | null> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value)
    .filter((icon): icon is IconConfig => icon !== null);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
