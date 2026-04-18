<template>
  <nav class="jv-nav">
    <a href="#inicio" class="jv-nav__brand">
      <span class="jv-nav__dot" />
      Juan Vasquez
    </a>

    <div class="jv-nav__actions">
      <div class="jv-lang">
        <button :class="{ on: locale === 'es' }" @click="setLocale('es')">ES</button>
        <button :class="{ on: locale === 'en' }" @click="setLocale('en')">EN</button>
      </div>

      <button class="jv-cv">
        {{ t('nav.cv') }}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v8m0 0L3 6.5m3 2.5l3-2.5M2 10.5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <button class="jv-ib jv-theme" aria-label="theme" @click="dark = !dark">
        <svg v-if="dark" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 9.5A4 4 0 0 1 6.5 4.5a4.5 4.5 0 1 0 5 5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/>
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.2 3.2l1.5 1.5M11.3 11.3l1.5 1.5M3.2 12.8l1.5-1.5M11.3 4.7l1.5-1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </button>

      <button
        class="jv-ib jv-ham"
        :class="{ open: menuOpen }"
        aria-label="menu"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>
    </div>
  </nav>

  <!-- Sweep overlay circle -->
  <div class="jv-sweep" :class="{ on: menuOpen }" />

  <!-- Full-screen menu -->
  <div class="jv-menu" :class="{ on: menuOpen }">
    <a
      v-for="(item, i) in menuItems"
      :key="item.id"
      :href="`#${item.id}`"
      @click="menuOpen = false"
    >
      <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>{{ t(item.labelKey) }}
    </a>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useLocale()

const menuOpen = ref(false)
const dark = ref(true)

const menuItems = [
  { id: 'inicio',    labelKey: 'menu.home' },
  { id: 'sobre',     labelKey: 'menu.about' },
  { id: 'stack',     labelKey: 'menu.stack' },
  { id: 'proyectos', labelKey: 'menu.projects' },
  { id: 'contacto',  labelKey: 'menu.contact' },
]

watch(menuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<style scoped>
.jv-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  background: rgba(15,23,42,.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(148,163,184,.1);
}

.jv-nav__brand {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: #F8FAFC;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
.jv-nav__brand:hover { color: #F8FAFC; }

.jv-nav__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 10px #22C55E;
  flex-shrink: 0;
}

.jv-nav__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Language toggle */
.jv-lang {
  display: flex;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  border: 1px solid rgba(148,163,184,.2);
  border-radius: 9999px;
  overflow: hidden;
  background: rgba(15,23,42,.4);
}
.jv-lang button {
  background: transparent;
  border: 0;
  color: var(--color-muted);
  padding: 6px 12px;
  cursor: pointer;
  transition: color .2s ease, background .2s ease;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
}
.jv-lang button.on {
  background: var(--color-primary);
  color: #fff;
}
.jv-lang button:not(.on):hover {
  color: #F8FAFC;
}

/* CV button */
.jv-cv {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: #F8FAFC;
  background: transparent;
  border: 1px solid rgba(148,163,184,.25);
  padding: 7px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: border-color .2s ease, background .2s ease, box-shadow .25s ease;
}
.jv-cv svg { transition: transform .3s cubic-bezier(.3,.7,.3,1); }
.jv-cv:hover {
  border-color: var(--color-primary);
  background: rgba(59,130,246,.14);
  box-shadow: 0 0 0 3px rgba(59,130,246,.12);
}
.jv-cv:hover svg { transform: translateY(2px); }

/* Icon button base */
.jv-ib {
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: 1px solid rgba(148,163,184,.2);
  background: rgba(15,23,42,.4);
  color: #F8FAFC;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color .2s ease, background .2s ease, transform .2s ease, color .2s ease;
}
.jv-ib:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(59,130,246,.1);
}
.jv-ib:active { transform: scale(.94); }

/* Theme icon rotation */
.jv-theme svg { transition: transform .5s cubic-bezier(.3,.7,.3,1); }
.jv-theme:hover svg { transform: rotate(25deg); }

/* Hamburger */
.jv-ham { position: relative; }
.jv-ham span {
  display: block;
  position: absolute;
  left: 9px;
  width: 18px;
  height: 1.5px;
  background: #F8FAFC;
  border-radius: 2px;
  transition: transform .35s cubic-bezier(.3,.7,.3,1), top .25s ease, opacity .2s ease, background .2s ease;
}
.jv-ham span:nth-child(1) { top: 13px; }
.jv-ham span:nth-child(2) { top: 18px; }
.jv-ham span:nth-child(3) { top: 23px; }
.jv-ham:hover span { background: var(--color-primary); }
.jv-ham.open span:nth-child(1) { top: 18px; transform: rotate(45deg);  background: #fff; }
.jv-ham.open span:nth-child(2) { opacity: 0; }
.jv-ham.open span:nth-child(3) { top: 18px; transform: rotate(-45deg); background: #fff; }

/* Sweep overlay */
.jv-sweep {
  position: fixed;
  top: 36px;
  right: 46px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563EB 0%, #6366F1 50%, #0EA5E9 100%);
  transform: translate(50%, -50%) scale(0);
  transform-origin: center;
  transition: transform .9s cubic-bezier(.7,0,.3,1);
  pointer-events: none;
  z-index: 90;
  box-shadow: 0 0 80px rgba(59,130,246,.6);
}
.jv-sweep.on {
  transform: translate(50%, -50%) scale(80);
}

/* Full-screen menu */
.jv-menu {
  position: fixed;
  inset: 0;
  z-index: 91;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12vw;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease .4s;
}
.jv-menu.on {
  opacity: 1;
  pointer-events: auto;
}
.jv-menu a {
  display: block;
  font-family: var(--font-display);
  font-weight: 900;
  color: #fff;
  text-decoration: none;
  font-size: clamp(40px, 7vw, 80px);
  line-height: 1.02;
  letter-spacing: -0.04em;
  padding: 8px 0;
  transform: translateY(30px);
  opacity: 0;
  transition: transform .5s cubic-bezier(.2,.7,.2,1), opacity .4s ease, color .2s ease;
}
.jv-menu.on a { transform: translateY(0); opacity: 1; }
.jv-menu.on a:nth-child(1) { transition-delay: .55s; }
.jv-menu.on a:nth-child(2) { transition-delay: .62s; }
.jv-menu.on a:nth-child(3) { transition-delay: .69s; }
.jv-menu.on a:nth-child(4) { transition-delay: .76s; }
.jv-menu.on a:nth-child(5) { transition-delay: .83s; }
.jv-menu a:hover { color: #FACC15; }

.idx {
  font-family: var(--font-mono);
  font-size: 14px;
  color: rgba(255,255,255,.65);
  margin-right: 18px;
  font-weight: 400;
  letter-spacing: 2px;
  vertical-align: middle;
}
</style>
