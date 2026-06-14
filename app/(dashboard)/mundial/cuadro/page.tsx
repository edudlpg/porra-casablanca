import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getCachedKnockoutBracketMatches } from "@/lib/data-cache";
import { cn } from "@/lib/utils";

const bracketRounds = [
  "Dieciseisavos de final",
  "Octavos de final",
  "Cuartos de final",
  "Semifinales",
  "Final",
] as const;

type BracketRoundName = (typeof bracketRounds)[number];

const bracketRoundLayouts = [
  "pt-0 gap-3",
  "pt-[86px] gap-[184px]",
  "pt-[258px] gap-[528px]",
  "pt-[602px] gap-[1216px]",
  "pt-[1290px] gap-[2592px]",
] as const;

function getSlotName(slotLabel: string | null, teamName: string) {
  return slotLabel ?? teamName;
}

export default async function WorldCupBracketPage() {
  const matches = await getCachedKnockoutBracketMatches();
  const matchesByRound = new Map<BracketRoundName, typeof matches>();

  for (const roundName of bracketRounds) {
    matchesByRound.set(
      roundName,
      matches.filter((match) => match.round.name === roundName),
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
                      <Card key={match.id} className="h-40 border-slate-200/80 bg-white">
                        <CardContent className="space-y-2 p-3">
                          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-400">
                            Partido {index + 1}
                          </p>
                          <div className="space-y-1.5">
                            <p className="rounded-2xl bg-slate-50 px-2.5 py-1.5 text-[0.82rem] font-semibold leading-snug text-slate-900">
                              {getSlotName(match.homeSlotLabel, match.homeTeam.name)}
                            </p>
                            <p className="text-center text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-400">
                              vs
                            </p>
                            <p className="rounded-2xl bg-slate-50 px-2.5 py-1.5 text-[0.82rem] font-semibold leading-snug text-slate-900">
                              {getSlotName(match.awaySlotLabel, match.awayTeam.name)}
                            </p>
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
