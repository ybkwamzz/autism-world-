# World Knowledge Engine & Autism World Learning Module (v2)

This v2 architecture pairs the **World Knowledge Engine** semantic graph and **Autism World** bounded video scenarios with an explicit **Pattern Lab** layer (`Predict → Generalize → Practice`), separating rote recall from measurable pattern acquisition while enforcing child-safe visual ergonomics, varied exemplars, errorless-to-fade scaffolding, and institutional-grade per-child consent and append-only progress records.

## User Review & Critical Decisions

> [!IMPORTANT]
> This revised v2 plan integrates your complete Pattern Lab, Held-Out Transfer Testing, Errorless-to-Fade Scaffolding, Child vs. Caregiver View Separation, and Per-Child Institutional Record specifications.

- **Three Consumption Layers Over One Graph**:
  1. **Passive Layer (`Observe → Recognize`)**: Fixed 4-beat cadence (*what, does, used for, found*) with selectable `5s / 8s / 10s / 15s` pacing and **varied exemplars** (at least 3 distinct visual illustrations/photos per concept plus optional caregiver-uploaded photo) so learners acquire the concept category rather than memorizing a single picture.
  2. **Interactive Layer (`Name → Understand → Relate`)**: Split into a **Child View** (large visual cards, tap to hear name and explore 3–4 icon-only neighbor nodes with zero technical jargon) and a **Caregiver View** (full semantic attribute profile and neighbors grouped by typed relation `is_a`, `part_of`, `contrasts_with`, `precedes`, etc. with pedagogical explanations).
  3. **Pattern Lab Layer (`Predict → Generalize → Practice`)**: Deterministic, code-generated tasks (`predict_next_beat`, `odd_one_out`, `sort_group`, `transfer_slot`, `cue_transfer`) that test prediction and generalization directly from graph edges—with zero LLM output in any child-facing context.
- **Expanded 24-Concept Graph with 6 Held-Out Transfer Items**: Expands the bilingual (English & Kiswahili) seed graph from 8 to 24 concepts across foods, animals, objects, places, verbs, and emotions, reserving 6 `held_out: true` concepts that never appear in the Passive Layer so `transfer_slot` tasks measure genuine generalization.
- **Separate Recall vs. Pattern Acquisition Ledger**: Tracks Leitner recall boxes (`recall_state`) separately from pattern acquisition (`pattern_progress`: `emerging | consolidating | acquired`), requiring $\ge 80\%$ accuracy on held-out items at scaffold level `S1` or lower across $\ge 3$ sessions on $\ge 3$ distinct days.
- **Per-Child Profiles, Versioned Consent & Append-Only Audit Trail**: Scopes `consent_records`, append-only `exposures` and `task_attempts`, `recall_state`, `pattern_progress`, and `caregiver_notes` to individual child profiles (`child_profiles`) with an offline sync queue, data export/deletion, immediate lock on consent revocation, and privacy-enhanced YouTube (`youtube-nocookie.com`) embedding.
- **Strict AI Boundary (`child_active` vs. `caregiver_general`)**: Lumo is restricted exclusively to `caregiver_general` mode (helping caregivers interpret pattern progress or draft notes) and is never active or invoked during `child_active` sessions.

---

## 1. Overview & Core Concept

- **What It Does**: A bilingual (English and Kiswahili) learning and clinical observation workspace where autistic learners build concept recognition at a predictable pace (`Observe → Recognize`), explore visual relationships (`Name → Understand → Relate`), and complete structured generalization tasks (`Predict → Generalize → Practice`) alongside bounded school and home video scenarios.
- **Target Audience / Persona**: Autistic children and their parents, guardians, teachers, and speech-language / behavioral clinicians across Kenya.
- **Key Value**: Moves beyond passive exposure and flashcard recall to prove whether a learner has internalized transferable semantic and social patterns—providing caregivers and clinicians with transparent, auditable evidence of generalization.

---

## 2. User Experience & Visual Design

### Key User Flows

#### Flow 1: Caregiver Consent & Child Profile Management
1. A guardian creates or selects a **Child Profile** using only an alias and language preference (`English` or `Kiswahili`)—no full legal name or sensitive PII required.
2. Before any learning session unlocks, a plain-language **Caregiver Consent Screen** details:
   - What learning events are recorded (exposures, task attempts, caregiver notes),
   - Who has access (the guardian and explicitly granted care-team members),
   - How video scenarios are delivered (privacy-enhanced `youtube-nocookie.com` domain with `controls: 0` and no autoplay),
   - How to export or permanently delete the child's records at any time.
