# Olivia Li · Portfolio

**"Curious like a cat."** A one-page portfolio where every section fills the screen, and a cat moves you between sections. It tears the screen with its claws, slow-blinks, puts the lights out, rolls a giant ball of yarn and walks past. The plan is in **[STORYBOARD.md](STORYBOARD.md)**.

Plain HTML, CSS and JavaScript, plus three free animation libraries loaded from the internet:

- **GSAP** runs the animations.
- **ScrollTrigger** links them to scrolling.
- **Lenis** makes scrolling smooth.

## Run it

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000**. Edit, save, refresh.

## Folder

```
index.html              ← all the content
STORYBOARD.md           ← the plan
fonts/apfel-grotezk/    ← self-hosted font (+ its licence)

css/
  01-variables.css      ← colours, fonts, spacing. Start here to restyle.
  02-base.css           ← page defaults, menu, how the "stage" works
  03-sections.css       ← the layout of each section
  04-transitions.css    ← the effects between sections
  05-cat-bits.css       ← paw cursor, paw prints, progress line + tiny cat

js/
  01-setup.js           ← smooth scrolling + helpers
  02-cursor.js          ← paw cursor, eyes that follow it, batting letters
  03-storyboard.js      ← ★ the running order of the whole site
  04-intro.js           ← the intro (name drops in, cat rises)
  05-guide-cat.js       ← progress line with section stops + the draggable cat
  sections/             ← what happens INSIDE each section
  transitions/          ← the cat actions BETWEEN sections
```

## How it works

1. All six sections sit **on top of each other** inside one screen-sized box (`.stage`).
2. `03-storyboard.js` strings every section and transition into **one timeline**.
3. **ScrollTrigger** pins the stage and ties the timeline to the scrollbar. Scrolling down plays it forwards; scrolling up rewinds.
4. Each transition covers the screen (with torn strips, eyelids, spreading darkness, the yarn ball or a walking cat), swaps the section underneath, then reveals it.
5. If a visitor has **"reduce motion"** turned on, the sections simply stack as a normal page.

Try in the browser console: `SITE.story.progress(0.5)`

## Common edits

Search `index.html` for **`EDIT:`** to find every placeholder.

- **Colours:** `css/01-variables.css`.
- **Add a project:** copy a whole `<a class="project">…</a>` block.
- **Images:** put the file in `images/`, then add `<img src="images/name.jpg" alt="…">` inside `.project__cover` or `.about__photo`.
- **Story speed:** `SCROLL_PER_SECOND` in `js/03-storyboard.js`.

## Typefaces (all free for commercial use)

| Role | Font | From |
|---|---|---|
| Big headlines | **Caprasimo**: groovy 70s fat face, the closest free match to *Wister* on the moodboard | [Google Fonts](https://fonts.google.com/specimen/Caprasimo) (OFL) |
| Elegant lines | **Melodrama**: high-contrast serif, like the type on the palette card | [Fontshare](https://www.fontshare.com/fonts/melodrama) (ITF free licence) |
| Small text | **Apfel Grotezk**: quirky grotesk | [Collletttivo](https://www.collletttivo.it/typefaces/apfel-grotezk) (OFL, please credit) |

If Olivia buys a licence for **Wister**, swap it in as `--font-display` in `css/01-variables.css`.
