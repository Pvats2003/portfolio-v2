# Priyanshu Vats — portfolio v2

A new portfolio built from scratch with Next.js, TypeScript and Tailwind CSS. It's in progress: see `PLAN.md` for the plan and `TODO.md` for what's open.

**Current phase: 1 (visual direction).** The site has three trial designs to choose between: `/lab/a`, `/lab/b` and `/lab/c`.

## Run it on your computer

You need **Node.js 20.9 or newer**. Check with `node -v`; if you don't have it, install the "LTS" version from nodejs.org.

```bash
git clone https://github.com/Pvats2003/portfolio-v2.git
cd portfolio-v2
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser. The home page links to the three directions. At the top of each one:

- **A · Field Log / B · Control Room / C · Editorial** switches between directions.
- **System / Light / Dark** switches the theme. It's remembered until you pick "System" again.

To see the finished, optimised version (the one Lighthouse measures), run `npm run build` and then `npm run start` instead of `npm run dev`.

To stop the server, press `Ctrl + C` in the terminal.

## Checks

```bash
npm run lint       # code style
npm run typecheck  # TypeScript
npm run build      # production build
```

## How to update the site

_A full 10-line guide arrives in Phase 4, once the real pages exist._ For now, all the text shown in the three directions lives in one file, `content/lab.ts`. Edit a line there, save, and every direction updates.
