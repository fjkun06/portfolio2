<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <what changed, imperative, lowercase>

<optional body: why, and anything a reviewer should know>
```

## Types

| Type       | Use it for                                                         |
| ---------- | ------------------------------------------------------------------ |
| `feat`     | Something a visitor can see or use: a page, a section, a feature   |
| `fix`      | A bug fix                                                          |
| `style`    | Visual tweaks with no change in behaviour (colours, spacing, type) |
| `refactor` | Code reorganised, same result for the visitor                      |
| `content`  | Texts, translations, images, project data                          |
| `perf`     | Faster loading or rendering                                        |
| `a11y`     | Accessibility improvements                                         |
| `seo`      | Metadata, sitemap, structured data                                 |
| `chore`    | Tooling, dependencies, config, housekeeping                        |
| `docs`     | README, AGENTS.md, comments only                                   |

## Scopes

Optional. Name the area that changed: `header`, `footer`, `home`, `work`, `project`, `services`, `process`, `about`, `contact`, `legal`, `i18n`, `led`, `theme`.

## Rules

- Subject line in the imperative ("add", not "added"), no full stop, at most 72 characters.
- One logical change per commit. A new page and an unrelated colour fix are two commits.
- Translations go in the same commit as the feature that needs them.
- A breaking change gets `!` after the type and a `BREAKING CHANGE:` line in the body.

## Examples

```
feat(home): add departures board and LED headline
fix(header): keep mode switch visible on narrow phones
content(i18n): translate services page into French and German
style(theme): darken unlit LED dots in light mode
chore: update next to 16.4.4
```
