import { ArticleMetadataSchema, type ArticleMetadata } from "../types/ArticleMetadataSchema";
import { DiscordMessageSchema } from "../types/DiscordMessageSchema";

/**
 * Sends a formatted Discord message via webhook announcing a new article.
 *
 * @param DISCORD_WEBHOOK_URL - The Discord webhook URL to send the message to.
 * @param articleMetadata - The metadata of the article to announce.
 * @returns Promise<boolean> Resolves to true if the message was sent successfully, false otherwise.
 */
export async function sendDiscordMessage(
  DISCORD_WEBHOOK_URL: string,
  articleMetadata: ArticleMetadata
): Promise<boolean> {
  const { title, url, description, timestamp, thumbnailURL } = ArticleMetadataSchema.parse(articleMetadata);

  const body = DiscordMessageSchema.parse({
    username: "Calpa 的自動人形",
    avatar_url: "https://assets.calpa.me/telegram/public/pfp.png",
    content: "📰 Calpa 發佈新文章啦！",
    embeds: [
      {
        title,
        url,
        description,
        color: 5814783,
        footer: {
          text: "Calpa 的煉金工房"
        },
        timestamp,
        thumbnail: {
          url: thumbnailURL
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