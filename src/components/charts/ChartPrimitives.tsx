import type { ReactNode } from "react";
import type { ChartPalette } from "@/lib/chart-theme";
import { CHART_DOT, CHART_GRID, CHART_LINE } from "@/lib/chart-theme";

export function ChartFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-[var(--card-border-soft)] bg-[var(--chart-surface)] ${className}`}>
      {children}
    </div>
  );
}

export function ChartTooltip({
  label,
  value,
  subValue,
  change,
  changeTone,
  className = "",
}: {
  label: string;
  value: string;
  subValue?: string;
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  className?: string;
}) {
  const changeClass =
    changeTone === "positive"
      ? "text-emerald"
      : changeTone === "negative"
        ? "text-negative"
        : "text-[var(--text-2)]";

  return (
    <div
      className={`pointer-events-none z-20 min-w-[120px] rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-2 shadow-[var(--chart-tooltip-shadow)] backdrop-blur-sm ${className}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-3)]">{label}</p>
      <p className="mt-0.5 text-base font-semibold tabular-nums tracking-tight text-[var(--text-1)]">{value}</p>
      {(subValue || change) && (
        <div className="mt-1 flex items-center gap-2">
          {subValue && <p className="text-[11px] tabular-nums text-[var(--text-2)]">{subValue}</p>}
          {change && <p className={`text-[11px] font-medium tabular-nums ${changeClass}`}>{change}</p>}
        </div>
      )}
    </div>
  );
}

export function ChartHorizontalGrid({
  lines,
  x1,
  x2,
}: {
  lines: number[];
  x1: number;
  x2: number;
}) {
  return (
    <>
      {lines.map((y) => (
        <line
          key={y}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={CHART_GRID.color}
          strokeWidth={CHART_GRID.lineWidth}
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
}

export function ChartAxis({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={CHART_GRID.axisColor}
      strokeWidth={CHART_GRID.axisWidth}
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function ChartYAxisLabels({
  ticks,
  labels,
  plotLeft,
  formatY,
}: {
  ticks: number[];
  labels: string[];
  plotLeft: number;
  formatY: (value: number) => number;
}) {
  return (
    <>
      {ticks.map((tick, index) => (
        <text
          key={tick}
          x={plotLeft - 6}
          y={formatY(tick) + 3.5}
          textAnchor="end"
          fontSize="10"
          fill="var(--chart-axis-label)"
          className="select-none font-medium tabular-nums text-[10px]"
        >
          {labels[index]}
        </text>
      ))}
      <line
        x1={plotLeft}
        y1={formatY(ticks[0])}
        x2={plotLeft}
        y2={formatY(ticks[ticks.length - 1])}
        stroke="var(--chart-axis)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
}

export function ChartXAxisLabels({
  points,
  plotBottom,
}: {
  points: Array<{ x: number; label?: string }>;
  plotBottom: number;
}) {
  return (
    <>
      {points.map((point, index) =>
        point.label ? (
          <text
            key={`${point.label}-${index}`}
            x={point.x}
            y={plotBottom + 16}
            textAnchor="middle"
            fontSize="10"
            fill="var(--chart-axis-label)"
            className="select-none font-medium text-[10px]"
          >
            {point.label}
          </text>
        ) : null,
      )}
    </>
  );
}

export function ChartAreaFill({ d, gradientId }: { d: string; gradientId: string }) {
  return <path d={d} fill={`url(#${gradientId})`} />;
}

export function ChartLine({
  d,
  palette,
  compact = false,
}: {
  d: string;
  palette: ChartPalette;
  compact?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={palette.line}
      strokeWidth={compact ? CHART_LINE.widthCompact : CHART_LINE.width}
      strokeLinecap={CHART_LINE.cap}
      strokeLinejoin={CHART_LINE.join}
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function ChartCrosshair({
  x,
  y1,
  y2,
  active,
}: {
  x: number;
  y1: number;
  y2: number;
  active: boolean;
}) {
  if (!active) return null;

  return (
    <line
      x1={x}
      y1={y1}
      x2={x}
      y2={y2}
      stroke="var(--chart-crosshair)"
      strokeWidth={1}
      strokeDasharray="4 3"
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function ChartLastPriceLine({
  y,
  x1,
  x2,
  label,
  palette,
}: {
  y: number;
  x1: number;
  x2: number;
  label: string;
  palette: ChartPalette;
}) {
  const badgeWidth = label.length * 5.8 + 10;

  return (
    <>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={palette.line}
        strokeWidth={1}
        strokeDasharray="5 4"
        strokeOpacity={0.55}
        vectorEffect="non-scaling-stroke"
      />
      <rect x={x2 - 2} y={y - 9} width={badgeWidth} height={18} rx={4} fill={palette.line} opacity={0.92} />
      <text
        x={x2 + 3}
        y={y + 3.5}
        fontSize="9.5"
        fill="var(--chart-last-price-text)"
        className="select-none font-medium tabular-nums"
      >
        {label}
      </text>
    </>
  );
}

export function ChartActivePoint({
  cx,
  cy,
  palette,
  compact = false,
}: {
  cx: number;
  cy: number;
  palette: ChartPalette;
  compact?: boolean;
}) {
  const radius = compact ? CHART_DOT.radiusActiveCompact : CHART_DOT.radiusActive;
  const halo = compact ? CHART_DOT.haloRadius - 1 : CHART_DOT.haloRadius;

  return (
    <>
      <circle cx={cx} cy={cy} r={halo} fill={palette.dot} fillOpacity={0.18} stroke="none" />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="var(--chart-dot-fill)"
        stroke={palette.dot}
        strokeWidth={CHART_DOT.strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
}

export function ChartPoint({
  cx,
  cy,
  palette,
  active = false,
  compact = false,
}: {
  cx: number;
  cy: number;
  palette: ChartPalette;
  active?: boolean;
  compact?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  if (!active) return null;
  return <ChartActivePoint cx={cx} cy={cy} palette={palette} compact={compact} />;
}

export function ChartHoverOverlay({
  plotLeft,
  plotRight,
  plotTop,
  plotBottom,
  onMove,
  onLeave,
}: {
  plotLeft: number;
  plotRight: number;
  plotTop: number;
  plotBottom: number;
  onMove: (clientX: number, svgRect: DOMRect) => void;
  onLeave: () => void;
}) {
  return (
    <rect
      x={plotLeft}
      y={plotTop}
      width={plotRight - plotLeft}
      height={plotBottom - plotTop}
      fill="transparent"
      onMouseMove={(event) => {
        const svg = event.currentTarget.ownerSVGElement;
        if (!svg) return;
        onMove(event.clientX, svg.getBoundingClientRect());
      }}
      onMouseLeave={onLeave}
    />
  );
}

export function ChartGradientDefs({ id, palette }: { id: string; palette: ChartPalette }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={palette.areaTop} stopOpacity="0.07" />
        <stop offset="65%" stopColor={palette.areaTop} stopOpacity="0.01" />
        <stop offset="100%" stopColor={palette.areaBottom} stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}
