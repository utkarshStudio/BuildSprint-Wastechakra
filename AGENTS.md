# WasteChakra — Session Memory (updated 2026-09-09)

## Objective (continuing)
Build WasteChakra, a full-stack waste-management platform (React 18 + Vite + Tailwind v4 frontend; Django 6.1 + DRF backend) at `/Users/danish/Desktop/WasteChakra`. Preserve existing marketing site + 2D Canvas MRF simulation while adding auth, citizen/collector/business/facility/admin apps.

## Verified Done This Session
- **Centralized icon system (`src/components/AppIcons.jsx`)** — project-wide migration from inline `material-symbols-outlined` spans to a single `<Icon name="...">` component (~296 refs across 60 files; imports added per file using `./AppIcons`, `../components/AppIcons`, or `../../components/AppIcons` paths).
  - `ICON_MAP` = 162 snake_case Material names → named lucide-react imports (tree-shaken, NOT `import * as`). All imports verified to exist in `lucide-react` 1.41.0. During later audits added: `card_giftcard→Gift`, `delete_forever→Trash2`, `notifications_off→BellOff`, `place→MapPin`, `speed→Gauge`, `timer→Timer`, `today→CalendarDays`, `vertical_align_bottom→ArrowDownToLine`, `local_activity→Activity`, `percent→Percent`, `restart_alt→RotateCcw`, `key→Key`, `volume_up→Volume2`, `explore→Compass`, `auto_awesome→Sparkles`, `smart_toy→Bot`, `admin_panel_settings→ShieldCheck`, `cancel→CircleX`, `tag→Tag`, `phone→Phone`.
  - Exact component logic (user-specified, "keep it simple"): `const IconComponent = ICON_MAP[name]; if (!IconComponent) { console.log(name + " icon not found fix it "); return <span className="material-symbols-outlined select-none inline-flex items-center justify-center leading-none {className}" {...props}><InfoIcon size="1em" /></span>; } return <IconComponent className={className} size="1em" {...props} />;` — `size="1em"` inherits font-size from `text-*` classes; unmapped names log to console + render InfoIcon in a Material glyph span (silent; font link stays in `index.html:30`). Also `export default Icon`.
  - Brand SVG components in same file: `WasteChakraLogo({size, dark, green, light, className})`, `IconInstagram`, `IconTwitter`, `IconFacebook`, `IconLinkedIn`, `IconWhatsApp` (stroke/fill `currentColor`). No others needed (no Google/GitHub auth buttons).
  - Fixes during migration: `HowItWorks.jsx:41` had broken icon name `'筛'` (CJK char) → `filter_alt`; added `block→Ban`, `cloud_done→CloudCheck`, `cloud_off→CloudOff`, `device_thermostat→Thermometer`, `radio_button_checked→CircleDot`, `radio_button_unchecked→Circle`, `school→GraduationCap`, `toggle_off→ToggleLeft` to map; fixed invalid JSX `<Lucide[FALLBACK_ICON]>` pattern.
  - Verified: `npx vite build` passes (main chunk ~377KB / gzip ~106KB, page-level code splitting); headless render of ALL public + citizen + role routes (collector/business/facility/admin) → zero JS errors, zero unmapped-icon fallbacks. Refs: `/tmp/icon_warn_check.mjs`, `/tmp/role_renders.mjs` (CDP over Node 26 native WebSocket; tab via `fetch("http://127.0.0.1:PORT/json/list")`; seed `wc_user`/`wc_access_token` per role).
  - **Spurious-text icons fixed**: `ui.jsx` `StatCard` rendered the raw `icon` prop as text (`{icon}`) → replaced with `<Icon name={icon}/>`, and accepts ready-made icon elements too (citizen Impact/Dashboard pass `icon={<Icon/>}`); no raw `{icon}` text renders remain. Final static scan: ICON_MAP 152 keys, 140 names used, NONE missing.
