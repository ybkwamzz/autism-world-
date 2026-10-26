import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Please add it via the Secrets panel in Settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Persistent Server-Side Ledger Store (mirrors Supabase RLS per-child tables)
const DATA_DIR = path.join(process.cwd(), '.data');
const LEDGER_FILE = path.join(DATA_DIR, 'learning_ledger.json');

interface ServerLedgerStore {
  child_profiles: any[];
  consent_records: any[];
  care_team_members: any[];
  exposures: any[]; // append-only
  task_attempts: any[]; // append-only
  pattern_progress: any[];
  recall_state: any[];
  caregiver_notes: any[];
  custom_exemplars: any[];
  clinician_parameters: {
    accuracyThresholdPct: number;
    minSessions: number;
    minDistinctDays: number;
    maxScaffoldForAcquired: number;
    reviewedByClinician: boolean;
    clinicianName: string;
  };
}

function getDefaultLedger(): ServerLedgerStore {
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
    pattern_progress: [],
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

function readLedger(): ServerLedgerStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEDGER_FILE)) {
      const initial = getDefaultLedger();
      fs.writeFileSync(LEDGER_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(LEDGER_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading server ledger:', e);
    return getDefaultLedger();
  }
}

function writeLedger(store: ServerLedgerStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEDGER_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing server ledger:', e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: '5mb' }));

  // ==========================================================================
  // PER-CHILD INSTITUTIONAL RECORDS API (Append-Only Ledger + RLS Structure)
  // ==========================================================================
  app.get('/api/learning/state', (_req, res) => {
    const store = readLedger();
    res.json(store);
  });

  app.post('/api/learning/sync', (req, res) => {
    const store = readLedger();
    const {
      child_profiles,
      consent_records,
      care_team_members,
      new_exposures,
      new_task_attempts,
      recall_state,
      caregiver_notes,
      custom_exemplars,
      clinician_parameters
    } = req.body;

    if (Array.isArray(child_profiles)) {
      for (const cp of child_profiles) {
        const idx = store.child_profiles.findIndex(p => p.id === cp.id);
        if (idx >= 0) store.child_profiles[idx] = cp;
        else store.child_profiles.push(cp);
      }
    }

    if (Array.isArray(consent_records)) {
      for (const cr of consent_records) {
        const idx = store.consent_records.findIndex(c => c.id === cr.id);
        if (idx >= 0) store.consent_records[idx] = cr;
        else store.consent_records.push(cr);
      }
    }

    if (Array.isArray(care_team_members)) {
      store.care_team_members = care_team_members;
    }

    // Append-only discipline for exposures
    if (Array.isArray(new_exposures)) {
      for (const exp of new_exposures) {
        if (!store.exposures.some(e => e.id === exp.id)) {
          store.exposures.push(exp);
        }
      }
    }

    // Append-only discipline for task_attempts
    if (Array.isArray(new_task_attempts)) {
      for (const att of new_task_attempts) {
        if (!store.task_attempts.some(a => a.id === att.id)) {
          store.task_attempts.push(att);
        }
      }
    }

    if (Array.isArray(recall_state)) {
      for (const rs of recall_state) {
        const idx = store.recall_state.findIndex(
          r => r.child_id === rs.child_id && r.concept_id === rs.concept_id
        );
        if (idx >= 0) store.recall_state[idx] = rs;
        else store.recall_state.push(rs);
      }
    }

    if (Array.isArray(caregiver_notes)) {
      for (const note of caregiver_notes) {
        const idx = store.caregiver_notes.findIndex(
          n => n.child_id === note.child_id && n.node_id === note.node_id
        );
        if (idx >= 0) store.caregiver_notes[idx] = note;
        else store.caregiver_notes.push(note);
      }
    }

    if (Array.isArray(custom_exemplars)) {
      store.custom_exemplars = custom_exemplars;
    }

    if (clinician_parameters) {
      store.clinician_parameters = clinician_parameters;
    }

    writeLedger(store);
    res.json({ ok: true, store });
  });

  app.delete('/api/learning/child/:childId', (req, res) => {
    const { childId } = req.params;
    const store = readLedger();
    store.exposures = store.exposures.filter(e => e.child_id !== childId);
    store.task_attempts = store.task_attempts.filter(a => a.child_id !== childId);
    store.recall_state = store.recall_state.filter(r => r.child_id !== childId);
    store.caregiver_notes = store.caregiver_notes.filter(n => n.child_id !== childId);
    store.custom_exemplars = (store.custom_exemplars || []).filter((c: any) => c.child_id !== childId);
    writeLedger(store);
    res.json({ ok: true, store });
  });

  // ==========================================================================
  // LUMO AI ASSISTANT ROUTE (Caregiver-General Mode Only)
  // ==========================================================================
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, language, mode } = req.body;

      // Enforce strict AI boundary: reject generative calls if child_active mode is passed
      if (mode === 'child_active') {
        return res.status(403).json({
          error: 'Generative AI is disabled in child_active mode. Child sessions use deterministic graph tasks only.'
        });
      }

      let client;
      try {
        client = getAiClient();
      } catch (e: any) {
        console.warn('Gemini Client initialization failed: ', e.message);
        return res.status(200).json({
          text: language === 'swa'
            ? "Hujambo! Funguo ya siri ya Gemini (API Key) haijawekwa kwenye mipangilio bado. Tafadhali weka 'GEMINI_API_KEY' katika upande wa 'Settings > Secrets' ili kuwasha msaidizi huyu mwerevu. Kwa sasa, nitakusaidia na majibu ya kawaida!"
            : "Hello! The Gemini API Key is not configured yet in the Secrets panel. Please add 'GEMINI_API_KEY' in 'Settings > Secrets' to enable the smart assistant. For now, I'll answer using built-in guide questions!",
          isConfigured: false
        });
      }

      const sysPrompt = language === 'swa'
        ? `Wewe ni Lumo (Caregiver Mode), msaidizi wa wazazi na walimu wa Autism Unmasked Kenya.
Kazi yako ni kuwasaidia walezi kuelewa maendeleo ya mtoto kwenye World Knowledge Engine na Pattern Lab (utambuzi wa mifumo, uhamisho wa ujuzi kwa maneno mapya, na ngazi za usaidizi S3-S0), bila kutoa utambuzi wa kimatibabu (diagnosis).
Vunja dhana mbaya na eleza mbinu za ratiba za picha na kutuliza hisia kwa Kiswahili fasaha na chenye upole.`
        : `You are Lumo (Caregiver Mode), the empathetic caregiver and educator assistant for Autism Unmasked Kenya.
You assist parents, teachers, and care teams in understanding their child's Pattern Lab progress (predicting beats, sorting categories, odd-one-out, held-out transfer tests, and scaffold fading S3 to S0) and drafting session notes.
Never diagnose or make clinical conclusions. Promote early intervention, Kenyan support networks (KISE, Gertrude's, KNH), and sensory-friendly visual routines.`;

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: `${message}\n\n[Instruction: Keep response focused, compassionate, and respond in ${language === 'swa' ? 'Swahili' : 'English'}.]` }]
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: sysPrompt,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text, isConfigured: true });
    } catch (error: any) {
      console.error('Express /api/chat error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite dev server middleware loaded.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving built static files in production.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
