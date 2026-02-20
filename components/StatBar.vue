<script setup lang="ts">
interface Props {
  name: string
  value: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), { max: 255 })

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp.ATK',
  'special-defense': 'Sp.DEF',
  speed: 'SPD',
}

const displayName = computed(() => statNames[props.name] || props.name.toUpperCase())
const percentage = computed(() => Math.min((props.value / props.max) * 100, 100))

const barColor = computed(() => {
  if (props.value >= 100) return '#00E676'
  if (props.value >= 70) return '#69F0AE'
  if (props.value >= 50) return '#FFD600'
  if (props.value >= 30) return '#FF9100'
  return '#FF5252'
})

const mounted = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true })
})
</script>

<template>
  <div class="stat-row">
    <span class="stat-label">{{ displayName }}</span>
    <span class="stat-value">{{ value }}</span>
    <div class="stat-bar-track">
      <div
        class="stat-bar-fill"
        :style="{
          width: mounted ? `${percentage}%` : '0%',
          backgroundColor: barColor
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: 5rem 2.5rem 1fr;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mid);
}

.stat-value {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--white);
  text-align: right;
}

.stat-bar-track {
  height: 6px;
  background: var(--dark-3);
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
