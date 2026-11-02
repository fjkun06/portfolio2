type PlaceholderProps = {
  /** What will go here, e.g. "Screenshot: homepage". Shown in brackets and read by screen readers. */
  label: string;
  /** CSS aspect ratio, e.g. "16 / 9". */
  ratio: string;
  radius?: number;
  className?: string;
};

/**
 * Striped stand-in for an image that hasn't been supplied yet (Herzog screenshots…).
 * Replace each one with a real <Image> once the file exists.
 */
export function Placeholder({ label, ratio, radius = 0, className = "" }: PlaceholderProps) {
  return (
    <span
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`placeholder text-[15px] ${className}`}
      style={{ aspectRatio: ratio, borderRadius: radius }}
    >
      [{label}]
    </span>
  );
}
