export interface ProjectColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface Project {
  slug: string
  year: number
  title: string
  context: { es: string; en: string }
  desc: { es: string; en: string }
  architecture: {
    type: string
    decisions: string[]
  }
  tech: {
    frontend?: string[]
    backend?: string[]
    realtime?: string[]
    database?: string[]
    infra?: string[]
    analytics?: string[]
  }
  ui: {
    typography: string[]
    colors: ProjectColors
    design: string
    animations: string[]
  }
  flows: string[]
  highlights: string[]
  performance: { es: string; en: string }
  impact: { es: string; en: string }
  stats: string
  status: 'ok' | 'warn'
  cat: 'fullstack' | 'backend' | 'frontend'
  source: 'cliente' | 'open source'
}

export const projects: Project[] = [
  {
    slug: 'one-lesson-per-day',
    year: 2025,
    title: 'One Lesson Per Day',

    context: {
      es: 'Plataforma integral desarrollada para organizaciones de rescate y adopción animal, que digitaliza y automatiza el proceso completo: registro de animales, historial médico, calendarios de vacunación y desparasitación, gestión de citas veterinarias y seguimiento post-adopción. Construida sobre una arquitectura de microservicios con API Gateway para escalar cada dominio de forma independiente.',
      en: 'Comprehensive platform built for animal rescue and adoption organizations, fully digitalizing the process: animal registration, medical history, vaccination and deworming schedules, vet appointment management and post-adoption follow-up. Built on a microservices architecture with API Gateway for independent scaling of each domain.',
    },

    desc: {
      es: 'Plataforma de gestión animal con microservicios NestJS, cubriendo adopciones, historial médico y calendario de vacunación.',
      en: 'Animal management platform with NestJS microservices, covering adoptions, medical history and vaccination scheduling.',
    },

    architecture: {
      type: 'Microservices + API Gateway + Clean Architecture',
      decisions: [
        'Microservicios independientes por dominio (adopciones, historial médico, vacunación)',
        'API Gateway centralizado para enrutamiento, autenticación y rate limiting',
        'PostgreSQL por servicio para aislamiento y consistencia de datos',
        'Pipeline CI/CD con pruebas automatizadas por servicio',
      ],
    },

    tech: {
      frontend: ['Nuxt 4'],
      backend: ['NestJS'],
      database: ['PostgreSQL'],
      infra: ['AWS', 'CI/CD'],
    },

    ui: {
      typography: ['Inter', 'Geist'],
      colors: {
        primary: '#0F172A',
        secondary: '#6366F1',
        accent: '#10B981',
        background: '#F8FAFC',
        text: '#1E293B',
      },
      design: 'Panel administrativo orientado a eficiencia operativa, con flujos guiados y estructuras de datos claras para personal de refugios',
      animations: ['Transiciones de estado en flujos de adopción', 'Indicadores de progreso en calendarios médicos'],
    },

    flows: [
      'Ingreso de animal rescatado → creación de ficha con historial médico inicial',
      'Solicitud de adopción → proceso de validación, entrevista y aprobación',
      'Agendamiento de vacuna → notificación automática al responsable con recordatorio',
      'Cita veterinaria → registro de diagnóstico y actualización del historial',
      'Seguimiento post-adopción → actualización de estado y bienestar del animal',
    ],

    highlights: [
      'Arquitectura de microservicios con desacople total entre dominios de negocio',
      'API Gateway como punto único de entrada con autenticación centralizada',
      'Soporte multilenguaje (i18n) con contexto por región',
      'Pipeline CI/CD con pruebas automáticas por cada servicio',
    ],

    performance: {
      es: 'Cada microservicio escala de forma independiente; el API Gateway aplica rate limiting y caching para proteger servicios downstream.',
      en: 'Each microservice scales independently; the API Gateway applies rate limiting and caching to protect downstream services.',
    },

    impact: {
      es: 'Digitalización completa del proceso de adopción, reducción de errores en registros médicos y mejora en la tasa de seguimiento post-adopción.',
      en: 'Full digitalization of the adoption process, reduced errors in medical records and improved post-adoption follow-up rates.',
    },

    stats: 'Producción · Escalable',
    status: 'ok',
    cat: 'fullstack',
    source: 'cliente',
  },

  {
    slug: 'homi',
    year: 2024,
    title: 'Homi',

    context: {
      es: 'Plataforma diseñada para administradores de conjuntos residenciales que centraliza el control de accesos (residentes, visitantes y domiciliarios), gestión de parqueaderos, préstamos de zonas comunes, cobros de cuotas, reportes de cartera y administración general. Construida con NestJS bajo arquitectura limpia y frontend en Nuxt 4.',
      en: 'Platform designed for residential complex administrators centralizing access control (residents, visitors and deliveries), parking management, common area bookings, fee billing, delinquency reporting and general administration. Built with NestJS under clean architecture and Nuxt 4 frontend.',
    },

    desc: {
      es: 'Sistema de administración residencial con control de accesos, parqueaderos, pagos y reportes. NestJS + Nuxt 4.',
      en: 'Residential administration system covering access control, parking, payments and reporting. NestJS + Nuxt 4.',
    },

    architecture: {
      type: 'Monolito Modular + Clean Architecture',
      decisions: [
        'Arquitectura limpia con separación estricta de dominio, aplicación e infraestructura',
        'Control de accesos separado por tipo (residente, visitante, domiciliario)',
        'Almacenamiento de documentos y fotografías en AWS S3 con URLs firmadas',
        'MySQL como base relacional para garantizar integridad en datos financieros',
      ],
    },

    tech: {
      frontend: ['Nuxt 4'],
      backend: ['NestJS'],
      database: ['MySQL'],
      infra: ['AWS S3'],
    },

    ui: {
      typography: ['Inter', 'DM Sans'],
      colors: {
        primary: '#1E3A5F',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: '#F1F5F9',
        text: '#0F172A',
      },
      design: 'Interfaz administrativa orientada a claridad operativa, con dashboards diferenciados por rol y navegación jerárquica por módulo',
      animations: ['Transiciones en modales de registro de acceso', 'Feedback visual en validación de autorización'],
    },

    flows: [
      'Residente llega → portería registra acceso con validación en tiempo real',
      'Visitante ingresa → registro con foto, destino y autorización del residente',
      'Domiciliario → QR temporal generado por el residente desde la plataforma',
      'Cobro de cuota → registro, validación y actualización automática de estado de cartera',
      'Reserva de zona común → calendario con confirmación automática y notificación',
    ],

    highlights: [
      'Control de accesos multi-tipo con trazabilidad y registro fotográfico',
      'Gestión de cartera con reportes de mora exportables en múltiples formatos',
      'Almacenamiento seguro de documentos en AWS S3 con URLs firmadas',
      'Arquitectura limpia que facilita extensión de módulos sin ruptura del sistema',
    ],

    performance: {
      es: 'Arquitectura modular que permite escalar módulos de forma independiente; consultas optimizadas para reportes de alto volumen de datos financieros.',
      en: 'Modular architecture enabling independent module scaling; optimized queries for high-volume financial data reporting.',
    },

    impact: {
      es: 'Reducción significativa del tiempo en gestión de accesos, eliminación de registros manuales en papel y mayor transparencia en cobros para residentes.',
      en: 'Significant reduction in access management time, elimination of paper-based records and greater billing transparency for residents.',
    },

    stats: 'Producción · Alto uso',
    status: 'ok',
    cat: 'fullstack',
    source: 'cliente',
  },

  {
    slug: 'crms',
    year: 2024,
    title: 'CRMS',

    context: {
      es: 'Sistema desarrollado para centralizar la operación de call centers, cubriendo la captura de datos de ventas por asesor, validación en back office y control de calidad, y generación de reportes por asesor, supervisor y campaña. Incorpora predicción de ventas basada en datos históricos para apoyar la toma de decisiones estratégicas.',
      en: 'System built to centralize call center operations, covering sales data capture per agent, back office and quality control validation, and reporting by agent, supervisor and campaign. Incorporates data-driven sales forecasting to support strategic decision-making.',
    },

    desc: {
      es: 'Sistema end-to-end para call centers con captura, validación multi-etapa, reportes de ventas y predicción basada en datos históricos.',
      en: 'End-to-end call center system with capture, multi-stage validation, sales reporting and historical-data forecasting.',
    },

    architecture: {
      type: 'MVC + Pipeline de Validación + Analytics',
      decisions: [
        'Separación de roles entre captura de datos, back office y control de calidad',
        'Pipeline de validación secuencial para garantizar integridad de ventas',
        'Modelo predictivo de ventas basado en series históricas por campaña',
        'Reportes en tiempo real exportables por múltiples dimensiones',
      ],
    },

    tech: {
      frontend: ['React'],
      backend: ['Laravel'],
      database: ['MySQL'],
      analytics: ['Predicción de ventas por historial'],
    },

    ui: {
      typography: ['Inter', 'IBM Plex Sans'],
      colors: {
        primary: '#111827',
        secondary: '#2563EB',
        accent: '#EF4444',
        background: '#F9FAFB',
        text: '#111827',
      },
      design: 'Dashboard orientado a datos con tablas de alta densidad y visualizaciones de métricas de ventas en tiempo real',
      animations: ['Actualizaciones en vivo en tablas de estado', 'Indicadores de resultado en validación de ventas'],
    },

    flows: [
      'Asesor registra venta → datos capturados y encolados para validación',
      'Back office revisa → aprueba o rechaza con observaciones detalladas',
      'Control de calidad audita muestra aleatoria → calificación de llamada',
      'Supervisor consulta dashboard → métricas por asesor y campaña en tiempo real',
      'Sistema genera predicción → proyección de ventas por campaña según historial',
    ],

    highlights: [
      'Pipeline de validación multi-etapa que garantiza calidad e integridad de datos',
      'Reportes exportables por múltiples dimensiones: asesor, supervisor, campaña',
      'Predicción de ventas basada en series de tiempo históricas por campaña',
      'Módulo de control de calidad con auditoría de llamadas integrada',
    ],

    performance: {
      es: 'Consultas optimizadas para reportes sobre grandes volúmenes de registros; caché en dashboards con datos repetitivos de alta demanda.',
      en: 'Optimized queries for reporting over large record volumes; caching on high-demand dashboard data.',
    },

    impact: {
      es: 'Centralización del proceso de validación, reducción de errores en registro de ventas y mejora en decisiones estratégicas mediante predicción de datos.',
      en: 'Centralized validation process, reduced sales registration errors and improved strategic decisions through data-driven forecasting.',
    },

    stats: 'Alta concurrencia · Data-driven',
    status: 'ok',
    cat: 'fullstack',
    source: 'cliente',
  },

  {
    slug: 'glpi-ti',
    year: 2021,
    title: 'GLPI TI',

    context: {
      es: 'Sistema de gestión de tickets para el área de tecnología que permite priorizar incidentes, asignar automáticamente según disponibilidad y especialidad del técnico, y hacer seguimiento del ciclo de vida completo de cada caso. Incluye métricas de SLA, reportes de tiempos de respuesta y resolución, y módulo de evaluación de servicio por el usuario.',
      en: 'IT ticket management system enabling incident prioritization, automatic assignment based on technician availability and specialty, and full lifecycle tracking per case. Includes SLA metrics, response and resolution time reporting, and user-side service evaluation module.',
    },

    desc: {
      es: 'Sistema de tickets TI con asignación automática por disponibilidad, seguimiento de SLA y evaluación de servicio. Laravel + React.',
      en: 'IT ticketing system with availability-based auto-assignment, SLA tracking and service evaluation. Laravel + React.',
    },

    architecture: {
      type: 'MVC + Motor de Asignación + SLA Engine',
      decisions: [
        'Motor de asignación automática basado en disponibilidad y nivel técnico del agente',
        'Sistema de prioridades con escalamiento automático ante incumplimiento de SLA',
        'Módulo de evaluación post-resolución para medir calidad de servicio',
        'Reportes de tiempo de respuesta y resolución por técnico, categoría y período',
      ],
    },

    tech: {
      frontend: ['React'],
      backend: ['Laravel'],
      database: ['MySQL'],
    },

    ui: {
      typography: ['Inter', 'Roboto'],
      colors: {
        primary: '#1E40AF',
        secondary: '#0EA5E9',
        accent: '#F97316',
        background: '#F0F9FF',
        text: '#0C4A6E',
      },
      design: 'Interfaz centrada en claridad operativa, con estados de ticket codificados por color y panel de técnico simplificado para alta velocidad de uso',
      animations: ['Indicadores de prioridad con color dinámico', 'Transiciones en cambios de estado del ticket'],
    },

    flows: [
      'Usuario reporta incidente → ticket creado con prioridad asignada automáticamente',
      'Sistema evalúa disponibilidad y nivel → asignación automática al técnico adecuado',
      'Técnico atiende el caso → actualizaciones de estado notificadas al usuario',
      'Resolución del ticket → usuario evalúa el servicio recibido',
      'Supervisor revisa métricas → reportes de SLA, tiempos y calidad por período',
    ],

    highlights: [
      'Motor de asignación automática que elimina la gestión manual de tickets',
      'SLA configurable con escalamiento automático ante incumplimiento',
      'Evaluación de servicio integrada para medir calidad post-resolución',
      'Reportes de desempeño por técnico, categoría y período exportables',
    ],

    performance: {
      es: 'Índices optimizados en búsqueda y filtrado por estado, prioridad y asignado; reportes generados con consultas de agregación eficientes.',
      en: 'Optimized indexes for ticket search and filtering by status, priority and assignee; reports generated with efficient aggregation queries.',
    },

    impact: {
      es: 'Reducción del tiempo medio de resolución, mejora en cumplimiento de SLA y mayor visibilidad del desempeño técnico para la jefatura de TI.',
      en: 'Reduced mean resolution time, improved SLA compliance and greater visibility into technical performance for IT management.',
    },

    stats: 'Operación continua · SLA',
    status: 'ok',
    cat: 'fullstack',
    source: 'cliente',
  },

  {
    slug: 'soy-cultura-landing',
    year: 2023,
    title: 'Soy Cultura 2023',

    context: {
      es: 'Landing page desarrollada para el programa Soy Cultura 2023 de la Alcaldía de Bogotá, con el objetivo de presentar a los ganadores de forma visual e interactiva. La experiencia se construyó sobre navegación dinámica por localidades y animaciones avanzadas con GSAP para comunicar el valor del trabajo artístico de cada sector de la ciudad.',
      en: 'Landing page developed for Bogotá\'s Soy Cultura 2023 program to present award winners in a visual and interactive format. The experience was built around dynamic navigation by locality and advanced GSAP animations to communicate the artistic value of each sector of the city.',
    },

    desc: {
      es: 'Landing interactiva con GSAP para los ganadores del programa Soy Cultura 2023 de Bogotá, con navegación dinámica por localidades.',
      en: 'Interactive GSAP landing for Bogotá\'s Soy Cultura 2023 winners, with dynamic navigation by locality.',
    },

    architecture: {
      type: 'Static Site + Animation-first',
      decisions: [
        'Arquitectura estática sin dependencias de backend para máxima velocidad de carga',
        'GSAP como motor de animación para control preciso de timelines y ScrollTrigger',
        'Estructura de datos por localidad para navegación contextual segmentada',
        'Diseño responsive con atención a accesibilidad en contexto gubernamental',
      ],
    },

    tech: {
      frontend: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    },

    ui: {
      typography: ['Playfair Display', 'Inter'],
      colors: {
        primary: '#1A1A2E',
        secondary: '#E94560',
        accent: '#F5A623',
        background: '#FAFAFA',
        text: '#1A1A2E',
      },
      design: 'Visual e impactante, con paleta inspirada en la identidad cultural de Bogotá. Énfasis en la presentación del trabajo artístico por sobre el contenido institucional.',
      animations: ['ScrollTrigger para reveal secuencial de ganadores por localidad', 'Transiciones cinemáticas entre secciones', 'Microinteracciones en tarjetas de ganadores al hover'],
    },

    flows: [
      'Usuario llega a la landing → animación de entrada con identidad visual del programa',
      'Navega por mapa de localidades → selecciona una para ver a los ganadores',
      'Tarjeta de ganador → expand animado con detalle del proyecto cultural',
      'Scroll entre secciones → transiciones fluidas con GSAP ScrollTrigger',
    ],

    highlights: [
      'Animaciones avanzadas con GSAP ScrollTrigger para experiencia cinematográfica',
      'Navegación dinámica por las 20 localidades de Bogotá',
      'Performance optimizada pese a la alta densidad visual',
      'Diseño que comunica identidad cultural bogotana sin requerir framework',
    ],

    performance: {
      es: 'Assets optimizados y carga diferida de imágenes; animaciones GSAP con will-change para evitar jank en dispositivos de gama media.',
      en: 'Optimized assets with deferred image loading; GSAP animations with will-change to prevent jank on mid-range devices.',
    },

    impact: {
      es: 'Visibilización digital de los ganadores del programa cultural más importante de Bogotá, con una experiencia que refleja el valor del trabajo artístico de cada localidad.',
      en: 'Digital showcase of winners from Bogotá\'s most important cultural program, with an experience that reflects the artistic value of each locality\'s work.',
    },

    stats: 'Alta interacción · Animaciones avanzadas',
    status: 'ok',
    cat: 'frontend',
    source: 'cliente',
  },

  {
    slug: 'custom-cms',
    year: 2024,
    title: 'Custom CMS',

    context: {
      es: 'CMS desarrollado a medida para que equipos no técnicos gestionen contenido de manera autónoma. Incluye panel administrativo con control de roles y permisos granulares por módulo y acción, y gestión de archivos y medios en AWS S3. Backend en Node.js con TypeScript y frontend en Nuxt 4.',
      en: 'Custom CMS enabling non-technical teams to manage content autonomously. Includes admin panel with granular role and permission control per module and action, plus file and media management on AWS S3. Node.js/TypeScript backend and Nuxt 4 frontend.',
    },

    desc: {
      es: 'CMS a medida con RBAC granular y gestión de archivos en S3. Backend Node.js/TypeScript, frontend Nuxt 4.',
      en: 'Custom CMS with granular RBAC and S3 file management. Node.js/TypeScript backend, Nuxt 4 frontend.',
    },

    architecture: {
      type: 'REST API + Role-Based Access Control',
      decisions: [
        'RBAC granular con permisos configurables por módulo y tipo de acción',
        'Subida de archivos directo a AWS S3 con URLs firmadas para seguridad',
        'Separación entre panel administrativo y capa de contenido público',
        'TypeScript en backend para robustez de tipos y mantenibilidad a largo plazo',
      ],
    },

    tech: {
      frontend: ['Nuxt 4'],
      backend: ['Node.js', 'TypeScript'],
      database: ['MySQL'],
      infra: ['AWS S3'],
    },

    ui: {
      typography: ['Inter', 'Geist Mono'],
      colors: {
        primary: '#18181B',
        secondary: '#7C3AED',
        accent: '#06B6D4',
        background: '#FAFAFA',
        text: '#18181B',
      },
      design: 'Panel administrativo minimalista orientado a usabilidad para usuarios no técnicos, con jerarquía visual clara y flujos de edición guiados',
      animations: ['Feedback visual en progreso de subida de archivos', 'Transiciones en guardado y publicación de contenido'],
    },

    flows: [
      'Superadmin crea usuario → asigna rol y configura permisos específicos por módulo',
      'Editor accede al panel → ve únicamente las secciones autorizadas por su rol',
      'Carga de imagen → subida directa a S3, URL almacenada en base de datos',
      'Publicación de contenido → revisión, aprobación y cambio de estado con notificación',
      'Auditoría → historial de cambios por usuario, módulo y fecha',
    ],

    highlights: [
      'RBAC granular con permisos configurables por módulo y acción',
      'Integración nativa con AWS S3 para gestión de medios a escala',
      'TypeScript en backend para robustez y mantenibilidad del código',
      'Interfaz diseñada para usuarios no técnicos sin curva de aprendizaje pronunciada',
    ],

    performance: {
      es: 'Consultas optimizadas con índices en campos de filtrado frecuente; subida directa a S3 para descargar el tráfico del servidor principal.',
      en: 'Optimized queries with indexes on frequently filtered fields; direct-to-S3 uploads to offload traffic from the main server.',
    },

    impact: {
      es: 'Autonomía del equipo de contenido sin dependencia del área técnica, reducción del tiempo de publicación y mejor control de accesos por área.',
      en: 'Content team autonomy without depending on technical staff, reduced publication time and improved access control by department.',
    },

    stats: 'Modular · Escalable',
    status: 'ok',
    cat: 'fullstack',
    source: 'cliente',
  },

  {
    slug: 'portfolio-2027',
    year: 2026,
    title: 'Portfolio 2027',

    context: {
      es: 'Portafolio profesional construido como proyecto de alto nivel técnico para demostrar capacidades en frontend avanzado, arquitectura limpia y experiencia de usuario. Integra agentes GPT, chatbot conversacional, internacionalización ES/EN y microanimaciones con GSAP. Desarrollado en Nuxt 4 con foco en rendimiento, escalabilidad y código mantenible.',
      en: 'Professional portfolio built as a high-level technical project to demonstrate advanced frontend, clean architecture and UX capabilities. Integrates GPT agents, conversational chatbot, ES/EN i18n and GSAP microinteractions. Built with Nuxt 4 focused on performance, scalability and maintainable code.',
    },

    desc: {
      es: 'Portfolio 2027 en Nuxt 4 con agentes GPT, i18n ES/EN, GSAP y sistema de diseño propio.',
      en: '2027 portfolio in Nuxt 4 with GPT agents, ES/EN i18n, GSAP and a custom design system.',
    },

    architecture: {
      type: 'JAMstack + Clean Architecture + AI Integration',
      decisions: [
        'Nuxt 4 con arquitectura de capas para separar datos, lógica y presentación',
        'Integración con API de GPT para agentes conversacionales con contexto del portafolio',
        'i18n con detección automática de idioma y persistencia de preferencia',
        'GSAP para animaciones declarativas con control preciso de timeline y ScrollTrigger',
      ],
    },

    tech: {
      frontend: ['Nuxt 4', 'GSAP', 'SCSS'],
      infra: ['GPT Agents', 'APIs externas'],
    },

    ui: {
      typography: ['Inter', 'Space Grotesk'],
      colors: {
        primary: '#0A0A0F',
        secondary: '#6366F1',
        accent: '#A78BFA',
        background: '#0A0A0F',
        text: '#F8FAFC',
      },
      design: 'Dark mode por defecto con paleta futurista. Animaciones que enfatizan transiciones entre secciones y revelan contenido con fluidez cinematográfica.',
      animations: ['Scroll-driven reveals con GSAP ScrollTrigger', 'Transiciones de página con timeline de entrada y salida', 'Microinteracciones en hover de tarjetas de proyecto', 'Efecto de escritura en respuestas del chatbot'],
    },

    flows: [
      'Visitante llega → animación de entrada con identidad visual del portafolio',
      'Navega por proyectos → reveal animado impulsado por scroll',
      'Interactúa con chatbot → respuestas del agente GPT con contexto técnico en tiempo real',
      'Cambia de idioma → transición suave con i18n aplicado en toda la interfaz',
      'Accede al detalle de proyecto → vista inmersiva con información técnica completa',
    ],

    highlights: [
      'Integración con agentes GPT para interacción conversacional en tiempo real',
      'Sistema de diseño propio con tokens, variables SCSS y componentes reutilizables',
      'Animaciones GSAP scroll-driven para experiencia cinematográfica',
      'Soporte bilingüe ES/EN con i18n y detección automática de idioma',
    ],

    performance: {
      es: 'SSG/SSR con Nuxt 4 para tiempo de carga óptimo; lazy loading de componentes pesados y animaciones optimizadas con will-change.',
      en: 'SSG/SSR with Nuxt 4 for optimal load time; lazy loading of heavy components and animations optimized with will-change.',
    },

    impact: {
      es: 'Representación técnica diferenciada que demuestra capacidad de diseño de sistema, integración con IA y ejecución de producto de alto nivel.',
      en: 'Differentiated technical representation demonstrating system design capability, AI integration and high-level product execution.',
    },

    stats: 'Alto performance · UX avanzada',
    status: 'ok',
    cat: 'frontend',
    source: 'open source',
  },

  {
    slug: 'cafe-realtime-system',
    year: 2024,
    title: 'Café Realtime System',

    context: {
      es: 'Sistema desarrollado para optimizar la operación de una cafetería, eliminando fricción en la toma de pedidos y reduciendo tiempos de espera mediante automatización del flujo cliente–cocina–caja.',
      en: 'System built to optimize café operations by removing friction in order placement and reducing wait times through automation of the client–kitchen–checkout flow.',
    },

    desc: {
      es: 'Plataforma en tiempo real basada en QR para gestión de pedidos, con comunicación vía WebSockets entre cliente, cocina y caja.',
      en: 'QR-based real-time order management platform using WebSockets for communication between client, kitchen and checkout.',
    },

    architecture: {
      type: 'Realtime + Clean Architecture',
      decisions: [
        'Uso de WebSockets para comunicación bidireccional y reducción de latencia',
        'Asignación automática de mesa mediante QR para eliminar input manual',
        'Separación de responsabilidades entre cliente, cocina y caja',
      ],
    },

    tech: {
      frontend: ['HTML', 'CSS', 'JavaScript'],
      backend: ['Node.js'],
      realtime: ['WebSockets'],
    },

    ui: {
      typography: ['Inter', 'Roboto'],
      colors: {
        primary: '#1F2937',
        secondary: '#F59E0B',
        accent: '#10B981',
        background: '#F9FAFB',
        text: '#111827',
      },
      design: 'Minimalista, orientado a rapidez de interacción en entornos físicos con alta rotación de usuarios',
      animations: ['Microinteracciones de estado en pedidos', 'Feedback visual en tiempo real al actualizar cola'],
    },

    flows: [
      'Cliente escanea QR → accede al menú con mesa asignada automáticamente',
      'Cliente realiza pedido → envío inmediato a cocina vía WebSocket',
      'Cocina actualiza estado → notificación en tiempo real al cliente',
      'Pedido listo → visible en caja para facturación directa',
      'Pantalla pública muestra cola de pedidos en proceso',
    ],

    highlights: [
      'Comunicación en tiempo real sin polling mediante WebSockets',
      'Reducción de errores en asignación de pedidos por automatización con QR',
      'Visibilidad completa del estado del pedido para cliente y operación',
      'Desacople de roles operativos: cliente, cocina y caja',
    ],

    performance: {
      es: 'Arquitectura ligera enfocada en baja latencia y respuesta inmediata en eventos críticos del flujo operativo.',
      en: 'Lightweight architecture focused on low latency and immediate response for critical operational flow events.',
    },

    impact: {
      es: 'Reducción de tiempos de espera, mejora en la rotación de pedidos y optimización del flujo operativo en el punto de venta.',
      en: 'Reduced wait times, improved order throughput and optimized operational flow at point of sale.',
    },

    stats: 'Tiempo real · Operación optimizada',
    status: 'ok',
    cat: 'fullstack',
    source: 'cliente',
  },
]
