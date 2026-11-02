/**
 * The current year, for the copyright line.
 *
 * With Cache Components, Next.js refuses `new Date()` in a page that is built ahead of time,
 * because the value would differ from one render to the next. `"use cache"` tells it to compute
 * the year once and keep it with the page. It's updated whenever the site is rebuilt
 * (every deployment), which is more than often enough for a year.
 */
export async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
