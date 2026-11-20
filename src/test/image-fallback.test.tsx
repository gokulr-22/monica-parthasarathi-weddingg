import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { Gallery } from "@/components/wedding/Gallery";
import { Hero } from "@/components/wedding/Hero";
import { I18nProvider } from "@/lib/i18n";
import type { GalleryPhoto } from "@/config/wedding";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const photo: GalleryPhoto = {
  src: "/does-not-exist.jpg",
  alt: { en: "The couple", ta: "தம்பதி" },
  category: "couple",
  width: 800,
  height: 1000,
};

function mount(node: ReactNode) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => createRoot(container).render(<I18nProvider>{node}</I18nProvider>));
  return container;
}

describe("image fallbacks", () => {
  it("shows an elegant placeholder when a gallery photo fails to load", () => {
    const container = mount(<Gallery photos={[photo]} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    act(() => {
      img!.dispatchEvent(new Event("error"));
    });
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector('[role="img"]')?.getAttribute("aria-label")).toContain("The couple");
  });

  it("renders the hero without any <img> element (all decoration is inline SVG)", () => {
    const container = mount(<Hero />);
    expect(container.querySelectorAll("img").length).toBe(0);
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(3);
  });
});
