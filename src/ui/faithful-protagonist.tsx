/* oxlint-disable next/no-img-element -- Local transparent character art is the authoritative visual source. */
import type { CSSProperties, PointerEvent } from 'react';

import { CHARACTER_BIBLE_BY_ID } from '../character-bible';
import type { CharacterArchetypeId } from '../types';

type FaithfulProtagonistProps = {
  archetypeId: CharacterArchetypeId;
  fallbackSrc: string;
  evolutionTier?: number;
  className?: string;
  label?: string;
};

type PortraitStyle = CSSProperties & {
  '--faithful-accent': string;
  '--faithful-secondary': string;
  '--faithful-tilt-x': string;
  '--faithful-tilt-y': string;
  '--faithful-light-x': string;
  '--faithful-light-y': string;
};

export function FaithfulProtagonist({
  archetypeId,
  fallbackSrc,
  evolutionTier = 1,
  className = '',
  label,
}: FaithfulProtagonistProps) {
  const entry = CHARACTER_BIBLE_BY_ID[archetypeId];
  const style: PortraitStyle = {
    '--faithful-accent': entry.palette[0],
    '--faithful-secondary': entry.palette[1],
    '--faithful-tilt-x': '0deg',
    '--faithful-tilt-y': '0deg',
    '--faithful-light-x': '50%',
    '--faithful-light-y': '32%',
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / Math.max(1, bounds.width);
    const y = (event.clientY - bounds.top) / Math.max(1, bounds.height);
    event.currentTarget.style.setProperty(
      '--faithful-tilt-x',
      `${(x - 0.5) * 5}deg`,
    );
    event.currentTarget.style.setProperty(
      '--faithful-tilt-y',
      `${(0.5 - y) * 3}deg`,
    );
    event.currentTarget.style.setProperty('--faithful-light-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--faithful-light-y', `${y * 100}%`);
  };

  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--faithful-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--faithful-tilt-y', '0deg');
    event.currentTarget.style.setProperty('--faithful-light-x', '50%');
    event.currentTarget.style.setProperty('--faithful-light-y', '32%');
  };

  return (
    <div
      className={['faithful-protagonist', className].filter(Boolean).join(' ')}
      data-archetype={archetypeId}
      data-tier={evolutionTier}
      role={label ? 'img' : undefined}
      aria-label={label}
      style={style}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <span className="faithful-protagonist-aura" aria-hidden="true" />
      <span className="faithful-protagonist-ground" aria-hidden="true" />
      <img
        src={fallbackSrc}
        alt=""
        className="faithful-protagonist-shadow"
        aria-hidden="true"
      />
      <img
        src={fallbackSrc}
        alt=""
        className="faithful-protagonist-art"
        aria-hidden="true"
      />
      <span className="faithful-protagonist-light" aria-hidden="true" />
    </div>
  );
}
