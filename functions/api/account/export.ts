import type { PagesContext } from "../../../server/env";
import { handleExport } from "../../../server/handlers";

export const onRequestGet = (context: PagesContext) => handleExport(context);
