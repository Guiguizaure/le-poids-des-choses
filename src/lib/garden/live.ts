// Le jardin vivant à un instant donné : saison, jour ou nuit, ciel affiché, animaux débloqués
// présents (ou endormis) et visiteurs. Fonctions pures : le jardin à l'écran et l'image de
// partage en dépendent de la même façon.
import { isNightAt, STARS_ENABLED } from "./daytime";
import { FAUNA, presenceOf, type Presence } from "./fauna";
import {
  animalBox,
  SLEEPERS,
  type AnimalKind,
  type Box,
  type GardenState,
} from "./model";
import { seasonAt, type Season } from "./seasons";
import type { SkyId } from "./skies";
import {
  placeVisitors,
  seasonYear,
  visitorIllustration,
  visitorPresence,
  type PlacedVisitor,
} from "./visitors";
import type { IllustrationName } from "@/lib/illustrations/specs";

export type Moment = { season: Season | null; night: boolean };

export function momentAt(now: number): Moment {
  return { season: seasonAt(now), night: isNightAt(now) };
}

/** Ciel affiché : celui choisi le jour, Nuit encre la nuit (sans déblocage). */
export function shownSky(chosen: SkyId, night: boolean): SkyId {
  return night ? "nuit" : chosen;
}

export type LiveAnimal = {
  kind: AnimalKind;
  asleep: boolean;
  box: Box;
};

export type LiveVisitor = PlacedVisitor & {
  asleep: boolean;
  illustration: IllustrationName;
};

/** Pourquoi un animal débloqué n'est pas là : la saison, la nuit, ou le jardin assoupi. */
export type Absence = "saison" | "nuit" | "assoupi";

export type LiveScene = Moment & {
  sky: SkyId;
  stars: boolean;
  animals: LiveAnimal[];
  /** Animaux débloqués absents en ce moment (jamais perdus : ils reviennent). */
  away: { kind: AnimalKind; why: Absence }[];
  visitors: LiveVisitor[];
};

/** Présence d'un animal débloqué : la table de faune, puis le jardin assoupi. */
export function animalPresence(
  kind: AnimalKind,
  moment: Moment,
  gardenAsleep: boolean,
): Presence {
  const presence = presenceOf(FAUNA[kind], moment);
  if (!gardenAsleep || presence === "absent") return presence;
  // Jardin assoupi : ceux qui dorment restent (endormis), les autres partent.
  return SLEEPERS.includes(kind) ? "asleep" : "absent";
}

function absenceReason(kind: AnimalKind, moment: Moment): Absence {
  if (presenceOf(FAUNA[kind], { ...moment, night: false }) === "absent")
    return "saison";
  if (presenceOf(FAUNA[kind], moment) === "absent") return "nuit";
  return "assoupi";
}

export function liveScene(
  garden: GardenState,
  moment: Moment,
  chosenSky: SkyId,
  now: Date,
): LiveScene {
  const sky = shownSky(chosenSky, moment.night);
  const animals: LiveAnimal[] = [];
  const away: LiveScene["away"] = [];
  for (const kind of garden.unlocked) {
    const presence = animalPresence(kind, moment, garden.asleep);
    if (presence === "absent")
      away.push({ kind, why: absenceReason(kind, moment) });
    else
      animals.push({
        kind,
        asleep: presence === "asleep",
        box: animalBox(kind),
      });
  }
  const visitors: LiveVisitor[] = moment.season
    ? placeVisitors(
        garden,
        moment.season,
        seasonYear(now, moment.season),
      ).flatMap((visitor) => {
        const presence = visitorPresence(visitor.rule, {
          night: moment.night,
          sky,
        });
        if (presence === "absent") return [];
        // Jardin assoupi : les visiteurs restent (immobiles), tels quels.
        return [
          {
            ...visitor,
            asleep: presence === "asleep",
            illustration: visitorIllustration(visitor.rule, presence),
          },
        ];
      })
    : [];
  return {
    ...moment,
    sky,
    stars: moment.night && STARS_ENABLED,
    animals,
    away,
    visitors,
  };
}
