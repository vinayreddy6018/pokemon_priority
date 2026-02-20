<script setup lang="ts">
interface Pokemon {
  id: number
  name: string
  sprite: string
  spriteShiny: string
}

const { data: pokemonList, pending, error } = await useFetch<Pokemon[]>('/api/pokemon', {
  query: { limit: 60 }
})

const searchQuery = ref('')
const activeType = ref('')

// We fetch types for cards progressively
const typeCache = ref<Record<string, string[]>>({})

const filteredPokemon = computed(() => {
  if (!pokemonList.value) return []
  let list = pokemonList.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p =>
      p.name.includes(q) ||
      String(p.id).includes(q)
    )
  }

  return list
})

const clearSearch = () => {
  searchQuery.value = ''
}

// Surprise me: pick a random pokemon and navigate to it
const router = useRouter()
const goRandom = () => {
  if (!pokemonList.value) return
  const pick = pokemonList.value[Math.floor(Math.random() * pokemonList.value.length)]
  router.push(`/pokemon/${pick.name}`)
}

// SEO
useHead({
  title: 'Pokédex — All Pokémon',
  meta: [{ name: 'description', content: 'Browse and search 60 Pokémon with detailed profiles.' }]
})
</script>

<template>
  <div class="home-page">

    <!-- Hero bar -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">POKÉMON</h1>
        <p class="hero-desc">Explore {{ filteredPokemon.length }} entries</p>
      </div>
      <div class="hero-deco">
        <div class="pokeball-deco">
          <div class="pb-top"></div>
          <div class="pb-band"></div>
          <div class="pb-bottom"></div>
          <div class="pb-button"></div>
        </div>
      </div>
    </section>

    <!-- Controls -->
    <section class="controls-bar">
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or #..."
          class="search-input"
          aria-label="Search Pokémon"
          autocomplete="off"
        />
        <button
          v-if="searchQuery"
          class="clear-btn"
          @click="clearSearch"
          aria-label="Clear search"
        >×</button>
      </div>

      <button class="random-btn" @click="goRandom" title="Go to a random Pokémon">
        <span>⚡</span> Surprise Me
      </button>
    </section>

    <!-- Grid -->
    <section class="grid-section">
      <div v-if="pending" class="loading-state">
        <div class="spinner"></div>
        <p>Loading Pokémon...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>Failed to load Pokémon. Please try again.</p>
      </div>

      <div v-else-if="filteredPokemon.length === 0" class="empty-state">
        <p>No Pokémon match "{{ searchQuery }}"</p>
        <button class="clear-btn-lg" @click="clearSearch">Clear search</button>
      </div>

      <div v-else class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in filteredPokemon"
          :key="pokemon.id"
          :id="pokemon.id"
          :name="pokemon.name"
          :sprite="pokemon.sprite"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* =============================================
   HOME PAGE
   ============================================= */
.home-page {
  min-height: calc(100vh - 64px);
}

/* HERO */
.hero {
  position: relative;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%);
  border-bottom: 1px solid var(--dark-3);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-sub {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--red-light);
  margin-bottom: 0.25rem;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: 0.1em;
  line-height: 1;
  color: var(--white);
  text-shadow: 0 0 60px rgba(229, 57, 53, 0.4);
}

.hero-desc {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--mid);
}

/* Decorative pokeball */
.hero-deco {
  position: relative;
  z-index: 1;
  opacity: 0.15;
}

.pokeball-deco {
  position: relative;
  width: 160px;
  height: 160px;
}

.pb-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: var(--red);
  border-radius: 80px 80px 0 0;
}

.pb-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: var(--white);
  border-radius: 0 0 80px 80px;
}

.pb-band {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 20px;
  background: var(--black);
  z-index: 1;
}

.pb-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--dark-3);
  border: 8px solid var(--black);
  z-index: 2;
}

/* CONTROLS */
.controls-bar {
  position: sticky;
  top: 64px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--dark-3);
}

.search-wrap {
  flex: 1;
  position: relative;
  max-width: 480px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  font-size: 1.2rem;
  color: var(--mid);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.5rem 0.65rem 2.5rem;
  background: var(--dark-2);
  border: 1px solid var(--dark-3);
  border-radius: var(--radius);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.9rem;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
}

.search-input::placeholder {
  color: var(--mid);
}

.search-input:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.15);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--mid);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem;
  line-height: 1;
  transition: color var(--transition);
}

.clear-btn:hover {
  color: var(--white);
}

.random-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  background: transparent;
  border: 1px solid var(--dark-3);
  border-radius: var(--radius);
  color: var(--light);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition);
}

.random-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 12px rgba(255, 214, 0, 0.2);
}

/* GRID */
.grid-section {
  padding: 2rem;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: var(--mid);
  font-size: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--dark-3);
  border-top-color: var(--red);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.clear-btn-lg {
  padding: 0.5rem 1.5rem;
  background: var(--red);
  border: none;
  border-radius: var(--radius);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background var(--transition);
}

.clear-btn-lg:hover {
  background: var(--red-light);
}

/* Responsive */
@media (max-width: 600px) {
  .hero {
    padding: 2rem 1rem;
  }
  .hero-deco {
    display: none;
  }
  .controls-bar {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
  }
  .search-wrap {
    max-width: 100%;
  }
  .grid-section {
    padding: 1rem;
  }
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
  }
}
</style>
