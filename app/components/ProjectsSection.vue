<template>
  <section id="proyectos" class="projects-outer" ref="outerEl" :style="{ '--total-slots': totalSlots }">
    <div class="projects-sticky">
      <div class="projects__inner">

        <!-- Scroll progress bar -->
        <div class="scroll-bar">
          <div class="scroll-bar__fill" :style="{ width: scrollProgress * 100 + '%' }" />
        </div>

        <div class="section-eyebrow">{{ t('projects.eyebrow') }}</div>
        <h2 class="section-title">{{ t('projects.title') }}</h2>

        <!-- Timeline -->
        <div class="tl-outer">
          <div class="tl-fade tl-fade--l" />
          <div class="tl-fade tl-fade--r" />
          <div class="tl-scroll" ref="timelineEl">
            <div class="tl-track">
              <div class="tl-spacer" :style="{ width: spacerWidth }" />
              <button
                v-for="year in years"
                :key="year"
                :ref="(el) => { if (el) yearEls[year] = el as HTMLElement }"
                class="tl-node"
                :class="{
                  'tl-node--active': year === activeYear,
                  'tl-node--past':   year < activeYear,
                }"
                @click="jumpToYear(year)"
              >
                <span class="tl-node__count">{{ countByYear(year) }}</span>
                <span class="tl-node__dot" />
                <span class="tl-node__year">{{ year }}</span>
              </button>
              <div class="tl-spacer" :style="{ width: spacerWidth }" />
            </div>
          </div>
          <div class="tl-needle" />
        </div>

        <!-- Active year label + carousel nav -->
        <div class="tl-active-label">
          <div class="tl-active-label__left">
            <Transition name="year-label" mode="out-in">
              <span :key="activeYear" class="tl-active-label__year">{{ activeYear }}</span>
            </Transition>
            <span class="tl-active-label__count">
              · {{ filteredProjects.length }} {{ locale === 'es' ? 'proyectos' : 'projects' }}
            </span>
          </div>

          <div class="carousel-nav" v-if="showNav">
            <button class="carousel-btn" @click="scrollGrid(-1)" :disabled="!canScrollLeft" :aria-label="locale === 'es' ? 'Anterior' : 'Previous'">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="carousel-btn" @click="scrollGrid(1)" :disabled="!canScrollRight" :aria-label="locale === 'es' ? 'Siguiente' : 'Next'">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Projects carousel -->
        <div class="projects__grid-wrap">
          <div class="grid-edge-fade" :class="{ 'grid-edge-fade--visible': canScrollRight }" />
          <Transition name="grid" mode="out-in">
            <div :key="activeYear" class="projects__grid" ref="gridEl">
              <article
                v-for="(project, i) in filteredProjects"
                :key="project.slug"
                class="project-card"
                :style="{ '--i': i }"
                @mouseenter="hoveredIdx = i"
                @mouseleave="hoveredIdx = -1"
                :class="{ hovered: hoveredIdx === i }"
              >
                <div class="project-card__meta">
                  <span class="project-card__year">
                    <span class="project-card__dot" />
                    {{ project.year }} · {{ project.source }}
                  </span>
                  <span class="badge" :class="`badge--${project.status}`">
                    <span class="badge__dot" />
                    {{ project.status === 'ok' ? t('projects.shipped') : t('projects.wip') }}
                  </span>
                </div>

                <h3 class="project-card__title">{{ project.title }}</h3>
                <p class="project-card__desc">{{ locale === 'es' ? project.desc.es : project.desc.en }}</p>

                <div class="project-card__footer">
                  <div class="project-card__tags">
                    <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                  <div class="project-card__actions">
                    <span class="project-card__stat">{{ project.stats }}</span>
                    <NuxtLink :to="`/projects/${project.slug}`" class="project-card__link">
                      <span>{{ locale === 'es' ? 'Ver detalle' : 'View detail' }}</span>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </article>
            </div>
          </Transition>
        </div>

        <!-- Dot indicators -->
        <div class="grid-dots" v-if="showNav">
          <button
            v-for="(p, i) in filteredProjects"
            :key="p.slug"
            class="grid-dot"
            :class="{ 'grid-dot--active': i === activeCardIdx }"
            @click="scrollToCard(i)"
            :aria-label="p.title"
          />
        </div>

        <!-- Scroll hint -->
        <div class="scroll-hint" :class="{ 'scroll-hint--done': scrollProgress >= 0.95 }">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <rect x="1" y="1" width="14" height="18" rx="7" stroke="currentColor" stroke-width="1.2"/>
            <line class="scroll-hint__dot" x1="8" y1="5" x2="8" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>{{ locale === 'es' ? 'Scroll para explorar' : 'Scroll to explore' }}</span>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { projects } from '~/data/projects'

