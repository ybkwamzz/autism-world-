import type { PatternTaskType } from '../data/knowledgeGraph';

export interface ChildProfile {
  id: string;
  guardian_id: string;
  alias: string;
  language_pref: 'en' | 'swa';
  created_at: string;
}

export interface ConsentRecord {
  id: string;
  child_id: string;
  scope: string;
  version: string;
  granted_at: string;
  revoked_at: string | null;
}

export interface CareTeamMember {
  id: string;
  child_id: string;
  member_user_id: string;
  member_name: string;
  role: string;
  granted_by: string;
  granted_at: string;
  revoked_at: string | null;
}

export interface ExposureRecord {
  id: string;
  child_id: string;
  concept_id: string;
  exemplar_id: string;
  layer: 'passive' | 'interactive' | 'scenario';
  completed_at: string;
}

export interface TaskAttemptRecord {
  id: string;
  child_id: string;
  session_id: string;
  task_type: PatternTaskType;
  source_relation: string;
  held_out: boolean;
  choice_level: 1 | 2 | 3;
  scaffold_level: 0 | 1 | 2 | 3;
  correct: boolean;
  latency_ms: number;
  created_at: string;
}

export interface RecallStateRecord {
  child_id: string;
  concept_id: string;
  box: 1 | 2 | 3 | 4;
  last_seen_at: number;
  next_due_at: number;
}

export interface CaregiverNoteRecord {
  child_id: string;
  node_id: string;
  body: string;
  updated_at: string;
}

export interface CustomExemplarRecord {
  id: string;
  child_id: string;
  concept_id: string;
  title_en: string;
  title_swa: string;
  dataUrl: string;
  created_at: string;
}

export interface ClinicianParameters {
  accuracyThresholdPct: number; // default 80
  minSessions: number; // default 3
  minDistinctDays: number; // default 3
  maxScaffoldForAcquired: 0 | 1 | 2 | 3; // default 1 (S1 or S0)
  reviewedByClinician: boolean;
  clinicianName: string;
}

export interface PatternProgressSummary {
  pattern_type: PatternTaskType;
  status: 'emerging' | 'consolidating' | 'acquired';
  totalAttempts: number;
  correctAttempts: number;
  heldOutAttempts: number;
  heldOutCorrect: number;
  heldOutAccuracyPct: number;
  distinctSessions: number;
  distinctDays: number;
  currentChoiceLevel: 1 | 2 | 3;
  currentScaffoldLevel: 0 | 1 | 2 | 3;
  summary_en: string;
  summary_swa: string;
}

export interface LearningStoreState {
  child_profiles: ChildProfile[];
  consent_records: ConsentRecord[];
  care_team_members: CareTeamMember[];
  exposures: ExposureRecord[];
  task_attempts: TaskAttemptRecord[];
  recall_state: RecallStateRecord[];
  caregiver_notes: CaregiverNoteRecord[];
  custom_exemplars: CustomExemplarRecord[];
  clinician_parameters: ClinicianParameters;
}

const LOCAL_CACHE_KEY = 'autism_unmasked_v2_ledger_cache';
const OFFLINE_QUEUE_KEY = 'autism_unmasked_v2_offline_queue';