3. Granting consent writes a versioned entry to `consent_records` (`child_id`, `scope`, `version`, `granted_at`). Revoking consent immediately locks the child session and surfaces one-click JSON/CSV export and data deletion controls.
4. A persistent **Review Consent & Privacy** control remains accessible in the workspace header.

#### Flow 2: Passive Layer (`Observe → Recognize`)
- Displays only the 18 non-held-out concepts (`held_out: false`).
- Follows the invariant 4-beat sequence: **1. What is it? → 2. What does it do? → 3. What is it used for? → 4. Where is it found?**
- **Varied Exemplars**: Each beat or repetition rotates across at least 3 distinct visual exemplars (e.g., red whole apple, green sliced apple, market basket of apples, plus optional caregiver-uploaded photo scoped privately to the child) so the child generalizes across visual variations.
- Selectable beat pacing (`5s`, `8s`, `10s`, `15s`) with a smooth progress bar, pause/resume button, and bilingual read-aloud. Completing all 4 beats appends an immutable entry to `exposures`.

#### Flow 3: Interactive Layer (`Name → Understand → Relate`)
- **Child View (`child_active` mode)**: High-contrast, low-language visual canvas. Tapping the central concept speaks its name and displays 3–4 large icon-only neighbor cards connected by visual pathways (e.g., *Apple* connects to *Tree*, *Cup*, *Market*). Tapping any neighbor navigates directly to that node without displaying edge-type jargon.
- **Caregiver View (`caregiver_general` mode)**: Displays the full semantic node profile (category, sensory/functional attributes, `found_in`, `used_for`, `actions`) and neighbors grouped by explicit typed relations (`is_a`, `part_of`, `used_for`, `found_in`, `contrasts_with`, `causes`, `precedes`, `associated_with`) with clinical explanation copy.

#### Flow 4: Pattern Lab (`Predict → Generalize → Practice`)
- Runs structured, low-stress sessions of **5 to 8 deterministically generated tasks** with a calm visual progress bar and zero time pressure:
  1. `predict_next_beat`: Shows the first two beats of a concept and asks the learner to tap the visual symbol for the next beat (*does*, *used for*, or *found*).
  2. `odd_one_out`: Presents 3–4 visual items (e.g., *Apple*, *Banana*, *Ball*) drawn from `is_a` and `contrasts_with` edges; learner taps the item that does not belong.
  3. `sort_group`: Interactive sorting of concept cards into category buckets (*Food*, *Animals*, *Household Objects*, *Places*) driven by `is_a` edges.
  4. `transfer_slot`: Presents one of the **6 held-out concepts (`held_out: true`)** never shown in the Passive Layer and asks a slot question (*"Where is it found?"* or *"What is it used for?"*) using environment/purpose icons.
  5. `cue_transfer`: Connects paired school and home video scenarios via `related_scenario_ids` and `precedes` edges, asking the learner to apply a practiced social response from one setting (e.g., school) to a parallel situation in another setting (e.g., home).
- **Errorless-First & Scaffolding Fade**:
  - Dynamically adjusts **Choice Level** (`L1: 2 choices` → `L2: 3 choices` → `L3: 4 choices with plausible distractor`) and **Scaffold Level** (`S3: audio + label + visual hint` → `S2: audio + label` → `S1: label only` → `S0: image only`).
  - Advances after $\ge 80\%$ accuracy over the last 5 attempts at the current tier; steps back one tier after 2 consecutive errors.
  - Incorrect responses never show a red failure screen; instead, the interface gently demonstrates the correct relationship and re-offers the task with supportive scaffolding.

#### Flow 5: Autism World Video Scenarios (Privacy-Enhanced & Paired)
- All 4 curated scenarios (2 school: `sch-join-group-01`, `sch-ask-help-01`; 2 home: `hom-ask-snack-01`, `hom-end-playtime-01`) use the privacy-enhanced YouTube embed domain (`https://www.youtube-nocookie.com`), initialized idle with `controls: 0`, `modestbranding: 1`, `rel: 0`, and bounded `start_seconds` / `end_seconds`.
- Polls `getCurrentTime()` every `250ms` to pause at each `interaction_point` and surface the response quiz.
- Correct answers celebrate, log the attempt, and resume playback; incorrect answers rewind `4 seconds` (`Math.max(start_seconds, at_seconds - 4)`) to replay the social cue.
- Unavailable videos log `console.warn("Scenario video unavailable:", video_id)` and render a structured fallback card with full quiz practice and `cue_transfer` linkage.

