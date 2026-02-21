# Pokémon — Nuxt 3 Take-Home Project

A full-stack Pokémon information website built with **Nuxt 3** (TypeScript + Vue 3) using the [PokéAPI](https://pokeapi.co/).

This is a full-stack Pokémon application built with Nuxt 3, Vue 3, and TypeScript. It features a searchable list of Pokémon and detailed profile pages powered by PokéAPI as the data source.

The application features both mandatory core functionality (list, search, detail view) and additional functionality like shiny sprite toggle, evolution chains, previous/next navigation, and responsive design.

The application design keeps the frontend UI code separate from the backend data fetching by employing Nuxt server API routes as a data adapter layer.
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
POKEMON_PRIORITY/
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
---
# Implementation Details
Data Flow
User accesses homepage
Frontend requests /api/pokemon
Server retrieves PokéAPI data
Server transforms response
Frontend renders card grid
User clicks a Pokémon card
Route navigates to /pokemon/:name
Frontend requests /api/pokemon/:name
Server aggregates detailed data
Detail page renders formatted profile
---
# Data Normalization
Abilities are separated into normal and hidden
Stats are mapped into clean objects
Evolution chain is flattened for display
English flavor text is extracted from species entries
---
# Edge Cases Handled
- Invalid Pokémon name → Returns 404
- Empty search results → Displays empty state
- Network/API failure → Error state shown
- Missing English flavor text → Safe fallback
- Pokémon without evolution → Single-node chain
# Performance Considerations
- Existing Optimizations
- Server-side response processing
- Parallel API requests using Promise.all
- Lazy image loading
- Computed properties for derived values
- Limited fetch (first 60 Pokémon only)
# How to Improve Performance Further
- Implement server-side API caching (memory or Redis)
- Add HTTP caching headers
- Use incremental static regeneration (ISR)
- Optimize images using CDN or Nuxt image module
- Add pagination or infinite scroll
- Debounce search input
- Enable compression (gzip/brotli)
- Add service worker for asset caching
- Prefetch next/previous Pokémon data
- Use route-level code splitting
# Testing Strategy
- Recommended Tools
- Vitest
- Vue Test Utils
- Testing Library
- Cypress (for E2E testing)
# Example Unit Test Cases
- Component Tests
- PokemonCard renders correct name
- PokemonCard emits click event
- StatBar calculates correct width percentage
- EvoSprite builds correct sprite URL
# Page Tests
- Search filters correctly by name
- Detail page displays correct Pokémon data
- 404 page renders for invalid Pokémon
- Evolution chain renders correct number of nodes
# How to Improve Test Coverage
- Mock PokéAPI responses
- Add snapshot testing for UI stability
- Test loading, error, and empty states
- Add integration tests for navigation flow
- Measure coverage with --coverage
- Test edge cases (empty stats, missing evolution, API timeout)
- Add accessibility testing with axe-core
# Accessibility (WCAG)
- The project is designed with accessibility in mind.
- Current Accessibility Practices
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for Pokémon images
- Keyboard-accessible navigation
- Sufficient color contrast
- Focus states for interactive elements
# Improvements to Strengthen WCAG Compliance
- Add ARIA labels where necessary
- Implement "Skip to Content" link
- Ensure all interactive elements are reachable via keyboard
- Validate color contrast ratios for type badges
- Test with screen readers (NVDA / VoiceOver)
- Avoid color-only indicators
- Ensure proper landmark roles (main, nav, footer)
# Future Improvements
- Add pagination for full Pokédex
- Implement favorites system (localStorage or database)
- Add advanced filtering by type
- Add Pokémon comparison feature
- Add complete Pokédex (all generations)
- Implement server-side caching layer
- Add authentication and user profiles
- Deploy with CI/CD pipeline
- Add analytics monitoring