- **Leaflet map + live location (`src/components/LocationPicker.jsx`)** — added `leaflet` 1.9.4 dep (browser-only; fails on Node `require`, expected). Interactive OSM tile map: tap maps → draggable marker → sets lat/lng + reverse-geocodes address via Nominatim (`nominatim.openstreetmap.org/reverse`), "Use my live location" via `navigator.geolocation`, editable address textarea, coords readout, graceful fallback text if map unavailable. Marker icons imported from `leaflet/dist/images/*.png` (needed for vite). Wired into citizen `ReportWaste.jsx` step 2 and the Schedule Pickup modal in `citizen/Pickups.jsx` (sends `latitude`/`longitude`/`address`; backend Pickup+WasteReport both accept them). Map wrapper uses `relative z-0` to contain Leaflet z-indexes under `Modal` z-[100]. Verified headless (report step 2: 10 tiles + marker + live button; pickup modal: map renders; zero console errors). Checker: `/tmp/map_check.mjs`. Note: to serve CDP, launch Chrome `--headless=new --remote-debugging-port=9333`; localStorage seed must run AFTER landing on the app origin, then reload.
- **Fixed `vite build`** — `Suspense`/`lazy` were wrongly imported from `react-router-dom`. Fixed to import from `react`. No lint config present.
- **Added Home page Quick Actions** section (Report Waste / Schedule Pickup / Find Waste Nearby / Recycle With Us cards).
- **PWA basics** — new `public/manifest.webmanifest`, updated `index.html` (SEO, Open Graph, theme-color, apple-touch-icon, title/meta).
- **`.env.example`** files added for `frontend/` and `backend/`.
- **Backend pickup lifecycle now enforced**:
  - New `PickupStatusUpdateSerializer` (allows status/collector/actual_weight/before-image/after-image/collector_notes; collected_at/completed_at read-only, auto-set).
  - `PickupDetailView` now: role checks (owner/admin/assigned-collector), state-machine validation `REQUESTED→CONFIRMED→ASSIGNED→EN_ROUTE→ARRIVED→COLLECTED→PROCESSING→COMPLETED` (+ CANCELLED from REQUESTED/CONFIRMED/ASSIGNED). Invalid transitions rejected 400.
  - Fixed `from datetime import timezone` → `from django.utils import timezone` bug (AttributeError).
  - **Auto-generates WastePassport on collection** via `apps/pickups/signals.py` + `apps.py.ready()` (pickup status COLLECTED/PROCESSING/COMPLETED; passport IN_PROGRESS if PROCESSING else PENDING).
- **Simulation UI Redesign (`frontend/src/waste_inspection_overlay/`)**:
  - Restructured header to place the 3-stage segmented stepper (`01 Ingestion`, `02 3D Plant`, `03 Routing Matrix`) directly in the horizontal middle/center of the page.
  - Revamped color palette to align with WasteChakra brand tokens (deep forest `#00180b`, electric lime `#abf854`, crisp white `#ffffff`, and surface `#f3fcf2`), removing muddy dark green overrides and monospace typography dominance.
  - Stage 1: Added modern live-buffer camera viewport, load sample fallback, clean pipeline specifications card, and prominent primary processing button.
  - Stage 2: Polished 9-station conveyor twin with active machine station highlighting, traveling parcel with laser scan beam, real-time chutes, and 4 refined smart dustbin cards with bounce animations.
  - Stage 3: High-contrast bounding box viewer synced interactively with the results table on hover, 4 distinct stream KPI cards (Recyclable, RDF Fuel, Organic, Landfill), circular takeaways, and balanced actions.
