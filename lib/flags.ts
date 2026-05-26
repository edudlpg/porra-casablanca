const FLAG_CODE_PATTERN = /\/([a-z]{2}(?:-[a-z]{3})?)\.(?:svg|png|jpe?g|webp)(?:\?.*)?$/i;

const SUBDIVISION_FLAGS: Record<string, string> = {
  "gb-eng": createSubdivisionFlag("gbeng"),
  "gb-sct": createSubdivisionFlag("gbsct"),
  "gb-wls": createSubdivisionFlag("gbwls"),
};

function createSubdivisionFlag(tag: string) {
  return String.fromCodePoint(
    0x1f3f4,
    ...tag.split("").map((character) => 0xe0000 + character.charCodeAt(0)),
    0xe007f,
  );
}

export function extractFlagCode(flagUrl?: string | null) {
  if (!flagUrl) {
    return null;
  }

  const match = flagUrl.match(FLAG_CODE_PATTERN);

  return match?.[1]?.toLowerCase() ?? null;
}

export function getDisplayFlagUrl(flagUrl?: string | null, width = 80) {
  const flagCode = extractFlagCode(flagUrl);

  if (!flagCode) {
    return flagUrl ?? null;
  }

  return `https://flagcdn.com/w${width}/${flagCode}.png`;
}

export function getLocalFlagUrl(flagUrl?: string | null) {
  const flagCode = extractFlagCode(flagUrl);

  if (!flagCode) {
    return null;
  }

  return `/flags/${flagCode}.png`;
}

export function getFlagEmoji(flagUrl?: string | null) {
  const flagCode = extractFlagCode(flagUrl);

  if (!flagCode) {
    return null;
  }

  if (flagCode in SUBDIVISION_FLAGS) {
    return SUBDIVISION_FLAGS[flagCode];
  }

  if (!/^[a-z]{2}$/.test(flagCode)) {
    return null;
  }

  return String.fromCodePoint(
    ...flagCode
      .toUpperCase()
      .split("")
      .map((character) => 0x1f1e6 + character.charCodeAt(0) - 65),
  );
}
