/**
 * Stand-in for next/image in unit tests: a plain <img>, so tests don't need Next's image loader.
 * Use with: vi.mock("next/image", () => import("@/test/next-image-mock"));
 */
type Props = { src: string | { src: string }; alt: string; className?: string };

export default function Image({ src, alt, className }: Props) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={typeof src === "string" ? src : src.src} alt={alt} className={className} />;
}
