import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=60&offset=0`
  ).then(r => r.json()) as { results: { name: string; url: string }[] }

  const pokemonList = response.results.map((p: { name: string; url: string }) => {
    const idMatch = p.url.match(/\/(\d+)\/$/)
    const id = idMatch ? parseInt(idMatch[1]) : 0
    return {
      id,
      name: p.name,
      url: p.url,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      spriteShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    }
  })

  return pokemonList
})
