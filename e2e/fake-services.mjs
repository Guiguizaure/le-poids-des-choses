// Faux services pour les tests de bout en bout du compte (jamais de vrai e-mail) :
// - faux Resend : POST /emails enregistre le message ; GET /emails?to=… les relit (tests) ;
// - faux Turnstile siteverify : POST /siteverify accepte le jeton « jeton-e2e ».
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
  if (url.pathname === "/") return send(response, 200, { ok: true });
  send(response, 404, { message: "inconnu" });
}).listen(PORT, () =>
  console.log(`Faux services sur http://localhost:${PORT}`),
);
