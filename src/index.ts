import { Hono } from 'hono';

/**
 * QueueHandlerMessage represents the payload for messages handled by the Worker queue.
 */
type QueueHandlerMessage = {
  content: string;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', (c) => c.text('Hello World'));

async function sendDiscordMessage(DISCORD_WEBHOOK_URL: string, content: string) {
  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    console.error(`Failed to send to Discord: ${response.status} ${await response.text()}`);
    return false;
  }

  return true;
}

app.post('/send-message', async (c) => {
  const { content } = await c.req.json<{ content: string }>();
  if (!content) {
    return c.json({ error: 'Missing content' }, 400);
  }

  const response = await sendDiscordMessage(c.env.DISCORD_WEBHOOK_URL, content);

  if (!response) {
    return c.json({ error: 'Failed to send to Discord' }, 500);
  }

  return c.json({ ok: true });
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
          const response = await sendDiscordMessage(env.DISCORD_WEBHOOK_URL, message.body.content);

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
