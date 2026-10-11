'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BarSettings {
  direction: number;
  speed: number;
}

interface AnimatedLogoProps {
  showBandText?: boolean;
}

export default function AnimatedLogo({ showBandText = true }: AnimatedLogoProps) {
  const logoRef = useRef<SVGSVGElement>(null);
  const barsGroupRef = useRef<SVGGElement>(null);
  const barsSettingsRef = useRef<BarSettings[]>([]);

  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const svg = logoRef.current;
    const barsContainer = barsGroupRef.current;
    if (!svg || !barsContainer) return;

    const bars = Array.from(barsContainer.children) as HTMLElement[];
    const elements = svg.querySelectorAll('.logo-path');

    if (barsSettingsRef.current.length === 0) {
      barsSettingsRef.current = bars.map(() => ({
        direction: Math.random() < 0.5 ? 1 : -1,
        speed: 0.6 + Math.random() * 0.8,
      }));
    }

    elements.forEach((el) => {
      const shape = el as SVGPathElement;
      const length = shape.getTotalLength ? shape.getTotalLength() : 500;

      gsap.set(shape, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
        stroke: '#e3e3e3', // TRAZO EN #e3e3e3
        strokeWidth: 1.5,
      });
    });

    const entryDirections = bars.map(() =>
      !showBandText ? -1500 : Math.random() > 0.5 ? 1500 : -1500
    );

    gsap.set(bars, {
      x: (i) => entryDirections[i],
      opacity: 0,
    });

    let soundWaveTimelines: gsap.core.Timeline[] = [];

    const introTl = gsap.timeline({
      onComplete: () => {
        setIsGlitching(true);

        setTimeout(() => {
          setIsGlitching(false);
        }, 1200);

        if (!showBandText) {
          initSoundWaveAnimation();
        } else {
          initScrollBehavior();
        }
      },
    });

    introTl
      .to(elements, {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.08,
        ease: 'power2.inOut',
      })
      .to(elements, {
        fillOpacity: 1,
        strokeOpacity: 0,
        duration: 0.6,
        ease: 'power1.out',
      })
      .to(
        bars,
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.4'
      );

    function initSoundWaveAnimation() {
      bars.forEach((bar, i) => {
        const rect = bar.querySelector('.visible-rect');
        if (!rect) return;

        gsap.set(rect, { transformOrigin: 'left center' });

        const waveTl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.15 });

        waveTl
          .to(rect, {
            scaleX: 0.35 + Math.random() * 0.25,
            duration: 0.25 + Math.random() * 0.3,
            ease: 'sine.inOut',
          })
          .to(rect, {
            scaleX: 0.8 + Math.random() * 0.25,
            duration: 0.3 + Math.random() * 0.35,
            ease: 'power1.inOut',
          })
          .to(rect, {
            scaleX: 0.15 + Math.random() * 0.2,
            duration: 0.2 + Math.random() * 0.25,
            ease: 'sine.out',
          })
          .to(rect, {
            scaleX: 1,
            duration: 0.35 + Math.random() * 0.3,
            ease: 'power2.inOut',
          });

        soundWaveTimelines.push(waveTl);
      });
    }

    let scrollTriggerInstance: ScrollTrigger | null = null;

    function initScrollBehavior() {
      const maxMovement = 300;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: svg,
          start: 'top top',
          end: '+=800',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      bars.forEach((bar, i) => {
        const settings = barsSettingsRef.current[i];
        scrollTl.to(
          bar,
          {
            x: maxMovement * settings.direction * settings.speed,
            ease: 'none',
          },
          0
        );
      });

      scrollTriggerInstance = scrollTl.scrollTrigger || null;
    }

    return () => {
      introTl.kill();
      soundWaveTimelines.forEach((tl) => tl.kill());
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, [showBandText]);

  // REDIRECCIÓN A LA SECCIÓN "SERVICIOS"
  const scrollToSection = (id: string) => {
    if (!showBandText) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full overflow-visible select-none">
      <style jsx>{`
        .bar-button {
          cursor: ${showBandText ? 'pointer' : 'default'};
          pointer-events: ${showBandText ? 'auto' : 'none'};
        }
        .bar-button .hit-area {
          fill: transparent;
          pointer-events: ${showBandText ? 'auto' : 'none'};
        }
        .bar-button .visible-rect {
          transition: ${showBandText ? 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease' : 'none'};
          transform-origin: left center !important;
          pointer-events: none;
        }
        .bar-button text {
          opacity: 0;
          transition: opacity 0.25s ease-out;
          font-family: 'Rethink Sans', 'DM Sans', sans-serif;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: none;
          fill: #e3e3e3 !important; /* TEXTO EN #e3e3e3 */
        }
        ${showBandText
          ? `
          .bar-button:hover .visible-rect {
            transform: scaleX(0.55);
            filter: none !important;
          }
          .bar-button:hover text {
            opacity: 1 !important;
          }
        `
          : ''}
      `}</style>

      <div className="relative w-full flex flex-col items-center justify-center overflow-visible">
        {/* CAPA RGB 1: ROJO */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isGlitching ? 'opacity-90 animate-glitch-red' : 'opacity-0'
          }`}
          style={{ mixBlendMode: 'screen' }}
        >
          <LogoSvg fill="#f74a35" />
        </div>

        {/* CAPA RGB 2: CIAN */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isGlitching ? 'opacity-90 animate-glitch-cyan' : 'opacity-0'
          }`}
          style={{ mixBlendMode: 'screen' }}
        >
          <LogoSvg fill="#1b9aaa" />
        </div>

        {/* SVG UNIFICADO EN #e3e3e3 */}
        <div className={`w-full flex items-center justify-center overflow-visible ${isGlitching ? 'animate-glitch-main' : ''}`}>
          <svg
            ref={logoRef}
            viewBox="0 0 899.82 472"
            className="w-full h-auto drop-shadow-2xl z-10 overflow-visible"
            style={{ color: '#e3e3e3' }}
            fill="#e3e3e3"
          >
            {/* 1. TRAZOS DEL LOGO BLANCO / #e3e3e3 */}
            <g transform="translate(0, 0)">
              <path className="logo-path" d="M140.624,29.291L140.624,29.291c0-15.392-12.478-27.871-27.87-27.871H0v88.059h25.565V26.986h88.073v5.681H31.242v25.565h17.64l10.033,24.231c1.759,4.247,5.902,7.016,10.498,7.016h69.778V63.914H77.866l-2.353-5.681h36.17C127.6,58.232,140.624,45.208,140.624,29.291z" />
              <rect className="logo-path" x="0" y="96.594" width="602.214" height="25.565" />
              <rect className="logo-path" x="0" y="224.435" width="899.82" height="25.565" />
              <path className="logo-path" d="M624.539,27.992c-2.39,0-4.595-0.583-6.553-1.732c-1.962-1.151-3.541-2.741-4.691-4.724c-1.15-1.982-1.734-4.266-1.734-6.789c0-2.524,0.583-4.808,1.734-6.789c1.15-1.983,2.729-3.573,4.691-4.725c1.959-1.15,4.164-1.733,6.553-1.733c2.432,0,4.647,0.583,6.585,1.732c1.94,1.151,3.508,2.741,4.661,4.726c1.15,1.981,1.734,4.265,1.734,6.789c0,2.523-0.583,4.808-1.734,6.789c-1.153,1.984-2.721,3.574-4.661,4.725C629.188,27.41,626.972,27.992,624.539,27.992z M624.539,3.636c-1.85,0-3.575,0.4-5.129,1.189c-1.564,0.793-2.842,1.953-3.799,3.446c-0.959,1.497-1.446,3.316-1.446,5.407v2.136c0,2.091,0.487,3.911,1.446,5.408c0.957,1.494,2.235,2.653,3.799,3.445c1.55,0.789,3.276,1.188,5.129,1.188s3.58-0.4,5.132-1.188c1.563-0.793,2.841-1.953,3.797-3.446c0.96-1.501,1.447-3.32,1.447-5.407v-2.136c0-2.087-0.487-3.906-1.447-5.407c-0.957-1.493-2.235-2.652-3.798-3.446C628.115,4.036,626.388,3.636,624.539,3.636z M626.977,21.186l-2.136-4.07h-2.336v4.07h-3.271V8.24h6.307c1.716,0,2.964,0.397,3.708,1.18c0.76,0.802,1.13,1.78,1.13,2.991c0,1.012-0.201,1.856-0.596,2.511c-0.397,0.654-0.916,1.125-1.587,1.441l-0.497,0.234l2.705,4.59H626.977z M622.505,14.98h2.169c0.744,0,1.303-0.155,1.709-0.474c0.437-0.343,0.658-0.868,0.658-1.561v-0.467c0-0.692-0.221-1.217-0.657-1.561c-0.405-0.315-0.979-0.475-1.71-0.475h-2.169V14.98z" />
              <path className="logo-path" d="M315.313,26.986l82.378,0c1.569,0,2.841,1.272,2.841,2.841v31.247c0,1.569-1.272,2.841-2.841,2.841l-107.944,0v25.565l110.781,0.013c14.121,0.002,25.568-11.445,25.568-25.565V26.986c0-14.119-11.446-25.565-25.565-25.565l-110.784,0v56.812l25.565,0V26.986z" />
              <path className="logo-path" d="M576.649,1.42H491.43c-14.12,0-25.565,11.446-25.565,25.565v36.941c0,14.12,11.448,25.568,25.568,25.565l42.607-0.005l42.606,0.005c14.12,0.002,25.568-11.445,25.568-25.565V26.986C602.214,12.867,590.769,1.42,576.649,1.42z M576.649,61.073c0,1.569-1.272,2.841-2.841,2.841h-79.538c-1.569,0-2.841-1.272-2.841-2.841V29.826c0-1.569,1.272-2.841,2.841-2.841h79.538c1.569,0,2.841,1.272,2.841,2.841V61.073z" />
              <rect className="logo-path" x="433.198" y="1.421" width="25.565" height="88.059" />
              <path className="logo-path" d="M146.297,1.421v25.565l91.387,0l2.353,5.681l-66.231,0c-15.918,0-28.942,13.024-28.942,28.942v0c0,15.392,12.478,27.87,27.87,27.87l109.912,0V63.914l-110.796,0v-5.681h110.796V32.667l-15.978,0L256.634,8.436c-1.758-4.247-5.902-7.016-10.498-7.016L146.297,1.421z" />
              <path className="logo-path" d="M782.606,191.768v-5.681H899.82v-25.565h-15.978l-10.033-24.231c-1.759-4.247-5.903-7.016-10.499-7.016l-227.545-0.001c-15.392,0-27.871,12.478-27.871,27.87c0,15.918,13.024,28.942,28.943,28.942h84.695v5.681H566.707v0.001H485v-5.681h117.215v-25.565h-15.979l-10.033-24.231c-1.759-4.247-5.902-7.016-10.498-7.016l-224.482-0.013c-14.12-0.001-25.568,11.445-25.568,25.565v36.941c0,14.12,11.446,25.565,25.565,25.565h111.126v-25.565H344.061c-1.569,0-2.841-1.272-2.841-2.841V157.68c0-1.569,1.272-2.841,2.841-2.841h213.191l2.354,5.681h-72.649c-15.918,0-28.942,13.024-28.942,28.941v0.001c0,15.392,12.478,27.87,27.87,27.87l234.764-0.001c15.392,0,27.871-12.478,27.871-27.87c0-15.918-13.024-28.942-28.943-28.942h-84.695v-5.681l219.977,0.001l2.354,5.681h-72.649c-15.918,0-28.942,13.024-28.942,28.941v0.001c0,15.392,12.478,27.87,27.87,27.87l116.33,0v-25.566L782.606,191.768z" />
              <path className="logo-path" d="M257.08,192.304h-7.102v-37.477c0-14.12-11.446-25.565-25.565-25.565h-78.129v62.506l-119.298-0.001v-5.681h86.652V160.52H26.986v-5.681l112.218,0.001v-25.565L0,129.274v62.493c0,14.12,11.446,25.565,25.565,25.565l146.284,0.001V154.84h49.718c1.569,0,2.841,1.272,2.841,2.841v51.197c0,4.669,3.785,8.455,8.455,8.455h49.782v-88.072H257.08V192.304z" />
            </g>

            {/* 2. LAS 4 BANDAS BOTONES (TODAS DIRIGIDAS A 'SERVICIOS') */}
            <g ref={barsGroupRef}>
              {/* BANDA 1: ROJA */}
              <g className="bar-button" onClick={() => scrollToSection('servicios')}>
                <rect className="hit-area" x="0" y="257.84" width="899.82" height="51.13" />
                <rect className="visible-rect" x="0" y="257.84" width="899.82" height="51.13" fill="#f74a35" />
                {showBandText && (
                  <text x="20" y="283.40" textAnchor="start" dominantBaseline="middle" fontSize="18">
                    HACEMOS RADIO
                  </text>
                )}
              </g>

              {/* BANDA 2: NARANJA */}
              <g className="bar-button" onClick={() => scrollToSection('servicios')}>
                <rect className="hit-area" x="0" y="308.97" width="899.82" height="51.13" />
                <rect className="visible-rect" x="0" y="308.97" width="899.82" height="51.13" fill="#f9772f" />
                {showBandText && (
                  <text x="20" y="334.53" textAnchor="start" dominantBaseline="middle" fontSize="18">
                    HACEMOS PODCASTS
                  </text>
                )}
              </g>

              {/* BANDA 3: AMARILLA */}
              <g className="bar-button" onClick={() => scrollToSection('servicios')}>
                <rect className="hit-area" x="0" y="360.10" width="899.82" height="51.13" />
                <rect className="visible-rect" x="0" y="360.10" width="899.82" height="51.13" fill="#f9b92f" />
                {showBandText && (
                  <text x="20" y="385.66" textAnchor="start" dominantBaseline="middle" fontSize="18">
                    HACEMOS STREAMING
                  </text>
                )}
              </g>

              {/* BANDA 4: VERDE/AZUL */}
              <g className="bar-button" onClick={() => scrollToSection('servicios')}>
                <rect className="hit-area" x="0" y="411.23" width="899.82" height="51.13" />
                <rect className="visible-rect" x="0" y="411.23" width="899.82" height="51.13" fill="#005266" />
                {showBandText && (
                  <text x="20" y="436.79" textAnchor="start" dominantBaseline="middle" fontSize="18">
                    VAMOS A DONDE DIGAS
                  </text>
                )}
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function LogoSvg({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 899.82 472" className="w-full h-auto overflow-visible" fill={fill}>
      <g>
        <path d="M140.624,29.291L140.624,29.291c0-15.392-12.478-27.871-27.87-27.871H0v88.059h25.565V26.986h88.073v5.681H31.242v25.565h17.64l10.033,24.231c1.759,4.247,5.902,7.016,10.498,7.016h69.778V63.914H77.866l-2.353-5.681h36.17C127.6,58.232,140.624,45.208,140.624,29.291z" />
        <rect x="0" y="96.594" width="602.214" height="25.565" />
        <rect x="0" y="224.435" width="899.82" height="25.565" />
        <path d="M624.539,27.992c-2.39,0-4.595-0.583-6.553-1.732c-1.962-1.151-3.541-2.741-4.691-4.724c-1.15-1.982-1.734-4.266-1.734-6.789c0-2.524,0.583-4.808,1.734-6.789c1.15-1.983,2.729-3.573,4.691-4.725c1.959-1.15,4.164-1.733,6.553-1.733c2.432,0,4.647,0.583,6.585,1.732c1.94,1.151,3.508,2.741,4.661,4.726c1.15,1.981,1.734,4.265,1.734,6.789c0,2.523-0.583,4.808-1.734,6.789c-1.153,1.984-2.721,3.574-4.661,4.725C629.188,27.41,626.972,27.992,624.539,27.992z M624.539,3.636c-1.85,0-3.575,0.4-5.129,1.189c-1.564,0.793-2.842,1.953-3.799,3.446c-0.959,1.497-1.446,3.316-1.446,5.407v2.136c0,2.091,0.487,3.911,1.446,5.408c0.957,1.494,2.235,2.653,3.799,3.445c1.55,0.789,3.276,1.188,5.129,1.188s3.58-0.4,5.132-1.188c1.563-0.793,2.841-1.953,3.797-3.446c0.96-1.501,1.447-3.32,1.447-5.407v-2.136c0-2.087-0.487-3.906-1.447-5.407c-0.957-1.493-2.235-2.652-3.798-3.446C628.115,4.036,626.388,3.636,624.539,3.636z M626.977,21.186l-2.136-4.07h-2.336v4.07h-3.271V8.24h6.307c1.716,0,2.964,0.397,3.708,1.18c0.76,0.802,1.13,1.78,1.13,2.991c0,1.012-0.201,1.856-0.596,2.511c-0.397,0.654-0.916,1.125-1.587,1.441l-0.497,0.234l2.705,4.59H626.977z M622.505,14.98h2.169c0.744,0,1.303-0.155,1.709-0.474c0.437-0.343,0.658-0.868,0.658-1.561v-0.467c0-0.692-0.221-1.217-0.657-1.561c-0.405-0.315-0.979-0.475-1.71-0.475h-2.169V14.98z" />
        <path d="M315.313,26.986l82.378,0c1.569,0,2.841,1.272,2.841,2.841v31.247c0,1.569-1.272,2.841-2.841,2.841l-107.944,0v25.565l110.781,0.013c14.121,0.002,25.568-11.445,25.568-25.565V26.986c0-14.119-11.446-25.565-25.565-25.565l-110.784,0v56.812l25.565,0V26.986z" />
        <path d="M576.649,1.42H491.43c-14.12,0-25.565,11.446-25.565,25.565v36.941c0,14.12,11.448,25.568,25.568,25.565l42.607-0.005l42.606,0.005c14.12,0.002,25.568-11.445,25.568-25.565V26.986C602.214,12.867,590.769,1.42,576.649,1.42z M576.649,61.073c0,1.569-1.272,2.841-2.841,2.841h-79.538c-1.569,0-2.841-1.272-2.841-2.841V29.826c0-1.569,1.272-2.841,2.841-2.841h79.538c1.569,0,2.841,1.272,2.841,2.841V61.073z" />
        <rect x="433.198" y="1.421" width="25.565" height="88.059" />
        <path d="M146.297,1.421v25.565l91.387,0l2.353,5.681l-66.231,0c-15.918,0-28.942,13.024-28.942,28.942v0c0,15.392,12.478,27.87,27.87,27.87l109.912,0V63.914l-110.796,0v-5.681h110.796V32.667l-15.978,0L256.634,8.436c-1.758-4.247-5.902-7.016-10.498-7.016L146.297,1.421z" />
        <path d="M782.606,191.768v-5.681H899.82v-25.565h-15.978l-10.033-24.231c-1.759-4.247-5.903-7.016-10.499-7.016l-227.545-0.001c-15.392,0-27.871,12.478-27.871,27.87c0,15.918,13.024,28.942,28.943,28.942h84.695v5.681H566.707v0.001H485v-5.681h117.215v-25.565h-15.979l-10.033-24.231c-1.759-4.247-5.902-7.016-10.498-7.016l-224.482-0.013c-14.12-0.001-25.568,11.445-25.568,25.565v36.941c0,14.12,11.446,25.565,25.565,25.565h111.126v-25.565H344.061c-1.569,0-2.841-1.272-2.841-2.841V157.68c0-1.569,1.272-2.841,2.841-2.841h213.191l2.354,5.681h-72.649c-15.918,0-28.942,13.024-28.942,28.941v0.001c0,15.392,12.478,27.87,27.87,27.87l234.764-0.001c15.392,0,27.871-12.478,27.871-27.87c0-15.918-13.024-28.942-28.943-28.942h-84.695v-5.681l219.977,0.001l2.354,5.681h-72.649c-15.918,0-28.942,13.024-28.942,28.941v0.001c0,15.392,12.478,27.87,27.87,27.87l116.33,0v-25.566L782.606,191.768z" />
        <path d="M257.08,192.304h-7.102v-37.477c0-14.12-11.446-25.565-25.565-25.565h-78.129v62.506l-119.298-0.001v-5.681h86.652V160.52H26.986v-5.681l112.218,0.001v-25.565L0,129.274v62.493c0,14.12,11.446,25.565,25.565,25.565l146.284,0.001V154.84h49.718c1.569,0,2.841,1.272,2.841,2.841v51.197c0,4.669,3.785,8.455,8.455,8.455h49.782v-88.072H257.08V192.304z" />
        <rect x="0" y="257.84" width="899.82" height="51.13" fill="#f74a35" />
        <rect x="0" y="308.97" width="899.82" height="51.13" fill="#f9772f" />
        <rect x="0" y="360.10" width="899.82" height="51.13" fill="#f9b92f" />
        <rect x="0" y="411.23" width="899.82" height="51.13" fill="#005266" />
      </g>
    </svg>
  );
}