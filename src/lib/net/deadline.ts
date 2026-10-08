// Délai maximal des appels au serveur lancés par un formulaire (lien de connexion, synchro,
// export, « Raconte ta journée ») : au-delà, l'appel est abandonné et l'écran le dit, au lieu
// de laisser un bouton sur « Envoi… » indéfiniment.

/** Délai par défaut d'un appel (ms). */
export const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Minuteur d'un appel : `signal` va à fetch et coupe aussi la lecture du corps de la réponse ;
 * `expired()` dit si c'est le délai qui l'a coupé ; `clear()` une fois le corps lu.
 * setTimeout (et non AbortSignal.timeout) : l'horloge des tests peut l'avancer.
 */
export function deadline(ms: number = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  let expired = false;
  const timer = setTimeout(() => {
    expired = true;
    controller.abort();
  }, ms);
  return {
    signal: controller.signal,
    expired: () => expired,
    clear: () => clearTimeout(timer),
  };
}
