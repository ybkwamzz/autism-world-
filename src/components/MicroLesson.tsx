import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Clapperboard,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Copy,
  Check,
  School,
  Home as HomeIcon,
  Play,
  Pause,
  ArrowRight,
  Layers,
  Award,
  NotebookPen,
  ShieldCheck,
  UserCheck,
  Users,
  Download,
  Trash2,
  Lock,
  Unlock,
  Upload,
  Puzzle,
  Eye,
  Stethoscope,
  RefreshCw,
  AlertCircle,
  Plus
} from 'lucide-react';
import ScenarioPlayer, { type ScenarioNode } from './ScenarioPlayer';
import ConceptVisual from './ConceptVisual';
import scenarios from '../data/scenarios.json';
import {
  KNOWLEDGE_CONCEPTS,
  RELATION_LABELS,
  PATTERN_TASK_METADATA,
  getConceptById,
  getConnectedEdges,
  generatePatternLabSession,
  type ConceptNode,
  type ConceptExemplar,
  type EdgeRelationType,
  type PatternTaskType
} from '../data/knowledgeGraph';
import {
  getInitialLocalLedger,
  fetchServerLedger,
  syncLedgerToServer,
  deleteChildServerData,
  getOfflineQueueCount,
  computeAdaptiveLevelsForChild,
  evaluatePatternProgressForChild,
  type LearningStoreState,
  type ExposureRecord,
  type TaskAttemptRecord,
  type ChildProfile,
  type ConsentRecord
} from '../services/learningLedger';

type LessonNode = ConceptNode | ScenarioNode;
type ConsumptionLayer = 'passive' | 'interactive' | 'pattern_lab' | 'scenario';
export type SessionMode = 'child_active' | 'caregiver_general';

const BEAT_KEYS: Array<'what' | 'does' | 'usedFor' | 'found'> = ['what', 'does', 'usedFor', 'found'];
const BEAT_LABELS_EN = ['1. What is it?', '2. What does it do?', '3. What is it used for?', '4. Where is it found?'];
const BEAT_LABELS_SWA = ['1. Ni nini?', '2. Inafanya nini?', '3. Inatumika kwa nini?', '4. Inapatikana wapi?'];

const LEITNER_BOX_INTERVALS_MS: Record<1 | 2 | 3 | 4, number> = {
  1: 60 * 60 * 1000, // Box 1: 1 hour
  2: 24 * 60 * 60 * 1000, // Box 2: 1 day
  3: 3 * 24 * 60 * 60 * 1000, // Box 3: 3 days
  4: 7 * 24 * 60 * 60 * 1000 // Box 4: 7 days
};

const SCENARIOS = scenarios as ScenarioNode[];
const TAUGHT_CONCEPTS = KNOWLEDGE_CONCEPTS.filter(c => !c.held_out);
const HELD_OUT_CONCEPTS = KNOWLEDGE_CONCEPTS.filter(c => c.held_out);

