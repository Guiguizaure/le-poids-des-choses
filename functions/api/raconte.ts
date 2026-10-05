import type { PagesContext } from "../../server/env";
import { handleRaconte } from "../../server/handlers";

export const onRequestPost = (context: PagesContext) => handleRaconte(context);
