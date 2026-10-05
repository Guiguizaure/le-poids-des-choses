import type { PagesContext } from "../../../server/env";
import { handleLogout } from "../../../server/handlers";

export const onRequestPost = (context: PagesContext) => handleLogout(context);
