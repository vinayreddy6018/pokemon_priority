<script setup lang="ts">
const props = defineProps<{ name: string }>()

// Compute sprite URL from name using known ID ranges
// Fastest approach: use the consistent PokeAPI sprite URL which supports names via numeric IDs
// We'll fetch the ID on mount
const spriteUrl = ref(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`)
const loaded = ref(false)

onMounted(async () => {
  try {
    const data = await $fetch<{ id: number }>(`https://pokeapi.co/api/v2/pokemon/${props.name}`)
    spriteUrl.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
  } catch {
    // fallback silently
  }
})
</script>

<template>
  <img
    :src="spriteUrl"
    :alt="name"
    class="evo-sprite"
    @load="loaded = true"
  />
</template>

<style scoped>
.evo-sprite {
  width: 72px;
  height: 72px;
  object-fit: contain;
  image-rendering: pixelated;
}
</style>
