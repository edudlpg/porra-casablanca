export type TeamGuideEntry = {
  name: string;
  slug: string;
  confederation: string;
  qualification: string;
  expectation: string;
  starPlayer: string;
  style: string;
  watchFor: string;
  colors: [string, string, string];
};

function slugifyTeamName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function guide(
  name: string,
  confederation: string,
  qualification: string,
  expectation: string,
  starPlayer: string,
  style: string,
  watchFor: string,
  colors: [string, string, string],
): TeamGuideEntry {
  return {
    name,
    slug: slugifyTeamName(name),
    confederation,
    qualification,
    expectation,
    starPlayer,
    style,
    watchFor,
    colors,
  };
}

export const WORLD_CUP_TEAM_GUIDES: TeamGuideEntry[] = [
  guide("México", "Concacaf", "Anfitriona: plaza directa como coorganizadora.", "Quiere convertir la localía en una fase de grupos fuerte y romper su techo reciente en eliminatorias.", "Santiago Giménez", "Ritmo alto, presión emocional de casa y laterales profundos.", "El partido inaugural marca el tono de todo su torneo.", ["#006847", "#ffffff", "#ce1126"]),
  guide("Sudáfrica", "CAF", "Ganó su grupo africano de clasificación.", "Llega para competir cada punto y aspirar a ser una de las tapadas del Grupo A.", "Percy Tau", "Bloque compacto, transiciones y mucha disputa física.", "Si puntúa pronto, puede convertir el grupo en una trampa.", ["#007a4d", "#ffb612", "#de3831"]),
  guide("República de Corea", "AFC", "Clasificada desde la tercera ronda asiática, dentro del grupo de cabeza de AFC.", "Parte como candidata seria a pelear el pase directo en un grupo muy abierto.", "Son Heung-min", "Verticalidad, trabajo sin balón y ataques rápidos por fuera.", "Su experiencia mundialista puede pesar en los cierres igualados.", ["#c60c30", "#ffffff", "#003478"]),
  guide("República Checa", "UEFA", "Entró por la vía europea tras superar la fase decisiva de clasificación.", "Equipo incómodo, más fiable que brillante, con opciones reales de meterse entre los dos primeros.", "Patrik Schick", "Juego directo, centros laterales y amenaza en balón parado.", "Sus partidos suelen definirse por detalles en las áreas.", ["#d7141a", "#ffffff", "#11457e"]),
  guide("Canadá", "Concacaf", "Anfitriona: plaza directa como coorganizadora.", "Busca confirmar el salto competitivo de su generación delante de su gente.", "Alphonso Davies", "Potencia por bandas, presión y mucha ida y vuelta.", "Su velocidad puede decidir partidos si encuentra espacios.", ["#ff0000", "#ffffff", "#d80621"]),
  guide("Bosnia y Herzegovina", "UEFA", "Clasificada desde Europa tras competir en el grupo y la fase final de acceso.", "Sueña con volver a ser una selección incómoda y rascar puntos ante rivales superiores.", "Edin Dzeko", "Ataque paciente, jerarquía en el área y balón parado.", "La mezcla de veteranos y talento joven será clave.", ["#002f6c", "#fecd00", "#ffffff"]),
  guide("Catar", "AFC", "Superó la clasificación asiática ya sin depender de su condición de anfitriona de 2022.", "Quiere limpiar la imagen competitiva de 2022 y demostrar evolución.", "Akram Afif", "Posesiones largas, movilidad entre líneas y calidad en último pase.", "Afif puede cambiar un partido si recibe con libertad.", ["#8a1538", "#ffffff", "#5f0f2f"]),
  guide("Suiza", "UEFA", "Ganó su camino europeo con la regularidad habitual de la Nati.", "Candidata clara a avanzar; rara vez se cae en fases de grupos.", "Granit Xhaka", "Orden, oficio, presión medida y mediocampo muy competitivo.", "Es una selección pensada para no regalar nada.", ["#ff0000", "#ffffff", "#b00020"]),
  guide("Brasil", "CONMEBOL", "Clasificada en la liguilla sudamericana.", "Siempre candidata, aunque llega con el reto de recuperar autoridad en partidos grandes.", "Vinicius Junior", "Talento individual, extremos desequilibrantes y ataques de muchos recursos.", "Si junta confianza defensiva con inspiración arriba, sube de nivel rápido.", ["#009b3a", "#ffdf00", "#002776"]),
  guide("Marruecos", "CAF", "Ganó su grupo africano con el impulso de su ciclo histórico reciente.", "Ya no es sorpresa: aspira a liderar el grupo y volver a competir contra cualquiera.", "Achraf Hakimi", "Bloque fuerte, laterales profundos y transiciones muy agresivas.", "Su madurez táctica lo convierte en rival peligrosísimo.", ["#c1272d", "#006233", "#ffffff"]),
  guide("Haití", "Concacaf", "Se clasificó desde la fase final de Concacaf.", "Una de las historias emocionales del torneo; su objetivo realista es competir y sumar.", "Wilson Isidor", "Energía, duelos abiertos y ataques rápidos.", "Cualquier punto sería enorme en un grupo exigente.", ["#00209f", "#d21034", "#ffffff"]),
  guide("Escocia", "UEFA", "Logró el billete europeo tras la fase decisiva de clasificación.", "Llega con una afición enorme y una oportunidad real de pelear el tercer puesto como mínimo.", "Scott McTominay", "Intensidad, centros, segunda jugada y mucho balón parado.", "Puede incomodar a cualquiera si el partido se vuelve físico.", ["#005eb8", "#ffffff", "#003f87"]),
  guide("Estados Unidos", "Concacaf", "Anfitriona: plaza directa como coorganizadora.", "Tiene plantilla para mandar en su grupo y necesita responder como local.", "Christian Pulisic", "Presión, ritmo, mediocampo físico y extremos verticales.", "La presión ambiental será tan importante como el talento.", ["#3c3b6e", "#ffffff", "#b22234"]),
  guide("Paraguay", "CONMEBOL", "Clasificada por la liguilla sudamericana.", "Vuelve con identidad competitiva: dura, incómoda y con opciones de avanzar.", "Miguel Almirón", "Defensa intensa, duelos y contragolpes directos.", "Si mantiene partidos cerrados, será muy difícil de tumbar.", ["#d52b1e", "#ffffff", "#0038a8"]),
  guide("Australia", "AFC", "Clasificada desde la ruta asiática, donde suele competir con mucha fiabilidad.", "Objetivo claro: pasar de grupo apoyándose en oficio y físico.", "Jackson Irvine", "Orden, juego aéreo y transiciones pragmáticas.", "Es un equipo de torneo, más peligroso cuanto más igualado esté el marcador.", ["#002b7f", "#ffcd00", "#00843d"]),
  guide("Turquía", "UEFA", "Entró desde Europa tras una clasificación de alto nivel competitivo.", "Plantilla con talento para ser una de las selecciones más entretenidas y peligrosas.", "Arda Güler", "Creatividad, ritmo alto y mucha llegada desde segunda línea.", "Puede alternar noches brillantes con partidos demasiado abiertos.", ["#e30a17", "#ffffff", "#b00020"]),
  guide("Alemania", "UEFA", "Ganó su grupo europeo y llega como potencia clásica.", "Candidata a llegar lejos si estabiliza su rendimiento en torneos.", "Jamal Musiala", "Posesión, mediapuntas móviles y presión tras pérdida.", "La calidad interior puede romper defensas cerradas.", ["#000000", "#dd0000", "#ffce00"]),
  guide("Curazao", "Concacaf", "Clasificación histórica desde Concacaf: debut mundialista.", "La misión es competir con orgullo y aprovechar el formato de mejores terceros.", "Leandro Bacuna", "Bloque solidario, ritmo caribeño y jugadores formados en Países Bajos.", "Su debut ya es histórico; cualquier punto tendrá valor enorme.", ["#002b7f", "#f9d616", "#ffffff"]),
  guide("Costa de Marfil", "CAF", "Ganó su grupo africano de clasificación.", "Equipo con físico y talento para discutir el pase en un grupo durísimo.", "Simon Adingra", "Potencia, bandas rápidas y mucha amenaza en transición.", "Si controla las pérdidas, tiene techo alto.", ["#f77f00", "#ffffff", "#009e60"]),
  guide("Ecuador", "CONMEBOL", "Clasificada desde la liguilla sudamericana.", "Una de las selecciones más serias de Sudamérica; aspira a avanzar.", "Moisés Caicedo", "Presión fuerte, mediocampo físico y defensa agresiva.", "Su intensidad puede asfixiar a rivales con menos ritmo.", ["#ffdd00", "#034ea2", "#ed1c24"]),
  guide("Países Bajos", "UEFA", "Clasificada desde la ruta europea.", "Candidata a liderar el grupo y a ser amenaza real en eliminatorias.", "Virgil van Dijk", "Defensa dominante, carrileros y ataques por oleadas.", "Tiene estructura para ganar sin necesitar partidos brillantes.", ["#ff5800", "#ffffff", "#21468b"]),
  guide("Japón", "AFC", "Ganó con autoridad su camino asiático.", "Ya no es revelación: espera competir por el liderato del grupo.", "Takefusa Kubo", "Presión coordinada, técnica, movilidad y ataques veloces.", "Su ritmo colectivo puede desordenar a equipos más físicos.", ["#bc002d", "#ffffff", "#1f2937"]),
  guide("Suecia", "UEFA", "Consiguió plaza europea en la fase decisiva.", "Regresa con una delantera interesante y opciones de pelear el pase.", "Alexander Isak", "Juego directo moderno, centros y delanteros de mucho rango.", "Si Isak recibe cerca del área, cambia el pronóstico.", ["#006aa7", "#fecc00", "#ffffff"]),
  guide("Túnez", "CAF", "Ganó su grupo africano de clasificación.", "Busca por fin transformar su competitividad en una clasificación a cruces.", "Ellyes Skhiri", "Bloque bajo-medio, orden y paciencia defensiva.", "Los empates pueden ser oro en este formato.", ["#e70013", "#ffffff", "#c8102e"]),
  guide("Bélgica", "UEFA", "Clasificada desde Europa tras liderar su ruta.", "Menos favoritismo que en ciclos anteriores, pero suficiente talento para mandar.", "Kevin De Bruyne", "Pases verticales, calidad entre líneas y ataques muy técnicos.", "La gestión física de sus líderes marcará su techo.", ["#000000", "#fae042", "#ed2939"]),
  guide("Egipto", "CAF", "Ganó su grupo africano.", "Tiene una estrella diferencial y experiencia para pelear el segundo puesto.", "Mohamed Salah", "Bloque trabajador, ataques hacia Salah y buen balón parado.", "Si Salah llega fino, Egipto siempre tiene gol.", ["#ce1126", "#ffffff", "#000000"]),
  guide("Irán", "AFC", "Clasificada desde la tercera ronda asiática.", "Selección veterana y competitiva, candidata a discutir cualquier partido cerrado.", "Mehdi Taremi", "Orden defensivo, delanteros expertos y transiciones directas.", "Suele competir mejor cuando no tiene que llevar la iniciativa.", ["#239f40", "#ffffff", "#da0000"]),
  guide("Nueva Zelanda", "OFC", "Campeona de Oceanía, primera clasificación directa OFC en este formato.", "Objetivo realista: puntuar y aprovechar cualquier margen para ser mejor tercero.", "Chris Wood", "Juego aéreo, centros y bloque pragmático.", "Wood convierte cualquier balón lateral en una ocasión real.", ["#000000", "#ffffff", "#c0c0c0"]),
  guide("España", "UEFA", "Ganó su grupo europeo y llega entre las grandes favoritas.", "Candidata al título: talento joven, automatismos y una idea muy asentada.", "Lamine Yamal", "Posesión agresiva, presión alta y extremos que rompen por dentro y fuera.", "Si domina pérdidas y transiciones, puede controlar casi cualquier partido.", ["#aa151b", "#f1bf00", "#aa151b"]),
  guide("Cabo Verde", "CAF", "Ganó su grupo africano y jugará su primer Mundial.", "Debutante con poco que perder y una oportunidad enorme en el formato de 48.", "Ryan Mendes", "Equipo solidario, transiciones y orgullo competitivo.", "Su primer gol mundialista sería uno de los momentos del grupo.", ["#003893", "#ffffff", "#cf2027"]),
  guide("Arabia Saudí", "AFC", "Clasificada desde la fase asiática final.", "Quiere volver a dar un golpe como en 2022, esta vez con más continuidad.", "Salem Al-Dawsari", "Ataque valiente, extremos rápidos y presión por tramos.", "Puede castigar si el rival se confía.", ["#006c35", "#ffffff", "#004b26"]),
  guide("Uruguay", "CONMEBOL", "Clasificada en la liguilla sudamericana.", "Candidata a avanzar; mezcla garra histórica con una generación muy potente.", "Federico Valverde", "Intensidad, mediocampo físico y ataques verticales.", "El duelo con España puede decidir el liderato del grupo.", ["#5bc2e7", "#ffffff", "#fcd116"]),
  guide("Francia", "UEFA", "Ganó su grupo europeo y llega como una de las favoritas absolutas.", "Plantilla de título: profundidad, físico y experiencia en finales.", "Kylian Mbappé", "Transiciones letales, velocidad y mucha pegada en pocos toques.", "Puede ganar partidos incluso sin dominar la posesión.", ["#0055a4", "#ffffff", "#ef4135"]),
  guide("Senegal", "CAF", "Ganó su grupo africano.", "Aspirante fuerte a cruces, con experiencia y físico de élite.", "Sadio Mané", "Defensa poderosa, velocidad exterior y mucho oficio.", "Es una selección africana preparada para competir contra favoritos.", ["#00853f", "#fdef42", "#e31b23"]),
  guide("Irak", "AFC", "Logró una clasificación de recorrido largo y muy competido en Asia.", "Vuelve con ilusión enorme y el objetivo de ser competitiva en cada jornada.", "Ali Al-Hamadi", "Bloque emocional, ataques directos y mucho empuje.", "El primer partido puede marcar su confianza.", ["#ce1126", "#ffffff", "#000000"]),
  guide("Noruega", "UEFA", "Clasificada desde Europa con una generación de enorme pegada.", "Puede ser una de las selecciones más incómodas si junta talento y estructura.", "Erling Haaland", "Ataques directos, centros, rupturas y finalización de élite.", "Haaland cambia cualquier cálculo defensivo.", ["#ba0c2f", "#ffffff", "#00205b"]),
  guide("Argentina", "CONMEBOL", "Lideró la clasificación sudamericana como vigente campeona mundial.", "Defiende corona con jerarquía y una base competitiva muy probada.", "Lionel Messi", "Control emocional, oficio, posesión selectiva y pegada.", "Su gestión de momentos sigue siendo diferencial.", ["#75aadb", "#ffffff", "#fcbf49"]),
  guide("Argelia", "CAF", "Ganó su grupo africano.", "Equipo con talento ofensivo para discutir el pase en un grupo parejo.", "Riyad Mahrez", "Calidad por fuera, pausa y remate desde segunda línea.", "Si Mahrez manda en ritmo, Argelia gana claridad.", ["#006233", "#ffffff", "#d21034"]),
  guide("Austria", "UEFA", "Ganó su grupo europeo.", "Llega con una identidad muy reconocible y opciones reales de avanzar.", "David Alaba", "Presión intensa, automatismos y ritmo alto.", "Su entrenadoría colectiva pesa casi tanto como sus nombres.", ["#ed2939", "#ffffff", "#c8102e"]),
  guide("Jordania", "AFC", "Clasificación histórica desde Asia: debut mundialista.", "Debutante ambiciosa, con confianza tras un ciclo continental muy fuerte.", "Mousa Al-Taamari", "Transiciones, zurdos por dentro y mucha solidaridad.", "Su velocidad puede complicar a favoritos si roba arriba.", ["#007a3d", "#ffffff", "#ce1126"]),
  guide("Portugal", "UEFA", "Ganó su grupo europeo.", "Plantilla de candidata seria: talento en todas las líneas y mucha profundidad.", "Cristiano Ronaldo", "Posesión ofensiva, laterales altos y mucha llegada al área.", "La mezcla de veteranos y estrellas prime le da recursos para todo tipo de partido.", ["#006600", "#ff0000", "#ffcc00"]),
  guide("RD de Congo", "CAF", "Llegó al Mundial por la ruta africana decisiva.", "Equipo físico y peligroso; aspira a competir por la sorpresa del Grupo K.", "Yoane Wissa", "Potencia, transiciones y duelos individuales.", "Si convierte los partidos en ida y vuelta, gana opciones.", ["#007fff", "#f7d618", "#ce1021"]),
  guide("Uzbekistán", "AFC", "Clasificación histórica desde Asia: primer Mundial.", "Debutante con estructura seria y margen para puntuar.", "Eldor Shomurodov", "Orden, delanteros móviles y ataques trabajados.", "Su debut puede ser menos ingenuo de lo que parece.", ["#1eb53a", "#ffffff", "#0099b5"]),
  guide("Colombia", "CONMEBOL", "Clasificada desde la liguilla sudamericana.", "Talento suficiente para liderar o discutir el grupo si mantiene regularidad.", "Luis Díaz", "Ataque por bandas, pausa creativa y presión tras pérdida.", "Luis Díaz puede abrir partidos cerrados por sí solo.", ["#fcd116", "#003893", "#ce1126"]),
  guide("Inglaterra", "UEFA", "Ganó su grupo europeo.", "Candidata al título por plantilla, con la presión de convertir talento en trofeo.", "Jude Bellingham", "Mediapuntas potentes, laterales profundos y mucha calidad entre líneas.", "Su reto es resolver partidos grandes sin encogerse.", ["#ffffff", "#cf142b", "#00247d"]),
  guide("Croacia", "UEFA", "Clasificada desde Europa con su habitual oficio competitivo.", "Menos favoritismo que antes, pero nadie quiere cruzarse con Croacia.", "Luka Modric", "Control del ritmo, posesión paciente y experiencia extrema.", "Aunque envejezca, sigue sabiendo sufrir como pocas.", ["#f00000", "#ffffff", "#171796"]),
  guide("Ghana", "CAF", "Ganó su grupo africano.", "Busca recuperar peso mundialista con una generación física y vertical.", "Mohammed Kudus", "Transiciones, potencia en conducción y llegadas desde segunda línea.", "Kudus es el termómetro de su peligro ofensivo.", ["#ce1126", "#fcd116", "#006b3f"]),
  guide("Panamá", "Concacaf", "Clasificada desde la fase final de Concacaf.", "Quiere mejorar su debut de 2018 y competir con más madurez.", "Adalberto Carrasquilla", "Orden, intensidad y mediocampo trabajador.", "El formato de mejores terceros le da un objetivo realista.", ["#005aa7", "#ffffff", "#d21034"]),
];

