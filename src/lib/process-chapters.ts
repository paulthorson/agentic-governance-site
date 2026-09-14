/**
 * Process Instrument chapters — land copy sells how the loop works.
 * Drill-downs are past-tense micro-stories (not scoreboards).
 * SoT: AG #39 MERGED LIVE @ 3e8de677 (craft CLEAR @ 4d4e4d7).
 */

export type ProcessChapterId =
  | 'research'
  | 'brief'
  | 'stills'
  | 'challenge'
  | 'ship'
  | 'recap'
  | 'next';

export type ProcessChapter = {
  id: ProcessChapterId;
  number: string;
  title: string;
  blurb: string;
  /** Past-tense micro-story for hover / inspect panels. */
  story: string;
  /** Optional inspect headline (F3). */
  inspectTitle?: string;
  inspectLabel?: string;
};

export const PROCESS_CHAPTERS: ProcessChapter[] = [
  {
    id: 'research',
    number: '01',
    title: 'Research',
    blurb: 'Find what matters before a brief exists.',
    story: 'Research mapped the open questions before a brief went out.',
  },
  {
    id: 'brief',
    number: '02',
    title: 'Brief',
    blurb: 'Turn findings into a job the loop can hold.',
    story: 'A brief went out. The loop had a job it could hold.',
  },
  {
    id: 'stills',
    number: '03',
    title: 'Stills',
    blurb: 'Show the work before it ships.',
    story:
      'Design made stills for the brief. A challenge came back before anything shipped.',
    inspectTitle: 'What Design did',
    inspectLabel: 'CHAPTER 03 · DESIGN',
  },
  {
    id: 'challenge',
    number: '04',
    title: 'Challenge',
    blurb: 'Pressure the stills until they hold.',
    story: 'A challenge came back. The stills held under pressure.',
  },
  {
    id: 'ship',
    number: '05',
    title: 'Ship',
    blurb: 'Put an update on the board.',
    story: 'An update made it onto the board.',
  },
  {
    id: 'recap',
    number: '06',
    title: 'Recap',
    blurb: 'Close the week with what landed.',
    story: 'Recap closed the week with what landed.',
  },
  {
    id: 'next',
    number: '07',
    title: 'Next',
    blurb: 'Keep the loop open for unpaid work.',
    story: 'Next kept the loop open for unpaid work.',
  },
];

/** Measured ship toast — count must stay measured (never invent). */
export function shipToastBody(measuredShipsThisWeek: number): string {
  const n = measuredShipsThisWeek;
  const countWord =
    n === 1 ? 'one' : n === 2 ? 'two' : n === 3 ? 'three' : String(n);
  return `An update made it onto the board. That's ${countWord} this week.`;
}

export const LAND_EYEBROW = 'HOW THE LOOP WORKS';
export const LAND_HEADLINE = 'The loop is how work ships.';
export const LAND_LEDE =
  'See the loop. Govern the work. Ship only what clears.';

export const GET_AG_URL =
  'https://github.com/paulthorson/agentic-governance';
