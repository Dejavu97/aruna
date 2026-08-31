# 🤖 AI CODING AGENT RULES & CONTRACT PROTOCOLS

> **Target:** Future AI Agents (Gemini, Claude, GPT, Antigravity, Copilot)  
> **Repository:** `aruna-undangan`  
> **Mandate:** Read and obey these rules BEFORE proposing or modifying any code in this repository.

---

## 🛑 SECTION 1: MANDATORY PRE-FLIGHT CHECKLIST

Before touching any file in this repository, you MUST perform the following 5 checks:

1. **Read the Architecture Contract:**
   - Always review [`docs/ARCHITECTURE_CONTRACT.md`](./ARCHITECTURE_CONTRACT.md) to understand current schemas, data flow, and protected files.
2. **Identify Affected Contracts:**
   - Are you touching a data model? (`bride`, `groom`, `events`, `banks`, `story`).
   - If yes, verify that all isolated theme templates still receive their expected fields with safe optional chaining (`?.`).
3. **Identify Breaking-Change Risk:**
   - Changing `getFormMode()`/`FORM_BASES` in `themes.js` affects `WeddingForm.jsx`, `Edit.jsx`, and all invitation headers. Per-theme deviation = `formOverrides` di entri tema, BUKAN if baru.
   - Changing `getPackagesByEventType()` in `site.js` affects `Order.jsx`, `Success.jsx`, `Dashboard.jsx`, and `Admin.jsx`.
   - Theme dispatch is via `src/invitation/themeRegistry.js` — JANGAN menambah if-chain di `Invitation.jsx`; daftarkan lewat `registerThemeComponent()`.
4. **Never Modify Protected Security Architecture:**
   - Do NOT loosen Firestore Rules (`firestore.rules`).
   - Do NOT remove `safeUrl()` from link rendering.
   - Do NOT allow client-side status modifications (`status: 'paid'`).
5. **No Blind Refactoring:**
   - Do NOT rewrite or restructure existing working files just to match generic conventions. Keep existing behavior and UI intact.

---

## 🎨 SECTION 2: RULES FOR THEME DEVELOPMENT

When tasked with creating a new theme, designing a layout, or tweaking visuals:

### ✅ DO:
* **Use the Isolated Theme Method:** Create a dedicated component `src/invitation/Theme[ThemeName].jsx` and CSS `Theme[ThemeName].css`.
* **Scope all CSS classes:** Prefix your CSS selectors with a theme acronym (e.g. `.rb-`, `.jb-`, `.gz-`, `.em-`) to prevent global style pollution.
* **Support Single & Dual Person Modes:** Check `Boolean(data.groom?.nick || data.groom?.full) && data.groom?.nick !== data.bride?.nick` before rendering groom cards or titles.
* **Reuse Core Utilities:** Import `formatLongDate`, `formatTime`, `safeUrl`, `countdownParts`, and `copyText` from `../lib/utils`.
* **Use Unified RSVP / Wishes APIs:** Import `addRsvp` and `addWish` from `../lib/api`.

### ❌ DO NOT:
* **DO NOT** invent new database field names for standard attributes (e.g. do not create `data.pelangganName` when `data.bride.nick` is the standard).
* **DO NOT** modify Firestore rules or backend API just to accommodate a visual component.
* **DO NOT** hardcode couple names, dates, or assets inside theme components; always source them from `props.data`.
* **DO NOT** bypass `safeUrl()` when rendering `<a>` tags for streaming or social media.

---

## 🎈 SECTION 3: RULES FOR INVITATION TYPE EXTENSION

When adding a new event category (e.g. *Khitanan, Sweet 17th, Golden Anniversary*):

1. **Add Form Mode Specification:**
   - Extend `getFormMode()` in `src/data/themes.js` with field visibility flags, labels, placeholders, and default event sessions.
2. **Add Event Packages:**
   - Add pricing tiers to `eventPackages` in `src/data/site.js` and register them in `getPackagesByEventType()`.
3. **Update Page Titles & Adaptive Strings:**
   - Update `document.title` and banner strings in `src/pages/InvitationPage.jsx`, `src/pages/CustomDomainPage.jsx`, `src/components/WeddingFrameModal.jsx`, and `src/components/PrintCardModal.jsx`.

---

## 🔒 SECTION 4: SECURITY & DATA INTEGRITY PROTOCOLS

1. **Private Keys Brankas:**
   - `private_keys/{slug}` is write-only upon creation. NEVER add `allow read: if true;` to `firestore.rules`.
2. **Payment Verification:**
   - Payment status (`'unpaid'` -> `'paid'`) can ONLY be modified by authenticated admins.
3. **Upload Limits:**
   - Cloudinary uploads must be validated for size (max 15MB) and type (`image/*` / `audio/*`).
4. **Anti-DoS:**
   - Arrays for `wishes` and `rsvps` must remain capped at 500 items per document.

---

## 🚀 SECTION 5: VERIFICATION COMMANDS

After making any code changes, always run:
```bash
npm run build
```
* Ensure the build completes with **Exit Code 0** and **No Bundle Size Warnings**.
* Test both desktop and mobile viewports.
