import { ReactNode } from 'react';

export interface TrendItem {
  id: number;
  topic: string;
  volume: string;
}

export interface StoreProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  img: string;
  tag: string;
  sizes: string;
}

export interface ServiceProduct {
  id: string;
  title: string;
  img: string;
  desc: string;
}

export const philosophyImages = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
];

export const clientLogos = [
  '/images/clientes/logo_1.png',
  '/images/clientes/logo_2.png',
  '/images/clientes/logo_3.png',
  '/images/clientes/logo_4.png',
  '/images/clientes/logo_5.png',
  '/images/clientes/logo_6.png',
  '/images/clientes/logo_7.png',
  '/images/clientes/logo_8.png',
];

export const historyCardsData = [
  {
    id: '01',
    year: '2016',
    title: 'Lanzamiento',
    img: '/images/historia/Radio_en_Casa_historia_01.jpg',
    desc: 'Radio en Casa nace en Noviembre de 2016 con un concepto crítico hacia lo que eran las primeras radios por internet. En aquél momento creíamos que el nacimiento de las redes sociales y el hecho de transmitir vía web nos obligaba a replantearnos el formato de las radios tradicionales.',
  },
  {
    id: '02',
    year: '2017',
    title: 'Crecimiento',
    img: '/images/programas/Radio_en_Casa_historia_01_Posta_Logo.png',
    desc: 'En el 2017, además de transmitir contenidos sonoros por nuestra web nos convertimos en la casa de Posta, la productora pionera de podcast en Argentina co-fundada por Luciano Banchero. Eso nos llevó a ser el estudio con mayor cantidad de podcast del país.',
  },
  {
    id: '03',
    year: '2018',
    title: 'Evolución',
    img: '/images/programas/Radio_en_Casa_historia_02_Concha_Podcast.jpg',
    desc: 'Desde el 2018 fuimos también la casa de Concha Podcast, el podcast independiente más exitoso de Argentina, hasta que hizo su gira de despedida en el 2025. Ese mismo año, realizamos nuestro primer streaming al incorporar un sistema de cámaras.',
  },
  {
    id: '04',
    year: '2019',
    title: 'Consolidación',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    desc: 'En el 2019 produjimos junto a Gustavo Olmedo el lanzamiento de “Quemar un Patrullero”, otro de los podcast independientes más relevantes de la escena local, que continuamos grabando y se sostiene gracias a su comunidad. Nos convertimos en el estudio con mayor cantidad de podcast del país, habiendo además grabado los primeros episodios originales de Spotify en Argentina.',
  },
  {
    id: '05',
    year: '2020',
    title: 'Comunidad',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    desc: 'En el 2020 vino la pandemia donde todos hicieron uso de nuestro slogan de “quedarse en casa” y aprovechamos para seguir construyendo comunidad al funcionar como plataforma digital para la difusión de artistas independientes a través del formato “Radio en Casa va a tu casa”.',
  },
  {
    id: '06',
    year: '2021—2024',
    title: 'Expansión',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    desc: 'En el 2021 realizamos nuestra primera producción internacional al trabajar con Sonoro, la red de podcast en español número uno del mundo y realizamos nuestras primeras coberturas audiovisuales en exteriores al participar de los Shows de Concha Podcast en Ciudad Cultural Konex (2021) y en el Teatro Margarita Xirgu (2023).',
  },
  {
    id: '07',
    year: '2025—',
    title: 'Evolución',
    img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    desc: 'En el 2025 abrimos un segundo espacio llamado “Salgo Arriba” pensado para seguir construyendo comunidad con la realización de eventos en vivo, siempre con la idea de continuar innovando y brindando mayor cantidad de servicios a las personas que confían en nosotros para desarrollar sus producciones.',
  },
];

