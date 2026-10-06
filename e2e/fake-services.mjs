// Faux services pour les tests de bout en bout du compte (jamais de vrai e-mail) :
// - faux Resend : POST /emails enregistre le message ; GET /emails?to=… les relit (tests) ;
// - faux Turnstile siteverify : POST /siteverify accepte le jeton « jeton-e2e » ;
// - faux Anthropic : POST /v1/messages repère quelques mots-clés (aucun appel réel à Claude).
import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 4330);
const mails = [];

function readBody(request) {
  return new Promise((resolve) => {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => resolve(body));
  });
}

function send(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

/** Mots-clés du faux Anthropic : l'extrait renvoyé est le passage trouvé dans le texte. */
const FAKE_GESTURES = [
  { pattern: /pris le TER/i, gestureId: "ter", certainty: "explicit" },
  { pattern: /un burger/i, gestureId: "repas-boeuf", certainty: "inferred" },
  { pattern: /un café/i, gestureId: "cafe", certainty: "explicit" },
  { pattern: /à pied/i, gestureId: "marche", certainty: "explicit" },
  {
    pattern: /une voiture de (\d+) km/i,
    gestureId: "voiture",
    certainty: "explicit",
    km: true,
  },
  {
    pattern: /un jean d.occasion/i,
    gestureId: "jean",
    certainty: "explicit",
    mode: "occasion",
  },
];

function fakeClaude(body) {
  const content = body.messages?.[0]?.content ?? "";
  const text = content.replace(/^<journee>\n?|\n?<\/journee>$/g, "");
  if (text.includes("panne-e2e")) return null;
  const gestures = [];
  for (const rule of FAKE_GESTURES) {
    const match = text.match(rule.pattern);
    if (!match) continue;
    gestures.push({
      excerpt: match[0],
      gestureId: rule.gestureId,
      certainty: rule.certainty,
      quantity: rule.km ? Number(match[1]) : null,
      mode: rule.mode ?? null,
    });
  }
  return {
    id: "msg_faux_e2e",
    type: "message",
    role: "assistant",
    model: body.model,
    content: [{ type: "text", text: JSON.stringify({ gestures }) }],
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: { input_tokens: 1000, output_tokens: 50 },
  };
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  if (request.method === "POST" && url.pathname === "/emails") {
    if (request.headers.authorization !== "Bearer re_faux_e2e")
      return send(response, 401, { message: "clé refusée" });
    const mail = JSON.parse(await readBody(request));
    mails.push({ ...mail, receivedAt: Date.now() });
    return send(response, 200, { id: `faux-${mails.length}` });
  }
  if (request.method === "GET" && url.pathname === "/emails") {
    const to = url.searchParams.get("to");
    return send(
      response,
      200,
      mails.filter((mail) => !to || mail.to.includes(to)),
    );
  }
  if (request.method === "POST" && url.pathname === "/siteverify") {
    const params = new URLSearchParams(await readBody(request));
    return send(response, 200, {
      success:
        params.get("secret") === "secret-faux-e2e" &&
        params.get("response") === "jeton-e2e",
    });
  }
  if (request.method === "POST" && url.pathname === "/v1/messages") {
    if (request.headers["x-api-key"] !== "sk-ant-faux-e2e")
      return send(response, 401, {
        type: "error",
        error: { type: "authentication_error" },
      });
    const reply = fakeClaude(JSON.parse(await readBody(request)));
    if (!reply)
      return send(response, 500, {
        type: "error",
        error: { type: "api_error" },
      });
    return send(response, 200, reply);
  }
  if (url.pathname === "/") return send(response, 200, { ok: true });
  send(response, 404, { message: "inconnu" });
}).listen(PORT, () =>
  console.log(`Faux services sur http://localhost:${PORT}`),
);