const { locale, t } = useLocale()

const hoveredIdx  = ref(-1)
const outerEl     = ref<HTMLElement | null>(null)
const timelineEl  = ref<HTMLElement | null>(null)
const gridEl      = ref<HTMLElement | null>(null)
const yearEls: Record<number, HTMLElement> = {}
const spacerWidth    = ref('200px')
const scrollProgress = ref(0)
const canScrollLeft  = ref(false)
const canScrollRight = ref(false)
const activeCardIdx  = ref(0)

const CARD_STEP = 360 // 340px card + 20px gap

const allProjects = projects

const years = computed(() =>
  [...new Set(allProjects.map(p => p.year))].sort((a, b) => a - b),
)

const activeYear = ref(years.value[0])

const filteredProjects = computed(() =>
  allProjects.filter(p => p.year === activeYear.value),
)

function countByYear(year: number) {
  return allProjects.filter(p => p.year === year).length
}

/* Years with > 3 projects get 2 scroll slots so the carousel scrolls before advancing year */
const slotsPerYear = computed(() => {
  const map: Record<number, number> = {}
  for (const y of years.value) {
    map[y] = countByYear(y) > 3 ? 2 : 1
  }
  return map
})

const totalSlots = computed(() =>
  years.value.reduce((s, y) => s + slotsPerYear.value[y], 0),
)

const showNav = computed(() => (slotsPerYear.value[activeYear.value] ?? 1) > 1)

/* Pan timeline to center a year */
function panToYear(year: number) {
  const el = yearEls[year]
  const container = timelineEl.value
  if (!el || !container) return
  const elRect   = el.getBoundingClientRect()
  const contRect = container.getBoundingClientRect()
  container.scrollLeft += elRect.left + elRect.width / 2 - (contRect.left + contRect.width / 2)
}

/* Scroll page so that the carousel lands on a target carouselScroll position within activeYear */
function scrollPageToCarousel(carouselScroll: number) {
  if (!outerEl.value || !gridEl.value) return
  const el = gridEl.value
  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= 0) return

  const within = Math.max(0, Math.min(1, carouselScroll / maxScroll))
  let slotsBefore = 0
  for (const y of years.value) {
    if (y === activeYear.value) break
    slotsBefore += slotsPerYear.value[y]
  }
  const slots    = slotsPerYear.value[activeYear.value] ?? 1
  const progress = (slotsBefore + within * slots) / totalSlots.value

  const outerH = outerEl.value.offsetHeight
  const viewH  = window.innerHeight
  const navH   = 60
  window.scrollTo({ top: outerEl.value.offsetTop - navH + progress * (outerH - viewH), behavior: 'smooth' })
}

function scrollGrid(dir: number) {
  const el = gridEl.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  scrollPageToCarousel(Math.max(0, Math.min(maxScroll, el.scrollLeft + dir * CARD_STEP)))
}

function scrollToCard(i: number) {
  scrollPageToCarousel(i * CARD_STEP)
}

/* Click on timeline node */
function jumpToYear(year: number) {
  if (!outerEl.value) return
  let slotsBefore = 0
  for (const y of years.value) {
    if (y === year) break
    slotsBefore += slotsPerYear.value[y]
  }
  const progress = slotsBefore / totalSlots.value + 0.005
  const outerH = outerEl.value.offsetHeight
  const viewH  = window.innerHeight
  const navH   = 60
  window.scrollTo({ top: outerEl.value.offsetTop - navH + progress * (outerH - viewH), behavior: 'smooth' })
}

/* Main scroll handler — drives both year and carousel */
function onWindowScroll() {
  if (!outerEl.value) return
  const outerH   = outerEl.value.offsetHeight
  const viewH    = window.innerHeight
  const navH     = 60
  const scrolled = window.scrollY - outerEl.value.offsetTop + navH
  const progress = Math.max(0, Math.min(1, scrolled / (outerH - viewH)))
  scrollProgress.value = progress

  const scrollSlot = progress * totalSlots.value

  /* Map scrollSlot → year + within-year progress */
  let accumulated = 0
  let newYear = years.value[0]
  let within  = 0
  for (const y of years.value) {
    const slots = slotsPerYear.value[y]
    if (scrollSlot < accumulated + slots) {
      newYear = y
      within  = (scrollSlot - accumulated) / slots
      break
    }
    accumulated += slots
    newYear = y
    within  = 1
  }

  if (newYear !== activeYear.value) {
    activeYear.value = newYear
    panToYear(newYear)
  }

  /* Drive carousel scroll */
  const el = gridEl.value
  if (el) {
    const maxScroll = el.scrollWidth - el.clientWidth
    const target    = within * maxScroll
    el.scrollLeft   = target
    canScrollLeft.value  = target > 4
    canScrollRight.value = target < maxScroll - 4
    activeCardIdx.value  = Math.round(target / CARD_STEP)
  }
}

