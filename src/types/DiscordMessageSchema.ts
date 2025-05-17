import { z } from "zod";

export const DiscordMessageSchema = z.object({
  username: z.string(),
  avatar_url: z.string().url(),
  content: z.string(),
  embeds: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      description: z.string(),
      color: z.number(),
      footer: z.object({
        text: z.string(),
      }),
      timestamp: z.string().datetime(),
      thumbnail: z.object({
        url: z.string().url(),
      }),
    })
  ),
});

export type DiscordMessage = z.infer<typeof DiscordMessageSchema>;