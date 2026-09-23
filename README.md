# Priyanshu Vats — portfolio v2

A new portfolio built from scratch with Next.js, TypeScript and Tailwind CSS. It's in progress: see `PLAN.md` for the plan and `TODO.md` for what's open.

**Live.** Home, About, Resume, 404, six case studies, the ⌘K / Ctrl+K palette, sharing images, sitemap, structured data and analytics are in, and search engines may index it. Design rules are in `DESIGN.md`.

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

1. Every word on the site lives in the `content/` folder. You never need to touch `app/` or `components/`.
2. Homepage text (headline, stats, "How I work", contact) → `content/site.ts`. Homepage cards → `content/work.ts`.
3. Each case study is one file in `content/projects/`. Change the words between the quote marks `'…'` and keep the commas.
4. New case study: copy an existing file in `content/projects/`, rename it, change `slug`, then add it to the list in `content/projects/index.ts`. Its page, sharing image, sitemap entry and ⌘K entry appear automatically.
5. New resume: replace `public/resume/Priyanshu_Vats_Resume_PV.pdf` (keep the name) and update `content/resume.ts` to match it. The build stops and prints the exact lines that differ until the two agree (`npm run check:resume` runs just that check).
6. A line starting with `{ type: 'todo'` is a question waiting on you. It's hidden on the live site (so is a chapter with nothing else in it). Replace it with `{ type: 'p', text: '…' }` once you have the real answer, and tick it off in `TODO.md`.
7. Apostrophes inside text: use ’ (curly) instead of ' so the quote marks don't break.
8. Check your edit: `npm run dev`, then open http://localhost:3000. If something's wrong, the terminal says which file and line.
9. Before pushing, run `npm run lint && npm run typecheck && npm run build`. All three must finish without errors.
10. Push to `main` on GitHub and Vercel redeploys the site automatically in about a minute.