onMounted(() => {
  nextTick(() => {
    if (timelineEl.value) {
      spacerWidth.value = `${timelineEl.value.clientWidth / 2}px`
      nextTick(() => panToYear(activeYear.value))
    }
  })
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll)
})
</script>

<style scoped>
/* ===== Scroll-driver outer shell ===== */
.projects-outer {
  height: calc(var(--total-slots, 5) * 100vh);
  position: relative;
}

/* Sticky inner content */
.projects-sticky {
  position: sticky;
  top: 60px;
  padding-bottom: 60px;
}

.projects__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 60px 40px 0;
}

/* Scroll progress bar */
.scroll-bar {
  height: 2px;
  background: var(--color-border);
  border-radius: 9999px;
  margin-bottom: 40px;
  overflow: hidden;
}
.scroll-bar__fill {
  height: 100%;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  border-radius: 9999px;
  transition: width .1s linear;
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
  margin: 0 0 40px;
  letter-spacing: -0.02em;
}

/* ===== Timeline ===== */
.tl-outer {
  position: relative;
  margin-bottom: 12px;
}

.tl-fade {
  position: absolute;
  top: 0; bottom: 0;
  width: 80px;
  z-index: 2;
  pointer-events: none;
}
.tl-fade--l { left:  0; background: linear-gradient(to right, var(--color-bg), transparent); }
.tl-fade--r { right: 0; background: linear-gradient(to left,  var(--color-bg), transparent); }

.tl-scroll {
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tl-scroll::-webkit-scrollbar { display: none; }

.tl-track {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-top: 28px;
  padding-bottom: 24px;
}
.tl-track::before {
  content: '';
  position: absolute;
  top: 61px;
  left: 0; right: 0;
  height: 1px;
  background: var(--color-border);
  pointer-events: none;
}

.tl-spacer { flex-shrink: 0; }

.tl-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 110px;
  padding: 0 16px;
  background: transparent;
  border: 0;
  cursor: pointer;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  transition: opacity .3s ease;
}
.tl-node:not(.tl-node--active):not(.tl-node--past) { opacity: .4; }

.tl-node__count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 2px 9px;
  line-height: 1.4;
  transition: color .3s ease, border-color .3s ease, background .3s ease;
}
.tl-node--active .tl-node__count {
  color: var(--color-primary);
  border-color: rgba(59,130,246,.4);
  background: rgba(59,130,246,.08);
}

.tl-node__dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-bg);
  transition: all .35s ease;
  flex-shrink: 0;
}
.tl-node--past .tl-node__dot {
  background: var(--color-muted);
  border-color: var(--color-muted);
}
.tl-node--active .tl-node__dot {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59,130,246,.2), 0 0 14px rgba(59,130,246,.5);
  transform: scale(1.3);
}

.tl-node__year {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted);
  letter-spacing: .5px;
  transition: color .3s ease, font-weight .2s ease;
}
.tl-node--active .tl-node__year { color: var(--color-heading); font-weight: 700; }
.tl-node--past   .tl-node__year { color: var(--color-muted); }

/* Center needle */
.tl-needle {
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(59,130,246,.5) 30%, rgba(59,130,246,.5) 70%, transparent);
  pointer-events: none;
  z-index: 1;
}

/* ===== Active year label + nav ===== */
.tl-active-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 20px;
}

.tl-active-label__left {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.tl-active-label__year {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.04em;
  line-height: 1;
  display: inline-block;
}
.tl-active-label__count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
}

.carousel-nav {
  display: flex;
  gap: 8px;
}

.carousel-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease, color .2s ease;
}
.carousel-btn:disabled { opacity: .25; cursor: not-allowed; }
.carousel-btn:not(:disabled):hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

/* Year label transition */
.year-label-enter-active { transition: opacity .2s ease, transform .2s ease; }
.year-label-leave-active { transition: opacity .15s ease, transform .15s ease; }
.year-label-enter-from   { opacity: 0; transform: translateY(8px); }
.year-label-leave-to     { opacity: 0; transform: translateY(-6px); }

