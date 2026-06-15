import { useEffect, useRef, useState } from 'react';
import { GripVertical, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

function Checkerboard() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)),linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05))] bg-[length:20px_20px] bg-[0_0,10px_10px]"
    />
  );
}

export default function BeforeAfterSlider({
  before,
  after,
  alt = 'Comparison',
  beforeLabel = 'Before',
  afterLabel = 'After'
}) {
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef(null);

  const shift = (amount) => {
    setValue((current) => Math.min(100, Math.max(0, current + amount)));
  };

  const updateFromClientX = (clientX) => {
    const frame = frameRef.current;

    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, next)));
  };

  useEffect(() => {
    if (!dragging) return undefined;

    const handleMove = (event) => updateFromClientX(event.clientX);
    const handleUp = () => setDragging(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>

      <div
        ref={frameRef}
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted/20 shadow-sm select-none',
          dragging && 'cursor-ew-resize'
        )}
        onPointerDown={(event) => {
          if (!after) return;
          event.preventDefault();
          updateFromClientX(event.clientX);
          setDragging(true);
        }}
      >
        <Checkerboard />

        {before ? (
          <img
            src={before}
            alt={`${alt} before`}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : null}

        {after && after !== before ? (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          >
            <img
              src={after}
              alt={`${alt} after`}
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}

        <div
          className="absolute inset-y-0 z-10 w-px bg-primary/80 shadow-[0_0_0_1px_hsl(var(--background))]"
          style={{ left: `${value}%` }}
        />

        <div
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${value}%` }}
        >
          <div className="flex h-12 w-12 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background/95 shadow-lg backdrop-blur">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          {value}% {afterLabel}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon" onClick={() => shift(-10)} aria-label="Move slider left">
          <Minus size={16} />
        </Button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            onPointerDown={() => setDragging(true)}
            className={cn(
              'h-2 w-full cursor-ew-resize appearance-none rounded-full bg-muted outline-none',
              '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md',
              '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-border [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-md'
            )}
          />
        </div>

        <Button type="button" variant="outline" size="icon" onClick={() => shift(10)} aria-label="Move slider right">
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}
