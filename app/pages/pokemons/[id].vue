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

<style scoped>
/* ── Page wrapper ── */
.poke-detail {
  min-height: 100vh;
  padding: 40px 40px 80px;
  max-width: var(--container-max);
  margin: 0 auto;
  animation: pFadeUp .45s ease both;
  animation-fill-mode: both;
  opacity: 0;
  transform: translateY(20px);
}
@keyframes pFadeUp { to { opacity: 1; transform: translateY(0); } }

/* ── Loading / Error ── */
.poke-detail__loading,
.poke-detail__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 60vh;
}
.poke-loading__dots {
  display: flex;
  gap: 6px;
}
.poke-loading__dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: jv-pulse 1.2s ease-in-out infinite;
}
.poke-loading__dots span:nth-child(2) { animation-delay: .2s; }
.poke-loading__dots span:nth-child(3) { animation-delay: .4s; }
.poke-loading__txt {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-muted);
}
.error-code {
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  color: var(--color-border);
  line-height: 1;
}

/* ── Top bar ── */
.poke-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.poke-topbar__badges {
  display: flex;
  align-items: center;
  gap: 8px;
}
.back-btn {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  cursor: pointer;
  transition: color var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease);
}
.back-btn:hover {
  color: var(--color-heading);
  border-color: var(--color-primary);
}
.id-badge {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
  background: #1E293B;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 5px 12px;
}
.status-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}
.status-badge--legendary { background: #92400E; color: #FDE68A; border: 1px solid #B45309; }
.status-badge--mythical  { background: #4C1D95; color: #DDD6FE; border: 1px solid #7C3AED; }

/* ── Terminal card ── */
.terminal {
  background: #0B1220;
  border: 1px solid #1E2D45;
  border-radius: 12px;
  overflow: hidden;
}
.terminal__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #0D1726;
  border-bottom: 1px solid #1E2D45;
}
.terminal__dots {
  display: flex;
  gap: 7px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.terminal__url {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
}

/* ── Hero ── */
.poke-hero {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  border-bottom: 1px solid #1E2D45;
}
.poke-hero__art {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #0D1726 0%, #0B1220 100%);
  border-right: 1px solid #1E2D45;
}
.poke-hero__img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.25));
}
.poke-hero__skeleton {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(90deg, #1E2D45 25%, #253650 50%, #1E2D45 75%);
  background-size: 200% 100%;
  animation: skeleton-sweep 1.4s ease infinite;
}
.poke-hero__info {
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}
.poke-hero__genera {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}
.poke-hero__name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900;
  color: var(--color-heading);
  line-height: 1.1;
  margin: 0;
  letter-spacing: -0.02em;
}
.poke-hero__types {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.poke-hero__flavor {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-muted);
  margin: 0;
  max-width: 420px;
  font-style: italic;
}

/* ── Type badges ── */
.type-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .5px;
  padding: 4px 10px;
  border-radius: 4px;
  color: #fff;
  font-weight: 600;
}
.type-badge--normal   { background:#6D6D4E; }
.type-badge--fire     { background:#9C531F; }
.type-badge--water    { background:#445E9C; }
.type-badge--grass    { background:#4E8234; }
.type-badge--electric { background:#A1871F; }
.type-badge--ice      { background:#638D8D; }
.type-badge--fighting { background:#7D1F1A; }
.type-badge--poison   { background:#682A68; }
.type-badge--ground   { background:#927D44; }
.type-badge--flying   { background:#6D5E9C; }
.type-badge--psychic  { background:#A13959; }
.type-badge--bug      { background:#6D7815; }
.type-badge--rock     { background:#786824; }
.type-badge--ghost    { background:#493963; }
.type-badge--dragon   { background:#4924A1; }
.type-badge--dark     { background:#49392F; }
.type-badge--steel    { background:#787887; }
.type-badge--fairy    { background:#9B6470; }

/* ── Body grid ── */
.poke-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
.poke-section {
  padding: 28px 28px 32px;
  border-right: 1px solid #1E2D45;
  border-bottom: 1px solid #1E2D45;
}
.poke-section--full {
  grid-column: 1 / -1;
  border-right: none;
}
.poke-section:nth-child(2n) { border-right: none; }
.poke-section:nth-last-child(-n+2) { border-bottom: none; }
.poke-section__title {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--color-primary);
  margin: 0 0 18px 0;
  font-weight: 400;
}

/* ── Stats ── */
.stat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stat-row {
  display: grid;
  grid-template-columns: 60px 38px 1fr;
  align-items: center;
  gap: 10px;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 1px;
}
.stat-value {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-heading);
  text-align: right;
}
.stat-bar-track {
  height: 6px;
  background: #1E2D45;
  border-radius: 999px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width .6s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 0 6px currentColor;
}

/* ── Abilities ── */
.ability-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ability-card {
  background: #0D1726;
  border: 1px solid #1E2D45;
  border-radius: 8px;
  padding: 12px 14px;
}
.ability-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.ability-card__name {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-heading);
  text-transform: capitalize;
}
.hidden-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  color: #FDE68A;
  background: #92400E;
  border: 1px solid #B45309;
  border-radius: 4px;
  padding: 2px 6px;
}
.ability-card__effect {
  font-size: 12px;
  line-height: 1.55;
  color: var(--color-muted);
  margin: 0;
}

/* ── Attacks ── */
.move-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.move-card {
  background: #0D1726;
  border: 1px solid #1E2D45;
  border-radius: 8px;
  padding: 12px 14px;
}
.move-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}
.move-card__name {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-heading);
  text-transform: capitalize;
}
.move-card__method {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
}
.move-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.move-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.move-meta-key {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-muted);
}
.move-meta-val {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-heading);
  text-transform: capitalize;
}
.move-type {
  width: fit-content;
  padding: 2px 8px;
}
.more-moves-btn {
  margin-top: 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  background: transparent;
  border: 1px solid #1E2D45;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all .15s ease;
}
.more-moves-btn:hover {
  color: var(--color-heading);
  border-color: var(--color-primary);
}

/* ── Species data ── */
.species-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  margin: 0;
}
.species-item dt {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 3px;
}
.species-item dd {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-heading);
  margin: 0;
  text-transform: capitalize;
}

/* ── Animations ── */
@keyframes skeleton-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .poke-hero {
    grid-template-columns: 1fr;
  }
  .poke-hero__art {
    border-right: none;
    border-bottom: 1px solid #1E2D45;
    padding: 30px 20px;
  }
  .poke-hero__info {
    padding: 24px 20px;
  }
  .poke-body {
    grid-template-columns: 1fr;
  }
  .poke-section {
    border-right: none;
  }
  .poke-section:nth-last-child(-n+2) { border-bottom: 1px solid #1E2D45; }
  .poke-section:last-child { border-bottom: none; }
}
@media (max-width: 640px) {
  .poke-detail { padding: 24px 16px 60px; }
  .species-grid { grid-template-columns: 1fr; }
  .move-list { grid-template-columns: 1fr; }
  .move-meta-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
