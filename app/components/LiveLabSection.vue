<template>
  <section id="live-lab" class="live-lab">
    <div class="live-lab__inner">
      <div class="section-eyebrow">{{ t('lab.eyebrow') }}</div>
      <h2 class="section-title">{{ t('lab.title') }}</h2>
      <p class="lab__lead">{{ t('lab.lead') }}</p>

      <!-- Terminal window -->
      <div class="terminal">

        <!-- Title bar -->
        <div class="terminal__bar">
          <div class="terminal__dots">
            <span class="dot" style="background:#FF5F57" />
            <span class="dot" style="background:#FFBD2E" />
            <span class="dot" style="background:#28C840" />
          </div>
          <span class="terminal__url">pokeapi.co/api/v2 · live</span>
          <span class="terminal__live">
            <span class="live-dot" />
            {{ cachedCount }} EN
          </span>
        </div>

        <!-- Search row -->
        <div class="terminal__search-row">
          <div class="terminal__search">
            <span class="search-circle">○</span>
            <input
              v-model="query"
              type="text"
              :placeholder="t('lab.searchPlaceholder')"
              class="search-input"
              spellcheck="false"
            />
          </div>
          <span class="results-count">{{ filteredPokemon.length }} RESULTS</span>
        </div>

        <!-- Type filters -->
        <div class="terminal__filters">
          <span class="filter-label">FILTER BY TYPE:</span>
          <div class="filter-pills">
            <button
              v-for="type in TYPES"
              :key="type"
              class="type-pill"
              :class="[`type-pill--${type}`, { 'type-pill--active': activeTypes.includes(type) }]"
              @click="toggleType(type)"
            >{{ type.toUpperCase() }}</button>
          </div>
        </div>

        <!-- Grid -->
        <div v-if="initialLoading" class="poke-loading">
          <span class="poke-loading__dots">
            <span /><span /><span />
          </span>
          <span class="poke-loading__txt">{{ t('lab.loading') }}</span>
        </div>

        <div v-else class="poke-grid">
          <div
            v-for="poke in displayedPokemon"
            :key="poke.id"
            class="poke-card"
            @click="openModal(poke.id)"
          >
            <span class="poke-card__num">#{{ String(poke.id).padStart(4, '0') }}</span>
            <div class="poke-card__img-wrap">
              <img
                v-if="poke.sprite"
                :src="poke.sprite"
                :alt="poke.name"
                class="poke-card__img"
                loading="lazy"
              />
              <div v-else class="poke-card__skeleton" />
            </div>
            <span class="poke-card__name">{{ poke.name }}</span>
            <div class="poke-card__types">
              <span
                v-for="tp in poke.types"
                :key="tp"
                class="type-badge"
                :class="`type-badge--${tp}`"
              >{{ tp.toUpperCase() }}</span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="terminal__pagination">
          <span class="pg-info">pg. {{ currentPage }} of {{ totalPages }}</span>
          <div class="pg-controls">
            <button class="pg-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">← prev</button>
            <template v-for="p in paginationPages" :key="String(p) + '-' + currentPage">
              <span v-if="p === '...'" class="pg-ellipsis">...</span>
              <button
                v-else
                class="pg-btn"
                :class="{ 'pg-btn--active': p === currentPage }"
                @click="goToPage(Number(p))"
              >{{ p }}</button>
            </template>
            <button class="pg-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">next →</button>
          </div>
        </div>

      </div><!-- /terminal -->
    </div>
  </section>

  <!-- Pokemon modal -->
  <Teleport to="body">
    <Transition name="poke-modal">
      <div
        v-if="modalPoke"
        class="poke-modal"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="poke-modal__card">
          <!-- Terminal header -->
          <div class="poke-modal__header">
            <div class="poke-modal__dots">
              <span style="background:#FF5F57" />
              <span style="background:#FFBD2E" />
              <span style="background:#28C840" />
            </div>
            <span class="poke-modal__id">
              #{{ String(modalPoke.id).padStart(4, '0') }} — {{ modalPoke.name }}
            </span>
            <button class="poke-modal__close" @click="closeModal" aria-label="Cerrar">✕</button>
          </div>

          <!-- Body -->
          <div class="poke-modal__body">
            <!-- Sprite -->
            <div class="poke-modal__sprite-wrap">
              <img
                v-if="modalPoke.sprite"
                :src="modalPoke.sprite"
                :alt="modalPoke.name"
                class="poke-modal__sprite"
              />
              <div v-else class="poke-modal__sprite-skeleton" />
            </div>

            <!-- Types -->
            <div class="poke-modal__types">
              <span
                v-for="tp in modalPoke.types"
                :key="tp"
                class="type-badge type-badge--lg"
                :class="`type-badge--${tp}`"
              >{{ tp.toUpperCase() }}</span>
            </div>

            <!-- Stats -->
            <div v-if="modalPoke.stats.length" class="poke-modal__stats">
              <div
                v-for="stat in modalPoke.stats.slice(0, 6)"
                :key="stat.name"
                class="poke-modal__stat-row"
              >
                <span class="poke-modal__stat-name">{{ formatStatName(stat.name) }}</span>
                <span class="poke-modal__stat-val">{{ stat.value }}</span>
                <div class="poke-modal__stat-bar">
                  <div
                    class="poke-modal__stat-fill"
                    :class="statColor(stat.value)"
                    :style="{ width: `${Math.min(100, (stat.value / 180) * 100)}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- CTA -->
            <button class="poke-modal__cta" @click="goToDetail(modalPoke.id)">
              {{ t('lab.viewDetail') }} →
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useLocale()

