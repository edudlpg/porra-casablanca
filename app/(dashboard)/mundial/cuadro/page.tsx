import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { CardCornerGraphic } from "@/components/ui/card-corner-graphic";
import { Card, CardContent } from "@/components/ui/card";
import { getCachedKnockoutBracketMatches } from "@/lib/data-cache";
import { getDisplayFlagUrl, getFlagEmoji } from "@/lib/flags";
import { getBracketSlotDisplayName } from "@/lib/knockout-bracket";
import { cn } from "@/lib/utils";

const bracketRounds = [
  "Dieciseisavos de final",
  "Octavos de final",
  "Cuartos de final",
  "Semifinales",
  "Tercer puesto",
  "Final",
] as const;

type BracketRoundName = (typeof bracketRounds)[number];

const bracketMatchOrderByRound: Record<BracketRoundName, string[]> = {
  "Dieciseisavos de final": [
    "1º Grupo E|||3º Grupo A/B/C/D/F",
    "1º Grupo I|||3º Grupo C/D/F/G/H",
    "2º Grupo A|||2º Grupo B",
    "1º Grupo F|||2º Grupo C",
    "2º Grupo K|||2º Grupo L",
    "1º Grupo H|||2º Grupo J",
    "1º Grupo D|||3º Grupo B/E/F/I/J",
    "1º Grupo G|||3º Grupo A/E/H/I/J",
    "1º Grupo C|||2º Grupo F",
    "2º Grupo E|||2º Grupo I",
    "1º Grupo A|||3º Grupo C/E/F/H/I",
    "1º Grupo L|||3º Grupo E/H/I/J/K",
    "1º Grupo J|||2º Grupo H",
    "2º Grupo D|||2º Grupo G",
    "1º Grupo B|||3º Grupo E/F/G/I/J",
    "1º Grupo K|||3º Grupo D/E/I/J/L",
  ],
  "Octavos de final": [
    "Ganador Partido 74|||Ganador Partido 77",
    "Ganador Partido 73|||Ganador Partido 75",
    "Ganador Partido 83|||Ganador Partido 84",
    "Ganador Partido 81|||Ganador Partido 82",
    "Ganador Partido 76|||Ganador Partido 78",
    "Ganador Partido 79|||Ganador Partido 80",
    "Ganador Partido 86|||Ganador Partido 88",
    "Ganador Partido 85|||Ganador Partido 87",
  ],
  "Cuartos de final": [
    "Ganador Partido 89|||Ganador Partido 90",
    "Ganador Partido 93|||Ganador Partido 94",
    "Ganador Partido 91|||Ganador Partido 92",
    "Ganador Partido 95|||Ganador Partido 96",
  ],
  Semifinales: [
    "Ganador Partido 97|||Ganador Partido 98",
    "Ganador Partido 99|||Ganador Partido 100",
  ],
  "Tercer puesto": [
    "Perdedor Partido 101|||Perdedor Partido 102",
  ],
  Final: [
    "Ganador Partido 101|||Ganador Partido 102",
  ],
};

const bracketRoundLayouts = [
  "pt-0 gap-3",
  "pt-[94px] gap-[200px]",
  "pt-[282px] gap-[576px]",
  "pt-[658px] gap-[1328px]",
  "pt-[1410px] gap-[2832px]",
  "pt-[1410px] gap-[2832px]",
] as const;

type BracketTeam = {
  name: string;
  flagUrl: string | null;
};

function buildMatchOrderKey(homeSlotLabel: string | null, awaySlotLabel: string | null) {
  return `${homeSlotLabel ?? ""}|||${awaySlotLabel ?? ""}`;
}

function BracketTeamRow({
  slotLabel,
  team,
  side,
}: {
  slotLabel: string | null;
  team: BracketTeam;
  side: "home" | "away";
}) {
  const displayName = getBracketSlotDisplayName(slotLabel, team.name);
  const flagUrl = getDisplayFlagUrl(team.flagUrl, 40);
  const flagEmoji = getFlagEmoji(team.flagUrl);

  return (
    <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/70 bg-white/75 px-2.5 py-2 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.45)] backdrop-blur-[2px]">
      <div className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-slate-100 text-lg shadow-sm",
        side === "home" ? "ring-2 ring-emerald-100" : "ring-2 ring-sky-100",
      )}>
        {flagUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={flagUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span>{flagEmoji ?? "?"}</span>
        )}
      </div>
      <p className="min-w-0 flex-1 text-[0.82rem] font-semibold leading-snug text-slate-950">
        {displayName}
      </p>
    </div>
  );
}

export default async function WorldCupBracketPage() {
  const matches = await getCachedKnockoutBracketMatches();
  const matchesByRound = new Map<BracketRoundName, typeof matches>();

  for (const roundName of bracketRounds) {
    const matchOrder = bracketMatchOrderByRound[roundName];

    matchesByRound.set(
      roundName,
      [...matches.filter((match) => match.round.name === roundName)]
        .sort((firstMatch, secondMatch) => {
          const firstIndex = matchOrder.indexOf(
            buildMatchOrderKey(firstMatch.homeSlotLabel, firstMatch.awaySlotLabel),
          );
          const secondIndex = matchOrder.indexOf(
            buildMatchOrderKey(secondMatch.homeSlotLabel, secondMatch.awaySlotLabel),
          );

          return (
            (firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex) -
              (secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex) ||
            firstMatch.startsAt.getTime() - secondMatch.startsAt.getTime()
          );
        }),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mundial"
        title="Cuadro"
        description="Cruces de la fase final del Mundial 2026, de dieciseisavos a la final."
        action={<BackLink href="/mundial" />}
      />

      {matches.length ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-3">
          <div className="flex min-w-max gap-4">
            {bracketRounds.map((roundName, roundIndex) => {
              const roundMatches = matchesByRound.get(roundName) ?? [];
              const roundLayout = bracketRoundLayouts[roundIndex];

              return (
                <section key={roundName} className="w-64 shrink-0 space-y-3">
                  <div className="sticky left-0">
                    <p className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.7)]">
                      {roundName}
                    </p>
                  </div>

                  <div className={cn("flex flex-col", roundLayout)}>
                    {roundMatches.map((match, index) => (
                      <Card
                        key={match.id}
                        className="relative h-44 overflow-hidden border-white/70 bg-white/90 backdrop-blur"
                      >
                        <CardCornerGraphic variant="match" />
                        <CardContent className="relative z-10 space-y-2.5 p-3">
                          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Partido {index + 1}
                          </p>
                          <div className="space-y-1.5">
                            <BracketTeamRow
                              slotLabel={match.homeSlotLabel}
                              team={match.homeTeam}
                              side="home"
                            />
                            <p className="text-center text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                              vs
                            </p>
                            <BracketTeamRow
                              slotLabel={match.awaySlotLabel}
                              team={match.awayTeam}
                              side="away"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="Sin cuadro disponible"
          description="Todavía no hay partidos de eliminatorias para pintar el cuadro."
        />
      )}
    </div>
  );
}
