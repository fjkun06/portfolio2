import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { servicesContent } from "@/content/services";
import { ledWidth } from "@/lib/led";

import { ROUTES, RouteNetwork } from "./RouteNetwork";
import { ServiceBlock } from "./ServiceBlock";
import { Always, Fares, Faq } from "./ServicesSections";

const t = servicesContent.en;
const codes = t.services.map((s) => s.code);

describe("<RouteNetwork>", () => {
  it("is one labelled picture with a route per service", () => {
    const { container } = render(<RouteNetwork codes={codes} label={t.mapLabel} />);
    expect(screen.getByRole("img", { name: t.mapLabel })).toBeInTheDocument();
    expect(ROUTES).toHaveLength(codes.length);
    for (const r of ROUTES) expect(container.querySelector(`path[d="${r.d}"]`)).not.toBeNull();
  });

  it("keeps every route code inside the 600 x 420 drawing", () => {
    ROUTES.forEach(({ label: [x, y] }, i) => {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x + ledWidth(codes[i], 3.4), codes[i]).toBeLessThanOrEqual(600);
      expect(y + 7 * 3.4, codes[i]).toBeLessThanOrEqual(420);
    });
  });
});

describe("<ServiceBlock>", () => {
  const service = t.services[0];
  const renderBlock = (example: { href: string; name: string } | null) =>
    render(<ServiceBlock service={service} index={0} total={4} text={t} example={example} />);

  it("can be linked to by its code and is named by its title", () => {
    renderBlock(null);
    const article = screen.getByRole("article", { name: service.title });
    expect(article).toHaveAttribute("id", service.code.toLowerCase());
    expect(screen.getByText("01 / 04")).toBeInTheDocument();
  });

  it("lists what's included and who it's good for", () => {
    renderBlock(null);
    for (const item of service.included) expect(screen.getByText(item)).toBeInTheDocument();
    for (const g of service.goodFor) expect(screen.getByText(g)).toBeInTheDocument();
  });

  it("links to an example project only when there is one", () => {
    const { unmount } = renderBlock(null);
    expect(screen.queryByRole("link")).toBeNull();
    unmount();
    renderBlock({ href: "/en/work/herzog", name: "HERZOG TRAD'" });
    expect(screen.getByRole("link", { name: /HERZOG TRAD'/ })).toHaveAttribute(
      "href",
      "/en/work/herzog",
    );
  });
});

describe("<Always>", () => {
  it("shows every included extra as a tile", () => {
    render(<Always text={t.always} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(t.always.titleText);
    expect(screen.getAllByRole("listitem")).toHaveLength(t.always.items.length);
    for (const item of t.always.items) expect(screen.getByText(item.title)).toBeInTheDocument();
  });
});

describe("<Fares>", () => {
  it("says in words what the LED sign shows, and lists what sets the price", () => {
    render(<Fares text={t.fares} />);
    expect(screen.getByText(t.fares.signText)).toBeInTheDocument();
    for (const [title, detail] of t.fares.factors) {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(detail)).toBeInTheDocument();
    }
  });
});

describe("<Faq>", () => {
  it("starts closed and opens a question on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<Faq text={t.faq} />);
    const rows = container.querySelectorAll("details");
    expect(rows).toHaveLength(t.faq.items.length);
    for (const row of rows) expect(row).not.toHaveAttribute("open");

    const [question] = t.faq.items[0];
    await user.click(screen.getByText(question));
    expect(rows[0]).toHaveAttribute("open");
    expect(within(rows[0] as HTMLElement).getByText(t.faq.items[0][1])).toBeVisible();
  });
});
