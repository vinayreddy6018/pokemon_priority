<script setup lang="ts">
const route = useRoute()
const name = route.params.name as string

interface Ability {
  name: string
  isHidden: boolean
}

interface Stat {
  name: string
  value: number
}

interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  abilities: Ability[]
  types: string[]
  stats: Stat[]
  flavorText: string | null
  evolutionChain: { name: string }[]
  sprites: {
    front: string
    frontShiny: string | null
    artwork: string
    artworkShiny: string | null
    home: string | null
  }
  baseExperience: number | null
  genera: string | null
  captureRate: number | null
  isLegendary: boolean
  isMythical: boolean
}

const { data: pokemon, pending, error } = await useFetch<PokemonDetail>(`/api/pokemon/${name}`)

const { getTypeStyle } = useTypeColor()
const router = useRouter()

const isShiny = ref(false)
const currentArtwork = computed(() => {
  if (!pokemon.value) return ''
  if (isShiny.value && pokemon.value.sprites.artworkShiny) return pokemon.value.sprites.artworkShiny
  return pokemon.value.sprites.artwork
})

const paddedId = computed(() => pokemon.value ? String(pokemon.value.id).padStart(3, '0') : '')

const formattedName = computed(() => {
  if (!pokemon.value) return ''
  return pokemon.value.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

const abilitiesString = computed(() => {
  if (!pokemon.value) return ''
  return pokemon.value.abilities
    .filter(a => !a.isHidden)
    .map(a => a.name)
    .join(', ')
})

const hiddenAbility = computed(() => {
  if (!pokemon.value) return null
  return pokemon.value.abilities.find(a => a.isHidden) || null
})

// Height in meters and imperial
const heightMeters = computed(() => pokemon.value ? (pokemon.value.height / 10).toFixed(1) : '')
const weightKg = computed(() => pokemon.value ? (pokemon.value.weight / 10).toFixed(1) : '')

const rarityLabel = computed(() => {
  if (!pokemon.value) return null
  if (pokemon.value.isMythical) return 'Mythical'
  if (pokemon.value.isLegendary) return 'Legendary'
  return null
})

// Utilities
const capitalize = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

// Prev/next navigation
const prevId = computed(() => pokemon.value && pokemon.value.id > 1 ? pokemon.value.id - 1 : null)
const nextId = computed(() => pokemon.value ? pokemon.value.id + 1 : null)

const goTo = async (id: number) => {
  const res = await $fetch<{ name: string }>(`https://pokeapi.co/api/v2/pokemon/${id}`)
  router.push(`/pokemon/${res.name}`)
}

const typeGradient = computed(() => {
  if (!pokemon.value) return ''
  const types = pokemon.value.types
  const colors: Record<string, string> = {
    fire: '#FF6B35', water: '#0277BD', grass: '#2E7D32', electric: '#F9A825',
    psychic: '#AD1457', ice: '#006064', dragon: '#4527A0', dark: '#37474F',
    fairy: '#C2185B', fighting: '#BF360C', poison: '#6A1B9A', ground: '#795548',
    flying: '#1565C0', bug: '#558B2F', rock: '#8D6E63', ghost: '#311B92',
    steel: '#546E7A', normal: '#616161'
  }
  const c1 = colors[types[0]] || '#333'
  const c2 = types[1] ? (colors[types[1]] || '#1a1a1a') : 'var(--dark)'
  return `linear-gradient(135deg, ${c1}33 0%, ${c2}22 100%)`
})

// Update page title
watchEffect(() => {
  if (pokemon.value) {
    useHead({
      title: `${formattedName.value} — Pokédex`,
      meta: [{ name: 'description', content: pokemon.value.flavorText || `${formattedName.value} Pokémon profile.` }]
    })
  }
})
</script>

<template>
  <div class="profile-page">

    <div v-if="pending" class="loading-state">
      <div class="spinner"></div>
      <p>Loading {{ name }}...</p>
    </div>

    <div v-else-if="error || !pokemon" class="error-state">
      <p>Pokémon not found.</p>
      <NuxtLink to="/" class="back-link">← Back to Pokédex</NuxtLink>
    </div>

    <template v-else>
      <!-- Back nav + Prev/Next -->
      <div class="nav-bar">
        <NuxtLink to="/" class="back-link">
          <span>←</span> Pokédex
        </NuxtLink>
        <div class="nav-arrows">
          <button
            v-if="prevId"
            class="nav-arrow"
            @click="goTo(prevId)"
            title="Previous Pokémon"
          >#{{ prevId - 1 + 1 }} ←</button>
          <button
            v-if="nextId"
            class="nav-arrow"
            @click="goTo(nextId)"
            title="Next Pokémon"
          >→ #{{ nextId }}</button>
        </div>
      </div>

      <!-- Main card -->
      <div class="profile-layout">

        <!-- Left: Image panel -->
        <aside class="image-panel" :style="{ background: typeGradient }">
          <div class="id-badge">#{{ paddedId }}</div>

          <div v-if="rarityLabel" class="rarity-badge">{{ rarityLabel }}</div>

          <div class="artwork-wrap">
            <img
              :src="currentArtwork"
              :alt="formattedName"
              class="artwork-img"
              :class="{ shiny: isShiny }"
            />
          </div>

          <div class="types-row">
            <span
              v-for="type in pokemon.types"
              :key="type"
              class="type-pill"
              :style="getTypeStyle(type)"
            >{{ type }}</span>
          </div>

          <button
            v-if="pokemon.sprites.artworkShiny"
            class="shiny-toggle"
            :class="{ active: isShiny }"
            @click="isShiny = !isShiny"
            title="Toggle shiny form"
          >
            ✦ {{ isShiny ? 'Normal' : 'Shiny' }}
          </button>

          <p v-if="pokemon.genera" class="genera">{{ pokemon.genera }}</p>
        </aside>

        <!-- Right: Info panel -->
        <main class="info-panel">
          <h1 class="pokemon-name">{{ formattedName }}</h1>

          <p v-if="pokemon.flavorText" class="flavor-text">{{ pokemon.flavorText }}</p>

          <!-- Core stats grid -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Height</span>
              <span class="info-value">{{ heightMeters }}m</span>
            </div>
            <div class="info-item">
              <span class="info-label">Weight</span>
              <span class="info-value">{{ weightKg }}kg</span>
            </div>
            <div class="info-item">
              <span class="info-label">Base EXP</span>
              <span class="info-value">{{ pokemon.baseExperience ?? '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Catch Rate</span>
              <span class="info-value">{{ pokemon.captureRate ?? '—' }}</span>
            </div>
          </div>

          <!-- Abilities -->
          <div class="section">
            <h2 class="section-title">Abilities</h2>
            <p class="abilities-text">{{ abilitiesString }}</p>
            <p v-if="hiddenAbility" class="hidden-ability">
              <span class="hidden-label">Hidden:</span> {{ hiddenAbility.name }}
            </p>
          </div>

          <!-- Base Stats -->
          <div class="section">
            <h2 class="section-title">Base Stats</h2>
            <div class="stats-list">
              <StatBar
                v-for="stat in pokemon.stats"
                :key="stat.name"
                :name="stat.name"
                :value="stat.value"
              />
            </div>
          </div>

          <!-- Evolution Chain -->
          <div v-if="pokemon.evolutionChain.length > 1" class="section">
            <h2 class="section-title">Evolution Chain</h2>
            <div class="evo-chain">
              <template v-for="(evo, idx) in pokemon.evolutionChain" :key="evo.name">
                <NuxtLink :to="`/pokemon/${evo.name}`" class="evo-entry" :class="{ current: evo.name === pokemon.name }">
                  <EvoSprite :name="evo.name" />
                  <span class="evo-name">{{ capitalize(evo.name) }}</span>
                </NuxtLink>
                <span v-if="idx < pokemon.evolutionChain.length - 1" class="evo-arrow">→</span>
              </template>
            </div>
          </div>
        </main>
      </div>
    </template>
  </div>
</template>


<style scoped>
.profile-page {
  min-height: calc(100vh - 64px);
  padding-bottom: 3rem;
}

/* NAV BAR */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--dark-3);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--mid);
  transition: color var(--transition);
}

.back-link:hover {
  color: var(--white);
}

.nav-arrows {
  display: flex;
  gap: 0.75rem;
}

.nav-arrow {
  background: var(--dark-2);
  border: 1px solid var(--dark-3);
  border-radius: var(--radius);
  color: var(--light);
  font-family: var(--font-body);
  font-size: 0.8rem;
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  transition: all var(--transition);
}

.nav-arrow:hover {
  border-color: var(--red);
  color: var(--white);
}

/* LAYOUT */
.profile-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  min-height: calc(100vh - 64px - 57px);
}