export function getInitialLocalLedger(): LearningStoreState {
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.child_profiles) && parsed.child_profiles.length > 0) {
        return parsed;
      }
    }
  } catch {}

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return {
    child_profiles: [
      {
        id: 'child-amara-01',
        guardian_id: 'guardian-local-01',
        alias: 'Amara (Age 6)',
        language_pref: 'en',
        created_at: new Date(now - 7 * dayMs).toISOString()
      }
    ],
    consent_records: [
      {
        id: 'consent-init-01',
        child_id: 'child-amara-01',
        scope: 'exposures,task_attempts,caregiver_notes,youtube_nocookie_embed',
        version: 'v2.0-KDPA-2019',
        granted_at: new Date(now - 7 * dayMs).toISOString(),
        revoked_at: null
      }
    ],
    care_team_members: [
      {
        id: 'team-01',
        child_id: 'child-amara-01',
        member_user_id: 'slp-wanjiku-ke',
        member_name: 'Wanjiku M. (Speech-Language Pathologist, KISE)',
        role: 'SLP Clinician',
        granted_by: 'guardian-local-01',
        granted_at: new Date(now - 5 * dayMs).toISOString(),
        revoked_at: null
      }
    ],
    exposures: [
      {
        id: 'exp-seed-1',
        child_id: 'child-amara-01',
        concept_id: 'apple',
        exemplar_id: 'apple-ex-1',
        layer: 'passive',
        completed_at: new Date(now - 3 * dayMs).toISOString()
      },
      {
        id: 'exp-seed-2',
        child_id: 'child-amara-01',
        concept_id: 'apple',
        exemplar_id: 'apple-ex-2',
        layer: 'passive',
        completed_at: new Date(now - 2 * dayMs).toISOString()
      },
      {
        id: 'exp-seed-3',
        child_id: 'child-amara-01',
        concept_id: 'banana',
        exemplar_id: 'banana-ex-1',
        layer: 'passive',
        completed_at: new Date(now - 2 * dayMs).toISOString()
      },
      {
        id: 'exp-seed-4',
        child_id: 'child-amara-01',
        concept_id: 'cup',
        exemplar_id: 'cup-ex-1',
        layer: 'passive',
        completed_at: new Date(now - 1 * dayMs).toISOString()
      }
    ],
    task_attempts: [
      {
        id: 'att-seed-1',
        child_id: 'child-amara-01',
        session_id: 'sess-day1',
        task_type: 'odd_one_out',
        source_relation: 'contrasts_with',
        held_out: true,
        choice_level: 2,
        scaffold_level: 1,
        correct: true,
        latency_ms: 4200,
        created_at: new Date(now - 3 * dayMs).toISOString()
      },
      {
        id: 'att-seed-2',
        child_id: 'child-amara-01',
        session_id: 'sess-day2',
        task_type: 'odd_one_out',
        source_relation: 'contrasts_with',
        held_out: true,
        choice_level: 2,
        scaffold_level: 1,
        correct: true,
        latency_ms: 3800,
        created_at: new Date(now - 2 * dayMs).toISOString()
      },
      {
        id: 'att-seed-3',
        child_id: 'child-amara-01',
        session_id: 'sess-day3',
        task_type: 'odd_one_out',
        source_relation: 'contrasts_with',
        held_out: true,
        choice_level: 3,
        scaffold_level: 1,
        correct: true,
        latency_ms: 3500,
        created_at: new Date(now - 1 * dayMs).toISOString()
      },
      {
        id: 'att-seed-4',
        child_id: 'child-amara-01',
        session_id: 'sess-day2',
        task_type: 'transfer_slot',
        source_relation: 'found_in',
        held_out: true,
        choice_level: 2,
        scaffold_level: 2,
        correct: true,
        latency_ms: 5100,
        created_at: new Date(now - 2 * dayMs).toISOString()
      },
      {
        id: 'att-seed-5',
        child_id: 'child-amara-01',
        session_id: 'sess-day3',
        task_type: 'transfer_slot',
        source_relation: 'causes',
        held_out: true,
        choice_level: 2,
        scaffold_level: 1,
        correct: true,
        latency_ms: 4600,
        created_at: new Date(now - 1 * dayMs).toISOString()
      }
    ],
    recall_state: [
      {
        child_id: 'child-amara-01',
        concept_id: 'apple',
        box: 3,
        last_seen_at: now - 2 * dayMs,
        next_due_at: now + 1 * dayMs
      },
      {
        child_id: 'child-amara-01',
        concept_id: 'banana',
        box: 2,
        last_seen_at: now - 2 * dayMs,
        next_due_at: now - 1000
      },
      {
        child_id: 'child-amara-01',
        concept_id: 'cup',
        box: 2,
        last_seen_at: now - 1 * dayMs,
        next_due_at: now
      }
    ],
    caregiver_notes: [
      {
        child_id: 'child-amara-01',
        node_id: 'apple',
        body: 'Responds well to green sliced apple exemplar alongside real apple at snack time.',
        updated_at: new Date(now - 1 * dayMs).toISOString()
      }
    ],
    custom_exemplars: [],
    clinician_parameters: {
      accuracyThresholdPct: 80,
      minSessions: 3,
      minDistinctDays: 3,
      maxScaffoldForAcquired: 1,
      reviewedByClinician: true,
      clinicianName: 'Wanjiku M., SLP (KISE Nairobi)'
    }
  };
}

