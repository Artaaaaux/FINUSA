"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ChartTone } from "@/lib/chart-theme";
import { createChart, AreaSeries, type IChartApi, type ISeriesApi, type Time, type LineData, ColorType, CrosshairMode, LineStyle } from "lightweight-charts";

export type FinanceLineChartProps = {
  values: number[];
  labels?: string[];
  tone: ChartTone;
  formatValue?: (value: number) => string;
  tooltipLabel?: string;
  tooltipSubValue?: (index: number) => string | undefined;
  tooltipChange?: (index: number) => { text: string; tone: "positive" | "negative" | "neutral" } | undefined;
  showLastPrice?: boolean;
  showXLabels?: boolean;
  compact?: boolean;
  viewWidth?: number;
  viewHeight?: number;
  className?: string;
};

// Read CSS variables from the document
function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Map ChartTone to the correct chart CSS token group
function resolveLineColor(tone: ChartTone): { line: string; areaTop: string; areaBottom: string } {
  if (tone === "positive") {
    return {
      line: getCSSVar("--chart-positive-line"),
      areaTop: getCSSVar("--chart-positive-area-top"),
      areaBottom: getCSSVar("--chart-positive-area-bottom"),
    };
  }
  if (tone === "negative") {
    return {
      line: getCSSVar("--chart-negative-line"),
      areaTop: getCSSVar("--chart-negative-area-top"),
      areaBottom: getCSSVar("--chart-negative-area-bottom"),
    };
  }
  return {
    line: getCSSVar("--chart-neutral-line"),
    areaTop: getCSSVar("--chart-neutral-area-top"),
    areaBottom: getCSSVar("--chart-neutral-area-bottom"),
  };
}

// Build TradingView chart options from current CSS tokens
function buildChartOptions(compact: boolean) {
  const gridColor = getCSSVar("--chart-grid");
  const axisColor = getCSSVar("--chart-axis");
  const axisLabel = getCSSVar("--chart-axis-label");
  const crosshairColor = getCSSVar("--chart-crosshair");

  return {
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: axisLabel,
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSize: 11,
    },
    grid: {
      vertLines: { color: compact ? "transparent" : gridColor, style: LineStyle.Dotted },
      horzLines: { color: compact ? "transparent" : gridColor, style: LineStyle.Dotted },
    },
    crosshair: {
      mode: compact ? CrosshairMode.Hidden : CrosshairMode.Magnet,
      vertLine: { color: crosshairColor, width: 1 as const, style: LineStyle.Dotted, labelVisible: false },
      horzLine: { color: crosshairColor, width: 1 as const, style: LineStyle.Dotted, labelVisible: !compact },
    },
    rightPriceScale: {
      visible: !compact,
      borderColor: axisColor,
      textColor: axisLabel,
      scaleMargins: { top: 0.08, bottom: 0.08 },
    },
    leftPriceScale: { visible: false },
    timeScale: {
      visible: !compact,
      borderColor: axisColor,
      textColor: axisLabel,
      fixLeftEdge: true,
      fixRightEdge: true,
      lockVisibleTimeRangeOnResize: true,
    },
    handleScroll: false,
    handleScale: false,
  };
}

// Build series data from values + labels
function buildSeriesData(values: number[], labels?: string[]): LineData[] {
  return values.map((value, i) => {
    // TradingView requires a time field. Use labels as date strings or synthetic timestamps.
    const rawLabel = labels?.[i];
    let time: string;

    if (rawLabel && /^\d{4}-\d{2}-\d{2}$/.test(rawLabel)) {
      // Already a valid YYYY-MM-DD date
      time = rawLabel;
    } else {
      // Synthetic: spread points across last N days
      const base = new Date();
      base.setDate(base.getDate() - (values.length - 1 - i));
      time = base.toISOString().split("T")[0];
    }

    return { time: time as LineData["time"], value };
  });
}

