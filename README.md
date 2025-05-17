# 🌸 Discord Miko

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Hono](https://img.shields.io/badge/Hono.js-000000?logo=hono&logoColor=white)](https://hono.dev/)

> A lightweight and efficient Discord webhook service built with Hono.js and Cloudflare Workers

✨ **Discord Miko** is a serverless application that helps you send beautiful article announcements to your Discord server with ease. Perfect for content creators and developers who want to automate their content sharing workflow.

## 🚀 Features

- 🌈 **Rich Embeds** - Beautifully formatted Discord messages with thumbnails
- ⚡ **Blazing Fast** - Built on Cloudflare's edge network
- 🔒 **Secure** - Protected with API key authentication
- 🛠 **Type-Safe** - Full TypeScript support with Zod validation
- 🤖 **Easy Integration** - Simple REST API for seamless integration
- 📱 **Serverless** - No servers to manage, scales automatically

## 📦 Prerequisites

- Node.js 18+
- npm or Yarn
- Cloudflare Wrangler CLI
- A Discord server with webhook permissions

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/discord-miko.git
   cd discord-miko
   ```

2. Install dependencies:
   ```bash
   # Using Yarn (recommended)
   yarn install
   
   # Or using npm
   npm install
   ```

3. Set up environment variables:
   Create a `.dev.vars` file in the project root:
   ```env
   DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
   DISCORD_MIKO_KEY=your_secure_api_key_here
   ```

## 🚀 Quick Start

### Local Development

```bash
# Start development server
yarn dev
# or
npm run dev
```

### Deploy to Production

1. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy your worker:
   ```bash
   yarn deploy
   # or
   npm run deploy
   ```

## 📚 API Reference

### Send Article Announcement

Send a POST request to `/send-message` with the following JSON body:

```http
POST /send-message
Content-Type: application/json
Authorization: Bearer your_secure_api_key_here

{
  "title": "Getting Started with Discord Webhooks",
  "url": "https://example.com/discord-webhooks",
  "description": "Learn how to integrate Discord webhooks into your application.",
  "timestamp": "2025-05-17T14:00:00Z",
  "thumbnailURL": "https://example.com/thumbnails/webhooks.jpg"
}
```

#### Request Body Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | Article title |
| url | string (URL) | ✅ | Full URL to the article |
| description | string | ✅ | Brief article description |
| timestamp | string (ISO 8601) | ✅ | Publication timestamp |
| thumbnailURL | string (URL) | ✅ | URL to article thumbnail |

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DISCORD_WEBHOOK_URL` | ✅ | - | Your Discord webhook URL |
| `DISCORD_MIKO_KEY` | ✅ | - | API key for authenticating requests |

## 🧪 Testing

Run the test suite:

```bash
yarn test
# or
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Hono.js](https://hono.dev/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
- Type safety with [TypeScript](https://www.typescriptlang.org/) and [Zod](https://zod.dev/)

---

<p align="center">
  Made with ❤️ by Calpa | 
  <a href="https://calpa.me">Website</a> | 
  <a href="https://github.com/calpa">GitHub</a>
</p>