/* IMAGE PANEL */
.image-panel {
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-right: 1px solid var(--dark-3);
  gap: 1rem;
}

.id-badge {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.3);
}

.rarity-badge {
  background: linear-gradient(135deg, var(--accent), #FF9100);
  color: var(--black);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.2rem 0.75rem;
  border-radius: 2px;
}

.artwork-wrap {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.artwork-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 30px rgba(0,0,0,0.6));
  transition: filter 0.5s ease, transform 0.5s ease;
  animation: float 4s ease-in-out infinite;
}

.artwork-img.shiny {
  filter: drop-shadow(0 8px 40px rgba(255, 214, 0, 0.8)) brightness(1.1);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.types-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.type-pill {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
}

.shiny-toggle {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: rgba(255,255,255,0.5);
  font-family: var(--font-body);
  font-size: 0.8rem;
  padding: 0.35rem 1rem;
  cursor: pointer;
  transition: all var(--transition);
}

.shiny-toggle.active {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 12px rgba(255,214,0,0.3);
}

.shiny-toggle:hover:not(.active) {
  border-color: rgba(255,255,255,0.4);
  color: var(--white);
}

.genera {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  font-style: italic;
}

/* INFO PANEL */
.info-panel {
  padding: 2.5rem 3rem;
  max-width: 680px;
}

.pokemon-name {
  font-family: var(--font-display);
  font-size: 3rem;
  letter-spacing: 0.1em;
  color: var(--white);
  line-height: 1;
  margin-bottom: 1rem;
}

.flavor-text {
  font-size: 0.95rem;
  color: var(--mid);
  line-height: 1.7;
  margin-bottom: 2rem;
  padding-left: 1rem;
  border-left: 2px solid var(--dark-3);
  font-style: italic;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: var(--dark-2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--dark-3);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mid);
}

