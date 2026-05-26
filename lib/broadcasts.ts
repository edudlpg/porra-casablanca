import type { BroadcastPartner } from "@prisma/client";

function fixtureKey(homeTeam: string, awayTeam: string) {
  return [homeTeam, awayTeam].sort((left, right) => left.localeCompare(right, "es")).join("|||");
}

const rtveFixtureKeys = new Set<string>([
  fixtureKey("México", "Sudáfrica"),
  fixtureKey("Canadá", "Bosnia y Herzegovina"),
  fixtureKey("Brasil", "Marruecos"),
  fixtureKey("Alemania", "Curazao"),
  fixtureKey("España", "Cabo Verde"),
  fixtureKey("Francia", "Senegal"),
  fixtureKey("Inglaterra", "Croacia"),
  fixtureKey("Suiza", "Bosnia y Herzegovina"),
  fixtureKey("Estados Unidos", "Australia"),
  fixtureKey("Países Bajos", "Suecia"),
  fixtureKey("España", "Arabia Saudí"),
  fixtureKey("Argentina", "Austria"),
  fixtureKey("Inglaterra", "Ghana"),
  fixtureKey("Brasil", "Escocia"),
  fixtureKey("Ecuador", "Alemania"),
  fixtureKey("Uruguay", "España"),
  fixtureKey("Colombia", "Portugal"),
]);

export function getDefaultBroadcastForTeams(homeTeam: string, awayTeam: string): BroadcastPartner {
  return rtveFixtureKeys.has(fixtureKey(homeTeam, awayTeam)) ? "RTVE" : "DAZN";
}

export const broadcastLogoByPartner: Record<BroadcastPartner, { alt: string; src: string }> = {
  DAZN: {
    alt: "DAZN",
    src: "/images/dazn-logo.svg",
  },
  RTVE: {
    alt: "RTVE",
    src: "/images/rtve-logo.svg",
  },
};
