// Compte facultatif : section de /jardin, page de connexion, messages de la synchro (ton doux,
// sans culpabilisation).
import { defineMessages } from "../index";

const pluralFr = (count: number, singular: string, plural: string) =>
  `${count} ${count > 1 ? plural : singular}`;
const pluralEn = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

export const ACCOUNT = defineMessages(
  {
    titles: {
      default: "Retrouve ton jardin sur un autre appareil",
      retrouver: "Retrouve ton jardin",
    },
    intros: {
      default:
        "Reçois un lien par e-mail, sans mot de passe : ton carnet sera gardé avec ton adresse, et tu le retrouveras partout où tu te connectes. C’est facultatif : ton jardin reste aussi sur cet appareil.",
      retrouver:
        "Ton jardin pousse déjà sur un autre appareil ? Reçois un lien par e-mail, sans mot de passe : ouvre-le ici et tes choix reviendront. C’est facultatif : sans compte, ton jardin reste sur l’appareil où tu le fais pousser.",
      connexion:
        "Ton jardin pousse déjà sur un autre appareil ? Reçois un lien par e-mail, sans mot de passe : ouvre-le ici et tes choix reviendront.",
    },
    privacy: "Confidentialité",
    turnstileLoad:
      "La vérification anti-robot n’a pas pu se charger. Vérifie ta connexion et réessaie.",
    sentBefore: "C’est envoyé ! Ouvre le lien reçu à",
    sentAfter:
      ", sur cet appareil ou sur un autre. Il est valable 15 minutes et ne sert qu’une fois. Rien reçu ? Jette un œil aux indésirables.",
    changeAddress: "Changer d’adresse ou renvoyer un lien",
    emailLabel: "Ton adresse e-mail",
    verifying: "Vérification…",
    sending: "Envoi…",
    send: "Recevoir un lien",
    emailUse:
      "Ton adresse ne sert qu’à t’envoyer ce lien et à retrouver ton carnet.",
    signedOut: "Déconnexion faite. Ton jardin reste sur cet appareil.",
    sessionEndedDelete:
      "Ta session a pris fin : reconnecte-toi pour supprimer ton compte.",
    deleted:
      "Ton compte est supprimé, avec tout ce qu’il gardait sur nos serveurs. Ton jardin reste sur cet appareil.",
    signedInAs: "Connecté avec",
    sync: "Synchroniser",
    exportData: "Exporter mes données",
    signOut: "Me déconnecter",
    deleteQuestion: "Supprimer ton compte ?",
    deleteText:
      "Ton adresse et ton carnet seront effacés tout de suite de nos serveurs. Ton jardin reste sur cet appareil.",
    deleteConfirm: "Oui, supprimer mon compte",
    cancel: "Annuler",
    deleteAccount: "Supprimer mon compte",
    // Page de connexion
    connexion: "Connexion",
    opening: "On ouvre ton jardin…",
    linked: "Ton jardin est relié",
    syncing: "Synchronisation en cours…",
    syncLater: "La synchronisation reprendra à ta prochaine visite du jardin.",
    syncFound: (n: number) =>
      `Synchronisation terminée : ${pluralFr(n, "choix retrouvé", "choix retrouvés")}.`,
    syncUpToDate: "Synchronisation terminée : ton carnet est à jour.",
    seeGarden: "Voir mon jardin",
    linkBroken: "Ce lien ne marche plus",
    linkExpired:
      "Un lien de connexion est valable 15 minutes et ne sert qu’une fois. Demande un nouveau lien ci-dessous : ça ne prend qu’un instant.",
    findGarden: "Retrouve ton jardin",
    alreadyBefore: "Tu es déjà connecté avec",
    alreadyAfter: " sur cet appareil : ton jardin s’y synchronise.",
    requestLink: "Recevoir un lien de connexion",
    // Messages de la synchro (src/lib/sync/messages.ts)
    errors: {
      offline: "Pas de connexion pour l’instant. Réessaie dans un moment.",
      unavailable:
        "La connexion n’est pas disponible pour le moment. Ton jardin reste sur cet appareil.",
      "rate-limited":
        "Beaucoup de demandes d’un coup : réessaie dans quelques minutes.",
      "invalid-email":
        "Cette adresse ne semble pas complète. Tu peux la vérifier ?",
      turnstile: "La vérification anti-robot n’a pas abouti. Réessaie.",
      mail: "Le lien n’a pas pu partir. Réessaie dans un moment.",
      "invalid-link":
        "Ce lien ne marche plus : il est valable 15 minutes et ne sert qu’une fois.",
      unauthorized:
        "Ta session a pris fin : demande un nouveau lien pour reprendre la synchro.",
      other: "Quelque chose n’a pas marché. Réessaie dans un moment.",
    },
    today: (time: string) => `aujourd’hui à ${time}`,
    yesterday: (time: string) => `hier à ${time}`,
    dayAt: (day: string, time: string) => `${day} à ${time}`,
    statusSyncing: "Synchronisation en cours…",
    statusWaiting:
      "Pas de connexion au compte pour l’instant : tes derniers choix partiront dès que possible.",
    statusLast: (when: string) => `Dernière synchro : ${when}.`,
    statusNever: "Pas encore synchronisé.",
    conflicts: (n: number) =>
      n === 1
        ? "Une autre version d’un même choix a été gardée à part : elle figure dans l’export de tes données."
        : `${n} autres versions de mêmes choix ont été gardées à part : elles figurent dans l’export de tes données.`,
  },
  {
    titles: {
      default: "Find your garden on another device",
      retrouver: "Find your garden",
    },
    intros: {
      default:
        "Get a link by email, no password needed: your journal will be kept with your address, and you’ll find it wherever you sign in. It’s optional: your garden also stays on this device.",
      retrouver:
        "Is your garden already growing on another device? Get a link by email, no password needed: open it here and your choices will come back. It’s optional: without an account, your garden stays on the device where it grows.",
      connexion:
        "Is your garden already growing on another device? Get a link by email, no password needed: open it here and your choices will come back.",
    },
    privacy: "Privacy",
    turnstileLoad:
      "The anti-robot check couldn’t load. Check your connection and try again.",
    sentBefore: "Sent! Open the link we sent to",
    sentAfter:
      ", on this device or another one. It’s valid for 15 minutes and only works once. Nothing arrived? Have a look in your spam folder.",
    changeAddress: "Change address or send another link",
    emailLabel: "Your email address",
    verifying: "Checking…",
    sending: "Sending…",
    send: "Send me a link",
    emailUse:
      "Your address is only used to send you this link and to find your journal.",
    signedOut: "Signed out. Your garden stays on this device.",
    sessionEndedDelete:
      "Your session has ended: sign in again to delete your account.",
    deleted:
      "Your account has been deleted, along with everything it kept on our servers. Your garden stays on this device.",
    signedInAs: "Signed in as",
    sync: "Sync",
    exportData: "Export my data",
    signOut: "Sign out",
    deleteQuestion: "Delete your account?",
    deleteText:
      "Your address and your journal will be erased from our servers straight away. Your garden stays on this device.",
    deleteConfirm: "Yes, delete my account",
    cancel: "Cancel",
    deleteAccount: "Delete my account",
    connexion: "Sign in",
    opening: "Opening your garden…",
    linked: "Your garden is connected",
    syncing: "Syncing…",
    syncLater: "Syncing will pick up on your next visit to the garden.",
    syncFound: (n: number) =>
      `Sync complete: ${pluralEn(n, "choice", "choices")} found.`,
    syncUpToDate: "Sync complete: your journal is up to date.",
    seeGarden: "See my garden",
    linkBroken: "This link no longer works",
    linkExpired:
      "A sign-in link is valid for 15 minutes and only works once. Ask for a new link below: it only takes a moment.",
    findGarden: "Find your garden",
    alreadyBefore: "You’re already signed in as",
    alreadyAfter: " on this device: your garden syncs here.",
    requestLink: "Get a sign-in link",
    errors: {
      offline: "No connection right now. Try again in a moment.",
      unavailable:
        "Signing in isn’t available at the moment. Your garden stays on this device.",
      "rate-limited": "Lots of requests at once: try again in a few minutes.",
      "invalid-email":
        "This address doesn’t look complete. Could you check it?",
      turnstile: "The anti-robot check didn’t go through. Try again.",
      mail: "The link couldn’t be sent. Try again in a moment.",
      "invalid-link":
        "This link no longer works: it’s valid for 15 minutes and only works once.",
      unauthorized:
        "Your session has ended: ask for a new link to start syncing again.",
      other: "Something didn’t work. Try again in a moment.",
    },
    today: (time: string) => `today at ${time}`,
    yesterday: (time: string) => `yesterday at ${time}`,
    dayAt: (day: string, time: string) => `${day} at ${time}`,
    statusSyncing: "Syncing…",
    statusWaiting:
      "Can’t reach your account right now: your latest choices will be sent as soon as possible.",
    statusLast: (when: string) => `Last sync: ${when}.`,
    statusNever: "Not synced yet.",
    conflicts: (n: number) =>
      n === 1
        ? "Another version of the same choice has been kept aside: it’s in your data export."
        : `${n} other versions of the same choices have been kept aside: they’re in your data export.`,
  },
);
