'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { bandToList, type BandKey } from '@/lib/social/band-list';

type Answer = 'yes' | 'sometimes' | 'no';

type Question = {
  id: number;
  text: string;
};

type Section = {
  key: string;
  title: string;
  note?: string;
  questions: Question[];
};

const sections: Section[] = [
  {
    key: 'dataAndSystems',
    title: 'data and systems',
    questions: [
      { id: 1, text: 'Is your customer and job information in one place, rather than scattered across email, texts, spreadsheets, and paper?' },
      { id: 2, text: 'Could you pull a clean list of your last 12 months of customers or jobs in under 10 minutes?' },
      { id: 3, text: 'Do you avoid typing the same customer information into more than one system?' },
      { id: 4, text: "Could a new hire find a past customer's history without asking a coworker?" },
    ],
  },
  {
    key: 'processDocumentation',
    title: 'process documentation',
    questions: [
      { id: 5, text: 'If you were out sick for a week, could someone run your busiest process from written instructions alone?' },
      { id: 6, text: "Do your 3 most common tasks have a written step-by-step, rather than living in someone's head?" },
      { id: 7, text: 'When a mistake happens, can you point to the exact step where it went wrong?' },
      { id: 8, text: 'Does your team do the same task the same way regardless of who is doing it?' },
    ],
  },
  {
    key: 'repetitionAndVolume',
    title: 'repetition and volume',
    note: 'In this section "yes" scores points, because repetitive volume is what makes automation worth the money.',
    questions: [
      { id: 9, text: 'Is there a task you or your team does more than 5 times a week that feels repetitive?' },
      { id: 10, text: 'Does someone spend more than 2 hours a week on data entry or copy-pasting between systems?' },
      { id: 11, text: 'Do you answer certain customer questions with nearly identical wording every time?' },
    ],
  },
  {
    key: 'teamAndBuyIn',
    title: 'team and buy-in',
    questions: [
      { id: 12, text: 'Would your staff try a new tool if it saved them time, rather than resisting any change?' },
      { id: 13, text: 'Is there at least one person besides you who would champion a new tool internally?' },
      { id: 14, text: 'When your team suggests a shortcut or tool, does it get a real follow-up?' },
    ],
  },
  {
    key: 'budgetAndFocus',
    title: 'budget and focus',
    questions: [
      { id: 15, text: 'Could you set aside $100 to $300 a month to test a tool that saved 5+ hours a week?' },
      { id: 16, text: 'Can you name ONE specific task you want help with, rather than "we should use AI"?' },
      { id: 17, text: 'If you have abandoned a tool before, do you know why it did not stick?' },
      { id: 18, text: 'Do you know roughly what an hour of your own time is worth to the business?' },
    ],
  },
];

const options: { value: Answer; label: string; points: number }[] = [
  { value: 'yes', label: 'Yes', points: 2 },
  { value: 'sometimes', label: 'Sometimes', points: 1 },
  { value: 'no', label: 'No', points: 0 },
];

const bandContent: Record<BandKey, { title: string; teaser: string; guidance: string }> = {
  foundations: {
    title: 'Foundations first',
    teaser: 'Do not buy an AI tool this quarter. There is a cheaper move that has to come first.',
    guidance: 'Your money is better spent getting customer data into one place and writing down how your top two processes actually work. This is not a setback; businesses that skip this step are the ones that feed the failure statistics. Most software project failures trace to people and process, not the platform. Start with the one-hour process audit, then reassess. I will also look at your answers myself and reply if I see something worth flagging.',
  },
  pilot: {
    title: 'Ready for one pilot',
    teaser: 'You have enough structure to automate one thing, and only one. Picking the right one is the whole game.',
    guidance: 'Look at your repetition answers: whichever task came up as most repetitive is your pilot. Keep a person reviewing the output for the first month, and resist rolling out three tools at once. The adoption gap (76% using AI, 14% integrated) is made of businesses that scaled before one thing worked. I will also look at your answers myself and reply if I see something worth flagging.',
  },
  sequence: {
    title: 'Ready to sequence',
    teaser: 'Readiness is not your problem. Ordering is.',
    guidance: 'Your data, processes, and team can support AI across several workflows. Your risk is ordering: which automation first, which measurements prove it worked, and when to add the next one. This is where a process-first plan pays for itself, because at your level the wins compound. I will also look at your answers myself and reply if I see something worth flagging.',
  },
};

function scoreAnswer(answer: Answer | undefined) {
  return options.find((option) => option.value === answer)?.points ?? 0;
}

function getBand(total: number): BandKey {
  if (total <= 14) return 'foundations';
  if (total <= 26) return 'pilot';
  return 'sequence';
}

