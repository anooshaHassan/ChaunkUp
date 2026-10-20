export type RedFlag = { phrase: string; reason: string };

type Segment = {
  text: string;
  highlighted: boolean;
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightRedFlags(text: string, redFlags: RedFlag[]): Segment[] {
  if (!text || redFlags.length === 0) {
    return [{ text, highlighted: false }];
  }

  const flags = redFlags
    .map((f) => f.phrase.trim())
    .filter((p) => p.length > 0)
    .sort((a, b) => b.length - a.length);

  const ranges: { start: number; end: number }[] = [];

  for (const phrase of flags) {
    const regex = new RegExp(escapeRegExp(phrase), "gi");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }
  }

  if (ranges.length === 0) {
    return [{ text, highlighted: false }];
  }

  ranges.sort((a, b) => a.start - b.start || b.end - a.end);

  const merged: { start: number; end: number }[] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  const segments: Segment[] = [];
  let cursor = 0;
  for (const range of merged) {
    if (range.start > cursor) {
      segments.push({ text: text.slice(cursor, range.start), highlighted: false });
    }
    segments.push({ text: text.slice(range.start, range.end), highlighted: true });
    cursor = range.end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false });
  }

  return segments;
}
