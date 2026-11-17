/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Heart, Music, RotateCcw, X, Maximize2 } from 'lucide-react';

interface FloatingItem {
  id: number;
  symbol: string;
  leftVw: number;
  fontSizePx: number;
}

interface SongOption {
  id: string;
  label: string;
}

interface PhotoSlot {
  key: 'yellowDress' | 'cafe';
  defaultSrc: string;
  alt: string;
  caption: string;
  objectPositionClass: string;
}

const SONGS: SongOption[] = [
  { id: 'iggmiF7DNoM', label: 'We Fell in Love in October 🌷' },
  { id: '9bFHsd3o1w0', label: 'My Heart Will Go On ❤️' },
  { id: 'OTJtq2DGGk8', label: 'I Will Always Love You' },
];

const PHOTO_SLOTS: PhotoSlot[] = [
  {
    key: 'yellowDress',
    defaultSrc: '/assets/aistudio/ChatGPT_Image_Nov_17__2026__08_56_42_PM_106c01d8.jpg',
    alt: 'Chahd in a yellow dress',
    caption: 'My sunshine in yellow',
    objectPositionClass: 'object-[50%_22%]',
  },
  {
    key: 'cafe',
    defaultSrc: '/assets/aistudio/ChatGPT_Image_Nov_17__2026__08_56_56_PM_69ecc377.jpg',
    alt: 'Chahd at a cafe',
    caption: 'Cafe moments',
    objectPositionClass: 'object-[50%_56%]',
  },
];

const FLOATING_SYMBOLS = ['❤️', '💕', '🌹', '🌸', '✨'];
const STORAGE_KEY = 'chahd_birthday_custom_photos_v1';

