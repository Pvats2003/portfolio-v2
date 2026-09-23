# Priyanshu Vats — portfolio v2

A new portfolio built from scratch with Next.js, TypeScript and Tailwind CSS. It's in progress: see `PLAN.md` for the plan and `TODO.md` for what's open.

**Current phase: 2 (information architecture).** The home page, About, Resume, 404 and the City Ops OS case study are built. The other case studies arrive in Phase 3. Design rules are in `DESIGN.md`.

## Run it on your computer

You need **Node.js 20.9 or newer**. Check with `node -v`; if you don't have it, install the "LTS" version from nodejs.org.

```bash
git clone https://github.com/Pvats2003/portfolio-v2.git
cd portfolio-v2
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser. The **System / Light / Dark** switch in the header changes the theme, and it's remembered until you pick "System" again.

To see the finished, optimised version (the one Lighthouse measures), run `npm run build` and then `npm run start` instead of `npm run dev`.

To stop the server, press `Ctrl + C` in the terminal.

## Checks

```bash
npm run lint       # code style
npm run typecheck  # TypeScript
npm run build      # production build
```

## How to update the site

_A full 10-line guide arrives in Phase 4._ For now: homepage text is in `content/site.ts`, work cards are in `content/work.ts`, the City Ops OS story is in `content/projects/city-ops-os.ts`, and resume facts are in `content/resume.ts`. Edit the words between the quote marks, save, and the page updates.
