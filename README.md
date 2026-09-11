# Know Your Rights KE

<img src="./assets/header.svg" width="100%" alt="header" />


Plain-language legal rights guidance for Kenyan citizens â€” built mobile-first so it works on the phones people actually have.

## Why

Most people only meet the law when something has gone wrong: an arrest, a landlord dispute, a traffic stop, a workplace issue. The statute exists, but the language does not. This app turns those situations into short, actionable answers.

## Features

- Situation-based Q&A (arrest, housing, employment, traffic, consumer rights)
- Kiswahili + English
- Offline-friendly PWA â€” installable, works with flaky networks
- Shareable answer cards for WhatsApp and community groups
- Clean, low-bandwidth UI

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Firebase (auth + Firestore for content)
- PWA (service worker + installable)

## Run locally

```bash
npm install
cp .env.example .env.local   # add your Firebase + API keys
npm run dev
```

Open http://localhost:3000

## Related

- [kyr-node](https://github.com/shadrackb1/kyr-node) â€” Express backend (Helmet, rate limiting, server-rendered views)

## License

MIT