export default function App() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [customPhotos, setCustomPhotos] = useState<Partial<Record<'yellowDress' | 'cafe', string>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const giftSectionRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(1);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!giftOpened) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      const id = nextIdRef.current++;
      const symbol = FLOATING_SYMBOLS[Math.floor(Math.random() * FLOATING_SYMBOLS.length)];
      const leftVw = Math.random() * 96 + 2;
      const fontSizePx = 20 + Math.random() * 18;

      setFloatingItems((prev) => [...prev.slice(-24), { id, symbol, leftVw, fontSizePx }]);

      window.setTimeout(() => {
        setFloatingItems((prev) => prev.filter((item) => item.id !== id));
      }, 7000);
    }, 450);

    return () => window.clearInterval(interval);
  }, [giftOpened]);

  useEffect(() => {
    if (!lightboxPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto]);

  const handleOpenGift = () => {
    setGiftOpened(true);
    window.requestAnimationFrame(() => {
      giftSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handlePhotoUpload = (slotKey: 'yellowDress' | 'cafe', file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = { ...customPhotos, [slotKey]: reader.result };
        setCustomPhotos(updated);
        setFailedImages((prev) => ({ ...prev, [slotKey]: false }));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage quota errors if image is very large
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (slotKey: 'yellowDress' | 'cafe') => {
    const updated = { ...customPhotos };
    delete updated[slotKey];
    setCustomPhotos(updated);
    setFailedImages((prev) => ({ ...prev, [slotKey]: false }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="relative min-h-screen text-center text-[#fff0f4] selection:bg-[#edabc2]/30 selection:text-white">
      {/* Floating celebration symbols */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
        {floatingItems.map((item) => (
          <span
            key={item.id}
            className="animate-float-rise fixed -bottom-8 select-none"
            style={{
              left: `${item.leftVw}vw`,
              fontSize: `${item.fontSizePx}px`,
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>

      {/* Welcome Hero Section */}
      <section
        id="welcome"
        className="mx-auto flex min-h-[78vh] max-w-[850px] flex-col items-center justify-center px-5 py-16"
      >
        <div className="animate-heart-pulse mb-4 text-[36px] text-[#ffc1d4]" aria-hidden="true">
          ♡
        </div>
        <p className="mb-3 text-sm tracking-[0.18em] text-[#f5b2c7] uppercase">
          A little surprise for someone special
        </p>
        <h1 className="mb-5 text-[clamp(48px,11vw,84px)] leading-[1.08] font-semibold text-[#ffc1d4] [text-wrap:balance]">
          Happy Birthday
          <br />
          Chahd
        </h1>
        <p className="mb-8 max-w-md text-base leading-[1.9] text-[#fff0f4]/90 sm:text-lg">
          To the girl who makes my world brighter.
        </p>
        <button
          type="button"
          onClick={handleOpenGift}
          className="cursor-pointer rounded-full bg-[#edabc2] px-8 py-4 text-base font-semibold whitespace-nowrap text-[#45162b] shadow-lg shadow-[#180711]/40 transition duration-200 hover:scale-[1.02] hover:bg-[#f7bfd3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffc1d4] active:scale-[0.98]"
        >
          OPEN YOUR GIFT ❤️
        </button>
      </section>

      {/* Revealed Gift Sections */}
      {giftOpened && (
        <div ref={giftSectionRef} id="gift" className="pb-20">
          {/* Section 1: My Sunshine + Two Pictures */}
          <section className="mx-auto max-w-[850px] px-5 py-14">
            <h2 className="mb-4 text-[34px] font-semibold text-[#f5b2c7] sm:text-[38px]">
              My Sunshine ☀️
            </h2>
            <p className="mx-auto max-w-xl text-base leading-[1.9] text-[#fff0f4]/90">
              Today is not just another day. Today is the birthday of the person who brings so
              much light into my life.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PHOTO_SLOTS.map((slot) => {
                const src = customPhotos[slot.key] ?? slot.defaultSrc;
                const isCustom = Boolean(customPhotos[slot.key]);
                const hasFailed = Boolean(failedImages[slot.key]);

                return (
                  <div
                    key={slot.key}
                    className="group relative overflow-hidden rounded-[22px] border-2 border-[#eaa4bd] bg-[#2a0c1d]/80 shadow-xl shadow-[#180711]/40"
                  >
                    {!hasFailed ? (
                      <img
                        src={src}
                        alt={slot.alt}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [slot.key]: true }))
                        }
                        onClick={() => setLightboxPhoto({ src, alt: slot.alt })}
                        className={`h-[420px] w-full cursor-pointer object-cover ${slot.objectPositionClass} transition duration-300 group-hover:scale-[1.02]`}
                      />
                    ) : (
                      <div className="flex h-[420px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#3a1228] to-[#1e0814] p-6 text-[#f5b2c7]">
                        <Heart className="mb-3 h-10 w-10 opacity-75" />
                        <span className="text-sm font-medium">{slot.caption}</span>
                      </div>
                    )}

                    {/* Subtle action overlay for viewing full-size or replacing with personal photo */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#180711]/90 via-[#180711]/55 to-transparent px-4 pt-10 pb-3.5 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => setLightboxPhoto({ src, alt: slot.alt })}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#180711]/75 px-3 py-1.5 text-xs font-medium text-[#fff0f4] backdrop-blur-sm transition hover:bg-[#541b37] focus-visible:outline-2 focus-visible:outline-[#ffc1d4]"
                        aria-label={`View ${slot.alt} full size`}
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        View
                      </button>

                      <div className="flex items-center gap-2">
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetPhoto(slot.key)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#180711]/75 px-3 py-1.5 text-xs font-medium text-[#f5b2c7] backdrop-blur-sm transition hover:bg-[#541b37] focus-visible:outline-2 focus-visible:outline-[#ffc1d4]"
                            title="Reset to default photo"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[slot.key]?.click()}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#edabc2] px-3 py-1.5 text-xs font-semibold text-[#45162b] shadow transition hover:bg-[#f7bfd3] focus-visible:outline-2 focus-visible:outline-[#ffc1d4]"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          Replace Photo
                        </button>
                      </div>

                      <input
                        ref={(el) => {
                          fileInputRefs.current[slot.key] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handlePhotoUpload(slot.key, e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-base leading-[1.9] text-[#fff0f4]/95">
              My beautiful girl, my sunshine. 🌷
            </p>
          </section>

          {/* Section 2: A Song For You */}
          <section className="mx-auto max-w-[850px] px-5 py-14">
            <h2 className="mb-4 text-[34px] font-semibold text-[#f5b2c7] sm:text-[38px]">
              A Song For You 🎶
            </h2>
            <p className="mb-6 text-base leading-[1.9] text-[#fff0f4]/90">
              Choose the song you want to hear, my love.
            </p>

            <div className="flex flex-col items-center gap-3">
              {SONGS.map((song) => {
                const isActive = activeSongId === song.id;
                return (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => setActiveSongId(song.id)}
                    className={`flex w-full max-w-[450px] cursor-pointer items-center justify-center gap-2.5 rounded-full border px-6 py-3.5 text-base font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc1d4] ${
                      isActive
                        ? 'border-[#ffc1d4] bg-[#edabc2] text-[#45162b] shadow-md'
                        : 'border-[#eaa4bd] bg-white/[0.09] text-white hover:bg-white/[0.16]'
                    }`}
                  >
                    <Music className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{song.label}</span>
                  </button>
                );
              })}
            </div>

            {activeSongId && (
              <div className="mx-auto mt-6 max-w-[560px] overflow-hidden rounded-[15px] border border-[#eaa4bd]/50 bg-black/40 shadow-xl">
                <iframe
                  key={activeSongId}
                  title="Birthday song player"
                  className="h-[240px] w-full border-0 sm:h-[315px]"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  src={`https://www.youtube-nocookie.com/embed/${activeSongId}?autoplay=1`}
                />
              </div>
            )}
          </section>

          {/* Section 3: A Letter From My Heart */}
          <section className="mx-auto max-w-[850px] px-5 py-14">
            <h2 className="mb-6 text-[34px] font-semibold text-[#f5b2c7] sm:text-[38px]">
              A Letter From My Heart 💌
            </h2>

            <article className="space-y-5 rounded-[22px] border border-[#eaa4bd]/40 bg-white/[0.07] p-6 text-left text-base leading-[2] text-[#fff0f4]/95 shadow-xl shadow-[#180711]/30 sm:p-10">
              <p>Happy birthday to the most beautiful soul, my Chahd. ❤️</p>

              <p>
                I wish I could put into words just how much you mean to me, but somehow, every
                sentence feels too small for what I feel. You are so much more than someone I
                love. You are the calm in my chaos, the smile behind so many of my happiest
                moments, and the light that makes even my darkest days feel warmer.
              </p>

              <p>
                You have this beautiful way of making life better without even trying. Your smile
                can change my entire day. Your voice can make everything feel okay. Just knowing
                that you are in my life gives me a happiness I never want to take for granted.
              </p>

              <p>
                I hope you see yourself through my eyes, even for a moment. I hope you see how
                special you are, how beautiful your heart is, and how effortlessly you make the
                world around you brighter. You deserve every beautiful thing this life has to
                offer: endless happiness, peaceful days, exciting dreams, and love that never
                makes you question your worth.
              </p>

              <p>
                On your birthday, I wish you a year full of reasons to smile, moments that take
                your breath away, dreams coming true, and memories you&apos;ll keep close to your
                heart. I hope I get to be beside you through the little moments and the big ones,
                supporting you, making you laugh, and reminding you every day how loved you are.
              </p>

              <p>
                Thank you for being you. Thank you for coming into my life and making it sweeter,
                warmer, and more beautiful. If I could choose one person to find in every
                lifetime, I would still choose you. In every version of this world, in every
                season, and in every October.
              </p>

              <p>
                Happy birthday, my sunshine. Keep shining, keep smiling, and never forget that you
                are one of the most precious parts of my life. I am so lucky to love you.
              </p>

              <h2 className="pt-4 text-center text-[30px] font-semibold text-[#f5b2c7] sm:text-[36px]">
                I LOVE YOU, CHAHD. ❤️
              </h2>

              <p className="text-center text-base font-medium text-[#ffc1d4]">
                Today, tomorrow, and always.
              </p>
            </article>
          </section>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.alt}
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#12040c]/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightboxPhoto(null)}
            aria-label="Close photo preview"
            className="fixed top-5 right-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#eaa4bd]/50 bg-[#2a0c1d] text-[#fff0f4] transition hover:bg-[#541b37] focus-visible:outline-2 focus-visible:outline-[#ffc1d4]"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxPhoto.src}
            alt={lightboxPhoto.alt}
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl border-2 border-[#eaa4bd]/70 object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