export default function MicroLesson({
  language,
  initialFilter,
  onModeChange,
  onOpenLumo
}: {
  language: 'en' | 'swa';
  initialFilter?: 'scenario';
  onModeChange?: (mode: SessionMode) => void;
  onOpenLumo?: () => void;
}) {
  // ==========================================================================
  // 1. INSTITUTIONAL PER-CHILD STORE & OFFLINE SYNC STATE
  // ==========================================================================
  const [ledger, setLedger] = useState<LearningStoreState>(() => getInitialLocalLedger());
  const [activeChildId, setActiveChildId] = useState<string>(() => {
    const init = getInitialLocalLedger();
    return init.child_profiles[0]?.id || 'child-amara-01';
  });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'queued' | 'syncing'>('synced');
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(() => getOfflineQueueCount());

  // Mode split: child_active (zero generative AI, low-language visuals) vs caregiver_general
  const [sessionMode, setSessionMode] = useState<SessionMode>('child_active');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [newChildAlias, setNewChildAlias] = useState('');
  const [newCareTeamName, setNewCareTeamName] = useState('');
  const [newCareTeamRole, setNewCareTeamRole] = useState('SLP Clinician');

  // Sensory Accessibility Controls
  const [quietMode, setQuietMode] = useState<boolean>(() => {
    return localStorage.getItem('autism_unmasked_quiet_mode') === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('autism_unmasked_reduced_motion') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('autism_unmasked_quiet_mode', quietMode ? 'true' : 'false');
  }, [quietMode]);

  useEffect(() => {
    localStorage.setItem('autism_unmasked_reduced_motion', reducedMotion ? 'true' : 'false');
  }, [reducedMotion]);

  useEffect(() => {
    onModeChange?.(sessionMode);
  }, [sessionMode, onModeChange]);

  // Initial fetch from server ledger
  useEffect(() => {
    let mounted = true;
    fetchServerLedger().then(({ store, syncedFromServer }) => {
      if (!mounted) return;
      setLedger(store);
      if (store.child_profiles.length > 0 && !store.child_profiles.some(p => p.id === activeChildId)) {
        setActiveChildId(store.child_profiles[0].id);
      }
      setSyncStatus(syncedFromServer ? 'synced' : 'queued');
    });
    return () => {
      mounted = false;
    };
  }, []);

  const persistAndSync = async (
    nextLedger: LearningStoreState,
    newExposures: ExposureRecord[] = [],
    newAttempts: TaskAttemptRecord[] = []
  ) => {
    setLedger(nextLedger);
    setSyncStatus('syncing');
    const { synced, pendingQueueCount: qCount } = await syncLedgerToServer(
      nextLedger,
      newExposures,
      newAttempts
    );
    setSyncStatus(synced ? 'synced' : 'queued');
    setPendingQueueCount(qCount);
  };

  const activeChild: ChildProfile = useMemo(() => {
    return (
      ledger.child_profiles.find(c => c.id === activeChildId) || {
        id: 'child-amara-01',
        guardian_id: 'guardian-local-01',
        alias: 'Amara (Age 6)',
        language_pref: language,
        created_at: new Date().toISOString()
      }
    );
  }, [ledger.child_profiles, activeChildId, language]);

  // Active consent check for the selected child
  const activeConsent: ConsentRecord | null = useMemo(() => {
    const records = ledger.consent_records.filter(c => c.child_id === activeChild.id);
    if (records.length === 0) return null;
    const latest = records[records.length - 1];
    return latest.revoked_at ? null : latest;
  }, [ledger.consent_records, activeChild.id]);

  // ==========================================================================
  // 2. CURRICULUM NODES & CONSUMPTION LAYERS
  // ==========================================================================
  const visibleCurriculumNodes: LessonNode[] = useMemo(() => {
    // CRITICAL RULE: Held-out concepts NEVER appear in the Passive Layer or standard curriculum list!
    // Caregivers in caregiver_general mode can inspect held-out concepts in the graph, but learners only see taught concepts.
    if (initialFilter === 'scenario') return SCENARIOS;
    return [...TAUGHT_CONCEPTS, ...SCENARIOS];
  }, [initialFilter]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'concepts' | 'scenarios'>(
    initialFilter === 'scenario' ? 'scenarios' : 'all'
  );
  const [sourceSearch, setSourceSearch] = useState('');
  const [activeNode, setActiveNode] = useState<LessonNode>(() =>
    initialFilter === 'scenario' ? SCENARIOS[0] : TAUGHT_CONCEPTS[0]
  );
  const [activeLayer, setActiveLayer] = useState<ConsumptionLayer>(() =>
    initialFilter === 'scenario' ? 'scenario' : 'passive'
  );

  // Passive Layer Pacing & Exemplar Rotation
  const [beatIndex, setBeatIndex] = useState(0);
  const [exemplarIndex, setExemplarIndex] = useState(0);
  const [beatDurationSec, setBeatDurationSec] = useState<5 | 8 | 10 | 15>(8);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [beatProgressPct, setBeatProgressPct] = useState(0);
  const [statusBanner, setStatusBanner] = useState<string>('');

  // Pattern Lab State
  const [sessionId] = useState(() => `sess-${Date.now().toString(36)}`);
  const [patternTaskIndex, setPatternTaskIndex] = useState(0);
  const [selectedTaskOptionId, setSelectedTaskOptionId] = useState<string | null>(null);
  const [taskFeedback, setTaskFeedback] = useState<{
    correct: boolean;
    message: string;
    explanation: string;
  } | null>(null);
  const taskStartRef = useRef<number>(Date.now());

  // Caregiver Notes State
  const [noteText, setNoteText] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);

  // Sync note text when active child or active node changes
  useEffect(() => {
    const existing = ledger.caregiver_notes.find(
      n => n.child_id === activeChild.id && n.node_id === activeNode.id
    );
    setNoteText(existing?.body || '');
  }, [activeChild.id, activeNode.id, ledger.caregiver_notes]);

  // Compute per-child Recall State map
  const childRecallMap = useMemo(() => {
    const map: Record<string, { box: 1 | 2 | 3 | 4; last_seen_at: number; next_due_at: number }> = {};
    for (const r of ledger.recall_state) {
      if (r.child_id === activeChild.id) {
        map[r.concept_id] = {
          box: r.box,
          last_seen_at: r.last_seen_at,
          next_due_at: r.next_due_at
        };
      }
    }
    return map;
  }, [ledger.recall_state, activeChild.id]);

  // Compute per-child Exposure count per node
  const childExposureCountMap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const exp of ledger.exposures) {
      if (exp.child_id === activeChild.id) {
        counts[exp.concept_id] = (counts[exp.concept_id] || 0) + 1;
      }
    }
    return counts;
  }, [ledger.exposures, activeChild.id]);

  // Adaptive Choice (L1-L3) & Scaffold (S3-S0) Levels per Pattern Task Type
  const adaptiveLevels = useMemo(() => {
    return computeAdaptiveLevelsForChild(activeChild.id, ledger.task_attempts);
  }, [activeChild.id, ledger.task_attempts]);

  // Pattern Acquisition Progress Summaries
  const patternSummaries = useMemo(() => {
    return evaluatePatternProgressForChild(
      activeChild.id,
      ledger.task_attempts,
      ledger.clinician_parameters
    );
  }, [activeChild.id, ledger.task_attempts, ledger.clinician_parameters]);

  // Deterministically generated Pattern Lab tasks
  const patternTasks = useMemo(() => {
    return generatePatternLabSession(SCENARIOS, adaptiveLevels);
  }, [adaptiveLevels]);

  const activePatternTask = patternTasks[patternTaskIndex % patternTasks.length];

  // Exemplars for current concept (including any caregiver-uploaded photos for this child)
  const activeConceptExemplars: ConceptExemplar[] = useMemo(() => {
    if (activeNode.type !== 'concept') return [];
    const customForConcept = (ledger.custom_exemplars || [])
      .filter(ce => ce.child_id === activeChild.id && ce.concept_id === activeNode.id)
      .map(ce => ({
        id: ce.id,
        variant: 'caregiver_photo' as const,
        title_en: ce.title_en,
        title_swa: ce.title_swa,
        bgClass: 'bg-amber-50 dark:bg-amber-950/30',
        accentClass: 'text-[#C77700]',
        ringClass: 'ring-[#C77700]/40',
        customDataUrl: ce.dataUrl
      }));
    return [...activeNode.exemplars, ...customForConcept];
  }, [activeNode, ledger.custom_exemplars, activeChild.id]);

  const currentExemplar: ConceptExemplar | undefined =
    activeConceptExemplars.length > 0
      ? activeConceptExemplars[exemplarIndex % activeConceptExemplars.length]
      : undefined;

  // Speak helper respecting Quiet Mode
  const speakPhrase = (textEn: string, textSwa: string) => {
    if (quietMode || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(language === 'en' ? textEn : textSwa);
    utterance.lang = language === 'en' ? 'en-US' : 'sw-KE';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  // Passive Layer Auto-Advancing Beat Timer (5s, 8s, 10s, 15s)
  useEffect(() => {
    if (!isAutoPlaying || activeLayer !== 'passive' || activeNode.type !== 'concept') {
      setBeatProgressPct(0);
      return;
    }

    const durationMs = beatDurationSec * 1000;
    const stepMs = 100;
    let elapsed = 0;

    // Speak current beat on entry if not in quiet mode
    const beatKey = BEAT_KEYS[beatIndex];
    const swaKey = `${beatKey}_swa` as keyof ConceptNode['beats'];
    speakPhrase(
      `${activeNode.label}. ${activeNode.beats[beatKey]}`,
      `${activeNode.swahiliLabel}. ${activeNode.beats[swaKey]}`
    );

    const timer = window.setInterval(() => {
      elapsed += stepMs;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setBeatProgressPct(pct);

      if (elapsed >= durationMs) {
        window.clearInterval(timer);
        if (beatIndex < BEAT_KEYS.length - 1) {
          setBeatIndex(prev => prev + 1);
        } else {
          // Completed all 4 beats! Rotate exemplar and record append-only exposure
          setIsAutoPlaying(false);
          setBeatProgressPct(0);
          recordNodeCompletion(activeNode, 'passive');
          setExemplarIndex(prev => prev + 1);
        }
      }
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [isAutoPlaying, beatIndex, beatDurationSec, activeLayer, activeNode, language, quietMode]);

  // Record append-only exposure + update Leitner recall box
  const recordNodeCompletion = (node: LessonNode, layer: 'passive' | 'interactive' | 'scenario') => {
    const now = Date.now();
    const newExp: ExposureRecord = {
      id: `exp-${now}-${Math.random().toString(36).slice(2, 6)}`,
      child_id: activeChild.id,
      concept_id: node.id,
      exemplar_id:
        node.type === 'concept' && currentExemplar ? currentExemplar.id : `${node.id}-default`,
      layer,
      completed_at: new Date(now).toISOString()
    };

    const existingRecall = ledger.recall_state.find(
      r => r.child_id === activeChild.id && r.concept_id === node.id
    );
    const nextBox = Math.min(4, (existingRecall?.box || 0) + 1) as 1 | 2 | 3 | 4;
    const nextRecallRecord = {
      child_id: activeChild.id,
      concept_id: node.id,
      box: nextBox,
      last_seen_at: now,
      next_due_at: now + LEITNER_BOX_INTERVALS_MS[nextBox]
    };

    const updatedRecallList = existingRecall
      ? ledger.recall_state.map(r =>
          r.child_id === activeChild.id && r.concept_id === node.id ? nextRecallRecord : r
        )
      : [...ledger.recall_state, nextRecallRecord];

    const nextLedger: LearningStoreState = {
      ...ledger,
      exposures: [...ledger.exposures, newExp],
      recall_state: updatedRecallList
    };

    persistAndSync(nextLedger, [newExp], []);
    setStatusBanner(
      language === 'en'
        ? `Recorded exposure for "${node.type === 'concept' ? node.label : node.communication_goal}" (Leitner Box ${nextBox}).`
        : ` Mazoezi yamehifadhiwa kwa "${node.type === 'concept' ? node.swahiliLabel : node.communication_goal}" (Sanduku la Kumbukumbu ${nextBox}).`
    );
  };

  // Select a lesson node from sidebar or graph
  const selectLessonNode = (node: LessonNode, targetLayer?: ConsumptionLayer) => {
    // Prevent selecting a held_out concept into Passive Layer
    if (node.type === 'concept' && node.held_out && (targetLayer === 'passive' || activeLayer === 'passive')) {
      setActiveNode(node);
      setActiveLayer('interactive');
      setIsAutoPlaying(false);
      return;
    }

    setActiveNode(node);
    setBeatIndex(0);
    setIsAutoPlaying(false);
    setBeatProgressPct(0);

    if (node.type === 'scenario') {
      setActiveLayer('scenario');
    } else if (targetLayer) {
      setActiveLayer(targetLayer);
    } else if (activeLayer === 'scenario') {
      setActiveLayer('passive');
    }
  };

  // Handle Pattern Lab option choice
  const handleChoosePatternOption = (optionId: string) => {
    if (!activePatternTask) return;
    setSelectedTaskOptionId(optionId);
    const isCorrect = optionId === activePatternTask.correct_id;
    const latency = Math.max(300, Date.now() - taskStartRef.current);

    const newAttempt: TaskAttemptRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      child_id: activeChild.id,
      session_id: sessionId,
      task_type: activePatternTask.type,
      source_relation: activePatternTask.source_relation,
      held_out: activePatternTask.held_out,
      choice_level: activePatternTask.choice_level,
      scaffold_level: activePatternTask.scaffold_level,
      correct: isCorrect,
      latency_ms: latency,
      created_at: new Date().toISOString()
    };

    const nextLedger: LearningStoreState = {
      ...ledger,
      task_attempts: [...ledger.task_attempts, newAttempt]
    };

    persistAndSync(nextLedger, [], [newAttempt]);

    if (isCorrect) {
      const msgEn = 'Pattern recognized! Notice how these items share the same relationship.';
      const msgSwa = 'Mfumo umetambuliwa! Tazama jinsi vitu hivi vinavyohusiana.';
      setTaskFeedback({
        correct: true,
        message: language === 'en' ? msgEn : msgSwa,
        explanation:
          language === 'en' ? activePatternTask.explanation_en : activePatternTask.explanation_swa
      });
      speakPhrase(msgEn, msgSwa);
    } else {
      // Gentle supportive replay — never a harsh failure screen
      const msgEn =
        'Let us look closely at the pattern together, then try with a helpful hint.';
      const msgSwa =
        'Hebu tuangalie mfumo huu pamoja kwa utulivu, kisha tujaribu tena kwa dokezo.';
      setTaskFeedback({
        correct: false,
        message: language === 'en' ? msgEn : msgSwa,
        explanation:
          language === 'en' ? activePatternTask.explanation_en : activePatternTask.explanation_swa
      });
      speakPhrase(msgEn, msgSwa);
    }
  };

  const advanceToNextPatternTask = () => {
    setSelectedTaskOptionId(null);
    setTaskFeedback(null);
    taskStartRef.current = Date.now();
    setPatternTaskIndex(prev => prev + 1);
  };

  // Caregiver Note Autosave
  const handleNoteChange = (val: string) => {
    setNoteText(val);
    const nowIso = new Date().toISOString();
    const exists = ledger.caregiver_notes.some(
      n => n.child_id === activeChild.id && n.node_id === activeNode.id
    );
    const nextNotes = exists
      ? ledger.caregiver_notes.map(n =>
          n.child_id === activeChild.id && n.node_id === activeNode.id
            ? { ...n, body: val, updated_at: nowIso }
            : n
        )
      : [
          ...ledger.caregiver_notes,
          { child_id: activeChild.id, node_id: activeNode.id, body: val, updated_at: nowIso }
        ];
    const nextLedger = { ...ledger, caregiver_notes: nextNotes };
    persistAndSync(nextLedger);
  };

  // Caregiver Photo Exemplar Upload (private per child)
  const handleUploadCustomExemplar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeNode.type !== 'concept') return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      const newCustom = {
        id: `custom-ex-${Date.now()}`,
        child_id: activeChild.id,
        concept_id: activeNode.id,
        title_en: `Family Photo: ${activeNode.label}`,
        title_swa: `Picha ya Nyumbani: ${activeNode.swahiliLabel}`,
        dataUrl,
        created_at: new Date().toISOString()
      };
      const nextLedger: LearningStoreState = {
        ...ledger,
        custom_exemplars: [...(ledger.custom_exemplars || []), newCustom]
      };
      persistAndSync(nextLedger);
      setExemplarIndex(activeConceptExemplars.length);
    };
    reader.readAsDataURL(file);
  };

  // Grant or Revoke Consent
  const handleGrantConsent = () => {
    const newRecord: ConsentRecord = {
      id: `consent-${Date.now()}`,
      child_id: activeChild.id,
      scope: 'exposures,task_attempts,caregiver_notes,youtube_nocookie_embed',
      version: 'v2.0-KDPA-2019',
      granted_at: new Date().toISOString(),
      revoked_at: null
    };
    const nextLedger: LearningStoreState = {
      ...ledger,
      consent_records: [...ledger.consent_records, newRecord]
    };
    persistAndSync(nextLedger);
    setShowConsentModal(false);
  };

  const handleRevokeConsent = () => {
    const nextRecords = ledger.consent_records.map(r =>
      r.child_id === activeChild.id && !r.revoked_at
        ? { ...r, revoked_at: new Date().toISOString() }
        : r
    );
    const nextLedger: LearningStoreState = {
      ...ledger,
      consent_records: nextRecords
    };
    persistAndSync(nextLedger);
  };

  // Export Child Data as JSON
  const handleExportChildData = () => {
    const childData = {
      exported_at: new Date().toISOString(),
      compliance_version: 'Kenya Data Protection Act (2019) — v2.0',
      child_profile: activeChild,
      consent_records: ledger.consent_records.filter(c => c.child_id === activeChild.id),
      care_team_members: ledger.care_team_members.filter(m => m.child_id === activeChild.id),
      exposures: ledger.exposures.filter(e => e.child_id === activeChild.id),
      task_attempts: ledger.task_attempts.filter(a => a.child_id === activeChild.id),
      pattern_progress: patternSummaries,
      recall_state: ledger.recall_state.filter(r => r.child_id === activeChild.id),
      caregiver_notes: ledger.caregiver_notes.filter(n => n.child_id === activeChild.id)
    };
    const blob = new Blob([JSON.stringify(childData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChild.alias.replace(/\s+/g, '_').toLowerCase()}_learning_records.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Permanently Delete Child Learning Data
  const handleDeleteChildData = async () => {
    await deleteChildServerData(activeChild.id);
    const nextLedger: LearningStoreState = {
      ...ledger,
      exposures: ledger.exposures.filter(e => e.child_id !== activeChild.id),
      task_attempts: ledger.task_attempts.filter(a => a.child_id !== activeChild.id),
      recall_state: ledger.recall_state.filter(r => r.child_id !== activeChild.id),
      caregiver_notes: ledger.caregiver_notes.filter(n => n.child_id !== activeChild.id),
      custom_exemplars: (ledger.custom_exemplars || []).filter(c => c.child_id !== activeChild.id)
    };
    persistAndSync(nextLedger);
    setStatusBanner(
      language === 'en'
        ? `All learning records for ${activeChild.alias} have been permanently deleted.`
        : `Rekodi zote za mafunzo za ${activeChild.alias} zimefutwa kabisa.`
    );
  };

  // Add a new Child Profile (alias only)
  const handleCreateChildProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newChildAlias.trim();
    if (!trimmed) return;
    const newChild: ChildProfile = {
      id: `child-${Date.now().toString(36)}`,
      guardian_id: 'guardian-local-01',
      alias: trimmed,
      language_pref: language,
      created_at: new Date().toISOString()
    };
    const nextLedger: LearningStoreState = {
      ...ledger,
      child_profiles: [...ledger.child_profiles, newChild]
    };
    persistAndSync(nextLedger);
    setActiveChildId(newChild.id);
    setNewChildAlias('');
  };

  // Filtered Sidebar Curriculum List
  const filteredCurriculumNodes = useMemo(() => {
    return visibleCurriculumNodes.filter(node => {
      if (activeCategory === 'scenarios' && node.type !== 'scenario') return false;
      if (activeCategory === 'concepts' && node.type !== 'concept') return false;
      if (!sourceSearch.trim()) return true;
      const q = sourceSearch.toLowerCase();
      if (node.type === 'concept') {
        return (
          node.label.toLowerCase().includes(q) ||
          node.swahiliLabel.toLowerCase().includes(q) ||
          node.subcategory.toLowerCase().includes(q)
        );
      }
      return (
        node.communication_goal.toLowerCase().includes(q) ||
        node.setting.toLowerCase().includes(q)
      );
    });
  }, [visibleCurriculumNodes, activeCategory, sourceSearch]);

  // Connected semantic edges for the active concept
  const connectedEdges = useMemo(() => {
    if (activeNode.type !== 'concept') return [];
    const allEdges = getConnectedEdges(activeNode.id);
    // In child_active mode, filter out held_out neighbors so held-out items are never prematurely taught!
    if (sessionMode === 'child_active') {
      return allEdges.filter(item => !item.neighbor.held_out);
    }
    return allEdges;
  }, [activeNode, sessionMode]);

  const acquiredPatternsCount = useMemo(() => {
    return patternSummaries.filter(p => p.status === 'acquired').length;
  }, [patternSummaries]);

  const recalledConceptsCount = useMemo(() => {
    return Object.values(childRecallMap).filter(r => r.box >= 2).length;
  }, [childRecallMap]);

  // ==========================================================================
  // FLOW 1 GATE: IF NO ACTIVE CONSENT FOR THIS CHILD, LOCK CHILD SESSION
  // ==========================================================================
  if (!activeConsent) {
    return (
      <section className="w-full max-w-4xl mx-auto py-4">
        <div className="bg-white dark:bg-[#231E1A] rounded-[32px] border border-[#C77700]/20 dark:border-white/10 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2F6B4F]/10 text-[#2F6B4F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#C77700] uppercase tracking-wider">
                  {language === 'en'
                    ? 'Institutional Guardian Consent Gate (KDPA 2019)'
                    : 'Idhini ya Mlezi na Faragha ya Mtoto (KDPA 2019)'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                  {language === 'en'
                    ? `Caregiver Consent Required for ${activeChild.alias}`
                    : `Idhini ya Mlezi Inahitajika kwa ${activeChild.alias}`}
                </h2>
              </div>
            </div>

            {/* Child Profile Switcher */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500">
                {language === 'en' ? 'Child Profile:' : 'Wasifu wa Mtoto:'}
              </label>
              <select
                value={activeChild.id}
                onChange={e => setActiveChildId(e.target.value)}
                className="bg-[#FFF8EE] dark:bg-stone-900 border border-[#C77700]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#2D3748] dark:text-[#F5EFEB]"
              >
                {ledger.child_profiles.map(cp => (
                  <option key={cp.id} value={cp.id}>
                    {cp.alias}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            <div className="p-4 rounded-2xl bg-[#FFF8EE]/70 dark:bg-stone-900 border border-[#C77700]/15 space-y-2">
              <h3 className="font-bold text-sm font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                {language === 'en' ? '1. What Learning Data is Stored' : '1. Taarifa Zinazohifadhiwa'}
              </h3>
              <p>
                {language === 'en'
                  ? 'We collect only an alias and language preference—never a child’s full legal name or address. Append-only records track concept exposures, Pattern Lab task attempts (accuracy, scaffold level, relation type), and caregiver session notes.'
                  : 'Tunakusanya jina la utani pekee na lugha—hatuchukui jina kamili la kisheria. Tunahifadhi tu hatua za masomo, majaribio ya Pattern Lab, na maoni ya mlezi.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8EE]/70 dark:bg-stone-900 border border-[#C77700]/15 space-y-2">
              <h3 className="font-bold text-sm font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                {language === 'en' ? '2. Privacy-Enhanced Video & Zero Child AI' : '2. Video Salama na Hakuna AI kwa Mtoto'}
              </h3>
              <p>
                {language === 'en'
                  ? 'Social scenarios are embedded strictly via the privacy-enhanced YouTube domain (youtube-nocookie.com) with native controls hidden and zero autoplay. Child sessions are 100% deterministic—generative AI (Lumo) is never active in child mode.'
                  : 'Video zote zinatumia kikoa salama cha youtube-nocookie.com bila kuanza zenyewe. Vipindi vya mtoto havitumii AI ya kuzalisha maandishi.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8EE]/70 dark:bg-stone-900 border border-[#C77700]/15 space-y-2">
              <h3 className="font-bold text-sm font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                {language === 'en' ? '3. Who Can See This Data (RLS)' : '3. Nani Anaweza Kuona Taarifa Hizi'}
              </h3>
              <p>
                {language === 'en'
                  ? 'Records are scoped strictly to the guardian and any Speech-Language Pathologist (SLP) or educator explicitly granted access in the Care Team list.'
                  : 'Rekodi zinaonekana tu kwa mlezi na mtaalamu wa tiba au mwalimu aliyeongezwa rasmi na mlezi.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8EE]/70 dark:bg-stone-900 border border-[#C77700]/15 space-y-2">
              <h3 className="font-bold text-sm font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                {language === 'en' ? '4. Instant Revocation, Export & Deletion' : '4. Kuondoa Idhini, Kupakua au Kufuta'}
              </h3>
              <p>
                {language === 'en'
                  ? 'You can revoke consent at any moment, which immediately locks the child session, and you can export all records as JSON or permanently delete them below.'
                  : 'Unaweza kuondoa idhini wakati wowote na kufunga kipindi cha mtoto, kupakua rekodi zote, au kuzifuta kabisa.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportChildData}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-xs font-bold text-[#2D3748] dark:text-[#F5EFEB] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#2F6B4F]" />
                <span>{language === 'en' ? 'Export Child Data (JSON)' : 'Pakua Rekodi (JSON)'}</span>
              </button>
              <button
                onClick={handleDeleteChildData}
                className="px-4 py-2.5 rounded-xl border border-rose-300 text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Delete Child Records' : 'Futa Rekodi Zote'}</span>
              </button>
            </div>

            <button
              onClick={handleGrantConsent}
              className="bg-[#2F6B4F] hover:bg-[#23533d] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Unlock className="w-4 h-4" />
              <span>
                {language === 'en'
                  ? `Grant Caregiver Consent & Unlock Session`
                  : `Toa Idhini ya Mlezi na Fungua Mafunzo`}
              </span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // ACTIVE WORKSPACE (WHEN CONSENT IS GRANTED)
  // ==========================================================================
  return (
    <section className="w-full flex flex-col gap-6">
      {/* Top Institutional Header & Mode / Sensory Bar */}
      <div className="bg-white dark:bg-[#231E1A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 card-h-shadow flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#C77700]">
              <NotebookPen className="w-4 h-4" />
              <span>World Knowledge Engine &amp; Autism World (v2)</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#2F6B4F]">
                {syncStatus === 'synced'
                  ? language === 'en'
                    ? 'Server Ledger Synced'
                    : 'Rekodi Zimesawazishwa'
                  : language === 'en'
                  ? `Offline Queue (${pendingQueueCount} pending)`
                  : `Foleni ya Nje ya Mtandao (${pendingQueueCount})`}
              </span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setShowConsentModal(!showConsentModal)}
                className="underline hover:text-[#2D3748] dark:hover:text-white cursor-pointer inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                <span>
                  {language === 'en'
                    ? `Review Consent & Privacy (${activeConsent.version})`
                    : `Kagua Idhini na Faragha (${activeConsent.version})`}
                </span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3748] dark:text-[#F5EFEB] mt-1 leading-tight">
              {language === 'en'
                ? 'Semantic Concept Graph, Pattern Lab & Social Scenarios'
                : 'Grafu ya Maarifa, Maabara ya Mifumo na Matukio ya Kijamii'}
            </h2>
          </div>

          {/* Child Profile Selector + Child/Caregiver Mode Switch + Sensory Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active Child Profile Switcher */}
            <div className="flex items-center gap-1.5 bg-[#FFF8EE] dark:bg-stone-900 border border-[#C77700]/25 px-3 py-1.5 rounded-xl text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#C77700]" />
              <select
                value={activeChild.id}
                onChange={e => setActiveChildId(e.target.value)}
                aria-label="Select Child Profile"
                className="bg-transparent font-bold text-[#2D3748] dark:text-[#F5EFEB] focus:outline-none cursor-pointer"
              >
                {ledger.child_profiles.map(cp => (
                  <option key={cp.id} value={cp.id} className="text-gray-900">
                    {cp.alias}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Split Toggle: Child Active vs Caregiver General */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-stone-900 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSessionMode('child_active')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  sessionMode === 'child_active'
                    ? 'bg-[#2F6B4F] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Child Active' : 'Hali ya Mtoto'}</span>
              </button>
              <button
                onClick={() => setSessionMode('caregiver_general')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  sessionMode === 'caregiver_general'
                    ? 'bg-[#C77700] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Caregiver / Clinician' : 'Mlezi / Mtaalamu'}</span>
              </button>
            </div>

            {/* Quiet Mode Toggle */}
            <button
              onClick={() => {
                const next = !quietMode;
                setQuietMode(next);
                if (next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                quietMode
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-[#C77700] text-[#C77700]'
                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
              }`}
              title="Toggle Quiet Mode for sensory sensitivity"
            >
              {quietMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{quietMode ? (language === 'en' ? 'Quiet: ON' : 'Kimya: NDIO') : (language === 'en' ? 'Quiet: OFF' : 'Sauti: NDIO')}</span>
            </button>

            {/* Reduced Motion Toggle */}
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                reducedMotion
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#2F6B4F] text-[#2F6B4F]'
                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              {reducedMotion
                ? language === 'en'
                  ? 'Reduced Motion: ON'
                  : 'Mwendo Mdogo: NDIO'
                : language === 'en'
                ? 'Reduced Motion: OFF'
                : 'Mwendo: KAWAIDA'}
            </button>
          </div>
        </div>

        {/* Separate Recall Mastery vs Pattern Acquisition Summary Bar */}
        <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-gray-400 font-semibold mr-1.5">
                {language === 'en' ? 'Recall Mastery (Leitner Box ≥ 2):' : 'Kumbukumbu ya Maneno:'}
              </span>
              <span className="font-bold text-[#2D3748] dark:text-[#F5EFEB] font-mono tabular-nums">
                {recalledConceptsCount} / {TAUGHT_CONCEPTS.length} {language === 'en' ? 'taught concepts' : 'maneno'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold mr-1.5">
                {language === 'en' ? 'Patterns Acquired (Held-Out Verified):' : 'Mifumo Iliyothibitishwa:'}
              </span>
              <span className="font-bold text-[#2F6B4F] font-mono tabular-nums">
                {acquiredPatternsCount} / 5 {language === 'en' ? 'pattern types' : 'mifumo'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold mr-1.5">
                {language === 'en' ? 'Held-Out Transfer Pool:' : 'Maneno ya Uhamisho:'}
              </span>
              <span className="font-bold text-[#C77700] font-mono tabular-nums">
                {HELD_OUT_CONCEPTS.length} {language === 'en' ? 'untaught test concepts' : 'maneno mapya'}
              </span>
            </div>
          </div>

          {/* 3-Layer + Video Consumption Layer Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FFF8EE] dark:bg-stone-900 p-1 rounded-xl border border-[#C77700]/20">
            <button
              onClick={() => {
                if (activeNode.type === 'scenario') {
                  setActiveNode(TAUGHT_CONCEPTS[0]);
                } else if (activeNode.held_out) {
                  setActiveNode(TAUGHT_CONCEPTS[0]);
                }
                setActiveLayer('passive');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeLayer === 'passive'
                  ? 'bg-[#C77700] text-white shadow-xs'
                  : 'text-[#2D3748] dark:text-[#F5EFEB] hover:bg-[#C77700]/10'
              }`}
            >
              {language === 'en' ? '1. Passive (Observe)' : '1. Utulivu (Tazama)'}
            </button>
            <button
              onClick={() => {
                if (activeNode.type === 'scenario') setActiveNode(TAUGHT_CONCEPTS[0]);
                setIsAutoPlaying(false);
                setActiveLayer('interactive');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeLayer === 'interactive'
                  ? 'bg-[#C77700] text-white shadow-xs'
                  : 'text-[#2D3748] dark:text-[#F5EFEB] hover:bg-[#C77700]/10'
              }`}
            >
              {language === 'en' ? '2. Interactive Graph' : '2. Grafu Shirikishi'}
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                taskStartRef.current = Date.now();
                setActiveLayer('pattern_lab');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeLayer === 'pattern_lab'
                  ? 'bg-[#2F6B4F] text-white shadow-xs'
                  : 'text-[#2F6B4F] hover:bg-[#2F6B4F]/10'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '3. Pattern Lab' : '3. Maabara ya Mifumo'}</span>
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                if (activeNode.type !== 'scenario') setActiveNode(SCENARIOS[0]);
                setActiveLayer('scenario');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeLayer === 'scenario'
                  ? 'bg-[#2D3748] text-white shadow-xs'
                  : 'text-[#2D3748] dark:text-[#F5EFEB] hover:bg-gray-200/60'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '4. Video Scenarios' : '4. Video za Kijamii'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Consent & Data Governance Drawer */}
        {showConsentModal && (
          <div className="mt-2 p-4 rounded-2xl bg-[#FFF8EE] dark:bg-stone-900 border border-[#2F6B4F]/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                  {language === 'en'
                    ? `Consent, Child Profiles & Data Governance (${activeChild.alias})`
                    : `Idhini, Wasifu wa Mtoto na Usimamizi wa Data (${activeChild.alias})`}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === 'en'
                    ? `Active consent granted at ${new Date(activeConsent.granted_at).toLocaleString()} • Scope: ${activeConsent.scope}`
                    : `Idhini ilitolewa ${new Date(activeConsent.granted_at).toLocaleString()}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportChildData}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-gray-200 dark:border-white/10 text-xs font-bold text-[#2D3748] dark:text-[#F5EFEB] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#2F6B4F]" />
                  <span>{language === 'en' ? 'Export JSON' : 'Pakua JSON'}</span>
                </button>
                <button
                  onClick={handleRevokeConsent}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Revoke Consent & Lock' : 'Ondoa Idhini na Funga'}</span>
                </button>
                <button
                  onClick={handleDeleteChildData}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Delete Data' : 'Futa Data'}</span>
                </button>
              </div>
            </div>

            {/* Create Additional Child Profile (Alias only) */}
            <form onSubmit={handleCreateChildProfile} className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#C77700]/15">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {language === 'en' ? 'Add Child Profile (Alias only):' : 'Ongeza Wasifu wa Mtoto (Jina la utani):'}
              </span>
              <input
                type="text"
                value={newChildAlias}
                onChange={e => setNewChildAlias(e.target.value)}
                placeholder={language === 'en' ? 'e.g., Baraka (Age 5)' : 'mf., Baraka (Miaka 5)'}
                className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#2D3748] dark:text-[#F5EFEB]"
              />
              <button
                type="submit"
                className="bg-[#C77700] text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                {language === 'en' ? 'Create Profile' : 'Unda Wasifu'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main 3-Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================================================================ */}
        {/* COLUMN 1: CURRICULUM & GRAPH NAVIGATOR (3 cols)                  */}
        {/* ================================================================ */}
        <aside className="lg:col-span-3 bg-white dark:bg-[#231E1A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 card-h-shadow flex flex-col gap-3.5 max-h-[860px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2F6B4F] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Taught Curriculum' : 'Orodha ya Masomo'}</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-semibold">
                {TAUGHT_CONCEPTS.length} {language === 'en' ? 'taught words' : 'maneno'} · {SCENARIOS.length}{' '}
                {language === 'en' ? 'scenarios' : 'video'}
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          {initialFilter !== 'scenario' && (
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-stone-900 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-white dark:bg-stone-800 text-[#2D3748] dark:text-[#F5EFEB] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All ({visibleCurriculumNodes.length})
              </button>
              <button
                onClick={() => setActiveCategory('concepts')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
                  activeCategory === 'concepts'
                    ? 'bg-white dark:bg-stone-800 text-[#2D3748] dark:text-[#F5EFEB] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Words ({TAUGHT_CONCEPTS.length})
              </button>
              <button
                onClick={() => setActiveCategory('scenarios')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
                  activeCategory === 'scenarios'
                    ? 'bg-white dark:bg-stone-800 text-[#2D3748] dark:text-[#F5EFEB] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Video ({SCENARIOS.length})
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={sourceSearch}
              onChange={e => setSourceSearch(e.target.value)}
              placeholder={language === 'en' ? 'Search taught units...' : 'Tafuta somo...'}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-[#2D3748] dark:text-[#F5EFEB] focus:outline-none focus:border-[#C77700]"
            />
          </div>

          {/* Scrollable Taught Units List */}
          <div className="flex flex-col gap-2 overflow-y-auto notebook-scrollbar pr-1 max-h-[600px]">
            {filteredCurriculumNodes.map(node => {
              const isSelected = activeNode.id === node.id && activeLayer !== 'pattern_lab';
              const recall = childRecallMap[node.id];
              const box = recall?.box || 0;
              const expCount = childExposureCountMap[node.id] || 0;

              return (
                <button
                  key={node.id}
                  onClick={() => selectLessonNode(node)}
                  className={`w-full text-left rounded-xl p-3 border transition-colors cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'border-[#C77700] bg-amber-500/5 dark:bg-amber-500/10 ring-1 ring-[#C77700]/30'
                      : 'border-slate-100 dark:border-white/5 hover:border-slate-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {node.type === 'scenario' ? (
                        <div className="w-8 h-8 rounded-lg bg-[#2F6B4F]/10 text-[#2F6B4F] flex items-center justify-center shrink-0">
                          <Clapperboard className="w-4 h-4" />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${node.exemplars[0].bgClass} ${node.exemplars[0].accentClass}`}
                        >
                          <ConceptVisual conceptId={node.id} size="sm" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-[#2D3748] dark:text-[#F5EFEB] leading-tight">
                          {node.type === 'concept'
                            ? language === 'en'
                              ? `${node.label} (${node.swahiliLabel})`
                              : `${node.swahiliLabel} (${node.label})`
                            : node.communication_goal}
                        </h4>
                        <span className="text-[10px] text-gray-400 capitalize">
                          {node.type === 'scenario'
                            ? `${node.setting} scenario`
                            : `${node.subcategory} · ${node.exemplars.length} exemplars`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100 dark:border-white/5 font-mono tabular-nums">
                    <span>{box > 0 ? `Leitner Box ${box}/4` : 'Unpracticed'}</span>
                    <span>{expCount} exposures</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Caregiver-only note about the 6 Held-Out Transfer Concepts */}
          {sessionMode === 'caregiver_general' && (
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-900 border border-[#C77700]/20 text-[11px] space-y-1.5">
              <span className="font-bold text-[#C77700] block">
                {language === 'en'
                  ? `Held-Out Transfer Pool (${HELD_OUT_CONCEPTS.length} Hidden from Passive)`
                  : `Maneno ya Uhamisho (${HELD_OUT_CONCEPTS.length} Yamehifadhiwa)`}
              </span>
              <p className="text-gray-600 dark:text-gray-400 text-[10px] leading-normal">
                {HELD_OUT_CONCEPTS.map(c => `${c.label} (${c.swahiliLabel})`).join(', ')}
              </p>
            </div>
          )}
        </aside>

        {/* ================================================================ */}
        {/* COLUMN 2: CENTRAL LEARNING STAGE (6 cols)                        */}
        {/* ================================================================ */}
        <main className="lg:col-span-6 flex flex-col gap-4">
          {/* ============================================================== */}
          {/* LAYER 1: PASSIVE LAYER (Observe -> Recognize, 5-15s, Exemplars)*/}
          {/* ============================================================== */}
          {activeLayer === 'passive' && activeNode.type === 'concept' && (
            <div className="bg-white dark:bg-[#231E1A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 card-h-shadow flex flex-col gap-6">
              {/* Top Pacing & Exemplar Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-[#C77700]">
                    {language === 'en'
                      ? 'Passive Layer · Observe → Recognize'
                      : 'Hatua ya Utulivu · Tazama → Tambua'}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                    {language === 'en'
                      ? `${activeNode.label} (${activeNode.swahiliLabel})`
                      : `${activeNode.swahiliLabel} (${activeNode.label})`}
                  </h3>
                </div>

                {/* Pacing Selector (5s, 8s, 10s, 15s) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-500">
                    {language === 'en' ? 'Pacing:' : 'Muda:'}
                  </span>
                  {([5, 8, 10, 15] as const).map(sec => (
                    <button
                      key={sec}
                      onClick={() => setBeatDurationSec(sec)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono tabular-nums cursor-pointer transition-colors ${
                        beatDurationSec === sec
                          ? 'bg-[#C77700] text-white'
                          : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Varied Exemplar Display & Selector */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-32 h-32 rounded-3xl flex items-center justify-center p-5 ring-4 transition-colors ${
                    currentExemplar?.bgClass || 'bg-amber-50'
                  } ${currentExemplar?.accentClass || 'text-[#C77700]'} ${
                    currentExemplar?.ringClass || 'ring-amber-200'
                  }`}
                >
                  <ConceptVisual conceptId={activeNode.id} exemplar={currentExemplar} size="lg" />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {activeConceptExemplars.map((ex, idx) => (
                    <button
                      key={ex.id}
                      onClick={() => setExemplarIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        exemplarIndex % activeConceptExemplars.length === idx
                          ? 'bg-[#2D3748] text-white'
                          : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {language === 'en'
                        ? `Exemplar ${idx + 1}: ${ex.title_en}`
                        : `Mfano ${idx + 1}: ${ex.title_swa}`}
                    </button>
                  ))}

                  {/* Caregiver Custom Family Photo Upload */}
                  {sessionMode === 'caregiver_general' && (
                    <label className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#2F6B4F]/10 text-[#2F6B4F] hover:bg-[#2F6B4F]/20 cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>{language === 'en' ? '+ Family Photo' : '+ Picha ya Nyumbani'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCustomExemplar}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Invariant 4-Beat Sequence Step Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {(language === 'en' ? BEAT_LABELS_EN : BEAT_LABELS_SWA).map((lbl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBeatIndex(idx);
                        setBeatProgressPct(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        beatIndex === idx
                          ? 'bg-[#C77700] text-white shadow-xs'
                          : idx < beatIndex
                          ? 'bg-[#2F6B4F]/15 text-[#2F6B4F]'
                          : 'bg-gray-100 dark:bg-stone-800 text-gray-500'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                {/* Auto-Play Progress Bar */}
                {isAutoPlaying && (
                  <div className="w-full max-w-md h-2 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-[#C77700] transition-all duration-100"
                      style={{ width: `${beatProgressPct}%` }}
                    />
                  </div>
                )}

                {/* Active Beat Statement Card */}
                <div className="mt-5 bg-[#FFF8EE] dark:bg-stone-900 border border-[#C77700]/20 rounded-2xl p-6 max-w-lg w-full">
                  <span className="text-xs font-bold text-[#C77700] block mb-1">
                    {language === 'en' ? BEAT_LABELS_EN[beatIndex] : BEAT_LABELS_SWA[beatIndex]}
                  </span>
                  <p className="text-lg sm:text-xl font-serif font-bold text-[#2D3748] dark:text-[#F5EFEB] leading-relaxed">
                    "
                    {language === 'en'
                      ? activeNode.beats[BEAT_KEYS[beatIndex]]
                      : activeNode.beats[`${BEAT_KEYS[beatIndex]}_swa` as keyof ConceptNode['beats']]}
                    "
                  </p>
                </div>

                {/* Playback & Step Controls */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="bg-[#C77700] hover:bg-[#a66200] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>
                      {isAutoPlaying
                        ? language === 'en'
                          ? 'Pause Auto-Rhythm'
                          : 'Simamisha'
                        : language === 'en'
                        ? `Auto-Play (${beatDurationSec}s / beat)`
                        : `Cheza Kiotomatiki (${beatDurationSec}s)`}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const bKey = BEAT_KEYS[beatIndex];
                      const swaKey = `${bKey}_swa` as keyof ConceptNode['beats'];
                      speakPhrase(
                        `${activeNode.label}. ${activeNode.beats[bKey]}`,
                        `${activeNode.swahiliLabel}. ${activeNode.beats[swaKey]}`
                      );
                    }}
                    disabled={quietMode}
                    className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-white/10 text-[#2D3748] dark:text-[#F5EFEB] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Volume2 className="w-4 h-4 text-[#C77700]" />
                    <span>{language === 'en' ? 'Read Aloud' : 'Soma kwa Sauti'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (beatIndex < BEAT_KEYS.length - 1) {
                        setBeatIndex(prev => prev + 1);
                      } else {
                        recordNodeCompletion(activeNode, 'passive');
                        setBeatIndex(0);
                        setExemplarIndex(prev => prev + 1);
                      }
                    }}
                    className="bg-[#2F6B4F] hover:bg-[#23533d] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {beatIndex >= BEAT_KEYS.length - 1
                        ? language === 'en'
                          ? 'Complete & Rotate Exemplar'
                          : 'Kamilisha na Badili Picha'
                        : language === 'en'
                        ? 'Next Beat'
                        : 'Hatua Ifuatayo'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* LAYER 2: INTERACTIVE LAYER (Child Visual vs Caregiver Semantic)*/}
          {/* ============================================================== */}
          {activeLayer === 'interactive' && activeNode.type === 'concept' && (
            <div className="bg-white dark:bg-[#231E1A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 card-h-shadow flex flex-col gap-6">
              {sessionMode === 'child_active' ? (
                /* CHILD VIEW: Large Visual Cards, Tap to Hear Name, 3-4 Icon-Only Neighbors, Zero Jargon */
                <div className="flex flex-col items-center text-center gap-6">
                  <div>
                    <span className="text-xs font-bold text-[#2F6B4F]">
                      {language === 'en'
                        ? 'Tap the picture to hear its name, or tap a connected picture below'
                        : 'Gusa picha kusikia jina lake, au gusa picha zilizounganishwa hapa chini'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      speakPhrase(activeNode.label, activeNode.swahiliLabel);
                      recordNodeCompletion(activeNode, 'interactive');
                    }}
                    className={`w-44 h-44 rounded-3xl flex flex-col items-center justify-center p-6 ring-4 transition-transform hover:scale-105 cursor-pointer ${
                      currentExemplar?.bgClass || 'bg-amber-50'
                    } ${currentExemplar?.accentClass || 'text-[#C77700]'} ${
                      currentExemplar?.ringClass || 'ring-amber-200'
                    }`}
                  >
                    <ConceptVisual conceptId={activeNode.id} exemplar={currentExemplar} size="lg" />
                    <span className="mt-3 text-xl font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                      {language === 'en' ? activeNode.label : activeNode.swahiliLabel}
                    </span>
                  </button>

                  {/* 3 to 4 Icon-Only Visual Neighbors */}
                  <div className="w-full pt-4 border-t border-gray-100 dark:border-white/10">
                    <span className="text-xs font-bold text-gray-500 block mb-4">
                      {language === 'en' ? 'Connected Things' : 'Vitu Vinavyohusiana'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {connectedEdges.slice(0, 4).map(({ neighbor }) => (
                        <button
                          key={neighbor.id}
                          onClick={() => {
                            speakPhrase(neighbor.label, neighbor.swahiliLabel);
                            setActiveNode(neighbor);
                            setExemplarIndex(0);
                          }}
                          className={`p-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#C77700] flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer ${neighbor.exemplars[0].bgClass} ${neighbor.exemplars[0].accentClass}`}
                        >
                          <ConceptVisual conceptId={neighbor.id} size="md" />
                          <span className="text-sm font-bold text-[#2D3748] dark:text-[#F5EFEB]">
                            {language === 'en' ? neighbor.label : neighbor.swahiliLabel}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* CAREGIVER VIEW: Full Semantic Node Profile & Typed Edges with Explanations */
                <div className="space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${activeNode.exemplars[0].bgClass} ${activeNode.exemplars[0].accentClass}`}
                      >
                        <ConceptVisual conceptId={activeNode.id} size="md" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#C77700]">
                          <span className="uppercase">{activeNode.category}</span>
                          <span>·</span>
                          <span className="capitalize">{activeNode.subcategory}</span>
                          {activeNode.held_out && (
                            <>
                              <span>·</span>
                              <span className="text-rose-600">Held-Out Transfer Node</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB]">
                          {activeNode.label} / {activeNode.swahiliLabel}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Category-Specific Semantic Attributes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#FFF8EE]/60 dark:bg-stone-900 border border-[#C77700]/15 space-y-1.5">
                      <span className="font-bold text-[#C77700] block uppercase">
                        {language === 'en' ? 'Semantic Attributes' : 'Sifa za Neno'}
                      </span>
                      {activeNode.attributes.color && (
                        <p>
                          <strong>Color:</strong> {activeNode.attributes.color.join(', ')}
                        </p>
                      )}
                      {activeNode.attributes.shape && (
                        <p>
                          <strong>Shape:</strong> {activeNode.attributes.shape}
                        </p>
                      )}
                      {activeNode.attributes.texture && (
                        <p>
                          <strong>Texture:</strong> {activeNode.attributes.texture}
                        </p>
                      )}
                      {activeNode.attributes.taste && (
                        <p>
                          <strong>Taste:</strong> {activeNode.attributes.taste}
                        </p>
                      )}
                      {activeNode.attributes.energy && (
                        <p>
                          <strong>Energy / State:</strong> {activeNode.attributes.energy}
                        </p>
                      )}
                      {activeNode.attributes.expression && (
                        <p>
                          <strong>Expression:</strong> {activeNode.attributes.expression}
                        </p>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-[#FFF8EE]/60 dark:bg-stone-900 border border-[#C77700]/15 space-y-1.5">
                      <span className="font-bold text-[#2F6B4F] block uppercase">
                        {language === 'en' ? 'Environment & Functional Slots' : 'Mahali na Matumizi'}
                      </span>
                      <p>
                        <strong>found_in:</strong> {activeNode.found_in.join(', ')}
                      </p>
                      <p>
                        <strong>used_for:</strong> {activeNode.used_for.join(', ')}
                      </p>
                      <p>
                        <strong>actions:</strong> {activeNode.actions.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Typed Semantic Edges List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {language === 'en'
                        ? 'Typed Graph Edges (Pedagogical Relationships)'
                        : 'Viungo vya Grafu (Uhusiano wa Kifundishaji)'}
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {connectedEdges.map(({ edge, neighbor }, i) => {
                        const relMeta = RELATION_LABELS[edge.relation as EdgeRelationType];
                        return (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-stone-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-bold text-[#2D3748] dark:text-[#F5EFEB]">
                                  {activeNode.label}
                                </span>
                                <span className="text-gray-400">&rarr;</span>
                                <span className="font-mono text-[11px] font-bold text-[#C77700]">
                                  [{edge.relation}]
                                </span>
                                <span className="text-gray-400">&rarr;</span>
                                <span className="font-bold text-[#2F6B4F]">
                                  {neighbor.label} ({neighbor.swahiliLabel})
                                </span>
                                {neighbor.held_out && (
                                  <span className="text-[10px] font-bold text-rose-600">
                                    (Held-Out)
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {language === 'en' ? edge.explanation_en : edge.explanation_swa}
                              </p>
                              <span className="text-[10px] text-gray-400 block">
                                {language === 'en' ? relMeta.en : relMeta.swa}
                              </span>
                            </div>

                            <button
                              onClick={() => setActiveNode(neighbor)}
                              className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-gray-200 dark:border-white/10 text-xs font-bold text-[#2D3748] dark:text-[#F5EFEB] hover:border-[#C77700] shrink-0 cursor-pointer"
                            >
                              {language === 'en' ? 'Inspect Node' : 'Chunguza'} &rarr;
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* LAYER 3: PATTERN LAB (Predict -> Generalize -> Practice)       */}
          {/* ============================================================== */}
          {activeLayer === 'pattern_lab' && activePatternTask && (
            <div className="bg-white dark:bg-[#231E1A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 card-h-shadow flex flex-col gap-6">
              {/* Pattern Lab Header & Scaffold/Choice Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2F6B4F]">
                    <Puzzle className="w-4 h-4" />
                    <span>
                      {language === 'en'
                        ? `Pattern Lab · Task ${(patternTaskIndex % patternTasks.length) + 1} of ${patternTasks.length}`
                        : `Maabara ya Mifumo · Swali ${(patternTaskIndex % patternTasks.length) + 1} kati ya ${patternTasks.length}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#C77700]">
                      {language === 'en'
                        ? PATTERN_TASK_METADATA[activePatternTask.type].title_en
                        : PATTERN_TASK_METADATA[activePatternTask.type].title_swa}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {language === 'en'
                      ? `Graph Relation: ${activePatternTask.source_relation} • Choice Level L${activePatternTask.choice_level} (${activePatternTask.options.length} choices) • Scaffold S${activePatternTask.scaffold_level}`
                      : `Uhusiano: ${activePatternTask.source_relation} • Ngazi ya Chaguo L${activePatternTask.choice_level} • Usaidizi S${activePatternTask.scaffold_level}`}
                  </p>
                </div>

                {/* Task Type Selector Pills */}
                <div className="flex flex-wrap gap-1">
                  {patternTasks.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setPatternTaskIndex(idx);
                        setSelectedTaskOptionId(null);
                        setTaskFeedback(null);
                        taskStartRef.current = Date.now();
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-mono cursor-pointer ${
                        patternTaskIndex % patternTasks.length === idx
                          ? 'bg-[#2F6B4F] text-white'
                          : 'bg-gray-100 dark:bg-stone-800 text-gray-600'
                      }`}
                      title={PATTERN_TASK_METADATA[t.type].title_en}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Concept Visual Header */}
              <div className="flex flex-col items-center text-center gap-3">
                {getConceptById(activePatternTask.target_concept_id) && (
                  <div className="w-24 h-24 rounded-3xl bg-[#FFF8EE] dark:bg-stone-900 border border-[#C77700]/25 flex items-center justify-center text-[#C77700]">
                    <ConceptVisual conceptId={activePatternTask.target_concept_id} size="lg" />
                  </div>
                )}

                {activePatternTask.held_out && (
                  <span className="text-[11px] font-bold text-[#C77700]">
                    {language === 'en'
                      ? 'Held-Out Generalization Item (Never Taught in Passive Layer)'
                      : 'Jaribio la Uhamisho (Neno Hili Halikufundishwa Kwenye Hatua za Awali)'}
                  </span>
                )}

                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB] max-w-xl">
                  {language === 'en' ? activePatternTask.prompt_en : activePatternTask.prompt_swa}
                </h3>

                {/* Context Beats for predict_next_beat */}
                {activePatternTask.context_beats && (
                  <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs mt-1">
                    <div className="p-3 rounded-xl bg-[#FFF8EE] dark:bg-stone-900 border border-[#C77700]/20">
                      <span className="font-bold text-[#C77700] block">Beat 1</span>
                      <p className="text-[#2D3748] dark:text-[#F5EFEB] font-semibold mt-0.5">
                        {language === 'en'
                          ? activePatternTask.context_beats.beat1_en
                          : activePatternTask.context_beats.beat1_swa}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF8EE] dark:bg-stone-900 border border-[#C77700]/20">
                      <span className="font-bold text-[#C77700] block">Beat 2</span>
                      <p className="text-[#2D3748] dark:text-[#F5EFEB] font-semibold mt-0.5">
                        {language === 'en'
                          ? activePatternTask.context_beats.beat2_en
                          : activePatternTask.context_beats.beat2_swa}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Options Grid (Respects Scaffold Level S3 -> S0) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activePatternTask.options.map(opt => {
                  const isSelected = selectedTaskOptionId === opt.id;
                  const isCorrect = opt.id === activePatternTask.correct_id;
                  const showLabel = activePatternTask.scaffold_level >= 1; // S1, S2, S3 show label; S0 is image-only
                  const showHint = activePatternTask.scaffold_level >= 3; // S3 shows visual hint

                  let cardClass =
                    'bg-[#FFF8EE]/60 dark:bg-stone-900 border-gray-200 dark:border-white/10 hover:border-[#C77700]';
                  if (isSelected && isCorrect) {
                    cardClass = 'bg-[#2F6B4F] text-white border-[#2F6B4F]';
                  } else if (isSelected && !isCorrect) {
                    cardClass = 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleChoosePatternOption(opt.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-colors cursor-pointer flex items-center gap-3.5 ${cardClass}`}
                    >
                      {opt.conceptId && (
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center text-[#C77700] shrink-0">
                          <ConceptVisual conceptId={opt.conceptId} size="md" />
                        </div>
                      )}
                      <div className="flex-1">
                        {showLabel ? (
                          <span className="text-sm font-bold block">
                            {language === 'en' ? opt.label_en : opt.label_swa}
                          </span>
                        ) : (
                          <span className="text-xs italic opacity-75">
                            {language === 'en' ? 'Visual Choice (S0 Image Only)' : 'Chaguo la Picha Pekee (S0)'}
                          </span>
                        )}
                        {showHint && (opt.hint_en || opt.hint_swa) && (
                          <span className="text-[11px] opacity-80 block mt-1">
                            💡 {language === 'en' ? opt.hint_en : opt.hint_swa}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Supportive Pattern Feedback & Next Task Button */}
              {taskFeedback && (
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    taskFeedback.correct
                      ? 'bg-[#2F6B4F]/10 border-[#2F6B4F]/30 text-[#2D3748] dark:text-[#F5EFEB]'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-extrabold">
                      {taskFeedback.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-[#2F6B4F]" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-[#C77700]" />
                      )}
                      <span>{taskFeedback.message}</span>
                    </div>
                    <p className="text-xs opacity-90">{taskFeedback.explanation}</p>
                  </div>

                  <button
                    onClick={advanceToNextPatternTask}
                    className="bg-[#2F6B4F] hover:bg-[#23533d] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{language === 'en' ? 'Next Pattern Task' : 'Swali Lifuatalo'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* LAYER 4: AUTISM WORLD VIDEO SCENARIOS                          */}
          {/* ============================================================== */}
          {activeLayer === 'scenario' && activeNode.type === 'scenario' && (
            <ScenarioPlayer
              scenario={activeNode}
              language={language}
              reducedMotion={reducedMotion}
              quietMode={quietMode}
              allScenarios={SCENARIOS}
              onSelectRelatedScenario={scenarioId => {
                const target = SCENARIOS.find(s => s.id === scenarioId);
                if (target) selectLessonNode(target, 'scenario');
              }}
              onCorrect={() =>
                setStatusBanner(
                  language === 'en'
                    ? `Correct social response in ${activeNode.id}.`
                    : `Jibu sahihi la mawasiliano katika ${activeNode.id}.`
                )
              }
              onIncorrect={() =>
                setStatusBanner(
                  language === 'en'
                    ? `Replaying the 4 seconds preceding the cue for ${activeNode.id}.`
                    : `Inarudia sekunde 4 kabla ya swali katika ${activeNode.id}.`
                )
              }
              onCompleted={() => recordNodeCompletion(activeNode, 'scenario')}
            />
          )}

          {/* Status Feedback Bar */}
          {statusBanner && (
            <div
              className="bg-white dark:bg-[#231E1A] rounded-xl border border-slate-200/80 dark:border-white/10 px-4 py-3 text-xs font-semibold text-[#2F6B4F] flex items-center gap-2 card-h-shadow"
              role="status"
            >
              <Sparkles className="w-4 h-4 text-[#C77700] shrink-0" />
              <span>{statusBanner}</span>
            </div>
          )}
        </main>

        {/* ================================================================ */}
        {/* COLUMN 3: CAREGIVER DASHBOARD & CLINICAL INSIGHTS (3 cols)       */}
        {/* ================================================================ */}
        <aside className="lg:col-span-3 bg-white dark:bg-[#231E1A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 card-h-shadow flex flex-col gap-5">
          <div className="border-b border-gray-100 dark:border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#C77700] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {language === 'en' ? 'Caregiver & Clinical Dashboard' : 'Dashibodi ya Mlezi na Mtaalamu'}
                </span>
              </h3>
              <span className="text-[10px] text-gray-400 font-semibold">
                {language === 'en'
                  ? `Pattern evidence & notes for ${activeChild.alias}`
                  : `Ushahidi wa mifumo na maoni ya ${activeChild.alias}`}
              </span>
            </div>
          </div>

          {/* 1. Plain-Language Pattern Progress by Type */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              {language === 'en'
                ? 'Pattern Acquisition vs. Recall'
                : 'Utambuzi wa Mifumo na Kumbukumbu'}
            </span>
            {patternSummaries.map(ps => {
              const meta = PATTERN_TASK_METADATA[ps.pattern_type];
              return (
                <div
                  key={ps.pattern_type}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-stone-900 border border-gray-100 dark:border-white/5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D3748] dark:text-[#F5EFEB]">
                      {language === 'en' ? meta.title_en : meta.title_swa}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase ${
                        ps.status === 'acquired'
                          ? 'text-[#2F6B4F]'
                          : ps.status === 'consolidating'
                          ? 'text-[#C77700]'
                          : 'text-gray-400'
                      }`}
                    >
                      {ps.status === 'acquired'
                        ? language === 'en'
                          ? '✓ Acquired'
                          : '✓ Imeeleweka'
                        : ps.status === 'consolidating'
                        ? language === 'en'
                          ? '● Consolidating'
                          : '● Inaimarika'
                        : language === 'en'
                        ? '○ Emerging'
                        : '○ Inaanza'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
                    {language === 'en' ? ps.summary_en : ps.summary_swa}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 2. Per-Unit Caregiver & Educator Notes (Auto-Saved to Server Ledger) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
                <NotebookPen className="w-3 h-3 text-[#2F6B4F]" />
                <span>
                  {language === 'en'
                    ? `Notes: ${activeNode.type === 'concept' ? activeNode.label : activeNode.id}`
                    : `Maoni: ${activeNode.type === 'concept' ? activeNode.swahiliLabel : activeNode.id}`}
                </span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(noteText);
                  setCopiedNote(true);
                  setTimeout(() => setCopiedNote(false), 2000);
                }}
                disabled={!noteText}
                className="text-[10px] font-bold text-gray-400 hover:text-[#C77700] flex items-center gap-1 cursor-pointer disabled:opacity-30"
              >
                {copiedNote ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNote ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              value={noteText}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Record child responses, sensory preferences, or generalization cues...'
                  : 'Andika maendeleo ya mtoto, vitu anavyopenda, au mafanikio...'
              }
              rows={3}
              className="w-full p-3 bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-[#2D3748] dark:text-[#F5EFEB] focus:outline-none focus:border-[#2F6B4F] resize-none"
            />
          </div>

          {/* 3. Clinician Gate & Care Team Access (Visible in Caregiver Mode) */}
          <div className="p-3.5 bg-[#FFF8EE]/70 dark:bg-stone-900 rounded-xl border border-[#C77700]/20 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2F6B4F] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Clinical Review & Care Team' : 'Timu ya Wataalamu'}</span>
              </span>
              <span className="text-[10px] font-bold text-[#C77700]">
                {ledger.clinician_parameters.accuracyThresholdPct}% · {ledger.clinician_parameters.minSessions} sess ·{' '}
                {ledger.clinician_parameters.minDistinctDays}d
              </span>
            </div>

            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-normal">
              <strong>Reviewed by:</strong> {ledger.clinician_parameters.clinicianName}
            </p>

            {/* Care Team Members List */}
            <div className="space-y-1 pt-1">
              {ledger.care_team_members
                .filter(m => m.child_id === activeChild.id && !m.revoked_at)
                .map(member => (
                  <div key={member.id} className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300">
                    <span className="truncate">{member.member_name}</span>
                    <span className="text-[10px] font-bold text-[#2F6B4F] shrink-0 ml-1">{member.role}</span>
                  </div>
                ))}
            </div>

            {sessionMode === 'caregiver_general' && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!newCareTeamName.trim()) return;
                  const nextTeam = [
                    ...ledger.care_team_members,
                    {
                      id: `team-${Date.now()}`,
                      child_id: activeChild.id,
                      member_user_id: `user-${Date.now()}`,
                      member_name: newCareTeamName.trim(),
                      role: newCareTeamRole,
                      granted_by: 'guardian-local-01',
                      granted_at: new Date().toISOString(),
                      revoked_at: null
                    }
                  ];
                  persistAndSync({ ...ledger, care_team_members: nextTeam });
                  setNewCareTeamName('');
                }}
                className="pt-2 border-t border-[#C77700]/15 flex flex-col gap-1.5"
              >
                <input
                  type="text"
                  value={newCareTeamName}
                  onChange={e => setNewCareTeamName(e.target.value)}
                  placeholder={language === 'en' ? 'Grant SLP / Educator name...' : 'Jina la mtaalamu / mwalimu...'}
                  className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-[11px]"
                />
                <button
                  type="submit"
                  className="bg-[#2F6B4F] text-white py-1.5 rounded-lg text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{language === 'en' ? 'Grant Care-Team Read Access' : 'Ruhusu Mtaalamu Kuona'}</span>
                </button>
              </form>
            )}
          </div>

          {/* 4. Lumo AI Boundary Control (Strictly Caregiver-General Mode Only) */}
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-stone-900 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
              {language === 'en' ? 'AI Safety Boundary' : 'Mpaka wa Usalama wa AI'}
            </span>
            {sessionMode === 'child_active' ? (
              <p className="text-[11px] text-gray-500 leading-normal flex items-start gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2F6B4F] shrink-0 mt-0.5" />
                <span>
                  {language === 'en'
                    ? 'Child Active Mode: Generative AI (Lumo) is disabled. All prompts and feedback are 100% deterministic.'
                    : 'Hali ya Mtoto: Lumo AI imezimwa. Maswali yote yanazalishwa kwa mfumo maalum bila AI.'}
                </span>
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-gray-600 dark:text-gray-300">
                  {language === 'en'
                    ? 'Caregiver Mode active: You may consult Lumo to summarize pattern progress or draft session notes.'
                    : 'Hali ya Mlezi: Unaweza kumuuliza Lumo kuhusu maendeleo ya mifumo.'}
                </p>
                {onOpenLumo && (
                  <button
                    onClick={onOpenLumo}
                    className="w-full bg-[#C77700] hover:bg-[#a66200] text-white py-2 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {language === 'en' ? 'Open Lumo (Caregiver Mode)' : 'Fungua Lumo (Hali ya Mlezi)'}
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