const ITEMS_PER_PAGE = 12

const TYPES = [
  'normal','fire','water','grass','electric','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy',
]

/* ── state ── */
const allPokemon      = ref<Array<{ id: number; name: string }>>([])
const detailsCache    = reactive<Record<number, { sprite: string; types: string[]; stats: { name: string; value: number }[] }>>({})
const typeIdCache: Record<string, Set<number>> = {}

const query           = ref('')
const debouncedQuery  = ref('')
const activeTypes     = ref<string[]>([])
const activeTypeIds   = ref<Set<number> | null>(null)
const currentPage     = ref(1)
const initialLoading  = ref(true)
const totalCount      = ref(1025)

/* ── modal state ── */
const modalPoke = ref<{
  id: number
  name: string
  sprite: string
  types: string[]
  stats: { name: string; value: number }[]
} | null>(null)

const cachedCount = computed(() => Object.keys(detailsCache).length)

/* ── debounce search ── */
let debounceTimer: ReturnType<typeof setTimeout>
watch(query, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val.toLowerCase().trim()
    currentPage.value = 1
  }, 350)
})

/* ── filtered list ── */
const filteredPokemon = computed(() => {
  let list = allPokemon.value
  if (debouncedQuery.value) {
    const q = debouncedQuery.value
    list = list.filter(p => p.name.includes(q) || String(p.id) === q)
  }
  if (activeTypeIds.value !== null) {
    list = list.filter(p => activeTypeIds.value!.has(p.id))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPokemon.value.length / ITEMS_PER_PAGE)))

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredPokemon.value.slice(start, start + ITEMS_PER_PAGE)
})

const displayedPokemon = computed(() =>
  pageItems.value.map(p => ({
    id:     p.id,
    name:   p.name,
    sprite: detailsCache[p.id]?.sprite ?? '',
    types:  detailsCache[p.id]?.types  ?? [],
  }))
)

/* ── fetch details on page change ── */
watch(pageItems, () => {
  if (import.meta.client) fetchCurrentPage()
})

async function fetchCurrentPage() {
  await Promise.all(
    pageItems.value
      .filter(p => !detailsCache[p.id])
      .map(fetchDetail)
  )
}