export default function ReadinessScorecard() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === 18;

  const sectionTotals = useMemo(() => {
    return sections.reduce<Record<string, number>>((acc, section) => {
      acc[section.key] = section.questions.reduce((sectionTotal, question) => {
        return sectionTotal + scoreAnswer(answers[question.id]);
      }, 0);
      return acc;
    }, {});
  }, [answers]);

  const total = useMemo(() => {
    return Object.values(sectionTotals).reduce((sum, value) => sum + value, 0);
  }, [sectionTotals]);

  const band = bandContent[getBand(total)];

  function handleScoreSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allAnswered) return;
    setShowResult(true);
    window.setTimeout(() => resultRef.current?.scrollIntoView({ block: 'start' }), 0);
  }

  async function handleGateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);

    // Tracks which of the two fetches below is in flight, so the shared catch
    // can name the one that threw.
    let subscribeStarted = false;

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magnet: 'ai-readiness',
          email,
          name: name.trim() || undefined,
          payload: { total, bands: sectionTotals },
        }),
      });

      if (!response.ok) {
        console.error('Lead magnet capture failed:', response.status);
      }

      const bandKey = getBand(total);

      subscribeStarted = true;
      const subscribeResponse = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          list: bandToList(bandKey),
          source: 'ai-readiness',
          band: bandKey,
        }),
      });

      if (!subscribeResponse.ok) {
        console.error('List subscribe failed:', subscribeResponse.status);
      }
    } catch (err) {
      // Either fetch above can throw, so name which one actually did.
      const failed = subscribeStarted ? 'List subscribe' : 'Lead magnet capture';
      console.error(`${failed} threw:`, err);
    } finally {
      setIsSending(false);
      setShowGuidance(true);
    }
  }

  return (
    <div>
      <form onSubmit={handleScoreSubmit}>
        <div>
          {sections.map((section, sectionIndex) => (
            <section key={section.key} className={sectionIndex > 0 ? 'mt-12' : undefined}>
              <div className="mb-5">
                <p className="anno anno-blue">
                  section {sectionIndex + 1} · {section.title}
                </p>
                {section.note ? (
                  <p className="mt-3 max-w-2xl" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                    {section.note}
                  </p>
                ) : null}
              </div>

              <div>
                {section.questions.map((question) => (
                  <fieldset
                    key={question.id}
                    className="grid grid-cols-1 gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-center"
                    style={{ borderTop: '1px solid var(--color-hairline)' }}
                  >
                    <legend className="max-w-3xl" style={{ fontSize: 15.5, lineHeight: 1.55, color: 'var(--color-ink)' }}>
                      {question.id}. {question.text}
                    </legend>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={`Question ${question.id}`}>
                      {options.map((option) => {
                        const selected = answers[question.id] === option.value;
                        return (
                          <label key={option.value} className="cursor-pointer">
                            <input
                              className="peer sr-only"
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.value}
                              checked={selected}
                              onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                            />
                            <span
                              className="block rounded-[2px] px-3 py-2 text-center transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-blue)]"
                              style={{
                                border: selected ? '1px solid var(--color-blue)' : '1px solid var(--color-hairline)',
                                color: selected ? 'var(--color-blue)' : 'var(--color-ink-muted)',
                                background: selected ? 'var(--color-blue-wash)' : 'var(--color-bg)',
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn-ink btn-roll disabled:cursor-not-allowed disabled:opacity-45" disabled={!allAnswered}>
            <span className="roll-box">
              <span className="roll-a">See my score</span>
              <span className="roll-b" aria-hidden="true">
                See my score
              </span>
            </span>
          </button>
          <p className="anno">
            {answeredCount} of 18 answered
          </p>
        </div>
      </form>

      {showResult ? (
        <div
          ref={resultRef}
          className="mt-12 rounded-[2px] p-6 sm:p-8"
          style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
            <p className="type-display" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
              {total} / 36
            </p>
            <div>
              <h2 className="type-display" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                {band.title}
              </h2>
              <p className="mt-3 max-w-2xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                {band.teaser}
              </p>
            </div>
          </div>

          {showGuidance ? (
            <div className="mt-7">
              <p className="max-w-3xl" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-ink)' }}>
                {band.guidance}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link href="/contact" className="btn-ink btn-roll">
                  <span className="roll-box">
                    <span className="roll-a">Talk it through</span>
                    <span className="roll-b" aria-hidden="true">
                      Talk it through
                    </span>
                  </span>
                </Link>
                <Link href="/resources" className="link-draw" style={{ fontSize: 14.5, color: 'var(--color-blue)' }}>
                  More free tools
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGateSubmit} className="mt-7">
              <p className="mb-4 max-w-2xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                Enter your email and I will show your full read-out here, including what I would do first at your score.
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <label className="sr-only" htmlFor="readiness-email">
                  Email
                </label>
                <input
                  id="readiness-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@business.com"
                  className="min-w-0 rounded-[2px] border bg-white px-4 py-3 text-[14.5px] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-blue)]"
                  style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-ink)' }}
                />
                <label className="sr-only" htmlFor="readiness-name">
                  Name
                </label>
                <input
                  id="readiness-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name (optional)"
                  className="min-w-0 rounded-[2px] border bg-white px-4 py-3 text-[14.5px] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-blue)]"
                  style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-ink)' }}
                />
                <button type="submit" className="btn-ink btn-roll disabled:cursor-wait disabled:opacity-55" disabled={isSending}>
                  <span className="roll-box">
                    <span className="roll-a">Get my full read-out</span>
                    <span className="roll-b" aria-hidden="true">
                      Get my full read-out
                    </span>
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