/* ===== Grid wrapper + edge fade ===== */
.projects__grid-wrap {
  position: relative;
}

.grid-edge-fade {
  position: absolute;
  right: 0; top: 0; bottom: 16px;
  width: 120px;
  background: linear-gradient(to right, transparent, var(--color-bg) 85%);
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity .35s ease;
}
.grid-edge-fade--visible { opacity: 1; }

/* Grid transition */
.grid-enter-active { transition: opacity .35s ease .05s, transform .35s cubic-bezier(.2,.7,.2,1) .05s; }
.grid-leave-active { transition: opacity .2s ease; }
.grid-enter-from   { opacity: 0; transform: translateY(14px); }
.grid-leave-to     { opacity: 0; }

/* ===== Projects grid ===== */
.projects__grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  overflow: hidden; /* scroll is driven by JS, no manual scrolling */
  padding: 8px 0 16px;
}

/* ===== Dot indicators ===== */
.grid-dots {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 4px;
}

.grid-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-border);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background .25s ease, width .25s cubic-bezier(.2,.7,.2,1);
  flex-shrink: 0;
}
.grid-dot--active {
  width: 20px;
  background: var(--color-primary);
}

/* Scroll hint */
.scroll-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  opacity: 1;
  transition: opacity .5s ease;
}
.scroll-hint--done { opacity: 0; pointer-events: none; }
.scroll-hint__dot { animation: scroll-bounce 1.4s ease-in-out infinite; }
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(3px); }
}

/* ===== Project card ===== */
.project-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 22px;
  overflow: hidden;
  cursor: pointer;
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
  transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .3s ease, box-shadow .35s ease;
  will-change: transform;
  animation: card-in .4s cubic-bezier(.2,.7,.2,1) both;
  animation-delay: calc(var(--i, 0) * 60ms);
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(16px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.project-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  padding: 1px;
  background: conic-gradient(
    from var(--ang, 0deg),
    transparent 0deg,
    var(--color-primary) 40deg,
    var(--color-accent) 80deg,
    transparent 140deg,
    transparent 360deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
}
.project-card.hovered::before {
  opacity: 1;
  animation: jv-spin 4s linear infinite;
}
.project-card::after {
  content: '';
  position: absolute;
  left: 50%; bottom: -40%;
  width: 140%; height: 80%;
  transform: translateX(-50%);
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(59,130,246,.22), transparent 60%);
  opacity: 0;
  transition: opacity .4s ease;
}
.project-card.hovered {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: 0 20px 40px -20px rgba(59,130,246,.35), 0 0 0 1px rgba(59,130,246,.25);
}
.project-card.hovered::after { opacity: 1; }
.project-card:active { transform: translateY(-1px); }

.project-card__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.project-card__stat {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .3s ease .05s, transform .3s ease .05s, color .3s ease;
  white-space: nowrap;
}
.project-card.hovered .project-card__stat {
  opacity: 1;
  transform: translateY(0);
  color: var(--color-primary);
}

.project-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.project-card__year {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.project-card__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  flex-shrink: 0;
  animation: jv-pulse 2s ease-in-out infinite;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 9999px;
}
.badge--ok   { color: #22C55E; background: rgba(34,197,94,.08);  border: 1px solid rgba(34,197,94,.4);  }
.badge--warn { color: #FACC15; background: rgba(250,204,21,.08); border: 1px solid rgba(250,204,21,.4); }
.badge__dot  { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.project-card__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 4px 0 10px;
  letter-spacing: -0.02em;
  transition: color .3s ease;
}
.project-card.hovered .project-card__title { color: #fff; }

.project-card__desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0 0 18px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  margin-top: auto;
}
.project-card__tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 9px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  transition: color .25s ease, border-color .25s ease, background .25s ease;
}
.project-card.hovered .tag {
  color: var(--color-heading);
  border-color: rgba(59,130,246,.5);
  background: rgba(59,130,246,.08);
}
.project-card.hovered .tag:nth-child(2) { transition-delay: .05s; }

.project-card__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
  transition: color .3s ease;
}
.project-card.hovered .project-card__link { color: var(--color-accent); }
.project-card__link svg {
  transition: transform .4s cubic-bezier(.2,.7,.2,1);
  flex-shrink: 0;
}
.project-card.hovered .project-card__link svg { transform: translateX(6px); }

@media (max-width: 640px) {
  .projects__inner { padding: 40px 20px 0; }
  .tl-fade { width: 40px; }
  .project-card { flex: 0 0 280px; }
}
</style>
