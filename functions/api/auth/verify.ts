import type { PagesContext } from "../../../server/env";
import { handleVerify } from "../../../server/handlers";

export const onRequestPost = (context: PagesContext) => handleVerify(context);
