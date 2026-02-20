// composables/useTypeColor.ts
export const useTypeColor = () => {
  const typeColors: Record<string, { bg: string; text: string }> = {
    fire:     { bg: '#FF6B35', text: '#fff' },
    water:    { bg: '#0277BD', text: '#fff' },
    grass:    { bg: '#2E7D32', text: '#fff' },
    electric: { bg: '#F9A825', text: '#000' },
    psychic:  { bg: '#AD1457', text: '#fff' },
    ice:      { bg: '#006064', text: '#fff' },
    dragon:   { bg: '#4527A0', text: '#fff' },
    dark:     { bg: '#37474F', text: '#fff' },
    fairy:    { bg: '#C2185B', text: '#fff' },
    fighting: { bg: '#BF360C', text: '#fff' },
    poison:   { bg: '#6A1B9A', text: '#fff' },
    ground:   { bg: '#795548', text: '#fff' },
    flying:   { bg: '#1565C0', text: '#fff' },
    bug:      { bg: '#558B2F', text: '#fff' },
    rock:     { bg: '#8D6E63', text: '#fff' },
    ghost:    { bg: '#311B92', text: '#fff' },
    steel:    { bg: '#546E7A', text: '#fff' },
    normal:   { bg: '#616161', text: '#fff' },
  }

  const getTypeStyle = (type: string) => {
    const color = typeColors[type] || { bg: '#555', text: '#fff' }
    return {
      backgroundColor: color.bg,
      color: color.text,
    }
  }

  return { getTypeStyle, typeColors }
}
