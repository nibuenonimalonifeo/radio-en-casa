'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Script from 'next/script';
import AnimatedLogo from '@/components/AnimatedLogo';
import IframePlayer from '@/components/IframePlayer';

// --- INTERFAZ COMPLETA PARA POSTS DE SUBSTACK ---

interface SubstackPost {
  id: number;
  title: string;
  subtitle?: string;
  canonical_url: string;
  cover_image?: string;
  post_date: string;
}

// --- COMPONENTE SUBSTACK FEED (FANZINE) ---

function SubstackFanzineFeed() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSubstackPosts() {
      try {
        setLoading(true);
        const res = await fetch('/api/substack');
        if (!res.ok) throw new Error('Error al conectar con el RSS');
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.warn('Error al cargar publicaciones de Substack:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubstackPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 font-datatype">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-neutral-800 rounded-none p-5 h-64 animate-pulse flex flex-col justify-between">
            <div className="w-full h-32 bg-neutral-800 rounded-none mb-3" />
            <div className="h-4 bg-neutral-800 rounded-none w-3/4 mb-2" />
            <div className="h-3 bg-neutral-800 rounded-none w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pt-4 font-datatype">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <a
              key={post.id}
              href={post.canonical_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#1a1a1a] border border-[#5c5c5c]/60 hover:border-[#f74a35] rounded-none overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
            >
              {post.cover_image ? (
                <div className="w-full h-40 overflow-hidden bg-black/60 relative">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/80 text-[#f74a35] text-[9px] font-bold px-2 py-0.5 rounded-none uppercase border border-[#f74a35]/40 font-datatype">
                    {new Date(post.post_date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              ) : (
                <div className="w-full h-24 bg-[#141414] border-b border-white/5 flex items-center justify-start px-5 relative">
                  <span className="text-[#f74a35] font-black text-xs uppercase tracking-widest font-datatype">
                    RADIO EN CASA /// FANZINE
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 font-datatype">
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-[#e3e3e3] text-base group-hover:text-[#f74a35] transition-colors leading-snug font-boldonse">
                    {post.title}
                  </h4>
                  {post.subtitle && (
                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed font-datatype">
                      {post.subtitle}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-[#f74a35] font-bold uppercase tracking-wider font-datatype">
                  <span>Leer publicación</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full bg-[#1a1a1a] p-8 border border-[#f74a35] rounded-none text-center space-y-4 font-datatype">
            <p className="text-neutral-300 text-base font-datatype">
              Visitá nuestro boletín completo directamente en Substack para leer todas las publicaciones del Fanzine.
            </p>
            <a
              href="https://radioencasa.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#f74a35] border-b-[8px] px-6 py-3 text-xs sm:text-sm font-bold tracking-[0.15em] hover:bg-[#f74a35] hover:text-white transition-all duration-200 uppercase font-datatype"
            >
              Ir a Substack →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTE CHAT EN VIVO DE TLK.IO (WIDGET EMBEBIDO DARK) ---

function TlkioChat() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.getElementById('tlkio-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'tlkio-script';
    script.src = 'https://tlk.io/embed.js';
    script.type = 'text/javascript';
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      const s = document.getElementById('tlkio-script');
      if (s) s.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative min-h-[380px] bg-[#121212] overflow-hidden rounded-xl border border-white/10">
      <div
        id="tlkio"
        data-channel="hey"
        data-theme="theme--night"
        className="w-full h-full min-h-[380px]"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// --- MINI SLIDER PARA SALGO ARRIBA (VECINOS) ---

function SalgoArribaSlider() {
  const images = [
    '/images/vecinos/Radio_en_Casa_Vecinos_Salgo_Arriba_01.png',
    '/images/vecinos/Radio_en_Casa_Vecinos_Salgo_Arriba_02.png',
    '/images/vecinos/Radio_en_Casa_Vecinos_Salgo_Arriba_03.png',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full h-36 overflow-hidden rounded-none bg-black border border-white/10 relative my-3">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Salgo Arriba Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ))}
      <div className="absolute bottom-2 right-2 flex gap-1 z-10">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i === index ? 'bg-[#f74a35]' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// --- COMPONENTE TIPO MÁQUINA DE ESCRIBIR PARA DATOS DINÁMICOS ---

function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    setDisplayed(text);
  }, [text]);

  return <span>{displayed}</span>;
}

// --- COMPONENTE AUXILIAR PARA FADE-IN DESDE ABAJO ---

function ScrollFadeText({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
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
      className={`transition-all duration-700 ease-out transform-gpu ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(25px)',
      }}
    >
      {children}
    </div>
  );
}

// --- TITULAR MÁQUINA DE ESCRIBIR UNIFICADO ---

function TypewriterHeadingUnificado({
  text,
  className = '',
  onComplete,
  threshold = 0.25,
}: {
  text: string;
  className?: string;
  onComplete?: () => void;
  threshold?: number;
}) {
  const sanitizedText = text.replace(/\.+$/, '').trim();

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTyping(true);
        } else {
          setIsTyping(false);
          setDisplayText('');
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!isTyping) return;

    let index = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      index++;
      if (index <= sanitizedText.length) {
        setDisplayText(sanitizedText.slice(0, index));
      } else {
        clearInterval(timer);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 32);

    return () => clearInterval(timer);
  }, [isTyping, sanitizedText]);

  const baseText = displayText.length > 0 ? displayText.slice(0, -1) : '';
  const lastChar = displayText.length > 0 ? displayText.slice(-1) : '';
  const isFinished = displayText.length === sanitizedText.length && displayText.length > 0;

  const defaultH1Classes =
    'text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold text-[#e3e3e3] font-boldonse tracking-tight relative h1-custom leading-[1.8rem] sm:leading-[3.82rem]';

  return (
    <h1
      ref={ref}
      className={className || defaultH1Classes}
    >
      <span style={{ fontSize: 'inherit' }}>{baseText}</span>
      {lastChar && (
        <span
          style={{ fontSize: 'inherit' }}
          className={`inline-block transition-all duration-100 ${
            !isFinished ? 'text-[#f74a35] scale-105 filter drop-shadow-[0_0_8px_rgba(247,74,53,0.8)]' : ''
          }`}
        >
          {lastChar}
        </span>
      )}
      <span style={{ fontSize: 'inherit' }} className="animate-pulse text-[#f74a35] font-boldonse inline-block ml-1.5">
        _
      </span>
    </h1>
  );
}

// --- COMPONENTE DE CARTAS EN RUEDA / PERSPECTIVA 3D ---

function FanStackedCards({ items }: { items: typeof historyCardsData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const cardThemes = [
    { bg: 'bg-[#f74a35]', text: 'text-[#e3e3e3]', num: 'text-[#e3e3e3]/30' },
    { bg: 'bg-[#181818]', text: 'text-[#e3e3e3]', num: 'text-[#e3e3e3]/20' },
    { bg: 'bg-[#f0ece1]', text: 'text-neutral-900', num: 'text-neutral-400' },
    { bg: 'bg-[#1e1e1e]', text: 'text-[#e3e3e3]', num: 'text-[#e3e3e3]/20' },
  ];

  return (
    <div className="relative w-full flex flex-col items-center md:items-end justify-center py-6 overflow-visible min-h-[550px] md:min-h-[620px] font-datatype">
      <div className="relative w-full max-w-[320px] sm:max-w-[460px] min-h-[480px] sm:min-h-[500px] flex items-center justify-center [perspective:1200px]">
        {items.map((card, idx) => {
          const total = items.length;
          let offset = idx - currentIndex;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          const isCenter = offset === 0;
          const theme = cardThemes[idx % cardThemes.length];

          const rotateZ = offset * -7; 
          const translateY = offset * 40; 
          const translateX = offset * 12;
          const translateZ = -Math.abs(offset) * 80;
          const scale = isCenter ? 1 : 0.92 - Math.abs(offset) * 0.05;
          const opacity = Math.abs(offset) > 3 ? 0 : 1 - Math.abs(offset) * 0.2;

          return (
            <div
              key={card.id}
              onClick={() => setCurrentIndex(idx)}
              className={`absolute w-full h-auto ${theme.bg} ${theme.text} border-2 border-[rgb(23_23_23_/_0)] p-5 sm:p-6 pb-7 sm:pb-8 shadow-2xl transition-all duration-700 ease-out cursor-pointer select-none rounded-none flex flex-col justify-between font-datatype overflow-visible`}
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                opacity,
                zIndex: 30 - Math.abs(offset),
              }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-datatype text-2xl sm:text-3xl font-black uppercase tracking-widest opacity-90">
                    {card.year}
                  </span>
                </div>
                <span className={`text-5xl sm:text-6xl font-black leading-none font-datatype ${theme.num}`}>
                  {card.id}
                </span>
              </div>

              {card.img && isCenter ? (
                <div className="w-full h-36 sm:h-44 my-3 sm:my-4 overflow-hidden rounded-none bg-neutral-950/90 border border-black/30 flex-shrink-0 shadow-inner p-1">
                  <img
                    src={card.img}
                    alt={`Hito ${card.year}`}
                    className="w-full h-full object-cover rounded-none"
                  />
                </div>
              ) : null}

              <p className="text-base sm:text-lg md:text-xl font-datatype leading-relaxed opacity-95 pt-2">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-12 sm:mt-20 z-40 justify-center md:justify-start w-full max-w-[460px]">
        <button
          onClick={handlePrev}
          className="bg-[#242424] text-[#e3e3e3] hover:bg-[#f74a35] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl border border-transparent cursor-pointer rounded-none font-datatype p-3.5 sm:p-4 group"
          aria-label="Anterior"
          title="Hito anterior"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 fill-current transform transition-transform duration-300 group-hover:-translate-x-1" 
            viewBox="0 0 24 24"
          >
            <path d="M11 17.25L4.25 12L11 6.75V17.25ZM19.75 17.25L13 12L19.75 6.75V17.25Z" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="bg-[#242424] text-[#e3e3e3] hover:bg-[#f74a35] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl border border-transparent cursor-pointer rounded-none font-datatype p-3.5 sm:p-4 group"
          aria-label="Siguiente"
          title="Siguiente hito"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 fill-current transform transition-transform duration-300 group-hover:translate-x-1" 
            viewBox="0 0 24 24"
          >
            <path d="M13 6.75L19.75 12L13 17.25V6.75ZM4.25 6.75L11 12L4.25 17.25V6.75Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// --- RECONOCIMIENTOS EN 1 COLUMNA PARA MOBILE Y 3 COLUMNAS PARA DESKTOP ---

function Recognitions3Columns({ items }: { items: typeof recognitionsData; scrollProgress?: number }) {
  const renderVideoHeader = () => (
    <div className="w-full aspect-video mb-4 overflow-hidden rounded-none border border-neutral-300 shadow-sm bg-black flex-shrink-0">
      <iframe
        src="https://www.youtube.com/embed/CcGWn2xLLJY"
        title="Reconocimientos Radio en Casa"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 font-datatype">
      {/* VISTA MÓVIL */}
      <div className="flex md:hidden flex-col gap-4 w-full">
        {renderVideoHeader()}
        {items.map((rec) => (
          <div
            key={rec.id}
            className="bg-white/95 backdrop-blur-sm border border-neutral-300 p-5 rounded-none shadow-md hover:border-[#f74a35] transition-colors text-left"
          >
            <span className="text-xl font-black text-[#f74a35] font-boldonse">{rec.year}</span>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider my-1">{rec.media}</p>
            <h4 className="font-extrabold text-neutral-900 text-base font-boldonse">{rec.title}</h4>
            <p className="text-sm text-neutral-700 mt-2 font-datatype">{rec.desc}</p>
            {rec.link && (
              <a
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-[#f74a35] mt-3 hover:underline"
              >
                Nota completa →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* VISTA DESKTOP */}
      {[
        items.filter((_, i) => i % 3 === 0),
        items.filter((_, i) => i % 3 === 1),
        items.filter((_, i) => i % 3 === 2),
      ].map((colItems, colIndex) => (
        <div
          key={colIndex}
          className="hidden md:block max-h-[60vh] overflow-y-auto space-y-4 pr-1.5 custom-scrollbar overscroll-contain"
        >
          {renderVideoHeader()}
          {colItems.map((rec) => (
            <div
              key={rec.id}
              className="bg-white/95 backdrop-blur-sm border border-neutral-300 p-5 rounded-none shadow-md hover:border-[#f74a35] transition-colors text-left"
            >
              <span className="text-xl font-black text-[#f74a35] font-boldonse">{rec.year}</span>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider my-1">{rec.media}</p>
              <h4 className="font-extrabold text-neutral-900 text-base font-boldonse">{rec.title}</h4>
              <p className="text-sm text-neutral-700 mt-2 font-datatype">{rec.desc}</p>
              {rec.link && (
                <a
                  href={rec.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-[#f74a35] mt-3 hover:underline"
                >
                  Nota completa →
                </a>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

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

const homeHeroImages = Array.from({ length: 5 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `/images/home/Radio_en_Casa_Galeria_Home_${num}.jpg`;
});

const philosophyImages = Array.from({ length: 15 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `/images/galeria/Radio_en_Casa_Galeria_${num}.jpg`;
});

const clientLogos = [
  '/images/clientes/logo_1.png',
  '/images/clientes/logo_2.png',
  '/images/clientes/logo_3.png',
  '/images/clientes/logo_4.png',
  '/images/clientes/logo_5.png',
  '/images/clientes/logo_6.png',
  '/images/clientes/logo_7.png',
  '/images/clientes/logo_8.png',
  '/images/clientes/logo_9.png',
  '/images/clientes/logo_10.png',
  '/images/clientes/logo_11.png',
  '/images/clientes/logo_12.png',
  '/images/clientes/logo_13.png',
  '/images/clientes/logo_14.png',
  '/images/clientes/logo_15.png',
  '/images/clientes/logo_16.png',
  '/images/clientes/logo_17.png',
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

const servicesQuadrants = [
  {
    id: 'radio',
    label: 'Hacemos radio',
    bgColor: 'rgba(22, 22, 22, 0.85)',
    accentColor: '#e3e3e3',
    shortDesc: 'Radio en vivo online transmitida para todo el mundo con calidad profesional.',
    fullText: 'Un formato para quienes, como nosotros, creen que la radio nunca va a morir. Fue la forma en la que empezamos en 2016 y sigue siendo parte de nuestra identidad. Por eso seguimos ofreciendo la posibilidad de crear programas de radio transmitidos en vivo a través de nuestra web, desde donde también difundimos artistas que forman parte de nuestra comunidad. A diferencia de los medios tradicionales, la transmisión online permite que tu contenido pueda escucharse desde cualquier lugar del mundo. Además, formamos parte de plataformas como TuneIn y RadioCut.',
  },
  {
    id: 'podcast',
    label: 'Hacemos podcast',
    bgColor: 'rgba(32, 32, 32, 0.85)',
    accentColor: '#e3e3e3',
    shortDesc: 'Producción integral de audio y video podcast de alta fidelidad.',
    fullText: 'El podcast es probablemente el formato donde más recorrido tenemos. Durante varios años fuimos el estudio elegido por Posta, participando del crecimiento de una industria que recién comenzaba a desarrollarse y grabando en 2019 los primeros contenidos originales de Spotify producidos en nuestro país. Acompañamos proyectos independientes como Concha Podcast y Quemar un Patrullero. Realizamos podcasts en formato audio y video, ofreciendo grabación, edición y diseño sonoro.',
  },
  {
    id: 'streaming',
    label: 'Hacemos streaming',
    bgColor: 'rgba(26, 26, 26, 0.85)',
    accentColor: '#e3e3e3',
    shortDesc: 'Transmisiones multicámara Full HD en vivo para YouTube, Twitch e Instagram.',
    fullText: 'El streaming puede parecer un formato nuevo, pero para nosotros empezó antes. En 2018 realizamos nuestras primeras transmisiones audiovisuales en vivo, cuando este formato todavía no tenía la dimensión que alcanzaría años después. Producimos streamings para canales propios o plataformas como YouTube, Twitch, Facebook, X e Instagram. Trabajamos con un sistema multicámara Full HD 1920x1080, switcher profesional y cámaras inalámbricas.',
  },
  {
    id: 'outdoor',
    label: 'Vamos a donde digas',
    bgColor: 'rgba(18, 18, 18, 0.85)',
    accentColor: '#e3e3e3',
    shortDesc: 'Coberturas audiovisuales, unidades móviles y eventos en exteriores.',
    fullText: 'Así llamamos a todo aquello que hacemos fuera del estudio. Llevamos nuestra experiencia, tecnología y manera de hacer contenidos a nuevos escenarios. Realizamos coberturas, transmisiones y registros audiovisuales en eventos, teatros, festivales y locaciones privadas. Ideal para entrevistas en exteriores o formatos presenciales. A lo largo de los años realizamos producciones en Ciudad Cultural Konex, Teatro Margarita Xirgu y nuestro espacio Salgo Arriba.',
  },
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

const recognitionsData = [
  {
    id: '09',
    year: '2026',
    media: 'Diario MDZ',
    title: 'John Buis: "La profundidad en 119 minutos"',
    desc: 'Entrevista sobre la vigencia del formato largo frente al consumo efímero de redes sociales.',
    link: 'https://www.mdzol.com/sociedad/john-buis-la-profundidad-no-esta-lo-que-viste-los-primeros-dos-segundos-sino-los-119-minutos-que-no-entran-un-reel-n1562006'
  },
  {
    id: '08',
    year: '2025',
    media: 'Universidad de San Isidro / Buena Cosecha',
    title: 'Festival ReSuena & Libro "Oficios Varios"',
    desc: 'Convocatoria al Panel Nacional de Podcast y publicación del relato "Trabajar y vivir en Radio en Casa".',
    link: 'https://buenacosechaeditora.mitiendanube.com/productos/oficios-varios-e4tal/'
  },
  {
    id: '07',
    year: '2023',
    media: 'Premio Internacional Poldy Bird',
    title: 'Medalla de Condecoración',
    desc: 'Reconocimiento a la trayectoria por la contribución e innovación continua en los medios radiales.',
    link: null
  },
  {
    id: '06',
    year: '2021',
    media: 'Editorial Galerna',
    title: 'Libro "Hacer radio hoy"',
    desc: 'Participación especial con testimonio de gestión en la obra de Mario Portugal y Héctor Yudchak.',
    link: 'https://www.google.com.ar/books/edition/Hacer_radio_hoy/UuwgEAAAQBAJ?hl=es-419&gbpv=0'
  },
  {
    id: '05',
    year: '2020',
    media: 'UADE',
    title: 'Nuevos formatos de comunicación',
    desc: 'Conferencia universitaria sobre la transformación del audio analógico a streaming y podcast.',
    link: 'https://www.youtube.com/watch?v=KwANj0JPNQc'
  },
  {
    id: '04',
    year: '2019',
    media: 'UCA (Radiofónicos)',
    title: 'Programa Browser',
    desc: 'Mesa de debate sobre las nuevas plataformas de contenidos sonoros e identidad independiente.',
    link: 'https://www.facebook.com/watch/live/?ref=watch_permalink&v=794138124291700'
  },
  {
    id: '03',
    year: '2019',
    media: 'Percha Mag',
    title: 'Entrevista a fondo',
    desc: 'Nota de cobertura cultural sobre el fenómeno independiente y la comunidad de creadores del estudio.',
    link: 'http://www.perchamag.com.ar/'
  },
  {
    id: '02',
    year: '2017',
    media: 'Escuela de Comunicación (ETER)',
    title: 'Experiencia y pasión por la radio',
    desc: 'Entrevista académica sobre la fundación, modelo de trabajo e innovación tecnológica en Radio en Casa.',
    link: 'https://eter.edu.ar/pasa-en-eter/mas-experiencias-y-mas-ganas-de-hacer-radio'
  },
  {
    id: '01',
    year: '2017',
    media: 'Infobae',
    title: 'Una visita a la fábrica de podcasts más grande de Argentina',
    desc: 'Informe especial sobre el rol pionero de Radio en Casa como hub de producción de audio digital.',
    link: 'https://www.infobae.com/tendencias/2017/09/19/una-visita-a-la-fabrica-de-podcasts-mas-grande-de-argentina/'
  }
];

const rawArchiveTextHTML = `<strong class="font-extrabold text-[#f74a35]">70/30</strong> · 4ta Nota · Acabar · Aguante comiquero · Al demonio con el diablo · Alfred Pennyworth Presenta · Argentina Inglaterra 1986 · Arrodillate y pedime perdón · A ser · Así pega · Batalla cultural · Beyond deadlines · Birra en casa · Boomerang 2.0 · Bruja moderna · Buen día banda · Cada una · Café con java · Café con psicoanálisis · Café fandango · Campos imaginarios · Casi Famosas · Catástrofes cotidianas · <strong class="font-extrabold text-[#f74a35]">Centro Simon Wiesenthal</strong> · Charlas en el camino · Charlas entre almas · Checa en la radio · Cine ersátil y más · <strong class="font-extrabold text-[#f74a35]">Comadre</strong> · Comedia · Cómo hacíamos sin vos · Compañero de ruta · <strong class="font-extrabold text-[#f74a35]">Concha Podcast</strong> · Con eso no se jode · Copa o gulag · Corre Forest · Corazonada · Cosa rara · Cryptomate · Debe haber algo mejor · Datamundi · Debe haber algo mejor · Demasiados libros · Detrás del algoritmo · Disneycast · Don borbotón · <strong class="font-extrabold text-[#f74a35]">Dot Hotels</strong> · Dos amigos hablando de musicales · Ecos · Efecto placebo · El amor después · El camino del héroe · El camino es hacia adentro · El Deseo de Pandora · Electrocíclicas · El fin del mundo · El Gourmet: 20 años siendo parte de tu vida · El gran podcast ilustrado · El grupo de los miércoles · <strong class="font-extrabold text-[#f74a35]">El navío azul</strong> · El pasaje · El podcast de Chequeado · El poder de NosOtras · El probador · El refugio · <strong class="font-extrabold text-[#f74a35]">Encendidas</strong> · Entre caníbales · Entre sabanas y diván · Eso que te mueve · Épico y bizarro · Es una trampa · Esto con Nat no pasaba · Euphoria: El Podcast · Expediente abierto · F5 Minds · Familia tipo · Feria americana · Familia Baredes · Filtrado · Filosa y jugosa · Filosos · Filtrado · Final del juego · Fomo · Formula Fan · Futuro abierto · Garys Road · Gatocracia · Geeky legal · Generación Y · Gente de mierd · Gorda podcast · <strong class="font-extrabold text-[#f74a35]">Gran Logia de la Argentina</strong> · Guía de supervivencia · Hablemos de música · Happening · Happy Hour · Hasta acá llegamos · Hasta la vista · #hellobaires · His Dark Materials: El Podcast · Hodor Hodor Hodor · Hotel, dulce hotel · <strong class="font-extrabold text-[#f74a35]">Hoy trasnoche</strong> · Humanos · Humanos y Robots · <strong class="font-extrabold text-[#f74a35]">Hundido</strong> · Hypeados · Inprevia · Intensos · Ir a más · Jaula de negocios · Juego interior · Juro que es Posta · Justo en el centro · La bruja y el cura · La chica de rulos · La crisis del amor · Lag mental · La gota · La hora Secretum · La papa · La podcast · La previa en casa · <strong class="font-extrabold text-[#f74a35]">La radio MAK</strong> · La runfla · La scaloneta · La trama · La vida después de · La vuelta · Lettera 22 · Libre de Gluten · Linaje de brujas · Lineas paralelas · <strong class="font-extrabold text-[#f74a35]">Locos & Bohemios</strong> · Los animales no se aburren · Los de afuera son de palo · Lucía y sus gemelas · Lupulados · Made in casa · Malas y Santas · Mas 54 radio · Más cerca del cielo · Mas rebeldes · Mega Viajeros Adventure · Mejor país del mundo · Mercurias · Misión presidencial · Modo positivo · <strong class="font-extrabold text-[#f74a35]">Mondongo, el décimo arte</strong> · Mujeres extraordinarias · Mujeres soberanas · Mujeres teníamos que ser · Multicast · Mundo Vice · Mypod · <strong class="font-extrabold text-[#f74a35]">Nerdearla</strong> · Nenes de mamá · Niños indigo · No era el plan · No es lo que parece · No hay apuro · No hay backup · No me olvidé de vos · Nos tapó el agua · <strong class="font-extrabold text-[#f74a35]">Notirey</strong> · No todo está perdido · Nunca ames a nadie · Off the record · Omitir intro · On the road · Opiniones memeticas · Pata de lana · Pausa Podcast · Pedí delivery · Pendejos madurando · Pernocte · <strong class="font-extrabold text-[#f74a35]">Pica en Punta</strong> · Pila de libros · Pip podcast · Placeres violentos · Planeta 57 · Podcast 934 · Podcast al 13013 · Podcasteros del zodíaco · Podestodo · Podkas · Polémica en /VAR · Ponele · Por un puñado de dólares · <strong class="font-extrabold text-[#f74a35]">Quemar un Patrullero</strong> · ¿Qué pasa? · Radio Guachafa · Radio La Flor · Rapidas y Furiosas · Rayuela · Realidad morosa · Remodelatour · <strong class="font-extrabold text-[#f74a35]">Rompiendo la 4ta pared</strong> · Sana · Secuencia modulada · Sendero · <strong class="font-extrabold text-[#f74a35]">Seremos Historia</strong> · Servicio Completo · Shelter · Shot de Tania · Sin barbijo · Sin dimensión · Sin filtro · <strong class="font-extrabold text-[#f74a35]">Skyvan</strong> · Soltate el pelo · Somos FE · Somos novios · Subite al pony · Sumar inversión · Swingirls · <strong class="font-extrabold text-[#f74a35]">Sys Army</strong> · Tecla cualquiera · Te cuento lo que veo · Tematizados · Territorio · Te sigo desde memento · The 8 agency · The Rebuild · Tiempo para más · Tiktalks · Todo es fake · Todo sobre la mesa · Tradición y futuro · Tradoctas · Tres pibas · Tripulación Atucha · Tu pregunta no molesta · Universo de posibilidades · Un mixtape · <strong class="font-extrabold text-[#f74a35]">Un nuevo match</strong> · UPS · Urocast · Vale 4 · Vidas paralelas · Vivir Mashiaj · Volver al cine · Wachas · Watchmen: El Podcast · <strong class="font-extrabold text-[#f74a35]">Who you are</strong> · Yonki · Y parió la abuela!`;

const rawBrandsTextHTML = `Ad Hoc Comunicación · Apciba · Bercomat · BNP Paribas Cardif · Bunker · Centro Simon Wiesenthal · Comiqueando · Cryptomate · Dot Hotels · Ecomm Experts · Escuela Libre de Psicoanálisis · Fundación Andreani · Fundación Cippec · Fundación Konrad Adenauer · Gran Logia de la Argentina · La Cosa Cine · La licuadora deportiva · LetterMafia · Meretz Argentina · Meridiana Comics · Milbrands · Museo Judío · Naldo · Natura · Nerdearla · Noticias en red · Open Folk · Parque podcast · Podlab · Press Over · Rayo podcasts · Revista Txtura · Sys Army · TTD Trabajadores Tango Danza · UMAI · Unplastify · XFC`;

const menuItems = [
  { 
    id: 'historia', 
    label: 'Historia',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    )
  },
  { 
    id: 'filosofia', 
    label: 'Filosofía',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 21l3.52-.93C9.33 20.67 10.63 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-1.25 0-2.45-.31-3.53-.87l-.25-.13-2.1.55.56-2.05-.16-.26C5.96 14.16 5.5 12.87 5.5 12c0-3.58 2.92-6.5 6.5-6.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" />
      </svg>
    )
  },
  { 
    id: 'servicios', 
    label: 'Servicios',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
    )
  },
  { 
    id: 'archivo', 
    label: 'Archivo',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
      </svg>
    )
  },
  { 
    id: 'comunidad', 
    label: 'Comunidad',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  },
  { 
    id: 'vecinos', 
    label: 'Vecinos',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M16.5 13c-1.2 0-3.07.34-4.24 1-1.17-.66-3.04-1-4.26-1C6.2 13 2 13.9 2 15.5V18h18v-2.5c0-1.6-4.2-2.5-5.5-2.5zM6 11c1.66 0 3-1.34 3-3S7.66 5 6 5 3 6.34 3 8s1.34 3 3 3zm12 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
      </svg>
    )
  },
  { 
    id: 'reconocimientos', 
    label: 'Reconocimientos',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H8v2h8v-2h-3v-2.1c1.92-.45 3.38-1.95 3.61-3.96C19.08 11.63 21 9.55 21 7V6c0-1.1-.9-1-2-1zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
      </svg>
    )
  },
  { 
    id: 'fanzine', 
    label: 'Fanzine',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    )
  },
  { 
    id: 'store', 
    label: 'Store',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    )
  },
  { 
    id: 'la-casa', 
    label: 'La Casa',
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    )
  },
];

const socialMenuItems = [
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/radioencasa/',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    label: 'YouTube',
    link: 'https://www.youtube.com/radioencasa',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    )
  },
  {
    label: 'X (Twitter)',
    link: 'https://x.com/radioencasa',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    label: 'WhatsApp',
    link: 'https://wa.me/541148317132',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.296-.883-.646-1.479-1.446-1.652-1.743-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    )
  }
];

export default function Page() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroLogoRefEnd = useRef<HTMLDivElement>(null);
  const [heroLogoWidth, setHeroLogoWidth] = useState<number>(1300);

  const homeRef = useRef<HTMLDivElement>(null);
  const homeEndRef = useRef<HTMLDivElement>(null);
  const archivoRef = useRef<HTMLDivElement>(null);
  const serviciosRef = useRef<HTMLElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);
  
  const [isHomeInView, setIsHomeInView] = useState<boolean>(true);
  const [isHomeEndInView, setIsHomeEndInView] = useState<boolean>(false);
  const [isArchiveInView, setIsArchiveInView] = useState<boolean>(false);
  const [isStoreInView, setIsStoreInView] = useState<boolean>(false);
  
  const [logoAnimKey, setLogoAnimKey] = useState<number>(0);
  const [logoEndAnimKey, setLogoEndAnimKey] = useState<number>(100);

  const [isHistoriaTitleDone, setIsHistoriaTitleDone] = useState<boolean>(false);
  const historiaRef = useRef<HTMLDivElement>(null);
  const [isHistoriaInView, setIsHistoriaInView] = useState<boolean>(false);

  const filosofiaRef = useRef<HTMLDivElement>(null);
  const [isFilosofiaInView, setIsFilosofiaInView] = useState<boolean>(false);

  const [activeMembership, setActiveMembership] = useState<string | null>(null);

  // PLAYER ABIERTO POR DEFECTO Y CHAT CERRADO INICIALMENTE
  const [isOpenPlayer, setIsOpenPlayer] = useState<boolean>(true);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);

  const [nowPlayingText, setNowPlayingText] = useState<string>('Radio en Casa - En Vivo');

  // DECODIFICACIÓN Y OBTENCIÓN DE LA INFORMACIÓN DE LA TRANSMISIÓN
  useEffect(() => {
    const fetchStreamInfo = async () => {
      try {
        const res = await fetch('/api/stream', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.nowPlaying) {
            setNowPlayingText(data.nowPlaying);
          }
        }
      } catch (err) {
        console.warn('Error fetching stream info:', err);
      }
    };

    fetchStreamInfo();
    const interval = setInterval(fetchStreamInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ACTUALIZADOS PARA TOGGLES EXCLUYENTES ---
  const handleTogglePlayer = () => {
    setIsOpenPlayer((prev) => {
      const nextState = !prev;
      if (nextState) {
        setIsOpenChat(false);
      } else {
        setIsOpenChat(true);
      }
      return nextState;
    });
  };

  const handleToggleChat = () => {
    setIsOpenChat((prev) => {
      const nextState = !prev;
      if (nextState) {
        setIsOpenPlayer(false);
      }
      return nextState;
    });
  };

  const isChatVisible = isOpenChat || !isOpenPlayer;

  const [uniqueListeners, setUniqueListeners] = useState<number>(142);
  const [isMiniPlaying, setIsMiniPlaying] = useState<boolean>(false);
  const [miniVolume, setMiniVolume] = useState<number>(80);
  const [historiaParallaxOffset, setHistoriaParallaxOffset] = useState<number>(0);

  const toggleMiniAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioElement = document.getElementById('radio-audio-element') as HTMLAudioElement;

    if (isMiniPlaying) {
      if (audioElement) {
        audioElement.pause();
      }
      setIsMiniPlaying(false);
    } else {
      if (audioElement) {
        audioElement.src = `/api/stream/audio?t=${Date.now()}`;
        audioElement.volume = miniVolume / 100;
        audioElement.play().catch((err) => console.warn('Error al reproducir audio:', err));
      }
      setIsMiniPlaying(true);
    }
  };

  const handleMiniVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMiniVolume(val);
    const audioElement = document.getElementById('radio-audio-element') as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = val / 100;
    }
  };

  useEffect(() => {
    const listenersTimer = setInterval(() => {
      setUniqueListeners((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(110, prev + delta);
      });
    }, 4000);

    return () => clearInterval(listenersTimer);
  }, []);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHomeInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setLogoAnimKey((prev) => prev + 1);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = homeEndRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHomeEndInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setLogoEndAnimKey((prev) => prev + 1);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = historiaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHistoriaInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsHistoriaTitleDone(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = filosofiaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilosofiaInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = storeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStoreInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = archivoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsArchiveInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const [showTuningNotice, setShowTuningNotice] = useState<boolean>(true);
  const [isTuningFadingUp, setIsTuningFadingUp] = useState<boolean>(false);
  const [isHeroIntroComplete, setIsHeroIntroComplete] = useState<boolean>(false);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const [homeHeroIndex, setHomeHeroIndex] = useState<number>(() =>
    Math.floor(Math.random() * homeHeroImages.length)
  );
  const [philosophySlideIndex, setPhilosophySlideIndex] = useState<number>(0);

  const [temperature, setTemperature] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string>('CARGANDO...');

  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);

  const centerServicesSection = () => {
    if (serviciosRef.current) {
      serviciosRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleServiceInteraction = (serviceId: string) => {
    const nextState = activeQuadrant === serviceId ? null : serviceId;
    setActiveQuadrant(nextState);
    if (nextState !== null) {
      centerServicesSection();
    }
  };

  useEffect(() => {
    const homeInterval = setInterval(() => {
      setHomeHeroIndex((prev) => (prev + 1) % homeHeroImages.length);
    }, 4000);

    return () => clearInterval(homeInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhilosophySlideIndex((prev) => (prev + 1) % philosophyImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${day}/${month} — ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // AUTOPLAY AUTOMÁTICO AL CARGAR LA PÁGINA
  useEffect(() => {
    const audioElement = document.getElementById('radio-audio-element') as HTMLAudioElement;
    if (audioElement) {
      audioElement.src = `/api/stream/audio?t=${Date.now()}`;
      audioElement.volume = miniVolume / 100;
      audioElement.play().then(() => {
        setIsMiniPlaying(true);
      }).catch(() => {
        setIsMiniPlaying(false);
      });
    }

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

  const scrollToSection = (id: string) => {
    setHasScrolled(true);
    if (id === 'home') {
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    const handleScrollAndActivity = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 20) {
        setHasScrolled(true);
      }
      
      if (currentScrollY < window.innerHeight * 0.5) {
        setActiveSection('home');
      }

      if (currentScrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(currentScrollY / totalHeight);
      }

      if (historiaRef.current) {
        const rect = historiaRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const relativePos = (rect.top + rect.height / 2 - windowHeight / 2) / windowHeight;
        setHistoriaParallaxOffset(relativePos);
      }
    };

    handleScrollAndActivity();

    window.addEventListener('scroll', handleScrollAndActivity);
    return () => {
      window.removeEventListener('scroll', handleScrollAndActivity);
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
        if (entry.isIntersecting && window.scrollY >= window.innerHeight * 0.5) {
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
  }, [hasScrolled]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const topRowServices = servicesQuadrants.slice(0, 2);
  const bottomRowServices = servicesQuadrants.slice(2, 4);

  return (
    <div
      className={`w-full overflow-x-hidden bg-[#181818] text-[#ececec] relative flex flex-col font-['DM_Sans',sans-serif] ${
        isBgGlitching ? 'animate-bg-glitch' : ''
      }`}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=DM+Sans:wght@400;500;700&family=Datatype:wght@400..900&family=Boldonse&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />

      <style jsx global>{`
        html {
          font-size: 100% !important;
        }

        p, span:not(.font-boldonse):not(.menu-text-size), div:not(.font-boldonse), a:not(.font-boldonse) {
          font-size: 1.125rem;
          line-height: 1.6;
        }

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

        .font-boldonse {
          font-family: 'Boldonse', 'Big Shoulders Display', sans-serif !important;
          text-transform: uppercase;
        }

        .font-datatype {
          font-family: 'Datatype', monospace !important;
        }

        h1, .h1-custom, h2, .h2-custom {
          font-family: 'Boldonse', sans-serif !important;
          line-height: 2.2rem !important;
          text-transform: uppercase;
        }

        @media (min-width: 640px) {
          h1, .h1-custom, h2, .h2-custom {
            line-height: 3.82rem !important;
          }
        }

        h4, .h4-custom {
          line-height: 2.2rem !important;
        }

        .menu-text-size {
          font-family: 'Datatype', monospace !important;
          font-size: 1.225rem !important;
          font-weight: 800 !important;
        }

        .top-subbar-text {
          font-family: 'Datatype', monospace !important;
          font-size: 0.825rem !important;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes gradientTripleShift {
          0% {
            background-color: #242424;
          }
          50% {
            background-color: #f9b92f;
          }
          100% {
            background-color: #f74a35;
          }
        }

        .animate-triple-shift-hover {
          animation: gradientTripleShift 0.5s ease-out forwards;
        }

        @keyframes continuousZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.08);
          }
        }

        .animate-continuous-zoom {
          animation: continuousZoom 4s linear forwards;
        }

        .animated-logo-svg svg path[stroke],
        .animated-logo-svg svg line[stroke] {
          stroke: rgb(227, 227, 227) !important;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }

        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes bounceDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-icon {
          animation: bounceDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideFromTopEase {
          0% {
            opacity: 0;
            transform: translateY(-40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-top-ease {
          animation: slideFromTopEase 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideFromBottomEase {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-bottom-ease {
          animation: slideFromBottomEase 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scrollPulse {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.85;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        .animate-scroll-pulse {
          animation: scrollPulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          animation: marquee 10s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ELEMENTO DE AUDIO GLOBAL PARA PÁGINA / SIDEBAR */}
      <audio
        id="radio-audio-element"
        src="/api/stream/audio"
        autoPlay
        preload="auto"
        playsInline
        crossOrigin="anonymous"
      />

      {/* BARRA DE SCROLL ROJA */}
      <div className="fixed top-0 right-0 lg:right-0 w-[20px] h-full z-[30] pointer-events-none overflow-hidden">
        <div
          className="w-full bg-[#f74a35] transition-all duration-150 ease-out shadow-sm"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* 1. BARRA LATERAL (NAV DOCK DE ÍCONOS) */}
      <nav
        className={`fixed top-0 right-0 lg:right-auto lg:left-0 w-[70px] sm:w-[88px] h-screen bg-[#0e0e0e] border-l lg:border-l-0 lg:border-r border-[#262626] z-[9999] flex flex-col items-center justify-between py-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHeroIntroComplete 
            ? 'flex opacity-100 translate-x-0' 
            : 'flex lg:opacity-0 lg:-translate-x-full opacity-100 translate-x-0'
        }`}
      >
        <div className="w-full flex items-center justify-center border-b border-[#222222] pb-3">
          <div 
            onClick={() => scrollToSection('home')}
            className={`w-10 h-10 sm:w-11 sm:h-11 aspect-square bg-[#f74a35] hover:bg-[#f74a35] rounded-full flex items-center justify-center animate-pulse shadow-[0_0_22px_rgba(247,74,53,0.95)] p-2 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${
              isHeroIntroComplete ? 'animate-bounce-icon' : 'lg:opacity-0 opacity-100'
            }`}
            style={{ animationDelay: '100ms' }}
            title="Volver arriba"
          >
            <img src="/icon.svg" alt="Icono Radio en Casa - Volver arriba" className="w-full h-full object-contain filter drop-shadow" />
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 py-2 overflow-visible">
          {menuItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <div 
                key={item.id} 
                className={`relative group flex items-center justify-center w-full overflow-visible ${
                  isHeroIntroComplete ? 'animate-bounce-icon' : 'lg:opacity-0 opacity-100'
                }`}
                style={{ animationDelay: `${200 + idx * 70}ms` }}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#f74a35] text-white shadow-[0_0_22px_rgba(247,74,53,0.95)] scale-105'
                      : 'bg-[#181818] text-neutral-400 hover:text-white hover:bg-[#252525]'
                  }`}
                  aria-label={item.label}
                >
                  {item.icon}
                </button>

                <div className="absolute right-[78px] lg:right-auto lg:left-[78px] opacity-0 pointer-events-none translate-x-[6px] lg:translate-x-[-6px] group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 transition-all duration-200 ease-out z-[10000] pr-2 lg:pr-0 lg:pl-2">
                  <div className="bg-[#121212] text-white border border-[#f74a35] font-datatype font-bold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.8)] whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f74a35] animate-pulse" />
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-3.5 border-t border-[#262626] pt-4 pb-2 overflow-visible">
          {socialMenuItems.map((social, idx) => (
            <div 
              key={idx} 
              className={`relative group flex items-center justify-center w-full overflow-visible ${
                isHeroIntroComplete ? 'animate-bounce-icon' : 'lg:opacity-0 opacity-100'
              }`}
              style={{ animationDelay: `${200 + (menuItems.length + idx) * 70}ms` }}
            >
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#f74a35] transition-all duration-200 font-datatype"
              >
                {social.icon}
              </a>

              <div className="absolute right-[78px] lg:right-auto lg:left-[78px] opacity-0 pointer-events-none translate-x-[6px] lg:translate-x-[-6px] group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 transition-all duration-200 ease-out z-[10000] pr-2 lg:pr-0 lg:pl-2">
                <div className="bg-[#121212] text-white border border-white/20 font-datatype font-bold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.8)] whitespace-nowrap flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  {social.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* 2. SIDEBAR SECUNDARIA / DECK DE CONTENIDOS (EXCLUSIVA DE DESKTOP) */}
      <aside 
        className={`fixed top-0 left-[88px] w-[332px] h-screen border-r border-[#333] shadow-2xl z-[60] flex flex-col font-datatype overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 hidden lg:flex ${
          isHeroIntroComplete 
            ? 'opacity-100 pointer-events-auto delay-[950ms]' 
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: `url('/images/historia/Radio_en_Casa_Background_Historia_01.png')`,
        }}
      >
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col justify-start p-3 pt-3 gap-2.5 font-datatype text-[9px]">
          
          {/* MÓDULO 1: CLIMA, FECHA Y HORA */}
          <div 
            className={`w-full bg-[#121212]/90 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col justify-center items-start text-left font-datatype leading-[1.2] space-y-1.5 flex-shrink-0 ${
              isHeroIntroComplete ? 'animate-slide-top-ease' : 'opacity-0'
            }`}
            style={{ animationDelay: '950ms' }}
          >
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="text-white font-black uppercase font-datatype !text-[15px] sm:!text-[16px] tracking-tight truncate max-w-[180px]">
                {isHeroIntroComplete ? <TypewriterText text={cityName} speed={40} /> : ''}
              </span>
              <span className="text-[#f74a35] font-black font-datatype !text-[16px] sm:!text-[17px] tracking-tight">
                {isHeroIntroComplete ? <TypewriterText text={temperature || '--°C'} speed={50} /> : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full justify-between pt-1 border-t border-white/10">
              <span className="font-datatype font-extrabold text-neutral-300 !text-[13px] uppercase tracking-tight">
                {isHeroIntroComplete && timeString ? <TypewriterText text={timeString.split(' — ')[0]} speed={35} /> : ''}
              </span>
              <span className="font-datatype font-extrabold text-neutral-400 !text-[13px] uppercase tracking-tighter">
                {isHeroIntroComplete && timeString ? <TypewriterText text={timeString.split(' — ')[1]} speed={35} /> : ''}
              </span>
            </div>
          </div>

          {/* MÓDULO 2: REPRODUCTOR DE AUDIO */}
          <div 
            className={`w-full transition-all duration-300 relative overflow-hidden shadow-2xl flex flex-col font-datatype flex-shrink-0 ${
              isOpenPlayer ? 'bg-transparent p-0 border-0 shadow-none' : 'bg-[#121212]/90 backdrop-blur-md p-2.5 border-0 rounded-none'
            } ${
              isHeroIntroComplete ? 'animate-slide-bottom-ease' : 'opacity-0'
            }`}
            style={{ animationDelay: '1100ms' }}
          >
            <div className={`w-full transition-all duration-300 relative flex flex-col items-center justify-center font-datatype ${
              isOpenPlayer ? 'bg-transparent p-0' : 'bg-[#121212] p-2.5 rounded-none'
            }`}>
              
              <div 
                onClick={handleTogglePlayer}
                className="w-full flex items-center justify-between cursor-pointer select-none font-datatype p-3 pr-10 pt-3 gap-2 relative min-h-[44px]"
              >
                {!isOpenPlayer && (
                  <div className="flex flex-col gap-3 w-full min-w-0 pr-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2.5 bg-[#1a1a1a] px-3 py-2 rounded-full border border-white/10 w-full flex-shrink-0">
                      <button
                        onClick={toggleMiniAudio}
                        className="w-8 h-8 bg-[#f74a35] hover:bg-[#d93a26] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0 cursor-pointer shadow-md p-0"
                        title={isMiniPlaying ? 'Pausar' : 'Reproducir'}
                      >
                        <span className="leading-none flex items-center justify-center text-center font-extrabold text-xs select-none">
                          {isMiniPlaying ? '❚❚' : '▶'}
                        </span>
                      </button>

                      <div className="flex items-center gap-2 w-full min-w-0">
                        <svg className="w-3.5 h-3.5 fill-current text-neutral-400 flex-shrink-0" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={miniVolume}
                          onChange={handleMiniVolumeChange}
                          className="w-full h-1 accent-[#f74a35] cursor-pointer min-w-0"
                        />
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex flex-col items-start text-left px-0.5 font-datatype pt-1 overflow-hidden">
                      <div className="relative w-full overflow-hidden whitespace-nowrap">
                        <div className="inline-block animate-marquee">
                          <span className="text-base sm:text-lg font-black text-neutral-100 font-datatype pr-12 uppercase">
                            {nowPlayingText}
                          </span>
                          <span className="text-base sm:text-lg font-black text-neutral-100 font-datatype pr-12 uppercase">
                            {nowPlayingText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-3.5 right-3.5 flex items-center justify-center flex-shrink-0 z-20 pointer-events-none">
                  <span className={`inline-block transition-transform duration-300 ${isOpenPlayer ? 'rotate-180' : 'rotate-0'}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" className="fill-[#f74a35]" style={{ shapeRendering: 'crispEdges' }}>
                      <path d="M0 2H10V4H8V6H6V8H4V6H2V4H0V2Z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden w-full ${
                isOpenPlayer ? 'grid-rows-[1fr] opacity-100 pt-2 pb-1 bg-transparent' : 'grid-rows-[0fr] opacity-0 pt-0 pb-0'
              }`}>
                <div className="overflow-hidden w-full flex flex-col justify-center items-center gap-3 bg-transparent">
                  <IframePlayer width={280} />
                </div>
              </div>

            </div>
          </div>

          {/* MÓDULO 3: CHAT EN VIVO */}
          <div 
            className={`w-full bg-[#121212]/90 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shadow-2xl flex flex-col font-datatype flex-1 min-h-0 ${
              isHeroIntroComplete ? 'animate-slide-bottom-ease' : 'opacity-0'
            }`}
            style={{ animationDelay: '1250ms' }}
          >
            <button
              onClick={handleToggleChat}
              className="w-full flex items-center justify-between text-left select-none cursor-pointer font-datatype pb-1 flex-shrink-0 gap-2 p-3 pr-10 pt-3 relative min-h-[44px]"
            >
              <div className="flex items-center gap-1.5 font-datatype flex-1 min-w-0 pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f74a35] animate-pulse flex-shrink-0" />
                <span className="font-bold text-white text-[8.5px] uppercase tracking-widest font-datatype truncate">
                  CHAT — SOMOS {uniqueListeners} ONLINE
                </span>
              </div>

              <div className="absolute top-3.5 right-3.5 flex items-center justify-center flex-shrink-0 z-20 pointer-events-none">
                <span className={`inline-block transition-transform duration-300 ${isChatVisible ? 'rotate-180' : 'rotate-0'}`}>
                  <svg width="10" height="10" viewBox="0 0 10 10" className="fill-[#f74a35]" style={{ shapeRendering: 'crispEdges' }}>
                    <path d="M0 2H10V4H8V6H6V8H4V6H2V4H0V2Z" />
                  </svg>
                </span>
              </div>
            </button>

            <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden w-full origin-top ${
              isChatVisible ? 'grid-rows-[1fr] opacity-100 pt-1 scale-y-100' : 'grid-rows-[0fr] opacity-0 pt-0 scale-y-0 -translate-y-2'
            }`}>
              <div className="overflow-hidden w-full h-full flex flex-col">
                <div className="overflow-hidden flex flex-col h-full min-h-[440px] w-full bg-black rounded-xl border border-white/10 flex-1">
                  <TlkioChat />
                </div>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL SCROLLABLE */}
      <div className={`flex flex-col transition-all duration-700 ease-out w-[calc(100%-70px)] sm:w-[calc(100%-88px)] lg:w-full ${
        isHeroIntroComplete ? 'lg:!w-[calc(100%-420px)] lg:!ml-[420px]' : 'lg:!w-full lg:!ml-0'
      }`}>
        
        {/* 1. HOME */}
        <section
          ref={homeRef}
          id="home"
          className="w-full h-screen min-h-screen flex flex-col justify-between items-center relative bg-black overflow-hidden transform-gpu"
        >
          {/* VISTA MOBILE */}
          <div className="flex lg:hidden w-full h-full min-h-screen flex-col justify-center items-center relative p-4 sm:p-6 z-10">
            <div className="absolute inset-0 h-full w-full pointer-events-none z-0 overflow-hidden">
              {homeHeroImages.map((imgUrl, idx) => {
                const isActive = homeHeroIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                      isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Radio en Casa Home ${idx + 1}`}
                      className={`w-full h-full object-cover filter brightness-50 contrast-110 object-center ${
                        isActive ? 'animate-continuous-zoom' : 'scale-100'
                      }`}
                    />
                  </div>
                );
              })}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
            </div>

            <div className="relative z-10 w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center justify-center gap-4 bg-[#121212]/95 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-2xl font-datatype max-h-[88vh] overflow-y-auto no-scrollbar">
              <div className="w-full max-w-[280px] sm:max-w-[300px] h-auto flex items-center justify-center pt-1 pb-1">
                <AnimatedLogo showBandText={false} />
              </div>

              <IframePlayer width={300} />
            </div>
          </div>

          {/* VISTA DESKTOP */}
          <div className="hidden lg:flex flex-col justify-between items-center w-full h-full min-h-screen relative">
            <div className={`absolute inset-0 h-full pointer-events-none z-0 overflow-hidden transition-all duration-700 ease-out ${
              isHeroIntroComplete ? 'w-full ml-0' : 'w-screen ml-0'
            }`}>
              {homeHeroImages.map((imgUrl, idx) => {
                const isActive = homeHeroIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                      isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Radio en Casa Home ${idx + 1}`}
                      className={`w-full h-full object-cover filter brightness-75 contrast-110 object-center ${
                        isActive ? 'animate-continuous-zoom' : 'scale-100'
                      }`}
                    />
                  </div>
                );
              })}
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            </div>

            {showTuningNotice && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto font-datatype">
                <button
                  onClick={() => {
                    const audioElement = document.getElementById('radio-audio-element') as HTMLAudioElement;
                    if (audioElement) {
                      if (!audioElement.src || audioElement.src === '') {
                        audioElement.src = `/api/stream/audio?nocache=${Date.now()}`;
                      }
                      audioElement.play().then(() => {
                        setIsMiniPlaying(true);
                      }).catch((err) => console.warn('Disparo de audio bloqueado:', err));
                    }

                    setShowTuningNotice(false);
                    setIsHeroIntroComplete(true);
                    setIsBgGlitching(false);
                  }}
                  className={`bg-[#202020] text-[#e3e3e3] px-7 py-3.5 font-datatype text-xs sm:text-sm font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all duration-700 ease-in-out cursor-pointer hover:bg-[#f74a35] hover:text-white ${
                    isTuningFadingUp ? '-translate-y-24 opacity-0 filter blur-sm' : 'translate-y-0 opacity-100 animate-bounce'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f74a35] animate-ping" />
                  <span className="text-[#ececec] font-datatype">Sintonizando...</span>
                </button>
              </div>
            )}

            <div className="w-full flex-1 mt-[40px] mb-[40px] pt-[120px] px-0 flex flex-col items-center justify-center pointer-events-auto z-10 relative">
              <div 
                ref={heroLogoRef} 
                key={logoAnimKey}
                className={`animated-logo-svg h-auto flex items-center justify-center pointer-events-auto text-[#e3e3e3] transition-all duration-1000 ease-out transform-gpu ${
                  isHeroIntroComplete && isHomeInView 
                    ? 'opacity-100 scale-100 filter blur-0' 
                    : 'opacity-0 scale-90 filter blur-lg pointer-events-none'
                }`}
                style={{
                  width: '85vw',
                  maxWidth: '1000px',
                }}
              >
                {isHeroIntroComplete && <AnimatedLogo />}
              </div>
            </div>
          </div>

          <div 
            onClick={() => scrollToSection('historia')}
            className={`hidden lg:flex absolute bottom-8 right-2 sm:right-3 z-40 flex-col items-center gap-4 cursor-pointer font-datatype select-none transition-all duration-700 ease-out group p-2.5 ${
              isHeroIntroComplete 
                ? 'opacity-100 translate-y-0 delay-[1600ms]' 
                : 'lg:opacity-0 lg:translate-y-6 lg:pointer-events-none'
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e3e3e3] group-hover:text-[#f74a35] transition-colors font-datatype rotate-[-90deg] my-4 origin-center">
              scroll
            </span>
            <div className="flex items-center justify-center transition-colors duration-300 text-[#e3e3e3] group-hover:text-[#f74a35] pt-1 animate-scroll-pulse">
              <span className="font-black text-xs tracking-tighter rotate-90 inline-block leading-none">
                ▶▶
              </span>
            </div>
          </div>
        </section>

        {/* 2. HISTORIA */}
        <section
          ref={historiaRef}
          id="historia"
          className="w-full min-h-screen pt-28 sm:pt-36 md:pt-56 lg:pt-64 pb-20 sm:pb-28 px-4 sm:px-6 md:px-12 lg:px-0 relative text-[#e3e3e3] flex flex-col justify-center items-center transform-gpu overflow-hidden bg-cover bg-center bg-no-repeat scroll-mt-0"
          style={{
            backgroundImage: `url('/images/historia/Radio_en_Casa_Background_Historia_01.png')`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-0" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center justify-between w-full max-w-[1100px] mx-auto relative z-10 my-auto">
            <div className="md:col-span-7 space-y-6 flex flex-col justify-center items-start pl-0 md:pl-0 pr-0 md:pr-4">
              <div 
                className="w-full space-y-6 transition-transform duration-100 ease-out"
                style={{
                  transform: `translateY(${historiaParallaxOffset * -70}px)`,
                }}
              >
                <div className="mb-4 sm:mb-6 md:mb-10 w-full">
                  {isHistoriaInView ? (
                    <TypewriterHeadingUnificado
                      text="RADIO EN CASA NACE EN NOVIEMBRE DE 2016"
                      className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold text-[#e3e3e3] font-boldonse tracking-tight relative h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                      onComplete={() => setIsHistoriaTitleDone(true)}
                    />
                  ) : (
                    <div className="h-16" />
                  )}
                </div>
                
                <div className="font-datatype text-neutral-200 space-y-6 w-full">
                  <div
                    className={`transition-all duration-700 ease-out transform-gpu ${
                      isHistoriaTitleDone && isHistoriaInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                    style={{ transitionDelay: '100ms' }}
                  >
                    <p className="!text-[0.95rem] sm:!text-[1.125rem] lg:!text-[1.25rem] !leading-[1.7]">
                      <span className="bg-black/85 text-[#e3e3e3] px-2.5 py-1 rounded-none [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                        En ese momento internet, las redes sociales y las nuevas formas de consumo ya estaban transformando la manera en que las personas se comunicaban, pero la radio seguía manteniendo estructuras pensadas para otra época.
                      </span>
                    </p>
                  </div>

                  <div
                    className={`transition-all duration-700 ease-out transform-gpu ${
                      isHistoriaTitleDone && isHistoriaInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                    style={{ transitionDelay: '450ms' }}
                  >
                    <p className="!text-[0.95rem] sm:!text-[1.125rem] lg:!text-[1.25rem] !leading-[1.7]">
                      <span className="bg-black/85 text-[#e3e3e3] px-2.5 py-1 rounded-none [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                        Entendimos que el futuro no estaba en trasladar una cabina tradicional a internet, sino en crear un espacio abierto, flexible y preparado para una nueva generación de contenidos.
                      </span>
                    </p>
                  </div>

                  <div
                    className={`transition-all duration-700 ease-out transform-gpu ${
                      isHistoriaTitleDone && isHistoriaInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                    style={{ transitionDelay: '800ms' }}
                  >
                    <p className="!text-[0.95rem] sm:!text-[1.125rem] lg:!text-[1.25rem] !leading-[1.7]">
                      <span className="bg-black/85 text-[#e3e3e3] px-2.5 py-1 rounded-none [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                        Un lugar donde la radio pudiera convivir con nuevos formatos, donde las personas fueran protagonistas y donde las historias pudieran expandirse más allá del audio.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`md:col-span-5 w-full flex justify-center md:justify-end items-center pr-0 transition-all duration-1000 ease-out transform-gpu ${
                isHistoriaInView
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-24 pointer-events-none'
              }`}
            >
              <div 
                className="w-full transition-transform duration-100 ease-out"
                style={{
                  transform: `translateY(${historiaParallaxOffset * 70}px)`,
                }}
              >
                <FanStackedCards items={historyCardsData} />
              </div>
            </div>

          </div>
        </section>

        {/* 3. FILOSOFÍA */}
        <section
          ref={filosofiaRef}
          id="filosofia"
          className="w-full min-h-screen relative overflow-hidden bg-[#181818] pt-0 pb-20 sm:pb-24 flex flex-col justify-between items-center"
        >
          <div 
            className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40"
            style={{
              backgroundColor: '#181818',
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          <div
            className={`w-full max-w-full relative left-0 right-0 top-0 mx-auto h-[35vh] sm:h-[45vh] min-h-[260px] sm:min-h-[320px] mb-8 bg-black overflow-hidden transition-all duration-500 ease-out transform-gpu z-10 ${
              isFilosofiaInView
                ? 'opacity-100 translate-x-0 skew-x-0 filter hue-rotate-0 blur-0'
                : 'opacity-0 -translate-x-12 skew-x-12 filter hue-rotate-90 blur-sm mix-blend-screen'
            }`}
          >
            {philosophyImages.map((imgUrl, idx) => {
              const isActive = philosophySlideIndex === idx;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform group ${
                    isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Galería Radio en Casa ${idx + 1}`}
                    className="w-full h-full object-cover object-top transition-all duration-500 ease-out hover:contrast-200 hover:brightness-125 hover:grayscale hover:hue-rotate-180 hover:[image-rendering:pixelated]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = philosophyImages[0];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              );
            })}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 overflow-x-auto max-w-[90vw] no-scrollbar px-4 py-1">
              {philosophyImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPhilosophySlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer flex-shrink-0 ${
                    philosophySlideIndex === idx ? 'bg-[#f74a35] w-6' : 'bg-[#e3e3e3]/60 hover:bg-[#e3e3e3] w-2.5'
                  }`}
                  aria-label={`Ir a la imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 relative z-10 flex-1 flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start w-full max-w-[1200px] mx-auto relative">
              <div className="self-start z-10">
                <div 
                  className="w-full transition-transform duration-100 ease-out"
                  style={{
                    transform: `translateY(${historiaParallaxOffset * -60}px)`,
                  }}
                >
                  <TypewriterHeadingUnificado
                    text="ESTAMOS EN UN PH ANTIGUO RECICLADO EN PALERMO, BUENOS AIRES, ARGENTINA"
                    className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold text-[#e3e3e3] font-boldonse tracking-tight relative h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                  />
                </div>
              </div>

              <div className="space-y-6 text-sm sm:text-base md:text-lg font-normal leading-relaxed text-neutral-300 font-datatype pt-6 sm:pt-12 md:pt-32">
                <div 
                  className="w-full space-y-6 transition-transform duration-100 ease-out"
                  style={{
                    transform: `translateY(${historiaParallaxOffset * 60}px)`,
                  }}
                >
                  <ScrollFadeText delay={100}>
                    <p className="text-[#e3e3e3] font-bold text-base sm:text-lg md:text-xl border-l-4 border-[#f74a35] pl-4 py-3 sm:py-4 my-0 bg-[#121212]/95 backdrop-blur-md border border-[#5c5c5c]/40 rounded-none font-datatype shadow-2xl">
                      Un espacio con historia que transformamos para crear algo nuevo, y eso es parte de lo que nos define.
                    </p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={200}>
                    <p>Construimos Radio en Casa a partir de una combinación que nos representa: la historia, el profesionalismo y la mística de la radio tradicional, junto con las nuevas herramientas y formatos que siguen transformando la comunicación.</p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={300}>
                    <p>Algunos le dicen podcast. Otros prefieren hablar de streaming. Para los más nostálgicos, seguirá siendo radio.</p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={400}>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-[#e3e3e3] font-datatype">
                      Para nosotros, son distintas formas de una misma necesidad: encontrarnos para contar algo.
                    </p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={500}>
                    <p>Rompimos la cabina y abrimos el espacio porque creemos que las ideas necesitan lugar para crecer. Nos llenamos de micrófonos porque creemos en la diversidad de voces. Y sumamos cámaras porque entendemos que hoy las historias también se ven.</p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={600}>
                    <p>Nos gusta estar a la vanguardia, pero no queremos ser una moda.</p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={700}>
                    <p>Exploramos formatos nuevos, pero buscamos que tengan sentido, identidad y permanencia. No queremos llegar a cualquiera: queremos conectar con las personas adecuadas.</p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={800}>
                    <p className="text-sm sm:text-base md:text-lg font-datatype text-[#f74a35] font-bold">
                      Si sentís que tenés algo para contar,{' '}
                      <button
                        onClick={() => scrollToSection('la-casa')}
                        className="group inline-relative inline-flex flex-col cursor-pointer bg-transparent border-none p-0 m-0 text-left align-baseline"
                      >
                        <span className="text-[#e3e3e3] transition-colors duration-300 group-hover:text-[#f74a35] hover:underline">
                          golpeanos la puerta.
                        </span>
                      </button>
                    </p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={900}>
                    <div className="mt-6 bg-[#121212]/95 backdrop-blur-md border-2 border-[#f74a35] p-4 sm:p-5 shadow-2xl rounded-none">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider text-[#e3e3e3] font-boldonse leading-snug">
                        En Radio en Casa seguimos cambiando la forma de hacer radio.
                      </p>
                    </div>
                  </ScrollFadeText>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. SERVICIOS */}
        <section ref={serviciosRef} id="servicios" className="w-full min-h-screen relative flex flex-col justify-center items-center transform-gpu overflow-hidden p-0 m-0 bg-[#181818]">
          <div 
            className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40"
            style={{
              backgroundColor: '#181818',
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-36 md:pt-48 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 lg:px-0 box-sizing-border max-w-[1100px] mx-auto">
            <div className="flex flex-col w-full gap-6 sm:gap-8 items-stretch my-auto justify-center">
              
              <div className="w-full space-y-4 sm:space-y-6 font-datatype text-xs sm:text-sm md:text-base leading-relaxed text-neutral-200">
                <TypewriterHeadingUnificado
                  text="SERVICIOS"
                  className="text-[1.5rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold text-[#e3e3e3] font-boldonse tracking-tight relative h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                />

                <div className="space-y-3 sm:space-y-4 max-w-4xl">
                  <ScrollFadeText delay={100}>
                    <p>
                      Si tenés una idea, un proyecto o una comunidad que querés hacer crecer, en Radio en Casa encontrás el espacio y la infraestructura necesaria para desarrollarla.
                    </p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={200}>
                    <p>
                      No alquilamos solamente un estudio. Abrimos una casa con más de diez años de experiencia creando contenidos, acompañando proyectos y formando parte de la evolución de la radio, el podcast y el streaming en Argentina. Ponemos a disposición un estudio profesional, cómodo y completamente equipado para realizar programas de radio, podcasts y streaming.
                    </p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={300}>
                    <p className="font-bold text-[#e3e3e3] bg-[#222222] border-l-4 border-[#f74a35] p-4 sm:pt-5 sm:pb-5 sm:pl-6 sm:pr-6 shadow-xl my-3 font-datatype">
                      Porque para nosotros un buen contenido necesita dos cosas: una infraestructura profesional y un espacio donde las ideas puedan sentirse cómodas.
                    </p>
                  </ScrollFadeText>

                  <ScrollFadeText delay={400}>
                    <p>
                      Contamos con una mesa para 6 personas con micrófonos profesionales, efectos de voz y luces, croma para entornos virtuales, living, barra, monitor, teléfono fijo, WhatsApp, instrumentos y todos los recursos necesarios para que cada producción encuentre su mejor versión.
                    </p>
                  </ScrollFadeText>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 justify-center mt-2 bg-transparent">
                {[
                  { ...topRowServices[0], label: 'RADIO' },
                  { ...topRowServices[1], label: 'PODCAST' },
                  { ...bottomRowServices[0], label: 'STREAMING' },
                  { ...bottomRowServices[1], label: 'OUTDOOR' },
                ].map((service, idx) => {
                  const isActive = activeQuadrant === service.id;
                  
                  const vhsStripColors = ['#f74a35', '#ff7700', '#ffcc00', '#215164'];
                  const serviceColor = vhsStripColors[idx % vhsStripColors.length];
                  const serviceNumber = String(idx + 1).padStart(2, '0');
                  
                  return (
                    <ScrollFadeText key={service.id} delay={500 + idx * 100}>
                      <div className="flex flex-col w-full font-datatype">
                        <div
                          onMouseEnter={() => handleServiceInteraction(service.id)}
                          onMouseLeave={() => setActiveQuadrant(null)}
                          onClick={() => handleServiceInteraction(service.id)}
                          className={`group relative flex flex-row items-center cursor-pointer border-2 bg-[#1b1b1b] rounded-none shadow-xl overflow-hidden w-full h-[60px] sm:h-[64px] min-h-[60px] max-h-[64px] transition-all duration-300 ease-out ${
                            isActive 
                              ? 'border-[#f74a35] shadow-2xl bg-[#222222]' 
                              : 'border-[#2a2a2a] hover:border-[#555]'
                          }`}
                          style={{
                            backgroundImage: 'radial-gradient(circle, #242424 0%, #151515 100%)',
                          }}
                        >
                          <div className="h-full w-10 sm:w-12 bg-[#111111] border-r border-[#282828] flex flex-col items-center justify-between p-1.5 font-mono text-neutral-500 flex-shrink-0">
                            <div className="border border-[#333] rounded-none bg-black/80 flex items-center justify-center w-2.5 h-4 sm:h-5">
                              <div className="w-0.5 h-1 bg-[#222]" />
                            </div>
                            <span className="tracking-tighter opacity-60 uppercase font-mono leading-none rotate-90 my-auto text-[2px] whitespace-nowrap">
                              NV-VP {new Date().getFullYear()}
                            </span>
                          </div>

                          <div 
                            className="flex-1 h-full rounded-none flex flex-row items-center justify-between relative overflow-hidden border border-[#d6cbbe] shadow-inner ml-1.5 sm:ml-2 p-2 sm:p-2.5 md:p-3"
                            style={{
                              backgroundColor: isActive ? '#f7f2ea' : '#efe8dc',
                              backgroundImage: `
                                linear-gradient(to right, rgba(180, 160, 140, 0.18) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(180, 160, 140, 0.18) 1px, transparent 1px)
                              `,
                              backgroundSize: '12px 12px'
                            }}
                          >
                            <div className="flex-1 flex flex-row items-center h-full w-full gap-2 sm:gap-3">
                              <div 
                                className="relative rounded-none shadow-sm flex-shrink-0 w-4 sm:w-6 h-full overflow-hidden"
                                style={{ backgroundColor: serviceColor }}
                              />

                              <div className="flex-1 flex flex-row items-center justify-between h-full">
                                <h2 className="font-extrabold font-boldonse uppercase leading-tight text-[#1a1a1a] tracking-wider text-left text-sm sm:text-lg md:text-xl">
                                  {service.label}
                                </h2>

                                <span className="font-mono font-black text-black bg-white shadow-sm rounded-none flex items-center gap-1.5 text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5">
                                  <span className="text-[7px] sm:text-[8px] md:text-[9px] tracking-tighter text-[#111111]">▶▶▶</span> 
                                  <span className="font-extrabold">{serviceNumber}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center flex-shrink-0 px-3 sm:px-4">
                            <span 
                              className={`font-bold text-xs transition-transform duration-300 ${
                                isActive ? 'rotate-180 text-[#f74a35]' : 'text-neutral-400 group-hover:text-white'
                              }`}
                            >
                              ▼
                            </span>
                          </div>
                        </div>

                        <div 
                          className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                            isActive ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden bg-[#141414] border-2 border-[#f74a35] rounded-none p-4 sm:p-5 shadow-2xl text-neutral-200">
                            <p className="text-xs sm:text-sm md:text-lg leading-relaxed text-neutral-300 font-datatype">
                              {service.fullText}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ScrollFadeText>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* 5. ARCHIVO */}
        <section ref={archivoRef} id="archivo" className="w-full min-h-screen relative p-0 m-0 bg-[#181818] text-[#e3e3e3]">
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute inset-0 w-full h-[140%] z-0 opacity-40 mix-blend-luminosity will-change-transform transition-transform duration-100 ease-linear"
              style={{
                backgroundImage: `url('/images/filosofia/Radio_en_Casa_Background_Filosofia.png')`,
                backgroundRepeat: 'repeat-y',
                backgroundPosition: 'center top',
                backgroundSize: '100% auto',
                transform: `translateY(${(scrollProgress - 0.4) * -120}px)`,
              }}
            />
            <div 
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)',
              }}
            />
          </div>

          <div 
            className="w-full font-datatype sticky top-0 z-40 pt-4 pb-2 bg-transparent pointer-events-auto"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 40,
            }}
          >
            <div className="w-full max-w-[1100px] mx-auto px-4 md:px-0">
              <div className="relative bg-[#1e1e1e]/95 p-3 sm:p-4 md:p-5 rounded-none border border-[#5c5c5c]/60 shadow-2xl w-full font-datatype">
                <div className="bg-[#141414] border border-neutral-800 rounded-none p-4 sm:p-5 md:p-6 overflow-hidden relative shadow-inner w-full">
                  <div className="animate-scroll-infinite flex items-center space-x-8 sm:space-x-12 md:space-x-16">
                    {[...clientLogos, ...clientLogos].map((src, idx) => (
                      <div key={idx} className="h-10 sm:h-12 md:h-14 w-28 sm:w-32 md:w-36 flex items-center justify-center flex-shrink-0">
                        <img
                          src={src}
                          alt={`Cliente ${(idx % 17) + 1}`}
                          className="max-h-full max-w-full object-contain filter brightness-0 invert opacity-100"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 px-2 sm:px-3 font-datatype text-neutral-400 border-t border-[#5c5c5c]/40 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#f74a35] animate-ping flex-shrink-0 rounded-full" />
                    <span className="tracking-wide text-[#f74a35] font-bold text-[10px] sm:text-xs md:text-sm font-datatype uppercase">
                      Algunos de quienes confiaron en nosotros
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full min-h-screen pt-4 pb-16 px-4 md:px-0 box-sizing-border max-w-[1100px] mx-auto space-y-8 sm:space-y-12">
            <div className="space-y-3 sm:space-y-4 w-full relative z-10 font-datatype pt-4">
              <ScrollFadeText delay={100}>
                <TypewriterHeadingUnificado
                  text="ARCHIVO"
                  className="text-[1.5rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider font-boldonse text-[#e3e3e3] h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                />
              </ScrollFadeText>
              <ScrollFadeText delay={200}>
                <p className="font-datatype text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed font-medium">
                  <span className="bg-black/85 text-[#e3e3e3] px-2.5 py-1 rounded-none [box-decoration-break:clone] [-webkit-box-decoration-break:clone] font-datatype">
                    Durante más de diez años trabajamos junto a proyectos independientes, empresas, organizaciones y comunidades que encontraron en Radio en Casa un espacio para desarrollar sus contenidos.
                  </span>
                </p>
              </ScrollFadeText>
            </div>

            <div className="w-full relative z-10">
              <ScrollFadeText delay={220}>
                <div className="bg-black/85 backdrop-blur-md border border-[#5c5c5c]/40 p-5 sm:p-8 md:p-10 shadow-2xl rounded-none space-y-4 font-datatype w-full text-neutral-200">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider font-boldonse text-[#e3e3e3] border-b border-[#5c5c5c]/40 pb-3">
                    TAMBIÉN PASARON POR RADIO EN CASA
                  </h3>
                  <div 
                    className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed tracking-wide font-datatype bg-[#141414] p-4 sm:p-6 border border-neutral-800 rounded-none shadow-inner [&_strong]:text-[#f74a35] [&_strong]:font-black"
                    dangerouslySetInnerHTML={{ __html: rawBrandsTextHTML }}
                  />
                </div>
              </ScrollFadeText>
            </div>

            <div className="w-full relative z-10">
              <div className="bg-black/85 backdrop-blur-md border border-[#5c5c5c]/40 p-5 sm:p-8 md:p-10 shadow-2xl rounded-none space-y-6 font-datatype w-full text-neutral-200">
                <ScrollFadeText delay={250}>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider font-boldonse text-[#e3e3e3] border-b border-[#5c5c5c]/40 pb-3">
                    LA HISTORIA DE ESTA CASA
                  </h3>
                </ScrollFadeText>

                <ScrollFadeText delay={300}>
                  <p className="text-[#e3e3e3] text-sm sm:text-base md:text-lg leading-relaxed font-datatype font-bold">
                    Más de 200 proyectos forman parte del archivo de Radio en Casa. Algunos fueron podcasts, otros programas de radio, streaming o producciones especiales. Algunos grabaron un episodio. Otros hicieron de esta su casa durante años. Todos forman parte de nuestra historia:
                  </p>
                </ScrollFadeText>

                <div className="bg-[#141414] p-4 sm:p-6 border border-neutral-800 rounded-none shadow-inner text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed tracking-wide font-datatype flex flex-wrap gap-x-2 gap-y-1 [&_strong]:text-[#f74a35] [&_strong]:font-extrabold [&_strong]:border-none">
                  {rawArchiveTextHTML.split('·').map((itemHTML, index) => (
                    <ScrollFadeText key={index} delay={(index % 6) * 40}>
                      <span className="inline-block transition-all duration-700">
                        <span dangerouslySetInnerHTML={{ __html: itemHTML.trim() }} />
                        {index < rawArchiveTextHTML.split('·').length - 1 && (
                          <span className="text-[#f74a35] font-bold ml-2">·</span>
                        )}
                      </span>
                    </ScrollFadeText>
                  ))}
                </div>

                <ScrollFadeText delay={400}>
                  <div className="pt-2 font-datatype">
                    <div className="w-full bg-[#1e1e1e] border border-[#5c5c5c]/60 p-4 sm:p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none text-neutral-200 rounded-none">
                      <div className="flex items-center gap-3.5">
                        <span className="w-3.5 h-3.5 bg-[#f74a35] border border-black/50 flex-shrink-0 animate-pulse rounded-full" />
                        <div className="space-y-1 font-datatype">
                          <p className="text-[#f74a35] font-black font-boldonse text-xs sm:text-sm md:text-base uppercase tracking-wider">
                            ¿Tu proyecto pasó por Radio en Casa y no aparece en este archivo?
                          </p>
                          <p className="text-neutral-300 font-datatype text-xs sm:text-sm md:text-base font-medium flex flex-wrap items-baseline gap-1">
                            <button
                              onClick={() => scrollToSection('la-casa')}
                              className="group inline-relative inline-flex flex-col cursor-pointer bg-transparent border-none p-0 m-0 text-left align-baseline font-datatype"
                            >
                              <span className="text-[#e3e3e3] font-bold text-xs sm:text-sm md:text-base transition-colors duration-300 group-hover:text-[#f74a35] font-datatype">
                                Escribinos.
                              </span>
                              <span className="h-[2px] w-full bg-[#e3e3e3] transition-colors duration-300 group-hover:bg-[#f74a35]" />
                            </button>
                            <span className="font-bold text-xs sm:text-sm md:text-base text-neutral-300 font-datatype">
                              Nos encantaría sumar ese recuerdo.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollFadeText>

              </div>
            </div>

          </div>
        </section>

        {/* 6. COMUNIDAD */}
        <section 
          id="comunidad" 
          className="w-full pt-28 sm:pt-48 md:pt-56 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-0 relative bg-black text-[#e3e3e3] z-10 flex flex-col justify-center items-center transform-gpu min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/historia/Radio_en_Casa_Background_Historia_01.png')`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-0" />

          <div className="w-full max-w-[1100px] mx-auto space-y-6 sm:space-y-8 relative z-10 px-0 sm:px-4 md:px-0">
            <AnimateOnScroll duration={600} offset={25}>
              <div className="bg-black/85 backdrop-blur-md p-5 sm:p-8 md:p-10 rounded-none border border-[#5c5c5c]/40 shadow-2xl space-y-4 font-datatype text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed">
                <TypewriterHeadingUnificado
                  text="FORMÁ PARTE DE RADIO EN CASA"
                  className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold text-[#e3e3e3] font-boldonse tracking-tight relative h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16 pt-2 sm:pt-4">
                  <div className="space-y-3 font-datatype">
                    <p>En 2016 empezamos haciendo radio desde una casa. Hoy seguimos creyendo en la misma idea: crear un espacio libre para la música, las historias y las personas que tienen algo para decir.</p>
                    <p>Si alguna vez una canción, un programa, una charla o una historia nacida en Radio en Casa formó parte de tu vida, hoy podés ayudarnos a que este proyecto siga creciendo y llegue cada vez más lejos.</p>
                  </div>
                  <div className="space-y-3 font-datatype">
                    <p className="text-[#f74a35] font-bold border-t border-[#5c5c5c]/40 pt-2 font-datatype">Con una pequeña contribución mensual nos ayudás a seguir construyendo Radio en Casa y elegís cómo querés formar parte de esta historia.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 sm:mt-10 md:mt-14 font-datatype items-stretch">
              
              {/* 1. IZQUIERDA: REC Groupie */}
              {(() => {
                const item = membershipsData[0];
                const isHovered = activeMembership === item.id;
                const isAnotherHovered = activeMembership !== null && !isHovered;
                const buttonParts = item.buttonText.split(' ');
                const firstWord = buttonParts[0];
                const restOfText = buttonParts.slice(1).join(' ');

                return (
                  <div className="lg:col-span-3 flex flex-col h-full">
                    <AnimateOnScroll delay={150} duration={650} offset={45} className="h-full">
                      <div
                        onMouseEnter={() => setActiveMembership(item.id)}
                        onMouseLeave={() => setActiveMembership(null)}
                        className={`bg-[#1e1e1e]/90 backdrop-blur-md border p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 ease-out cursor-pointer shadow-xl h-full font-datatype transform-gpu rounded-none ${
                          isHovered
                            ? 'scale-105 z-20 border-[#f74a35] shadow-2xl bg-[#242424]'
                            : isAnotherHovered
                            ? 'scale-95 opacity-80 z-0 border-[#5c5c5c]/60'
                            : 'scale-100 opacity-100 border-[#5c5c5c]/60 hover:border-[#f74a35]'
                        }`}
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#e3e3e3] uppercase border-b border-[#5c5c5c]/40 pb-3 font-boldonse leading-[2.2rem] sm:leading-[2.5rem] md:leading-[2.75rem]">
                            {item.titleLine1}<br />{item.titleLine2}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-datatype leading-relaxed">{item.desc}</p>
                        </div>

                        <div className="pt-4 sm:pt-6">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block w-full relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[8px] sm:border-b-[12px] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-[0.2em] text-left hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200 font-datatype leading-snug"
                          >
                            <span className="block uppercase">{firstWord}</span>
                            <span className="block uppercase text-[0.85em] opacity-90">{restOfText}</span>
                          </a>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  </div>
                );
              })()}

              {/* 2. DERECHA: GRUPO DE 3 TARJETAS */}
              <div className="lg:col-span-9 bg-black/60 border-2 border-[#f74a35] p-3 sm:p-4 md:p-6 backdrop-blur-sm shadow-2xl relative flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 font-datatype h-full">
                  {membershipsData.slice(1).map((item, idx) => {
                    const isHovered = activeMembership === item.id;
                    const isAnotherHovered = activeMembership !== null && !isHovered;

                    const buttonParts = item.buttonText.split(' ');
                    const firstWord = buttonParts[0]; 
                    const restOfText = buttonParts.slice(1).join(' '); 

                    return (
                      <AnimateOnScroll key={item.id} delay={150 * (idx + 2)} duration={650 + idx * 80} offset={45} className="h-full">
                        <div
                          onMouseEnter={() => setActiveMembership(item.id)}
                          onMouseLeave={() => setActiveMembership(null)}
                          className={`bg-[#1e1e1e]/90 backdrop-blur-md border p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 ease-out cursor-pointer shadow-xl h-full font-datatype transform-gpu rounded-none ${
                            isHovered
                              ? 'scale-105 z-20 border-[#f74a35] shadow-2xl bg-[#242424]'
                              : isAnotherHovered
                              ? 'scale-95 opacity-80 z-0 border-[#5c5c5c]/60'
                              : 'scale-100 opacity-100 border-[#5c5c5c]/60 hover:border-[#f74a35]'
                          }`}
                        >
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#e3e3e3] uppercase border-b border-[#5c5c5c]/40 pb-3 font-boldonse leading-[2.2rem] sm:leading-[2.5rem] md:leading-[2.75rem]">
                              {item.titleLine1}<br />{item.titleLine2}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-datatype leading-relaxed">{item.desc}</p>
                          </div>

                          <div className="pt-4 sm:pt-6">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block w-full relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[8px] sm:border-b-[12px] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-[0.2em] text-left hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200 font-datatype leading-snug"
                            >
                              <span className="block uppercase">{firstWord}</span>
                              <span className="block uppercase text-[0.85em] opacity-90">{restOfText}</span>
                            </a>
                          </div>
                        </div>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. VECINOS */}
        <section id="vecinos" className="w-full pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-0 bg-[#181818] text-[#e3e3e3] relative flex flex-col justify-center items-center transform-gpu min-h-screen overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-[140%] z-0 pointer-events-none opacity-40 mix-blend-luminosity will-change-transform transition-transform duration-100 ease-linear"
            style={{
              backgroundImage: `url('/images/filosofia/Radio_en_Casa_Background_Filosofia.png')`,
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'center top',
              backgroundSize: '100% auto',
              transform: `translateY(${(scrollProgress - 0.6) * -120}px)`,
            }}
          >
            <div 
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)',
              }}
            />
          </div>

          <div className="w-full max-w-[1100px] mx-auto space-y-6 relative z-10 px-0 sm:px-4 md:px-0">
            <AnimateOnScroll duration={600} offset={25}>
              <div className="w-full bg-[#1e1e1e]/90 backdrop-blur-md p-5 sm:p-6 border border-[#5c5c5c]/60 shadow-xl space-y-3 font-datatype text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed rounded-none">
                <TypewriterHeadingUnificado
                  text="LAS MEJORES CASAS NUNCA ESTÁN SOLAS"
                  className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#e3e3e3] font-boldonse h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                />
                <p>Con el tiempo fuimos encontrando otros espacios, proyectos y personas con quienes compartimos una misma manera de entender la cultura, la comunicación y la creación de comunidad. No vivimos bajo el mismo techo, pero sí en el mismo barrio.</p>
                <p className="text-[#f74a35] font-semibold font-datatype">Generamos alianzas estratégicas con algunos espacios amigos.</p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-datatype">
              <AnimateOnScroll delay={200} duration={700} offset={45}>
                <div className="bg-[#1e1e1e]/90 backdrop-blur-md border border-[#5c5c5c]/60 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#f74a35] transition-colors duration-300 h-full font-datatype rounded-none">
                  <div className="space-y-4 font-datatype">
                    <div className="h-14 sm:h-16 w-auto flex items-center justify-start">
                      <img src="/images/programas/Salgo_Arriba_Logo_Radio_en_Casa.png" alt="Salgo Arriba Logo" className="max-h-full w-auto object-contain filter brightness-0 invert opacity-100" />
                    </div>

                    <SalgoArribaSlider />

                    <h4 className="text-[#e3e3e3] tracking-tight font-extrabold font-boldonse text-base sm:text-lg h4-custom">Salgo Arriba</h4>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-datatype">Espacio para eventos, experiencias y producciones audiovisuales situado en Recoleta.</p>
                  </div>

                  <div className="pt-3 border-t border-[#5c5c5c]/40 flex flex-wrap items-center justify-between gap-2 font-mono text-xs sm:text-sm font-datatype">
                    <span className="text-[#f74a35] font-bold">@salgoarriba</span>
                    <a href="https://www.salgoarriba.com" target="_blank" rel="noopener noreferrer" className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[8px] px-3 py-1.5 text-xs font-bold tracking-[0.15em] text-left hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200">
                      www.salgoarriba.com →
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={350} duration={850} offset={55}>
                <div className="bg-[#1e1e1e]/90 backdrop-blur-md border border-[#5c5c5c]/60 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#f74a35] transition-colors duration-300 h-full font-datatype rounded-none">
                  <div className="space-y-4 font-datatype">
                    <div className="w-full h-36 overflow-hidden rounded-none bg-black border border-white/10 relative my-3">
                      <img
                        src="/images/galeria/Radio_en_Casa_Galeria_05.jpg"
                        alt="Proyecto Rosca Arquitectura"
                        className="w-full h-full object-cover filter brightness-90 contrast-110"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = philosophyImages[0];
                        }}
                      />
                    </div>

                    <h4 className="text-[#e3e3e3] tracking-tight font-extrabold font-boldonse text-base sm:text-lg h4-custom">Proyecto Rosca</h4>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-datatype">Estudio de diseño y arquitectura especializado en la puesta en valor de espacios, marcas e identidad visual.</p>
                  </div>

                  <div className="pt-3 border-t border-[#5c5c5c]/40 flex flex-wrap items-center justify-between gap-2 font-mono text-xs sm:text-sm font-datatype">
                    <span className="text-[#f74a35] font-bold">@proyectorosca</span>
                    <a href="https://www.proyectorosca.com" target="_blank" rel="noopener noreferrer" className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#e6e1d5] border-b-[8px] px-3 py-1.5 text-xs font-bold tracking-[0.15em] text-left hover:bg-[#e6e1d5] hover:text-neutral-900 transition-all duration-200">
                      www.proyectorosca.com →
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 8. RECONOCIMIENTOS */}
        <section 
          id="reconocimientos" 
          className="w-full h-auto py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-0 bg-white text-neutral-900 relative flex flex-col justify-center items-center transform-gpu bg-contain md:bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/reconocimientos/Radio_en_Casa_Background_Reconocimientos.png')`,
          }}
        >
          <div className="w-full max-w-[1100px] mx-auto space-y-6 px-0 sm:px-4 md:px-0 relative z-10 my-auto">
            <AnimateOnScroll duration={600} offset={25}>
              <div className="space-y-3 font-datatype text-left bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-none border border-neutral-300/80 shadow-sm">
                <TypewriterHeadingUnificado
                  text="RECONOCIMIENTOS"
                  className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-neutral-900 font-boldonse h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                />
                <p className="text-xs sm:text-sm md:text-base text-neutral-800 max-w-3xl leading-relaxed font-datatype">
                  A lo largo de estos años, la historia de Radio en Casa también fue contada por distintos medios, instituciones y espacios académicos. Estas son algunas de las publicaciones, entrevistas y reconocimientos que forman parte de ese recorrido.
                </p>
              </div>
            </AnimateOnScroll>

            <Recognitions3Columns items={recognitionsData} scrollProgress={scrollProgress} />
          </div>
        </section>

        {/* 9. FANZINE */}
        <section id="fanzine" className="w-full pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-0 bg-[#181818] text-[#e3e3e3] relative flex flex-col justify-center items-center transform-gpu min-h-screen overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-[140%] z-0 pointer-events-none opacity-40 mix-blend-luminosity will-change-transform transition-transform duration-100 ease-linear"
            style={{
              backgroundImage: `url('/images/filosofia/Radio_en_Casa_Background_Filosofia.png')`,
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'center top',
              backgroundSize: '100% auto',
              transform: `translateY(${(scrollProgress - 0.7) * -120}px)`,
            }}
          >
            <div 
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)',
              }}
            />
          </div>

          <div className="w-full max-w-[1100px] mx-auto px-0 sm:px-4 md:px-0 space-y-6 sm:space-y-8 relative z-10">
            <AnimateOnScroll duration={750} offset={35}>
              <div className="w-full bg-[#1e1e1e]/90 backdrop-blur-md p-5 sm:p-8 border border-[#5c5c5c]/60 shadow-xl space-y-4 font-datatype text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed rounded-none">
                <TypewriterHeadingUnificado
                  text="NO TODO LO QUE PASA EN RADIO EN CASA ENTRA EN UN PROGRAMA O UN PODCAST"
                  className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#e3e3e3] font-boldonse h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16 pt-2 font-datatype">
                  <div className="space-y-3 font-datatype">
                    <p className="text-neutral-300">Este es nuestro tablero de anuncios, diario de viaje y cartelera comunitaria. Un lugar donde compartimos novedades, recomendaciones, lanzamientos, convocatorias y todo aquello que creemos que vale la pena descubrir.</p>
                  </div>
                  <div className="space-y-3 font-datatype">
                    <p className="text-[#f74a35] font-bold border-t border-[#5c5c5c]/60 pt-3 font-datatype">Porque una comunidad no se construye solamente grabando contenidos. También se construye compartiendo lo que nos entusiasma.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200} duration={600} offset={30}>
              <SubstackFanzineFeed />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 10. STORE */}
        <section
          ref={storeRef}
          id="store"
          className="w-full min-h-screen relative overflow-hidden text-[#ececec] pt-0 pb-24 sm:pb-32 flex flex-col justify-between items-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/reconocimientos/Radio_en_Casa_Background_Reconocimientos.png')`,
          }}
        >
          <div className="w-full relative left-0 right-0 top-0 mb-0 overflow-hidden z-10 py-0">
            <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
              <div className="w-full h-[32vh] sm:h-[48vh] min-h-[220px] sm:min-h-[320px] overflow-hidden bg-transparent border border-white/10 shadow-lg rounded-none">
                <img
                  src="/images/tienda/Radio_en_Casa_Header.png"
                  alt="Radio en Casa Store Header"
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/tienda/Radio_en_Casa_Header_01.png';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1100px] mx-auto space-y-6 sm:space-y-8 relative z-20 -mt-10 sm:-mt-20 px-4 sm:px-6 md:px-12 lg:px-0">
            <AnimateOnScroll delay={150} duration={600} offset={25}>
              <div className="bg-white p-5 sm:p-8 md:p-10 border border-[#111111]/20 rounded-none shadow-2xl space-y-4 sm:space-y-6 font-datatype text-xs sm:text-sm md:text-base text-neutral-800 leading-relaxed">
                <div className="space-y-1">
                  <h1 className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#111111] font-boldonse h1-custom leading-[1.8rem] sm:leading-[3.82rem]">
                    LA MEJOR MANERA
                  </h1>
                  <h1 className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#111111] font-boldonse h1-custom leading-[1.8rem] sm:leading-[3.82rem]">
                    DE LLEVARTE UN PEDACITO
                  </h1>
                  <TypewriterHeadingUnificado
                    text="DE RADIO EN CASA"
                    className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#f74a35] font-boldonse h1-custom leading-[1.8rem] sm:leading-[3.82rem]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16 pt-2 font-datatype">
                  <div className="space-y-3 font-datatype">
                    <p className="text-neutral-800 font-datatype">En esta tienda vas a encontrar productos diseñados para quienes forman parte de nuestra comunidad: desde merchandising hasta ediciones especiales y objetos creados junto a artistas y proyectos amigos.</p>
                  </div>
                  <div className="space-y-3 font-datatype">
                    <p className="text-[#f74a35] font-semibold font-datatype">Porque algunas historias también se pueden llevar puestas.</p>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4 flex justify-start font-datatype">
                  <a href="https://radioencasa.mitiendanube.com/" target="_blank" rel="noopener noreferrer" className="inline-block relative bg-[#181818] text-[#e6e1d5] font-mono border-2 border-[#181818] border-b-[8px] sm:border-b-[12px] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-[0.2em] text-left hover:bg-[#f74a35] hover:text-white hover:border-[#f74a35] transition-all duration-200 font-datatype">
                    Ir a la tienda →
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 11. LA CASA */}
        <section id="la-casa" className="w-full pt-0 pb-0 mb-0 bg-[#181818] text-[#ececec] relative flex flex-col justify-between overflow-hidden transform-gpu min-h-screen">
          <div 
            className="absolute inset-0 w-full h-[140%] z-0 pointer-events-none opacity-40 mix-blend-luminosity will-change-transform transition-transform duration-100 ease-linear"
            style={{
              backgroundImage: `url('/images/filosofia/Radio_en_Casa_Background_Filosofia.png')`,
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'center top',
              backgroundSize: '100% auto',
              transform: `translateY(${(scrollProgress - 0.8) * -120}px)`,
            }}
          >
            <div 
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)',
              }}
            />
          </div>

          <div className="w-full h-[320px] sm:h-[480px] bg-[#111111] border-b border-[#5c5c5c]/60 relative overflow-hidden group shadow-xl z-10">
            <iframe title="Mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.5826978182937!2d-58.4238515!3d-34.5893083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb58097b6294b%3A0x6b453a2ef5638c4b!2sMalabia%202134%2C%20C1425EZD%20CABA%2C%20Argentina!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar" className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-80 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700 ease-out" loading="lazy" allowFullScreen />
          </div>

          <div className="w-full max-w-[1100px] mx-auto space-y-6 mt-6 px-4 md:px-0 mb-0 pb-0 relative z-10">
            <div className="w-full font-datatype text-left pb-4 border-b border-[#5c5c5c]/40 font-boldonse space-y-2 sm:space-y-3">
              <a
                href="https://maps.google.com/?q=Malabia+2134+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <h1 className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#e3e3e3] group-hover:text-[#f74a35] transition-colors font-boldonse h1-custom leading-[1.8rem] sm:leading-[4.5rem]">
                  MALABIA 2134
                </h1>
              </a>

              <a
                href="mailto:info@radioencasa.com"
                className="block group"
              >
                <h1 className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#f74a35] group-hover:text-white transition-colors font-boldonse h1-custom leading-[1.8rem] sm:leading-[4.5rem]">
                  INFO@RADIOENCASA.COM
                </h1>
              </a>

              <a
                href="https://www.instagram.com/radioencasa/"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <h1 className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#e3e3e3] group-hover:text-[#f74a35] transition-colors font-boldonse h1-custom leading-[1.8rem] sm:leading-[4.5rem]">
                  @RADIOENCASA
                </h1>
              </a>

              <a
                href="tel:+541148317132"
                className="block group"
              >
                <TypewriterHeadingUnificado
                  text="(+54 11) 4831-7132"
                  className="text-[1.25rem] sm:text-[1.69rem] md:text-[2.02rem] lg:text-[3.25rem] font-extrabold tracking-wider text-[#e3e3e3] group-hover:text-[#f74a35] transition-colors font-boldonse h1-custom cursor-pointer leading-[1.8rem] sm:leading-[4.5rem]"
                />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-datatype text-xs sm:text-sm md:text-base text-neutral-200 items-start">
              <AnimateOnScroll delay={100} duration={600} offset={30}>
                <div className="bg-[#1e1e1e]/90 backdrop-blur-md p-5 sm:p-6 border border-[#5c5c5c]/60 shadow-xl space-y-3 leading-relaxed flex flex-col justify-between h-full font-datatype rounded-none">
                  <div className="space-y-3">
                    <h4 className="tracking-widest text-[#f74a35] font-extrabold border-b border-[#5c5c5c]/40 pb-2 font-boldonse text-sm sm:text-lg h4-custom">El espacio</h4>
                    <p className="text-xs sm:text-sm md:text-base font-datatype leading-relaxed text-neutral-300">
                      Estamos en un PH reciclado de Palermo Soho, Buenos Aires. A una cuadra de Av. Scalabrini Ortiz y tres de Av. Santa Fe, en uno de los polos culturales más activos de la ciudad. Un espacio que combina la historia y la calidez de una casa con la infraestructura de un estudio profesional.
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={220} duration={700} offset={40}>
                <div className="bg-[#1e1e1e]/90 backdrop-blur-md p-5 sm:p-6 border border-[#5c5c5c]/60 shadow-xl flex flex-col justify-start h-full font-datatype rounded-none">
                  <p className="text-[#e3e3e3] font-bold border-l-4 border-[#f74a35] pl-4 py-3 bg-[#121212]/80 text-sm sm:text-lg md:text-xl font-datatype leading-snug">
                    Pensado para crear, grabar y compartir historias.
                  </p>
                </div>
              </AnimateOnScroll>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 pb-4 relative z-10">
              <div className="w-full flex justify-start items-center">
                <div 
                  ref={heroLogoRefEnd} 
                  key={logoEndAnimKey}
                  className="animated-logo-svg h-auto w-full max-w-[220px] pointer-events-auto text-[#e3e3e3] transition-all duration-1000 ease-out"
                >
                  <AnimatedLogo showBandText={false} />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#111111] mt-auto py-3.5 sm:py-2.5 px-4 sm:px-6 md:px-12 relative z-20 mb-0">
            <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[9.35px] text-neutral-400 font-datatype text-left">
              <div className="flex flex-wrap items-center gap-2 font-bold tracking-tight font-datatype text-[9.35px] text-left">
                <span>© {currentYear} RADIO EN CASA</span>
                <span className="text-neutral-600">•</span>
                <span className="text-[#f74a35] uppercase font-datatype">“Mudamos la forma de hacer radio”</span>
              </div>
              <p className="font-datatype text-[9.35px] flex items-baseline gap-1 text-left">
                <span>Design & Dev. by</span>
                <a 
                  href="https://www.guapo.studio" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#e3e3e3] hover:text-[#f74a35] underline underline-offset-2 transition-colors duration-300 font-bold font-datatype text-[9.35px] uppercase"
                >
                  Guapo./
                </a>
              </p>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}