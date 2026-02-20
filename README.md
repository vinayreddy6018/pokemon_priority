# Pokédex — Nuxt 3 Take-Home Project

A full-stack Pokémon information website built with **Nuxt 3** (TypeScript + Vue 3) using the [PokéAPI](https://pokeapi.co/).

---

## Features

### Required
- **Landing page** — 60 Pokémon displayed in a responsive grid with name and thumbnail
- **Search filter** — Real-time filter by Pokémon name or Pokédex number (#)
- **Profile page** — Click any Pokémon to see a detailed profile including:
  - Large official artwork image
  - Name, Height, Weight
  - Abilities formatted as comma-delimited string (e.g., `Overgrow, Chlorophyll`)
  - Hidden ability labeled separately
  - Base stats with animated bars
  - Pokédex flavor text
  - Type badges with type-specific colors

### Bonus / Extras
- **Shiny toggle** — Switch between normal and shiny artwork on profile pages
- **Evolution chain** — Visual evolution chain with sprites and navigation
- **Surprise Me button** — Navigates to a random Pokémon from the list
- **Prev/Next navigation** — Arrow buttons on profile page to browse sequentially
- **Type glow effects** — Card hover glows match the Pokémon's primary type
- **Sticky search bar** — Search stays accessible while scrolling
- **Animated floating artwork** — Profile artwork gently floats
- **Catch Rate & Base EXP** — Additional metadata from species data
- **Legendary/Mythical badge** — Special label for rare Pokémon
- **Server-side API** — All PokeAPI calls go through Nuxt server routes (`/api/pokemon`)

---

## Architecture

```
pokedex/
├── server/
│   └── api/
│       └── pokemon/
│           ├── index.ts      ← GET /api/pokemon — lists 60 Pokémon
│           └── [name].ts     ← GET /api/pokemon/:name — full detail
├── pages/
│   ├── index.vue             ← Landing page with grid + search
│   └── pokemon/
│       └── [name].vue        ← Profile page
├── components/
│   ├── PokemonCard.vue       ← Card with sprite, name, types
│   ├── StatBar.vue           ← Animated base stat bar
│   └── EvoSprite.vue         ← Evolution chain sprite loader
├── composables/
│   └── useTypeColor.ts       ← Type → color mapping
├── layouts/
│   └── default.vue           ← Header, footer, global CSS
└── nuxt.config.ts
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:3000` by default.

---

## Design Decisions

- **No CSS libraries** — All styling is hand-written CSS using custom properties (variables) for theming
- **Dark theme** — High-contrast dark aesthetic suited to a Pokédex concept
- **Bebas Neue + DM Sans** — Display font for headers, clean readable body font
- **Type-aware colors** — Every Pokémon type has a consistent color used for badges, glows, and backgrounds
- **Progressive loading** — Sprites fade in on load, server routes handle parallelized PokeAPI requests