export async function fetchServerLedger(): Promise<{ store: LearningStoreState; syncedFromServer: boolean }> {
  try {
    const res = await fetch('/api/learning/state');
    if (!res.ok) throw new Error('Failed to fetch server ledger');
    const store = await res.json();
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(store));
    return { store, syncedFromServer: true };
  } catch {
    return { store: getInitialLocalLedger(), syncedFromServer: false };
  }
}

export async function syncLedgerToServer(
  store: LearningStoreState,
  newExposures: ExposureRecord[] = [],
  newAttempts: TaskAttemptRecord[] = []
): Promise<{ synced: boolean; pendingQueueCount: number }> {
  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(store));

  const payload = {
    child_profiles: store.child_profiles,
    consent_records: store.consent_records,
    care_team_members: store.care_team_members,
    new_exposures: store.exposures,
    new_task_attempts: store.task_attempts,
    recall_state: store.recall_state,
    caregiver_notes: store.caregiver_notes,
    custom_exemplars: store.custom_exemplars,
    clinician_parameters: store.clinician_parameters
  };

  try {
    const res = await fetch('/api/learning/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Sync HTTP error');
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    return { synced: true, pendingQueueCount: 0 };
  } catch {
    // Queue locally when offline
    const existingQueue = getOfflineQueueCount();
    const added = newExposures.length + newAttempts.length || 1;
    const nextCount = existingQueue + added;
    localStorage.setItem(OFFLINE_QUEUE_KEY, String(nextCount));
    return { synced: false, pendingQueueCount: nextCount };
  }
}

export function getOfflineQueueCount(): number {
  const val = localStorage.getItem(OFFLINE_QUEUE_KEY);
  return val ? parseInt(val, 10) || 0 : 0;
}

export async function deleteChildServerData(childId: string): Promise<void> {
  try {
    await fetch(`/api/learning/child/${encodeURIComponent(childId)}`, {
      method: 'DELETE'
    });
  } catch {}
}

// ============================================================================
// ERRORLESS-TO-FADE ADAPTIVE LADDER & PATTERN ACQUISITION EVALUATOR
// ============================================================================
const ALL_TASK_TYPES: PatternTaskType[] = [
  'predict_next_beat',
  'odd_one_out',
  'sort_group',
  'transfer_slot',
  'cue_transfer'
];

export function computeAdaptiveLevelsForChild(
  childId: string,
  attempts: TaskAttemptRecord[]
): Record<PatternTaskType, { choiceLevel: 1 | 2 | 3; scaffoldLevel: 0 | 1 | 2 | 3 }> {
  const result = {} as Record<PatternTaskType, { choiceLevel: 1 | 2 | 3; scaffoldLevel: 0 | 1 | 2 | 3 }>;

  for (const taskType of ALL_TASK_TYPES) {
    const childAttempts = attempts.filter(a => a.child_id === childId && a.task_type === taskType);
    if (childAttempts.length === 0) {
      result[taskType] = { choiceLevel: 1, scaffoldLevel: 3 }; // Start errorless: L1 (2 choices), S3 (full scaffold)
      continue;
    }

    const latest = childAttempts[childAttempts.length - 1];
    let choiceLevel: 1 | 2 | 3 = latest.choice_level;
    let scaffoldLevel: 0 | 1 | 2 | 3 = latest.scaffold_level;

    // Check last 2 for consecutive errors -> step back one level
    if (childAttempts.length >= 2) {
      const lastTwo = childAttempts.slice(-2);
      if (!lastTwo[0].correct && !lastTwo[1].correct) {
        if (scaffoldLevel < 3) {
          scaffoldLevel = (scaffoldLevel + 1) as 0 | 1 | 2 | 3;
        } else if (choiceLevel > 1) {
          choiceLevel = (choiceLevel - 1) as 1 | 2 | 3;
        }
        result[taskType] = { choiceLevel, scaffoldLevel };
        continue;
      }
    }

    // Check rolling window of last 5 attempts (or 3+ if all correct) for >= 80% accuracy
    const windowSlice = childAttempts.slice(-5);
    const correctCount = windowSlice.filter(a => a.correct).length;
    const accuracy = (correctCount / windowSlice.length) * 100;

    if (windowSlice.length >= 3 && accuracy >= 80) {
      if (choiceLevel < 3) {
        choiceLevel = (choiceLevel + 1) as 1 | 2 | 3;
      } else if (scaffoldLevel > 0) {
        scaffoldLevel = (scaffoldLevel - 1) as 0 | 1 | 2 | 3;
      }
    }

    result[taskType] = { choiceLevel, scaffoldLevel };
  }

  return result;
}