#### Flow 6: Caregiver & Clinician Dashboard
- Displays per-child metrics separated into **Recall Mastery (Leitner Boxes 1–4)** and **Pattern Acquisition Status (`Emerging` → `Consolidating` → `Acquired`)** across each of the 5 pattern task types.
- Translates raw attempt logs into plain-language clinical summaries (e.g., *"Sorted foods vs. toys at Scaffold S1 (label only) with 85% accuracy across 3 sessions"*), alongside a clinical review parameter badge noting that thresholds (`80%`, `3 sessions`, `3 days`) are configurable by an SLP/ABA practitioner.
- Includes per-unit auto-saving caregiver notes and care-team access management.

### Visual Identity & Sensory Accessibility
- **60-30-10 Warm Kenyan Editorial Palette**:
  - **60% Canvas**: Warm Cream (`#FFF8EE`) in light mode / Warm Obsidian (`#181512`) in dark mode.
  - **30% Structural Surfaces**: Crisp White (`#FFFFFF`) / Deep Stone (`#231E1A`) cards with hairline borders.
  - **10% Focal Accents**: Warm Amber (`#C77700`) and Golden Marigold (`#E89B2E`) for active learning prompts; Acacia Green (`#2F6B4F`) for verified mastery and calm guidance.
- **Sensory Accessibility Controls**: Dedicated **Reduced Motion** toggle (disables celebratory burst animations and transitions) and **Quiet Mode** toggle (mutes all synthetic chimes/voice prompts for sound-sensitive learners) in the workspace toolbar.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Deterministic Graph Task Generator Over Generative AI for Child Sessions**
  - *Chosen Approach*: Every Pattern Lab task is synthesized deterministically from graph nodes, typed edges, and `held_out` flags. Lumo AI is strictly disabled when `mode === 'child_active'` and available only in `caregiver_general` mode.
  - *Why*: Guarantees 100% predictable, hallucination-free, clinically auditable tasks for autistic children.
- **Decision 2: Held-Out Concept Partition (`18 Taught` + `6 Held-Out`)**
  - *Chosen Approach*: Partition the 24-concept graph so 6 concepts (`held_out: true` across food, animals, objects, places, verbs, emotions) are excluded from the Passive Layer and surfaced exclusively in `transfer_slot` and `odd_one_out` / `sort_group` generalization checks.
  - *Why*: If a child has already memorized all 4 beats of a concept in the Passive Layer, answering *"Where is it found?"* only proves recall; testing on held-out concepts proves true pattern generalization.
- **Decision 3: Append-Only Attempt Ledger with Local-to-Server Sync Architecture**
  - *Chosen Approach*: Structure `exposures` and `task_attempts` as append-only records scoped to `child_id`, backed by a persistent local offline queue and server API endpoints (`/api/learning/*`) ready for Supabase RLS synchronization.
  - *Why*: Ensures auditability (never mutating historical attempt rows) while maintaining uninterrupted responsiveness on uneven Kenyan mobile connections.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                 Per-Child Institutional Store & Offline Queue                │
