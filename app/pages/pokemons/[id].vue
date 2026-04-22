<script setup lang="ts">
const { t } = useLocale()
const route = useRoute()
const rawId = route.params.id as string

/* ── PokeAPI types (minimal) ── */
interface PokemonData {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  sprites: {
    other: { 'official-artwork': { front_default: string } }
    front_default: string
  }
  types: Array<{ slot: number; type: { name: string } }>
  stats: Array<{ base_stat: number; stat: { name: string } }>
  abilities: Array<{ ability: { name: string; url: string }; is_hidden: boolean; slot: number }>
  moves: Array<{
    move: { name: string; url: string }
    version_group_details: Array<{ level_learned_at: number; move_learn_method: { name: string } }>
  }>
}

interface SpeciesData {
  is_legendary: boolean
  is_mythical: boolean
  capture_rate: number
  base_happiness: number
  gender_rate: number
  growth_rate: { name: string }
  egg_groups: Array<{ name: string }>
  genera: Array<{ genus: string; language: { name: string } }>
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string }; version: { name: string } }>
}

interface AbilityEffect {
  short_effect: string
}

interface MoveDetails {
  power: number | null
  accuracy: number | null
  pp: number | null
  type: { name: string }
  damage_class: { name: string }
}

/* ── fetch Pokemon + Species in parallel ── */
const [
  { data: pokemon, error: pokeError, pending: pokePending },
  { data: species },
] = await Promise.all([
  useAsyncData<PokemonData>(`pokemon-${rawId}`, () =>
    $fetch<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${rawId}`)
  ),
  useAsyncData<SpeciesData>(`species-${rawId}`, () =>
    $fetch<SpeciesData>(`https://pokeapi.co/api/v2/pokemon-species/${rawId}`)
  ),
])

/* ── Dynamic head ── */
useHead(computed(() => ({
  title: pokemon.value
    ? `${capitalize(pokemon.value.name)} #${String(pokemon.value.id).padStart(4, '0')} — PokéDex`
    : 'PokéDex',
})))

/* ── Helpers ── */
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const paddedId = computed(() => String(pokemon.value?.id ?? 0).padStart(4, '0'))

const sprite = computed(() =>
  pokemon.value?.sprites?.other?.['official-artwork']?.front_default
  ?? pokemon.value?.sprites?.front_default
  ?? ''
)

const types = computed(() => pokemon.value?.types.map(t => t.type.name) ?? [])

const genera = computed(() => {
  const entry = species.value?.genera?.find(g => g.language.name === 'en')
  return entry?.genus ?? ''
})

const flavorText = computed(() => {
  const entries = species.value?.flavor_text_entries ?? []
  const entry = entries.filter(e => e.language.name === 'en').at(-1)
  return entry?.flavor_text.replace(/\f/g, ' ').replace(/\u00ad/g, '') ?? ''
})

const genderText = computed(() => {
  const rate = species.value?.gender_rate ?? -1
  if (rate === -1) return t('poke.genderless')
  const female = (rate / 8) * 100
  const male = 100 - female
  return `${t('poke.genderMale')} ${male.toFixed(0)}% · ${t('poke.genderFemale')} ${female.toFixed(0)}%`
})

/* ── Stats ── */
const STAT_META: Record<string, { label: string; color: string }> = {
  'hp':              { label: 'HP',      color: '#22C55E' },
  'attack':          { label: 'ATK',     color: '#EF4444' },
  'defense':         { label: 'DEF',     color: '#F97316' },
  'special-attack':  { label: 'SP.ATK',  color: '#3B82F6' },
  'special-defense': { label: 'SP.DEF',  color: '#8B5CF6' },
  'speed':           { label: 'SPD',     color: '#FACC15' },
}

const stats = computed(() =>
  (pokemon.value?.stats ?? []).map(s => ({
    name:  s.stat.name,
    label: STAT_META[s.stat.name]?.label ?? s.stat.name,
    color: STAT_META[s.stat.name]?.color ?? '#94A3B8',
    value: s.base_stat,
    pct:   Math.round((s.base_stat / 255) * 100),
  }))
)

/* ── Moves/attacks ── */
const MOVE_BATCH_SIZE = 12
const visibleMoveCount = ref(MOVE_BATCH_SIZE)
const moveDetails = reactive<Record<string, MoveDetails>>({})

const orderedMoves = computed(() => {
  const list = pokemon.value?.moves ?? []
  return [...list]
    .map((m) => {
      const latest = m.version_group_details.at(-1)
      return {
        name: m.move.name,
        url: m.move.url,
        level: latest?.level_learned_at ?? 0,
        method: latest?.move_learn_method.name ?? 'unknown',
      }
    })
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level
      return a.name.localeCompare(b.name)
    })
})

