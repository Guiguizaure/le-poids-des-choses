// En-têtes communs, erreurs inattendues et entretien quotidien de la base (server/handlers.ts).
import type { PagesContext } from "../../server/env";
import { apiMiddleware } from "../../server/handlers";

export const onRequest = (context: PagesContext) => apiMiddleware(context);
