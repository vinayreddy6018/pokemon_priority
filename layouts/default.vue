<template>
  <div class="app-wrapper">
    <header class="site-header">
      <NuxtLink to="/" class="logo-link">
        <span class="logo-icon">◈</span>
        <span class="logo-text">POKÉMON</span>
      </NuxtLink>
      <nav class="site-nav">
        <NuxtLink to="/" class="nav-link">Collection</NuxtLink>
      </nav>
    </header>
    <main class="site-main">
      <slot />
    </main>
    <footer class="site-footer">
      <span>Data from <a href="https://pokeapi.co/" target="_blank">PokéAPI</a></span>
    </footer>
  </div>
</template>

<style>
/* =============================================
   GLOBAL RESET & BASE STYLES
   ============================================= */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --red: #E53935;
  --red-dark: #B71C1C;
  --red-light: #FF6659;
  --black: #0D0D0D;
  --dark: #1A1A1A;
  --dark-2: #252525;
  --dark-3: #333333;
  --mid: #555555;
  --light: #CCCCCC;
  --white: #F5F5F5;
  --accent: #FFD600;
  --accent-2: #00E5FF;

  --type-fire: #FF6B35;
  --type-water: #0277BD;
  --type-grass: #2E7D32;
  --type-electric: #F9A825;
  --type-psychic: #AD1457;
  --type-ice: #006064;
  --type-dragon: #4527A0;
  --type-dark: #37474F;
  --type-fairy: #C2185B;
  --type-fighting: #BF360C;
  --type-poison: #6A1B9A;
  --type-ground: #8D6E63;
  --type-flying: #1565C0;
  --type-bug: #558B2F;
  --type-rock: #795548;
  --type-ghost: #311B92;
  --type-steel: #546E7A;
  --type-normal: #616161;

  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  --radius: 4px;
  --radius-lg: 12px;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);

  --transition: 0.2s ease;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--black);
  color: var(--white);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

/* =============================================
   LAYOUT
   ============================================= */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-main {
  flex: 1;
}

/* =============================================
   HEADER
   ============================================= */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  background: var(--dark);
  border-bottom: 2px solid var(--red);
  box-shadow: 0 2px 20px rgba(229, 57, 53, 0.2);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity var(--transition);
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-icon {
  color: var(--red);
  font-size: 1.5rem;
  animation: spin-slow 8s linear infinite;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.15em;
  color: var(--white);
}

.site-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--light);
  padding: 0.4rem 0;
  border-bottom: 2px solid transparent;
  transition: all var(--transition);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--white);
  border-bottom-color: var(--red);
}

/* =============================================
   FOOTER
   ============================================= */
.site-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--mid);
  border-top: 1px solid var(--dark-3);
}

.site-footer a {
  color: var(--red-light);
  transition: color var(--transition);
}

.site-footer a:hover {
  color: var(--red);
}
</style>
