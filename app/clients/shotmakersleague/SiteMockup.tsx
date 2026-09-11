import Image from "next/image";

const leaders = [
  { rank: 1, name: "M. Carter", made: 47 },
  { rank: 2, name: "D. Reyes", made: 44 },
  { rank: 3, name: "J. Okafor", made: 41 },
  { rank: 4, name: "T. Nguyen", made: 39 },
  { rank: 5, name: "A. Brooks", made: 38 },
];

export default function SiteMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1E1E1C] shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#141412] px-4 py-3">
        <span aria-hidden className="h-3 w-3 rounded-full bg-white/15" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-white/15" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-white/15" />
        <span className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 font-[family-name:var(--font-martian)] text-xs text-[#B9B3A4]">
          shotmakersleague.com
        </span>
      </div>

      {/* Mock site nav */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/clients/shot-makers-league/logo.png"
            alt="Shot Makers League logo"
            width={36}
            height={29}
          />
          <span className="font-[family-name:var(--font-archivo)] text-sm font-bold tracking-wide text-[#F5F1E8]">
            SHOT MAKERS LEAGUE
          </span>
        </div>
        <div className="hidden gap-4 font-[family-name:var(--font-schibsted)] text-xs text-[#B9B3A4] sm:flex">
          <span>Events</span>
          <span>Leaderboard</span>
          <span>Media</span>
          <span className="rounded bg-[#E8833A] px-2 py-0.5 font-semibold text-[#141412]">
            Register
          </span>
        </div>
      </div>

      {/* Mock hero */}
      <div className="px-5 py-8 text-center sm:py-10">
        <p className="font-[family-name:var(--font-martian)] text-[10px] uppercase tracking-[0.2em] text-[#E8833A]">
          Next event · Saturday, Oct 3
        </p>
        <p className="mt-3 font-[family-name:var(--font-archivo)] text-2xl font-black uppercase leading-tight text-[#F5F1E8] sm:text-3xl">
          Who&apos;s the best shooter
          <br />
          in the city?
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 font-[family-name:var(--font-martian)] text-xs text-[#B9B3A4]">
          <span className="rounded bg-white/5 px-2 py-1">38 days</span>
          <span className="rounded bg-white/5 px-2 py-1">06 hrs</span>
          <span className="rounded bg-white/5 px-2 py-1">31 min</span>
        </div>
        <span className="mt-5 inline-block rounded-md bg-[#E8833A] px-6 py-2.5 font-[family-name:var(--font-archivo)] text-sm font-bold uppercase tracking-wide text-[#141412]">
          Claim your spot
        </span>
      </div>

      {/* Mock leaderboard strip */}
      <div className="border-t border-white/10 bg-[#141412] px-5 py-4">
        <p className="mb-2 font-[family-name:var(--font-martian)] text-[10px] uppercase tracking-[0.2em] text-[#B9B3A4]">
          Season leaderboard
        </p>
        <div className="space-y-1.5">
          {leaders.map((l) => (
            <div
              key={l.rank}
              className="flex items-center justify-between rounded bg-white/[0.03] px-3 py-1.5 font-[family-name:var(--font-schibsted)] text-xs text-[#F5F1E8]"
            >
              <span>
                <span className="mr-3 font-[family-name:var(--font-martian)] text-[#E8833A]">
                  {l.rank}
                </span>
                {l.name}
              </span>
              <span className="text-[#B9B3A4]">{l.made} makes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