.info-value {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--white);
}

/* Sections */
.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  color: var(--red-light);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--dark-3);
}

.abilities-text {
  font-size: 1rem;
  color: var(--white);
}

.hidden-ability {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--mid);
}

.hidden-label {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mid);
  margin-right: 0.3rem;
}

/* Stats */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Evolution chain */
.evo-chain {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.evo-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.75rem;
  background: var(--dark-2);
  border: 1px solid var(--dark-3);
  border-radius: var(--radius-lg);
  transition: all var(--transition);
  cursor: pointer;
}

.evo-entry:hover,
.evo-entry.current {
  border-color: var(--red);
  box-shadow: 0 0 16px rgba(229,57,53,0.2);
}

.evo-entry.current {
  background: rgba(229,57,53,0.08);
}

.evo-sprite {
  width: 72px;
  height: 72px;
  object-fit: contain;
  image-rendering: pixelated;
}

.evo-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--light);
  text-transform: capitalize;
}

.evo-arrow {
  font-size: 1.2rem;
  color: var(--dark-3);
}

/* States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  min-height: 50vh;
  color: var(--mid);
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

/* Responsive */
@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .image-panel {
    position: relative;
    top: auto;
    height: auto;
    padding: 2rem 1rem;
    border-right: none;
    border-bottom: 1px solid var(--dark-3);
  }

  .info-panel {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .nav-bar {
    padding: 0.75rem 1rem;
  }

  .pokemon-name {
    font-size: 2rem;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
