import type { PagesContext } from "../../../server/env";
import { handleDeleteAccount } from "../../../server/handlers";

export const onRequestDelete = (context: PagesContext) =>
  handleDeleteAccount(context);
