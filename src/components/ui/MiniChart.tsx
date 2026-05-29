"use client";

import { resolveDeltaTone } from "@/lib/chart-theme";
import { ChartFrame } from "@/components/charts/ChartPrimitives";
import { FinanceLineChart } from "@/components/charts/FinanceLineChart";

export function MiniChart({ values }: { values: number[] }) {
  const diff = values.length > 0 ? values[values.length - 1] - values[0] : 0;
  const tone = resolveDeltaTone(diff);

  return (
    <ChartFrame className="px-1 py-2 sm:px-2 sm:py-3">
      <div className="relative h-52 w-full sm:h-56">
        <FinanceLineChart
          values={values}
          tone={tone}
          formatValue={(value) => value.toLocaleString("id-ID")}
          tooltipLabel="IDR Rate"
          compact
          showLastPrice={false}
          className="h-full"
        />
      </div>
    </ChartFrame>
  );
}
