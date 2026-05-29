export type ChartTone = "positive" | "negative" | "neutral";

export type ChartPalette = {
  line: string;
  dot: string;
  areaTop: string;
  areaBottom: string;
};

export type ChartPoint = { x: number; y: number; value: number; label?: string };

export type ChartScale = {
  min: number;
  max: number;
  ticks: number[];
  tickLabels: string[];
};

export const CHART_LINE = {
  width: 1.75,
  widthCompact: 1.5,
  cap: "round" as const,
  join: "round" as const,
};

export const CHART_DOT = {
  radius: 0,
  radiusCompact: 0,
  radiusActive: 4,
  radiusActiveCompact: 3.5,
  strokeWidth: 2,
  haloRadius: 7,
};

export const CHART_GRID = {
  color: "var(--chart-grid)",
  axisColor: "var(--chart-axis)",
  lineWidth: 1,
  axisWidth: 1,
};

export const CHART_LAYOUT = {
  yAxisWidth: 52,
  padTop: 12,
  padBottom: 28,
  padRight: 8,
  gridCount: 5,
};

/** Straight line segments between data points */
export function buildLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  return path;
}

/** Monotone cubic spline — smooth curves like trading platforms */
export function buildSmoothLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return buildLinePath(points);

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

export function buildAreaPath(
  linePath: string,
  points: Array<{ x: number; y: number }>,
  baselineY: number,
): string {
  if (!linePath || points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function resolveDeltaTone(diff: number): ChartTone {
  if (diff < 0) return "positive";
  if (diff > 0) return "negative";
  return "neutral";
}

export function resolveMarketTone(status: string): ChartTone {
  if (status === "Bullish") return "positive";
  if (status === "Bearish") return "negative";
  return "neutral";
}

export function getChartPalette(tone: ChartTone): ChartPalette {
  const palettes: Record<ChartTone, ChartPalette> = {
    positive: {
      line: "var(--chart-positive-line)",
      dot: "var(--chart-positive-dot)",
      areaTop: "var(--chart-positive-area-top)",
      areaBottom: "var(--chart-positive-area-bottom)",
    },
    negative: {
      line: "var(--chart-negative-line)",
      dot: "var(--chart-negative-dot)",
      areaTop: "var(--chart-negative-area-top)",
      areaBottom: "var(--chart-negative-area-bottom)",
    },
    neutral: {
      line: "var(--chart-neutral-line)",
      dot: "var(--chart-neutral-dot)",
      areaTop: "var(--chart-neutral-area-top)",
      areaBottom: "var(--chart-neutral-area-bottom)",
    },
  };

  return palettes[tone];
}

export function getHorizontalGridLines(minY: number, maxY: number, count = 5): number[] {
  const step = (maxY - minY) / Math.max(1, count - 1);
  return Array.from({ length: count }, (_, i) => minY + step * i);
}

function niceStep(range: number, targetTicks: number): number {
  const rough = range / Math.max(1, targetTicks - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;

  let niceNormalized = 1;
  if (normalized <= 1.5) niceNormalized = 1;
  else if (normalized <= 3) niceNormalized = 2;
  else if (normalized <= 7) niceNormalized = 5;
  else niceNormalized = 10;

  return niceNormalized * magnitude;
}

export function computeValueScale(
  values: number[],
  tickCount = CHART_LAYOUT.gridCount,
  paddingRatio = 0.08,
): ChartScale {
  if (values.length === 0) {
    return { min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], tickLabels: ["0", "0.25", "0.5", "0.75", "1"] };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const rawRange = Math.max(rawMax - rawMin, rawMin * 0.001 || 1);
  const pad = rawRange * paddingRatio;
  const paddedMin = rawMin - pad;
  const paddedMax = rawMax + pad;
  const step = niceStep(paddedMax - paddedMin, tickCount);

  const min = Math.floor(paddedMin / step) * step;
  const max = Math.ceil(paddedMax / step) * step;

  const ticks: number[] = [];
  for (let v = min; v <= max + step * 0.001; v += step) {
    ticks.push(v);
  }

  return {
    min,
    max,
    ticks,
    tickLabels: ticks.map((tick) => formatChartValue(tick)),
  };
}

export function formatChartValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
  if (abs >= 1000) return value.toLocaleString("id-ID", { maximumFractionDigits: 0 });
  if (abs >= 100) return value.toLocaleString("id-ID", { maximumFractionDigits: 1 });
  if (abs >= 1) return value.toLocaleString("id-ID", { maximumFractionDigits: 2 });
  return value.toLocaleString("id-ID", { maximumFractionDigits: 4 });
}

export function valueToY(
  value: number,
  scale: ChartScale,
  plotTop: number,
  plotBottom: number,
): number {
  const range = Math.max(scale.max - scale.min, 1e-9);
  const ratio = (value - scale.min) / range;
  return plotBottom - ratio * (plotBottom - plotTop);
}

export function buildChartPoints(
  values: number[],
  labels: string[] | undefined,
  plotLeft: number,
  plotRight: number,
  plotTop: number,
  plotBottom: number,
  scale: ChartScale,
): ChartPoint[] {
  if (values.length === 0) return [];

  return values.map((value, index) => {
    const x =
      plotLeft +
      (index * (plotRight - plotLeft)) / Math.max(1, values.length - 1);
    const y = valueToY(value, scale, plotTop, plotBottom);
    return { x, y, value, label: labels?.[index] };
  });
}

export function nearestPointIndex(
  points: ChartPoint[],
  mouseX: number,
): number | null {
  if (points.length === 0) return null;

  let nearest = 0;
  let minDist = Math.abs(points[0].x - mouseX);

  for (let i = 1; i < points.length; i += 1) {
    const dist = Math.abs(points[i].x - mouseX);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }

  return nearest;
}