async function fetchDetail(p: { id: number }) {
  if (detailsCache[p.id]) return
  try {
    const res  = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`)
    const data = await res.json()
    detailsCache[p.id] = {
      sprite: data.sprites?.other?.['official-artwork']?.front_default
              ?? data.sprites?.front_default
              ?? '',
      types: (data.types as Array<{ type: { name: string } }>).map(t => t.type.name),
      stats: (data.stats as Array<{ base_stat: number; stat: { name: string } }>)
             .map(s => ({ name: s.stat.name, value: s.base_stat })),
    }
  } catch { /* network/rate error — silently skip */ }
}

/* ── type filter ── */
async function toggleType(type: string) {
  const idx = activeTypes.value.indexOf(type)
  idx >= 0 ? activeTypes.value.splice(idx, 1) : activeTypes.value.push(type)
  currentPage.value = 1

  if (activeTypes.value.length === 0) {
    activeTypeIds.value = null
    return
  }

  const sets  = await Promise.all(activeTypes.value.map(fetchTypeIds))
  const first = new Set([...sets[0]])
  activeTypeIds.value = sets.length === 1
    ? first
    : new Set([...first].filter(id => sets.slice(1).every(s => s.has(id))))
}

async function fetchTypeIds(type: string): Promise<Set<number>> {
  if (typeIdCache[type]) return typeIdCache[type]
  const res  = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
  const data = await res.json()
  const ids  = new Set<number>(
    (data.pokemon as Array<{ pokemon: { url: string } }>)
      .map(p => parseInt(p.pokemon.url.split('/').filter(Boolean).pop() ?? '0'))
      .filter(id => id > 0 && id <= 1025)
  )
  typeIdCache[type] = ids
  return ids
}

/* ── pagination ── */
const paginationPages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | string)[] = [1]
  if (cur > 3)          pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2)  pages.push('...')
  pages.push(total)
  return pages
})

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  document.getElementById('live-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── modal ── */
async function openModal(id: number) {
  const base = allPokemon.value.find(p => p.id === id)
  if (!base) return
  if (!detailsCache[id]) await fetchDetail({ id })
  modalPoke.value = {
    id,
    name:   base.name,
    sprite: detailsCache[id]?.sprite ?? '',
    types:  detailsCache[id]?.types  ?? [],
    stats:  detailsCache[id]?.stats  ?? [],
  }
}

function closeModal() {
  modalPoke.value = null
}

function goToDetail(id: number) {
  closeModal()
  navigateTo(`/pokemons/${id}`)
}

function formatStatName(name: string): string {
  const map: Record<string, string> = {
    hp: 'HP', attack: 'ATK', defense: 'DEF',
    'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD',
  }
  return map[name] ?? name
}

function statColor(val: number): string {
  if (val >= 100) return 'stat--high'
  if (val >= 60)  return 'stat--mid'
  return 'stat--low'
}

/* ── keyboard close ── */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

/* ── initial load ── */
onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  try {
    const res  = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0')
    const data = await res.json()
    allPokemon.value = (data.results as Array<{ name: string }>).map((p, i) => ({
      id:   i + 1,
      name: p.name,
    }))
    totalCount.value = data.count ?? 1025
  } finally {
    initialLoading.value = false
    await fetchCurrentPage()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.live-lab {
  padding: 120px 40px;
}
.live-lab__inner {
  max-width: var(--container-max);
  margin: 0 auto;
}
.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--color-heading);
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
}
.lab__lead {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0 0 40px 0;
  max-width: 640px;
}

/* ── Terminal window ── */
.terminal {
  background: #0B1220;
  border: 1px solid #1E2D45;
  border-radius: 12px;
  overflow: hidden;
}

/* Title bar */
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
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
}
.terminal__live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #22C55E;
}
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 6px #22C55E;
  animation: jv-pulse 2s ease-in-out infinite;
}

/* Search row */
.terminal__search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #1E2D45;
}
.terminal__search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #0F1A2E;
  border: 1px solid #1E2D45;
  border-radius: 6px;
  padding: 0 12px;
}
.search-circle {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-muted);
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-heading);
  padding: 9px 0;
}
.search-input::placeholder { color: #3D5068; }
.results-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  white-space: nowrap;
}

/* Type filters */
.terminal__filters {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid #1E2D45;
  flex-wrap: wrap;
}
.filter-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 1px;
  padding-top: 3px;
  white-space: nowrap;
  flex-shrink: 0;
}
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.type-pill {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .5px;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all .15s ease;
  background: transparent;
  color: var(--color-muted);
  border-color: #1E2D45;
}
.type-pill:hover { color: var(--color-heading); border-color: #334155; }

.type-pill--active.type-pill--normal   { background:#6D6D4E; color:#fff; border-color:#6D6D4E; }
.type-pill--active.type-pill--fire     { background:#9C531F; color:#fff; border-color:#9C531F; }
.type-pill--active.type-pill--water    { background:#445E9C; color:#fff; border-color:#445E9C; }
.type-pill--active.type-pill--grass    { background:#4E8234; color:#fff; border-color:#4E8234; }
.type-pill--active.type-pill--electric { background:#A1871F; color:#fff; border-color:#A1871F; }
.type-pill--active.type-pill--ice      { background:#638D8D; color:#fff; border-color:#638D8D; }
.type-pill--active.type-pill--fighting { background:#7D1F1A; color:#fff; border-color:#7D1F1A; }
.type-pill--active.type-pill--poison   { background:#682A68; color:#fff; border-color:#682A68; }
.type-pill--active.type-pill--ground   { background:#927D44; color:#fff; border-color:#927D44; }
.type-pill--active.type-pill--flying   { background:#6D5E9C; color:#fff; border-color:#6D5E9C; }
.type-pill--active.type-pill--psychic  { background:#A13959; color:#fff; border-color:#A13959; }
.type-pill--active.type-pill--bug      { background:#6D7815; color:#fff; border-color:#6D7815; }
.type-pill--active.type-pill--rock     { background:#786824; color:#fff; border-color:#786824; }
.type-pill--active.type-pill--ghost    { background:#493963; color:#fff; border-color:#493963; }
.type-pill--active.type-pill--dragon   { background:#4924A1; color:#fff; border-color:#4924A1; }
.type-pill--active.type-pill--dark     { background:#49392F; color:#fff; border-color:#49392F; }
.type-pill--active.type-pill--steel    { background:#787887; color:#fff; border-color:#787887; }
.type-pill--active.type-pill--fairy    { background:#9B6470; color:#fff; border-color:#9B6470; }

/* Loading state */
.poke-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
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
  font-size: 12px;
  color: var(--color-muted);
}

/* ── Pokemon grid ── */
.poke-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1px;
  background: #1E2D45;
  border-top: 1px solid #1E2D45;
}
.poke-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px 12px;
  background: #0B1220;
  cursor: pointer;
  transition: background .2s ease, transform .15s ease;
}
.poke-card:hover {
  background: #0F1A2E;
  transform: translateY(-2px);
}

.poke-card__num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: #2D4A6E;
  align-self: flex-start;
}
.poke-card__img-wrap {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.poke-card__img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  image-rendering: auto;
}
.poke-card__skeleton {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: linear-gradient(90deg, #1E2D45 25%, #253650 50%, #1E2D45 75%);
  background-size: 200% 100%;
  animation: skeleton-sweep 1.4s ease infinite;
}
.poke-card__name {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-heading);
  text-transform: capitalize;
  text-align: center;
}
.poke-card__types {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Type badges */
.type-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: .4px;
  padding: 2px 7px;
  border-radius: 3px;
  color: #fff;
  font-weight: 600;
}
.type-badge--lg {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 5px;
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

/* ── Pagination ── */
.terminal__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #1E2D45;
}
.pg-info {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
}
.pg-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pg-btn {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #1E2D45;
  border-radius: 4px;
  color: var(--color-muted);
  cursor: pointer;
  transition: all .15s ease;
  white-space: nowrap;
}
.pg-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-heading);
}
.pg-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff !important;
}
.pg-btn:disabled { opacity: .35; cursor: default; }
.pg-ellipsis {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  padding: 0 4px;
}

/* ═══════════════════════════════════════════════════════════════
   Pokemon Modal
   ═══════════════════════════════════════════════════════════════ */
.poke-modal {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(4, 10, 22, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.poke-modal__card {
  background: #0B1220;
  border: 1px solid #1E2D45;
  border-radius: 14px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.08);
}

/* Modal header (terminal bar style) */
.poke-modal__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #0D1726;
  border-bottom: 1px solid #1E2D45;
}
.poke-modal__dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.poke-modal__dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}
.poke-modal__id {
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
  text-transform: capitalize;
  letter-spacing: 0.5px;
}
.poke-modal__close {
  background: transparent;
  border: none;
  color: var(--color-muted);
  font-size: 13px;
  cursor: pointer;
  padding: 3px 7px;
  border-radius: 4px;
  line-height: 1;
  transition: color .2s, background .2s;
  flex-shrink: 0;
}
.poke-modal__close:hover {
  color: var(--color-heading);
  background: rgba(255, 255, 255, 0.06);
}

/* Modal body */
.poke-modal__body {
  padding: 24px 22px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

/* Sprite */
.poke-modal__sprite-wrap {
  width: 168px;
  height: 168px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.poke-modal__sprite {
  width: 168px;
  height: 168px;
  object-fit: contain;
  filter: drop-shadow(0 4px 24px rgba(59, 130, 246, 0.35));
  animation: jv-float-sprite 4s ease-in-out infinite;
}
.poke-modal__sprite-skeleton {
  width: 168px;
  height: 168px;
  border-radius: 12px;
  background: linear-gradient(90deg, #1E2D45 25%, #253650 50%, #1E2D45 75%);
  background-size: 200% 100%;
  animation: skeleton-sweep 1.4s ease infinite;
}

/* Types */
.poke-modal__types {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Stats */
.poke-modal__stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.poke-modal__stat-row {
  display: grid;
  grid-template-columns: 58px 30px 1fr;
  align-items: center;
  gap: 8px;
}
.poke-modal__stat-name {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 0.5px;
}
.poke-modal__stat-val {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-heading);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.poke-modal__stat-bar {
  height: 5px;
  background: #1A2A40;
  border-radius: 3px;
  overflow: hidden;
}
.poke-modal__stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.7s cubic-bezier(.22,1,.36,1);
}
.stat--high { background: #22C55E; }
.stat--mid  { background: #FACC15; }
.stat--low  { background: #F97316; }

/* CTA button */
.poke-modal__cta {
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.5px;
  padding: 9px 24px;
  border-radius: 7px;
  border: 1px solid var(--color-primary);
  background: rgba(59, 130, 246, 0.08);
  color: var(--color-primary);
  cursor: pointer;
  transition: background .2s ease, color .2s ease, box-shadow .2s ease;
}
.poke-modal__cta:hover {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.4);
}

/* ── Modal transition ─────────────────────────────────────────── */
.poke-modal-enter-active {
  transition: opacity 0.22s ease;
}
.poke-modal-leave-active {
  transition: opacity 0.18s ease;
}
.poke-modal-enter-from,
.poke-modal-leave-to {
  opacity: 0;
}
.poke-modal-enter-active .poke-modal__card {
  transition: transform 0.28s cubic-bezier(.34,1.4,.64,1), opacity 0.22s ease;
}
.poke-modal-leave-active .poke-modal__card {
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.poke-modal-enter-from .poke-modal__card {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}
.poke-modal-leave-to .poke-modal__card {
  transform: scale(0.94) translateY(8px);
  opacity: 0;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes skeleton-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes jv-float-sprite {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

@media (max-width: 640px) {
  .live-lab { padding: 80px 20px; }
  .poke-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
  .terminal__bar { flex-wrap: wrap; }
  .poke-modal__card { max-width: 340px; }
  .poke-modal__sprite-wrap,
  .poke-modal__sprite { width: 140px; height: 140px; }
}
</style>
