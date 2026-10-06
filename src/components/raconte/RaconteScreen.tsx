"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { EntryRow } from "@/components/garden/EntryRow";
import { Illustration } from "@/components/illustrations/Illustration";
import {
  Icon,
  PrimaryButton,
  PrimaryLink,
  TextButton,
  TextLink,
} from "@/components/ui/buttons";
import { Switch } from "@/components/ui/Switch";
import { objectNoun, possessive, type ObjectOption } from "@/lib/compare";
import { getGesture } from "@/lib/data";
import type { JournalEntry } from "@/lib/data/types";
import { pictoFor } from "@/lib/journal/display";
import { isComparison, isHabit, isLightChoice } from "@/lib/journal/kind";
import { useJournal } from "@/lib/journal/useJournal";
import { plural } from "@/lib/garden/text";
import { raconte, type RaconteError } from "@/lib/raconte/api";
import { RACONTE_MAX_CHARS, RACONTE_KM_RANGE } from "@/lib/raconte/detections";
import {
  alternativeChoices,
  canBeHabit,
  missingFor,
  proposalEntry,
  proposalHabit,
  toProposal,
  type Proposal,
} from "@/lib/raconte/proposal";
import { useDeclaredHabits } from "@/lib/habits/useDeclaredHabits";
import {
  blockingFor,
  comparedToLabel,
  ERROR_MESSAGES,
  inlineNeed,
  NOTHING_FOUND,
  objectOptionLabel,
  PRIVACY_NOTICE,
  proposalSubtitle,
  rowCheckboxId,
  rowFieldId,
} from "@/lib/raconte/text";
import { useTurnstile } from "@/lib/sync/useTurnstile";

type Row = {
  proposal: Proposal;
  checked: boolean;
  open: boolean;
  /** Distance ou option à remplir dans la carte (gardé une fois rempli : le focus reste). */
  inline: "quantity" | "object-option" | null;
};

type State =
  | { step: "idle" }
  | { step: "reading" }
  | { step: "results"; rows: Row[] }
  | { step: "nothing" }
  | { step: "error"; error: RaconteError }
  | { step: "added"; entries: JournalEntry[] };

const FIELD =
  "border-encre bg-blanc text-corps-m text-encre focus-visible:outline-outremer w-full rounded-[20px] border px-4 pt-4 pb-2 leading-[1.4] focus-visible:outline-2 focus-visible:outline-offset-2";
const SMALL_FIELD =
  "border-encre/30 bg-creme text-corps-s text-encre focus-visible:outline-outremer rounded-xl border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-1";

