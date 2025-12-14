<p align="center">
  <img src="https://raw.githubusercontent.com/cordbun/cordbun/main/assets/logo.svg" alt="cordbun" width="200" />
</p>

<h1 align="center">cordbun</h1>

<p align="center">
  <b>The Discord library that doesn't get in your way.</b>
</p>

<p align="center">
  Fast. Lightweight. Type-safe. Built for Bun.
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#why-cordbun">Why cordbun</a> •
  <a href="#acknowledgments">Acknowledgments</a>
</p>

---

## Installation

```bash
bun add cordbun
```

## Quick Start

```typescript
import { Cord, t } from 'cordbun'

new Cord()
  .command('ping', 'Check bot latency', () => 'Pong!')
  .command('greet', 'Greet someone', ({ options }) => `Hello, ${options.name}!`, {
    options: { name: t.String() }
  })
  .on('ready', ({ user }) => console.log(`${user.tag} is online`))
  .listen(Bun.env.DISCORD_TOKEN)
```

That's it. No boilerplate. No configuration hell.

## Why cordbun

### ⚡ Performance

Built from the ground up for Bun's runtime. Native WebSocket, native fetch, zero unnecessary dependencies. Your bot starts in milliseconds.

### 🪶 Lightweight

Ship what you need, nothing more. No bloated abstractions, no legacy compatibility layers.

### 🔒 Type-Safe

Full TypeScript inference out of the box. Your options, your context, your handlers — all automatically typed. No manual generics required.

### 🧩 Extensible

First-class plugin system inspired by the best. Compose functionality cleanly with `.use()`.

```typescript
new Cord()
  .use(logger())
  .use(cooldown({ default: 3000 }))
  .use(database(db))
```

### 🎯 Developer-First

Write code that reads like documentation. Chain methods naturally. Focus on your bot's logic, not the framework's quirks.

## Documentation

Full documentation available at [cordbun.dev](https://cordbun.dev)

## Acknowledgments

cordbun's architecture is heavily inspired by [Elysia](https://elysiajs.com) — a beautifully designed framework that proved developer experience and performance can coexist. Thank you to the Elysia team for showing what modern TypeScript APIs should look like.

## License

Apache-2.0 © cordbun