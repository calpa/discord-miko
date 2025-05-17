import { Hono } from 'hono';

import { ArticleMetadataSchema, type ArticleMetadata } from './types/ArticleMetadataSchema';
import { DiscordMessageSchema, type DiscordMessage } from './types/DiscordMessageSchema';
import { QueueHandlerMessageSchema, type QueueHandlerMessage } from './types/QueueHandlerMessageSchema';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', (c) => c.text('Hello World'));

async function sendDiscordMessage(DISCORD_WEBHOOK_URL: string, articleMetadata: ArticleMetadata) {

  const { title, url, description, timestamp, thumbnailURL } = ArticleMetadataSchema.parse(articleMetadata);

  const body = DiscordMessageSchema.parse({
    "username": "Calpa 的自動人形",
    "avatar_url": "https://assets.calpa.me/telegram/public/pfp.png",
    "content": "📰 Calpa 發佈新文章啦！",
    "embeds": [
      {
        "title": title,
        "url": url,
        "description": description,
        "color": 5814783,
        "footer": {
          "text": "Calpa 的煉金工房"
        },
        "timestamp": timestamp,
        "thumbnail": {
          "url": thumbnailURL
        }
      }
    ]
  });

  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error(`Failed to send to Discord: ${response.status} ${await response.text()}`);
    return false;
  }

  return true;
}

app.post('/send-message', async (c) => {
  const authHeader = c.req.header('authorization');
  const expectedToken = c.env.AUTH_TOKEN;
  console.log('[POST /send-message] Received request', { authHeader: !!authHeader });

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    console.warn('[POST /send-message] Unauthorized access attempt', { authHeader });
    return c.json({ error: 'Unauthorized' }, 401);
  }

  let json: ArticleMetadata;
  try {
    json = await c.req.json<ArticleMetadata>();
    console.log('[POST /send-message] Parsed JSON body', json);
  } catch (err) {
    console.error('[POST /send-message] Failed to parse JSON body', err);
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  let articleMetadata: ArticleMetadata;
  try {
    articleMetadata = ArticleMetadataSchema.parse(json);
    console.log('[POST /send-message] Validated article metadata', articleMetadata);
  } catch (err) {
    console.error('[POST /send-message] Invalid article metadata', err);
    return c.json({ error: 'Invalid metadata' }, 400);
  }

  try {
    const response = await sendDiscordMessage(c.env.DISCORD_WEBHOOK_URL, articleMetadata);
    if (!response) {
      console.error('[POST /send-message] Failed to send message to Discord');
      return c.json({ error: 'Failed to send to Discord' }, 500);
    }
    console.log('[POST /send-message] Successfully sent message to Discord');
    return c.json({ ok: true });
  } catch (err) {
    console.error('[POST /send-message] Unexpected error while sending message to Discord', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * Worker queue handler that processes messages and sends them to a Discord webhook.
 * Retries failed messages and acknowledges successful deliveries.
 */
const exportHandler: ExportedHandler<CloudflareBindings, QueueHandlerMessage> = {
  fetch: app.fetch,
  /**
   * Handles a batch of queue messages, sending each to Discord via webhook.
   * Retries on failure, acknowledges on success.
   */
  async queue(batch, env): Promise<void> {
    await Promise.all(
      batch.messages.map(async (message) => {
        try {
          const articleMetadata = QueueHandlerMessageSchema.parse(message.body);

          const response = await sendDiscordMessage(env.DISCORD_WEBHOOK_URL, articleMetadata.content);

          if (!response) {
            console.error(`Failed to send to Discord`);
            message.retry();
            return;
          }

          message.ack();
        } catch (error) {
          console.error('Error sending message to Discord:', error);
          message.retry();
        }
      })
    );
  },
};

export default exportHandler;
