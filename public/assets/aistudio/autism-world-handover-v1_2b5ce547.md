# Autism World — Learning Module Handover
**Project:** autism.ke (Autism Unmasked Kenya)
**Component:** Autism World — video-scenario social communication module
**Target:** Competition submission, August 22
**Status:** Spec for build. Not yet implemented.
**Owner:** Kwameh J. Dande (YB)
**Prepared for:** Cordex (build agent)

---

## 1. Purpose

Autism World is a library of short, curated social-interaction scenarios (school setting, home setting) that teach children with autism to recognise and produce appropriate conversational responses. It extends the existing micro-lesson architecture (`MicroLesson.jsx`, spaced repetition, in-memory mastery) with a video-backed scenario type, rather than replacing it.

This is a **content-and-integration** build, not a new engine. The mastery/spaced-repetition core stays as-is. The new surface area is: (a) a scenario data model, (b) a YouTube-embedded player wrapper with timestamped interaction points, (c) a response-quiz overlay.

---

## 2. Explicit scope boundary

**In scope for Aug 22:**
- 3–4 curated scenarios (2 school, 2 home), each mapped to specific YouTube video IDs and timestamp ranges
- Player wrapper component with pause-at-timestamp and quiz-overlay behaviour
- Scenario nodes wired into the existing concept graph (World Knowledge Engine) as a new node type
- Mastery tracking reusing the existing in-memory mastery store — no new persistence layer

**Explicitly out of scope for this submission:**
- Any downloading, re-hosting, or transformation of video content
- Owned/filmed/illustrated content (flagged as v2 direction, see §7)
- Offline playback
- Content moderation tooling or a scenario-authoring UI
- More than 4 scenarios

Cordex should not expand scope beyond this without a spec revision.

---

## 3. Data model

Extend the concept graph with a `scenario` node type. Do not create a parallel data structure.

```ts
interface ScenarioNode {
  id: string;                    // e.g. "sch-join-group-01"
  type: "scenario";
  setting: "school" | "home";
  communication_goal: string;    // e.g. "requesting to join an activity"
  difficulty: 1 | 2 | 3;
  video_id: string;               // YouTube video ID only, never a URL with tracking params
  start_seconds: number;
  end_seconds: number;
  interaction_points: InteractionPoint[];
  related_scenario_ids: string[]; // graph edges, mirrors existing edge pattern
}

interface InteractionPoint {
  at_seconds: number;
  prompt: string;                 // "What would you say here?"
  options: QuizOption[];
  correct_option_id: string;
}

interface QuizOption {
  id: string;
  text: string;
}
```

Source this list from a static `scenarios.json` seed file for the demo. No CMS or authoring UI required at this stage.

---

## 4. Player component spec

New component: `ScenarioPlayer.jsx`, composed inside `MicroLesson.jsx` when a lesson's active node is of type `scenario`.

**Requirements:**
- Use the official YouTube IFrame Player API (`https://www.youtube.com/iframe_api`). No third-party wrappers, no download of video assets, no server-side proxying of YouTube content.
- Player initialised with `playerVars`: `controls: 0`, `modestbranding: 1`, `rel: 0`, `start`/`end` bound to the scenario's `start_seconds`/`end_seconds`.
- Poll `getCurrentTime()` on an interval (250–500ms) against `interaction_points`. On match, call `pauseVideo()` and render the quiz overlay — do not rely on `onStateChange` alone, it is not precise enough for timestamp triggers.
- On correct answer: resume playback via `seekTo` + `playVideo()`, record mastery event through the existing mastery hook (same call signature as text-based micro-lessons — do not create a second mastery path).
- On incorrect answer: replay the 3–5 seconds preceding the interaction point, then re-prompt. Do not replay from `start_seconds`.
- Hard fail state: if the YouTube API fails to load or a video is unavailable (deleted/region-blocked), fall back to a static "scenario unavailable" card and log the `video_id` — do not let the lesson silently break. This is a known fragility (see §7) and needs a visible failure mode, not a blank screen, especially for a judge demo.

**Explicitly forbidden:**
- No `ytimg` scraping, no download of video/audio streams, no embedding via anything other than the official iframe embed
- No autoplay-on-load without a user-initiated start (accessibility and predictability requirement for this user group — sudden playback is a known sensory concern, not just a UX preference)

---

## 5. Judge-facing demo control

Reuse the existing judge-facing demo control pattern from `MicroLesson.jsx` (the control that lets a judge skip/reset lesson state on demand). Extend it to:
- Jump directly to any of the 4 seed scenarios
- Reset mastery state for the demo session without reloading the app
- Force an interaction point to trigger immediately, for demo pacing, without waiting for real-time video playback

---

## 6. Curation checklist (content, not code — YB to complete before Cordex wires the JSON)

For each of the 4 scenarios:
- [ ] Video ID confirmed, embeddable (not blocked from embedding by uploader settings)
- [ ] Clear, single social exchange within the chosen time range — no scene cuts mid-exchange
- [ ] Facial expressions and speaker turn-taking visible and unambiguous
- [ ] Timestamp(s) for interaction points identified to the second
- [ ] Setting matches label (school/home) unambiguously in frame

---

## 7. Known limitations — carry into pitch materials, do not omit

This section exists so the trade-off is documented institutionally, not lost in chat history:

- **Content is not owned.** All scenario video is third-party YouTube content, embedded under YouTube's standard embed terms. This is acceptable for a competition demonstration of the engine, but is a stated v2 gap for any scaling or licensing conversation.
- **No offline mode.** Requires live connectivity to YouTube at runtime. Not suitable as-is for low-connectivity deployment contexts, which is a realistic constraint for the target population.
- **Availability risk.** A creator can remove, block, or replace a video at any time, silently breaking a scenario node. No automated monitoring is in scope for this submission — this is a manual-check liability until v2.
- **No editorial control over source content.** Pacing, framing, and background clutter are constraints of the source video, not something the module can correct. Flagged here so it isn't reintroduced as a surprise limitation during judging Q&A.

**v2 direction (not being built now):** replace embedded third-party video with owned/commissioned illustrated scenario sequences, using the same `ScenarioNode` schema — `video_id`/`timestamp` fields would be replaced by a frame-sequence reference, but the graph structure, mastery integration, and interaction-point model carry over unchanged. Flag this compatibility explicitly to Cordex so the schema isn't built in a way that requires a rewrite later.

---

## 8. Acceptance criteria for this handover

- [ ] 4 scenario nodes load correctly into the existing concept graph structure
- [ ] Video plays only within its bounded `start_seconds`–`end_seconds` range
- [ ] All interaction points trigger a pause and quiz overlay within ~500ms of the target timestamp
- [ ] Mastery events from scenario completion appear in the same mastery store as existing text-based micro-lessons
- [ ] Judge demo control can jump to any scenario and reset state without a full reload
- [ ] Unavailable-video fallback state renders instead of a blank/broken player
