"use client";

import Image from "next/image";
import { useState } from "react";
import { canciones } from "../data/canciones";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";

export function Tocadiscos() {
  const [current, setCurrent] = useState(canciones[0]);
  const { mountRef, isPlaying, status, play, toggle } = useSpotifyPlayer(current.spotifyId);
  const hasSpotify = canciones.some((c) => c.spotifyId);

  function choose(slug: string) {
    const next = canciones.find((c) => c.slug === slug);
    if (!next) return;
    if (next.slug === current.slug) {
      toggle(next.spotifyId);
      return;
    }
    setCurrent(next);
    play(next.spotifyId);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      {/* El tocadiscos */}
      <div>
        <div className="relative aspect-[5/4] rounded-2xl border border-line bg-deck shadow-[4px_4px_0_var(--line)]">
          <div className="absolute top-[10%] left-[8%] aspect-square w-[64%] rounded-full bg-[#2a2622] p-[1.5%]">
            <div
              className={`vinyl relative h-full w-full rounded-full ${isPlaying ? "is-playing" : ""}`}
              aria-hidden
            >
              <div className="absolute inset-[31%] overflow-hidden rounded-full border-4 border-[#16181c]">
                <Image src={current.cover} alt="" fill sizes="120px" className="object-cover" />
              </div>
              <div className="absolute inset-[48.5%] rounded-full bg-deck" />
            </div>
          </div>

          <svg viewBox="0 0 100 80" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="86" cy="14" r="5.5" fill="var(--surface)" stroke="var(--muted)" strokeWidth="0.6" />
            <g
              style={{
                transformOrigin: "86px 14px",
                transform: `rotate(${isPlaying ? 0 : -24}deg)`,
                transition: "transform 700ms ease",
              }}
            >
              <path
                d="M86 14 L84 50 L68 61"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="63" y="58.5" width="7" height="4.5" rx="1" fill="var(--text)" transform="rotate(-36 66.5 60.75)" />
            </g>
            <circle cx="86" cy="14" r="2" fill="var(--muted)" />
          </svg>

          <button
            type="button"
            onClick={() => toggle(current.spotifyId)}
            disabled={!current.spotifyId}
            className="absolute bottom-[5%] left-[4%] flex size-12 items-center justify-center rounded-full border border-line bg-bg text-text hover:border-accent hover:text-accent disabled:opacity-40"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor" aria-hidden>
                <path d="M7 5v14l12-7z" />
              </svg>
            )}
          </button>
        </div>

        <p className="mt-5 font-serif text-xl">
          {current.title} <span className="text-muted">— {current.artist}</span>
        </p>
        <p className="font-mono text-xs text-muted">{current.album}</p>

        <div className="mt-4 overflow-hidden rounded-xl">
          {hasSpotify ? (
            <>
              <div ref={mountRef} />
              {status === "blocked" && (
                <p role="status" className="mt-2 text-sm text-danger">
                  Spotify no cargó. Si tienes un bloqueador de anuncios o rastreadores, permite open.spotify.com en
                  esta página.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">El sonido llega pronto.</p>
          )}
        </div>
      </div>

      {/* La caja de vinilos */}
      <div>
        <ul className=" grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
          {canciones.map((song) => {
            const selected = song.slug === current.slug;
            return (
              <li key={song.slug}>
                <button
                  type="button"
                  onClick={() => choose(song.slug)}
                  aria-pressed={selected}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-[50/39]">
                    <div
                      aria-hidden
                      className={`vinyl-static absolute top-[4%] left-[2%] aspect-square w-[72%] rounded-full transition-transform duration-300 motion-reduce:transition-none ${
                        selected ? "translate-x-[34%]" : "group-hover:translate-x-[20%]"
                      }`}
                    />
                    <div
                      className={`relative h-full w-[78%] overflow-hidden rounded-md border ${
                        selected ? "border-accent" : "border-line"
                      } shadow-[3px_3px_0_var(--line)]`}
                    >
                      <Image src={song.cover} alt={`Portada de ${song.album}`} fill sizes="160px" className="object-cover" />
                    </div>
                  </div>
                  <span className={`mt-3 block font-serif leading-tight ${selected ? "text-accent" : ""}`}>
                    {song.title}
                  </span>
                  <span className="block text-sm text-muted">{song.artist}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