export const radioData = {
  id: 'radio',
  label: 'Radio',
  bgColor: '#f74a35',
  desc: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200">
      <div className="space-y-3">
        <p>Un formato para quienes, como nosotros, creen que la radio nunca va a morir.</p>
        <p>
          Fue la forma en la que empezamos en 2016 y sigue siendo parte de nuestra identidad. Por eso seguimos ofreciendo la posibilidad de crear programas de radio transmitidos en vivo a través de nuestra web, desde donde también difundimos artistas que forman parte de nuestra comunidad.
        </p>
      </div>
      <div className="space-y-3">
        <p>
          A diferencia de los medios tradicionales con alcance limitado por una región determinada, la transmisión online permite que tu contenido pueda escucharse desde cualquier lugar del mundo.
        </p>
        <p>
          Además, gracias a nuestra trayectoria, nuestra programación forma parte de plataformas como TuneIn, ampliando nuestro alcance, y puede ser escuchada on demand a través de RadioCut.
        </p>
        <div className="pt-2">
          <a
            href="https://tunein.com/radio/Radio-En-Casa-s288700/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[6px] px-6 py-2.5 text-xs font-bold tracking-[0.2em] hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200"
          >
            Link TuneIn →
          </a>
          <p className="text-[10px] md:text-xs mt-3 text-white/90">
            TuneIn funciona con cualquier plataforma móvil y es la aplicación para escuchar radios con mayor difusión del mundo. Clickeá acá y seguinos para que Radio En Casa suene ni bien entras.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const podcastData = {
  id: 'podcast',
  label: 'Podcast',
  bgColor: '#f9772f',
  desc: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200">
      <div className="space-y-3">
        <p>El podcast es probablemente el formato donde más recorrido tenemos.</p>
        <p>
          Durante varios años fuimos el estudio elegido por Posta, una de las primeras productoras de podcast de Argentina, participando del crecimiento de una industria que recién comenzaba a desarrollarse y grabando en 2019 los primeros contenidos originales de Spotify producidos en nuestro país.
        </p>
      </div>
      <div className="space-y-3">
        <p>
          También acompañamos proyectos independientes como Concha Podcast y Quemar un Patrullero, además de producciones realizadas para empresas y organizaciones de distintos ámbitos.
        </p>
        <p>
          Realizamos podcasts en formato audio y video, ofreciendo servicios de grabación, edición y diseño sonoro para que cada proyecto pueda desarrollarse con identidad propia.
        </p>
      </div>
    </div>
  ),
};

export const streamingData = {
  id: 'streaming',
  label: 'Streaming',
  bgColor: '#f9b92f',
  desc: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200">
      <div className="space-y-3">
        <p>El streaming puede parecer un formato nuevo, pero para nosotros empezó antes.</p>
        <p>
          En 2018 realizamos nuestras primeras transmisiones audiovisuales en vivo, cuando este formato todavía no tenía la dimensión que alcanzaría años después.
        </p>
      </div>
      <div className="space-y-3">
        <p>
          Hoy producimos streamings para canales propios o plataformas de terceros como YouTube, Twitch, Facebook, X o Instagram, adaptándonos a las necesidades de cada proyecto.
        </p>
        <p>
          Trabajamos con un sistema multicámara Full HD 1920 x 1080, switcher profesional y cámaras inalámbricas que nos permiten aprovechar mejor el espacio y lograr producciones dinámicas sin perder calidad.
        </p>
      </div>
    </div>
  ),
};

export const outdoorData = {
  id: 'outdoor',
  label: 'Outdoor',
  bgColor: '#005266',
  desc: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200">
      <div className="space-y-3">
        <p>Así llamamos a todo aquello que hacemos fuera del estudio.</p>
        <p>
          Radio en Casa nació como un espacio de encuentro y creemos que ese espíritu no depende de cuatro paredes. Por eso llevamos nuestra experiencia, nuestra tecnología y nuestra manera de hacer contenidos a nuevos escenarios.
        </p>
        <p>
          Realizamos coberturas, transmisiones y registros audiovisuales en eventos, teatros, festivales y locaciones privadas, acompañando a proyectos que necesitan llevar su contenido a otro lugar.
        </p>
      </div>
      <div className="space-y-3">
        <p>
          Esta modalidad es ideal para entrevistas con invitados que no pueden acercarse al estudio, para formatos que crecieron, formaron comunidad y quieren dar un paso más con una experiencia presencial.
        </p>
        <p>
          A lo largo de estos años realizamos producciones fuera de casa como los shows de Concha Podcast en Ciudad Cultural Konex y Teatro Margarita Xirgu, y también incorporamos nuestro espacio Salgo Arriba en 2025 como una nueva forma de seguir generando encuentros.
        </p>
        <p className="font-bold">Porque la casa no es solamente un lugar. Es una manera de hacer las cosas.</p>
      </div>
    </div>
  ),
};