export function evaluatePatternProgressForChild(
  childId: string,
  attempts: TaskAttemptRecord[],
  params: ClinicianParameters
): PatternProgressSummary[] {
  const adaptive = computeAdaptiveLevelsForChild(childId, attempts);

  return ALL_TASK_TYPES.map(taskType => {
    const typeAttempts = attempts.filter(a => a.child_id === childId && a.task_type === taskType);
    const totalAttempts = typeAttempts.length;
    const correctAttempts = typeAttempts.filter(a => a.correct).length;

    // Evaluate held-out or low-scaffold items for pattern acquisition criterion
    const qualifyingAttempts = typeAttempts.filter(
      a => (a.held_out || taskType === 'predict_next_beat') && a.scaffold_level <= params.maxScaffoldForAcquired
    );
    const heldOutAttempts = qualifyingAttempts.length;
    const heldOutCorrect = qualifyingAttempts.filter(a => a.correct).length;
    const heldOutAccuracyPct =
      heldOutAttempts > 0 ? Math.round((heldOutCorrect / heldOutAttempts) * 100) : 0;

    const distinctSessions = new Set(qualifyingAttempts.filter(a => a.correct).map(a => a.session_id)).size;
    const distinctDays = new Set(
      qualifyingAttempts.filter(a => a.correct).map(a => a.created_at.slice(0, 10))
    ).size;

    let status: 'emerging' | 'consolidating' | 'acquired' = 'emerging';
    if (
      heldOutAttempts >= params.minSessions &&
      heldOutAccuracyPct >= params.accuracyThresholdPct &&
      distinctSessions >= params.minSessions &&
      distinctDays >= params.minDistinctDays
    ) {
      status = 'acquired';
    } else if (totalAttempts >= 2 && correctAttempts >= 1) {
      status = 'consolidating';
    }

    const lvl = adaptive[taskType];
    const scaffoldNameEn =
      lvl.scaffoldLevel === 3
        ? 'S3 (Audio + Label + Hint)'
        : lvl.scaffoldLevel === 2
        ? 'S2 (Audio + Label)'
        : lvl.scaffoldLevel === 1
        ? 'S1 (Label only)'
        : 'S0 (Image only)';

    let summary_en = 'Not yet practiced in Pattern Lab.';
    let summary_swa = 'Bado haijafanyiwa mazoezi kwenye Maabara ya Mifumo.';

    if (totalAttempts > 0) {
      if (status === 'acquired') {
        summary_en = `Pattern acquired: ${heldOutAccuracyPct}% accuracy on held-out items at ${scaffoldNameEn} across ${distinctSessions} sessions on ${distinctDays} separate days.`;
        summary_swa = `Mfumo umeeleweka: usahihi wa ${heldOutAccuracyPct}% kwa vitu vipya (${scaffoldNameEn}) katika vipindi ${distinctSessions} kwa siku ${distinctDays} tofauti.`;
      } else {
        summary_en = `${correctAttempts}/${totalAttempts} correct overall • Current tier: L${lvl.choiceLevel} (${lvl.choiceLevel + 1} choices), ${scaffoldNameEn} • ${distinctDays}/${params.minDistinctDays} days toward criterion.`;
        summary_swa = `Sahihi ${correctAttempts}/${totalAttempts} • Ngazi: L${lvl.choiceLevel}, ${scaffoldNameEn} • Siku ${distinctDays}/${params.minDistinctDays} kufikia lengo.`;
      }
    }

    return {
      pattern_type: taskType,
      status,
      totalAttempts,
      correctAttempts,
      heldOutAttempts,
      heldOutCorrect,
      heldOutAccuracyPct,
      distinctSessions,
      distinctDays,
      currentChoiceLevel: lvl.choiceLevel,
      currentScaffoldLevel: lvl.scaffoldLevel,
      summary_en,
      summary_swa
    };
  });
}
