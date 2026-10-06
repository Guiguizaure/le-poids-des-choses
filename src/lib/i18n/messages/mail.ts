// E-mail de connexion (lien magique), dans la langue de la page où le lien a été demandé.
import { defineMessages } from "../index";

export const MAGIC_LINK_MAIL = defineMessages(
  {
    subject: "Ton lien pour retrouver ton jardin",
    hello: "Bonjour,",
    intro:
      "Voici ton lien pour te connecter au Poids des choses et retrouver ton jardin",
    button: "Retrouver mon jardin",
    validity: "Il est valable 15 minutes et ne sert qu’une fois.",
    ignore:
      "Si tu n’as rien demandé, ignore ce message : sans clic, rien ne se passe.",
    fallback:
      "Le bouton ne marche pas ? Copie cette adresse dans ton navigateur :",
    signature: "Le poids des choses",
    colon: " :",
  },
  {
    subject: "Your link to find your garden",
    hello: "Hello,",
    intro:
      "Here’s your link to sign in to Le poids des choses and find your garden",
    button: "Find my garden",
    validity: "It’s valid for 15 minutes and only works once.",
    ignore:
      "If you didn’t ask for anything, just ignore this message: nothing happens without a click.",
    fallback: "Button not working? Copy this address into your browser:",
    signature: "Le poids des choses",
    colon: ":",
  },
);
