import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Pokemon name is required' })
  }
  try {
    const [pokemon, speciesData] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(r => r.json()).catch(() => null)
    ])
    const abilities = pokemon.abilities.map((a: any) => ({
      name: a.ability.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      isHidden: a.is_hidden
    }))
    const types = pokemon.types.map((t: any) => t.type.name)
    const stats = pokemon.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat }))
    const flavorText = speciesData?.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text?.replace(/\f/g, ' ')?.replace(/\n/g, ' ') || null
    const evolutionChainUrl = speciesData?.evolution_chain?.url || null
    let evolutionChain: any[] = []
    if (evolutionChainUrl) {
      try {
        const evoData = await fetch(evolutionChainUrl).then(r => r.json())
        const parseChain = (node: any): any[] => {
          const result: any[] = [{ name: node.species.name }]
          if (node.evolves_to?.length > 0) result.push(...parseChain(node.evolves_to[0]))
          return result
        }
        evolutionChain = parseChain(evoData.chain)
      } catch { evolutionChain = [] }
    }
    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      abilities,
      types,
      stats,
      flavorText,
      evolutionChain,
      sprites: {
        front: pokemon.sprites.front_default,
        frontShiny: pokemon.sprites.front_shiny,
        artwork: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
        artworkShiny: pokemon.sprites.other?.['official-artwork']?.front_shiny || null,
        home: pokemon.sprites.other?.home?.front_default || null
      },
      baseExperience: pokemon.base_experience,
      genera: speciesData?.genera?.find((g: any) => g.language.name === 'en')?.genus || null,
      captureRate: speciesData?.capture_rate || null,
      isLegendary: speciesData?.is_legendary || false,
      isMythical: speciesData?.is_mythical || false
    }
  } catch (error: any) {
    throw createError({ statusCode: 404, statusMessage: `Pokemon "${name}" not found` })
  }
})
