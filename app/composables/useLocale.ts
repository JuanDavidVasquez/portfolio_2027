type Locale = 'es' | 'en'

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  es: {
    'nav.cv': 'Descargar CV',
    'hero.available': 'Disponible para proyectos',
    'hero.tagline': 'Software Developer · Fullstack · 5+ años',
    'hero.cta1': 'Ver proyectos',
    'hero.cta2': 'Contactar',
    'about.eyebrow': '01 · Sobre mí',
    'about.title': 'Desarrollador enfocado en arquitectura y detalle.',
    'about.p1': 'Desarrollador de software con más de 5 años construyendo APIs robustas, arquitecturas escalables y productos modernos con tecnologías web actuales.',
    'about.p2': 'Experiencia en backend, frontend, despliegue en la nube y automatización CI/CD — además de integrar inteligencia artificial en productos reales. Código limpio, escalable y mantenible.',
    'about.yearsLabel': 'años exp.',
    'about.projectsLabel': 'proyectos',
    'about.cloudsLabel': 'nubes',
    'about.languagesLabel': 'idiomas',
    'stack.eyebrow': '02 · Stack',
    'stack.title': 'Herramientas con las que construyo.',
    'stack.frameworks': 'frameworks',
    'stack.languages': 'lenguajes',
    'stack.databases': 'bases de datos',
    'stack.cloud': 'cloud & devops',
    'stack.ai': 'inteligencia artificial',
    'projects.eyebrow': '03 · Proyectos',
    'projects.title': 'Trabajo reciente.',
    'projects.shipped': 'en producción',
    'projects.wip': 'en desarrollo',
    'projects.all': 'todos',
    'projects.fullstack': 'fullstack',
    'projects.backend': 'backend',
    'projects.frontend': 'frontend',
    'contact.eyebrow': '04 · Contacto',
    'contact.title': 'Conversemos.',
    'contact.lead': '¿Tienes un proyecto en mente o buscas ayuda técnica? Escríbeme y te respondo en menos de 48h.',
    'contact.name': 'nombre',
    'contact.email': 'correo',
    'contact.message': 'mensaje',
    'contact.submit': 'Enviar',
    'contact.sent': 'Mensaje enviado',
    'contact.location': 'Colombia · remoto',
    'contact.err.name': 'El nombre es obligatorio',
    'contact.err.email': 'Correo inválido',
    'contact.err.message': 'Mínimo 10 caracteres',
    'footer.built': 'construido con Nuxt 4 + PrimeVue',
    'footer.status': 'todos los sistemas operativos',
    'menu.home': 'Inicio',
    'menu.about': 'Sobre mí',
    'menu.stack': 'Stack',
    'menu.projects': 'Proyectos',
    'menu.contact': 'Contacto',
  },
  en: {
    'nav.cv': 'Download CV',
    'hero.available': 'Available for projects',
    'hero.tagline': 'Software Developer · Fullstack · 5+ years',
    'hero.cta1': 'View projects',
    'hero.cta2': 'Get in touch',
    'about.eyebrow': '01 · About',
    'about.title': 'Developer focused on architecture and detail.',
    'about.p1': 'Software developer with 5+ years building robust APIs, scalable architectures and modern products with current web tech.',
    'about.p2': 'Experience across backend, frontend, cloud deployment and CI/CD automation — plus integrating AI into real products. Clean, scalable, maintainable code.',
    'about.yearsLabel': 'years exp.',
    'about.projectsLabel': 'projects',
    'about.cloudsLabel': 'clouds',
    'about.languagesLabel': 'languages',
    'stack.eyebrow': '02 · Stack',
    'stack.title': 'Tools I build with.',
    'stack.frameworks': 'frameworks',
    'stack.languages': 'languages',
    'stack.databases': 'databases',
    'stack.cloud': 'cloud & devops',
    'stack.ai': 'artificial intelligence',
    'projects.eyebrow': '03 · Projects',
    'projects.title': 'Recent work.',
    'projects.shipped': 'shipped',
    'projects.wip': 'in progress',
    'projects.all': 'all',
    'projects.fullstack': 'fullstack',
    'projects.backend': 'backend',
    'projects.frontend': 'frontend',
    'contact.eyebrow': '04 · Contact',
    'contact.title': "Let's talk.",
    'contact.lead': 'Have a project in mind or need technical help? Drop me a message — I reply within 48h.',
    'contact.name': 'name',
    'contact.email': 'email',
    'contact.message': 'message',
    'contact.submit': 'Send',
    'contact.sent': 'Message sent',
    'contact.location': 'Colombia · remote',
    'contact.err.name': 'Name is required',
    'contact.err.email': 'Invalid email',
    'contact.err.message': 'Minimum 10 characters',
    'footer.built': 'built with Nuxt 4 + PrimeVue',
    'footer.status': 'all systems operational',
    'menu.home': 'Home',
    'menu.about': 'About',
    'menu.stack': 'Stack',
    'menu.projects': 'Projects',
    'menu.contact': 'Contact',
  },
}

const locale = ref<Locale>('es')

export function useLocale() {
  if (import.meta.client) {
    const stored = localStorage.getItem('portafolio.locale')
    if (stored === 'es' || stored === 'en') locale.value = stored
  }

  function setLocale(l: Locale) {
    locale.value = l
    if (import.meta.client) localStorage.setItem('portafolio.locale', l)
  }

  function t(key: string): string {
    return TRANSLATIONS[locale.value][key] ?? key
  }

  return { locale: readonly(locale), setLocale, t }
}
