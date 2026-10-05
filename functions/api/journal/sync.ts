import type { PagesContext } from "../../../server/env";
import { handleSync } from "../../../server/handlers";

export const onRequestPost = (context: PagesContext) => handleSync(context);