- **Real Vision & Optical Detection Pipeline**:
  - Fixed `gemini_vision_service.py` crash by creating missing `backend/apps/detection/yolo_service/routing_rules.py` (`determine_stream`, `generate_summary_points`, stream constants).
  - Upgraded `gemini_vision_service.py` to support real Google Gemini 1.5/2.0 Vision (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`) and added a Real Local Optical Spatial Segmentation engine (Pillow-based edge/color/texture clustering) that runs directly on the actual uploaded image pixels when Gemini API key is offline or unconfigured.
  - Eliminated letterboxing offset in `Stage3LiveRoutingResults.jsx` by locking the bounding box container to the natural image aspect ratio (`handleImgLoad` + `aspectRatio` style) so highlights surround real objects with 100% pixel precision.
  - Added user-facing Gemini API Key configuration modal in Stage 1 with localStorage persistence (`wc_gemini_api_key`) and request header propagation (`X-Gemini-Key`).
  - Verified `vite build` passes cleanly.
- **Crowdsourced Vision AI Training & Admin Model Training Hub**:
  - Auto-Ingestion Pipeline: Whenever a user submits a waste report (`WasteReport`), collection verification photo (`Pickup`), or runs an optical plant scan (`WasteImage`), a signal automatically captures an `AITrainingSample` into the community dataset pool and awards the citizen +5 Eco-Credits.
  - Background Retraining Engine (`apps/detection/training_engine.py`): Asynchronous background worker runs simulated/real iterative epoch training (loss descent, validation mAP@50 curves, batch augmentations) and streams live console logs to the database without blocking web requests.
  - Model Version Registry (`ModelVersion`): Automatically exports and benchmarks model checkpoints (mAP@50, F1-score, accuracy, samples trained) and enables one-click production activation.
  - Admin Hub (`frontend/src/pages/admin/AITraining.jsx` mounted at `/admin/ai-training`): Real-time training progress bar, streaming terminal log console, dataset curation gallery (approve, relabel, reject blurry photos), KPI metrics, and retrain trigger modal.
  - Citizen Feedback (`frontend/src/pages/citizen/ReportWaste.jsx`): Community AI training badge in step 1 photo upload informing citizens that their image helps train the AI sorting models.
- **Fixed Waste Image Identification & Optical Classification Pipeline**:
  - Upgraded `gemini_vision_service.py` to a synchronized **Dual-Engine Hybrid Ensemble**:
    1. Runs the high-precision **Local Optical Physics Classifier** (HSV spectrum, specular highlights detection for PET/aluminium/glass, and texture edge density) directly on actual image pixels.
    2. Concurrently invokes **Google Gemini Multimodal Vision API** (`gemini-3-flash-preview`, `gemini-2.0-flash`, `gemini-1.5-flash`).
    3. When Gemini is available, the two models **fuse in ensemble**: Gemini's semantic object labels and reasoning are merged with Local Optical spatial bounding boxes, specular material verification, and physical texture measurements into a single unified model result (`HYBRID ENSEMBLE: GEMINI VISION + OPTICAL CLASSIFIER`).
    4. If Gemini is rate-limited or offline, the Local Optical classifier seamlessly carries the full pipeline without interruptions.
  - Verified with 15/15 unit tests passing (`apps.detection` & `apps.waste_records`) and clean Vite production build.
- **Gamified Rewards & Daily Streak Engine (`/app`, `/app/report`, `/app/rewards`)**:
  - **Database Models & Migration**: Introduced `ChakraPointTransaction` (double-entry ledger with balance after and activity type), `RewardCatalogItem` (catalog with cost, category, stock, partner name, terms), and `RewardRedemption` (unique voucher code, status, expiration date). Created and ran migration `0006_rewardcatalogitem_chakrapointtransaction_and_more`.
  - **Streak Continuity & Rewards Service (`apps/accounts/rewards_service.py`)**: Date-based continuity engine (same-day action keeps streak `EXTENDED`, consecutive day increments streak `+1`, missed day resets to `1`). Automatically credits milestone bonuses (+25 at 3d, +50 at 7d, +100 at 14d, +250 at 30d). Atomic `redeem_reward` deducts points with `select_for_update()`, decrements stock, issues a `WC-ECO-` voucher code, and logs transactions. Pre-seeded 6 realistic green rewards.
  - **Action Triggers Connected**:
    - `WasteReportCreateView`: Creating a waste report photo awards **+50 Chakra Points**, advances daily streak, and returns `reward_info` in response.
    - `PickupDetailView`: Transitioning pickup to `COMPLETED` awards **+100 PTS** (scaled by weight) to citizen owner.
    - `ProcessWasteImageView`: AI optical scan awards **+15 PTS** and advances streak for authenticated citizens.
  - **Backend API Endpoints**: Registered `/api/v1/rewards/` (catalog + user points/streak), `/api/v1/rewards/redeem/` (atomic redemption), `/api/v1/rewards/history/` (points ledger & active vouchers).
  - **Frontend Experience**:
    - `/app` (Citizen Dashboard): Live points & streak days from backend; added a 7-day visual streak activity continuity tracker widget (Mon–Sun indicators with animated flame badges).
    - `/app/report` (Report Waste): Step 1 photo capture displays "+50 Chakra Points" incentive pill; submission success screen displays celebratory Eco-Reward Hero Card with points added, current streak, and streak bonus alerts.
    - `/app/rewards` (Rewards Center): Revamped with 4 tabs (Marketplace, My Vouchers, Points Ledger, Leaderboards), confirmation modal, live points countdown, and unique voucher code modal with 1-click clipboard copy.
  - **Verification**: 8/8 tests passing in `apps.accounts.tests` (total 23/23 unit tests passing); `npx vite build` cleanly compiles in 1.07s with 0 errors.
- **3-Stage Quality-Controlled Waste Detection Architecture & Architecture Viewer**:
  - Implemented the full 3-stage quality-controlled pipeline aligning with industrial MRF sorting:
    - **Stage 1 (Object Detection)**: Dual-Engine Hybrid (Gemini Vision + Multi-Spectral Local Optical Classifier) detecting dynamic object counts across TACO/YOLO classes.
    - **Stage 2 (Evaluation & Quality Control)**: Quantitative evaluation (`pipeline_qc.py`), computing precision/recall, bounding box overlap counters, and the **Decision Diamond** (`DEPLOY_DIRECT` vs `NEEDS_REFINEMENT`).
    - **Stage 3 (Refinement & Post-Processing)**: Non-Maximum Suppression (IoU thresholding), confidence filtering, and spatial boundary sanitization.
  - Built interactive `SoftwareArchitecturePipelineView.jsx` replicating the system flowchart (TACO/YOLO detection, Stage 2 decision diamond, Stage 3 NMS, Round 1 completed / Round 2 scope), switchable via a toggle in Stage 3 Live Routing.
- **Fixed Single-Category Detection Error & Enabled Multi-Category Segregation**:
  - Eliminated client canvas scene-level locks (`isPetScene`/`isOrganicScene` in `WasteInspectionOverlay.jsx`) that previously forced 100% of detected objects into a single category.
  - Re-engineered `optical_classifier.py` to remove over-broad warm hue fallback (`is_warm_food_hue` fallback removed, warm tone blockers on cans/plastics removed, added `MATERIAL_RDF` and partitioned Landfill residue).
  - Enhanced Gemini system prompt with 4-class few-shot examples and preserved `Multi-layer Packaging / RDF` and `Other / Landfill Residue` categories during re-tallying.
  - Verified with 19/19 backend unit tests passing (`apps.detection` + `apps.waste_records`) and multi-stream live API responses (`Recyclable: 10, RDF: 3, Organic: 2, Landfill: 1`).


## Conventions / Gotchas
- **Icons**: always use `<Icon name="..." />` from `src/components/AppIcons.jsx`. To add an icon: import the lucide component by name in the big import block, add `name: LucideName` to `ICON_MAP`, and (if PascalCase lookup matters — currently unused) keep lists in sync. Named imports only — do NOT switch to `import * as Lucide` (kills tree-shaking, ballooned bundle to 1.28MB).
- Backend runs with SQLite override:
  `DATABASE_URL="sqlite:////Users/danish/Desktop/WasteChakra/backend/dev.sqlite3" python manage.py runserver 8000`
  (`.env` still points to Neon Postgres — NOT migrated for new models; must use override in dev).
- pip needs `--break-system-packages`; `cloudinary_storage` NOT installable on Py3.14 (removed from INSTALLED_APPS; STORAGES defaults to FileSystemStorage; Cloudinary only if CLOUD_NAME set AND not DEBUG).
- Backend log: `/tmp/backend.log`. Frontend dev log: `/tmp/frontend.log`. Frontend prod build: `cd frontend && npx vite build`.
- Note: backend runserver silently dies sometimes (must restart after heavy edits / when curl returns HTTP 000).
- Frontend: `api` object in `src/services/api.js`; JWT in localStorage `wc_access_token`/`wc_refresh_token`/`wc_user`; shared UI in `components/ui.jsx`; data fallback layer `dataProvider.js`→`demoData.js`; `useAuth` from `context/AuthContext`; roles via `ProtectedRoute` (RequireAuth/RequireRole); **role panels in `src/panels/<role>/`** (Sidebar + Navbar + Routes fragment + Panel), composed by shared `PanelShell`/`ShellSidebar`/`ShellNavbar`; `Lazy` wrapper in `components/LazyRoute`.
- Design tokens: `surface` #f3fcf2, `primary` #00180b (+ forest #0a3a2a), `secondary-container` #abf854, fonts Playfair Display + Plus Jakarta Sans.
- Pickup detail query: passport is `OneToOne` on Pickup behind `pickup.passport`; passport `id` is UUID (sqlite strips dashes in raw queries).

## Directories / Key Files
- `backend/apps/accounts/`: User (role field CITIZEN/BUSINESS/SOCIETY_ADMIN/COLLECTOR/FACILITY_MANAGER/ADMIN/SUPER_ADMIN), UserProfile, CollectorProfile, auth views/serializers/urls, `seed_demo.py`.
- `backend/apps/pickups/`: WasteReport, Pickup, WastePassport + serializers (`PickupSerializer`, `PickupCreateSerializer`, `PickupStatusUpdateSerializer`), views (`PickupList/Create/Detail`, WasteReport, WastePassport, UserImpact), `signals.py`, `apps.py`.
- `backend/config/settings.py`: AUTH_USER_MODEL, SIMPLE_JWT, REST_FRAMEWORK (JWT auth, filter, pagination), STORAGES, INSTALLED_APPS.
- `backend/config/urls.py`: includes accounts + pickups.
- `backend/dev.sqlite3`: seeded dev DB (DB of record for dev).
- `frontend/src/App.jsx`: slim route table — public pages + `/login`/`/register` + 5 role mount points (`/app`, `/collector`, `/business`, `/facility`, `/admin`) each rendering a `<Role>Panel` and spreading that role's `<Role>Routes` fragment; `pages/` per role (citizen/collector/business/admin/facility + public).
- `frontend/src/panels/`: shared chrome (`PanelShell.jsx`, `ShellSidebar.jsx`, `ShellNavbar.jsx`) + per-role folders. Each role folder has `<Role>Sidebar.jsx` (nav config + `<ShellSidebar>`), `<Role>Navbar.jsx` (`<ShellNavbar>`), `<Role>Routes.jsx` (exported JSX Fragment of `<Route>` elements — must be a const element, NOT a component, or React Router throws "[X] is not a <Route> component"), `<Role>Panel.jsx`. `AppShell.jsx` was deleted in favor of this.
- `frontend/src/components/AppIcons.jsx`: the one icon module — `ICON_MAP` + `Icon` + brand SVGs (see Conventions).
- `frontend/src/components/LocationPicker.jsx`: reusable Leaflet+OSM map picker with live location + reverse geocoding (used in citizen report + pickup modal).
- Simulation uses `import * as api from "../services/api"` + `api.getStatsSummary()`/`simulateWaste()`/`processWasteImage()` — do not break named re-exports in `api.js`.

## Next / Backlog
- Phase 10: Rewards/Community data/config wiring.
- Phase 11: PWA service worker + offline.
- Phase 12: Backend tests (DRF/django test), error/empty-state audit of pages.
- Deployment: migrate Neon Postgres cleanly (recreate after reset) OR add deploy job that runs migrations on a clean DB.

