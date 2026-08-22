# Heirloom — visual design spec (for Claude Code)

This is the exact design of the mobile app prototype, to be implemented in the real Next.js + Tailwind codebase per `HEIRLOOM.md`. Follow it precisely — colors, type, spacing, copy — rather than reinterpreting.

## Foundations

**Colors**
```css
--rice:    #F3F8F5;  /* app background, cards */
--lacquer: #17303A;  /* primary text, dark screens (Record), nav icon bg */
--coral: #E8623D; /* primary accent — CTAs, record button, active states */
--teal-tint: #E4F0EC; /* soft green surface (avatar bg, storybook format card) */
--coral-tint: #FCE6DE; /* soft coral surface (avatar bg, cookalong format card) */
--amber-tint: #FDECC9; /* soft neutral surface (phrase coach card, tip callouts, active language pill) */
--pandan:  #4F8F76;  /* step-number badges, success/complete */
--gold-leaf: #C9A227; /* gap-prompt / "ask her" callouts — dashed border */
--border:  #E3ECE7;  /* card borders */
--muted:   #5F7873;  /* secondary text */
--muted-2: #93A8A2;  /* tertiary text, timestamps */
--page-bg: #DCE9E6;  /* surrounding canvas behind the phone, not part of the app itself */
```

**Type**
- Display: `Baloo 2` (weights 500/600, italic 500 for quoted speech) — screen titles, section headers, storybook captions, phrase-coach headwords.
- Body: `Nunito` (400/500/600/700/800) + `Noto Sans SC` for Chinese + `Noto Sans Tamil` for Tamil — load all three, switch by active language.
- Mono: `Noto Sans Mono` (500) — timestamps, romanisation.
- Body text minimum 14px; primary reading text 16.5–17px; never below 12.5px (uncertain-word caption is the one exception, already bold-underlined to compensate).

**Layout**
- Mobile-first, designed at 390×844 (iPhone-class). Content padding 20px horizontal.
- Screens with a bottom nav get `padding-bottom: 140px` on their scroll container to clear the nav.
- Cards: white background, 1.5px solid `--border`, border-radius 16–18px, padding 14–18px.
- Buttons/tap targets: minimum 44px; primary actions 56px+ tall.

## Navigation shell

Bottom tab bar, always visible except full-screen Record: `Home` (🏠) — `Record` (🎙️, center) — `Stories` (📖).
- Home/Stories tabs: plain icon + 12px label, active color `--coral`, inactive `--muted-2`.
- **Record tab is visually larger and raised**: a 62px circular coral button with white 4px border and drop shadow, sitting ~26px above the bar's top edge (`margin-top: -26px` on the tab), label bold beneath it. This is the primary action — always reachable from anywhere in the app.
- Bar background: `rgba(251,247,238,0.96)` with a 1px top border in `--border`, blurred/elevated over content.

## Screens

### 1. Home
- Header row: "Good morning" (15px muted) + "Your family's stories" (Baloo 2 600, 26px) on the left; a 52px round avatar circle on the right (soft jade tint bg, emoji placeholder — swap for the user's real photo).
- Hero card: 220px tall, rounded 22px, full-bleed illustration (photo/art of a grandmother telling grandchildren a story), with a dark scrim caption pill bottom-left: "N memories from Ah Ma".
- Primary CTA button: full-width, coral background, rounded 18px. Left: 44px circle icon (🎙️) on rice background. Right: "Record a new memory" (white, bold 18px) / "Just press play and let her talk" (14px, light rose).
- "Saved memories" section header (Baloo 2 600, 19px).
- Memory list: each row is a card — 52px round avatar (emoji + tinted bg placeholder for a real photo), title (bold 16.5px, truncates), subtitle "N lessons ready" (14px muted), trailing chevron. Tapping opens that memory's transcript.

### 2. Record (full screen, dark)
- Background `--lacquer`, all text rice/light.
- 128px circular avatar of the grandparent mid-story (image placeholder) centered near top.
- The question being asked, in quotes, Baloo 2 italic 22px, centered.
- Helper line: "Ask her one question. Let her talk." (15px, muted teal `#9fc2bd`).
- Live waveform: row of vertical bars (coral, varying height) animating with audio level.
- Big record/stop control: 84px circle, coral fill, 6px rice border.
- Timer/status line beneath: "Tap to finish · 1:42".

### 3. Memory / transcript spine
- Back link "‹ All memories" (muted, 15px).
- Header row: 56px round avatar + memory title (Baloo 2 600, 21px) + "Recorded today · 1:42" (muted).
- **Language switcher**: pill row, one pill per language (English / 中文 / Melayu / தமிழ்). Active pill: coral bg, white text. Inactive: amber-tint bg, muted text. Switching re-renders every segment's text in that language's font, instantly, without touching her audio.
- **Transcript spine** (signature element): a white card containing a list of segment rows. Each row: 38px dark circular ▶ button (tap plays that exact audio slice), the segment text (sized 16.5px, in the active language's font), and a mono timestamp on the right. The currently-active/tapped segment gets a amber-tint highlight background.
  - **Uncertain segments** get a small caption below the text: "tap to hear the word Ah Ma used", in gold-leaf color with a dotted underline — this is the dialect-honesty feature, must be visually distinct, never hidden.
- "Make it a lesson" section header, then one card per available format (Cook-along / Phrase coach / Storybook today — Branching/Quiz/Skill card can render as greyed, disabled cards later): icon, title (bold), one-line description, tinted background per format. Tapping opens that format's player.

### 4. Lesson player — Cook-along
- Back link to the memory, then title "Ah Ma's [dish], step by step" (Baloo 2 600, 24px) + meta line "Cook-along · serves N · tap 🔊 to hear her".
- One card per step: green (`--pandan`) numbered circle, instruction text (17px semibold), a small dark 🔊 button on the right that plays her original audio for that exact step (via its `segmentIndex`).
  - **Tip callout** (when present): amber-tint background, italic Baloo 2, prefixed 💡 — her own aside, e.g. "my mother always added more sugar."
  - **Gap-prompt callout** (when a detail is missing): distinct style — cream background, **dashed gold-leaf border**, prefixed ❓, phrased as a question to go ask her ("Ask Ah Ma how long she soaked the beans"). Never invents the missing detail. This must look different from a tip, not just similarly styled.

### 5. Lesson player — Phrase coach
- Same header pattern. One card per phrase: original dialect word/phrase (Baloo 2 600, 19px) + 🔊 button; romanisation in mono below; meaning (15.5px); "When to use it: …" line (muted).

### 6. Lesson player — Storybook
- Same header pattern, meta line "6 panels · illustrated · for the youngest grandchild".
- One card per panel: full-width 3:2 illustration (consistent illustrated style across all 6 — soft gouache children's-book look, warm palette, no text baked into the image), a numbered coral badge, the caption (Baloo 2 17px), and a 🔊 button that plays her audio for that panel's segment.

## Interaction rules (carry into the real app)

- Language switching never touches audio — only text/font re-render.
- Tapping any segment/step/phrase/panel plays her **original recorded audio** for that exact slice — never synthesized speech.
- Gap prompts and uncertain-word markers are permanent visual features, not error states — style them calmly, not like warnings.
- Gold-leaf (`#C9A227`) is reserved for gap prompts and the eventual "memory saved" moment — do not use it as a general accent.
