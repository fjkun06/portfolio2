import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InlineScript } from "./InlineScript";

describe("<InlineScript>", () => {
  it("keeps the code, but doesn't run it again in the browser", () => {
    const { container } = render(<InlineScript html="window.booted = true" />);
    const script = container.querySelector("script")!;
    expect(script.innerHTML).toBe("window.booted = true");
    // On the server it's text/javascript and runs while the page loads; here, plain text.
    expect(script).toHaveAttribute("type", "text/plain");
  });
});