const displayedMoves = computed(() => orderedMoves.value.slice(0, visibleMoveCount.value))
const hasMoreMoves = computed(() => displayedMoves.value.length < orderedMoves.value.length)

watch(displayedMoves, () => {
  if (import.meta.client) fetchVisibleMoveDetails()
}, { immediate: true })

async function fetchVisibleMoveDetails() {
  await Promise.all(
    displayedMoves.value
      .filter((m) => !moveDetails[m.name])
      .map(async (m) => {
        try {
          moveDetails[m.name] = await $fetch<MoveDetails>(m.url)
        } catch {
          moveDetails[m.name] = {
            power: null,
            accuracy: null,
            pp: null,
            type: { name: 'unknown' },
            damage_class: { name: 'unknown' },
          }
        }
      }),
  )
}

function showMoreMoves() {
  visibleMoveCount.value += MOVE_BATCH_SIZE
}

/* ── Abilities with descriptions ── */
interface AbilityEntry {
  name: string
  isHidden: boolean
  effect: string
}

const abilities = ref<AbilityEntry[]>([])

onMounted(async () => {
  if (!pokemon.value) return
  const results = await Promise.all(
    pokemon.value.abilities.map(async a => {
      try {
        const data = await $fetch<{ effect_entries: Array<{ short_effect: string; language: { name: string } }> }>(
          a.ability.url
        )
        const entry = data.effect_entries.find(e => e.language.name === 'en')
        return { name: a.ability.name, isHidden: a.is_hidden, effect: entry?.short_effect ?? '' }
      } catch {
        return { name: a.ability.name, isHidden: a.is_hidden, effect: '' }
      }
    })
  )
  abilities.value = results
})

/* ── Navigation ── */
function goBack() {
  navigateTo('/#live-lab')
}
</script>

