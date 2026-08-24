'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import AnimatedLogo from '@/components/AnimatedLogo';
import IframePlayer from '@/components/IframePlayer';

// --- COMPONENTE AUXILIAR PARA ANIMACIÓN AL SCROLLEAR ---

function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  duration = 700,
  offset = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out transform-gpu ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  );
}

// --- INTERFACES & DATOS ESTÁTICOS ---

interface TrendItem {
  id: number;
  topic: string;
  volume: string;
}

interface StoreProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  img: string;
  tag: string;
  sizes: string;
}

interface ServiceProduct {
  id: string;
  title: string;
  img: string;
  desc: string;
}

const philosophyImages = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
];

const fullscreenSliderImages = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80',
  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&q=80',
];

const clientLogos = [
  '/images/clientes/logo_1.png',
  '/images/clientes/logo_2.png',
  '/images/clientes/logo_3.png',
  '/images/clientes/logo_4.png',
  '/images/clientes/logo_5.png',
  '/images/clientes/logo_6.png',
  '/images/clientes/logo_7.png',
  '/images/clientes/logo_8.png',
];

const historyCardsData = [
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
    img: '/images/programas/radio_en_casa_quemar_un_patrullero.jpeg',
    desc: 'En el 2019 produjimos junto a Gustavo Olmedo el lanzamiento de “Quemar un Patrullero”, otro de los podcast independientes más relevantes de la escena local, que continuamos grabando y se sostiene gracias a su comunidad. Nos convertimos en el estudio con mayor cantidad de podcast del país, habiendo además grabado los primeros episodios originales de Spotify en Argentina.',
  },
  {
    id: '05',
    year: '2020',
    title: 'Comunidad',
    img: '',
    desc: 'En el 2020 vino la pandemia donde todos hicieron uso de nuestro slogan de “quedarse en casa” y aprovechamos para seguir construyendo comunidad al funcionar como plataforma digital para la difusión de artistas independientes a través del formato “Radio en Casa va a tu casa”.',
  },
  {
    id: '06',
    year: '2021—2024',
    title: 'Expansión',
    img: '/images/programas/Radio_en_Casa_historia_02_Concha_Podcast_Konex.jpg',
    desc: 'En el 2021 realizamos nuestra primera producción internacional al trabajar con Sonoro, la red de podcast en español número uno del mundo y realizamos nuestras primeras coberturas audiovisuales en exteriores al participar de los Shows de Concha Podcast en Ciudad Cultural Konex (2021) y en el Teatro Margarita Xirgu (2023).',
  },
  {
    id: '07',
    year: '2025—',
    title: 'Evolución',
    img: '/images/programas/Salgo_Arriba_Logo_Radio_en_Casa.png',
    desc: 'En el 2025 abrimos un segundo espacio llamado “Salgo Arriba” pensado para seguir construyendo comunidad con la realización de eventos en vivo, siempre con la idea de continuar innovando y brindando mayor cantidad de servicios a las personas que confían en nosotros para desarrollar sus producciones.',
  },
];

