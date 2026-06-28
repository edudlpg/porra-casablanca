export function getBracketSlotDisplayName(slotLabel: string | null, teamName: string) {
  if (!slotLabel) {
    return teamName;
  }

  return slotLabel === teamName ? slotLabel : teamName;
}
