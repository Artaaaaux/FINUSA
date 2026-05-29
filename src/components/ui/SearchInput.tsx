import { Search } from "lucide-react";

export function SearchInput({
  placeholder = "Cari...",
  value,
  onChange,
  onFocus,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
}) {
  return (
    <label className="relative flex-1">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={onFocus}
        className="h-11 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-3 text-sm text-[var(--text-1)] outline-none transition-all duration-300 placeholder:text-[var(--text-3)] focus:border-primary/50 focus:bg-[var(--card)]"
      />
    </label>
  );
}