/** Disponibilité lue une fois (GET /api/raconte) : sans fonctions, l'écran le dit tout de suite. */
function useAvailability(): "checking" | "enabled" | "disabled" {
  const [state, setState] = useState<"checking" | "enabled" | "disabled">(
    "checking",
  );
  useEffect(() => {
    let cancelled = false;
    fetch("/api/raconte", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { enabled?: unknown } | null) => {
        if (!cancelled)
          setState(body?.enabled === true ? "enabled" : "disabled");
      })
      .catch(() => !cancelled && setState("disabled"));
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

/**
 * Écran 08 · Raconte ta journée : la personne écrit, Claude repère les gestes du catalogue, la
 * personne coche ceux qu'elle garde. Rien n'est écrit dans le carnet sans « Ajouter au carnet ».
 */
export function RaconteScreen() {
  const journal = useJournal();
  const [declaredHabits] = useDeclaredHabits();
  const availability = useAvailability();
  const [text, setText] = useState("");
  const [state, setState] = useState<State>({ step: "idle" });
  const { widget, prepare, getToken, consume } = useTurnstile();
  const resultTitle = useRef<HTMLHeadingElement>(null);
  const addedTitle = useRef<HTMLHeadingElement>(null);
  const ids = {
    field: useId(),
    counter: useId(),
    notice: useId(),
    blocking: useId(),
  };

  useEffect(() => {
    if (state.step === "results" || state.step === "nothing")
      resultTitle.current?.focus();
    if (state.step === "added") addedTitle.current?.focus();
  }, [state.step]);

  const disabled = availability === "disabled";
  const reading = state.step === "reading";

  const analyse = async (event: FormEvent) => {
    event.preventDefault();
    if (reading || disabled) return;
    if (text.trim().length === 0 || text.length > RACONTE_MAX_CHARS) {
      setState({ step: "error", error: "text-length" });
      return;
    }
    setState({ step: "reading" });
    const verification = await getToken();
    if (!verification.ok) {
      setState({ step: "error", error: "turnstile" });
      return;
    }
    const result = await raconte(text, verification.token);
    consume();
    if (!result.ok) {
      setState({ step: "error", error: result.error });
      return;
    }
    if (result.detections.length === 0) {
      setState({ step: "nothing" });
      return;
    }
    setState({
      step: "results",
      rows: result.detections.map((detection, index) => {
        // Gestes déclarés dans « Mes habitudes » : notés en habitude par défaut.
        const proposal = toProposal(detection, index, declaredHabits);
        return {
          proposal,
          // Gestes déduits (« À vérifier ») : décochés, la personne choisit.
          checked: detection.certainty === "explicit",
          open: false,
          inline: inlineNeed(proposal),
        };
      }),
    });
  };

  const updateRow = (key: string, change: (row: Row) => Row) =>
    setState((current) =>
      current.step === "results"
        ? {
            ...current,
            rows: current.rows.map((row) =>
              row.proposal.key === key ? change(row) : row,
            ),
          }
        : current,
    );

  const add = () => {
    if (state.step !== "results") return;
    const blocked = blockingFor(state.rows);
    if (blocked) {
      goTo(blocked.focusId);
      return;
    }
    const entries: JournalEntry[] = [];
    for (const row of state.rows) {
      if (!row.checked) continue;
      const habit = proposalHabit(row.proposal);
      const input = habit ? null : proposalEntry(row.proposal);
      if (habit) entries.push(journal.addHabit(habit));
      else if (input) entries.push(journal.add(input));
    }
    setState({ step: "added", entries });
  };

  const restart = () => {
    setText("");
    setState({ step: "idle" });
  };

  if (state.step === "added")
    return (
      <Shell>
        <AddedView
          entries={state.entries}
          titleRef={addedTitle}
          onRestart={restart}
        />
      </Shell>
    );

  const blocking = state.step === "results" ? blockingFor(state.rows) : null;

  return (
    <Shell>
      <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
        Raconte ta journée
      </h1>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        Écris tes gestes comme ils te viennent. Tu vérifies tout avant l’ajout
        au carnet.
      </p>

      <form onSubmit={analyse} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={ids.field} className="sr-only">
            Ta journée, en quelques phrases
          </label>
          <div className="relative">
            <textarea
              id={ids.field}
              value={text}
              maxLength={RACONTE_MAX_CHARS}
              rows={4}
              disabled={disabled}
              onChange={(event) => setText(event.target.value)}
              onFocus={() => void prepare()}
              placeholder="Train Toulon–Marseille ce matin, un burger à midi, et un café en terrasse."
              aria-describedby={`${ids.counter} ${ids.notice}`}
              className={`${FIELD} placeholder:text-texte-attenue resize-none pb-8 disabled:opacity-60`}
            />
            <p
              id={ids.counter}
              className="text-legende text-texte-attenue pointer-events-none absolute right-4 bottom-2.5 text-right"
            >
              {text.length} / {RACONTE_MAX_CHARS}
              <span className="sr-only"> caractères</span>
            </p>
          </div>
          <p
            id={ids.notice}
            className="text-legende text-texte-attenue leading-[1.35]"
          >
            {PRIVACY_NOTICE}{" "}
            <Link
              href="/confidentialite#raconte"
              className="text-encre focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
            >
              En savoir plus
            </Link>
          </p>
        </div>
        <div ref={widget} className="empty:hidden" />
        <PrimaryButton type="submit" disabled={reading || disabled}>
          {reading ? "Claude lit ta journée…" : "Analyser mon texte"}
        </PrimaryButton>
      </form>

      <p className="bg-tomate-douce text-legende text-encre rounded-[14px] px-3 py-2.5 leading-[1.35]">
        Fonction IA à la demande. Elle repère tes gestes, mais ne calcule rien :
        les chiffres viennent de l’ADEME.
      </p>

      <p role="status" aria-live="polite" className="sr-only">
        {reading ? "Claude lit ta journée…" : ""}
      </p>

      {disabled ? <Gentle message={ERROR_MESSAGES.disabled} /> : null}

      {state.step === "error" ? (
        <Gentle message={ERROR_MESSAGES[state.error]} />
      ) : null}

      {state.step === "nothing" ? (
        <section className="flex flex-col gap-3">
          <h2
            ref={resultTitle}
            tabIndex={-1}
            className="font-titre text-titre-m text-encre leading-[1.1] outline-none"
          >
            Rien de reconnu
          </h2>
          <Gentle message={NOTHING_FOUND} />
        </section>
      ) : null}

      {state.step === "results" ? (
        <section
          className="flex flex-col gap-4"
          aria-labelledby="raconte-compris"
        >
          <h2
            id="raconte-compris"
            ref={resultTitle}
            tabIndex={-1}
            className="font-titre text-titre-m text-encre leading-[1.1] outline-none"
          >
            Voici ce que j’ai compris
          </h2>
          <ul className="flex flex-col gap-2" aria-labelledby="raconte-compris">
            {state.rows.map((row) => (
              <ProposalRow
                key={row.proposal.key}
                row={row}
                onChange={(change) => updateRow(row.proposal.key, change)}
              />
            ))}
          </ul>
          {/* aria-disabled plutôt que disabled : le bouton reste touchable et annoncé, et
              mène au premier geste à compléter. */}
          <PrimaryButton
            onClick={add}
            aria-disabled={blocking !== null}
            aria-describedby={blocking ? ids.blocking : undefined}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          >
            Ajouter au carnet
          </PrimaryButton>
          <div
            id={ids.blocking}
            role="status"
            aria-live="polite"
            className="flex justify-center empty:hidden"
          >
            {blocking ? (
              <button
                type="button"
                onClick={() => goTo(blocking.focusId)}
                className="press bg-tomate-douce text-corps-s text-encre focus-visible:outline-outremer rounded-full px-4 py-2 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {blocking.message}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <p className="border-encre text-legende text-encre flex items-center gap-2 rounded-[14px] border border-dashed px-3.5 py-3 leading-[1.35]">
        <Image
          src="/icons/poids.svg"
          alt=""
          width={20}
          height={20}
          className="block shrink-0"
          unoptimized
        />
        <span>
          Chaque analyse consomme un peu d’énergie : elle ne se lance qu’à ta
          demande.{" "}
          <Link
            href="/methode#raconte"
            className="focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
          >
            Voir la méthode
          </Link>
          .
        </span>
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center gap-1 px-5 pt-[22px] pb-2">
        <Link
          href="/comparer"
          className="text-corps-s text-encre focus-visible:outline-outremer -m-1 flex items-center gap-1 rounded-full p-1 leading-[1.3] font-semibold focus-visible:outline-2"
        >
          <Icon name="retour" />
          Comparer
        </Link>
      </div>
      <div className="flex flex-col gap-4 px-5 pt-3 pb-8">{children}</div>
    </main>
  );
}

/** Fait défiler jusqu'à l'élément (sa carte au centre) et y place le focus. */
function goTo(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  (element.closest("li") ?? element).scrollIntoView({
    block: "center",
    behavior: reduced ? "auto" : "smooth",
  });
  element.focus({ preventScroll: true });
}

/** Message doux, toujours avec une autre voie : choisir ses gestes soi-même. */
function Gentle({ message }: { message: string }) {
  return (
    <div className="bg-blanc flex flex-col items-start gap-2 rounded-2xl p-4">
      <p role="status" className="text-corps-s text-encre leading-[1.4]">
        {message}
      </p>
      <TextLink href="/comparer">Choisir mes gestes</TextLink>
    </div>
  );
}

function ProposalRow({
  row,
  onChange,
}: {
  row: Row;
  onChange: (change: (row: Row) => Row) => void;
}) {
  const { proposal } = row;
  const gesture = getGesture(proposal.gestureId);
  const panelId = useId();
  const checkId = rowCheckboxId(proposal.key);
  const detailsId = useId();
  const modeName = useId();
  if (!gesture) return null;
  // À compléter : coché, mais distance ou option manquante.
  const incomplete = row.checked && missingFor(proposal) !== null;
  // Objet dont l'option se choisit dans la carte : « Modifier » n'aurait rien d'autre. Une
  // habitude ne se compare à rien : rien à modifier ni à compléter.
  const habit = proposal.asHabit;
  const editable = !habit && !(row.inline && gesture.unit === "objet");
  const inline = habit ? null : row.inline;
  const set = (patch: Partial<Proposal>) =>
    onChange((current) => ({
      ...current,
      proposal: { ...current.proposal, ...patch },
    }));
  const compared = comparedToLabel(proposal);

  return (
    <li
      className={`bg-blanc flex flex-col gap-3 rounded-2xl border-2 px-3 py-2.5 ${
        incomplete ? "border-tomate" : "border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex size-[22px] shrink-0">
          <input
            id={checkId}
            type="checkbox"
            aria-describedby={detailsId}
            checked={row.checked}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                checked: event.target.checked,
              }))
            }
            className="peer border-encre checked:bg-encre focus-visible:outline-outremer size-[22px] cursor-pointer appearance-none rounded-[6px] border-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          <svg
            aria-hidden
            viewBox="0 0 22 22"
            className="pointer-events-none absolute inset-0 hidden size-[22px] peer-checked:block"
          >
            <path
              d="M6 11.5L9.2 14.7L16 8"
              fill="none"
              stroke="var(--color-creme)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <Illustration name={pictoFor(gesture.id)} className="size-7 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <label
            htmlFor={checkId}
            className="text-corps-s text-encre cursor-pointer leading-[1.3] font-semibold"
          >
            {gesture.label}
          </label>
          <span id={detailsId} className="flex flex-col items-start gap-0.5">
            <span className="text-legende text-texte-attenue leading-[1.35]">
              {proposalSubtitle(proposal)}
            </span>
            {compared ? (
              <span className="text-legende text-texte-attenue leading-[1.35]">
                {compared}
              </span>
            ) : null}
            {proposal.certainty === "inferred" ? (
              <span className="bg-soleil text-legende text-encre mt-1 rounded-full px-2 py-[3px] leading-[1.3] font-semibold">
                À vérifier
              </span>
            ) : null}
          </span>
        </div>
        {editable ? (
          <TextButton
            aria-expanded={row.open}
            aria-controls={panelId}
            onClick={() =>
              onChange((current) => ({ ...current, open: !current.open }))
            }
            className="text-legende shrink-0"
          >
            Modifier<span className="sr-only"> {gesture.label}</span>
          </TextButton>
        ) : null}
      </div>
      {canBeHabit(proposal) ? (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="sr-only">
            Comparer {gesture.label} ou le noter en habitude
          </legend>
          <label className="text-corps-s text-encre flex cursor-pointer items-center gap-2.5 leading-[1.3]">
            <input
              type="radio"
              name={modeName}
              checked={!habit}
              onChange={() => set({ asHabit: false })}
              className="accent-encre size-4"
            />
            Comparer
          </label>
          <label className="text-corps-s text-encre flex cursor-pointer items-center gap-2.5 leading-[1.3]">
            <input
              type="radio"
              name={modeName}
              checked={habit}
              onChange={() => set({ asHabit: true })}
              className="accent-encre size-4"
            />
            Habitude tenue (aucun kg : elle arrose ton jardin)
          </label>
        </fieldset>
      ) : null}
      {inline === "quantity" ? (
        <DistanceField
          id={rowFieldId(proposal.key)}
          label="Distance du trajet (km)"
          proposal={proposal}
          onSet={set}
        />
      ) : null}
      {inline === "object-option" ? (
        <ObjectOptions
          firstId={rowFieldId(proposal.key)}
          proposal={proposal}
          onSet={set}
        />
      ) : null}
      {row.open && editable ? (
        <div
          id={panelId}
          className="border-encre/15 flex flex-col gap-3 border-t pt-3"
        >
          <ProposalEditor
            proposal={proposal}
            onSet={set}
            withPrimary={inline === null}
          />
        </div>
      ) : null}
    </li>
  );
}

function DistanceField({
  id,
  label,
  proposal,
  onSet,
}: {
  id: string;
  label: string;
  proposal: Proposal;
  onSet: (patch: Partial<Proposal>) => void;
}) {
  const hintId = useId();
  const [distance, setDistance] = useState(
    proposal.quantity === null ? "" : String(proposal.quantity),
  );
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-corps-s text-encre leading-[1.3] font-semibold"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={RACONTE_KM_RANGE.min}
        max={RACONTE_KM_RANGE.max}
        step={1}
        value={distance}
        aria-describedby={hintId}
        onChange={(event) => {
          setDistance(event.target.value);
          const value = Number(event.target.value);
          onSet({
            quantity:
              event.target.value !== "" &&
              Number.isInteger(value) &&
              value >= RACONTE_KM_RANGE.min &&
              value <= RACONTE_KM_RANGE.max
                ? value
                : null,
          });
        }}
        className={`${SMALL_FIELD} w-32`}
      />
      <span id={hintId} className="text-legende text-texte-attenue">
        Un nombre entier, de {RACONTE_KM_RANGE.min} à{" "}
        {RACONTE_KM_RANGE.max.toLocaleString("fr-FR")} km.
      </span>
    </div>
  );
}

function ObjectOptions({
  firstId,
  proposal,
  onSet,
}: {
  firstId?: string;
  proposal: Proposal;
  onSet: (patch: Partial<Proposal>) => void;
}) {
  const name = useId();
  const options: ObjectOption[] = ["neuf", "occasion", "garder"];
  return (
    <>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-corps-s text-encre mb-1 leading-[1.3] font-semibold">
          Neuf, d’occasion, ou tu gardes{" "}
          {possessive(objectNoun(proposal.gestureId), "toi")} ?
        </legend>
        {options.map((option, index) => (
          <label
            key={option}
            className="text-corps-s text-encre flex cursor-pointer items-center gap-2.5"
          >
            <input
              id={index === 0 ? firstId : undefined}
              type="radio"
              name={name}
              checked={proposal.objectOption === option}
              onChange={() => onSet({ objectOption: option })}
              className="accent-encre size-4"
            />
            {objectOptionLabel(proposal.gestureId, option)}
          </label>
        ))}
      </fieldset>
      {proposal.objectOption === "occasion" ? (
        <Switch
          checked={proposal.delivered}
          onChange={(delivered) => onSet({ delivered })}
        >
          Livré en colis
        </Switch>
      ) : null}
    </>
  );
}

/** Panneau « Modifier » : distance ou option (si elles ne sont pas déjà dans la carte), option comparée. */
function ProposalEditor({
  proposal,
  onSet,
  withPrimary,
}: {
  proposal: Proposal;
  onSet: (patch: Partial<Proposal>) => void;
  withPrimary: boolean;
}) {
  const gesture = getGesture(proposal.gestureId)!;
  const distanceId = useId();
  const comparedId = useId();

  if (gesture.unit === "objet")
    return <ObjectOptions proposal={proposal} onSet={onSet} />;

  return (
    <>
      {gesture.unit === "km" && withPrimary ? (
        <DistanceField
          id={distanceId}
          label="Distance du trajet (km)"
          proposal={proposal}
          onSet={onSet}
        />
      ) : null}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={comparedId}
          className="text-corps-s text-encre leading-[1.3] font-semibold"
        >
          Comparé à
        </label>
        <select
          id={comparedId}
          value={proposal.alternativeId ?? ""}
          onChange={(event) => onSet({ alternativeId: event.target.value })}
          className={SMALL_FIELD}
        >
          {alternativeChoices(proposal).map((id) => (
            <option key={id} value={id}>
              {getGesture(id)?.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function AddedView({
  entries,
  titleRef,
  onRestart,
}: {
  entries: JournalEntry[];
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const now = new Date();
  const lastLight = [...entries].reverse().find(isLightChoice);
  const lastHabit = [...entries].reverse().find(isHabit);
  const hasHeavier = entries.some(
    (entry) => isComparison(entry) && entry.avoidedKg === 0,
  );
  return (
    <>
      <h1
        ref={titleRef}
        tabIndex={-1}
        className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
      >
        C’est noté dans ton carnet
      </h1>
      <p role="status" className="text-corps-s text-encre leading-[1.4]">
        {plural(entries.length, "geste ajouté", "gestes ajoutés")} à ton carnet.
      </p>
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} now={now} />
        ))}
      </ul>
      {hasHeavier ? (
        <p className="text-legende text-texte-attenue leading-[1.4]">
          Un choix plus lourd est simplement noté : rien n’est retiré au jardin.
        </p>
      ) : null}
      <PrimaryLink
        href={
          lastLight
            ? `/jardin?nouveau=${encodeURIComponent(lastLight.id)}`
            : lastHabit
              ? `/jardin?arrose=${encodeURIComponent(lastHabit.id)}`
              : "/jardin"
        }
      >
        Voir mon jardin
      </PrimaryLink>
      <TextButton onClick={onRestart}>Raconter autre chose</TextButton>
    </>
  );
}