const radioData = {
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

const podcastData = {
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

const streamingData = {
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

const outdoorData = {
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

const radioProducts: ServiceProduct[] = [
  { id: 'R1', title: 'Nombre de Programa #1', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80', desc: 'Breve descripción' },
  { id: 'R2', title: 'Nombre de Programa #2', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80', desc: 'Breve descripción' },
  { id: 'R3', title: 'Nombre de Programa #3', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Breve descripción' },
];

const podcastProducts: ServiceProduct[] = [
  { id: 'P1', title: 'QUEMAR UN PATRULLERO', img: '/images/programas/radio_en_casa_quemar_un_patrullero.jpeg', desc: 'Donde la vida y el rock se encuentran — Con Gustavo Olmedo' },
  { id: 'P2', title: 'VIDEO PODCAST 4K', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', desc: 'Grabación de episodios en video con encuadres individuales y planos generales.' },
  { id: 'P3', title: 'EDICIÓN & EDICIÓN SONORA', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Limpieza de audio, ecualización, masterización y diseño sonoro a medida.' },
];

const streamingProducts: ServiceProduct[] = [
  { id: 'S1', title: 'MULTICÁMARA FULL HD', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', desc: 'Switching en vivo con múltiples ángulos dinámicos e iluminación pro.' },
  { id: 'S2', title: 'INTEGRACIÓN SOCIAL', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80', desc: 'Transmisión simulcast en YouTube, Twitch, Kick e Instagram Live.' },
  { id: 'S3', title: 'DISEÑO DE GRÁFICAS', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Zócalos interactivos, alertas, marquesinas y animaciones en pantalla.' },
];

const outdoorProducts: ServiceProduct[] = [
  { id: 'O1', title: 'TRANSMISIÓN EN VIVO', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', desc: 'Unidad móvil de streaming para coberturas en festivales y eventos.' },
  { id: 'O2', title: 'COBERTURA EN TEATROS', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80', desc: 'Registros audiovisuales de shows en vivo y presentaciones especiales.' },
  { id: 'O3', title: 'ESTUDIO MÓVIL', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80', desc: 'Llevamos la mesa de radio y microfonía a cualquier locación.' },
];

const membershipsData = [
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

const menuItems = [
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

// --- COMPONENTE PRINCIPAL ---

export default function Page() {
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const [heroLogoWidth, setHeroLogoWidth] = useState<number>(1000);

  useEffect(() => {
    const el = heroLogoRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setHeroLogoWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isBgGlitching, setIsBgGlitching] = useState<boolean>(true);
  const [timeString, setTimeString] = useState<string>('');
  const [isSocialOpen, setIsSocialOpen] = useState<boolean>(false);

  const [showTuningNotice, setShowTuningNotice] = useState<boolean>(true);
  const [isTuningFadingUp, setIsTuningFadingUp] = useState<boolean>(false);
  const [isHeroIntroComplete, setIsHeroIntroComplete] = useState<boolean>(false);

  const [isNavHiddenInactivity, setIsNavHiddenInactivity] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [philosophySlideIndex, setPhilosophySlideIndex] = useState<number>(0);
  const [fullscreenSlideIndex, setFullscreenSlideIndex] = useState<number>(0);

  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(true);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);

  const [temperature, setTemperature] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string>('CARGANDO...');

  const [activeSection, setActiveSection] = useState<string>('');
  const [isPlayerCollapsed, setIsPlayerCollapsed] = useState<boolean>(false);

  const changePhilosophySlide = (newIndex: number) => {
    setPhilosophySlideIndex(newIndex);
  };

  const nextFullscreenSlide = () => {
    setFullscreenSlideIndex((prev) => (prev + 1) % fullscreenSliderImages.length);
  };

  const prevFullscreenSlide = () => {
    setFullscreenSlideIndex((prev) => (prev - 1 + fullscreenSliderImages.length) % fullscreenSliderImages.length);
  };

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsTuningFadingUp(true);
    }, 1800);

    const introTimer = setTimeout(() => {
      setShowTuningNotice(false);
      setIsHeroIntroComplete(true);
      setIsBgGlitching(false);
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(introTimer);
    };
  }, []);

  useEffect(() => {
    const fetchTiendaProducts = async () => {
      try {
        const res = await fetch('/api/tienda', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setStoreProducts(data);
            return;
          }
        }
      } catch (error) {
        console.error('Error cargando productos de /tienda:', error);
      }

      setStoreProducts([
        {
          id: '01',
          title: 'REMERA “VINTAGE”',
          category: 'INDUMENTARIA',
          price: '$28.500',
          img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
          tag: '100% ALGODÓN HEAVY',
          sizes: 'S · M · L · XL · XXL',
        },
        {
          id: '02',
          title: 'TOTEBAG',
          category: 'ACCESORIOS',
          price: '$18.000',
          img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
          tag: 'LONA RESISTENTE',
          sizes: 'TALLE ÚNICO',
        },
        {
          id: '03',
          title: 'GORRA “VINTAGE”',
          category: 'ACCESORIOS',
          price: '$21.000',
          img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
          tag: 'GABARDINA BORDADA',
          sizes: 'TALLE ÚNICO',
        },
      ]);
    };

    fetchTiendaProducts();
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchLiveXTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const res = await fetch('/api/trends?country=AR', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTrends(data);
      }
    } catch (error) {
      console.error('Error fetching X trends:', error);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => {
    fetchLiveXTrends();
    const interval = setInterval(fetchLiveXTrends, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
            );
            const weatherData = await weatherRes.json();
            const temp = Math.round(weatherData.current.temperature_2m);
            setTemperature(`${temp}°C`);

            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const geoData = await geoRes.json();
            const city =
              geoData.address.city ||
              geoData.address.town ||
              geoData.address.village ||
              'UBICACIÓN';
            setCityName(city.toUpperCase());
          } catch (error) {
            setCityName('CLIMA');
            setTemperature('N/A');
          }
        },
        () => {
          setCityName('BA');
          setTemperature('21°C');
        }
      );
    } else {
      setCityName('BA');
      setTemperature('21°C');
    }
  }, []);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const handleScrollAndActivity = () => {
      setIsNavHiddenInactivity(false);
      clearTimeout(inactivityTimer);

      if (window.scrollY > 80) {
        setIsPlayerCollapsed(true);
        setIsScrolled(true);
      } else {
        setIsPlayerCollapsed(false);
        setIsScrolled(false);
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }

      inactivityTimer = setTimeout(() => {
        setIsNavHiddenInactivity(true);
      }, 6000);
    };

    handleScrollAndActivity();

    window.addEventListener('mousemove', handleScrollAndActivity);
    window.addEventListener('scroll', handleScrollAndActivity);
    window.addEventListener('keydown', handleScrollAndActivity);
    window.addEventListener('touchstart', handleScrollAndActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleScrollAndActivity);
      window.removeEventListener('scroll', handleScrollAndActivity);
      window.removeEventListener('keydown', handleScrollAndActivity);
      window.removeEventListener('touchstart', handleScrollAndActivity);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    menuItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div
      className={`overflow-x-hidden overflow-y-auto bg-[#181818] text-[#ececec] relative h-screen snap-y snap-mandatory flex flex-col font-['DM_Sans',sans-serif] ${
        isBgGlitching ? 'animate-bg-glitch' : ''
      }`}
    >
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-infinite {
          display: flex;
          width: max-content;
          animation: scroll-left 25s linear infinite;
        }
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fjalla+One&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />

      {isBgGlitching && (
        <div className="fixed inset-0 pointer-events-none z-[55] overflow-hidden">
          <div className="absolute inset-0 bg-[#f74a35]/10 mix-blend-screen animate-bg-glitch-red" />
          <div className="absolute inset-0 bg-[#1b9aaa]/10 mix-blend-screen animate-bg-glitch-cyan" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-scanline animate-scanline" />
        </div>
      )}

      <div className="fixed top-0 right-0 w-[20px] h-full z-[50] pointer-events-none overflow-hidden">
        <div
          className="w-full bg-[#f9b92f] transition-all duration-150 ease-out shadow-sm"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* HEADER NAVEGABLE FLOTANTE SUPERIOR */}
      <div
        className={`fixed z-40 transition-all duration-500 ease-in-out flex flex-col ${
          isHeroIntroComplete ? 'opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'
        } ${
          isScrolled
            ? 'top-0 left-0 right-0 w-full max-w-full px-0 translate-x-0'
            : 'top-4 left-1/2 -translate-x-1/2'
        }`}
        style={{
          width: isScrolled ? '100vw' : `${heroLogoWidth}px`,
          maxWidth: '100vw',
        }}
      >
        <div
          className="pointer-events-auto bg-[#242424] text-[#ececec] border-b border-[#5c5c5c]/60 pl-4 pr-0 py-0 flex items-center justify-between w-full h-[32px] text-xs font-normal tracking-wider overflow-hidden gap-3.5 z-20 shadow-md"
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-[180px] sm:max-w-[220px] md:max-w-[300px]">
            <span className="text-[#f74a35] font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
              TOP 5 TRENDS:
            </span>
            <div className="overflow-hidden w-full relative">
              <div className="flex w-max animate-marquee space-x-6 whitespace-nowrap text-neutral-300 font-bold text-[10px]">
                {isLoadingTrends ? (
                  <span>Cargando tendencias...</span>
                ) : trends.length > 0 ? (
                  [...trends.slice(0, 5), ...trends.slice(0, 5)].map((item, idx) => (
                    <a
                      key={idx}
                      href={`https://x.com/search?q=${encodeURIComponent(item.topic)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      <strong className="text-[#f74a35]">[{item.id}]</strong> {item.topic}
                    </a>
                  ))
                ) : (
                  <span>Radio en Casa AR</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 h-full">
            <div className="flex items-center gap-2 font-mono text-xs select-none">
              <span className="w-2 h-2 rounded-full bg-[#f74a35] animate-pulse" />
              <span className="text-neutral-300 font-bold">{cityName}</span>
              <span className="text-white font-bold">{temperature || '--°C'}</span>
            </div>

            <span className="text-neutral-500 hidden sm:inline">/</span>

            <span className="font-mono text-xs font-bold tracking-widest text-[#949494] select-none whitespace-nowrap hidden md:inline">
              {timeString || '00 MES — 00:00:00'}
            </span>

            <div className="flex items-center h-full gap-0 ml-2">
              <button
                onClick={() => scrollToSection('store')}
                className="bg-[#f74a35] text-white hover:bg-white hover:text-neutral-900 px-3.5 h-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center border-none outline-none shadow-md font-['Rethink_Sans',sans-serif]"
              >
                Store
              </button>
            </div>
          </div>
        </div>

        <div
          className={`pointer-events-auto w-full bg-[#f2f2f2] text-neutral-900 shadow-md overflow-hidden transition-all duration-500 ease-in-out z-10 ${
            !isNavHiddenInactivity
              ? 'max-h-12 opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          <div className="flex flex-row items-center justify-between w-full">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex-1 py-1.5 text-xs sm:text-sm transition-all duration-300 ease-out cursor-pointer whitespace-nowrap text-center border-none outline-none font-['Rethink_Sans',sans-serif] ${
                    isActive
                      ? 'bg-[#f74a35] text-white font-bold shadow-inner'
                      : 'bg-transparent text-neutral-900 hover:bg-[#f74a35] hover:text-white font-medium'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={`fixed top-1/2 -translate-y-1/2 right-6 z-40 pointer-events-none flex flex-col items-end justify-center gap-3 transition-all duration-1000 ease-out ${
          isHeroIntroComplete ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
        }`}
      >
        <div
          className="pointer-events-auto relative flex items-center justify-end"
          onMouseEnter={() => setIsSocialOpen(true)}
          onMouseLeave={() => setIsSocialOpen(false)}
        >
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-3 text-xs uppercase tracking-wider font-normal bg-[#f2f2f2] text-neutral-900 border border-[#f2f2f2] px-4 py-2 shadow-xl transition-all duration-500 ease-in-out overflow-hidden ${
                isSocialOpen
                  ? 'max-w-[50vw] opacity-100 translate-x-0'
                  : 'max-w-0 opacity-0 translate-x-10 border-transparent p-0'
              }`}
            >
              <a href="https://x.com/radioencasa" target="_blank" rel="noopener noreferrer" className="hover:text-[#f74a35] transition-colors whitespace-nowrap">X</a>
              <span className="text-neutral-400">/</span>
              <a href="https://www.youtube.com/radioencasa" target="_blank" rel="noopener noreferrer" className="hover:text-[#f74a35] transition-colors whitespace-nowrap">YouTube</a>
              <span className="text-neutral-400">/</span>
              <a href="https://www.instagram.com/radioencasa/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f74a35] transition-colors whitespace-nowrap">Instagram</a>
            </div>

            <button className="bg-[#f74a35] text-white hover:bg-white hover:text-neutral-900 border border-[#f74a35] p-2.5 text-xs uppercase font-bold transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer group">
              {isSocialOpen ? <span>✕</span> : <span>♥</span>}
            </button>
          </div>
        </div>

        <div className="pointer-events-auto relative group flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs tracking-wider bg-[#f2f2f2] text-neutral-900 border border-[#f2f2f2] shadow-xl transition-all duration-500 ease-in-out overflow-hidden max-w-0 opacity-0 group-hover:max-w-[280px] group-hover:opacity-100 group-hover:px-4 py-2 font-mono whitespace-nowrap">
              <a href="https://wa.me/541148317132" target="_blank" rel="noopener noreferrer" className="hover:text-[#f74a35] transition-colors">(+5411) 4831 7132</a>
            </div>
            <a href="https://wa.me/541148317132" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white hover:bg-white hover:text-neutral-900 border border-[#25D366] p-2.5 text-xs transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer group">WA</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* 1. HOME CON EVENTOS HABILITADOS (pointer-events-auto) */}
        <section
          id="home"
          className="w-full h-screen min-h-screen snap-start snap-always flex flex-col justify-between relative bg-[#242424] overflow-hidden transform-gpu"
          style={{
            backgroundImage: `
              linear-gradient(to right, #5c5c5c 1px, transparent 1px),
              linear-gradient(to bottom, #5c5c5c 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {showTuningNotice && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className={`bg-[#202020] text-white px-7 py-3.5 border border-[#5c5c5c]/80 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all duration-700 ease-in-out ${isTuningFadingUp ? '-translate-y-24 opacity-0 filter blur-sm' : 'translate-y-0 opacity-100 animate-bounce'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#f74a35] animate-ping" />
                <span className="text-[#ececec]">Sintonizando...</span>
              </div>
            </div>
          )}

          {/* CONTENEDOR CENTRAL */}
          <div className="w-full flex-1 pt-16 pb-20 px-[18%] flex flex-col items-center justify-center pointer-events-auto z-10 relative overflow-visible">
            <div ref={heroLogoRef} className="w-full flex items-center justify-center overflow-visible pointer-events-auto">
              <AnimatedLogo />
            </div>
          </div>
        </section>

        {/* 2. RADIO */}
        <section id="radio" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 flex flex-col justify-center items-center snap-start snap-always transform-gpu bg-[#181818]">
          <div className="text-white w-full space-y-8">
            <AnimateOnScroll duration={500} offset={20}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <img src="/images/Radio_en_Casa_logo_REC.svg" alt="REC Logo" className="h-6 md:h-8 w-auto object-contain flex-shrink-0" />
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider font-['Rethink_Sans',sans-serif] leading-[0.95] text-[#f74a35]">{radioData.label}</h2>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll duration={600} delay={100} offset={30}>{radioData.desc}</AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {radioProducts.map((prod, idx) => (
                <AnimateOnScroll key={prod.id} delay={150 * (idx + 1)} duration={600 + idx * 100} offset={50}>
                  <div className="bg-[#f74a35] text-white border-none p-0 rounded-none flex flex-col justify-between aspect-square shadow-xl overflow-hidden">
                    <div className="space-y-1.5 flex flex-col h-full justify-between p-3">
                      <div className="w-full h-1/2 overflow-hidden rounded-none bg-black/20">
                        <img src={prod.img} alt={prod.title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <div>
                        <h4 className="font-extrabold tracking-wide text-white font-['Rethink_Sans',sans-serif] text-sm">{prod.title}</h4>
                        <p className="text-xs font-['DM_Sans',sans-serif] text-white/90 leading-relaxed mt-0.5">{prod.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* PODCAST */}
        <section id="podcast" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 flex flex-col justify-center items-center snap-start snap-always transform-gpu bg-[#181818]">
          <div className="text-white w-full space-y-8">
            <AnimateOnScroll duration={500} offset={20}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <img src="/images/Radio_en_Casa_logo_REC.svg" alt="REC Logo" className="h-6 md:h-8 w-auto object-contain flex-shrink-0" />
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider font-['Rethink_Sans',sans-serif] leading-[0.95] text-[#f9772f]">{podcastData.label}</h2>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll duration={600} delay={100} offset={30}>{podcastData.desc}</AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {podcastProducts.map((prod, idx) => (
                <AnimateOnScroll key={prod.id} delay={150 * (idx + 1)} duration={600 + idx * 100} offset={50}>
                  <div className="bg-[#f9772f] text-white border-none p-0 rounded-none flex flex-col justify-between aspect-square shadow-xl overflow-hidden">
                    <div className="space-y-1.5 flex flex-col h-full justify-between p-3">
                      <div className="w-full h-1/2 overflow-hidden rounded-none bg-black/20">
                        <img src={prod.img} alt={prod.title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <div>
                        <h4 className="font-extrabold tracking-wide text-white font-['Rethink_Sans',sans-serif] text-sm">{prod.title}</h4>
                        <p className="text-xs font-['DM_Sans',sans-serif] text-white/90 leading-relaxed mt-0.5">{prod.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* STREAMING */}
        <section id="streaming" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 flex flex-col justify-center items-center snap-start snap-always transform-gpu bg-[#181818]">
          <div className="text-white w-full space-y-8">
            <AnimateOnScroll duration={500} offset={20}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <img src="/images/Radio_en_Casa_logo_REC.svg" alt="REC Logo" className="h-6 md:h-8 w-auto object-contain flex-shrink-0" />
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider font-['Rethink_Sans',sans-serif] leading-[0.95] text-[#f9b92f]">{streamingData.label}</h2>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll duration={600} delay={100} offset={30}>{streamingData.desc}</AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {streamingProducts.map((prod, idx) => (
                <AnimateOnScroll key={prod.id} delay={150 * (idx + 1)} duration={600 + idx * 100} offset={50}>
                  <div className="bg-[#f9b92f] text-[#181818] border-none p-0 rounded-none flex flex-col justify-between aspect-square shadow-xl overflow-hidden">
                    <div className="space-y-1.5 flex flex-col h-full justify-between p-3">
                      <div className="w-full h-1/2 overflow-hidden rounded-none bg-black/10">
                        <img src={prod.img} alt={prod.title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <div>
                        <h4 className="font-extrabold tracking-wide text-[#181818] font-['Rethink_Sans',sans-serif] text-sm">{prod.title}</h4>
                        <p className="text-xs font-['DM_Sans',sans-serif] text-neutral-900/90 leading-relaxed mt-0.5">{prod.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* OUTDOOR */}
        <section id="outdoor" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 flex flex-col justify-center items-center snap-start snap-always transform-gpu bg-[#181818]">
          <div className="text-white w-full space-y-8">
            <AnimateOnScroll duration={500} offset={20}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <img src="/images/Radio_en_Casa_logo_REC.svg" alt="REC Logo" className="h-6 md:h-8 w-auto object-contain flex-shrink-0" />
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider font-['Rethink_Sans',sans-serif] leading-[0.95] text-[#005266]">{outdoorData.label}</h2>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll duration={600} delay={100} offset={30}>{outdoorData.desc}</AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {outdoorProducts.map((prod, idx) => (
                <AnimateOnScroll key={prod.id} delay={150 * (idx + 1)} duration={600 + idx * 100} offset={50}>
                  <div className="bg-[#005266] text-white border-none p-0 rounded-none flex flex-col justify-between aspect-square shadow-xl overflow-hidden">
                    <div className="space-y-1.5 flex flex-col h-full justify-between p-3">
                      <div className="w-full h-1/2 overflow-hidden rounded-none bg-black/20">
                        <img src={prod.img} alt={prod.title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <div>
                        <h4 className="font-extrabold tracking-wide text-white font-['Rethink_Sans',sans-serif] text-sm">{prod.title}</h4>
                        <p className="text-xs font-['DM_Sans',sans-serif] text-white/90 leading-relaxed mt-0.5">{prod.desc}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN UNIFICADA HISTORIA + FILOSOFÍA + ARCHIVO */}
        <section id="historia" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 relative bg-[#181818] flex flex-col justify-center items-center snap-start snap-always transform-gpu">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start w-full relative">
            <div className="md:col-span-3 sticky top-32 z-10 space-y-6 bg-transparent p-0 border-none shadow-none">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[0.95] tracking-tight text-neutral-100 font-['Rethink_Sans',sans-serif]">
                Radio en Casa nace en noviembre de 2016. En ese momento internet, las redes sociales y las nuevas formas de consumo ya estaban transformando la manera en que las personas se comunicaban, pero la radio seguía manteniendo estructuras pensadas para otra época.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-300 leading-relaxed">
                <p>Entendimos que el futuro no estaba en trasladar una cabina tradicional a internet, sino en crear un espacio abierto, flexible y preparado para una nueva generación de contenidos.</p>
                <p>Un lugar donde la radio pudiera convivir con nuevos formatos, donde las personas fueran protagonistas y donde las historias pudieran expandirse más allá del audio.</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-8 border-l-2 border-[#5c5c5c]/40 pl-6">
              {historyCardsData.map((card, idx) => (
                <AnimateOnScroll key={idx} delay={120 * idx} duration={500 + idx * 80} offset={35}>
                  <div className="bg-transparent text-neutral-100 border-b-2 border-[#5c5c5c]/60 pb-6 flex flex-col justify-between hover:border-[#f74a35] transition-colors duration-300 group relative space-y-4">
                    {card.img ? (
                      <div className="w-full h-36 overflow-hidden rounded-none bg-[#141414] border border-[#5c5c5c]/40">
                        <img src={card.img} alt={card.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    ) : null}

                    <div className="flex items-baseline gap-3">
                      <span className="text-lg sm:text-xl font-extrabold text-[#f74a35] flex-shrink-0 font-['Rethink_Sans',sans-serif]">{card.year}</span>
                      <h4 className="font-extrabold text-white tracking-tight leading-snug font-['Rethink_Sans',sans-serif] text-sm">{card.title}</h4>
                    </div>

                    <p className="text-xs md:text-sm text-neutral-300 font-normal leading-relaxed font-['DM_Sans',sans-serif]">{card.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          {/* SLIDER CON ALTURA REDUCIDA A LA MITAD */}
          <div className="w-screen relative left-1/2 -translate-x-1/2 h-[50vh] min-h-[350px] my-16 bg-black overflow-hidden group">
            {fullscreenSliderImages.map((imgUrl, idx) => {
              const isActive = fullscreenSlideIndex === idx;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
                    isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Slider Fullscreen ${idx + 1}`}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}

            <button
              onClick={prevFullscreenSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-[#f74a35] text-white w-12 h-12 flex items-center justify-center font-bold text-xl border border-white/30 transition-all duration-300 cursor-pointer"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={nextFullscreenSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-[#f74a35] text-white w-12 h-12 flex items-center justify-center font-bold text-xl border border-white/30 transition-all duration-300 cursor-pointer"
              aria-label="Siguiente"
            >
              →
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
              {fullscreenSliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setFullscreenSlideIndex(idx)}
                  className={`h-3 rounded-full transition-all cursor-pointer ${
                    fullscreenSlideIndex === idx ? 'bg-[#f74a35] w-8' : 'bg-white/60 hover:bg-white w-3'
                  }`}
                  aria-label={`Ir a la imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="w-full min-h-screen h-screen relative overflow-hidden bg-[#181818] pt-8 flex flex-col justify-between items-center">
            <AnimateOnScroll duration={900} delay={100} offset={45} className="w-full">
              <div className="relative z-20 w-full flex flex-col items-center justify-center">
                <div className="w-full p-0 border-none shadow-none mx-auto bg-transparent">
                  <div className="space-y-6 text-xs md:text-sm font-normal leading-relaxed text-neutral-100 tracking-tight font-['DM_Sans',sans-serif]">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[0.95] font-['Rethink_Sans',sans-serif]">
                      Estamos en un PH antiguo reciclado en Palermo, Buenos Aires, Argentina. Un espacio con historia que transformamos para crear algo nuevo, y eso es parte de lo que nos define.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-2">
                      <div className="space-y-4">
                        <p>Construimos Radio en Casa a partir de una combinación que nos representa: la historia, el profesionalismo y la mística de la radio tradicional, junto con las nuevas herramientas y formatos que siguen transformando la comunicación.</p>
                        <p>Algunos le dicen podcast. Otros prefieren hablar de streaming. Para los más nostálgicos, seguirá siendo radio.</p>
                        <p className="font-semibold text-white">Para nosotros, son distintas formas de una misma necesidad: encontrarnos para contar algo.</p>
                        <p>Rompimos la cabina y abrimos el espacio porque creemos que las ideas necesitan lugar para crecer. Nos llenamos de micrófonos porque creemos en la diversidad de voces. Y sumamos cámaras porque entendemos que hoy las historias también se ven.</p>
                      </div>

                      <div className="space-y-4">
                        <p>Nos gusta estar a la vanguardia, pero no queremos ser una moda.</p>
                        <p>Exploramos formatos nuevos, pero buscamos que tengan sentido, identidad y permanencia. No queremos llegar a cualquiera: queremos conectar con las personas adecuadas.</p>
                        <p className="text-[#f74a35] font-semibold">Si sentís que tenés algo para contar, golpeanos la puerta.</p>
                        <p className="pt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-white border-t border-[#5c5c5c]/60">En Radio en Casa seguimos cambiando la forma de hacer radio.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-screen relative left-1/2 -translate-x-1/2 h-full absolute inset-0 z-0 overflow-hidden group">
                  {philosophyImages.map((imgUrl, idx) => {
                    const isActive = philosophySlideIndex === idx;
                    return (
                      <div key={idx} className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                        <img src={imgUrl} alt="Estudio" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 ease-out" />
                        <div className="absolute inset-0 bg-black/70" />
                      </div>
                    );
                  })}

                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30 pb-8">
                    {philosophyImages.map((_, idx) => (
                      <button key={idx} onClick={() => changePhilosophySlide(idx)} className={`h-3 rounded-full transition-all cursor-pointer ${philosophySlideIndex === idx ? 'bg-[#f74a35] w-8' : 'bg-white/60 hover:bg-white w-3'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <div id="archivo" className="w-full py-24 px-6 relative bg-transparent flex flex-col justify-center items-center snap-start snap-always transform-gpu pt-20">
            <AnimateOnScroll duration={600} offset={25} className="w-full space-y-12">
              <div className="space-y-6">
                <div className="inline-block">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider font-['Rethink_Sans',sans-serif] text-white leading-[0.95]">Archivo</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200 leading-relaxed pt-2">
                  <div className="space-y-3">
                    <p>Durante más de diez años trabajamos junto a proyectos independientes, empresas, organizaciones y comunidades que encontraron en Radio en Casa un espacio para desarrollar sus contenidos.</p>
                  </div>
                  <div className="space-y-3">
                    <p>Desde podcasts independientes hasta producciones para grandes marcas, instituciones culturales y fundaciones, ofrecemos la misma combinación: una infraestructura profesional y un espacio donde las ideas puedan crecer.</p>
                    <p className="text-[#f74a35] font-semibold border-t border-[#5c5c5c]/40 pt-2">Porque, más allá del formato o la escala, todos tienen algo en común: una historia que contar.</p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#1e1e1e] border border-[#5c5c5c]/60 p-6 overflow-hidden relative shadow-xl">
                <div className="animate-scroll-infinite flex items-center space-x-12">
                  {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((src, idx) => (
                    <div key={idx} className="h-12 w-32 flex items-center justify-center flex-shrink-0">
                      <img src={src} alt={`Cliente ${idx + 1}`} className="max-h-full max-w-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-8 shadow-2xl space-y-4 font-['DM_Sans',sans-serif]">
                <h4 className="text-white font-extrabold uppercase text-sm md:text-base tracking-wider font-['Rethink_Sans',sans-serif]">También pasaron por Radio en Casa</h4>
                <p className="text-neutral-300 text-xs md:text-sm leading-relaxed tracking-wide">
                  Ad Hoc Comunicación · Apciba · Bercomat · BNP Paribas Cardif · Bunker · Centro Simon Wiesenthal · Comiqueando · Cryptomate · Dot Hotels · Ecomm Experts · Escuela Libre de Psicoanálisis · Fundación Andreani · Fundación Cippec · Fundación Konrad Adenauer · Gran Logia de la Argentina · La Cosa Cine · La licuadora deportiva · LetterMafia · Meretz Argentina · Meridiana Comics · Milbrands · Museo Judío · Naldo · Natura · Nerdearla · Noticias en red · Open Folk · Parque podcast · Podlab · Press Over · Rayo podcasts · Revista Txtura · Sys Army · TTD Trabajadores Tango Danza · UMAI · Unplastify · XFC
                </p>
              </div>

              <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-8 shadow-2xl space-y-6 font-['DM_Sans',sans-serif]">
                <div className="space-y-3">
                  <h4 className="text-white font-extrabold uppercase text-sm md:text-base tracking-wider font-['Rethink_Sans',sans-serif]">La historia de esta casa</h4>
                  <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">Más de 200 proyectos forman parte del archivo de Radio en Casa. Algunos fueron podcasts, otros programas de radio, streaming o producciones especiales. Algunos grabaron un episodio. Otros hicieron de esta su casa durante años. Todos forman parte de nuestra historia:</p>
                </div>

                <div className="border-t border-[#5c5c5c]/40 pt-4">
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed tracking-wide font-mono">
                    70/30 · 4ta Nota · Acabar · Aguante comiquero · Al demonio con el diablo · Alfred Pennyworth Presenta · Argentina Inglaterra 1986 · Arrodillate y pedime perdón · A ser · Así pega · Batalla cultural · Beyond deadlines · Birra en casa · Boomerang 2.0 · Bruja moderna · Buen día banda · Cada una · Café con java · Café con psicoanálisis · Café fandango · Campos imaginarios · Casi Famosas · Catástrofes cotidianas · Centro Rojo · Charlas en el camino · Charlas entre almas · Checa en la radio · Cine ersátil y más · Comadre · Comedia · Cómo hacíamos sin vos · Compañero de ruta · Concha Podcast · Con eso no se jode · Copa o gulag · Corre Forest · Corazonada · Cosa rara · Cryptomate · Debe haber algo mejor · Datamundi · Debe haber algo mejor · Demasiados libros · Detrás del algoritmo · Disneycast · Don borbotón · Dos amigos hablando de musicales · Ecos · Efecto placebo · El amor después · El camino del héroe · El camino es hacia adentro · El Deseo de Pandora · Electrocíclicas · El fin del mundo · El Gourmet: 20 años siendo parte de tu vida · El gran podcast ilustrado · El grupo de los miércoles · El navío azul · El pasaje · El podcast de Chequeado · El poder de NosOtras · El probador · El refugio · Encendidas · Entre caníbales · Entre sabanas y diván · Eso que te mueve · Épico y bizarro · Es una trampa · Esto con Nat no pasaba · Euphoria: El Podcast · Expediente abierto · F5 Minds · Familia tipo · Feria americana · Familia Baredes · Filtrado · Filosa y jugosa · Filosos · Filtrado · Final del juego · Fomo · Formula Fan · Futuro abierto · Garys Road · Gatocracia · Geeky legal · Generación Y · Gente de mierd · Gorda podcast · Guía de supervivencia · Hablemos de música · Happening · Happy Hour · Hasta acá llegamos · Hasta la vista · #hellobaires · His Dark Materials: El Podcast · Hodor Hodor Hodor · Hotel, dulce hotel · Hoy trasnoche · Humanos · Humanos y Robots · Hundido · Hypeados · Inprevia · Intensos · Ir a más · Jaula de negocios · Juego interior · Juro que es Posta · Justo en el centro · La bruja y el cura · La chica de rulos · La crisis del amor · Lag mental · La gota · La hora Secretum · La papa · La podcast · La previa en casa · La radio MAK · La runfla · La scaloneta · La trama · La vida después de · La vuelta · Lettera 22 · Libre de Gluten · Linaje de brujas · Lineas paralelas · Locos & Bohemios · Los animales no se aburren · Los de afuera son de palo · Lucía y sus gemelas · Lupulados · Made in casa · Malas y Santas · Mas 54 radio · Más cerca del cielo · Mas rebeldes · Mega Viajeros Adventure · Mejor país del mundo · Mercurias · Misión presidencial · Modo positivo · Mondongo, el décimo arte · Mujeres extraordinarias · Mujeres soberanas · Mujeres teníamos que ser · Multicast · Mundo Vice · Mypod · Nenes de mamá · Niños indigo · No era el plan · No es lo que parece · No hay apuro · No hay backup · No me olvidé de vos · Nos tapó el agua · Notirey · No todo está perdido · Nunca ames a nadie · Off the record · Omitir intro · On the road · Opiniones memeticas · Pata de lana · Pausa Podcast · Pedí delivery · Pendejos madurando · Pernocte · Pica en Punta · Pila de libros · Pip podcast · Placeres violentos · Planeta 57 · Podcast 934 · Podcast al 13013 · Podcasteros del zodíaco · Podestodo · Podkas · Polémica en /VAR · Ponele · Por un puñado de dólares · Pulsión digital · Punchline · Punto Aparte · Punto de venta · Puta madre · Quemar un Patrullero · ¿Qué pasa? · Radio Guachafa · Radio La Flor · Rapidas y Furiosas · Rayuela · Realidad morosa · Remodelatour · Rompiendo la 4ta pared · Sana · Secuencia modulada · Sendero · Seremos Historia · Servicio Completo · Shelter · Shot de Tania · Sin barbijo · Sin dimensión · Sin filtro · Skyvan · Soltate el pelo · Somos FE · Somos novios · Subite al pony · Sumar inversión · Swingirls · Tecla cualquiera · Te cuento lo que veo · Tematizados · Territorio · Te sigo desde memento · The 8 agency · The Rebuild · Tiempo para más · Tiktalks · Todo es fake · Todo sobre la mesa · Tradición y futuro · Tradoctas · Tres pibas · Tripulación Atucha · Tu pregunta no molesta · Universo de posibilidades · Un mixtape · Un nuevo match · UPS · Urocast · Vale 4 · Vidas paralelas · Vivir Mashiaj · Volver al cine · Wachas · Watchmen: El Podcast · Who you are · Yonki · Y parió la abuela!
                </p>
              </div>

              <div className="pt-4 border-t border-[#5c5c5c]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-white font-medium text-xs sm:text-sm">¿Tu proyecto pasó por Radio en Casa y no aparece en este archivo?</span>
                <a href="mailto:info@radioencasa.com" className="relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[4px] px-5 py-2.5 text-xs font-bold tracking-[0.15em] hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200 cursor-pointer whitespace-nowrap">
                  Escribinos. Nos encantaría sumar ese recuerdo. →
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="comunidad" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 relative bg-[#181818] flex flex-col justify-center items-center snap-start snap-always transform-gpu">
        <div className="w-full space-y-8 relative z-10">
          <AnimateOnScroll duration={600} offset={25}>
            <div className="bg-transparent p-0 border-none shadow-none space-y-4 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200 leading-relaxed">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider text-white font-['Rethink_Sans',sans-serif] leading-[0.95]">Formá parte de Radio en Casa.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-2">
                <div className="space-y-3">
                  <p>En 2016 empezamos haciendo radio desde una casa. Hoy seguimos creyendo en la misma idea: crear un espacio libre para la música, las historias y las personas que tienen algo para decir.</p>
                  <p>Si alguna vez una canción, un programa, una charla o una historia nacida en Radio en Casa formed parte de tu vida, hoy podes ayudarnos a que este proyecto siga creciendo y llegue cada vez más lejos.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[#f74a35] font-bold border-t border-[#5c5c5c]/40 pt-2">Con una pequeña contribución mensual nos ayudas a seguir construyendo Radio en Casa y elegís cómo querés formar parte de esta historia.</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipsData.map((item, idx) => (
              <AnimateOnScroll key={item.id} delay={150 * (idx + 1)} duration={650 + idx * 80} offset={45}>
                <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-6 flex flex-col justify-between hover:border-[#f74a35] transition-all duration-300 shadow-xl h-full">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase border-b border-[#5c5c5c]/40 pb-2 font-['Rethink_Sans',sans-serif] leading-[1.0]">
                      {item.titleLine1}<br />{item.titleLine2}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-300 font-['DM_Sans',sans-serif] leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-6">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[6px] px-4 py-2.5 text-xs font-bold tracking-[0.2em] text-center hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200">
                      {item.buttonText}
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="store" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 bg-[#181818] relative flex flex-col justify-center items-center snap-start snap-always transform-gpu">
        <div className="w-full space-y-8">
          <AnimateOnScroll duration={600} offset={25}>
            <div className="bg-transparent p-0 border-none shadow-none space-y-4 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200 leading-relaxed">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider text-white font-['Rethink_Sans',sans-serif] leading-[0.95]">La mejor manera de llevarte un pedacito de Radio en Casa.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-2">
                <div className="space-y-3">
                  <p>En esta tienda vas a encontrar productos diseñados para quienes forman parte de nuestra comunidad: desde merchandising hasta ediciones especiales y objetos creados junto a artistas y proyectos amigos.</p>
                  <p>Cada compra nos ayuda a seguir construyendo este espacio independiente y a generar nuevas oportunidades para quienes eligen contar sus historias desde esta casa.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[#f74a35] font-semibold">Porque algunas historias también se pueden llevar puestas.</p>
                  <div className="pt-2 border-t border-[#5c5c5c]/40">
                    <p className="font-bold text-white">¿Sos parte de la Comunidad REC?</p>
                    <p className="text-xs sm:text-sm text-neutral-300">Como miembro de la comunidad accedés a descuentos exclusivos, lanzamientos anticipados y productos disponibles únicamente para suscriptores.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {storeProducts.map((prod, idx) => (
              <AnimateOnScroll key={prod.id} delay={180 * (idx + 1)} duration={700 + idx * 100} offset={50}>
                <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-4 flex flex-col justify-between hover:border-[#f74a35] transition-all duration-300 shadow-xl group relative h-full">
                  <div className="space-y-2">
                    <div className="w-full aspect-[4/3] overflow-hidden border border-[#5c5c5c]/40 relative bg-[#141414]">
                      <img src={prod.img} alt={prod.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'; }} />
                    </div>

                    <div className="space-y-0.5 font-['DM_Sans',sans-serif]">
                      <span className="text-[10px] text-neutral-400 font-bold block uppercase">{prod.category}</span>
                      <h4 className="font-extrabold text-white uppercase leading-snug font-['Rethink_Sans',sans-serif] text-xs">{prod.title}</h4>
                      <p className="text-[11px] text-neutral-400">{prod.sizes}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#5c5c5c]/40 mt-2 flex justify-between items-center font-['DM_Sans',sans-serif]">
                    <span className="text-sm font-bold text-[#f9b92f]">{prod.price}</span>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll delay={400} duration={600} offset={20}>
            <div className="w-full flex justify-center pt-2">
              <a href="https://radioencasa.mitiendanube.com/" target="_blank" rel="noopener noreferrer" className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[6px] px-8 py-3.5 text-sm font-bold tracking-[0.2em] text-center hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200">
                Ir a la tienda →
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="vecinos" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 bg-[#181818] relative flex flex-col justify-center items-center snap-start snap-always transform-gpu">
        <div className="w-full space-y-6">
          <AnimateOnScroll duration={600} offset={25}>
            <div className="w-full bg-[#1e1e1e] p-6 border border-[#5c5c5c]/60 shadow-xl space-y-3 font-['DM_Sans',sans-serif] text-xs md:text-sm text-neutral-200 leading-relaxed">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider text-white font-['Rethink_Sans',sans-serif] leading-[0.95]">Las mejores casas nunca están solas.</h2>
              <p>Con el tiempo fuimos encontrando otros espacios, proyectos y personas con quienes compartimos una misma manera de entender la cultura, la comunicación y la creación de comunidad. No vivimos bajo el mismo techo, pero sí en el mismo barrio.</p>
              <p className="text-[#f74a35] font-semibold">Generamos alianzas estratégicas con algunos espacios amigos.</p>
              <p>Estas relaciones nos permiten crecer juntos, desarrollar proyectos en conjunto y ofrecer beneficios exclusivos para quienes forman parte de la Comunidad REC.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimateOnScroll delay={200} duration={700} offset={45}>
              <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#f74a35] transition-colors duration-300 h-full">
                <div className="space-y-4 font-['DM_Sans',sans-serif]">
                  <div className="h-10 w-auto flex items-center justify-start">
                    <img src="/images/programas/Salgo_Arriba_Logo_Radio_en_Casa.png" alt="Salgo Arriba Logo" className="max-h-full w-auto object-contain filter invert opacity-90" />
                  </div>
                  <h4 className="text-white tracking-tight font-extrabold font-['Rethink_Sans',sans-serif] text-sm">Salgo Arriba</h4>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">Espacio para eventos, experiencias y producciones audiovisuales situado en Recoleta.</p>
                  <p className="text-xs text-white font-semibold border-l-2 border-[#f74a35] pl-3 py-1 bg-white/5">Como miembro de la Comunidad REC accedés a descuentos exclusivos en sus eventos y servicios.</p>
                </div>

                <div className="pt-3 border-t border-[#5c5c5c]/40 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-[#f74a35] font-bold">@salgoarriba</span>
                  <a href="https://www.salgoarriba.com" target="_blank" rel="noopener noreferrer" className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[4px] px-3 py-1.5 text-xs font-bold tracking-[0.15em] hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200">
                    www.salgoarriba.com →
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={350} duration={850} offset={55}>
              <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#f74a35] transition-colors duration-300 h-full">
                <div className="space-y-4 font-['DM_Sans',sans-serif]">
                  <div className="h-10 w-auto flex items-center justify-start">
                    <span className="font-['Rethink_Sans',sans-serif] font-black text-xl text-white tracking-wider border-2 border-white px-3 py-1 uppercase">PROYECTO ROSCA</span>
                  </div>
                  <h4 className="text-white tracking-tight font-extrabold font-['Rethink_Sans',sans-serif] text-sm">Proyecto Rosca</h4>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">Estudio de diseño y arquitectura especializado en la puesta en valor de espacios, marcas e identidad visual.</p>
                  <p className="text-xs text-white font-semibold border-l-2 border-[#f74a35] pl-3 py-1 bg-white/5">Como miembro de la Comunidad REC accedés a una primera instancia de asesoramiento sin cargo.</p>
                </div>

                <div className="pt-3 border-t border-[#5c5c5c]/40 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-[#f74a35] font-bold">@proyectorosca</span>
                  <a href="https://www.proyectorosca.com" target="_blank" rel="noopener noreferrer" className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[4px] px-3 py-1.5 text-xs font-bold tracking-[0.15em] hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200">
                    www.proyectorosca.com →
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={450} duration={600} offset={20}>
            <div className="bg-[#1e1e1e] border border-[#5c5c5c]/60 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-['DM_Sans',sans-serif] text-xs md:text-sm">
              <span className="text-white font-medium">¿Querés formar parte de la Comunidad REC?</span>
              <button onClick={() => scrollToSection('comunidad')} className="relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[4px] px-5 py-2.5 text-xs font-bold tracking-[0.15em] hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200 cursor-pointer whitespace-nowrap">
                Sumate y disfrutá los beneficios →
              </button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="fanzine" className="w-full pt-24 md:pt-32 pb-32 md:pb-48 px-6 md:px-16 lg:px-24 relative overflow-hidden bg-[#181818] flex flex-col justify-center items-center snap-start snap-always transform-gpu">
        <AnimateOnScroll duration={750} offset={35}>
          <div className="relative z-10 bg-transparent p-0 border-none shadow-none w-full">
            <div className="space-y-4 font-['DM_Sans',sans-serif] text-xs sm:text-sm md:text-base text-neutral-100 leading-relaxed">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wider text-white font-['Rethink_Sans',sans-serif] leading-[0.95]">No todo lo que pasa en Radio en Casa entra en un programa o un podcast.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-2">
                <div className="space-y-3">
                  <p>Este es nuestro tablero de anuncios, diario de viaje y cartelera comunitaria. Un lugar donde compartimos novedades, recomendaciones, lanzamientos, convocatorias y todo aquello que creemos que vale la pena descubrir.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[#f74a35] font-bold border-t border-[#5c5c5c]/60 pt-3">Porque una comunidad no se construye solamente grabando contenidos. También se construye compartiendo lo que nos entusiasma.</p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section id="la-casa" className="w-full pt-24 md:pt-32 pb-0 mb-0 bg-[#181818] text-[#ececec] relative flex flex-col justify-between overflow-hidden snap-start snap-always transform-gpu">
        <div className="w-full h-[450px] bg-[#111111] border-y border-[#5c5c5c]/60 relative overflow-hidden group shadow-xl">
          <iframe title="Mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5826978182937!2d-58.4238515!3d-34.5893083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb58097b6294b%3A0x6b453a2ef5638c4b!2sMalabia%202134%2C%20C1425EZD%20CABA%2C%20Argentina!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar" className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-80 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700 ease-out" loading="lazy" allowFullScreen />
        </div>

        <div className="w-full space-y-6 mt-6 px-6 md:px-16 lg:px-24 mb-0 pb-0">
          <AnimateOnScroll duration={600} offset={25}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[0.95] font-['Rethink_Sans',sans-serif]">
              Durante toda esta web hablamos de una casa. Ahora queremos mostrarte dónde está.
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-['DM_Sans',sans-serif] text-xs text-neutral-200">
            <AnimateOnScroll delay={100} duration={600} offset={30}>
              <div className="bg-[#1e1e1e] p-5 border border-[#5c5c5c]/60 shadow-xl space-y-3 leading-relaxed flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <h4 className="tracking-widest text-[#f74a35] font-extrabold border-b border-[#5c5c5c]/40 pb-1 font-['Rethink_Sans',sans-serif] text-xs">El espacio</h4>
                  <p className="text-[10px] sm:text-xs">Estamos en un PH reciclado de Palermo Soho, Buenos Aires. Un espacio que combina la historia y la calidez de una casa con la infraestructura de un estudio profesional.</p>
                </div>
                <p className="text-white font-bold border-l-2 border-[#f74a35] pl-2 py-0.5 bg-white/5 text-[10px]">Pensado para crear, grabar y compartir historias.</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={220} duration={700} offset={40}>
              <div className="bg-[#1e1e1e] p-5 border border-[#5c5c5c]/60 shadow-xl space-y-3 leading-relaxed flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <h4 className="tracking-widest text-[#f74a35] font-extrabold border-b border-[#5c5c5c]/40 pb-1 font-['Rethink_Sans',sans-serif] text-xs">Dónde estamos</h4>
                  <p className="text-white font-bold text-[10px] sm:text-xs">Malabia 2134 (C1425EZD) Palermo Soho, CABA.</p>
                  <p className="text-[10px] sm:text-xs text-neutral-300">A una cuadra de Av. Scalabrini Ortiz y tres de Av. Santa Fe, en uno de los polos culturales más activos de la ciudad.</p>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={340} duration={800} offset={50}>
              <div className="bg-[#1e1e1e] p-5 border border-[#5c5c5c]/60 shadow-xl space-y-3 leading-relaxed flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <h4 className="tracking-widest text-[#f74a35] font-extrabold border-b border-[#5c5c5c]/40 pb-1 font-['Rethink_Sans',sans-serif] text-xs">Contacto directo</h4>
                  <div className="space-y-1.5 text-[10px] sm:text-xs">
                    <p className="flex items-center gap-2"><span className="text-[#f74a35]">📞</span><a href="tel:+541148317132" className="hover:text-white transition-colors">(+54 11) 4831-7132</a></p>
                    <p className="flex items-center gap-2"><span className="text-[#f74a35]">✉️</span><a href="mailto:info@radioencasa.com" className="hover:text-[#f74a35] transition-colors underline font-bold">info@radioencasa.com</a></p>
                    <p className="flex items-center gap-2"><span className="text-[#f74a35]">📷</span><a href="https://www.instagram.com/radioencasa/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@radioencasa</a></p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={400} duration={600} offset={30}>
            <div className="w-full bg-[#1e1e1e] p-6 border border-[#5c5c5c]/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-['DM_Sans',sans-serif]">
              <div className="space-y-1">
                <h4 className="tracking-widest text-[#f74a35] font-extrabold font-['Rethink_Sans',sans-serif] text-xs">¿Nos tomamos un café?</h4>
                <p className="text-xs sm:text-sm text-neutral-300">Si querés grabar un podcast, hacer un streaming, producir un programa o conocer el estudio, escribinos. Las mejores historias casi siempre empiezan conversando.</p>
              </div>
              <p className="text-[#f74a35] font-bold uppercase tracking-wider text-xs whitespace-nowrap border-t sm:border-t-0 sm:border-l border-[#5c5c5c]/40 pt-2 sm:pt-0 sm:pl-4">La puerta está abierta.</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500} duration={600} offset={15}>
            <div className="pt-4 border-t border-[#5c5c5c]/40 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-xs text-neutral-300 pb-20 mb-0">
              <div className="flex items-center gap-2 font-bold tracking-tight">
                <span>© {currentYear} RADIO EN CASA</span>
                <span className="text-neutral-500">•</span>
                <span className="text-[#f74a35] uppercase">“Mudamos la forma de hacer radio”</span>
              </div>
              <p className="text-[11px]">
                Design & Dev. by <a href="https://www.guapo.studio" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#f74a35] underline underline-offset-2 transition-colors duration-300 font-bold">Guapo./</a>
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>

    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-1000 ease-out transform ${isHeroIntroComplete ? 'translate-y-0' : 'translate-y-full'}`}>
      <IframePlayer width={heroLogoWidth} isForceCollapsed={isPlayerCollapsed} />
    </div>
  </div>
);
}