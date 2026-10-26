"use client";

import { useEffect, useRef, useState } from "react";

// Tipos mínimos del Spotify iFrame API (https://developer.spotify.com/documentation/embeds)
type PlaybackUpdate = { data: { isPaused: boolean; isBuffering: boolean } };
type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  addListener: (event: "playback_update" | "ready", cb: (e: PlaybackUpdate) => void) => void;
  destroy: () => void;
};
type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: string; height: number },
    cb: (controller: EmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __spotifyIframeApi?: IFrameAPI;
  }
}

const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";

function loadApi(): Promise<IFrameAPI> {
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi);
  return new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      resolve(api);
    };
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

function start(controller: EmbedController, spotifyId: string) {
  controller.loadUri(`spotify:track:${spotifyId}`);
  controller.play();
}

/** Si Spotify no responde en este tiempo, se asume que algo lo bloqueó */
const LOAD_TIMEOUT_MS = 10_000;

export type PlayerStatus = "loading" | "ready" | "blocked";

/** Monta el reproductor de Spotify en `mountRef` y expone si está sonando. */
export function useSpotifyPlayer(initialId: string) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  // Canción pedida antes de que el reproductor estuviera listo: se reproduce al estarlo
  const pendingRef = useRef<string | null>(null);
  const readyRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>("loading");

  useEffect(() => {
    if (!initialId || !mountRef.current) return;
    let cancelled = false;
    const el = mountRef.current;
    const timeout = window.setTimeout(() => {
      if (!readyRef.current) setStatus("blocked");
    }, LOAD_TIMEOUT_MS);

    loadApi().then((api) => {
      if (cancelled) return;
      api.createController(el, { uri: `spotify:track:${initialId}`, width: "100%", height: 80 }, (controller) => {
        controllerRef.current = controller;
        controller.addListener("ready", () => {
          readyRef.current = true;
          setStatus("ready");
          const pending = pendingRef.current;
          if (pending) {
            pendingRef.current = null;
            start(controller, pending);
          }
        });
        controller.addListener("playback_update", (e) => setIsPlaying(!e.data.isPaused));
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      readyRef.current = false;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
    // El reproductor se crea una sola vez; después se cambia de canción con play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function play(spotifyId: string) {
    if (!spotifyId) return;
    const controller = controllerRef.current;
    if (controller && readyRef.current) start(controller, spotifyId);
    else pendingRef.current = spotifyId;
  }

  function toggle(spotifyId: string) {
    const controller = controllerRef.current;
    if (controller && readyRef.current) controller.togglePlay();
    else pendingRef.current = spotifyId;
  }

  return { mountRef, isPlaying, status, play, toggle };
}