export function FinanceLineChart({
  values,
  labels,
  tone,
  formatValue = (v) => v.toLocaleString("id-ID"),
  tooltipLabel = "Price",
  tooltipSubValue,
  tooltipChange,
  showLastPrice = true,
  compact = false,
  className = "",
}: FinanceLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area", Time> | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Apply current theme tokens to chart + series
  const applyTheme = useCallback(() => {
    if (!chartRef.current || !seriesRef.current) return;
    const colors = resolveLineColor(tone);
    const options = buildChartOptions(compact);

    chartRef.current.applyOptions(options);

    seriesRef.current.applyOptions({
      lineColor: colors.line,
      topColor: colors.areaTop + "33",   // ~20% opacity
      bottomColor: colors.areaBottom + "00", // transparent
      lineWidth: compact ? 1 : 2,
      priceLineVisible: showLastPrice,
      priceLineColor: colors.line,
      priceLineWidth: 1,
      lastValueVisible: showLastPrice && !compact,
      crosshairMarkerVisible: !compact,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: colors.line,
      crosshairMarkerBackgroundColor: getCSSVar("--chart-dot-fill") || "#fff",
    });
  }, [tone, compact, showLastPrice]);

  // Initialize chart on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...buildChartOptions(compact),
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    const colors = resolveLineColor(tone);

    const series = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      topColor: colors.areaTop + "33",
      bottomColor: colors.areaBottom + "00",
      lineWidth: compact ? 1 : 2,
      priceLineVisible: showLastPrice,
      priceLineColor: colors.line,
      priceLineWidth: 1,
      lastValueVisible: showLastPrice && !compact,
      crosshairMarkerVisible: !compact,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: colors.line,
      crosshairMarkerBackgroundColor: getCSSVar("--chart-dot-fill") || "#fff",
    });

    const data = buildSeriesData(values, labels);
    series.setData(data);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    // Tooltip on crosshair move
    if (!compact && tooltipRef.current) {
      chart.subscribeCrosshairMove((param) => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
          tooltip.style.display = "none";
          return;
        }

        const seriesData = param.seriesData.get(series);
        if (!seriesData || !("value" in seriesData)) {
          tooltip.style.display = "none";
          return;
        }

        const pointValue = (seriesData as { value: number }).value;
        const idx = data.findIndex((d) => d.time === param.time);
        const changeData = idx !== -1 && tooltipChange ? tooltipChange(idx) : undefined;
        const subVal = idx !== -1 && tooltipSubValue ? tooltipSubValue(idx) : undefined;

        // Build label — use the time string as label if no currency label
        const dateStr = typeof param.time === "string" ? param.time : "";
        const labelText = labels?.[idx] ? `${labels[idx]}/IDR` : (tooltipLabel || dateStr);

        tooltip.innerHTML = `
          <div class="finusa-tv-tooltip">
            <p class="finusa-tv-tooltip__label">${labelText}</p>
            <p class="finusa-tv-tooltip__value">${formatValue(pointValue)}</p>
            ${subVal ? `<p class="finusa-tv-tooltip__sub">${subVal}</p>` : ""}
            ${changeData ? `<p class="finusa-tv-tooltip__change finusa-tv-tooltip__change--${changeData.tone}">${changeData.text}</p>` : ""}
          </div>
        `;

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        // Position tooltip: prefer left side, clamp to container
        const tooltipWidth = 150;
        let left = param.point.x + 12;
        if (left + tooltipWidth > containerRect.width) left = param.point.x - tooltipWidth - 12;
        tooltip.style.left = `${Math.max(4, left)}px`;
        tooltip.style.top = `${Math.max(4, param.point.y - 40)}px`;
        tooltip.style.display = "block";
      });
    }

    // MutationObserver — react to data-theme toggle
    const mo = new MutationObserver(() => {
      // Small delay so CSS vars are updated before we read them
      requestAnimationFrame(() => applyTheme());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    observerRef.current = mo;

    // ResizeObserver — responsive canvas
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        chart.applyOptions({ width, height });
        chart.timeScale().fitContent();
      }
    });
    ro.observe(containerRef.current);
    resizeObserverRef.current = ro;

    return () => {
      mo.disconnect();
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply data + theme when props change
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    const data = buildSeriesData(values, labels);
    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
    applyTheme();
  }, [values, labels, applyTheme]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* TradingView canvas container */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Floating HTML tooltip */}
      {!compact && (
        <div
          ref={tooltipRef}
          style={{ display: "none", position: "absolute", pointerEvents: "none", zIndex: 10 }}
        />
      )}

      {/* Tooltip styles injected inline to avoid external CSS dependency */}
      <style>{`
        .finusa-tv-tooltip {
          background: var(--chart-tooltip-bg);
          border: 1px solid var(--chart-tooltip-border);
          box-shadow: var(--chart-tooltip-shadow);
          border-radius: 8px;
          padding: 8px 10px;
          min-width: 120px;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }
        .finusa-tv-tooltip__label {
          font-size: 10px;
          color: var(--text-3);
          margin: 0 0 2px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .finusa-tv-tooltip__value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-1);
          margin: 0 0 2px;
        }
        .finusa-tv-tooltip__sub {
          font-size: 11px;
          color: var(--text-2);
          margin: 0 0 2px;
        }
        .finusa-tv-tooltip__change {
          font-size: 11px;
          font-weight: 500;
          margin: 0;
        }
        .finusa-tv-tooltip__change--positive { color: var(--chart-positive-line); }
        .finusa-tv-tooltip__change--negative { color: var(--chart-negative-line); }
        .finusa-tv-tooltip__change--neutral  { color: var(--chart-neutral-line); }
      `}</style>
    </div>
  );
}
