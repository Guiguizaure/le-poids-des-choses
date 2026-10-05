import type { PagesContext } from "../../../server/env";
import { handleSession } from "../../../server/handlers";

export const onRequestGet = (context: PagesContext) => handleSession(context);
