# website-theme
<p>
  <kbd>#profile-only</kbd>
  <kbd>#has-media-queries</kbd>
  <kbd>#mobile-supported</kbd>
  <kbd>#auto-update</kbd>
</p>
<a href="https://github.com/Teaseek/website-theme/actions/workflows/npm-gulp.yml">
<img src="https://github.com/Teaseek/website-theme/actions/workflows/npm-gulp.yml/badge.svg?event=push" alt="NodeJS with Gulp status"/>
</a>

## How to add this theme to your Shikimori page

Paste this into the custom styles field:
```css
@media {
  :root {
      --profile-head-image: url('https://shikimori.one/assets/achievements/anime/animelist_6.jpg');
      --profile-head-image-position-y: 10%;
      --profile-head-image-position-x: 30%;
  }
}
@import url(https://raw.githubusercontent.com/Teaseek/website-theme/main/style/css/style.min.css);
```
- `--profile-head-image` — the image that will be added to the page header.
- `--profile-head-image-position-y` and `--profile-head-image-position-x` — image positioning in the header.

> **Important:**
> Styles by import link are loaded only once and cached by the site. Because of this, if you change the imported style, you won't see updates on Shikimori until you manually reset the cache. To do this, go to [/tests/reset_styles_cache](https://shikimori.one/tests/reset_styles_cache), enter the style URL in the input field, and click "Submit".
>
> You must reset the cache after updating your styles. Once you do this, all users importing your style will see the changes.

---

## Style cache reset
- [Reset cache for all styles](https://shikimori.one/tests/reset_styles_cache/)
- [Reset cache for this theme](https://shikimori.one/tests/reset_styles_cache?url=https%3A%2F%2Fraw.githubusercontent.com%2FTeaseek%2Fwebsite-theme%2Fmain%2Fstyle%2Fcss%2Fstyle.min.css)

---

## Quick Start for Development

1. Install dependencies:
   ```bash
   pnpm install
   ```
   > **Note:** If you don't have `pnpm` installed, you can install it globally with `npm install -g pnpm`.
2. Download your profile HTML page (for example, via "Save as..." in your browser) and put it into the `resources` folder.
3. Start watching for changes and building:
   ```bash
   pnpm run watch
   ```
4. In a separate terminal, start the local server:
   ```bash
   pnpm run serve
   ```
5. After building, the page and all compiled styles will be in `dest/website`.
6. Open [http://localhost:8080](http://localhost:8080) — you can view your page with up-to-date styles and see changes live during development.

---

### Main scripts
- `pnpm run build` — one-time build of styles
- `pnpm run watch` — automatic rebuild on changes
- `pnpm run serve` — local server with hot reload
- `pnpm run lint` — auto-fix styles (stylelint)
- `pnpm run clear css` — clean compiled CSS
