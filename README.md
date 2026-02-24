# 📖 KJV Bible Game

A scripture memorization and quiz application built with React, powered by the King James Version of the Bible.

> "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." — 2 Timothy 2:15

## 🌐 Live App

**[https://dwatkins4782.github.io/kjv-bible-game/](https://dwatkins4782.github.io/kjv-bible-game/)**

---

## 📋 What the App Does

The KJV Bible Game helps users memorize and learn scripture through interactive exercises and quizzes. It covers 60+ King James Version verses across 8 categories and tracks personal progress locally in the browser.

### Features

| Feature | Description |
|---|---|
| 🧠 **Memorize** | Step-by-step scripture memorization with progressive difficulty stages |
| 📝 **Quiz** | Test knowledge with four question types: fill-in-the-blank, reference matching, verse completion, and word-order puzzles |
| 📚 **Browse** | Search and explore all 60+ KJV verses organized by category |
| 📊 **Progress** | Track memorized verses and quiz accuracy with visual progress bars |

### Verse Categories

- **Salvation** – Core gospel verses (John 3:16, Romans 3:23, Ephesians 2:8-9, …)
- **Faith** – Verses on believing (Hebrews 11:1, Romans 10:17, Galatians 2:20, …)
- **Strength** – Encouragement passages (Philippians 4:13, Isaiah 40:31, Joshua 1:9, …)
- **Peace** – Comfort verses (Philippians 4:6-7, John 14:27, Psalm 23:1-3, …)
- **Love** – Verses on love (1 Corinthians 13:4-7, John 15:13, Mark 12:30-31, …)
- **Wisdom** – Guidance passages (Proverbs 3:5-6, James 1:5, Psalm 119:105, …)
- **Prayer** – Verses on prayer (Jeremiah 29:12, 1 Thessalonians 5:17, Matthew 7:7, …)
- **Promises** – God's promises (Jeremiah 29:11, Psalm 37:4, Matthew 28:20, …)

---

## 🏗️ Architecture

```
kjv-bible-game/
├── src/                    # Frontend – React application
│   ├── App.jsx             # Root component with routing and layout
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global styles (dark-gold theme)
│   ├── pages/
│   │   ├── Home.jsx        # Dashboard with stats overview
│   │   ├── Memorize.jsx    # Step-by-step memorization flow
│   │   ├── Quiz.jsx        # Interactive quiz engine
│   │   ├── Browse.jsx      # Verse browser with search
│   │   └── Stats.jsx       # Progress tracking & statistics
│   ├── data/
│   │   └── verses.js       # KJV verse database (60+ verses, 8 categories)
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistent state hook
│   └── utils/
│       └── quiz.js         # Quiz generation algorithms
├── server/                 # Backend – Express REST API
│   ├── index.js            # API server entry point
│   └── package.json        # Backend dependencies
├── index.html              # HTML entry point
├── vite.config.js          # Vite build configuration
└── package.json            # Frontend dependencies
```

### Frontend

Built with **React 18** and **Vite**, using **React Router v6** for client-side navigation. Progress data is persisted in the browser's `localStorage` — no account or sign-in required.

**Memorization stages** for each verse:

1. **Read** – Display the full verse; user reads it 3 times
2. **First Letters** – Only the first letter of each word is shown; user types the full verse
3. **Fill Blanks** – ~35% of words are blanked out; user fills them in
4. **Full Recall** – User types the entire verse from memory (≥80% accuracy to pass)

**Quiz question types**:

- **Reference Match** – Given a verse text, identify the correct book/chapter/verse reference from 4 options
- **Verse Completion** – Given the first 40% of a verse, choose the correct ending from 4 options
- **Fill in the Blank** – Words are removed based on difficulty (15% easy / 30% medium / 50% hard)
- **Word Order** – Scrambled words must be arranged in the correct sequence

### Backend (REST API)

A lightweight **Express.js** server provides a JSON API for verse data. It is decoupled from the frontend so the data layer can be consumed by other clients.

| Endpoint | Description |
|---|---|
| `GET /api/verses` | All verses (optionally filtered by `?category=`) |
| `GET /api/verses/:ref` | Single verse by reference (e.g. `John%203:16`) |
| `GET /api/categories` | List of all categories |
| `GET /health` | Health check |

#### Running the Backend

```bash
cd server
npm install
npm start          # Production (port 3001)
npm run dev        # Development with auto-reload (nodemon)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The dev server runs at **http://localhost:5173**.

### Backend Development

```bash
cd server
npm install
npm run dev        # Starts on http://localhost:3001
```

### Running Both Together

```bash
# Terminal 1 – Frontend
npm run dev

# Terminal 2 – Backend
cd server && npm run dev
```

---

## 🏠 Hosting

### GitHub Pages (Frontend)

The frontend is automatically deployed to GitHub Pages via **GitHub Actions** whenever code is pushed to the `main` branch.

**Live URL:** `https://dwatkins4782.github.io/kjv-bible-game/`

The workflow file is at `.github/workflows/deploy.yml`.

### Backend Deployment

The Express API server can be deployed to any Node.js hosting platform:

- **Railway** – `railway up` from the `server/` directory
- **Render** – Connect the repo and set the root to `server/`
- **Fly.io** – `fly launch` from the `server/` directory
- **Heroku** – `git subtree push --prefix server heroku main`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 |
| Build Tool | Vite 6 |
| Routing | React Router v6 |
| Styling | CSS custom properties (no CSS framework) |
| State Persistence | Browser `localStorage` |
| Backend | Node.js + Express 4 |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

---

## 📜 License

All scripture quotations are from the **King James Version** (KJV) of the Bible, which is in the public domain.
