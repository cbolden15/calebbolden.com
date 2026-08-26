import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteMockup from "./SiteMockup";

export const metadata: Metadata = {
  title: "Shot Makers League relaunch plan | Caleb Bolden",
  description: "A phased plan to relaunch Shot Makers League online.",
  robots: { index: false, follow: false },
};

const phases = [
  {
    number: "01",
    name: "Launch",
    price: "$X,XXX–$X,XXX one-time",
    summary: "The public face of the relaunch, built to take money on day one.",
    items: [
      "Website with event schedule, event pages, and media",
      "Online registration with card payment at checkout",
      "Public shooter leaderboard that persists across events",
    ],
  },
  {
    number: "02",
    name: "Own your audience",
    price: "$XXX–$XXX/mo",
    summary: "Every registrant becomes a contact you can reach without Facebook.",
    items: [
      "CRM that captures every registrant automatically",
      "Text and email event reminders, sent without you touching anything",
      "A blast to the whole list every time a new event opens",
    ],
  },
  {
    number: "03",
    name: "Grow",
    price: "Custom",
    summary: "Once the machine works, point more people at it.",
    items: [
      "Sponsor one-pager for pitching local businesses",
      "Event clips packaged for social",
      "AI assistant on the site answering questions any hour",
    ],
  },
];

export default function ShotMakersLeaguePage() {
  return (
    <main className="min-h-screen bg-[#141412] font-[family-name:var(--font-schibsted)] text-[#F5F1E8]">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        {/* 1. Hero */}
        <header>
          <Image
            src="/clients/shot-makers-league/logo.png"
            alt="Shot Makers League logo"
            width={120}
            height={97}
            priority
          />
          <p className="mt-8 font-[family-name:var(--font-martian)] text-xs uppercase tracking-[0.25em] text-[#E8833A]">
            Prepared for Rob
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-archivo)] text-4xl font-black uppercase leading-none sm:text-5xl">
            The relaunch plan for
            <br />
            <span className="text-[#E8833A]">Shot Makers League</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#B9B3A4]">
            You built something people showed up for. The relaunch is about
            making it something people follow: a league with a season, a
            leaderboard, and an audience you own.
          </p>
        </header>

        {/* 2. Mockup */}
        <section className="mt-16">
          <SiteMockup />
          <p className="mt-3 text-center font-[family-name:var(--font-martian)] text-xs text-[#B9B3A4]">
            A rough sketch of what shotmakersleague.com could be. We shape the
            real thing together.
          </p>
        </section>

        {/* 3. Roadmap */}
        <section className="mt-20">
          <h2 className="font-[family-name:var(--font-archivo)] text-2xl font-black uppercase">
            Three phases
          </h2>
          <div className="mt-8 space-y-6">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="rounded-xl border border-white/10 bg-[#1E1E1C] p-6 sm:p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[family-name:var(--font-archivo)] text-xl font-bold uppercase">
                    <span className="mr-3 font-[family-name:var(--font-martian)] text-base font-normal text-[#E8833A]">
                      {phase.number}
                    </span>
                    {phase.name}
                  </h3>
                  <span className="whitespace-nowrap font-[family-name:var(--font-martian)] text-sm text-[#E8833A]">
                    {phase.price}
                  </span>
                </div>
                <p className="mt-3 text-[#B9B3A4]">{phase.summary}</p>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span aria-hidden className="text-[#E8833A]">
                        →
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Why this order */}
        <section className="mt-20">
          <h2 className="font-[family-name:var(--font-archivo)] text-2xl font-black uppercase">
            Why this order
          </h2>
          <div className="mt-6 space-y-4 text-[#B9B3A4]">
            <p>
              The leaderboard comes first because it turns one-off events into a
            season. Shooters come back to defend a ranking.
            </p>
            <p>
              The contact list comes second because right now the audience
              lives on Facebook, which means Facebook decides who sees you.
              After phase two, you decide.
            </p>
            <p>
              Growth comes last because sponsors and content only pay off once
              registration, reminders, and rankings run on their own.
            </p>
          </div>
        </section>

        {/* 5. Who I am */}
        <section className="mt-20">
          <h2 className="font-[family-name:var(--font-archivo)] text-2xl font-black uppercase">
            Who I am
          </h2>
          <p className="mt-6 text-[#B9B3A4]">
            I&apos;m Caleb Bolden. I build websites and the systems behind them
            for small businesses, including the CRM platform that would power
            your phase two. You can see how I work at{" "}
            <Link href="/" className="text-[#E8833A] underline underline-offset-4">
              calebbolden.com
            </Link>{" "}
            and what I&apos;ve built at{" "}
            <Link
              href="/work"
              className="text-[#E8833A] underline underline-offset-4"
            >
              calebbolden.com/work
            </Link>
            .
          </p>
        </section>

        {/* 6. CTA */}
        <section className="mt-20 rounded-xl border border-[#E8833A]/40 bg-[#1E1E1C] p-8 text-center">
          <h2 className="font-[family-name:var(--font-archivo)] text-3xl font-black uppercase">
            Ready when you are, Rob
          </h2>
          <p className="mt-4 text-[#B9B3A4]">
            Text me, or grab a time and we&apos;ll walk through it together.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-md bg-[#E8833A] px-8 py-3 font-[family-name:var(--font-archivo)] font-bold uppercase tracking-wide text-[#141412]"
          >
            Book a call
          </Link>
        </section>
      </div>
    </main>
  );
}
