# Neon Graphics Project Status

Last updated: 2026-05-06

## Current Goal

Preview landing page for Neon Graphics is ready to share with the client.

Current flow:

1. Finish visual preview.
2. Push to GitHub.
3. Import/deploy from GitHub to Vercel.
4. Send preview link to client.
5. Collect client edits.
6. Later: build admin area and move editable site data into a GitHub-backed JSON workflow.

## Repository

- GitHub: `https://github.com/Puhich/neon-graphics`
- Branch: `main`
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS
- Main content source for the landing page: `data/content.json`

## Important Files

- `app/page.tsx` - page composition and section order
- `data/content.json` - text, links, stats, services, FAQ, reviews, contacts, images
- `components/Hero.tsx` - hero, top menu, mobile menu, hero carousel, floating phone button
- `components/ClientsLogos.tsx` - client logo section after hero
- `components/Services.tsx` - services and additional services
- `components/Portfolio.tsx` - projects slider
- `components/WhyUs.tsx` - bento "why us" section and advantages
- `components/CTASection.tsx` - dark CTA card
- `components/Stages.tsx` - work steps
- `components/Reviews.tsx` - reviews slider
- `components/DirectorQuote.tsx` - direct quote card
- `components/FAQ.tsx` - animated FAQ accordion
- `components/FinalForm.tsx` - request form UI
- `components/Contacts.tsx` - Yandex map and contact card
- `components/Footer.tsx` - footer
- `public/images/` - site photos
- `public/logos/` - client logo images

## Current State

- Landing page is static and data-driven from JSON.
- Mobile and desktop layouts have been tuned manually after visual review.
- Navigation is sticky: transparent at hero top, darkens with scroll.
- Floating phone button is outside the hero section so it stays above map/footer.
- Yandex map uses an embedded widget and a separate mobile center.
- FAQ uses a controlled React accordion for smoother opening.
- Form is visual-only for now: name, phone, email, message. No backend submit yet.

## Known Next Steps After Client Review

- Apply client copy/design edits.
- Decide final form handling:
  - Telegram/email webhook,
  - CRM,
  - or simple serverless endpoint on Vercel.
- Build admin area for editing JSON fields.
- Define GitHub-backed content update flow:
  - admin edits JSON,
  - commit to GitHub,
  - Vercel redeploys from `main`.
- Add SEO metadata and Open Graph images.
- Add privacy policy page/link before real launch.
- Final production QA on mobile/desktop.

## Local Reference Files Not Required For App Runtime

These may exist locally as references and are not required by the Next.js app unless intentionally imported:

- `NeonGraphics.pen`
- `NeonGraphics-admin.pen`
- `index_old.html`
- `preview.html`
- `Logos/`
- `SVG/`
- Excel/client brief files

## Commands

```bash
npm run dev
npm run lint
npm run build
git status
git push
```
