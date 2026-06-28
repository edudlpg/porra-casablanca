type TeamSeed = {
  name: string;
  flagUrl: string;
  groupCode: GroupCode;
};

export type GroupCode = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

type RoundSeed = {
  name: string;
  unlockAt: Date;
  startDate: Date;
  endDate: Date;
};

type FixtureSeed = {
  roundName: string;
  homeTeam: string;
  awayTeam: string;
  startsAt: Date;
};

type FixtureVenue = {
  venueName: string;
  venueCity: string;
};

function flagUrl(code: string) {
  return `https://flagcdn.com/${code}.svg`;
}

function etDate(date: string, time: string) {
  return new Date(`${date}T${time}:00-04:00`);
}

function zonedDate(date: string, time: string, utcOffset: string) {
  return new Date(`${date}T${time}:00${utcOffset}`);
}

function fixtureKey(homeTeam: string, awayTeam: string) {
  return `${homeTeam}|||${awayTeam}`;
}

const worldCup2026FixtureVenues = new Map<string, FixtureVenue>([
  [fixtureKey("México", "Sudáfrica"), { venueName: "Mexico City Stadium", venueCity: "Ciudad de México" }],
  [fixtureKey("República de Corea", "República Checa"), { venueName: "Estadio Guadalajara", venueCity: "Guadalajara" }],
  [fixtureKey("Canadá", "Bosnia y Herzegovina"), { venueName: "Toronto Stadium", venueCity: "Toronto" }],
  [fixtureKey("Estados Unidos", "Paraguay"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("Catar", "Suiza"), { venueName: "Bay Area Stadium", venueCity: "San Francisco" }],
  [fixtureKey("Brasil", "Marruecos"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("Haití", "Escocia"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("Australia", "Turquía"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],
  [fixtureKey("Alemania", "Curazao"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("Países Bajos", "Japón"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("Costa de Marfil", "Ecuador"), { venueName: "Philadelphia Stadium", venueCity: "Filadelfia" }],
  [fixtureKey("Suecia", "Túnez"), { venueName: "Estadio Monterrey", venueCity: "Monterrey" }],
  [fixtureKey("España", "Cabo Verde"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("Bélgica", "Egipto"), { venueName: "Seattle Stadium", venueCity: "Seattle" }],
  [fixtureKey("Arabia Saudí", "Uruguay"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("Irán", "Nueva Zelanda"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("Francia", "Senegal"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("Irak", "Noruega"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("Argentina", "Argelia"), { venueName: "Kansas City Stadium", venueCity: "Kansas City" }],
  [fixtureKey("Austria", "Jordania"), { venueName: "Bay Area Stadium", venueCity: "San Francisco" }],
  [fixtureKey("Portugal", "RD de Congo"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("Inglaterra", "Croacia"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("Ghana", "Panamá"), { venueName: "Toronto Stadium", venueCity: "Toronto" }],
  [fixtureKey("Uzbekistán", "Colombia"), { venueName: "Mexico City Stadium", venueCity: "Ciudad de México" }],
  [fixtureKey("República Checa", "Sudáfrica"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("Canadá", "Catar"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],
  [fixtureKey("Suiza", "Bosnia y Herzegovina"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("México", "República de Corea"), { venueName: "Estadio Guadalajara", venueCity: "Guadalajara" }],
  [fixtureKey("Estados Unidos", "Australia"), { venueName: "Seattle Stadium", venueCity: "Seattle" }],
  [fixtureKey("Escocia", "Marruecos"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("Brasil", "Haití"), { venueName: "Philadelphia Stadium", venueCity: "Filadelfia" }],
  [fixtureKey("Turquía", "Paraguay"), { venueName: "Bay Area Stadium", venueCity: "San Francisco" }],
  [fixtureKey("Países Bajos", "Suecia"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("Alemania", "Costa de Marfil"), { venueName: "Toronto Stadium", venueCity: "Toronto" }],
  [fixtureKey("Ecuador", "Curazao"), { venueName: "Kansas City Stadium", venueCity: "Kansas City" }],
  [fixtureKey("Túnez", "Japón"), { venueName: "Estadio Monterrey", venueCity: "Monterrey" }],
  [fixtureKey("España", "Arabia Saudí"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("Bélgica", "Irán"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("Uruguay", "Cabo Verde"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("Nueva Zelanda", "Egipto"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],
  [fixtureKey("Argentina", "Austria"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("Francia", "Irak"), { venueName: "Philadelphia Stadium", venueCity: "Filadelfia" }],
  [fixtureKey("Noruega", "Senegal"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("Jordania", "Argelia"), { venueName: "Bay Area Stadium", venueCity: "San Francisco" }],
  [fixtureKey("Portugal", "Uzbekistán"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("Inglaterra", "Ghana"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("Panamá", "Croacia"), { venueName: "Toronto Stadium", venueCity: "Toronto" }],
  [fixtureKey("Colombia", "RD de Congo"), { venueName: "Estadio Guadalajara", venueCity: "Guadalajara" }],
  [fixtureKey("Suiza", "Canadá"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],
  [fixtureKey("Bosnia y Herzegovina", "Catar"), { venueName: "Seattle Stadium", venueCity: "Seattle" }],
  [fixtureKey("Brasil", "Escocia"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("Marruecos", "Haití"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("República Checa", "México"), { venueName: "Mexico City Stadium", venueCity: "Ciudad de México" }],
  [fixtureKey("Sudáfrica", "República de Corea"), { venueName: "Estadio Monterrey", venueCity: "Monterrey" }],
  [fixtureKey("Turquía", "Estados Unidos"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("Paraguay", "Australia"), { venueName: "Bay Area Stadium", venueCity: "San Francisco" }],
  [fixtureKey("Curazao", "Costa de Marfil"), { venueName: "Philadelphia Stadium", venueCity: "Filadelfia" }],
  [fixtureKey("Ecuador", "Alemania"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("Japón", "Suecia"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("Túnez", "Países Bajos"), { venueName: "Kansas City Stadium", venueCity: "Kansas City" }],
  [fixtureKey("Noruega", "Francia"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("Senegal", "Irak"), { venueName: "Toronto Stadium", venueCity: "Toronto" }],
  [fixtureKey("Cabo Verde", "Arabia Saudí"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("Uruguay", "España"), { venueName: "Estadio Guadalajara", venueCity: "Guadalajara" }],
  [fixtureKey("Egipto", "Irán"), { venueName: "Seattle Stadium", venueCity: "Seattle" }],
  [fixtureKey("Nueva Zelanda", "Bélgica"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],
  [fixtureKey("Croacia", "Ghana"), { venueName: "Philadelphia Stadium", venueCity: "Filadelfia" }],
  [fixtureKey("Panamá", "Inglaterra"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("Colombia", "Portugal"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("RD de Congo", "Uzbekistán"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("Argelia", "Austria"), { venueName: "Kansas City Stadium", venueCity: "Kansas City" }],
  [fixtureKey("Jordania", "Argentina"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],

  [fixtureKey("2º Grupo A", "2º Grupo B"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("1º Grupo E", "3º Grupo A/B/C/D/F"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("1º Grupo F", "2º Grupo C"), { venueName: "Estadio Monterrey", venueCity: "Monterrey" }],
  [fixtureKey("1º Grupo C", "2º Grupo F"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("1º Grupo I", "3º Grupo C/D/F/G/H"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("2º Grupo E", "2º Grupo I"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("1º Grupo A", "3º Grupo C/E/F/H/I"), { venueName: "Mexico City Stadium", venueCity: "Ciudad de México" }],
  [fixtureKey("1º Grupo L", "3º Grupo E/H/I/J/K"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("1º Grupo D", "3º Grupo B/E/F/I/J"), { venueName: "Bay Area Stadium", venueCity: "San Francisco" }],
  [fixtureKey("1º Grupo G", "3º Grupo A/E/H/I/J"), { venueName: "Seattle Stadium", venueCity: "Seattle" }],
  [fixtureKey("2º Grupo K", "2º Grupo L"), { venueName: "Toronto Stadium", venueCity: "Toronto" }],
  [fixtureKey("1º Grupo H", "2º Grupo J"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("1º Grupo B", "3º Grupo E/F/G/I/J"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],
  [fixtureKey("1º Grupo J", "2º Grupo H"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("1º Grupo K", "3º Grupo D/E/I/J/L"), { venueName: "Kansas City Stadium", venueCity: "Kansas City" }],
  [fixtureKey("2º Grupo D", "2º Grupo G"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],

  [fixtureKey("Ganador Partido 74", "Ganador Partido 77"), { venueName: "Philadelphia Stadium", venueCity: "Filadelfia" }],
  [fixtureKey("Ganador Partido 73", "Ganador Partido 75"), { venueName: "Houston Stadium", venueCity: "Houston" }],
  [fixtureKey("Ganador Partido 76", "Ganador Partido 78"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
  [fixtureKey("Ganador Partido 79", "Ganador Partido 80"), { venueName: "Mexico City Stadium", venueCity: "Ciudad de México" }],
  [fixtureKey("Ganador Partido 83", "Ganador Partido 84"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("Ganador Partido 81", "Ganador Partido 82"), { venueName: "Seattle Stadium", venueCity: "Seattle" }],
  [fixtureKey("Ganador Partido 86", "Ganador Partido 88"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],
  [fixtureKey("Ganador Partido 85", "Ganador Partido 87"), { venueName: "BC Place Vancouver", venueCity: "Vancouver" }],

  [fixtureKey("Ganador Partido 89", "Ganador Partido 90"), { venueName: "Boston Stadium", venueCity: "Boston" }],
  [fixtureKey("Ganador Partido 93", "Ganador Partido 94"), { venueName: "Los Angeles Stadium", venueCity: "Los Ángeles" }],
  [fixtureKey("Ganador Partido 91", "Ganador Partido 92"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("Ganador Partido 95", "Ganador Partido 96"), { venueName: "Kansas City Stadium", venueCity: "Kansas City" }],

  [fixtureKey("Ganador Partido 97", "Ganador Partido 98"), { venueName: "Dallas Stadium", venueCity: "Dallas" }],
  [fixtureKey("Ganador Partido 99", "Ganador Partido 100"), { venueName: "Atlanta Stadium", venueCity: "Atlanta" }],

  [fixtureKey("Perdedor Partido 101", "Perdedor Partido 102"), { venueName: "Miami Stadium", venueCity: "Miami" }],
  [fixtureKey("Ganador Partido 101", "Ganador Partido 102"), { venueName: "New York Stadium", venueCity: "Nueva York" }],
]);

export function getWorldCup2026FixtureVenue(homeTeam: string, awayTeam: string): FixtureVenue {
  const venue = worldCup2026FixtureVenues.get(fixtureKey(homeTeam, awayTeam));

  if (!venue) {
    throw new Error(`No venue found for fixture: ${homeTeam} vs ${awayTeam}`);
  }

  return venue;
}

export const worldCup2026Teams: TeamSeed[] = [
  { name: "México", flagUrl: flagUrl("mx"), groupCode: "A" },
  { name: "Sudáfrica", flagUrl: flagUrl("za"), groupCode: "A" },
  { name: "República de Corea", flagUrl: flagUrl("kr"), groupCode: "A" },
  { name: "República Checa", flagUrl: flagUrl("cz"), groupCode: "A" },
  { name: "Canadá", flagUrl: flagUrl("ca"), groupCode: "B" },
  { name: "Bosnia y Herzegovina", flagUrl: flagUrl("ba"), groupCode: "B" },
  { name: "Catar", flagUrl: flagUrl("qa"), groupCode: "B" },
  { name: "Suiza", flagUrl: flagUrl("ch"), groupCode: "B" },
  { name: "Brasil", flagUrl: flagUrl("br"), groupCode: "C" },
  { name: "Marruecos", flagUrl: flagUrl("ma"), groupCode: "C" },
  { name: "Haití", flagUrl: flagUrl("ht"), groupCode: "C" },
  { name: "Escocia", flagUrl: flagUrl("gb-sct"), groupCode: "C" },
  { name: "Estados Unidos", flagUrl: flagUrl("us"), groupCode: "D" },
  { name: "Paraguay", flagUrl: flagUrl("py"), groupCode: "D" },
  { name: "Australia", flagUrl: flagUrl("au"), groupCode: "D" },
  { name: "Turquía", flagUrl: flagUrl("tr"), groupCode: "D" },
  { name: "Alemania", flagUrl: flagUrl("de"), groupCode: "E" },
  { name: "Curazao", flagUrl: flagUrl("cw"), groupCode: "E" },
  { name: "Costa de Marfil", flagUrl: flagUrl("ci"), groupCode: "E" },
  { name: "Ecuador", flagUrl: flagUrl("ec"), groupCode: "E" },
  { name: "Países Bajos", flagUrl: flagUrl("nl"), groupCode: "F" },
  { name: "Japón", flagUrl: flagUrl("jp"), groupCode: "F" },
  { name: "Suecia", flagUrl: flagUrl("se"), groupCode: "F" },
  { name: "Túnez", flagUrl: flagUrl("tn"), groupCode: "F" },
  { name: "Bélgica", flagUrl: flagUrl("be"), groupCode: "G" },
  { name: "Egipto", flagUrl: flagUrl("eg"), groupCode: "G" },
  { name: "Irán", flagUrl: flagUrl("ir"), groupCode: "G" },
  { name: "Nueva Zelanda", flagUrl: flagUrl("nz"), groupCode: "G" },
  { name: "España", flagUrl: flagUrl("es"), groupCode: "H" },
  { name: "Cabo Verde", flagUrl: flagUrl("cv"), groupCode: "H" },
  { name: "Arabia Saudí", flagUrl: flagUrl("sa"), groupCode: "H" },
  { name: "Uruguay", flagUrl: flagUrl("uy"), groupCode: "H" },
  { name: "Francia", flagUrl: flagUrl("fr"), groupCode: "I" },
  { name: "Senegal", flagUrl: flagUrl("sn"), groupCode: "I" },
  { name: "Irak", flagUrl: flagUrl("iq"), groupCode: "I" },
  { name: "Noruega", flagUrl: flagUrl("no"), groupCode: "I" },
  { name: "Argentina", flagUrl: flagUrl("ar"), groupCode: "J" },
  { name: "Argelia", flagUrl: flagUrl("dz"), groupCode: "J" },
  { name: "Austria", flagUrl: flagUrl("at"), groupCode: "J" },
  { name: "Jordania", flagUrl: flagUrl("jo"), groupCode: "J" },
  { name: "Portugal", flagUrl: flagUrl("pt"), groupCode: "K" },
  { name: "RD de Congo", flagUrl: flagUrl("cd"), groupCode: "K" },
  { name: "Uzbekistán", flagUrl: flagUrl("uz"), groupCode: "K" },
  { name: "Colombia", flagUrl: flagUrl("co"), groupCode: "K" },
  { name: "Inglaterra", flagUrl: flagUrl("gb-eng"), groupCode: "L" },
  { name: "Croacia", flagUrl: flagUrl("hr"), groupCode: "L" },
  { name: "Ghana", flagUrl: flagUrl("gh"), groupCode: "L" },
  { name: "Panamá", flagUrl: flagUrl("pa"), groupCode: "L" },
];

export const worldCup2026Rounds: RoundSeed[] = [
  {
    name: "Fase de grupos",
    unlockAt: etDate("2026-05-01", "00:00"),
    startDate: etDate("2026-06-11", "15:00"),
    endDate: etDate("2026-06-27", "23:59"),
  },
  {
    name: "Dieciseisavos de final",
    unlockAt: zonedDate("2026-06-28", "00:00", "+01:00"),
    startDate: zonedDate("2026-06-28", "12:00", "-07:00"),
    endDate: zonedDate("2026-07-03", "20:30", "-05:00"),
  },
  {
    name: "Octavos de final",
    unlockAt: zonedDate("2026-07-04", "00:00", "+01:00"),
    startDate: zonedDate("2026-07-04", "12:00", "-05:00"),
    endDate: zonedDate("2026-07-07", "13:00", "-07:00"),
  },
  {
    name: "Cuartos de final",
    unlockAt: zonedDate("2026-07-09", "00:00", "+01:00"),
    startDate: zonedDate("2026-07-09", "16:00", "-04:00"),
    endDate: zonedDate("2026-07-11", "20:00", "-05:00"),
  },
  {
    name: "Semifinales",
    unlockAt: zonedDate("2026-07-14", "00:00", "+01:00"),
    startDate: zonedDate("2026-07-14", "14:00", "-05:00"),
    endDate: zonedDate("2026-07-15", "15:00", "-04:00"),
  },
  {
    name: "Tercer puesto",
    unlockAt: zonedDate("2026-07-18", "00:00", "+01:00"),
    startDate: zonedDate("2026-07-18", "17:00", "-04:00"),
    endDate: zonedDate("2026-07-18", "17:00", "-04:00"),
  },
  {
    name: "Final",
    unlockAt: zonedDate("2026-07-19", "00:00", "+01:00"),
    startDate: zonedDate("2026-07-19", "15:00", "-04:00"),
    endDate: zonedDate("2026-07-19", "15:00", "-04:00"),
  },
];

export const worldCup2026Fixtures: FixtureSeed[] = [
  { roundName: "Fase de grupos", homeTeam: "México", awayTeam: "Sudáfrica", startsAt: etDate("2026-06-11", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "República de Corea", awayTeam: "República Checa", startsAt: etDate("2026-06-11", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "Canadá", awayTeam: "Bosnia y Herzegovina", startsAt: etDate("2026-06-12", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Estados Unidos", awayTeam: "Paraguay", startsAt: etDate("2026-06-12", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Catar", awayTeam: "Suiza", startsAt: etDate("2026-06-13", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Brasil", awayTeam: "Marruecos", startsAt: etDate("2026-06-13", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Haití", awayTeam: "Escocia", startsAt: etDate("2026-06-13", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Australia", awayTeam: "Turquía", startsAt: etDate("2026-06-14", "00:00") },
  { roundName: "Fase de grupos", homeTeam: "Alemania", awayTeam: "Curazao", startsAt: etDate("2026-06-14", "13:00") },
  { roundName: "Fase de grupos", homeTeam: "Países Bajos", awayTeam: "Japón", startsAt: etDate("2026-06-14", "16:00") },
  { roundName: "Fase de grupos", homeTeam: "Costa de Marfil", awayTeam: "Ecuador", startsAt: etDate("2026-06-14", "19:00") },
  { roundName: "Fase de grupos", homeTeam: "Suecia", awayTeam: "Túnez", startsAt: etDate("2026-06-14", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "España", awayTeam: "Cabo Verde", startsAt: etDate("2026-06-15", "12:00") },
  { roundName: "Fase de grupos", homeTeam: "Bélgica", awayTeam: "Egipto", startsAt: etDate("2026-06-15", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Arabia Saudí", awayTeam: "Uruguay", startsAt: etDate("2026-06-15", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Irán", awayTeam: "Nueva Zelanda", startsAt: etDate("2026-06-15", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Francia", awayTeam: "Senegal", startsAt: etDate("2026-06-16", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Irak", awayTeam: "Noruega", startsAt: etDate("2026-06-16", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Argentina", awayTeam: "Argelia", startsAt: etDate("2026-06-16", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Austria", awayTeam: "Jordania", startsAt: etDate("2026-06-17", "00:00") },
  { roundName: "Fase de grupos", homeTeam: "Portugal", awayTeam: "RD de Congo", startsAt: etDate("2026-06-17", "13:00") },
  { roundName: "Fase de grupos", homeTeam: "Inglaterra", awayTeam: "Croacia", startsAt: etDate("2026-06-17", "16:00") },
  { roundName: "Fase de grupos", homeTeam: "Ghana", awayTeam: "Panamá", startsAt: etDate("2026-06-17", "19:00") },
  { roundName: "Fase de grupos", homeTeam: "Uzbekistán", awayTeam: "Colombia", startsAt: etDate("2026-06-17", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "República Checa", awayTeam: "Sudáfrica", startsAt: etDate("2026-06-18", "12:00") },
  { roundName: "Fase de grupos", homeTeam: "Canadá", awayTeam: "Catar", startsAt: etDate("2026-06-18", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Suiza", awayTeam: "Bosnia y Herzegovina", startsAt: etDate("2026-06-18", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "México", awayTeam: "República de Corea", startsAt: etDate("2026-06-18", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Estados Unidos", awayTeam: "Australia", startsAt: etDate("2026-06-19", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Escocia", awayTeam: "Marruecos", startsAt: etDate("2026-06-19", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Brasil", awayTeam: "Haití", startsAt: etDate("2026-06-19", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Turquía", awayTeam: "Paraguay", startsAt: etDate("2026-06-20", "00:00") },
  { roundName: "Fase de grupos", homeTeam: "Países Bajos", awayTeam: "Suecia", startsAt: etDate("2026-06-20", "13:00") },
  { roundName: "Fase de grupos", homeTeam: "Alemania", awayTeam: "Costa de Marfil", startsAt: etDate("2026-06-20", "16:00") },
  { roundName: "Fase de grupos", homeTeam: "Ecuador", awayTeam: "Curazao", startsAt: etDate("2026-06-20", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "Túnez", awayTeam: "Japón", startsAt: etDate("2026-06-21", "00:00") },
  { roundName: "Fase de grupos", homeTeam: "España", awayTeam: "Arabia Saudí", startsAt: etDate("2026-06-21", "12:00") },
  { roundName: "Fase de grupos", homeTeam: "Bélgica", awayTeam: "Irán", startsAt: etDate("2026-06-21", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Uruguay", awayTeam: "Cabo Verde", startsAt: etDate("2026-06-21", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Nueva Zelanda", awayTeam: "Egipto", startsAt: etDate("2026-06-21", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Argentina", awayTeam: "Austria", startsAt: etDate("2026-06-22", "13:00") },
  { roundName: "Fase de grupos", homeTeam: "Francia", awayTeam: "Irak", startsAt: etDate("2026-06-22", "17:00") },
  { roundName: "Fase de grupos", homeTeam: "Noruega", awayTeam: "Senegal", startsAt: etDate("2026-06-22", "20:00") },
  { roundName: "Fase de grupos", homeTeam: "Jordania", awayTeam: "Argelia", startsAt: etDate("2026-06-22", "23:00") },
  { roundName: "Fase de grupos", homeTeam: "Portugal", awayTeam: "Uzbekistán", startsAt: etDate("2026-06-23", "13:00") },
  { roundName: "Fase de grupos", homeTeam: "Inglaterra", awayTeam: "Ghana", startsAt: etDate("2026-06-23", "16:00") },
  { roundName: "Fase de grupos", homeTeam: "Panamá", awayTeam: "Croacia", startsAt: etDate("2026-06-23", "19:00") },
  { roundName: "Fase de grupos", homeTeam: "Colombia", awayTeam: "RD de Congo", startsAt: etDate("2026-06-23", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "Suiza", awayTeam: "Canadá", startsAt: etDate("2026-06-24", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Bosnia y Herzegovina", awayTeam: "Catar", startsAt: etDate("2026-06-24", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Brasil", awayTeam: "Escocia", startsAt: etDate("2026-06-24", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "Marruecos", awayTeam: "Haití", startsAt: etDate("2026-06-24", "18:00") },
  { roundName: "Fase de grupos", homeTeam: "República Checa", awayTeam: "México", startsAt: etDate("2026-06-24", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Sudáfrica", awayTeam: "República de Corea", startsAt: etDate("2026-06-24", "21:00") },
  { roundName: "Fase de grupos", homeTeam: "Turquía", awayTeam: "Estados Unidos", startsAt: etDate("2026-06-25", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "Paraguay", awayTeam: "Australia", startsAt: etDate("2026-06-25", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "Curazao", awayTeam: "Costa de Marfil", startsAt: etDate("2026-06-25", "16:00") },
  { roundName: "Fase de grupos", homeTeam: "Ecuador", awayTeam: "Alemania", startsAt: etDate("2026-06-25", "16:00") },
  { roundName: "Fase de grupos", homeTeam: "Japón", awayTeam: "Suecia", startsAt: etDate("2026-06-25", "19:00") },
  { roundName: "Fase de grupos", homeTeam: "Túnez", awayTeam: "Países Bajos", startsAt: etDate("2026-06-25", "19:00") },
  { roundName: "Fase de grupos", homeTeam: "Noruega", awayTeam: "Francia", startsAt: etDate("2026-06-26", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Senegal", awayTeam: "Irak", startsAt: etDate("2026-06-26", "15:00") },
  { roundName: "Fase de grupos", homeTeam: "Cabo Verde", awayTeam: "Arabia Saudí", startsAt: etDate("2026-06-26", "20:00") },
  { roundName: "Fase de grupos", homeTeam: "Uruguay", awayTeam: "España", startsAt: etDate("2026-06-26", "20:00") },
  { roundName: "Fase de grupos", homeTeam: "Egipto", awayTeam: "Irán", startsAt: etDate("2026-06-26", "23:00") },
  { roundName: "Fase de grupos", homeTeam: "Nueva Zelanda", awayTeam: "Bélgica", startsAt: etDate("2026-06-26", "23:00") },
  { roundName: "Fase de grupos", homeTeam: "Croacia", awayTeam: "Ghana", startsAt: etDate("2026-06-27", "17:00") },
  { roundName: "Fase de grupos", homeTeam: "Panamá", awayTeam: "Inglaterra", startsAt: etDate("2026-06-27", "17:00") },
  { roundName: "Fase de grupos", homeTeam: "Colombia", awayTeam: "Portugal", startsAt: etDate("2026-06-27", "19:30") },
  { roundName: "Fase de grupos", homeTeam: "RD de Congo", awayTeam: "Uzbekistán", startsAt: etDate("2026-06-27", "19:30") },
  { roundName: "Fase de grupos", homeTeam: "Argelia", awayTeam: "Austria", startsAt: etDate("2026-06-27", "22:00") },
  { roundName: "Fase de grupos", homeTeam: "Jordania", awayTeam: "Argentina", startsAt: etDate("2026-06-27", "22:00") },

  { roundName: "Dieciseisavos de final", homeTeam: "2º Grupo A", awayTeam: "2º Grupo B", startsAt: zonedDate("2026-06-28", "12:00", "-07:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo E", awayTeam: "3º Grupo A/B/C/D/F", startsAt: zonedDate("2026-06-29", "16:30", "-04:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo F", awayTeam: "2º Grupo C", startsAt: zonedDate("2026-06-29", "19:00", "-06:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo C", awayTeam: "2º Grupo F", startsAt: zonedDate("2026-06-29", "12:00", "-05:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo I", awayTeam: "3º Grupo C/D/F/G/H", startsAt: zonedDate("2026-06-30", "17:00", "-04:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "2º Grupo E", awayTeam: "2º Grupo I", startsAt: zonedDate("2026-06-30", "12:00", "-05:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo A", awayTeam: "3º Grupo C/E/F/H/I", startsAt: zonedDate("2026-06-30", "19:00", "-06:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo L", awayTeam: "3º Grupo E/H/I/J/K", startsAt: zonedDate("2026-07-01", "12:00", "-04:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo D", awayTeam: "3º Grupo B/E/F/I/J", startsAt: zonedDate("2026-07-01", "17:00", "-07:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo G", awayTeam: "3º Grupo A/E/H/I/J", startsAt: zonedDate("2026-07-01", "13:00", "-07:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "2º Grupo K", awayTeam: "2º Grupo L", startsAt: zonedDate("2026-07-02", "19:00", "-04:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo H", awayTeam: "2º Grupo J", startsAt: zonedDate("2026-07-02", "12:00", "-07:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo B", awayTeam: "3º Grupo E/F/G/I/J", startsAt: zonedDate("2026-07-02", "20:00", "-07:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo J", awayTeam: "2º Grupo H", startsAt: zonedDate("2026-07-03", "18:00", "-04:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "1º Grupo K", awayTeam: "3º Grupo D/E/I/J/L", startsAt: zonedDate("2026-07-03", "20:30", "-05:00") },
  { roundName: "Dieciseisavos de final", homeTeam: "2º Grupo D", awayTeam: "2º Grupo G", startsAt: zonedDate("2026-07-03", "13:00", "-05:00") },

  { roundName: "Octavos de final", homeTeam: "Ganador Partido 74", awayTeam: "Ganador Partido 77", startsAt: zonedDate("2026-07-04", "17:00", "-04:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 73", awayTeam: "Ganador Partido 75", startsAt: zonedDate("2026-07-04", "12:00", "-05:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 76", awayTeam: "Ganador Partido 78", startsAt: zonedDate("2026-07-05", "16:00", "-04:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 79", awayTeam: "Ganador Partido 80", startsAt: zonedDate("2026-07-05", "18:00", "-06:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 83", awayTeam: "Ganador Partido 84", startsAt: zonedDate("2026-07-06", "14:00", "-05:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 81", awayTeam: "Ganador Partido 82", startsAt: zonedDate("2026-07-06", "17:00", "-07:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 86", awayTeam: "Ganador Partido 88", startsAt: zonedDate("2026-07-07", "12:00", "-04:00") },
  { roundName: "Octavos de final", homeTeam: "Ganador Partido 85", awayTeam: "Ganador Partido 87", startsAt: zonedDate("2026-07-07", "13:00", "-07:00") },

  { roundName: "Cuartos de final", homeTeam: "Ganador Partido 89", awayTeam: "Ganador Partido 90", startsAt: zonedDate("2026-07-09", "16:00", "-04:00") },
  { roundName: "Cuartos de final", homeTeam: "Ganador Partido 93", awayTeam: "Ganador Partido 94", startsAt: zonedDate("2026-07-10", "12:00", "-07:00") },
  { roundName: "Cuartos de final", homeTeam: "Ganador Partido 91", awayTeam: "Ganador Partido 92", startsAt: zonedDate("2026-07-11", "17:00", "-04:00") },
  { roundName: "Cuartos de final", homeTeam: "Ganador Partido 95", awayTeam: "Ganador Partido 96", startsAt: zonedDate("2026-07-11", "20:00", "-05:00") },

  { roundName: "Semifinales", homeTeam: "Ganador Partido 97", awayTeam: "Ganador Partido 98", startsAt: zonedDate("2026-07-14", "14:00", "-05:00") },
  { roundName: "Semifinales", homeTeam: "Ganador Partido 99", awayTeam: "Ganador Partido 100", startsAt: zonedDate("2026-07-15", "15:00", "-04:00") },

  { roundName: "Tercer puesto", homeTeam: "Perdedor Partido 101", awayTeam: "Perdedor Partido 102", startsAt: zonedDate("2026-07-18", "17:00", "-04:00") },
  { roundName: "Final", homeTeam: "Ganador Partido 101", awayTeam: "Ganador Partido 102", startsAt: zonedDate("2026-07-19", "15:00", "-04:00") },
];
