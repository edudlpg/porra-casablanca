import type { Match, Round } from "@prisma/client";

type MatchVenueLike = Pick<Match, "venueName" | "venueCity"> & {
  round: Pick<Round, "name">;
};

export function formatMatchVenue(match: MatchVenueLike) {
  const venueParts = [match.venueName, match.venueCity].filter(Boolean);

  if (venueParts.length) {
    return venueParts.join(", ");
  }

  return match.round.name;
}
