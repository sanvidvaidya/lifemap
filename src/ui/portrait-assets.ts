import { useSyncExternalStore } from 'react';

const query = '(max-width: 800px), (pointer: coarse)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const compactSnapshot = () => window.matchMedia(query).matches;

export const useCompactGraphics = () =>
  useSyncExternalStore(subscribe, compactSnapshot, () => false);

export function portraitAsset(src: string, width: 160 | 512) {
  return src.replace(/\.png$/, `-${width}.webp`);
}
