import type { NewsSentiment } from "@/types/economy";

const sentimentStyle: Record<NewsSentiment, string> = {
  positive: "border-emerald-200/80 bg-emerald-50 text-emerald dark:border-emerald-400/30 dark:bg-emerald-500/20",
  neutral: "border-slate-200/80 bg-slate-50 text-slate-600 dark:border-slate-400/30 dark:bg-slate-500/20 dark:text-slate-200",
  negative: "border-red-200/80 bg-red-50 text-negative dark:border-red-400/30 dark:bg-red-500/20",
};

const sentimentLabel: Record<NewsSentiment, string> = {
  positive: "Positif",
  neutral: "Netral",
  negative: "Negatif",
};

export function SentimentBadge({ sentiment }: { sentiment: NewsSentiment }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${sentimentStyle[sentiment]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {sentimentLabel[sentiment]}
    </span>
  );
}