export const TEAM_GUIDE_BY_NAME = new Map(WORLD_CUP_TEAM_GUIDES.map((team) => [team.name, team]));
export const TEAM_GUIDE_BY_SLUG = new Map(WORLD_CUP_TEAM_GUIDES.map((team) => [team.slug, team]));

const STAR_PLAYER_NUMBERS = new Map<string, string>([
  ["México", "11"],
  ["Sudáfrica", "10"],
  ["República de Corea", "7"],
  ["República Checa", "10"],
  ["Canadá", "19"],
  ["Bosnia y Herzegovina", "11"],
  ["Catar", "11"],
  ["Suiza", "10"],
  ["Brasil", "7"],
  ["Marruecos", "2"],
  ["Haití", "9"],
  ["Escocia", "4"],
  ["Estados Unidos", "10"],
  ["Paraguay", "10"],
  ["Australia", "22"],
  ["Turquía", "8"],
  ["Alemania", "10"],
  ["Curazao", "10"],
  ["Costa de Marfil", "11"],
  ["Ecuador", "23"],
  ["Países Bajos", "4"],
  ["Japón", "20"],
  ["Suecia", "9"],
  ["Túnez", "17"],
  ["Bélgica", "7"],
  ["Egipto", "10"],
  ["Irán", "9"],
  ["Nueva Zelanda", "9"],
  ["España", "19"],
  ["Cabo Verde", "20"],
  ["Arabia Saudí", "10"],
  ["Uruguay", "15"],
  ["Francia", "10"],
  ["Senegal", "10"],
  ["Irak", "18"],
  ["Noruega", "9"],
  ["Argentina", "10"],
  ["Argelia", "7"],
  ["Austria", "8"],
  ["Jordania", "10"],
  ["Portugal", "7"],
  ["RD de Congo", "20"],
  ["Uzbekistán", "14"],
  ["Colombia", "7"],
  ["Inglaterra", "10"],
  ["Croacia", "10"],
  ["Ghana", "20"],
  ["Panamá", "8"],
]);

export function getTeamGuideSlug(name: string) {
  return TEAM_GUIDE_BY_NAME.get(name)?.slug ?? slugifyTeamName(name);
}

export function getStarPlayerNumber(teamName: string) {
  return STAR_PLAYER_NUMBERS.get(teamName) ?? "10";
}