<template>
  <div class="poke-detail">

    <!-- Loading -->
    <div v-if="pokePending" class="poke-detail__loading">
      <span class="poke-loading__dots">
        <span /><span /><span />
      </span>
      <span class="poke-loading__txt">{{ t('poke.loading') }}</span>
    </div>

    <!-- Error -->
    <div v-else-if="pokeError" class="poke-detail__error">
      <span class="error-code">404</span>
      <p>{{ t('poke.notFound') }}</p>
      <button class="back-btn" @click="goBack">{{ t('poke.back') }}</button>
    </div>

    <!-- Content -->
    <template v-else-if="pokemon">

      <!-- Top bar -->
      <div class="poke-topbar">
        <button class="back-btn" @click="goBack">{{ t('poke.back') }}</button>
        <div class="poke-topbar__badges">
          <span class="id-badge">#{{ paddedId }}</span>
          <span v-if="species?.is_legendary" class="status-badge status-badge--legendary">{{ t('poke.legendary') }}</span>
          <span v-if="species?.is_mythical"  class="status-badge status-badge--mythical">{{ t('poke.mythical') }}</span>
        </div>
      </div>

      <!-- Terminal card -->
      <div class="terminal">

        <!-- Title bar -->
        <div class="terminal__bar">
          <div class="terminal__dots">
            <span class="dot" style="background:#FF5F57" />
            <span class="dot" style="background:#FFBD2E" />
            <span class="dot" style="background:#28C840" />
          </div>
          <span class="terminal__url">pokeapi.co/api/v2/pokemon/{{ rawId }}</span>
        </div>

        <!-- Hero -->
        <div class="poke-hero">
          <div class="poke-hero__art">
            <img v-if="sprite" :src="sprite" :alt="pokemon.name" class="poke-hero__img" />
            <div v-else class="poke-hero__skeleton" />
          </div>

          <div class="poke-hero__info">
            <p v-if="genera" class="poke-hero__genera">{{ genera }}</p>
            <h1 class="poke-hero__name">{{ capitalize(pokemon.name) }}</h1>

            <div class="poke-hero__types">
              <span
                v-for="tp in types"
                :key="tp"
                class="type-badge"
                :class="`type-badge--${tp}`"
              >{{ tp.toUpperCase() }}</span>
            </div>

            <p v-if="flavorText" class="poke-hero__flavor">{{ flavorText }}</p>
          </div>
        </div>

        <div class="poke-body">

          <!-- Stats -->
          <section class="poke-section">
            <h2 class="poke-section__title">{{ t('poke.stats') }}</h2>
            <div class="stat-list">
              <div v-for="s in stats" :key="s.name" class="stat-row">
                <span class="stat-label">{{ s.label }}</span>
                <span class="stat-value">{{ s.value }}</span>
                <div class="stat-bar-track">
                  <div
                    class="stat-bar-fill"
                    :style="{ width: s.pct + '%', background: s.color }"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- Abilities -->
          <section class="poke-section">
            <h2 class="poke-section__title">{{ t('poke.abilities') }}</h2>
            <div class="ability-list">
              <div
                v-for="ab in pokemon.abilities"
                :key="ab.ability.name"
                class="ability-card"
              >
                <div class="ability-card__header">
                  <span class="ability-card__name">{{ ab.ability.name.replace(/-/g, ' ') }}</span>
                  <span v-if="ab.is_hidden" class="hidden-badge">{{ t('poke.hidden') }}</span>
                </div>
                <p class="ability-card__effect">
                  {{ abilities.find(a => a.name === ab.ability.name)?.effect || '—' }}
                </p>
              </div>
            </div>
          </section>

          <!-- Attacks -->
          <section class="poke-section poke-section--full">
            <h2 class="poke-section__title">{{ t('poke.attacks') }}</h2>
            <div class="move-list">
              <article
                v-for="mv in displayedMoves"
                :key="mv.name"
                class="move-card"
              >
                <div class="move-card__header">
                  <span class="move-card__name">{{ mv.name.replace(/-/g, ' ') }}</span>
                  <span class="move-card__method">{{ t('poke.learnedBy') }} {{ mv.method.replace(/-/g, ' ') }} · Lv. {{ mv.level }}</span>
                </div>
                <div class="move-meta-grid">
                  <div class="move-meta-item">
                    <span class="move-meta-key">{{ t('poke.power') }}</span>
                    <span class="move-meta-val">{{ moveDetails[mv.name]?.power ?? t('poke.unknown') }}</span>
                  </div>
                  <div class="move-meta-item">
                    <span class="move-meta-key">{{ t('poke.accuracy') }}</span>
                    <span class="move-meta-val">{{ moveDetails[mv.name]?.accuracy ?? t('poke.unknown') }}</span>
                  </div>
                  <div class="move-meta-item">
                    <span class="move-meta-key">{{ t('poke.pp') }}</span>
                    <span class="move-meta-val">{{ moveDetails[mv.name]?.pp ?? t('poke.unknown') }}</span>
                  </div>
                  <div class="move-meta-item">
                    <span class="move-meta-key">{{ t('poke.type') }}</span>
                    <span
                      class="type-badge move-type"
                      :class="`type-badge--${moveDetails[mv.name]?.type?.name || 'normal'}`"
                    >{{ (moveDetails[mv.name]?.type?.name || 'normal').toUpperCase() }}</span>
                  </div>
                  <div class="move-meta-item">
                    <span class="move-meta-key">{{ t('poke.category') }}</span>
                    <span class="move-meta-val">{{ moveDetails[mv.name]?.damage_class?.name ?? t('poke.unknown') }}</span>
                  </div>
                </div>
              </article>
            </div>
            <button v-if="hasMoreMoves" class="more-moves-btn" @click="showMoreMoves">
              {{ t('poke.showMoreMoves') }}
            </button>
          </section>

          <!-- Species data -->
          <section v-if="species" class="poke-section">
            <h2 class="poke-section__title">{{ t('poke.species') }}</h2>
            <dl class="species-grid">
              <div class="species-item">
                <dt>{{ t('poke.height') }}</dt>
                <dd>{{ (pokemon.height / 10).toFixed(1) }} m</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.weight') }}</dt>
                <dd>{{ (pokemon.weight / 10).toFixed(1) }} kg</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.baseExp') }}</dt>
                <dd>{{ pokemon.base_experience ?? '—' }}</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.capture') }}</dt>
                <dd>{{ species.capture_rate }}</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.happiness') }}</dt>
                <dd>{{ species.base_happiness }}</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.growth') }}</dt>
                <dd>{{ species.growth_rate.name.replace(/-/g, ' ') }}</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.egg') }}</dt>
                <dd>{{ species.egg_groups.map(g => g.name).join(', ') }}</dd>
              </div>
              <div class="species-item">
                <dt>{{ t('poke.gender') }}</dt>
                <dd>{{ genderText }}</dd>
              </div>
            </dl>
          </section>

        </div><!-- /poke-body -->
      </div><!-- /terminal -->
    </template>

  </div>
</template>

<style scoped src="~/assets/css/components/detail-pokemon.css">
</style>