export const radioProducts: ServiceProduct[] = [
  { id: 'R1', title: 'Nombre de Programa #1', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80', desc: 'Breve descripción' },
  { id: 'R2', title: 'Nombre de Programa #2', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80', desc: 'Breve descripción' },
  { id: 'R3', title: 'Nombre de Programa #3', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Breve descripción' },
];

export const podcastProducts: ServiceProduct[] = [
  { id: 'P1', title: 'QUEMAR UN PATRULLERO', img: '/images/programas/radio_en_casa_quemar_un_patrullero.jpeg', desc: 'Donde la vida y el rock se encuentran — Con Gustavo Olmedo' },
  { id: 'P2', title: 'VIDEO PODCAST 4K', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', desc: 'Grabación de episodios en video con encuadres individuales y planos generales.' },
  { id: 'P3', title: 'EDICIÓN & EDICIÓN SONORA', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Limpieza de audio, ecualización, masterización y diseño sonoro a medida.' },
];

export const streamingProducts: ServiceProduct[] = [
  { id: 'S1', title: 'MULTICÁMARA FULL HD', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', desc: 'Switching en vivo con múltiples ángulos dinámicos e iluminación pro.' },
  { id: 'S2', title: 'INTEGRACIÓN SOCIAL', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80', desc: 'Transmisión simulcast en YouTube, Twitch, Kick e Instagram Live.' },
  { id: 'S3', title: 'DISEÑO DE GRÁFICAS', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Zócalos interactivos, alertas, marquesinas y animaciones en pantalla.' },
];

export const outdoorProducts: ServiceProduct[] = [
  { id: 'O1', title: 'TRANSMISIÓN EN VIVO', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Unidad móvil de streaming para coberturas en festivales y eventos.' },
  { id: 'O2', title: 'COBERTURA EN TEATROS', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', desc: 'Registros audiovisuales de shows en vivo y presentaciones especiales.' },
  { id: 'O3', title: 'ESTUDIO MÓVIL', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80', desc: 'Llevamos la mesa de radio y microfonía a cualquier locación.' },
];

export const membershipsData = [
  {
    id: '01',
    titleLine1: 'REC',
    titleLine2: 'Groupie',
    desc: 'Creo en este proyecto y quiero ayudar a que siga creciendo.',
    buttonText: 'Quiero ser Groupie →',
    link: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=4e6a895dbbb144cb84c54e45b044abb7',
  },
  {
    id: '02',
    titleLine1: 'REC',
    titleLine2: 'Crew',
    desc: 'Quiero sentirme parte del equipo y vivir Radio en Casa desde adentro.',
    buttonText: 'Quiero ser Crew →',
    link: 'https://mpago.la/1AX6RC9',
  },
  {
    id: '03',
    titleLine1: 'REC',
    titleLine2: 'Rockstar',
    desc: 'Quiero participar activamente y ayudar a hacer crecer Radio en Casa.',
    buttonText: 'Quiero ser Rockstar →',
    link: 'https://mpago.la/1szJ29C',
  },
  {
    id: '04',
    titleLine1: 'REC',
    titleLine2: 'Leyenda',
    desc: 'Quiero dejar una huella en la historia de Radio en Casa.',
    buttonText: 'Quiero ser Leyenda →',
    link: 'https://mpago.la/1H92pSX',
  },
];

export const menuItems = [
  { id: 'radio', label: 'Radio' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'historia', label: 'Historia' },
  { id: 'archivo', label: 'Archivo' },
  { id: 'comunidad', label: 'Comunidad' },
  { id: 'vecinos', label: 'Vecinos' },
  { id: 'fanzine', label: 'Fanzine' },
  { id: 'la-casa', label: 'La Casa' },
];