│  • child_profiles (alias, lang)    • consent_records (versioned, revocable)  │
│  • exposures (append-only)         • task_attempts (append-only ledger)      │
│  • recall_state (Leitner boxes)    • pattern_progress (emerging..acquired)   │
│  • caregiver_notes & care_team     • 24-Node Knowledge Graph (6 held_out)    │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│             Caregiver Consent Gate & Child Profile Switcher                  │
│  • Verifies active consent per child_id before unlocking any session         │
│  • Discloses youtube-nocookie.com embedding, data scope, export & deletion   │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ (Active Consent Verified)
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│          World Knowledge Engine & Autism World Workspace (MicroLesson)       │
├────────────────────────┬───────────────────────────┬─────────────────────────┤
│ Mode & Sensory Bar     │ Central Learning Stage    │ Caregiver Dashboard &   │
│                        │                           │ Clinical Insights       │
│ • Child Active vs.     │ ┌───────────────────────┐ │                         │
│   Caregiver Mode       │ │ 1. Passive Layer      │ │ • Plain-language        │
│ • Quiet Mode &         │ │  • 18 taught concepts │ │   Pattern Acquisition   │
│   Reduced Motion       │ │  • 3+ varied exemplars│ │   summary per task type │
│ • Curriculum Navigator │ │  • 5/8/10/15s beats   │ │ • Separate Leitner      │
│   (Filter & Due Queue) │ ├───────────────────────┤ │   Recall vs. Pattern    │
│                        │ │ 2. Interactive Layer  │ │   Mastery meters        │
│                        │ │  • Child Visual View  │ │ • Scaffold & Choice     │
│                        │ │  • Caregiver Edge View│ │   ladder telemetry      │
│                        │ ├───────────────────────┤ │ • Clinician threshold   │
│                        │ │ 3. Pattern Lab        │ │   calibration controls  │
│                        │ │  • predict_next_beat  │ │ • Auto-saved per-child  │
│                        │ │  • odd_one_out        │ │   caregiver notes       │
│                        │ │  • sort_group         │ │ • Lumo AI Assistant     │
│                        │ │  • transfer_slot (6)  │ │   (caregiver_general    │
│                        │ │  • cue_transfer       │ │    mode ONLY)           │
│                        │ │  • L1-L3 / S3-S0 fade │ │                         │
│                        │ ├───────────────────────┤ │                         │
│                        │ │ 4. ScenarioPlayer     │ │                         │
│                        │ │  • youtube-nocookie   │ │                         │
│                        │ │  • controls:0, 250ms  │ │                         │
│                        │ │  • 4s rewind & paired │ │                         │
│                        │ └───────────────────────┘ │                         │
└────────────────────────┴───────────────────────────┴─────────────────────────┘
```

### Data Model & State
- **Knowledge Graph (`ConceptNode` & `ConceptEdge`)**:
  - `24 ConceptNodes` (`18 taught`, `6 held_out: true`) across `food`, `animal`, `object`, `place`, `verb`, and `emotion` subcategories.
  - Each `ConceptNode` includes `exemplars[]` (at least 3 distinct visual SVG/illustration variants + support for a caregiver-uploaded photo scoped to `child_id`), `beats` (`what`, `does`, `usedFor`, `found` in both English and Kiswahili), `attributes`, `found_in[]`, `used_for[]`, and `actions[]`.
  - `ConceptEdges` encode explicit directional relations (`is_a`, `part_of`, `used_for`, `found_in`, `contrasts_with`, `causes`, `precedes`, `associated_with`) with bilingual caregiver explanations.
- **Deterministic Pattern Task (`PatternTask`)**:
  - `id`, `type` (`predict_next_beat | odd_one_out | sort_group | transfer_slot | cue_transfer`), `source_relation`, `prompt_en`, `prompt_swa`, `target_concept_id`, `options[]` (with visual exemplar + label), `correct_id`, `choice_level` (`1 | 2 | 3`), `scaffold_level` (`0 | 1 | 2 | 3`), `held_out: boolean`.
- **Per-Child Institutional Records**:
  - `child_profiles`: `{ id, guardian_id, alias, language_pref, created_at }`
  - `consent_records`: `{ id, child_id, scope, version, granted_at, revoked_at }`
  - `care_team_members`: `{ id, child_id, member_name, role, granted_at, revoked_at }`
  - `exposures` (append-only): `{ id, child_id, concept_id, exemplar_id, layer, completed_at }`
  - `task_attempts` (append-only): `{ id, child_id, session_id, task_type, source_relation, held_out, choice_level, scaffold_level, correct, latency_ms, created_at }`
  - `pattern_progress`: Derived per `pattern_type` (`emerging | consolidating | acquired`) with session/day distribution evidence (`≥ 80%` on held-out items at `≤ S1` across `≥ 3` sessions on `≥ 3` distinct days).
  - `recall_state`: Per-concept Leitner box (`1–4`), `last_seen_at`, `next_due_at` with soft demotion.

### Interactive Component & State Mapping
- **Consent & Data Governance Controller**: Manages child profile creation, consent signing/revocation, care-team grants, and one-click JSON export / full child record deletion. Syncs with backend `/api/learning/sync` routes and queues offline writes automatically.
- **Exemplar Carousel & Caregiver Photo Uploader**: Rotates visual exemplars automatically on each Passive Layer exposure and allows caregivers (in `caregiver_general` mode) to attach a local family photo exemplar to any concept for their child's profile.
- **Adaptive Scaffold & Choice Engine**: Evaluates rolling window of the last 5 `task_attempts` for the active pattern type—automatically promoting `L1 → L2 → L3` and fading `S3 → S2 → S1 → S0` at $\ge 80\%$ accuracy, or stepping back one scaffold/choice level after 2 consecutive errors while replaying the visual relationship gently.
