<script setup lang="ts">
interface Props {
  id: number
  name: string
  sprite: string
  types?: string[]
}

const props = defineProps<Props>()
const { getTypeStyle } = useTypeColor()

const formattedName = computed(() =>
  props.name.charAt(0).toUpperCase() + props.name.slice(1)
)

const paddedId = computed(() =>
  String(props.id).padStart(3, '0')
)

const isLoaded = ref(false)
</script>

<template>
  <NuxtLink :to="`/pokemon/${name}`" class="pokemon-card">
    <div class="card-inner">
      <span class="card-number">#{{ paddedId }}</span>
      <div class="card-sprite-wrap">
        <div class="sprite-glow" :class="types?.[0]"></div>
        <img
          :src="sprite"
          :alt="formattedName"
          class="card-sprite"
          :class="{ loaded: isLoaded }"
          loading="lazy"
          @load="isLoaded = true"
        />
      </div>
      <div class="card-info">
        <h3 class="card-name">{{ formattedName }}</h3>
        <div v-if="types" class="card-types">
          <span
            v-for="type in types"
            :key="type"
            class="type-badge"
            :style="getTypeStyle(type)"
          >{{ type }}</span>
        </div>
      </div>
    </div>
    <div class="card-shine"></div>
  </NuxtLink>
</template>

<style scoped>
.pokemon-card {
  display: block;
  position: relative;
  background: var(--dark-2);
  border: 1px solid var(--dark-3);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  will-change: transform;
}

.pokemon-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 40px rgba(229, 57, 53, 0.25);
  border-color: var(--red);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
  pointer-events: none;
}

.card-inner {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.card-number {
  align-self: flex-end;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--mid);
  letter-spacing: 0.05em;
}

.card-sprite-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sprite-glow {
  position: absolute;
  inset: 10%;
  border-radius: 50%;
  filter: blur(16px);
  opacity: 0.4;
  background: var(--mid);
  transition: opacity 0.3s ease;
}

.sprite-glow.fire     { background: #FF6B35; }
.sprite-glow.water    { background: #0277BD; }
.sprite-glow.grass    { background: #2E7D32; }
.sprite-glow.electric { background: #F9A825; }
.sprite-glow.psychic  { background: #AD1457; }
.sprite-glow.ice      { background: #00BCD4; }
.sprite-glow.dragon   { background: #4527A0; }
.sprite-glow.fairy    { background: #C2185B; }
.sprite-glow.ghost    { background: #311B92; }
.sprite-glow.dark     { background: #37474F; }
.sprite-glow.normal   { background: #888; }

.pokemon-card:hover .sprite-glow {
  opacity: 0.7;
}

.card-sprite {
  position: relative;
  width: 96px;
  height: 96px;
  object-fit: contain;
  image-rendering: pixelated;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card-sprite.loaded {
  opacity: 1;
  transform: scale(1);
}

.pokemon-card:hover .card-sprite {
  transform: scale(1.1);
}

.card-info {
  width: 100%;
  text-align: center;
}

.card-name {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.08em;
  color: var(--white);
  margin-bottom: 0.4rem;
}

.card-types {
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.type-badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
}
</style>
