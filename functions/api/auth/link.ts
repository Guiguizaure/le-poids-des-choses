import type { PagesContext } from "../../../server/env";
import { handleLink } from "../../../server/handlers";

export const onRequestPost = (context: PagesContext) => handleLink(context);
