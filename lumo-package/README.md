# Lumo AI Assistant & Voice Coach Bundle

This bundle contains all documentation, specification sheets, test matrices, and source code files for **Lumo**, the AI Assistant and Voice Coach inside **Autism Unmasked Kenya (autism.ke)**.

---

## 📦 Package Contents

1. **`LUMO_SPEC_AND_PROMPTS.md`**  
   - Complete technical specification doc following standard spec structure:
     - 1. Objective
     - 2. Persona spec (Fixed)
     - 3. Age/context lock (Children 5-12 & Caregivers)
     - 4. Boundary protocol ("If X Then Y" table: Tangents, Echolalia, Distress aborts, Verbal boundary testing, Gibberish/mic artifacts, Child safety disclosures)
     - 5. Gemini Playground ready system prompt
     - 6. 15-Turn weighted test matrix with binary pass/fail checks
     - 7. Pass/fail criteria & batch iteration guidelines

2. **`server.ts`**  
   - Full-stack Express backend route (`/api/chat`) implementing the Google GenAI SDK (`@google/genai`), dual English & Swahili system prompts, chat history management, and secure API key handling.

3. **`InspirationalQuoteWidget.tsx`**  
   - Daily inspirational encouragement widget for parents with text-to-speech audio synthesis, deterministic rotation, Swahili/English quotes, copy-to-clipboard, and direct Lumo launcher.

4. **`AppTourModal.tsx`**  
   - Interactive voice-guided walkthrough modal showcasing Lumo as Step 1 with speech synthesis audio.

5. **`LumoChatDrawer.tsx`**  
   - Stand-alone React UI component for the Lumo floating assistant drawer, quick-reply chips, message bubbles, and offline Kenyan clinic fallbacks.

---

## 🚀 How to Run in Google AI Studio / Gemini Playground

1. Go to [Google AI Studio](https://aistudio.google.com).
2. Choose model **Gemini 2.5 Flash** or **Gemini 3.5 Flash**.
3. Set **Temperature** to `0.2` (for high predictability and adherence to boundaries).
4. Paste the System Prompt from `LUMO_SPEC_AND_PROMPTS.md` into the **System Instructions** box.
5. Execute the 15-scenario test matrix from Section 6 and evaluate binary pass/fail checks.
