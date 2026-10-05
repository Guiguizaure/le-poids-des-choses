-- Lot V2-2 : compte optionnel (lien magique) et synchronisation du carnet.
-- Toutes les dates sont en millisecondes depuis l'epoch (INTEGER).

-- Comptes : créés seulement quand un lien est utilisé (une adresse mal tapée ne crée rien).
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  created_at    INTEGER NOT NULL,
  -- Connexion ou synchro (au plus une écriture par jour) : purge après 24 mois d'inactivité.
  last_seen_at  INTEGER NOT NULL
);
CREATE INDEX users_last_seen ON users(last_seen_at);

-- Liens magiques : seul le hachage SHA-256 du jeton est stocké. Valables 15 min, usage unique.
CREATE TABLE login_tokens (
  token_hash  TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  used_at     INTEGER
);
CREATE INDEX login_tokens_email ON login_tokens(email);
CREATE INDEX login_tokens_expires ON login_tokens(expires_at);

-- Sessions : le cookie porte le jeton, la base n'en garde que le hachage. 90 jours, fixe.
CREATE TABLE sessions (
  token_hash  TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);
CREATE INDEX sessions_expires ON sessions(expires_at);

-- Carnet : une ligne par version d'entrée, jamais modifiée (append-only). Deux versions
-- différentes d'une même entrée (conflit) sont gardées toutes les deux.
CREATE TABLE journal_entries (
  seq           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_id      TEXT NOT NULL,
  payload       TEXT NOT NULL,
  payload_hash  TEXT NOT NULL,
  received_at   INTEGER NOT NULL,
  UNIQUE (user_id, entry_id, payload_hash)
);
CREATE INDEX journal_user_seq ON journal_entries(user_id, seq);

-- Limites de débit : fenêtres fixes ; la clé contient un HMAC de l'e-mail ou de l'IP.
CREATE TABLE rate_limits (
  bucket        TEXT NOT NULL,
  window_start  INTEGER NOT NULL,
  count         INTEGER NOT NULL,
  PRIMARY KEY (bucket, window_start)
);
CREATE INDEX rate_limits_window ON rate_limits(window_start);

-- Tâches d'entretien (dernière purge) : au plus une fois par jour.
CREATE TABLE maintenance (
  name    TEXT PRIMARY KEY,
  ran_at  INTEGER NOT NULL
);
