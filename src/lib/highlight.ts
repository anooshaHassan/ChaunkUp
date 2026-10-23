export type RedFlag = { phrase: string; reason: string };

type Segment = {
  text: string;
  highlighted: boolean;
};

type Range = { start: number; end: number };

type Normalized = { text: string; map: number[] };

const variantMap: Record<string, string> = {
  "\u0643": "\u06a9",
  "\u064a": "\u06cc",
  "\u0623": "\u0627",
  "\u0625": "\u0627",
  "\u0622": "\u0627",
  "\u0629": "\u06c1",
  "\u0647": "\u06c1",
  "\u06be": "\u06c1",
  "\u0624": "\u0648",
  "\u0626": "\u06cc",
  "\u06d2": "\u06cc",
  "\u06ba": "\u0646",
};

function baseChar(char: string): string {
  return variantMap[char] ?? char;
}

function isDiacritic(char: string): boolean {
  return /\p{Mn}/u.test(char);
}

function isIgnored(char: string): boolean {
  return /[\p{P}\p{S}\s]/u.test(char);
}

function normalizeDigits(char: string): string {
  const code = char.codePointAt(0) ?? 0;
  if (code >= 0x0660 && code <= 0x0669) {
    return String.fromCodePoint(code - 0x0660 + 0x0030);
  }
  if (code >= 0x06f0 && code <= 0x06f9) {
    return String.fromCodePoint(code - 0x06f0 + 0x0030);
  }
  return char;
}

function normalize(text: string): Normalized {
  const normalizedText: string[] = [];
  const map: number[] = [];

  for (let i = 0; i < text.length; ) {
    const code = text.codePointAt(i) ?? 0;
    const size = code > 0xffff ? 2 : 1;
    const char = String.fromCodePoint(code);
    const replaced = baseChar(char);
    const decomposed = replaced.normalize("NFKD");

    for (const part of decomposed) {
      if (isDiacritic(part)) continue;
      if (isIgnored(part)) continue;
      normalizedText.push(normalizeDigits(part).toLowerCase());
      map.push(i);
    }

    i += size;
  }

  return { text: normalizedText.join(""), map };
}

function splitWords(original: string): { word: string; start: number; end: number; norm: string }[] {
  const words: { word: string; start: number; end: number; norm: string }[] = [];
  const regex = /[\p{L}\p{N}]+/gu;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(original)) !== null) {
    words.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
      norm: normalize(match[0]).text,
    });
  }
  return words;
}

function exactRanges(normalized: Normalized, phraseNorm: string): Range[] {
  const ranges: Range[] = [];
  if (!phraseNorm || phraseNorm.length > normalized.text.length) return ranges;

  let from = 0;
  let index = normalized.text.indexOf(phraseNorm, from);
  while (index !== -1) {
    const start = normalized.map[index];
    const endCharIndex = normalized.map[index + phraseNorm.length - 1];
    ranges.push({ start, end: endCharIndex + 1 });
    from = index + 1;
    index = normalized.text.indexOf(phraseNorm, from);
  }

  return ranges;
}

function longestCommonWordRanges(text: string, phrase: string): Range[] {
  const textWords = splitWords(text);
  const phraseWords = splitWords(phrase);
  if (textWords.length === 0 || phraseWords.length === 0) return [];

  let bestLength = 0;
  let bestTextStart = -1;

  for (let ti = 0; ti < textWords.length; ti++) {
    for (let pi = 0; pi < phraseWords.length; pi++) {
      let length = 0;
      while (
        ti + length < textWords.length &&
        pi + length < phraseWords.length &&
        textWords[ti + length].norm === phraseWords[pi + length].norm
      ) {
        length++;
      }
      if (length > bestLength) {
        bestLength = length;
        bestTextStart = ti;
      }
    }
  }

  if (bestLength === 0) return [];

  const first = textWords[bestTextStart];
  const last = textWords[bestTextStart + bestLength - 1];
  return [{ start: first.start, end: last.end }];
}

export function highlightRedFlags(text: string, redFlags: RedFlag[]): Segment[] {
  if (!text || redFlags.length === 0) {
    return [{ text, highlighted: false }];
  }

  const normalized = normalize(text);
  const flags = redFlags
    .map((f) => f.phrase.trim())
    .filter((p) => p.length > 0)
    .sort((a, b) => b.length - a.length);

  const ranges: Range[] = [];

  for (const phrase of flags) {
    const phraseNorm = normalize(phrase).text;
    if (!phraseNorm) continue;

    const matched = exactRanges(normalized, phraseNorm);
    if (matched.length > 0) {
      ranges.push(...matched);
    } else {
      const fallback = longestCommonWordRanges(text, phrase);
      if (fallback.length > 0) {
        ranges.push(...fallback);
      }
    }
  }

  if (ranges.length === 0) {
    return [{ text, highlighted: false }];
  }

  ranges.sort((a, b) => a.start - b.start || b.end - a.end);

  const merged: Range[] = [];
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
