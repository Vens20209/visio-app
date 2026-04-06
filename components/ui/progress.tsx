export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-white/10">
      <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
    </div>
  );
}
