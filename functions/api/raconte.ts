import type { PagesContext } from "../../server/env";
import { handleRaconte, handleRaconteStatus } from "../../server/handlers";

export const onRequestGet = (context: PagesContext) =>
  handleRaconteStatus(context);
export const onRequestPost = (context: PagesContext) => handleRaconte(context);
