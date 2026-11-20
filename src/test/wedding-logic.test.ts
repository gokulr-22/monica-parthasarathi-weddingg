import { describe, expect, it } from "vitest";
import { wedding, type WeddingEvent } from "@/config/wedding";
import {
  buildIcs,
  galleryCategories,
  getCountdownState,
  googleCalendarUrl,
  isEventComplete,
  visibleEvents,
  whatsappUrl,
} from "@/lib/wedding-logic";

const WEDDING_START = "2026-12-14T06:00:00+05:30";
const text = { title: "Parthasarathi & Monica Wedding Ceremony", description: "d", location: "Bhavani Mahal Thirumana Mandapam" };
const weddingEvent = wedding.events.find((e) => e.id === "wedding")!;

describe("countdown", () => {
  it("targets 14 December 2026 at 6:00 AM IST (00:30 UTC)", () => {
    expect(getCountdownState(Date.parse("2026-12-13T00:30:00Z"), WEDDING_START)).toEqual({
      status: "counting",
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it("shows 'today' once the ceremony starts on the wedding day in IST", () => {
    expect(getCountdownState(Date.parse("2026-12-14T00:30:00Z"), WEDDING_START).status).toBe("today");
    // 11:00 PM IST on 14 Dec is still the wedding day
    expect(getCountdownState(Date.parse("2026-12-14T17:30:00Z"), WEDDING_START).status).toBe("today");
  });

  it("shows 'past' from 15 December IST and never a negative countdown", () => {
    expect(getCountdownState(Date.parse("2026-12-14T18:31:00Z"), WEDDING_START).status).toBe("past");
  });
});

describe("events", () => {
  it("lists the reception (13 Dec) before the wedding (14 Dec)", () => {
    expect(visibleEvents(wedding.events).map((e) => e.id)).toEqual(["reception", "wedding"]);
  });

  it("hides an event with missing details or placeholder text", () => {
    const { mapsUrl: _m, ...noMap } = weddingEvent;
    expect(isEventComplete(noMap as WeddingEvent)).toBe(false);
    expect(isEventComplete({ ...weddingEvent, dateLabel: { en: "[ADD RECEPTION DATE]", ta: "" } })).toBe(false);
    expect(visibleEvents([noMap])).toEqual([]);
  });
});

describe("calendar", () => {
  it("Google Calendar link uses 6:00–7:30 AM IST", () => {
    const url = new URL(googleCalendarUrl(weddingEvent, text));
    expect(url.searchParams.get("dates")).toBe("20261214T003000Z/20261214T020000Z");
    expect(url.searchParams.get("ctz")).toBe("Asia/Kolkata");
  });

  it(".ics file has the right times and an early reminder", () => {
    const ics = buildIcs(weddingEvent, text, Date.parse("2026-11-20T00:00:00Z"));
    expect(ics).toContain("DTSTART:20261214T003000Z");
    expect(ics).toContain("DTEND:20261214T020000Z");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics).toContain("SUMMARY:Parthasarathi & Monica Wedding Ceremony");
  });
});

describe("whatsapp blessings", () => {
  it("sends to +91 8825479037 with the message", () => {
    expect(whatsappUrl(wedding.whatsappNumber, "Congratulations!")).toBe("https://wa.me/918825479037?text=Congratulations!");
  });
  it("is hidden when no number is configured", () => {
    expect(whatsappUrl("", "hi")).toBeNull();
  });
});

describe("gallery", () => {
  it("only shows categories that have photos", () => {
    const p = { src: "a.jpg", alt: { en: "a", ta: "a" }, width: 1, height: 1 };
    expect(galleryCategories([{ ...p, category: "family" }])).toEqual(["family"]);
    expect(galleryCategories([])).toEqual([]);
  });
});
