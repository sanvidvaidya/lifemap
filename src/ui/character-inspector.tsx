import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw, X, ZoomIn } from 'lucide-react';
import { cameraViewBox } from './atlas-camera';
import { useAtlasCamera } from './use-atlas-camera';
import { portraitAsset } from './portrait-assets';

export function CharacterInspector({ src, name }: { src: string; name: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className="inspect-character" onClick={() => setOpen(true)}><ZoomIn /> Inspect character</button>
    {open && <PortraitDialog src={src} name={name} onClose={() => setOpen(false)} />}
  </>;
}

function PortraitDialog({ src, name, onClose }: { src: string; name: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { svgRef, camera, handlers, zoomBy, reset } = useAtlasCamera(true, 'slice');
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    <dialog ref={dialogRef} className="portrait-inspector" aria-label={`Inspect ${name}`} onClose={onClose}>
      <header><strong>{name}</strong><button type="button" onClick={onClose} aria-label="Close character inspection"><X /></button></header>
      <p>Pinch to zoom and drag to explore your character.</p>
      <svg ref={svgRef} className="portrait-inspector-art" viewBox={cameraViewBox(camera)} preserveAspectRatio="xMidYMid slice" {...handlers} aria-label={name}>
        <title>{name}</title>
        <image href={portraitAsset(src, 512)} x="217" y="5" width="326" height="490" preserveAspectRatio="xMidYMid meet" />
      </svg>
      <div className="portrait-inspector-controls" aria-label="Character zoom controls">
        <button type="button" onClick={() => zoomBy(-0.25)} disabled={camera.zoom <= 1} aria-label="Zoom out of character"><Minus /></button>
        <output aria-live="polite">{Math.round(camera.zoom * 100)}%</output>
        <button type="button" onClick={() => zoomBy(0.25)} disabled={camera.zoom >= 3} aria-label="Zoom into character"><Plus /></button>
        <button type="button" onClick={reset} disabled={camera.zoom === 1} aria-label="Reset character zoom"><RotateCcw /></button>
      </div>
    </dialog>
  );
}
