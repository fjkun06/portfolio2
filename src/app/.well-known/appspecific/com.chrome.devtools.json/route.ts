/**
 * Chrome DevTools asks for this file on every page load while DevTools is open.
 * In development it gets the project folder, so DevTools can offer to edit the source files
 * directly (Sources → Workspace). Everywhere else it stays a plain 404.
 */
export function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }
  return Response.json({
    workspace: {
      root: process.cwd(),
      // Any fixed UUID works; it only has to stay the same between visits.
      uuid: "c97b938c-d168-44ed-a7ef-4cc640792393",
    },
  });
}
