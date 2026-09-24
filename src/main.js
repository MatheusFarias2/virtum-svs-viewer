import OpenSeadragon from 'openseadragon';
import { OpenSlide, DeepZoomGenerator } from '@computationalpathologygroup/openslide-js';
import { createOpenSlideTileSource } from './openslide-source.js';

const $ = (id) => document.getElementById(id);
const SVG_NS = 'http://www.w3.org/2000/svg';

const ui = {
  app: $('app'),
  openBtn: $('openBtn'),
  emptyOpenBtn: $('emptyOpenBtn'),
  fileInput: $('fileInput'),
  compareFileInput: $('compareFileInput'),
  zoomOutBtn: $('zoomOutBtn'),
  zoomInBtn: $('zoomInBtn'),
  homeBtn: $('homeBtn'),
  measureBtn: $('measureBtn'),
  captureBtn: $('captureBtn'),
  rotateBtn: $('rotateBtn'),
  fullscreenBtn: $('fullscreenBtn'),
  presentationBtn: $('presentationBtn'),
  presentationExitBtn: $('presentationExitBtn'),
  panelBtn: $('panelBtn'),
  moreBtn: $('moreBtn'),
  moreMenu: $('moreMenu'),
  undoBtn: $('undoBtn'),
  redoBtn: $('redoBtn'),
  sidebar: $('sidebar'),
  collapseSidebarBtn: $('collapseSidebarBtn'),
  sidebarRevealBtn: $('sidebarRevealBtn'),
  sidebarBackdrop: $('sidebarBackdrop'),
  viewer: $('viewer'),
  viewerShell: $('viewerShell'),
  measurementOverlay: $('measurementOverlay'),
  measurementList: $('measurementList'),
  clearMeasurementsBtn: $('clearMeasurementsBtn'),
  measureHelp: $('measureHelp'),
  markerBtn: $('markerBtn'),
  areaBtn: $('areaBtn'),
  annotationOverlay: $('annotationOverlay'),
  annotationList: $('annotationList'),
  annotationHelp: $('annotationHelp'),
  clearAnnotationsBtn: $('clearAnnotationsBtn'),
  finishAreaBtn: $('finishAreaBtn'),
  cancelAreaBtn: $('cancelAreaBtn'),
  proMarkerBtn: $('proMarkerBtn'),
  proArrowBtn: $('proArrowBtn'),
  proCircleBtn: $('proCircleBtn'),
  proRectBtn: $('proRectBtn'),
  proTextBtn: $('proTextBtn'),
  proAreaBtn: $('proAreaBtn'),
  annotationGroupFilters: $('annotationGroupFilters'),
  showAllGroupsBtn: $('showAllGroupsBtn'),
  hideAllGroupsBtn: $('hideAllGroupsBtn'),
  annotationsFileInput: $('annotationsFileInput'),
  saveAnnotationsBtn: $('saveAnnotationsBtn'),
  loadAnnotationsBtn: $('loadAnnotationsBtn'),
  reportBtn: $('reportBtn'),
  reportDialog: $('reportDialog'),
  reportForm: $('reportForm'),
  reportDialogClose: $('reportDialogClose'),
  reportCancelBtn: $('reportCancelBtn'),
  reportTitleInput: $('reportTitleInput'),
  reportProfessorInput: $('reportProfessorInput'),
  reportStudentInput: $('reportStudentInput'),
  reportInstitutionInput: $('reportInstitutionInput'),
  reportIncludeImage: $('reportIncludeImage'),
  reportIncludeMeasurements: $('reportIncludeMeasurements'),
  reportIncludeAnnotations: $('reportIncludeAnnotations'),
  reportIncludeLesson: $('reportIncludeLesson'),
  reportSummary: $('reportSummary'),
  reportPngBtn: $('reportPngBtn'),
  reportHtmlBtn: $('reportHtmlBtn'),
  reportPdfBtn: $('reportPdfBtn'),
  brightnessRange: $('brightnessRange'),
  contrastRange: $('contrastRange'),
  saturationRange: $('saturationRange'),
  sharpnessRange: $('sharpnessRange'),
  brightnessValue: $('brightnessValue'),
  contrastValue: $('contrastValue'),
  saturationValue: $('saturationValue'),
  sharpnessValue: $('sharpnessValue'),
  highQualityToggle: $('highQualityToggle'),
  pixelPerfectToggle: $('pixelPerfectToggle'),
  maxQualityBtn: $('maxQualityBtn'),
  nativeZoomBtn: $('nativeZoomBtn'),
  perfProfileSelect: $('perfProfileSelect'),
  qualityHint: $('qualityHint'),
  diagLevel: $('diagLevel'),
  diagEffectiveRes: $('diagEffectiveRes'),
  diagCurrentMpp: $('diagCurrentMpp'),
  diagApproxMag: $('diagApproxMag'),
  diagTiles: $('diagTiles'),
  diagCache: $('diagCache'),
  diagDevice: $('diagDevice'),
  diagBenchmark: $('diagBenchmark'),
  diagAdaptiveProfile: $('diagAdaptiveProfile'),
  diagWorkers: $('diagWorkers'),
  rerunBenchmarkBtn: $('rerunBenchmarkBtn'),
  diagMemoryMode: $('diagMemoryMode'),
  memorySafeToggle: $('memorySafeToggle'),
  startupDiagDialog: $('startupDiagDialog'),
  startupDiagClose: $('startupDiagClose'),
  startupDiagDoneBtn: $('startupDiagDoneBtn'),
  startupSafetyNotice: $('startupSafetyNotice'),
  startupDiagDevice: $('startupDiagDevice'),
  startupDiagBenchmark: $('startupDiagBenchmark'),
  startupDiagProfile: $('startupDiagProfile'),
  startupDiagWorkers: $('startupDiagWorkers'),
  startupDiagCache: $('startupDiagCache'),
  startupDiagMemory: $('startupDiagMemory'),
  startupDiagEngine: $('startupDiagEngine'),
  startupDiagCompat: $('startupDiagCompat'),
  startupDiagPhase: $('startupDiagPhase'),
  startupDiagError: $('startupDiagError'),
  startupDiagWasmProbe: $('startupDiagWasmProbe'),
  startupTestEngineBtn: $('startupTestEngineBtn'),
  startupProbeMemoryBtn: $('startupProbeMemoryBtn'),
  startupCopyDiagBtn: $('startupCopyDiagBtn'),
  startupPerfProfileSelect: $('startupPerfProfileSelect'),
  startupSafeModeToggle: $('startupSafeModeToggle'),
  startupRerunBenchmarkBtn: $('startupRerunBenchmarkBtn'),
  sharpenMatrix: $('sharpenMatrix'),
  resetVisualBtn: $('resetVisualBtn'),
  annotationDialog: $('annotationDialog'),
  annotationForm: $('annotationForm'),
  annotationDialogTitle: $('annotationDialogTitle'),
  annotationDialogClose: $('annotationDialogClose'),
  annotationTitleInput: $('annotationTitleInput'),
  annotationTextRow: $('annotationTextRow'),
  annotationTextInput: $('annotationTextInput'),
  annotationColorInput: $('annotationColorInput'),
  annotationGroupInput: $('annotationGroupInput'),
  annotationGroupOptions: $('annotationGroupOptions'),
  annotationNoteInput: $('annotationNoteInput'),
  annotationCancelBtn: $('annotationCancelBtn'),
  scaleBar: $('scaleBar'),
  scaleLabel: $('scaleLabel'),
  scaleLine: $('scaleLine'),
  toolBadge: $('toolBadge'),
  emptyState: $('emptyState'),
  emptyLead: $('emptyLead'),
  emptyHint: $('emptyHint'),
  dropOverlay: $('dropOverlay'),
  busy: $('busy'),
  busyTitle: $('busyTitle'),
  busyText: $('busyText'),
  statusText: $('statusText'),
  positionText: $('positionText'),
  zoomText: $('zoomText'),
  engineState: $('engineState'),
  compatInfo: $('compatInfo'),
  metaName: $('metaName'),
  metaSize: $('metaSize'),
  metaDimensions: $('metaDimensions'),
  metaLevels: $('metaLevels'),
  metaVendor: $('metaVendor'),
  metaMagnification: $('metaMagnification'),
  metaMpp: $('metaMpp'),
  metaQuality: $('metaQuality'),
  qualityBadge: $('qualityBadge'),
  toastStack: $('toastStack'),
  autosaveState: $('autosaveState'),
  libraryBtn: $('libraryBtn'),
  libraryDiagBtn: $('libraryDiagBtn'),
  deviceDiagBtn: $('deviceDiagBtn'),
  compareBtn: $('compareBtn'),
  libraryScreen: $('libraryScreen'),
  libraryOpenBtn: $('libraryOpenBtn'),
  libraryEmptyOpenBtn: $('libraryEmptyOpenBtn'),
  librarySearch: $('librarySearch'),
  libraryCategoryChips: $('libraryCategoryChips'),
  libraryRecentGrid: $('libraryRecentGrid'),
  libraryFavoritesGrid: $('libraryFavoritesGrid'),
  libraryFavoritesSection: $('libraryFavoritesSection'),
  librarySessionsList: $('librarySessionsList'),
  libraryRecentCount: $('libraryRecentCount'),
  libraryFavoriteCount: $('libraryFavoriteCount'),
  librarySessionCount: $('librarySessionCount'),
  libraryEmpty: $('libraryEmpty'),
  saveSessionBtn: $('saveSessionBtn'),
  sessionDialog: $('sessionDialog'),
  sessionForm: $('sessionForm'),
  sessionDialogClose: $('sessionDialogClose'),
  sessionCancelBtn: $('sessionCancelBtn'),
  sessionNameInput: $('sessionNameInput'),
  sessionCategorySelect: $('sessionCategorySelect'),
  lessonBtn: $('lessonBtn'),
  lessonCountBadge: $('lessonCountBadge'),
  lessonTitleInput: $('lessonTitleInput'),
  prepareLessonBtn: $('prepareLessonBtn'),
  presentLessonBtn: $('presentLessonBtn'),
  lessonEditor: $('lessonEditor'),
  lessonAnnotationSelect: $('lessonAnnotationSelect'),
  addLessonStepBtn: $('addLessonStepBtn'),
  lessonSequenceList: $('lessonSequenceList'),
  clearLessonBtn: $('clearLessonBtn'),
  lessonPresentationBar: $('lessonPresentationBar'),
  lessonPresentationTitle: $('lessonPresentationTitle'),
  lessonCounter: $('lessonCounter'),
  lessonStepTitle: $('lessonStepTitle'),
  lessonStepNote: $('lessonStepNote'),
  lessonPrevBtn: $('lessonPrevBtn'),
  lessonNextBtn: $('lessonNextBtn'),
  lessonExitBtn: $('lessonExitBtn'),
  compareToolbar: $('compareToolbar'),
  compareStatusText: $('compareStatusText'),
  compareSyncToggle: $('compareSyncToggle'),
  compareOpenBtn: $('compareOpenBtn'),
  compareCloseBtn: $('compareCloseBtn'),
  comparePane: $('comparePane'),
  compareViewer: $('compareViewer'),
  compareFileName: $('compareFileName'),
  primaryCompareName: $('primaryCompareName'),
  compareBusy: $('compareBusy'),
  compareEmpty: $('compareEmpty'),
  compareEmptyOpenBtn: $('compareEmptyOpenBtn'),
};

const panelTabs = [...document.querySelectorAll('.panel-tab')];
const panelPages = [...document.querySelectorAll('.panel-page')];

const DEFAULT_EMPTY_LEAD = 'Abra uma lâmina Aperio .SVS armazenada no dispositivo.';
const DEFAULT_EMPTY_HINT = 'Arquivos grandes são lidos por partes. Não é necessário carregar a lâmina inteira na memória.';
const INIT_TIMEOUT_MS = 30000;
const FIRST_TILE_TIMEOUT_DESKTOP_MS = 20000;
const FIRST_TILE_TIMEOUT_MOBILE_MS = 60000;
const MOBILE_WASM_MANIFEST_URL = '/wasm-mobile/manifest.json';
const MOBILE_DZI_TILE_SIZE = 254;
const DESKTOP_DZI_TILE_SIZE = 254;
const PREFS_KEY = 'virtum-svs-viewer-prefs-v035';
const AUTOSAVE_INDEX_KEY = 'virtum-svs-viewer-autosave-index-v036';
const AUTOSAVE_PREFIX = 'virtum-svs-viewer-autosave-v036:';
const AUTOSAVE_DELAY_MS = 700;
const AUTOSAVE_MAX_PROJECTS = 8;
const REPORT_PREFS_KEY = 'virtum-svs-viewer-report-prefs-v052';
const HISTORY_LIMIT = 50;
const LIBRARY_KEY = 'virtum-svs-library-v040';
const SESSIONS_KEY = 'virtum-svs-sessions-v040';
const LIBRARY_MAX_ITEMS = 40;
const SESSION_MAX_ITEMS = 40;
const LIBRARY_CATEGORIES = ['Histologia', 'Anatomia', 'Patologia', 'Outros'];
const DEVICE_BENCHMARK_KEY = 'virtum-svs-device-benchmark-v0532';
const DEVICE_BENCHMARK_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MEMORY_SAFE_CONFIG = {
  label: 'Mobile Fast Safe',
  workerCount: 1,
  blockSize: 1024 * 1024,
  brokerCacheBytes: 24 * 1024 * 1024,
  maxConcurrentReads: 2,
  readAhead: 1,
  jobLimit: 2,
  preload: false,
  tileCacheCount: 24,
};

const LOW_POWER_CONFIG = {
  label: 'Low Power Fast',
  workerCount: 1,
  blockSize: 2 * 1024 * 1024,
  brokerCacheBytes: 32 * 1024 * 1024,
  maxConcurrentReads: 2,
  readAhead: 2,
  jobLimit: 2,
  preload: false,
  tileCacheCount: 32,
};

const WASM_UPSTREAM_INITIAL_PAGES = 256; // 16 MiB
const WASM_UPSTREAM_MAX_PAGES = 32768;   // 2 GiB
const WASM_REDUCED_MAX_PAGES = 8192;     // 512 MiB · apenas diagnóstico

const PERFORMANCE_PROFILES = {
  auto: { label: 'Automático', jobLimit: 6, preload: false, tileCacheCount: 160 },
  balanced: { label: 'Equilibrado', jobLimit: 6, preload: false, tileCacheCount: 180 },
  quality: { label: 'Qualidade', jobLimit: 12, preload: true, tileCacheCount: 320 },
  performance: { label: 'Desempenho', jobLimit: 4, preload: false, tileCacheCount: 96 },
};

const ADAPTIVE_TIERS = {
  lite: {
    label: 'Leve', recommendedProfile: 'performance', workerCount: 1,
    brokerCacheBytes: 32 * 1024 * 1024, maxConcurrentReads: 1, readAhead: 0,
    jobLimit: 4, preload: false, tileCacheCount: 96,
  },
  lowpower: {
    label: 'Low Power', recommendedProfile: 'performance', workerCount: 1,
    brokerCacheBytes: 32 * 1024 * 1024, maxConcurrentReads: 2, readAhead: 2,
    jobLimit: 2, preload: false, tileCacheCount: 32,
  },
  balanced: {
    label: 'Equilibrado', recommendedProfile: 'balanced', workerCount: 2,
    brokerCacheBytes: 64 * 1024 * 1024, maxConcurrentReads: 2, readAhead: 1,
    jobLimit: 7, preload: false, tileCacheCount: 180,
  },
  strong: {
    label: 'Forte', recommendedProfile: 'quality', workerCount: 3,
    brokerCacheBytes: 128 * 1024 * 1024, maxConcurrentReads: 3, readAhead: 2,
    jobLimit: 12, preload: true, tileCacheCount: 320,
  },
};

const state = {
  openslide: null,
  slides: [],
  generators: [],
  currentFile: null,
  ready: false,
  initializing: false,
  initPromise: null,
  opening: false,
  rotation: 0,
  dragDepth: 0,
  engineMode: 'standby',
  tileLoaded: false,
  tileErrors: 0,
  awaitingFirstTile: false,
  firstTileTimer: null,
  mppX: null,
  mppY: null,
  objectivePower: null,
  measureMode: false,
  measureStart: null,
  measurements: [],
  measurementId: 1,
  annotationMode: null,
  annotations: [],
  annotationId: 1,
  areaDraft: [],
  shapeStart: null,
  pendingMarkerPoint: null,
  pendingAnnotationDraft: null,
  editingAnnotationId: null,
  hiddenAnnotationGroups: [],
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
  highDefinition: false,
  pixelPerfect: false,
  performanceProfile: 'auto',
  deviceBenchmark: null,
  benchmarkPromise: null,
  engineWorkerCount: null,
  engineBrokerCacheBytes: null,
  runtimeThrottle: 1,
  memorySafeMode: false,
  memorySafeUserSet: false,
  memoryRecoveryAttempted: false,
  startupPhase: 'Em espera',
  lastEngineError: '',
  wasmMemoryProbe: null,
  wasmVariant: 'stock',
  mobileWasmStatus: 'não verificado',
  mobileWasmManifest: null,
  firstTileRequestedAt: 0,
  firstTileDecodedAt: 0,
  firstTileDecodeMs: null,
  firstTileBitmapMs: null,
  firstTileTotalMs: null,
  openStartedAt: 0,
  headerOpenMs: null,
  firstViewMs: null,
  tileRequested: 0,
  tileLoadedCount: 0,
  tileFailedCount: 0,
  tileAbortedCount: 0,
  tileLevelCounts: {},
  projectDirty: false,
  activePanel: 'panel-slide',
  sidebarCollapsed: false,
  presentationMode: false,
  autosaveTimer: null,
  autosaveAvailable: true,
  autosaveFingerprint: null,
  autosaveSavedAt: null,
  pendingAutosaveData: null,
  historyUndo: [],
  historyRedo: [],
  applyingHistory: false,
  lastCommittedSnapshot: null,
  libraryFilter: 'all',
  librarySearchQuery: '',
  pendingLibraryOpen: null,
  activeSessionName: null,
  lessonTitle: '',
  lessonSequence: [],
  lessonPreparing: false,
  lessonPresenting: false,
  lessonIndex: 0,
  compareActive: false,
  compareSync: true,
  compareSyncing: false,
  compareOpening: false,
  compareFile: null,
  compareSlide: null,
  compareGenerator: null,
  compareDims: null,
};

const viewer = OpenSeadragon({
  element: ui.viewer,
  showNavigationControl: false,
  showNavigator: !useFastRenderDefaults(),
  navigatorPosition: 'BOTTOM_RIGHT',
  navigatorSizeRatio: 0.18,
  animationTime: useFastRenderDefaults() ? 0.35 : 0.65,
  blendTime: useFastRenderDefaults() ? 0 : 0.08,
  immediateRender: useFastRenderDefaults(),
  minPixelRatio: useFastRenderDefaults() ? 1.25 : 0.5,
  constrainDuringPan: true,
  visibilityRatio: 0.12,
  minZoomImageRatio: 0.72,
  maxZoomPixelRatio: 8,
  zoomPerScroll: 1.22,
  zoomPerClick: 1.6,
  gestureSettingsMouse: {
    scrollToZoom: true,
    clickToZoom: false,
    dblClickToZoom: false,
    dragToPan: true,
  },
  gestureSettingsTouch: {
    pinchToZoom: true,
    flickEnabled: true,
    dragToPan: true,
    clickToZoom: false,
    dblClickToZoom: true,
  },
});

const compareViewer = OpenSeadragon({
  element: ui.compareViewer,
  showNavigationControl: false,
  showNavigator: !useFastRenderDefaults(),
  navigatorPosition: 'BOTTOM_RIGHT',
  navigatorSizeRatio: 0.16,
  animationTime: useFastRenderDefaults() ? 0.3 : 0.45,
  blendTime: useFastRenderDefaults() ? 0 : 0.08,
  immediateRender: useFastRenderDefaults(),
  minPixelRatio: useFastRenderDefaults() ? 1.25 : 0.5,
  constrainDuringPan: true,
  visibilityRatio: 0.12,
  minZoomImageRatio: 0.72,
  maxZoomPixelRatio: 8,
  zoomPerScroll: 1.22,
  zoomPerClick: 1.6,
  gestureSettingsMouse: {
    scrollToZoom: true,
    clickToZoom: false,
    dblClickToZoom: true,
    dragToPan: true,
  },
  gestureSettingsTouch: {
    pinchToZoom: true,
    flickEnabled: true,
    dragToPan: true,
    clickToZoom: false,
    dblClickToZoom: true,
  },
});

function setStatus(text) {
  ui.statusText.textContent = text;
}

function showToast(message, kind = 'success') {
  if (!ui.toastStack) return;
  const toast = document.createElement('div');
  toast.className = `toast ${kind}`;
  toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  ui.toastStack.appendChild(toast);
  window.requestAnimationFrame(() => toast.classList.add('show'));
  window.setTimeout(() => {
    toast.classList.remove('show');
    window.setTimeout(() => toast.remove(), 180);
  }, 2400);
}

function safeStorageArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn(`Não foi possível ler ${key}:`, error);
    return [];
  }
}

function getLibraryEntries() {
  return safeStorageArray(LIBRARY_KEY);
}

function storeLibraryEntries(entries) {
  const normalized = [...entries]
    .filter((entry) => entry?.fingerprint && entry?.name)
    .sort((a, b) => new Date(b.openedAt || 0) - new Date(a.openedAt || 0))
    .slice(0, LIBRARY_MAX_ITEMS);
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.warn('Biblioteca local indisponível:', error);
    showToast('Biblioteca local indisponível', 'error');
  }
}

function getSavedSessions() {
  return safeStorageArray(SESSIONS_KEY);
}

function storeSavedSessions(sessions) {
  const normalized = [...sessions]
    .filter((session) => session?.id && session?.payload && session?.slideName)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, SESSION_MAX_ITEMS);
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.warn('Sessões locais indisponíveis:', error);
    showToast('Não foi possível salvar a sessão local', 'error');
  }
}

function libraryCategory(value) {
  return LIBRARY_CATEGORIES.includes(value) ? value : 'Outros';
}

function findLibraryEntryForFile(file) {
  const fingerprint = slideFingerprint(file);
  const entries = getLibraryEntries();
  return entries.find((entry) => entry.fingerprint === fingerprint)
    || entries.find((entry) => entry.name === file?.name && Number(entry.size || 0) === Number(file?.size || 0))
    || null;
}

function upsertLibraryEntry(file, slide = state.slides[0]) {
  if (!file) return null;
  const fingerprint = slideFingerprint(file);
  const entries = getLibraryEntries();
  const existingIndex = entries.findIndex((entry) => entry.fingerprint === fingerprint
    || (entry.name === file.name && Number(entry.size || 0) === Number(file.size || 0)));
  const existing = existingIndex >= 0 ? entries[existingIndex] : null;
  const props = slide?.properties || {};
  const dims = slide?.levelDimensions?.[0] || null;
  const now = new Date().toISOString();
  const objective = parseDecimal(pickProp(props, ['openslide.objective-power', 'aperio.AppMag'])) || state.objectivePower;
  const mppX = parseDecimal(pickProp(props, ['openslide.mpp-x', 'aperio.MPP'])) || state.mppX;
  const vendor = pickProp(props, ['openslide.vendor']) || existing?.vendor || null;
  const entry = {
    fingerprint,
    name: file.name,
    size: Number(file.size) || 0,
    lastModified: Number(file.lastModified) || 0,
    width: dims?.width || existing?.width || null,
    height: dims?.height || existing?.height || null,
    levels: slide?.levelCount || existing?.levels || null,
    vendor,
    objectivePower: objective || existing?.objectivePower || null,
    mppX: mppX || existing?.mppX || null,
    category: libraryCategory(existing?.category || 'Outros'),
    favorite: Boolean(existing?.favorite),
    openedAt: now,
    firstOpenedAt: existing?.firstOpenedAt || now,
  };
  if (existingIndex >= 0) entries.splice(existingIndex, 1);
  entries.unshift(entry);
  storeLibraryEntries(entries);
  renderLibrary();
  return entry;
}

function updateLibraryEntry(fingerprint, patch) {
  const entries = getLibraryEntries();
  const index = entries.findIndex((entry) => entry.fingerprint === fingerprint);
  if (index < 0) return;
  entries[index] = { ...entries[index], ...patch };
  storeLibraryEntries(entries);
  renderLibrary();
}

function migrateAutosavesIntoLibrary() {
  const entries = getLibraryEntries();
  const byFingerprint = new Map(entries.map((entry) => [entry.fingerprint, entry]));
  try {
    const autosaveIndex = safeStorageArray(AUTOSAVE_INDEX_KEY);
    for (const item of autosaveIndex) {
      if (!item?.key) continue;
      const raw = localStorage.getItem(item.key);
      if (!raw) continue;
      const record = JSON.parse(raw);
      const payload = record?.payload;
      const slide = payload?.slide;
      const fingerprint = record?.fingerprint;
      if (!fingerprint || !slide?.name || byFingerprint.has(fingerprint)
        || entries.some((entry) => entry.name === slide.name && Number(entry.size || 0) === Number(slide.size || 0))) continue;
      const entry = {
        fingerprint,
        name: slide.name,
        size: Number(slide.size) || 0,
        lastModified: Number(String(fingerprint).split('::').pop()) || 0,
        width: slide.width || null,
        height: slide.height || null,
        levels: null,
        vendor: null,
        objectivePower: null,
        mppX: slide.mppX || null,
        category: 'Outros',
        favorite: false,
        openedAt: item.savedAt || record.savedAt || new Date().toISOString(),
        firstOpenedAt: item.savedAt || record.savedAt || new Date().toISOString(),
      };
      entries.push(entry);
      byFingerprint.set(fingerprint, entry);
    }
    storeLibraryEntries(entries);
  } catch (error) {
    console.warn('Migração da biblioteca ignorada:', error);
  }
}

function formatLibraryDate(value) {
  if (!value) return 'sem data';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'sem data';
  const now = Date.now();
  const delta = Math.max(0, now - date.getTime());
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days} d`;
  return date.toLocaleDateString('pt-BR');
}

function libraryEntryMatches(entry, query, category) {
  const categoryMatch = category === 'all' || entry.category === category;
  if (!categoryMatch) return false;
  if (!query) return true;
  const haystack = [entry.name, entry.category, entry.vendor, entry.objectivePower ? `${entry.objectivePower}x` : '']
    .filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(query);
}

function sessionMatches(session, query, category) {
  const sessionCategory = libraryCategory(session.category || 'Outros');
  const categoryMatch = category === 'all' || sessionCategory === category;
  if (!categoryMatch) return false;
  if (!query) return true;
  return [session.name, session.slideName, sessionCategory, session.payload?.lesson?.title].filter(Boolean).join(' ').toLowerCase().includes(query);
}

function createLibraryCard(entry) {
  const card = document.createElement('article');
  card.className = 'library-card';
  card.dataset.fingerprint = entry.fingerprint;

  const top = document.createElement('div');
  top.className = 'library-card-top';
  const icon = document.createElement('div');
  icon.className = 'library-card-icon';
  icon.textContent = '◫';
  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = `library-favorite-btn${entry.favorite ? ' is-favorite' : ''}`;
  favorite.textContent = entry.favorite ? '★' : '☆';
  favorite.title = entry.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  favorite.setAttribute('aria-label', favorite.title);
  favorite.addEventListener('click', () => updateLibraryEntry(entry.fingerprint, { favorite: !entry.favorite }));
  top.append(icon, favorite);

  const copy = document.createElement('div');
  copy.className = 'library-card-copy';
  const title = document.createElement('strong');
  title.textContent = entry.name;
  title.title = entry.name;
  const detail = document.createElement('small');
  const dimensionText = entry.width && entry.height ? `${Number(entry.width).toLocaleString('pt-BR')} × ${Number(entry.height).toLocaleString('pt-BR')}` : formatBytes(entry.size);
  detail.textContent = `${dimensionText} · ${formatLibraryDate(entry.openedAt)}`;
  copy.append(title, detail);

  const meta = document.createElement('div');
  meta.className = 'library-card-meta';
  const category = document.createElement('span');
  category.className = 'library-pill';
  category.textContent = entry.category || 'Outros';
  meta.appendChild(category);
  if (entry.objectivePower) {
    const mag = document.createElement('span');
    mag.className = 'library-pill';
    mag.textContent = `${entry.objectivePower}×`;
    meta.appendChild(mag);
  }
  if (entry.mppX) {
    const mpp = document.createElement('span');
    mpp.className = 'library-pill';
    mpp.textContent = `${Number(entry.mppX).toFixed(3)} µm/px`;
    meta.appendChild(mpp);
  }

  const actions = document.createElement('div');
  actions.className = 'library-card-actions';
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'small-btn';
  open.textContent = 'Abrir';
  open.addEventListener('click', () => requestLibraryOpen(entry));
  const select = document.createElement('select');
  select.className = 'library-category-select';
  select.setAttribute('aria-label', `Categoria de ${entry.name}`);
  for (const value of LIBRARY_CATEGORIES) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    option.selected = value === libraryCategory(entry.category);
    select.appendChild(option);
  }
  select.addEventListener('change', () => updateLibraryEntry(entry.fingerprint, { category: select.value }));
  actions.append(open, select);

  card.append(top, copy, meta, actions);
  return card;
}

function createSessionRow(session) {
  const row = document.createElement('article');
  row.className = 'library-session-row';
  const main = document.createElement('div');
  main.className = 'library-session-main';
  const dot = document.createElement('span');
  dot.className = 'library-session-dot';
  const copy = document.createElement('div');
  copy.className = 'library-session-copy';
  const title = document.createElement('strong');
  title.textContent = session.name || 'Sessão sem título';
  const detail = document.createElement('small');
  const lessonCount = Array.isArray(session.payload?.lesson?.sequence) ? session.payload.lesson.sequence.length : 0;
  detail.textContent = `${session.slideName} · ${libraryCategory(session.category || 'Outros')}${lessonCount ? ` · ${lessonCount} etapa${lessonCount === 1 ? '' : 's'}` : ''} · ${formatLibraryDate(session.updatedAt || session.createdAt)}`;
  copy.append(title, detail);
  main.append(dot, copy);
  const actions = document.createElement('div');
  actions.className = 'library-session-actions';
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'small-btn';
  open.textContent = 'Abrir';
  open.addEventListener('click', () => requestSessionOpen(session));
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'library-delete-btn';
  remove.textContent = '×';
  remove.title = 'Excluir sessão';
  remove.setAttribute('aria-label', `Excluir sessão ${session.name || ''}`);
  remove.addEventListener('click', () => {
    if (!window.confirm(`Excluir a sessão “${session.name || 'sem título'}”?`)) return;
    storeSavedSessions(getSavedSessions().filter((item) => item.id !== session.id));
    renderLibrary();
    showToast('Sessão excluída', 'info');
  });
  actions.append(open, remove);
  row.append(main, actions);
  return row;
}

function renderLibrary() {
  if (!ui.libraryScreen) return;
  const query = String(state.librarySearchQuery || '').trim().toLowerCase();
  const category = state.libraryFilter || 'all';
  const entries = getLibraryEntries().filter((entry) => libraryEntryMatches(entry, query, category));
  const sessions = getSavedSessions().filter((session) => sessionMatches(session, query, category));
  const recent = entries.slice(0, 8);
  const favorites = entries.filter((entry) => entry.favorite).slice(0, 8);

  ui.libraryRecentGrid.replaceChildren(...recent.map(createLibraryCard));
  ui.libraryFavoritesGrid.replaceChildren(...favorites.map(createLibraryCard));
  ui.librarySessionsList.replaceChildren(...sessions.map(createSessionRow));
  ui.libraryRecentCount.textContent = String(recent.length);
  ui.libraryFavoriteCount.textContent = String(favorites.length);
  ui.librarySessionCount.textContent = String(sessions.length);
  ui.libraryFavoritesSection.hidden = favorites.length === 0;
  const empty = recent.length === 0 && favorites.length === 0 && sessions.length === 0;
  ui.libraryEmpty.hidden = !empty;
  ui.libraryEmpty.querySelector('strong').textContent = query || category !== 'all' ? 'Nenhum resultado' : 'Nada por aqui ainda';
  ui.libraryEmpty.querySelector('p').textContent = query || category !== 'all'
    ? 'Tente outro termo ou categoria.'
    : 'Abra uma lâmina SVS para ela aparecer na biblioteca local.';
}

function showLibrary() {
  if (!ui.libraryScreen) return;
  flushLocalAutosave();
  if (state.presentationMode) setPresentationMode(false);
  closeMoreMenu();
  ui.libraryScreen.hidden = false;
  ui.app.classList.add('library-open');
  renderLibrary();
  setStatus('Biblioteca local');
  window.setTimeout(() => ui.librarySearch?.focus(), 0);
}

function hideLibrary() {
  if (!ui.libraryScreen) return;
  ui.libraryScreen.hidden = true;
  ui.app.classList.remove('library-open');
}

function sameLocalFile(entry, file) {
  if (!entry || !file) return false;
  if (entry.fingerprint === slideFingerprint(file)) return true;
  return entry.name === file.name && Number(entry.size || 0) === Number(file.size || 0);
}

function requestLibraryOpen(entry) {
  if (!entry) return;
  if (state.currentFile && hasOpenSlide() && sameLocalFile(entry, state.currentFile)) {
    hideLibrary();
    setStatus(`${state.currentFile.name} · sessão atual`);
    return;
  }
  state.pendingLibraryOpen = { entry, session: null };
  setStatus(`Selecione o arquivo local “${entry.name}”`);
  showToast('Selecione o SVS correspondente no dispositivo', 'info');
  openPicker();
}

function requestSessionOpen(session) {
  if (!session?.payload) return;
  const entry = getLibraryEntries().find((item) => item.fingerprint === session.fingerprint)
    || { fingerprint: session.fingerprint, name: session.slideName, size: session.slideSize || session.payload?.slide?.size || 0 };
  if (state.currentFile && hasOpenSlide() && sameLocalFile(entry, state.currentFile)) {
    hideLibrary();
    applyProjectData(session.payload, { safe: true, resetHistoryAfter: true });
    state.activeSessionName = session.name || null;
    setAutosaveStatus(`Sessão · ${session.name || 'sem título'}`, 'saved');
    showToast(`Sessão carregada: ${session.name || 'sem título'}`, 'success');
    setStatus(`Sessão “${session.name || 'sem título'}” carregada`);
    return;
  }
  state.pendingLibraryOpen = { entry, session };
  setStatus(`Selecione “${session.slideName}” para restaurar a sessão`);
  showToast('A sessão está salva. Agora selecione o SVS local.', 'info');
  openPicker();
}

function openSessionDialog() {
  if (!hasOpenSlide() || !state.currentFile) return;
  const libraryEntry = findLibraryEntryForFile(state.currentFile);
  const baseName = state.currentFile.name.replace(/\.svs$/i, '');
  ui.sessionNameInput.value = `${baseName} · ${new Date().toLocaleDateString('pt-BR')}`;
  ui.sessionCategorySelect.value = libraryCategory(libraryEntry?.category || 'Histologia');
  if (typeof ui.sessionDialog.showModal === 'function') ui.sessionDialog.showModal();
  else ui.sessionDialog.setAttribute('open', '');
  window.setTimeout(() => { ui.sessionNameInput.focus(); ui.sessionNameInput.select(); }, 0);
}

function closeSessionDialog() {
  if (ui.sessionDialog.open && typeof ui.sessionDialog.close === 'function') ui.sessionDialog.close();
  else ui.sessionDialog.removeAttribute('open');
}

function saveSessionFromDialog(event) {
  event.preventDefault();
  if (!hasOpenSlide() || !state.currentFile) return;
  flushLocalAutosave();
  const name = ui.sessionNameInput.value.trim() || state.currentFile.name.replace(/\.svs$/i, '');
  const category = libraryCategory(ui.sessionCategorySelect.value);
  const now = new Date().toISOString();
  const session = {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    category,
    fingerprint: slideFingerprint(),
    slideName: state.currentFile.name,
    slideSize: Number(state.currentFile.size) || 0,
    createdAt: now,
    updatedAt: now,
    payload: projectPayload(),
  };
  const sessions = getSavedSessions();
  sessions.unshift(session);
  storeSavedSessions(sessions);
  const entry = findLibraryEntryForFile(state.currentFile);
  if (entry) updateLibraryEntry(entry.fingerprint, { category });
  state.activeSessionName = name;
  closeSessionDialog();
  renderLibrary();
  showToast(`Sessão salva: ${name}`, 'success');
  setStatus(`Sessão local salva: ${name}`);
}

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (prefs.activePanel && panelPages.some((page) => page.dataset.panelPage === prefs.activePanel)) state.activePanel = prefs.activePanel;
    if (typeof prefs.sidebarCollapsed === 'boolean') state.sidebarCollapsed = prefs.sidebarCollapsed;
    if (prefs.performanceProfileVersion === 1 && PERFORMANCE_PROFILES[prefs.performanceProfile]) {
      state.performanceProfile = prefs.performanceProfile;
    } else if (PERFORMANCE_PROFILES[prefs.performanceProfile] && prefs.performanceProfile !== 'balanced') {
      state.performanceProfile = prefs.performanceProfile;
    } else {
      state.performanceProfile = 'auto';
    }
    if (Number.isFinite(Number(prefs.brightness))) state.brightness = Math.min(160, Math.max(50, Number(prefs.brightness)));
    if (Number.isFinite(Number(prefs.contrast))) state.contrast = Math.min(180, Math.max(50, Number(prefs.contrast)));
    if (Number.isFinite(Number(prefs.saturation))) state.saturation = Math.min(150, Math.max(70, Number(prefs.saturation)));
    if (Number.isFinite(Number(prefs.sharpness))) state.sharpness = Math.min(50, Math.max(0, Number(prefs.sharpness)));
    state.highDefinition = Boolean(prefs.highDefinition);
    if (prefs.memorySafeModeVersion === 1 && typeof prefs.memorySafeMode === 'boolean') {
      state.memorySafeMode = prefs.memorySafeMode;
      state.memorySafeUserSet = true;
    }
  } catch (error) {
    console.warn('Preferências locais ignoradas:', error);
  }
}

function savePreferences() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      activePanel: state.activePanel,
      sidebarCollapsed: state.sidebarCollapsed,
      performanceProfile: state.performanceProfile,
      performanceProfileVersion: 1,
      brightness: state.brightness,
      contrast: state.contrast,
      saturation: state.saturation,
      sharpness: state.sharpness,
      highDefinition: state.highDefinition,
      memorySafeMode: state.memorySafeMode,
      memorySafeModeVersion: state.memorySafeUserSet ? 1 : 0,
    }));
  } catch (_) {
    // Preferências são opcionais.
  }
}

function cloneData(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function projectSnapshot() {
  return {
    measurements: cloneData(state.measurements),
    annotations: cloneData(state.annotations),
    rotation: state.rotation,
    brightness: state.brightness,
    contrast: state.contrast,
    saturation: state.saturation,
    sharpness: state.sharpness,
    highDefinition: state.highDefinition,
    pixelPerfect: state.pixelPerfect,
    performanceProfile: state.performanceProfile,
    lessonTitle: state.lessonTitle,
    lessonSequence: cloneData(state.lessonSequence),
    hiddenAnnotationGroups: cloneData(state.hiddenAnnotationGroups),
  };
}

function snapshotToken(snapshot) {
  try { return JSON.stringify(snapshot); } catch (_) { return String(Date.now()); }
}

function updateHistoryControls() {
  if (ui.undoBtn) ui.undoBtn.disabled = state.historyUndo.length <= 1;
  if (ui.redoBtn) ui.redoBtn.disabled = state.historyRedo.length === 0;
}

function resetHistory() {
  const snapshot = projectSnapshot();
  state.historyUndo = [snapshot];
  state.historyRedo = [];
  state.lastCommittedSnapshot = snapshotToken(snapshot);
  updateHistoryControls();
}

function commitHistory() {
  if (state.applyingHistory || !hasOpenSlide()) return;
  const snapshot = projectSnapshot();
  const token = snapshotToken(snapshot);
  if (token === state.lastCommittedSnapshot) return;
  state.historyUndo.push(snapshot);
  if (state.historyUndo.length > HISTORY_LIMIT) state.historyUndo.shift();
  state.historyRedo = [];
  state.lastCommittedSnapshot = token;
  updateHistoryControls();
}

function applyHistorySnapshot(snapshot, label) {
  if (!snapshot || !hasOpenSlide()) return;
  state.applyingHistory = true;
  try {
    state.measurements = cloneData(snapshot.measurements || []);
    state.annotations = cloneData(snapshot.annotations || []);
    state.measurementId = Math.max(0, ...state.measurements.map((m) => Number(m.id) || 0)) + 1;
    state.annotationId = Math.max(0, ...state.annotations.map((a) => Number(a.id) || 0)) + 1;
    state.measureStart = null;
    state.areaDraft = [];
    state.rotation = Number(snapshot.rotation) || 0;
    state.brightness = Number(snapshot.brightness) || 100;
    state.contrast = Number(snapshot.contrast) || 100;
    state.saturation = Number(snapshot.saturation) || 100;
    state.sharpness = Number(snapshot.sharpness) || 0;
    state.highDefinition = Boolean(snapshot.highDefinition);
    state.pixelPerfect = Boolean(snapshot.pixelPerfect);
    state.performanceProfile = PERFORMANCE_PROFILES[snapshot.performanceProfile] ? snapshot.performanceProfile : 'auto';
    state.lessonTitle = String(snapshot.lessonTitle || '');
    state.lessonSequence = Array.isArray(snapshot.lessonSequence) ? snapshot.lessonSequence.map(Number).filter(Number.isFinite) : [];
    state.lessonSequence = state.lessonSequence.filter((id) => state.annotations.some((annotation) => Number(annotation.id) === Number(id)));
    state.hiddenAnnotationGroups = Array.isArray(snapshot.hiddenAnnotationGroups) ? snapshot.hiddenAnnotationGroups.map(String) : [];
    state.shapeStart = null;
    state.pendingAnnotationDraft = null;
    viewer.viewport.setRotation(state.rotation);
    renderMeasurementList();
    renderAnnotationList();
    renderAnnotationGroupFilters();
    renderLessonPanel();
    applyVisualAdjustments();
    redrawOverlays();
    state.projectDirty = true;
    scheduleLocalAutosave();
    savePreferences();
    setStatus(label);
    showToast(label, 'info');
  } finally {
    state.applyingHistory = false;
  }
}

function undoHistory() {
  if (state.historyUndo.length <= 1) return;
  const current = state.historyUndo.pop();
  state.historyRedo.push(current);
  const previous = state.historyUndo[state.historyUndo.length - 1];
  state.lastCommittedSnapshot = snapshotToken(previous);
  applyHistorySnapshot(previous, 'Alteração desfeita');
  updateHistoryControls();
}

function redoHistory() {
  if (state.historyRedo.length === 0) return;
  const next = state.historyRedo.pop();
  state.historyUndo.push(next);
  state.lastCommittedSnapshot = snapshotToken(next);
  applyHistorySnapshot(next, 'Alteração refeita');
  updateHistoryControls();
}

function slideFingerprint(file = state.currentFile) {
  if (!file) return null;
  return `${file.name}::${file.size || 0}::${file.lastModified || 0}`;
}

function autosaveStorageKey(file = state.currentFile) {
  const fingerprint = slideFingerprint(file);
  return fingerprint ? `${AUTOSAVE_PREFIX}${encodeURIComponent(fingerprint)}` : null;
}

function setAutosaveStatus(text, stateName = 'idle') {
  if (!ui.autosaveState) return;
  ui.autosaveState.textContent = text;
  ui.autosaveState.dataset.state = stateName;
}

function updateAutosaveIndex(key, file, savedAt) {
  try {
    const raw = localStorage.getItem(AUTOSAVE_INDEX_KEY);
    const index = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(index) ? index.filter((item) => item?.key !== key) : [];
    next.unshift({ key, name: file?.name || 'Lâmina', savedAt });
    while (next.length > AUTOSAVE_MAX_PROJECTS) {
      const removed = next.pop();
      if (removed?.key) localStorage.removeItem(removed.key);
    }
    localStorage.setItem(AUTOSAVE_INDEX_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn('Não foi possível atualizar o índice do autosave:', error);
  }
}

function saveLocalAutosave() {
  if (!hasOpenSlide() || !state.currentFile) return false;
  const key = autosaveStorageKey();
  if (!key) return false;
  try {
    const savedAt = new Date().toISOString();
    const record = {
      schema: 'virtum-svs-autosave',
      version: 1,
      fingerprint: slideFingerprint(),
      savedAt,
      payload: projectPayload(),
    };
    localStorage.setItem(key, JSON.stringify(record));
    updateAutosaveIndex(key, state.currentFile, savedAt);
    state.autosaveAvailable = true;
    state.autosaveFingerprint = record.fingerprint;
    state.autosaveSavedAt = savedAt;
    state.projectDirty = false;
    const time = new Date(savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAutosaveStatus(`Autosave local · ${time}`, 'saved');
    return true;
  } catch (error) {
    state.autosaveAvailable = false;
    setAutosaveStatus('Autosave indisponível', 'error');
    console.warn('Autosave local falhou:', error);
    return false;
  }
}

function scheduleLocalAutosave() {
  if (!hasOpenSlide() || !state.currentFile) return;
  if (state.autosaveTimer) window.clearTimeout(state.autosaveTimer);
  setAutosaveStatus('Autosave local · salvando…', 'pending');
  state.autosaveTimer = window.setTimeout(() => {
    state.autosaveTimer = null;
    saveLocalAutosave();
  }, AUTOSAVE_DELAY_MS);
}

function flushLocalAutosave() {
  if (state.autosaveTimer) {
    window.clearTimeout(state.autosaveTimer);
    state.autosaveTimer = null;
  }
  if (!state.projectDirty) return true;
  return saveLocalAutosave();
}

function readLocalAutosave(file) {
  const key = autosaveStorageKey(file);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (record?.schema !== 'virtum-svs-autosave' || !record.payload) return null;
    return record;
  } catch (error) {
    console.warn('Autosave local ignorado:', error);
    return null;
  }
}

function hasVolatileWork() {
  return Boolean(state.measureStart || state.areaDraft.length || state.shapeStart || state.pendingMarkerPoint || state.pendingAnnotationDraft || ui.annotationDialog?.open);
}

function markProjectDirty() {
  state.projectDirty = true;
  scheduleLocalAutosave();
}

function setEngineState(text, kind = 'standby') {
  ui.engineState.textContent = text;
  ui.engineState.title = text;
  ui.engineState.dataset.state = kind;
}

function setBusy(show, title = 'Carregando...', text = '') {
  ui.busy.hidden = !show;
  ui.busyTitle.textContent = title;
  ui.busyText.textContent = text;
}

function restoreEmptyStateText() {
  ui.emptyLead.textContent = DEFAULT_EMPTY_LEAD;
  ui.emptyHint.textContent = DEFAULT_EMPTY_HINT;
}

function showEmptyStateError(message) {
  ui.emptyState.hidden = false;
  ui.emptyLead.textContent = 'Não foi possível iniciar o motor de lâminas.';
  ui.emptyHint.textContent = message;
}

function setViewerControlsEnabled(enabled) {
  ui.zoomOutBtn.disabled = !enabled;
  ui.zoomInBtn.disabled = !enabled;
  ui.homeBtn.disabled = !enabled;
  ui.measureBtn.disabled = !enabled;
  ui.captureBtn.disabled = !enabled;
  ui.rotateBtn.disabled = !enabled;
  ui.clearMeasurementsBtn.disabled = !enabled || state.measurements.length === 0;
  ui.markerBtn.disabled = !enabled;
  ui.areaBtn.disabled = !enabled;
  ui.proMarkerBtn.disabled = !enabled;
  ui.proArrowBtn.disabled = !enabled;
  ui.proCircleBtn.disabled = !enabled;
  ui.proRectBtn.disabled = !enabled;
  ui.proTextBtn.disabled = !enabled;
  ui.proAreaBtn.disabled = !enabled;
  ui.clearAnnotationsBtn.disabled = !enabled || state.annotations.length === 0;
  ui.finishAreaBtn.disabled = !enabled || state.annotationMode !== 'area' || state.areaDraft.length < 3;
  ui.cancelAreaBtn.disabled = !enabled || state.annotationMode !== 'area' || state.areaDraft.length === 0;
  ui.saveAnnotationsBtn.disabled = !enabled;
  ui.loadAnnotationsBtn.disabled = !enabled;
  ui.reportBtn.disabled = !enabled;
  ui.saveSessionBtn.disabled = !enabled;
  ui.presentationBtn.disabled = !enabled;
  ui.compareBtn.disabled = !enabled || state.memorySafeMode || detectMobileDevice();
  ui.lessonBtn.disabled = !enabled;
  ui.prepareLessonBtn.disabled = !enabled;
  ui.presentLessonBtn.disabled = !enabled || state.lessonSequence.length === 0;
  ui.maxQualityBtn.disabled = !enabled || state.memorySafeMode || detectMobileDevice();
  ui.nativeZoomBtn.disabled = !enabled;
  ui.highQualityToggle.disabled = !enabled || state.memorySafeMode || detectMobileDevice();
  ui.pixelPerfectToggle.disabled = !enabled;
  ui.perfProfileSelect.disabled = false;
  ui.resetVisualBtn.disabled = !enabled;
}

function hasOpenSlide() {
  return viewer.world.getItemCount() > 0;
}

function hasCompareSlide() {
  return compareViewer.world.getItemCount() > 0 && Boolean(state.compareSlide);
}

function setCompareActive(active) {
  state.compareActive = Boolean(active);
  ui.viewerShell.classList.toggle('compare-active', state.compareActive);
  ui.comparePane.hidden = !state.compareActive;
  ui.compareToolbar.hidden = !state.compareActive;
  applyPerformanceProfile(true);
  if (!state.compareActive) {
    ui.primaryCompareName.textContent = state.currentFile?.name || 'Lâmina principal';
  }
  window.requestAnimationFrame(() => {
    try {
      viewer.viewport.resize(new OpenSeadragon.Point(ui.viewer.clientWidth, ui.viewer.clientHeight), true);
      viewer.viewport.applyConstraints();
      viewer.forceRedraw();
    } catch (_) {}
    try {
      compareViewer.viewport.resize(new OpenSeadragon.Point(ui.compareViewer.clientWidth, ui.compareViewer.clientHeight), true);
      compareViewer.viewport.applyConstraints();
      compareViewer.forceRedraw();
    } catch (_) {}
    redrawOverlays();
  });
}

function openComparePicker() {
  if (!hasOpenSlide()) {
    showToast('Abra primeiro a lâmina principal', 'info');
    return;
  }
  ui.compareFileInput.value = '';
  ui.compareFileInput.click();
}

function compareNormalizedCenter(sourceViewer, dims) {
  if (!dims?.width || !dims?.height) return null;
  const center = sourceViewer.viewport.getCenter(true);
  const image = sourceViewer.viewport.viewportToImageCoordinates(center);
  if (!Number.isFinite(image.x) || !Number.isFinite(image.y)) return null;
  return {
    x: Math.max(0, Math.min(1, image.x / dims.width)),
    y: Math.max(0, Math.min(1, image.y / dims.height)),
  };
}

function syncCompareViewport(sourceViewer, targetViewer, sourceDims, targetDims) {
  if (!state.compareSync || state.compareSyncing || !hasOpenSlide() || !hasCompareSlide()) return;
  if (!sourceDims?.width || !targetDims?.width) return;
  const normalized = compareNormalizedCenter(sourceViewer, sourceDims);
  if (!normalized) return;
  const sourceHome = sourceViewer.viewport.getHomeZoom();
  const sourceZoom = sourceViewer.viewport.getZoom(true);
  const zoomRatio = sourceHome > 0 ? sourceZoom / sourceHome : 1;
  const targetImage = new OpenSeadragon.Point(normalized.x * targetDims.width, normalized.y * targetDims.height);
  const targetCenter = targetViewer.viewport.imageToViewportCoordinates(targetImage);
  const targetZoom = targetViewer.viewport.getHomeZoom() * zoomRatio;
  state.compareSyncing = true;
  try {
    targetViewer.viewport.panTo(targetCenter, true);
    targetViewer.viewport.zoomTo(targetZoom, null, true);
    targetViewer.viewport.applyConstraints();
  } finally {
    window.requestAnimationFrame(() => { state.compareSyncing = false; });
  }
}

function syncPrimaryToCompare() {
  const primaryDims = state.slides[0]?.levelDimensions?.[0];
  syncCompareViewport(viewer, compareViewer, primaryDims, state.compareDims);
}

function syncCompareToPrimary() {
  const primaryDims = state.slides[0]?.levelDimensions?.[0];
  syncCompareViewport(compareViewer, viewer, state.compareDims, primaryDims);
}

async function closeCompareMode(notify = true) {
  const slide = state.compareSlide;
  state.compareSlide = null;
  state.compareGenerator = null;
  state.compareFile = null;
  state.compareDims = null;
  state.compareOpening = false;
  compareViewer.close();
  if (slide) {
    try { await Promise.resolve(slide.close()); } catch (error) { console.warn('Falha ao fechar segunda lâmina:', error); }
  }
  ui.compareFileName.textContent = 'Segunda lâmina';
  ui.compareStatusText.textContent = 'Selecione a segunda lâmina';
  ui.compareEmpty.hidden = false;
  ui.compareBusy.hidden = true;
  setCompareActive(false);
  if (notify) showToast('Comparação encerrada', 'info');
}

async function openCompareSvs(file) {
  if (!file || state.compareOpening) return;
  if (!hasOpenSlide()) {
    showToast('Abra primeiro a lâmina principal', 'info');
    return;
  }
  if (!file.name.toLowerCase().endsWith('.svs')) {
    showToast('Selecione um arquivo .SVS', 'error');
    return;
  }
  state.compareOpening = true;
  try {
    await ensureOpenSlide();
    if (state.compareSlide) await closeCompareMode(false);
    state.compareOpening = true;
    state.compareFile = file;
    ui.compareFileName.textContent = file.name;
    ui.primaryCompareName.textContent = state.currentFile?.name || 'Lâmina principal';
    ui.compareStatusText.textContent = `Abrindo ${file.name}…`;
    ui.compareEmpty.hidden = true;
    ui.compareBusy.hidden = false;
    setCompareActive(true);
    const slide = await state.openslide.open(file);
    state.compareSlide = slide;
    state.compareDims = slide.levelDimensions?.[0] || null;
    state.compareGenerator = new DeepZoomGenerator(slide, { tileSize: DESKTOP_DZI_TILE_SIZE, overlap: 1 });
    const tileSource = createOpenSlideTileSource([state.compareGenerator], file.name);
    compareViewer.open(tileSource);
    showToast('Segunda lâmina aberta', 'success');
  } catch (error) {
    console.error('Falha ao abrir segunda lâmina:', error);
    showToast(`Não foi possível abrir a segunda lâmina: ${error?.message || error}`, 'error');
    await closeCompareMode(false);
  } finally {
    state.compareOpening = false;
  }
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = Number(bytes) || 0;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  const digits = i === 0 ? 0 : value < 10 ? 2 : 1;
  return `${value.toFixed(digits)} ${units[i]}`;
}

function parseDecimal(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).trim().replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function pickProp(props, names) {
  for (const name of names) {
    if (props?.[name] !== undefined && props?.[name] !== '') return props[name];
  }
  return null;
}

function updateMetadata(file, slide) {
  const dims = slide.levelDimensions?.[0];
  const props = slide.properties || {};
  const vendor = pickProp(props, ['openslide.vendor']) || 'não informado';
  const objective = pickProp(props, ['openslide.objective-power', 'aperio.AppMag']);
  const mppX = parseDecimal(pickProp(props, ['openslide.mpp-x', 'aperio.MPP']));
  const mppY = parseDecimal(pickProp(props, ['openslide.mpp-y'])) || mppX;

  state.mppX = mppX;
  state.mppY = mppY;
  state.objectivePower = parseDecimal(objective);

  ui.metaName.textContent = file.name;
  ui.primaryCompareName.textContent = file.name;
  ui.metaName.title = file.name;
  ui.metaSize.textContent = formatBytes(file.size);
  ui.metaSize.title = ui.metaSize.textContent;
  ui.metaDimensions.textContent = dims ? `${dims.width.toLocaleString('pt-BR')} × ${dims.height.toLocaleString('pt-BR')} px` : '—';
  ui.metaDimensions.title = ui.metaDimensions.textContent;
  ui.metaLevels.textContent = String(slide.levelCount ?? '—');
  ui.metaVendor.textContent = String(vendor);
  ui.metaVendor.title = ui.metaVendor.textContent;
  ui.metaMagnification.textContent = objective ? `${objective}×` : 'não informado';
  ui.metaMpp.textContent = mppX ? `${mppX.toFixed(3)} µm/px${mppY && Math.abs(mppY - mppX) > 1e-6 ? ` × ${mppY.toFixed(3)}` : ''}` : 'não informado';
  ui.metaMpp.title = ui.metaMpp.textContent;
  updateQualityInfo();
  updateDiagnostics();
}

function resetMetadata() {
  state.mppX = null;
  state.mppY = null;
  state.objectivePower = null;
  ui.metaName.textContent = 'Nenhuma lâmina aberta';
  ui.metaSize.textContent = '—';
  ui.metaDimensions.textContent = '—';
  ui.metaLevels.textContent = '—';
  ui.metaVendor.textContent = '—';
  ui.metaMagnification.textContent = '—';
  ui.metaMpp.textContent = '—';
  ui.metaQuality.textContent = '—';
  ui.diagLevel.textContent = '—';
  ui.diagEffectiveRes.textContent = '—';
  ui.diagCurrentMpp.textContent = '—';
  ui.diagApproxMag.textContent = '—';
  ui.diagTiles.textContent = '—';
  ui.qualityHint.textContent = 'Sem lâmina aberta.';
  ui.qualityBadge.hidden = true;
  ui.scaleBar.hidden = true;
  ui.positionText.textContent = 'Posição —';
  updateDiagnostics();
}

function clearFirstTileTimer() {
  if (state.firstTileTimer) {
    window.clearTimeout(state.firstTileTimer);
    state.firstTileTimer = null;
  }
}

function armFirstTileTimeout() {
  clearFirstTileTimer();
  state.firstTileTimer = window.setTimeout(() => {
    state.awaitingFirstTile = false;
    setBusy(false);
    if (!state.tileLoaded && state.currentFile) {
      const elapsed = state.firstTileRequestedAt ? Math.round(performance.now() - state.firstTileRequestedAt) : null;
      setStartupPhase(`Primeiro tile ainda processando${elapsed ? ` · ${elapsed} ms` : ''}`);
      setStatus(`${state.currentFile.name} · cabeçalho aberto; primeiro bloco ainda está sendo decodificado no tablet`);
    }
  }, detectMobileDevice() ? FIRST_TILE_TIMEOUT_MOBILE_MS : FIRST_TILE_TIMEOUT_DESKTOP_MS);
}

async function closeCurrentSlide() {
  clearFirstTileTimer();
  if (state.compareActive || state.compareSlide) await closeCompareMode(false);
  if (state.lessonPresenting) {
    state.lessonPresenting = false;
    if (ui.lessonPresentationBar) ui.lessonPresentationBar.hidden = true;
  }
  if (state.presentationMode) {
    state.presentationMode = false;
    ui.app.classList.remove('presentation-mode');
    ui.presentationBtn.textContent = 'Apresentar';
    ui.presentationBtn.setAttribute('aria-pressed', 'false');
  }
  if (state.autosaveTimer) {
    window.clearTimeout(state.autosaveTimer);
    state.autosaveTimer = null;
  }
  state.awaitingFirstTile = false;
  setMeasureMode(false);
  setAnnotationMode(null);
  if (ui.annotationDialog.open) closeAnnotationDialog();
  clearMeasurements(false);
  clearAnnotations(false);
  state.lessonTitle = '';
  state.lessonSequence = [];
  state.lessonPreparing = false;
  state.lessonIndex = 0;
  renderLessonPanel();
  state.pixelPerfect = false;
  ui.pixelPerfectToggle.checked = false;
  state.projectDirty = false;
  state.pendingAutosaveData = null;
  state.historyUndo = [];
  state.historyRedo = [];
  state.lastCommittedSnapshot = null;
  updateHistoryControls();
  setAutosaveStatus('Autosave local · aguardando lâmina', 'idle');
  viewer.close();
  const oldSlides = state.slides.splice(0);
  state.generators = [];
  state.tileRequested = 0;
  state.tileLoadedCount = 0;
  state.tileFailedCount = 0;
  state.tileAbortedCount = 0;
  state.tileLevelCounts = {};

  for (const slide of oldSlides) {
    try {
      await Promise.resolve(slide.close());
    } catch (error) {
      console.warn('Falha ao fechar handle da lâmina:', error);
    }
  }

  setViewerControlsEnabled(false);
  updateZoomText();
  ui.scaleBar.hidden = true;
}

function getCompatibilityProblem() {
  if (!window.isSecureContext) {
    return 'Este visualizador precisa ser aberto em HTTPS (ou localhost).';
  }
  if (!crossOriginIsolated) {
    return 'A página não está em modo cross-origin isolated. Confirme os headers COOP/COEP na hospedagem.';
  }
  if (typeof SharedArrayBuffer === 'undefined') {
    return 'SharedArrayBuffer não está disponível neste navegador/sessão.';
  }
  if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
    return 'Este navegador não oferece todos os recursos necessários de Web Worker/WebAssembly.';
  }
  return null;
}

function detectChromebook() {
  return /CrOS/i.test(navigator.userAgent || '');
}

function detectLowPowerDesktop() {
  if (detectMobileDevice()) return false;
  const logical = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory ?? null;
  const chromeOs = detectChromebook();
  return chromeOs || logical <= 4 || (memory !== null && memory <= 4);
}

function useFastRenderDefaults() {
  return detectMobileDevice() || detectLowPowerDesktop();
}

function detectMobileDevice() {
  const ua = navigator.userAgent || '';
  const uaMobile = Boolean(navigator.userAgentData?.mobile) || /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const ipadDesktopMode = /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;
  const coarsePointer = Boolean(window.matchMedia?.('(pointer: coarse)')?.matches);
  const narrowSide = Math.min(Number(screen.width || window.innerWidth || 0), Number(screen.height || window.innerHeight || 0));
  const touchTablet = coarsePointer && (navigator.maxTouchPoints || 0) > 1 && narrowSide > 0 && narrowSide <= 1100;
  return uaMobile || ipadDesktopMode || touchTablet;
}

function isLikelyConstrainedDevice() {
  const memory = navigator.deviceMemory ?? null;
  const ua = navigator.userAgent || '';
  const mobile = detectMobileDevice();
  const lowMemory = memory !== null && memory <= 4;
  return mobile || lowMemory;
}

function memorySafeReason() {
  const memory = navigator.deviceMemory ?? null;
  if (detectMobileDevice()) return 'tablet / dispositivo móvel detectado';
  if (memory !== null && memory <= 4) return `${memory} GB de memória reportada pelo navegador`;
  if (detectChromebook()) return 'proteção ativada manualmente no Chromebook';
  return 'proteção ativada manualmente';
}

function deviceHardwareSignature() {
  const logical = navigator.hardwareConcurrency || 0;
  const memory = navigator.deviceMemory || 0;
  const dpr = Number(window.devicePixelRatio || 1).toFixed(2);
  const mobile = detectMobileDevice() ? 1 : 0;
  return `v3|${logical}|${memory}|${dpr}|${screen.width || 0}x${screen.height || 0}|m${mobile}|c${detectChromebook()?1:0}`;
}

function setMemorySafeMode(enabled, { userSet = true, notify = true } = {}) {
  const next = Boolean(enabled);
  const changed = state.memorySafeMode !== next;
  state.memorySafeMode = next;
  if (userSet) state.memorySafeUserSet = true;
  if (ui.memorySafeToggle) ui.memorySafeToggle.checked = next;
  if (ui.startupSafeModeToggle) ui.startupSafeModeToggle.checked = next;

  if (next) {
    state.highDefinition = false;
    if (ui.highQualityToggle) ui.highQualityToggle.checked = false;
  }

  applyPerformanceProfile(true);
  updateDiagnostics();
  updateStartupDiagnostics();
  savePreferences();
  if (hasOpenSlide()) setViewerControlsEnabled(true);

  if (!hasOpenSlide() && state.ready && state.openslide) {
    try { state.openslide.terminate(); } catch (_) {}
    state.openslide = null;
    state.ready = false;
    state.engineMode = 'standby';
    state.engineWorkerCount = null;
    state.engineBrokerCacheBytes = null;
    setEngineState('Em espera', 'standby');
  }

  if (notify && changed) {
    if (next) {
      showToast('Modo seguro de memória ativado', 'success');
      setStatus('Modo seguro ativo · 1 worker, cache reduzido e preload desligado');
    } else {
      showToast('Modo seguro de memória desativado', 'info');
      setStatus(hasOpenSlide() ? 'A alteração completa de workers valerá na próxima inicialização do motor.' : 'Modo seguro desativado.');
    }
  }
}

function applyStartupMemorySafety() {
  if (!state.memorySafeUserSet && isLikelyConstrainedDevice()) {
    state.memorySafeMode = true;
  }
  if (ui.memorySafeToggle) ui.memorySafeToggle.checked = state.memorySafeMode;
  if (ui.startupSafeModeToggle) ui.startupSafeModeToggle.checked = state.memorySafeMode;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function loadCachedDeviceBenchmark() {
  try {
    const raw = localStorage.getItem(DEVICE_BENCHMARK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const fresh = Date.now() - Number(parsed.completedAt || 0) < DEVICE_BENCHMARK_TTL_MS;
    if (!fresh || parsed.signature !== deviceHardwareSignature() || !ADAPTIVE_TIERS[parsed.tier]) return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function saveDeviceBenchmark(result) {
  try { localStorage.setItem(DEVICE_BENCHMARK_KEY, JSON.stringify(result)); } catch (_) {}
}

async function runDeviceBenchmark(force = false) {
  if (state.benchmarkPromise) return state.benchmarkPromise;
  if (!force) {
    const cached = loadCachedDeviceBenchmark();
    if (cached) {
      state.deviceBenchmark = cached;
      updateDiagnostics();
      updateStartupDiagnostics();
      return cached;
    }
  }

  state.benchmarkPromise = (async () => {
    if (ui.diagBenchmark) ui.diagBenchmark.textContent = 'avaliando…';
    if (ui.startupDiagBenchmark) ui.startupDiagBenchmark.textContent = 'avaliando…';
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    const logical = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory ?? null;
    const mobile = detectMobileDevice();
    const lowPower = !mobile && (detectChromebook() || logical <= 4 || (memory !== null && memory <= 4));
    const constrained = mobile || (memory !== null && memory <= 4 && !detectChromebook());
    const samples = [];
    let checksum = 0;
    const iterations = constrained ? 170000 : 260000;

    for (let round = 0; round < 3; round += 1) {
      const started = performance.now();
      let value = 0;
      for (let i = 1; i <= iterations; i += 1) {
        value += Math.sqrt((i % 997) + 1) * Math.sin((i + round) * 0.00013);
      }
      checksum += value;
      samples.push(performance.now() - started);
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }

    const cpuMs = median(samples);
    let score = 0;
    if (logical >= 12) score += 3.5;
    else if (logical >= 8) score += 2.8;
    else if (logical >= 6) score += 2.0;
    else if (logical >= 4) score += 1.1;

    // Memória desconhecida nunca mais é tratada como sinal positivo.
    if (memory !== null) {
      if (memory >= 16) score += 3.0;
      else if (memory >= 8) score += 2.2;
      else if (memory >= 6) score += 1.5;
      else if (memory >= 4) score += 0.8;
    }

    if (cpuMs <= 18) score += 3.5;
    else if (cpuMs <= 28) score += 2.8;
    else if (cpuMs <= 45) score += 2.0;
    else if (cpuMs <= 70) score += 1.0;
    else score += 0.3;

    if (mobile) score -= 2.2;
    if (memory !== null && memory <= 4) score -= 1.2;

    let tier = constrained ? 'lite' : (lowPower ? 'lowpower' : (score >= 7.3 ? 'strong' : score >= 4.2 ? 'balanced' : 'lite')); 
    let base = ADAPTIVE_TIERS[tier];
    const maxWorkersByCpu = logical >= 12 ? 4 : logical >= 8 ? 3 : logical >= 4 ? 2 : 1;
    const maxWorkersByMemory = memory === null ? 2 : memory <= 4 ? 1 : memory <= 6 ? 2 : 3;
    let workerCount = Math.max(1, Math.min(base.workerCount, maxWorkersByCpu, maxWorkersByMemory));
    let brokerCacheBytes = base.brokerCacheBytes;
    let maxConcurrentReads = base.maxConcurrentReads;
    let readAhead = base.readAhead;
    let jobLimit = base.jobLimit;
    let preload = base.preload;
    let tileCacheCount = base.tileCacheCount;
    let recommendedProfile = base.recommendedProfile;

    if (constrained) {
      tier = 'lite';
      base = ADAPTIVE_TIERS.lite;
      workerCount = MEMORY_SAFE_CONFIG.workerCount;
      brokerCacheBytes = MEMORY_SAFE_CONFIG.brokerCacheBytes;
      maxConcurrentReads = MEMORY_SAFE_CONFIG.maxConcurrentReads;
      readAhead = MEMORY_SAFE_CONFIG.readAhead;
      jobLimit = MEMORY_SAFE_CONFIG.jobLimit;
      preload = MEMORY_SAFE_CONFIG.preload;
      tileCacheCount = MEMORY_SAFE_CONFIG.tileCacheCount;
      recommendedProfile = 'performance';
    } else if (lowPower) {
      tier = 'lowpower';
      base = ADAPTIVE_TIERS.lowpower;
      workerCount = LOW_POWER_CONFIG.workerCount;
      brokerCacheBytes = LOW_POWER_CONFIG.brokerCacheBytes;
      maxConcurrentReads = LOW_POWER_CONFIG.maxConcurrentReads;
      readAhead = LOW_POWER_CONFIG.readAhead;
      jobLimit = LOW_POWER_CONFIG.jobLimit;
      preload = LOW_POWER_CONFIG.preload;
      tileCacheCount = LOW_POWER_CONFIG.tileCacheCount;
      recommendedProfile = 'performance';
    } else if (memory !== null && memory <= 6) {
      brokerCacheBytes = Math.min(brokerCacheBytes, 48 * 1024 * 1024);
    }

    const result = {
      signature: deviceHardwareSignature(),
      completedAt: Date.now(),
      logical,
      memory,
      mobile,
      constrained,
      lowPower,
      cpuMs: Number(cpuMs.toFixed(2)),
      score: Number(score.toFixed(2)),
      tier,
      recommendedProfile,
      workerCount,
      brokerCacheBytes,
      maxConcurrentReads,
      readAhead,
      jobLimit,
      preload,
      tileCacheCount,
      checksum: Number.isFinite(checksum) ? Number(checksum.toFixed(2)) : 0,
    };

    state.deviceBenchmark = result;
    if (!state.memorySafeUserSet && constrained) state.memorySafeMode = true;
    saveDeviceBenchmark(result);
    state.runtimeThrottle = 1;
    applyPerformanceProfile(true);
    updateQualityInfo();
    updateDiagnostics();
    updateStartupDiagnostics();
    return result;
  })().finally(() => { state.benchmarkPromise = null; });

  return state.benchmarkPromise;
}

function adaptiveTierConfig() {
  if (state.memorySafeMode) return { ...ADAPTIVE_TIERS.lite, ...MEMORY_SAFE_CONFIG, recommendedProfile: 'performance' };
  const benchmark = state.deviceBenchmark;
  if (benchmark?.tier === 'lowpower') return { ...ADAPTIVE_TIERS.lowpower, ...LOW_POWER_CONFIG, recommendedProfile: 'performance' };
  return ADAPTIVE_TIERS[benchmark?.tier] || ADAPTIVE_TIERS.balanced;
}

function effectiveProfileKey() {
  if (state.memorySafeMode) return 'performance';
  if (state.performanceProfile !== 'auto') return state.performanceProfile;
  return state.deviceBenchmark?.recommendedProfile || adaptiveTierConfig().recommendedProfile;
}

function engineSettingsForCurrentMode() {
  if (state.memorySafeMode) {
    return {
      workerCount: MEMORY_SAFE_CONFIG.workerCount,
      blockSize: MEMORY_SAFE_CONFIG.blockSize,
      brokerCacheBytes: MEMORY_SAFE_CONFIG.brokerCacheBytes,
      maxConcurrentReads: MEMORY_SAFE_CONFIG.maxConcurrentReads,
      readAhead: MEMORY_SAFE_CONFIG.readAhead,
    };
  }

  const benchmark = state.deviceBenchmark;
  if (state.performanceProfile === 'auto' && benchmark) {
    return {
      workerCount: benchmark.workerCount,
      blockSize: benchmark.tier === 'lowpower' ? LOW_POWER_CONFIG.blockSize : 1024 * 1024,
      brokerCacheBytes: benchmark.brokerCacheBytes,
      maxConcurrentReads: benchmark.maxConcurrentReads,
      readAhead: benchmark.readAhead,
    };
  }

  const logical = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || null;
  const manual = state.performanceProfile === 'quality'
    ? { workerCount: 3, brokerCacheBytes: 128 * 1024 * 1024, maxConcurrentReads: 3, readAhead: 2 }
    : state.performanceProfile === 'performance'
      ? { workerCount: 1, brokerCacheBytes: 32 * 1024 * 1024, maxConcurrentReads: 1, readAhead: 0 }
      : { workerCount: 2, brokerCacheBytes: 64 * 1024 * 1024, maxConcurrentReads: 2, readAhead: 1 };

  manual.blockSize = 1024 * 1024;
  manual.workerCount = Math.min(manual.workerCount, logical >= 8 ? 3 : logical >= 4 ? 2 : 1);
  if (memory !== null && memory <= 4) {
    manual.workerCount = 1;
    manual.brokerCacheBytes = Math.min(manual.brokerCacheBytes, 32 * 1024 * 1024);
  } else if (memory !== null && memory <= 6) {
    manual.workerCount = Math.min(manual.workerCount, 2);
    manual.brokerCacheBytes = Math.min(manual.brokerCacheBytes, 64 * 1024 * 1024);
  }
  // Mesmo com perfil manual, navegadores móveis recebem um teto de segurança.
  if (detectMobileDevice()) {
    manual.workerCount = 1;
    manual.brokerCacheBytes = Math.min(manual.brokerCacheBytes, 32 * 1024 * 1024);
    manual.maxConcurrentReads = 1;
    manual.readAhead = 0;
  } else if (detectLowPowerDesktop()) {
    manual.workerCount = 1;
    manual.blockSize = 2 * 1024 * 1024;
    manual.brokerCacheBytes = Math.min(manual.brokerCacheBytes, 32 * 1024 * 1024);
    manual.maxConcurrentReads = 2;
    manual.readAhead = 2;
  }
  return manual;
}

function getWorkerCount() {
  return engineSettingsForCurrentMode().workerCount;
}

function setStartupPhase(phase, error = '') {
  state.startupPhase = phase || '—';
  if (error) state.lastEngineError = String(error?.message || error || 'Falha desconhecida');
  updateStartupDiagnostics();
}

function wasmProbeText(result = state.wasmMemoryProbe) {
  if (!result) return 'não executado';
  if (result.upstreamOk) return '2 GiB: OK · 512 MiB: OK';
  if (result.reducedOk) return `2 GiB: FALHOU · 512 MiB: OK (${result.upstreamError || 'limite do navegador'})`;
  return `2 GiB: FALHOU · 512 MiB: FALHOU (${result.reducedError || result.upstreamError || 'sem memória compartilhada'})`;
}

async function runWasmMemoryProbe({ notify = true } = {}) {
  const result = {
    testedAt: Date.now(),
    upstreamOk: false,
    reducedOk: false,
    upstreamError: '',
    reducedError: '',
  };

  setStartupPhase('Testando memória compartilhada WASM');
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  if (!window.crossOriginIsolated || typeof SharedArrayBuffer === 'undefined') {
    result.upstreamError = 'SharedArrayBuffer indisponível / crossOriginIsolated=false';
    result.reducedError = result.upstreamError;
    state.wasmMemoryProbe = result;
    setStartupPhase('Teste WASM concluído');
    if (notify) showToast('Memória WASM compartilhada indisponível', 'error');
    return result;
  }

  const tryMemory = (maximum, fieldOk, fieldError) => {
    try {
      let memory = new WebAssembly.Memory({
        initial: WASM_UPSTREAM_INITIAL_PAGES,
        maximum,
        shared: true,
      });
      // Toca a primeira página para forçar a visão tipada e detectar falhas imediatas.
      const view = new Uint8Array(memory.buffer, 0, 1);
      view[0] = 0;
      result[fieldOk] = true;
      memory = null;
    } catch (error) {
      result[fieldError] = String(error?.message || error || 'falha de alocação');
    }
  };

  // Primeiro tenta 512 MiB. Se isso já falhar, não arriscamos pedir o teto de 2 GiB.
  tryMemory(WASM_REDUCED_MAX_PAGES, 'reducedOk', 'reducedError');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  if (result.reducedOk) {
    tryMemory(WASM_UPSTREAM_MAX_PAGES, 'upstreamOk', 'upstreamError');
  } else {
    result.upstreamError = 'não testado: o limite de 512 MiB já falhou';
  }

  state.wasmMemoryProbe = result;
  setStartupPhase('Teste WASM concluído');
  if (notify) {
    if (result.upstreamOk) showToast('Memória WASM de 2 GiB aceita pelo navegador', 'success');
    else if (result.reducedOk) showToast('2 GiB falhou; 512 MiB foi aceito', 'info');
    else showToast('O navegador rejeitou a memória WASM compartilhada', 'error');
  }
  return result;
}

function startupDiagnosticText() {
  const engine = engineSettingsForCurrentMode();
  const benchmark = state.deviceBenchmark;
  return [
    'Virtum SVS Viewer v0.5.3.2 · Mobile Fast Start',
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    `UA: ${navigator.userAgent || '—'}`,
    `Móvel/tablet: ${detectMobileDevice()}`,
    `HTTPS/contexto seguro: ${window.isSecureContext}`,
    `crossOriginIsolated: ${window.crossOriginIsolated}`,
    `SharedArrayBuffer: ${typeof SharedArrayBuffer !== 'undefined'}`,
    `WebAssembly: ${typeof WebAssembly !== 'undefined'}`,
    `Worker: ${typeof Worker !== 'undefined'}`,
    `CPU: ${navigator.hardwareConcurrency || 'não informado'}`,
    `RAM deviceMemory: ${navigator.deviceMemory ?? 'não informada'}`,
    `Benchmark: ${benchmark ? `${benchmark.cpuMs.toFixed(1)} ms · score ${benchmark.score.toFixed(1)} · ${benchmark.tier}` : 'não executado'}`,
    `Modo seguro: ${state.memorySafeMode}`,
    `Engine WASM: ${state.mobileWasmStatus} (${state.wasmVariant})`,
    `Workers: ${engine.workerCount}`,
    `Block size: ${Math.round((engine.blockSize || 1024 * 1024) / 1024)} KiB`,
    `Broker cache: ${Math.round(engine.brokerCacheBytes / (1024 * 1024))} MiB`,
    `Fase: ${state.startupPhase}`,
    `Primeiro tile: ${state.firstTileTotalMs == null ? '—' : `${Math.round(state.firstTileTotalMs)} ms`} · decode ${state.firstTileDecodeMs == null ? '—' : `${Math.round(state.firstTileDecodeMs)} ms`} · bitmap ${state.firstTileBitmapMs == null ? '—' : `${Math.round(state.firstTileBitmapMs)} ms`}`,
    `Probe WASM: ${wasmProbeText()}`,
    `Último erro: ${state.lastEngineError || '—'}`,
  ].join('\n');
}

async function copyStartupDiagnostics() {
  const text = startupDiagnosticText();
  try {
    await navigator.clipboard.writeText(text);
    showToast('Diagnóstico copiado', 'success');
  } catch (_) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); showToast('Diagnóstico copiado', 'success'); }
    catch (_) { showToast('Não foi possível copiar o diagnóstico', 'error'); }
    area.remove();
  }
}

async function testOpenSlideEngine() {
  if (state.ready && state.openslide) {
    setStartupPhase('Motor já inicializado');
    showToast('OpenSlide já está pronto', 'success');
    return;
  }
  state.lastEngineError = '';
  if (ui.startupTestEngineBtn) ui.startupTestEngineBtn.disabled = true;
  try {
    setStartupPhase('Teste do motor · iniciando');
    await ensureOpenSlide();
    setStartupPhase('Motor OpenSlide pronto');
    showToast('Motor OpenSlide iniciou sem abrir lâmina', 'success');
  } catch (error) {
    state.lastEngineError = explainInitError(error);
    setStartupPhase('Falha no motor', state.lastEngineError);
    showToast('Teste do motor falhou', 'error');
  } finally {
    if (ui.startupTestEngineBtn) ui.startupTestEngineBtn.disabled = false;
    updateStartupDiagnostics();
  }
}

async function resolveOpenSlideWasmAssets() {
  const stock = {
    variant: 'stock',
    label: 'Padrão · pacote npm',
    wasmJsUrl: new URL('@computationalpathologygroup/openslide-js/wasm/openslide.js', import.meta.url).href,
    wasmBinaryUrl: new URL('@computationalpathologygroup/openslide-js/wasm/openslide.wasm', import.meta.url),
  };

  const wantsMobile = detectMobileDevice() || state.memorySafeMode;
  if (!wantsMobile) {
    state.wasmVariant = 'stock';
    state.mobileWasmStatus = 'desktop · engine padrão';
    return stock;
  }

  try {
    state.mobileWasmStatus = 'verificando Mobile WASM…';
    updateStartupDiagnostics();
    const manifestUrl = new URL(MOBILE_WASM_MANIFEST_URL, window.location.origin);
    manifestUrl.searchParams.set('v', '053');
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
    const manifest = await response.json();
    if (!manifest?.ready || !manifest?.js || !manifest?.wasm) throw new Error('manifest incompleto');

    const jsUrl = new URL(manifest.js, window.location.origin).href;
    const wasmUrl = new URL(manifest.wasm, window.location.origin);
    const probe = await fetch(wasmUrl, { method: 'HEAD', cache: 'no-store' });
    if (!probe.ok) throw new Error(`WASM HTTP ${probe.status}`);

    state.wasmVariant = 'mobile-512';
    state.mobileWasmManifest = manifest;
    state.mobileWasmStatus = `Mobile WASM ${manifest.maximumMemoryMiB || 512} MiB · ativo`;
    return {
      variant: 'mobile-512',
      label: state.mobileWasmStatus,
      wasmJsUrl: jsUrl,
      wasmBinaryUrl: wasmUrl,
    };
  } catch (error) {
    state.wasmVariant = 'stock-fallback';
    state.mobileWasmStatus = 'Mobile WASM ausente · fallback padrão';
    console.warn('Mobile WASM ainda não disponível; usando build padrão:', error);
    return stock;
  } finally {
    updateStartupDiagnostics();
  }
}

async function initializeAttempt({ ioEnabled, label }) {
  const workerUrl = new URL('@computationalpathologygroup/openslide-js/worker', import.meta.url);
  const wasmAssets = await resolveOpenSlideWasmAssets();
  const wasmJsUrl = wasmAssets.wasmJsUrl;
  const wasmBinaryUrl = wasmAssets.wasmBinaryUrl;

  const workers = new Set();
  let timeoutId;

  const workerFactory = () => {
    const worker = new Worker(workerUrl, { type: 'module', name: 'virtum-openslide' });
    workers.add(worker);
    return worker;
  };

  let wasmBinary;
  try {
    setStartupPhase(`Baixando OpenSlide WASM · ${state.wasmVariant}`);
    const response = await fetch(wasmBinaryUrl);
    if (!response.ok) {
      throw new Error(`WASM HTTP ${response.status}: ${response.statusText || 'falha ao carregar'}`);
    }
    wasmBinary = await response.arrayBuffer();
    setStartupPhase('WASM carregado · preparando worker');
  } catch (error) {
    throw new Error(`Não foi possível carregar o OpenSlide WASM: ${error?.message || error}`);
  }

  const engineSettings = engineSettingsForCurrentMode();
  state.engineWorkerCount = engineSettings.workerCount;
  state.engineBrokerCacheBytes = engineSettings.brokerCacheBytes;

  setStartupPhase(`Inicializando OpenSlide · ${label}`);
  const initializePromise = OpenSlide.initialize({
    workerCount: engineSettings.workerCount,
    workerFactory,
    wasmUrl: wasmJsUrl,
    wasmBinary,
    io: ioEnabled
      ? {
          enabled: true,
          blockSize: engineSettings.blockSize || 1024 * 1024,
          brokerCacheBytes: engineSettings.brokerCacheBytes,
          maxConcurrentReads: engineSettings.maxConcurrentReads,
          readAhead: engineSettings.readAhead,
        }
      : { enabled: false },
  });

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(`${label} excedeu ${Math.round(INIT_TIMEOUT_MS / 1000)} s.`));
    }, INIT_TIMEOUT_MS);
  });

  try {
    const openslide = await Promise.race([initializePromise, timeoutPromise]);
    window.clearTimeout(timeoutId);
    return openslide;
  } catch (error) {
    window.clearTimeout(timeoutId);
    for (const worker of workers) {
      try { worker.terminate(); } catch (_) {}
    }
    throw error;
  }
}

function explainInitError(error) {
  const raw = String(error?.message || error || 'Falha desconhecida');
  const lower = raw.toLowerCase();

  if (lower.includes('crossoriginisolated') || lower.includes('sharedarraybuffer')) {
    return `Isolamento do navegador ausente. crossOriginIsolated=${String(window.crossOriginIsolated)}. Verifique COOP/COEP.`;
  }
  if (lower.includes('worker') && (lower.includes('load') || lower.includes('module'))) {
    return `O Web Worker do OpenSlide não carregou. ${raw}`;
  }
  if (lower.includes('memory') || lower.includes('out of') || lower.includes('allocation') || lower.includes('oom')) {
    return `O navegador recusou a memória necessária ao OpenSlide/WASM. ${raw}`;
  }
  if (lower.includes('wasm') || lower.includes('webassembly')) {
    return `O WebAssembly do OpenSlide não carregou. ${raw}`;
  }
  return raw;
}

function isMemoryPressureError(error) {
  const raw = String(error?.message || error || '').toLowerCase();
  return raw.includes('memory')
    || raw.includes('out of')
    || raw.includes('allocation')
    || raw.includes('oom')
    || raw.includes('insufici')
    || raw.includes('memória')
    || raw.includes('memoria');
}

function diagnosticSummary() {
  return [
    `secure=${window.isSecureContext}`,
    `isolated=${window.crossOriginIsolated}`,
    `SAB=${typeof SharedArrayBuffer !== 'undefined'}`,
    `Worker=${typeof Worker !== 'undefined'}`,
    `WASM=${typeof WebAssembly !== 'undefined'}`,
    `CPU=${navigator.hardwareConcurrency || '?'}`,
  ].join(' · ');
}

async function ensureOpenSlide() {
  if (state.ready && state.openslide) return state.openslide;
  if (state.initPromise) return state.initPromise;

  if (!state.deviceBenchmark) {
    try { await runDeviceBenchmark(false); } catch (error) { console.warn('Benchmark automático ignorado:', error); }
  }

  const compatibilityProblem = getCompatibilityProblem();
  if (compatibilityProblem) {
    state.ready = false;
    state.engineMode = 'error';
    setEngineState('Indisponível', 'error');
    setStatus(compatibilityProblem);
    showEmptyStateError(compatibilityProblem);
    throw new Error(compatibilityProblem);
  }

  state.initializing = true;
  state.memoryRecoveryAttempted = false;
  setEngineState('Inicializando', 'loading');

  state.initPromise = (async () => {
    let firstError = null;

    const tryLocal = async (label = 'Inicialização local') => {
      const engine = await initializeAttempt({ ioEnabled: false, label });
      state.engineMode = state.memorySafeMode ? 'safe-local' : 'local';
      return engine;
    };

    const tryBroker = async (label = 'Inicialização com I/O compartilhado') => {
      const engine = await initializeAttempt({ ioEnabled: true, label });
      state.engineMode = state.memorySafeMode ? 'safe-broker' : 'broker';
      return engine;
    };

    const enableRecoverySafeMode = (error) => {
      if (state.memorySafeMode) return false;
      if (!isMemoryPressureError(error)) return false;
      state.memoryRecoveryAttempted = true;
      setMemorySafeMode(true, { userSet: true, notify: false });
      showToast('Memória pressionada · tentando Modo seguro', 'info');
      updateStartupDiagnostics();
      return true;
    };

    try {
      const safetyText = state.memorySafeMode ? ' · Modo seguro' : '';
      setBusy(true, 'Preparando o microscópio', `Inicializando o motor local de lâminas${safetyText}…`);

      const mobileSingleAttempt = state.memorySafeMode && detectMobileDevice();
      if (mobileSingleAttempt) {
        // O broker de I/O não carrega outra instância WASM. Ele centraliza leituras
        // do File API, mantém um cache pequeno e faz read-ahead, reduzindo o custo
        // de milhares de leituras pequenas sem aumentar o número de decoders.
        setBusy(true, 'Modo móvel otimizado', '1 worker · I/O compartilhado · cache moderado…');
        setStartupPhase('Inicialização móvel · I/O compartilhado');
        try {
          state.openslide = await tryBroker('Inicialização móvel otimizada');
        } catch (mobileError) {
          state.lastEngineError = explainInitError(mobileError);
          if (isMemoryPressureError(mobileError)) throw mobileError;
          console.warn('I/O compartilhado móvel falhou; usando fallback local compatível:', mobileError);
          setBusy(true, 'Fallback móvel', 'I/O compartilhado indisponível · tentando acesso local…');
          setStartupPhase('Fallback móvel · I/O local');
          state.openslide = await tryLocal('Fallback móvel local');
        }
      } else try {
        state.openslide = await tryLocal();
      } catch (error) {
        firstError = error;
        const switchedToSafe = enableRecoverySafeMode(error);

        if (switchedToSafe) {
          console.warn('Pressão de memória detectada. Repetindo inicialização em modo seguro:', error);
          setBusy(true, 'Protegendo memória', 'Reiniciando o OpenSlide com 1 worker e cache mínimo…');
          try {
            state.openslide = await tryLocal('Inicialização local em modo seguro');
          } catch (safeLocalError) {
            firstError = safeLocalError;
            console.warn('Modo seguro local falhou. Tentando I/O compartilhado seguro:', safeLocalError);
            setBusy(true, 'Última tentativa segura', 'Tentando I/O compartilhado com memória reduzida…');
            state.openslide = await tryBroker('Inicialização segura com I/O compartilhado');
          }
        } else {
          console.warn('Inicialização local falhou. Tentando I/O compartilhado:', error);
          setBusy(true, 'Segunda tentativa', 'Tentando o motor com I/O compartilhado…');
          try {
            state.openslide = await tryBroker();
          } catch (brokerError) {
            if (enableRecoverySafeMode(brokerError)) {
              console.warn('I/O compartilhado encontrou pressão de memória. Tentando sequência segura:', brokerError);
              setBusy(true, 'Protegendo memória', 'Tentando novamente com 1 worker e caches reduzidos…');
              try {
                state.openslide = await tryLocal('Recuperação local em modo seguro');
              } catch (safeLocalError) {
                firstError = safeLocalError;
                state.openslide = await tryBroker('Recuperação segura com I/O compartilhado');
              }
            } else {
              throw brokerError;
            }
          }
        }
      }

      state.ready = true;
      restoreEmptyStateText();
      const version = await state.openslide.getVersion();
      const brokerMode = state.engineMode === 'broker' || state.engineMode === 'safe-broker';
      const modeLabel = brokerMode ? ' · I/O compartilhado' : ' · local';
      const safeLabel = state.memorySafeMode ? ' · memória segura' : '';
      setEngineState(`OpenSlide ${version}${modeLabel}${safeLabel}`, 'ready');
      setStatus(`Motor pronto · OpenSlide ${version}${modeLabel}${safeLabel}`);
      state.lastEngineError = '';
      setStartupPhase('Motor OpenSlide pronto');
      updateDiagnostics();
      return state.openslide;
    } catch (error) {
      console.error('Falha ao inicializar OpenSlide:', error, { firstError });
      state.ready = false;
      state.openslide = null;
      state.engineMode = 'error';
      const message = explainInitError(error);
      state.lastEngineError = message;
      setStartupPhase('Falha ao inicializar OpenSlide', message);
      const diag = diagnosticSummary();
      setEngineState('Falha ao iniciar', 'error');
      setStatus(`${message} · ${diag}`);
      showEmptyStateError(`${message} | Diagnóstico: ${diag}`);
      updateDiagnostics();
      throw error;
    } finally {
      state.initializing = false;
      state.initPromise = null;
      if (!state.opening) setBusy(false);
    }
  })();

  return state.initPromise;
}

async function openSvs(file) {
  if (!file || state.opening) return;

  if (!file.name.toLowerCase().endsWith('.svs')) {
    setStatus('Selecione uma lâmina com extensão .svs');
    return;
  }

  if (state.pendingLibraryOpen?.entry && !sameLocalFile(state.pendingLibraryOpen.entry, file)) {
    const expected = state.pendingLibraryOpen.entry.name || 'a lâmina esperada';
    const proceed = window.confirm(`A biblioteca esperava “${expected}”, mas você selecionou “${file.name}”. Abrir este arquivo mesmo assim?`);
    if (!proceed) return;
    state.pendingLibraryOpen = null;
  }

  if (state.currentFile && hasOpenSlide()) {
    const autosaved = flushLocalAutosave();
    if (hasVolatileWork()) {
      const proceed = window.confirm('Há uma medição, área ou anotação ainda em edição. Abrir outra lâmina descartará apenas esse trabalho incompleto. Continuar?');
      if (!proceed) return;
    } else if (state.projectDirty && !autosaved) {
      const proceed = window.confirm('O autosave local não conseguiu proteger as últimas alterações. Abrir outra lâmina mesmo assim?');
      if (!proceed) return;
    }
  }

  hideLibrary();
  state.opening = true;
  state.openStartedAt = performance.now();
  state.headerOpenMs = null;
  state.firstViewMs = null;
  state.currentFile = file;
  state.lastEngineError = '';
  setStartupPhase('Arquivo .SVS recebido');
  restoreEmptyStateText();

  try {
    if (!state.ready || !state.openslide) {
      setBusy(true, 'Preparando o microscópio', 'O motor será iniciado somente agora…');
      setStartupPhase('Preparando motor OpenSlide');
      await ensureOpenSlide();
    }

    setBusy(true, 'Abrindo lâmina', `${file.name} · ${formatBytes(file.size)}`);
    setStatus('Lendo cabeçalho da lâmina…');
    setStartupPhase('Abrindo cabeçalho da lâmina');

    await closeCurrentSlide();

    const slide = await state.openslide.open(file);
    state.headerOpenMs = performance.now() - state.openStartedAt;
    state.slides.push(slide);
    setStartupPhase('Criando pirâmide Deep Zoom');
    const mobileTileSize = (detectMobileDevice() || state.memorySafeMode) ? MOBILE_DZI_TILE_SIZE : DESKTOP_DZI_TILE_SIZE;
    state.generators = [new DeepZoomGenerator(slide, { tileSize: mobileTileSize, overlap: 1 })];

    updateMetadata(file, slide);
    upsertLibraryEntry(file, slide);
    const requestedSession = state.pendingLibraryOpen?.session || null;
    const autosaveRecord = readLocalAutosave(file);
    state.pendingAutosaveData = requestedSession?.payload || autosaveRecord?.payload || null;
    state.autosaveSavedAt = requestedSession?.updatedAt || autosaveRecord?.savedAt || null;
    state.autosaveFingerprint = autosaveRecord?.fingerprint || slideFingerprint(file);
    state.activeSessionName = requestedSession?.name || null;
    state.pendingLibraryOpen = null;
    setAutosaveStatus(state.pendingAutosaveData ? (requestedSession ? 'Sessão local · restaurando…' : 'Autosave local · restaurando…') : 'Autosave local · ativo', state.pendingAutosaveData ? 'pending' : 'idle');
    hideLibrary();

    state.tileRequested = 0;
    state.firstTileRequestedAt = 0;
    state.firstTileDecodedAt = 0;
    state.firstTileDecodeMs = null;
    state.firstTileBitmapMs = null;
    state.firstTileTotalMs = null;
    state.tileLoadedCount = 0;
    state.tileFailedCount = 0;
    state.tileAbortedCount = 0;
    state.tileLevelCounts = {};
    const tileSource = createOpenSlideTileSource(state.generators, file.name, {
      onTileStart: ({ level, startedAt }) => {
        state.tileRequested += 1;
        if (!state.firstTileRequestedAt) {
          state.firstTileRequestedAt = startedAt || performance.now();
          setStartupPhase('Primeiro tile · lendo e decodificando…');
        }
        state.tileLevelCounts[level] = state.tileLevelCounts[level] || 0;
        scheduleDiagnosticsUpdate();
      },
      onTileDecoded: ({ decodeMs, decodedAt }) => {
        if (state.firstTileDecodeMs == null) {
          state.firstTileDecodeMs = decodeMs;
          state.firstTileDecodedAt = decodedAt || performance.now();
          setStartupPhase(`Primeiro tile decodificado · ${Math.round(decodeMs)} ms · preparando bitmap`);
        }
      },
      onTileLoaded: ({ level, decodeMs, bitmapMs, totalMs }) => {
        state.tileLoadedCount += 1;
        if (state.firstTileTotalMs == null) {
          state.firstTileDecodeMs = decodeMs;
          state.firstTileBitmapMs = bitmapMs;
          state.firstTileTotalMs = totalMs;
        }
        state.tileLevelCounts[level] = (state.tileLevelCounts[level] || 0) + 1;
        scheduleDiagnosticsUpdate();
      },
      onTileError: ({ error }) => { state.tileFailedCount += 1; state.lastEngineError = error?.message || String(error || 'Falha de tile'); scheduleDiagnosticsUpdate(); },
      onTileAbort: () => { state.tileAbortedCount += 1; scheduleDiagnosticsUpdate(); },
    });
    state.tileLoaded = false;
    state.tileErrors = 0;
    state.rotation = 0;
    state.awaitingFirstTile = true;
    setStartupPhase(`Aguardando primeiro tile · ${detectMobileDevice() ? 'mobile' : detectLowPowerDesktop() ? 'low power' : 'desktop'} 254 px · fast first view`);
    viewer.open(tileSource);
    ui.emptyState.hidden = true;
    setViewerControlsEnabled(true);
    setStatus(`${file.name} · preparando visualização…`);
    armFirstTileTimeout();
  } catch (error) {
    state.lastEngineError = String(error?.message || error || 'Falha ao abrir SVS');
    setStartupPhase('Falha ao abrir lâmina', state.lastEngineError);
    console.error('Falha ao abrir a lâmina:', error);
    state.awaitingFirstTile = false;
    await closeCurrentSlide();
    resetMetadata();
    ui.emptyState.hidden = false;
    const message = error?.message || 'Não foi possível abrir esta lâmina SVS.';
    setStatus(message);

    if (state.ready) {
      ui.emptyLead.textContent = 'A lâmina não pôde ser aberta.';
      ui.emptyHint.textContent = message;
    }
    showLibrary();
  } finally {
    state.opening = false;
    if (!state.awaitingFirstTile) setBusy(false);
  }
}

function openPicker() {
  if (state.opening || state.initializing) return;
  ui.fileInput.value = '';
  ui.fileInput.click();
}

function getViewerCanvases() {
  return [...ui.viewer.querySelectorAll('canvas'), ...ui.compareViewer.querySelectorAll('canvas')].filter((canvas) => canvas.width > 0 && canvas.height > 0);
}

function updateSharpenFilter() {
  if (!ui.sharpenMatrix) return;
  const amount = Math.max(0, Number(state.sharpness) || 0) / 100;
  const kernel = amount <= 0
    ? [0, 0, 0, 0, 1, 0, 0, 0, 0]
    : [0, -amount, 0, -amount, 1 + (4 * amount), -amount, 0, -amount, 0];
  ui.sharpenMatrix.setAttribute('kernelMatrix', kernel.map((value) => Number(value.toFixed(4))).join(' '));
}

function screenPixelsPerImagePixel() {
  if (!hasOpenSlide()) return null;
  const width = ui.viewer.clientWidth;
  const height = ui.viewer.clientHeight;
  if (width < 40 || height < 40) return null;
  const sample = Math.min(120, Math.max(60, width * 0.15));
  const centerX = width / 2;
  const centerY = height / 2;
  const vp1 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(centerX - sample / 2, centerY), true);
  const vp2 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(centerX + sample / 2, centerY), true);
  const im1 = viewer.viewport.viewportToImageCoordinates(vp1);
  const im2 = viewer.viewport.viewportToImageCoordinates(vp2);
  const imageDistance = Math.hypot(im2.x - im1.x, im2.y - im1.y);
  const screenPixels = sample * (window.devicePixelRatio || 1);
  if (!(imageDistance > 0) || !Number.isFinite(imageDistance)) return null;
  return screenPixels / imageDistance;
}

function qualitySummaryText(ratio) {
  if (!(ratio > 0) || !Number.isFinite(ratio)) return 'aguardando renderização';
  if (ratio >= 0.96 && ratio <= 1.08) return '1:1 nativo';
  if (ratio > 1.08) return `${ratio.toFixed(2)}× acima do nativo`;
  return `${ratio.toFixed(2)}× abaixo do nativo`;
}

function currentProfileConfig() {
  if (state.memorySafeMode) {
    return {
      label: MEMORY_SAFE_CONFIG.label,
      jobLimit: MEMORY_SAFE_CONFIG.jobLimit,
      preload: false,
      tileCacheCount: MEMORY_SAFE_CONFIG.tileCacheCount,
      effectiveKey: 'performance',
    };
  }
  if (state.performanceProfile === 'auto') {
    const benchmark = state.deviceBenchmark;
    const tier = adaptiveTierConfig();
    return {
      label: `Automático · ${tier.label}`,
      jobLimit: benchmark?.jobLimit ?? tier.jobLimit,
      preload: benchmark?.preload ?? tier.preload,
      tileCacheCount: benchmark?.tileCacheCount ?? tier.tileCacheCount,
      effectiveKey: benchmark?.recommendedProfile ?? tier.recommendedProfile,
    };
  }
  const manual = { ...PERFORMANCE_PROFILES[state.performanceProfile], effectiveKey: state.performanceProfile };
  if (detectMobileDevice()) {
    manual.jobLimit = Math.min(manual.jobLimit, 4);
    manual.preload = false;
    manual.tileCacheCount = Math.min(manual.tileCacheCount, 96);
  }
  return manual;
}

function currentSlideInfo() {
  const slide = state.slides[0];
  if (!slide || !slide.levelDimensions?.length) return null;
  const ratio = screenPixelsPerImagePixel();
  const targetDownsample = ratio && ratio > 0 ? 1 / ratio : 1;
  const baseWidth = slide.levelDimensions[0].width || 1;
  let levelIndex = 0;
  let levelDownsample = 1;
  for (let i = 0; i < slide.levelDimensions.length; i += 1) {
    const dim = slide.levelDimensions[i];
    const ds = baseWidth / dim.width;
    if (ds <= targetDownsample + 1e-9) {
      levelIndex = i;
      levelDownsample = ds;
    } else {
      break;
    }
  }
  return {
    ratio,
    targetDownsample,
    levelIndex,
    levelDownsample,
    levelDimensions: slide.levelDimensions[levelIndex],
    isLevelZero: levelIndex === 0,
  };
}

function updateQualityInfo() {
  if (!hasOpenSlide()) {
    ui.metaQuality.textContent = '—';
    ui.qualityHint.textContent = 'Sem lâmina aberta.';
    ui.qualityBadge.hidden = true;
    return;
  }
  const info = currentSlideInfo();
  const ratio = info?.ratio;
  const parts = [qualitySummaryText(ratio), state.highDefinition ? 'HD' : 'padrão'];
  if (state.pixelPerfect) parts.push('pixel 1:1');
  if (state.sharpness > 0) parts.push(`nitidez ${state.sharpness}%`);
  if (info?.isLevelZero) parts.push('Level 0');
  ui.metaQuality.textContent = parts.join(' · ');
  ui.metaQuality.title = ui.metaQuality.textContent;
  ui.qualityHint.textContent = `Renderização atual: ${qualitySummaryText(ratio)}. Perfil ${currentProfileConfig().label} · DPR ${(window.devicePixelRatio || 1).toFixed(2)}.`;
  const profileShort = state.performanceProfile === 'auto' ? 'AUTO' : state.performanceProfile === 'quality' ? 'HQ' : state.performanceProfile === 'performance' ? 'PERF' : 'EQ';
  const levelShort = info ? `L${info.levelIndex}` : 'L?';
  const ratioShort = ratio >= 0.96 && ratio <= 1.08 ? '1:1' : (ratio > 1.08 ? `${ratio.toFixed(1)}×` : `${ratio?.toFixed?.(2) || '?'}×`);
  ui.qualityBadge.textContent = `${profileShort} · ${levelShort} · ${ratioShort}`;
  ui.qualityBadge.hidden = false;
}

function formatMicronsDetailed(value) {
  if (!(value > 0) || !Number.isFinite(value)) return '—';
  if (value >= 1000) return `${(value / 1000).toFixed(3)} mm/px`;
  return `${value.toFixed(3)} µm/px`;
}

function updateDiagnostics() {
  const benchmark = state.deviceBenchmark;
  const logical = benchmark?.logical ?? navigator.hardwareConcurrency ?? '?';
  const memory = benchmark?.memory ?? navigator.deviceMemory ?? null;
  const tier = adaptiveTierConfig();
  const cfg = currentProfileConfig();
  const engineSettings = engineSettingsForCurrentMode();
  const cacheMB = Math.round((state.engineBrokerCacheBytes || engineSettings.brokerCacheBytes) / (1024 * 1024));
  const recommendedWorkers = state.engineWorkerCount || engineSettings.workerCount;
  const compareActive = hasCompareSlide();
  const cacheFloor = state.memorySafeMode ? 8 : 48;
  const cacheCount = Math.max(cacheFloor, Math.round((cfg.tileCacheCount || 160) * (compareActive ? 0.65 : 1)));
  const baseJobLimit = Math.max(state.memorySafeMode ? 1 : 2, Math.round((cfg.jobLimit || 6) * (compareActive ? 0.68 : 1)));
  const activeJobLimit = Math.max(state.memorySafeMode ? 1 : 2, Math.round(baseJobLimit * state.runtimeThrottle));
  const preload = !state.memorySafeMode && !detectMobileDevice() && (cfg.preload || state.highDefinition) && !(compareActive && tier.label === 'Leve');
  let cachedTiles = 0;
  try { cachedTiles += Number(viewer.tileCache?.numTilesLoaded?.() || 0); } catch (_) {}
  try { if (compareActive) cachedTiles += Number(compareViewer.tileCache?.numTilesLoaded?.() || 0); } catch (_) {}

  if (ui.diagDevice) {
    ui.diagDevice.textContent = `${logical} threads${memory ? ` · ${memory} GB RAM estimada` : ''}${benchmark?.mobile ? ' · móvel' : benchmark?.lowPower ? ' · low power' : detectChromebook() ? ' · Chromebook' : ''}`;
  }
  if (ui.diagBenchmark) {
    ui.diagBenchmark.textContent = benchmark ? `${benchmark.cpuMs.toFixed(1)} ms · score ${benchmark.score.toFixed(1)}` : 'aguardando avaliação';
  }
  if (ui.diagAdaptiveProfile) {
    const effective = effectiveProfileKey();
    const effectiveLabel = PERFORMANCE_PROFILES[effective]?.label || effective;
    ui.diagAdaptiveProfile.textContent = state.performanceProfile === 'auto'
      ? `${tier.label} → ${effectiveLabel}`
      : `Manual · ${PERFORMANCE_PROFILES[state.performanceProfile]?.label || state.performanceProfile}`;
  }
  if (ui.diagWorkers) {
    const activeWorkers = state.engineWorkerCount;
    if (state.ready && activeWorkers && activeWorkers !== engineSettings.workerCount) {
      ui.diagWorkers.textContent = `${activeWorkers} ativos · ${engineSettings.workerCount} recomendados · broker ${cacheMB} MB · ${state.mobileWasmStatus}`;
    } else {
      ui.diagWorkers.textContent = `${recommendedWorkers} · broker ${cacheMB} MB · ${state.mobileWasmStatus}${state.ready ? ' · motor ativo' : ' · recomendado'}`;
    }
  }
  if (ui.diagMemoryMode) {
    ui.diagMemoryMode.textContent = state.memorySafeMode
      ? `Seguro · ${memorySafeReason()}`
      : 'Normal';
  }
  if (ui.memorySafeToggle) ui.memorySafeToggle.checked = state.memorySafeMode;
  updateStartupDiagnostics();

  if (!hasOpenSlide()) {
    ui.diagLevel.textContent = '—';
    ui.diagEffectiveRes.textContent = '—';
    ui.diagCurrentMpp.textContent = '—';
    ui.diagApproxMag.textContent = '—';
    ui.diagTiles.textContent = '—';
    ui.diagCache.textContent = `${cfg.label} · cache ${cachedTiles}/${cacheCount}${compareActive ? '×2' : ''} · fila ${activeJobLimit} · preload ${preload ? 'ativo' : 'off'}${state.firstViewMs != null ? ` · 1ª imagem ${(state.firstViewMs/1000).toFixed(1)} s` : ''}`;
    return;
  }

  const info = currentSlideInfo();
  const levelText = info ? `Level ${info.levelIndex}${info.isLevelZero ? ' · nativo' : ''}` : '—';
  ui.diagLevel.textContent = levelText;
  ui.diagEffectiveRes.textContent = info?.levelDimensions ? `${info.levelDimensions.width.toLocaleString('pt-BR')} × ${info.levelDimensions.height.toLocaleString('pt-BR')} px` : '—';
  const ratio = info?.ratio;
  const effMppX = state.mppX && ratio ? state.mppX / ratio : null;
  const effMppY = state.mppY && ratio ? state.mppY / ratio : effMppX;
  ui.diagCurrentMpp.textContent = effMppX ? `${formatMicronsDetailed(effMppX)}${effMppY && Math.abs(effMppY - effMppX) > 1e-6 ? ` × ${formatMicronsDetailed(effMppY)}` : ''}` : 'não informado';
  ui.diagApproxMag.textContent = state.objectivePower && ratio ? `${(state.objectivePower * ratio).toFixed((state.objectivePower * ratio) >= 10 ? 1 : 2)}× aprox.` : 'não informado';
  const currentDziMaxLevel = state.generators[0]?.levelCount ? state.generators[0].levelCount - 1 : null;
  const currentDziLevel = currentDziMaxLevel !== null && info ? Math.max(0, currentDziMaxLevel - info.levelIndex) : null;
  const tileCountCurrent = currentDziLevel !== null ? (state.tileLevelCounts[currentDziLevel] || 0) : 0;
  ui.diagTiles.textContent = `ok ${state.tileLoadedCount} · falhas ${state.tileFailedCount} · abortos ${state.tileAbortedCount}${currentDziLevel !== null ? ` · nível ${tileCountCurrent}` : ''}`;
  ui.diagCache.textContent = `${cfg.label} · cache ${cachedTiles}/${cacheCount}${compareActive ? '×2' : ''} · fila ${activeJobLimit} · preload ${preload ? 'ativo' : 'off'}${compareActive ? ' · compare' : ''}`;
}

function updateStartupDiagnostics() {
  if (!ui.startupDiagDialog) return;
  const benchmark = state.deviceBenchmark;
  const logical = benchmark?.logical ?? navigator.hardwareConcurrency ?? '?';
  const memory = benchmark?.memory ?? navigator.deviceMemory ?? null;
  const cfg = currentProfileConfig();
  const engine = engineSettingsForCurrentMode();
  const cacheFloor = state.memorySafeMode ? 8 : 48;
  const cacheCount = Math.max(cacheFloor, Math.round(cfg.tileCacheCount || 160));
  const profileKey = effectiveProfileKey();
  const profileLabel = PERFORMANCE_PROFILES[profileKey]?.label || profileKey;
  const compatibilityProblem = getCompatibilityProblem();
  const mobile = benchmark?.mobile ?? detectMobileDevice();

  if (ui.startupDiagDevice) {
    ui.startupDiagDevice.textContent = `${logical} threads${memory ? ` · ${memory} GB reportados` : ' · RAM não informada'}${mobile ? ' · móvel/tablet' : ''}`;
  }
  if (ui.startupDiagBenchmark) {
    ui.startupDiagBenchmark.textContent = benchmark
      ? `${benchmark.cpuMs.toFixed(1)} ms · score ${benchmark.score.toFixed(1)}`
      : 'aguardando avaliação';
  }
  if (ui.startupDiagProfile) {
    ui.startupDiagProfile.textContent = state.memorySafeMode
      ? `Mobile Safe → ${profileLabel}`
      : state.performanceProfile === 'auto'
        ? `${adaptiveTierConfig().label} → ${profileLabel}`
        : `Manual · ${PERFORMANCE_PROFILES[state.performanceProfile]?.label || state.performanceProfile}`;
  }
  if (ui.startupDiagWorkers) {
    ui.startupDiagWorkers.textContent = `${engine.workerCount} · broker ${Math.round(engine.brokerCacheBytes / (1024 * 1024))} MB · bloco ${Math.round((engine.blockSize || 1024 * 1024) / 1024)} KiB`;
  }
  if (ui.startupDiagCache) {
    ui.startupDiagCache.textContent = `${cacheCount} tiles · fila ${cfg.jobLimit} · preload ${state.memorySafeMode ? 'off' : (cfg.preload ? 'ativo' : 'off')}`;
  }
  if (ui.startupDiagMemory) {
    ui.startupDiagMemory.textContent = state.memorySafeMode ? `Seguro · ${memorySafeReason()}` : 'Normal';
  }
  if (ui.startupDiagEngine) {
    const tileSize = (mobile || state.memorySafeMode) ? MOBILE_DZI_TILE_SIZE : DESKTOP_DZI_TILE_SIZE;
    ui.startupDiagEngine.textContent = `${state.mobileWasmStatus} · tiles ${tileSize}px`;
  }
  if (ui.startupDiagCompat) {
    ui.startupDiagCompat.textContent = compatibilityProblem || 'HTTPS / isolamento / WASM disponíveis';
  }
  if (ui.startupDiagPhase) ui.startupDiagPhase.textContent = state.startupPhase || '—';
  if (ui.startupDiagError) {
    ui.startupDiagError.textContent = state.lastEngineError || '—';
    ui.startupDiagError.title = state.lastEngineError || '';
  }
  if (ui.startupDiagWasmProbe) ui.startupDiagWasmProbe.textContent = wasmProbeText();
  if (ui.startupPerfProfileSelect) ui.startupPerfProfileSelect.value = state.performanceProfile;
  if (ui.startupSafeModeToggle) ui.startupSafeModeToggle.checked = state.memorySafeMode;

  if (ui.startupSafetyNotice) {
    if (state.memorySafeMode) {
      ui.startupSafetyNotice.dataset.state = 'safe';
      ui.startupSafetyNotice.textContent = 'Proteção móvel otimizada. Usa 1 worker, I/O compartilhado com blocos de 1 MiB, cache de 24 MiB, tiles de 254 px e renderização direta para reduzir a espera inicial.';
    } else if (isLikelyConstrainedDevice()) {
      ui.startupSafetyNotice.dataset.state = 'warning';
      ui.startupSafetyNotice.textContent = 'Este dispositivo parece móvel ou limitado. Recomenda-se manter o Modo seguro ativado antes de abrir a primeira lâmina.';
    } else {
      ui.startupSafetyNotice.dataset.state = '';
      ui.startupSafetyNotice.textContent = 'O dispositivo não apresenta sinais claros de limitação. O perfil automático pode ajustar cache e fila normalmente.';
    }
  }
}

function openStartupDiagnostics() {
  updateStartupDiagnostics();
  if (typeof ui.startupDiagDialog.showModal === 'function') ui.startupDiagDialog.showModal();
  else ui.startupDiagDialog.setAttribute('open', '');
}

function closeStartupDiagnostics() {
  if (!ui.startupDiagDialog) return;
  if (ui.startupDiagDialog.open && typeof ui.startupDiagDialog.close === 'function') ui.startupDiagDialog.close();
  else ui.startupDiagDialog.removeAttribute('open');
}

async function setPerformanceProfileFromUi(value) {
  state.performanceProfile = PERFORMANCE_PROFILES[value] ? value : 'auto';
  if (ui.perfProfileSelect) ui.perfProfileSelect.value = state.performanceProfile;
  if (ui.startupPerfProfileSelect) ui.startupPerfProfileSelect.value = state.performanceProfile;
  if (state.performanceProfile === 'auto' && !state.deviceBenchmark) {
    try { await runDeviceBenchmark(false); } catch (_) {}
  }
  if (hasOpenSlide()) markProjectDirty();
  applyPerformanceProfile();
  applyQualityModeSettings();
  savePreferences();
  if (hasOpenSlide()) commitHistory();
  updateStartupDiagnostics();
}

async function rerunBenchmarkAction(button) {
  if (button) button.disabled = true;
  if (ui.rerunBenchmarkBtn && ui.rerunBenchmarkBtn !== button) ui.rerunBenchmarkBtn.disabled = true;
  if (ui.startupRerunBenchmarkBtn && ui.startupRerunBenchmarkBtn !== button) ui.startupRerunBenchmarkBtn.disabled = true;
  showToast('Avaliando desempenho do dispositivo…', 'info');
  try {
    const result = await runDeviceBenchmark(true);
    applyPerformanceProfile(true);
    const profile = state.memorySafeMode ? MEMORY_SAFE_CONFIG.label : (PERFORMANCE_PROFILES[result.recommendedProfile]?.label || result.recommendedProfile);
    if (state.ready && state.engineWorkerCount && state.engineWorkerCount !== engineSettingsForCurrentMode().workerCount) {
      showToast(`Perfil sugerido: ${profile} · workers na próxima inicialização`, 'success');
      setStatus(`Benchmark concluído · fila/cache ajustados agora · ${engineSettingsForCurrentMode().workerCount} worker(s) recomendados ao reiniciar`);
    } else {
      showToast(`Perfil sugerido: ${profile}`, 'success');
      setStatus(`Benchmark concluído · ${state.memorySafeMode ? 'Mobile Safe' : ADAPTIVE_TIERS[result.tier].label} · ${engineSettingsForCurrentMode().workerCount} worker(s)`);
    }
  } catch (error) {
    console.warn('Falha no benchmark:', error);
    showToast('Não foi possível concluir o benchmark', 'error');
  } finally {
    if (ui.rerunBenchmarkBtn) ui.rerunBenchmarkBtn.disabled = false;
    if (ui.startupRerunBenchmarkBtn) ui.startupRerunBenchmarkBtn.disabled = false;
    updateStartupDiagnostics();
  }
}

function applyTileCacheLimit(viewerInstance, count) {
  if (!viewerInstance || !(count > 0)) return;
  try {
    viewerInstance.maxImageCacheCount = count;
    if (viewerInstance.tileCache) viewerInstance.tileCache.maxImageCacheCount = count;
  } catch (_) {}
}

function applyPerformanceProfile(silent = false) {
  ui.perfProfileSelect.value = state.performanceProfile;
  const cfg = currentProfileConfig();
  const tier = adaptiveTierConfig();
  const compareActive = hasCompareSlide();

  let runtimeThrottle = 1;
  if (state.performanceProfile === 'auto') {
    if (state.tileFailedCount >= 3) runtimeThrottle *= 0.82;
    if (compareActive && state.deviceBenchmark?.tier === 'lite') runtimeThrottle *= 0.78;
    else if (compareActive) runtimeThrottle *= 0.9;
  }
  state.runtimeThrottle = Math.max(0.65, runtimeThrottle);

  const minimumJobs = state.memorySafeMode ? 1 : 2;
  const baseJobLimit = Math.max(minimumJobs, Math.round(cfg.jobLimit * (compareActive ? 0.68 : 1)));
  const jobLimit = Math.max(minimumJobs, Math.round(baseJobLimit * state.runtimeThrottle));
  const cacheFloor = state.memorySafeMode ? 8 : 48;
  const cacheCount = Math.max(cacheFloor, Math.round(cfg.tileCacheCount * (compareActive ? 0.65 : 1)));
  const preload = !state.memorySafeMode && !detectMobileDevice() && (cfg.preload || state.highDefinition) && !(compareActive && state.deviceBenchmark?.tier === 'lite');

  if (viewer.imageLoader) viewer.imageLoader.jobLimit = jobLimit;
  if (compareViewer.imageLoader) compareViewer.imageLoader.jobLimit = jobLimit;
  applyTileCacheLimit(viewer, cacheCount);
  applyTileCacheLimit(compareViewer, cacheCount);

  const item = hasOpenSlide() ? viewer.world.getItemAt(0) : null;
  const compareItem = hasCompareSlide() ? compareViewer.world.getItemAt(0) : null;
  try { item?.setPreload?.(preload); } catch (_) {}
  try { compareItem?.setPreload?.(preload); } catch (_) {}

  updateDiagnostics();
  if (!silent && hasOpenSlide()) {
    const label = state.performanceProfile === 'auto' ? `Automático (${tier.label})` : cfg.label;
    setStatus(`Perfil ${label} aplicado.`);
  }
}

function applyQualityModeSettings() {
  const ratio = screenPixelsPerImagePixel();
  const rendering = state.pixelPerfect || (state.highDefinition && ratio && ratio >= 0.96) ? 'pixelated' : 'auto';
  for (const canvas of getViewerCanvases()) {
    canvas.style.imageRendering = rendering;
    canvas.style.filter = `${state.sharpness > 0 ? 'url(#svsSharpenFilter) ' : ''}brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%)`;
  }
  applyPerformanceProfile(true);
}

function applyVisualAdjustments() {
  updateSharpenFilter();
  ui.viewer.style.filter = 'none';
  ui.brightnessRange.value = String(state.brightness);
  ui.contrastRange.value = String(state.contrast);
  ui.saturationRange.value = String(state.saturation);
  ui.sharpnessRange.value = String(state.sharpness);
  ui.brightnessValue.textContent = `${state.brightness}%`;
  ui.contrastValue.textContent = `${state.contrast}%`;
  ui.saturationValue.textContent = `${state.saturation}%`;
  ui.sharpnessValue.textContent = `${state.sharpness}%`;
  ui.highQualityToggle.checked = state.highDefinition;
  ui.pixelPerfectToggle.checked = state.pixelPerfect;
  applyQualityModeSettings();
  updateQualityInfo();
  updateDiagnostics();
}

function goNativePixelZoom() {
  if (!hasOpenSlide()) return;
  const ratio = screenPixelsPerImagePixel();
  if (!(ratio > 0) || !Number.isFinite(ratio)) return;
  const current = viewer.viewport.getZoom(true);
  viewer.viewport.zoomTo(current * (1 / ratio));
  viewer.viewport.applyConstraints();
  state.pixelPerfect = true;
  markProjectDirty();
  applyVisualAdjustments();
  commitHistory();
  setStatus('Zoom ajustado para pixel 1:1.');
}

function applyMaximumQualityPreset() {
  state.highDefinition = true;
  state.pixelPerfect = false;
  state.brightness = 100;
  state.contrast = 110;
  state.saturation = 104;
  state.sharpness = 18;
  markProjectDirty();
  applyVisualAdjustments();
  savePreferences();
  commitHistory();
  setStatus('Preset “Qualidade máxima” aplicado.');
}

function updateZoomText() {
  if (!hasOpenSlide()) {
    ui.zoomText.textContent = 'Zoom —';
    return;
  }
  const current = viewer.viewport.getZoom(true);
  const home = viewer.viewport.getHomeZoom();
  const ratio = home ? current / home : 1;
  ui.zoomText.textContent = `Zoom ${ratio.toFixed(ratio < 10 ? 2 : 1)}×`;
}

function zoomBy(factor) {
  if (!hasOpenSlide()) return;
  viewer.viewport.zoomBy(factor);
  viewer.viewport.applyConstraints();
}

function goHome() {
  if (!hasOpenSlide()) return;
  viewer.viewport.goHome();
}

function formatDistancePixels(distance) {
  if (distance >= 1000) return `${Math.round(distance).toLocaleString('pt-BR')} px`;
  if (distance >= 100) return `${distance.toFixed(0)} px`;
  return `${distance.toFixed(1)} px`;
}

function formatMicrons(value) {
  if (value >= 1000) {
    const mm = value / 1000;
    return `${mm.toFixed(mm >= 10 ? 1 : 2)} mm`;
  }
  if (value >= 100) return `${value.toFixed(0)} µm`;
  if (value >= 10) return `${value.toFixed(1)} µm`;
  return `${value.toFixed(2)} µm`;
}

function measurementDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (state.mppX && state.mppY) {
    const um = Math.hypot(dx * state.mppX, dy * state.mppY);
    return { numeric: um, unit: 'um', label: formatMicrons(um) };
  }
  const px = Math.hypot(dx, dy);
  return { numeric: px, unit: 'px', label: formatDistancePixels(px) };
}

function imagePointToViewerPixel(point) {
  const viewportPoint = viewer.viewport.imageToViewportCoordinates(point.x, point.y);
  return viewer.viewport.pixelFromPoint(viewportPoint, true);
}

function focusImagePoint(point, minHomeFactor = 5) {
  if (!hasOpenSlide() || !point) return;
  const target = viewer.viewport.imageToViewportCoordinates(point.x, point.y);
  const currentZoom = viewer.viewport.getZoom(true);
  const targetZoom = Math.max(currentZoom, viewer.viewport.getHomeZoom() * minHomeFactor);
  viewer.viewport.panTo(target, false);
  viewer.viewport.zoomTo(targetZoom, target, false);
  viewer.viewport.applyConstraints();
}

function focusMeasurement(measurement) {
  if (!measurement?.a || !measurement?.b) return;
  focusImagePoint({
    x: (measurement.a.x + measurement.b.x) / 2,
    y: (measurement.a.y + measurement.b.y) / 2,
  }, 4);
  showToast(`Medição #${measurement.id} centralizada`, 'info');
}

function focusAnnotation(annotation, notify = true) {
  if (!annotation) return;
  if ((annotation.type === 'marker' || annotation.type === 'text') && annotation.point) {
    focusImagePoint(annotation.point, 5);
  } else {
    let points = annotationGeometryPoints(annotation);
    if (annotation.type === 'circle' && annotation.center && annotation.edge) {
      const radius = Math.hypot(annotation.edge.x - annotation.center.x, annotation.edge.y - annotation.center.y);
      points = [
        { x: annotation.center.x - radius, y: annotation.center.y - radius },
        { x: annotation.center.x + radius, y: annotation.center.y + radius },
      ];
    }
    if (points.length >= 2) {
      const xs = points.map((point) => point.x);
      const ys = points.map((point) => point.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const p1 = viewer.viewport.imageToViewportCoordinates(minX, minY);
      const p2 = viewer.viewport.imageToViewportCoordinates(maxX, maxY);
      const width = Math.max(Math.abs(p2.x - p1.x), 0.000001);
      const height = Math.max(Math.abs(p2.y - p1.y), 0.000001);
      const bounds = new OpenSeadragon.Rect(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), width, height);
      viewer.viewport.fitBounds(bounds, true);
      viewer.viewport.zoomBy(0.82);
      viewer.viewport.applyConstraints();
    }
  }
  if (notify) showToast(`${annotation.title || annotationTypeLabel(annotation.type)} centralizada`, 'info');
}

function createSvgElement(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  return el;
}

function renderMeasurements() {
  const width = ui.viewer.clientWidth;
  const height = ui.viewer.clientHeight;
  ui.measurementOverlay.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
  ui.measurementOverlay.replaceChildren();

  if (!hasOpenSlide()) return;

  for (const measurement of state.measurements) {
    const a = imagePointToViewerPixel(measurement.a);
    const b = imagePointToViewerPixel(measurement.b);
    if (![a.x, a.y, b.x, b.y].every(Number.isFinite)) continue;

    const group = createSvgElement('g');
    group.appendChild(createSvgElement('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'measure-line',
    }));
    group.appendChild(createSvgElement('circle', { cx: a.x, cy: a.y, r: 4.5, class: 'measure-dot' }));
    group.appendChild(createSvgElement('circle', { cx: b.x, cy: b.y, r: 4.5, class: 'measure-dot' }));

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const textWidth = Math.max(54, measurement.label.length * 7 + 16);
    group.appendChild(createSvgElement('rect', {
      x: mx - textWidth / 2,
      y: my - 13,
      width: textWidth,
      height: 26,
      rx: 7,
      class: 'measure-label-bg',
    }));
    const text = createSvgElement('text', { x: mx, y: my + 0.5, class: 'measure-label' });
    text.textContent = measurement.label;
    group.appendChild(text);
    ui.measurementOverlay.appendChild(group);
  }

  if (state.measureStart) {
    const p = imagePointToViewerPixel(state.measureStart);
    if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
      ui.measurementOverlay.appendChild(createSvgElement('circle', {
        cx: p.x, cy: p.y, r: 6, class: 'measure-pending',
      }));
    }
  }
}

function renderMeasurementList() {
  ui.measurementList.replaceChildren();
  if (state.measurements.length === 0) {
    const li = document.createElement('li');
    li.className = 'measurement-empty';
    li.textContent = 'Nenhuma medição.';
    ui.measurementList.appendChild(li);
  } else {
    for (const measurement of state.measurements) {
      const li = document.createElement('li');
      li.classList.add('navigable-item');
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `Centralizar medição ${measurement.id}`);
      li.title = 'Clique para centralizar esta medição';
      const value = document.createElement('span');
      value.className = 'measurement-value';
      value.textContent = `#${measurement.id} · ${measurement.label}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'measurement-remove';
      remove.setAttribute('aria-label', `Excluir medição ${measurement.id}`);
      remove.textContent = '×';
      remove.addEventListener('click', (event) => { event.stopPropagation(); removeMeasurement(measurement.id); });
      li.addEventListener('click', () => focusMeasurement(measurement));
      li.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          focusMeasurement(measurement);
        }
      });
      li.append(value, remove);
      ui.measurementList.appendChild(li);
    }
  }
  ui.clearMeasurementsBtn.disabled = !hasOpenSlide() || state.measurements.length === 0;
}

function setMeasureMode(enabled) {
  state.measureMode = Boolean(enabled && hasOpenSlide());
  if (state.measureMode && state.annotationMode) setAnnotationMode(null);
  if (!state.measureMode) state.measureStart = null;
  ui.measureBtn.setAttribute('aria-pressed', String(state.measureMode));
  ui.toolBadge.hidden = !state.measureMode;
  if (state.measureMode) ui.toolBadge.textContent = 'Modo medição · toque em 2 pontos';
  ui.viewerShell.classList.toggle('measure-mode', state.measureMode);
  ui.measureHelp.innerHTML = state.measureMode
    ? 'Modo ativo: marque <strong>dois pontos</strong>. Você pode repetir para criar outras medições.'
    : 'Ative <strong>Medir</strong> e marque dois pontos na lâmina.';
  renderMeasurements();
}

function toggleMeasureMode() {
  setMeasureMode(!state.measureMode);
}

function addMeasurementPoint(imagePoint) {
  if (!state.measureStart) {
    state.measureStart = { x: imagePoint.x, y: imagePoint.y };
    setStatus('Medição: selecione o segundo ponto.');
    renderMeasurements();
    return;
  }

  const a = state.measureStart;
  const b = { x: imagePoint.x, y: imagePoint.y };
  const distance = measurementDistance(a, b);
  state.measurements.push({
    id: state.measurementId++,
    a,
    b,
    label: distance.label,
    value: distance.numeric,
    unit: distance.unit,
  });
  state.measureStart = null;
  markProjectDirty();
  renderMeasurements();
  renderMeasurementList();
  commitHistory();
  setStatus(`Medição registrada: ${distance.label}`);
  showToast(`Medição ${distance.label}`, 'success');
}

function removeMeasurement(id) {
  state.measurements = state.measurements.filter((item) => item.id !== id);
  markProjectDirty();
  renderMeasurements();
  renderMeasurementList();
  commitHistory();
}

function clearMeasurements(updateStatus = true) {
  state.measurements = [];
  state.measureStart = null;
  state.measurementId = 1;
  if (updateStatus) markProjectDirty();
  renderMeasurements();
  renderMeasurementList();
  if (updateStatus) commitHistory();
  if (updateStatus && hasOpenSlide()) setStatus('Medições removidas.');
}


function formatAreaPixels(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} Mpx²`;
  if (value >= 1000) return `${Math.round(value).toLocaleString('pt-BR')} px²`;
  return `${value.toFixed(1)} px²`;
}

function formatAreaMicrons(value) {
  if (value >= 1_000_000) {
    const mm2 = value / 1_000_000;
    return `${mm2.toFixed(mm2 >= 10 ? 1 : 2)} mm²`;
  }
  if (value >= 10_000) return `${Math.round(value).toLocaleString('pt-BR')} µm²`;
  if (value >= 100) return `${value.toFixed(1)} µm²`;
  return `${value.toFixed(2)} µm²`;
}

function polygonArea(points) {
  if (!Array.isArray(points) || points.length < 3) return { value: 0, unit: 'px2', label: '0 px²' };
  let twiceArea = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    twiceArea += (a.x * b.y) - (b.x * a.y);
  }
  const px2 = Math.abs(twiceArea) / 2;
  if (state.mppX && state.mppY) {
    const um2 = px2 * state.mppX * state.mppY;
    return { value: um2, unit: 'um2', label: formatAreaMicrons(um2) };
  }
  return { value: px2, unit: 'px2', label: formatAreaPixels(px2) };
}

const ANNOTATION_TYPE_LABELS = {
  marker: 'Marcador',
  area: 'Área',
  arrow: 'Seta',
  circle: 'Círculo',
  rect: 'Retângulo',
  text: 'Texto',
};

const ANNOTATION_DEFAULT_COLORS = {
  marker: '#ffd166',
  area: '#5bc0eb',
  arrow: '#ff5d73',
  circle: '#6ee7b7',
  rect: '#a78bfa',
  text: '#ffffff',
};

function annotationTypeLabel(type) {
  return ANNOTATION_TYPE_LABELS[type] || 'Anotação';
}

function normalizeAnnotationColor(value, type = 'marker') {
  const fallback = ANNOTATION_DEFAULT_COLORS[type] || '#ffd166';
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value).toLowerCase() : fallback;
}

function annotationColor(annotation) {
  return normalizeAnnotationColor(annotation?.color, annotation?.type || 'marker');
}

function annotationGroup(annotation) {
  const value = String(annotation?.group || '').trim();
  return value || 'Geral';
}

function allAnnotationGroups() {
  const groups = new Set(['Geral']);
  for (const annotation of state.annotations) groups.add(annotationGroup(annotation));
  return [...groups].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function isAnnotationGroupVisible(group) {
  return !state.hiddenAnnotationGroups.includes(String(group || 'Geral'));
}

function setAnnotationGroupVisible(group, visible, { commit = true } = {}) {
  const name = String(group || 'Geral');
  const hidden = new Set(state.hiddenAnnotationGroups);
  if (visible) hidden.delete(name);
  else hidden.add(name);
  state.hiddenAnnotationGroups = [...hidden];
  renderAnnotations();
  renderAnnotationList();
  renderAnnotationGroupFilters();
  markProjectDirty();
  if (commit) commitHistory();
}

function renderAnnotationGroupOptions() {
  if (!ui.annotationGroupOptions) return;
  ui.annotationGroupOptions.replaceChildren();
  for (const group of allAnnotationGroups()) {
    const option = document.createElement('option');
    option.value = group;
    ui.annotationGroupOptions.appendChild(option);
  }
}

function renderAnnotationGroupFilters() {
  if (!ui.annotationGroupFilters) return;
  ui.annotationGroupFilters.replaceChildren();
  const groups = allAnnotationGroups();
  for (const group of groups) {
    const label = document.createElement('label');
    label.className = 'annotation-group-filter';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = isAnnotationGroupVisible(group);
    input.setAttribute('aria-label', `Mostrar grupo ${group}`);
    input.addEventListener('change', () => setAnnotationGroupVisible(group, input.checked));
    const swatch = document.createElement('span');
    swatch.className = 'annotation-group-dot';
    const first = state.annotations.find((annotation) => annotationGroup(annotation) === group);
    swatch.style.background = first ? annotationColor(first) : '#8c95a5';
    const name = document.createElement('span');
    name.textContent = group;
    label.append(input, swatch, name);
    ui.annotationGroupFilters.appendChild(label);
  }
  if (ui.showAllGroupsBtn) ui.showAllGroupsBtn.disabled = !hasOpenSlide() || groups.every((group) => isAnnotationGroupVisible(group));
  if (ui.hideAllGroupsBtn) ui.hideAllGroupsBtn.disabled = !hasOpenSlide() || groups.every((group) => !isAnnotationGroupVisible(group));
  renderAnnotationGroupOptions();
}

function hideOrShowAllAnnotationGroups(visible) {
  const groups = allAnnotationGroups();
  state.hiddenAnnotationGroups = visible ? [] : groups;
  markProjectDirty();
  renderAnnotations();
  renderAnnotationList();
  renderAnnotationGroupFilters();
  commitHistory();
  showToast(visible ? 'Todos os grupos visíveis' : 'Todos os grupos ocultos', 'info');
}

function defaultAnnotationTitle(type) {
  return `${annotationTypeLabel(type)} ${state.annotationId}`;
}

function annotationGeometryPoints(annotation) {
  if (!annotation) return [];
  if (annotation.type === 'marker' || annotation.type === 'text') return annotation.point ? [annotation.point] : [];
  if (annotation.type === 'arrow') return [annotation.start, annotation.end].filter(Boolean);
  if (annotation.type === 'circle' && annotation.center && annotation.edge) return [annotation.center, annotation.edge];
  if (annotation.type === 'rect' && annotation.a && annotation.b) {
    return [
      { x: annotation.a.x, y: annotation.a.y },
      { x: annotation.b.x, y: annotation.a.y },
      { x: annotation.b.x, y: annotation.b.y },
      { x: annotation.a.x, y: annotation.b.y },
    ];
  }
  if (annotation.type === 'area') return Array.isArray(annotation.points) ? annotation.points : [];
  return [];
}

function shapeDraftFromPoints(type, a, b) {
  if (!a || !b) return null;
  if (type === 'arrow') return { type, start: { ...a }, end: { ...b } };
  if (type === 'circle') return { type, center: { ...a }, edge: { ...b } };
  if (type === 'rect') return { type, a: { ...a }, b: { ...b } };
  return null;
}

function addShapePoint(type, imagePoint) {
  if (!state.shapeStart) {
    state.shapeStart = { x: imagePoint.x, y: imagePoint.y };
    ui.toolBadge.textContent = `${annotationTypeLabel(type)} · escolha o segundo ponto`;
    setStatus(`${annotationTypeLabel(type)}: escolha o segundo ponto.`);
    renderAnnotations();
    return;
  }
  const draft = shapeDraftFromPoints(type, state.shapeStart, imagePoint);
  state.shapeStart = null;
  renderAnnotations();
  if (draft) openAnnotationDialog({ draft });
}

function setAnnotationMode(mode) {
  const next = mode && hasOpenSlide() ? mode : null;
  if (next) setMeasureMode(false);
  state.annotationMode = next;
  if (next !== 'area') state.areaDraft = [];
  if (!['arrow', 'circle', 'rect'].includes(next)) state.shapeStart = null;

  ui.markerBtn.setAttribute('aria-pressed', String(next === 'marker'));
  ui.areaBtn.setAttribute('aria-pressed', String(next === 'area'));
  const proButtons = {
    marker: ui.proMarkerBtn,
    arrow: ui.proArrowBtn,
    circle: ui.proCircleBtn,
    rect: ui.proRectBtn,
    text: ui.proTextBtn,
    area: ui.proAreaBtn,
  };
  for (const [tool, button] of Object.entries(proButtons)) {
    button?.setAttribute('aria-pressed', String(next === tool));
  }

  ui.viewerShell.classList.toggle('marker-mode', next === 'marker');
  ui.viewerShell.classList.toggle('area-mode', next === 'area');
  ui.viewerShell.classList.toggle('annotation-draw-mode', Boolean(next && next !== 'marker'));
  ui.toolBadge.hidden = !next;

  const badges = {
    marker: 'Marcador · toque no ponto de interesse',
    area: 'Área · marque 3 ou mais pontos',
    arrow: 'Seta · marque origem e destino',
    circle: 'Círculo · marque centro e raio',
    rect: 'Retângulo · marque dois cantos',
    text: 'Texto · toque onde o texto deve aparecer',
  };
  if (next) ui.toolBadge.textContent = badges[next] || 'Ferramenta de anotação ativa';

  const help = {
    marker: 'Toque em um ponto para criar um <strong>marcador</strong>.',
    area: 'Marque <strong>3 ou mais pontos</strong> e finalize a área.',
    arrow: 'Marque <strong>dois pontos</strong>: origem e destino da seta.',
    circle: 'Marque o <strong>centro</strong> e depois um ponto da borda.',
    rect: 'Marque <strong>dois cantos opostos</strong> do retângulo.',
    text: 'Toque na lâmina e digite o <strong>texto livre</strong>.',
  };
  ui.annotationHelp.innerHTML = next ? help[next] : 'Escolha uma ferramenta e toque na lâmina.';
  ui.finishAreaBtn.disabled = next !== 'area' || state.areaDraft.length < 3;
  ui.cancelAreaBtn.disabled = next !== 'area' || state.areaDraft.length === 0;
  renderAnnotations();
}

function toggleAnnotationMode(mode) {
  setAnnotationMode(state.annotationMode === mode ? null : mode);
}

function annotationById(id) {
  return state.annotations.find((item) => Number(item.id) === Number(id)) || null;
}

function normalizeLessonSequence() {
  const seen = new Set();
  state.lessonSequence = (Array.isArray(state.lessonSequence) ? state.lessonSequence : [])
    .map(Number)
    .filter((id) => Number.isFinite(id) && annotationById(id) && !seen.has(id) && seen.add(id));
}

function lessonStepNumber(annotationId) {
  const index = state.lessonSequence.findIndex((id) => Number(id) === Number(annotationId));
  return index >= 0 ? index + 1 : null;
}

function renderLessonPanel() {
  normalizeLessonSequence();
  if (!ui.lessonCountBadge) return;
  const count = state.lessonSequence.length;
  ui.lessonCountBadge.textContent = `${count} ${count === 1 ? 'etapa' : 'etapas'}`;
  if (document.activeElement !== ui.lessonTitleInput) ui.lessonTitleInput.value = state.lessonTitle || '';
  ui.prepareLessonBtn.disabled = !hasOpenSlide();
  ui.prepareLessonBtn.setAttribute('aria-pressed', String(state.lessonPreparing));
  ui.prepareLessonBtn.textContent = state.lessonPreparing ? 'Concluir' : 'Preparar';
  ui.lessonEditor.hidden = !state.lessonPreparing;
  ui.presentLessonBtn.disabled = !hasOpenSlide() || count === 0;
  ui.clearLessonBtn.disabled = count === 0;

  ui.lessonAnnotationSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = state.annotations.length ? 'Escolher anotação…' : 'Crie uma anotação primeiro';
  ui.lessonAnnotationSelect.appendChild(placeholder);
  for (const annotation of state.annotations) {
    if (state.lessonSequence.includes(Number(annotation.id))) continue;
    const option = document.createElement('option');
    option.value = String(annotation.id);
    option.textContent = annotation.title || `${annotationTypeLabel(annotation.type)} ${annotation.id}`;
    ui.lessonAnnotationSelect.appendChild(option);
  }
  ui.lessonAnnotationSelect.disabled = ui.lessonAnnotationSelect.options.length <= 1;
  ui.addLessonStepBtn.disabled = true;

  ui.lessonSequenceList.replaceChildren();
  if (count === 0) {
    const empty = document.createElement('li');
    empty.className = 'lesson-sequence-empty';
    empty.textContent = state.lessonPreparing ? 'Adicione anotações à sequência.' : 'Nenhuma etapa preparada.';
    ui.lessonSequenceList.appendChild(empty);
    return;
  }

  state.lessonSequence.forEach((id, index) => {
    const annotation = annotationById(id);
    if (!annotation) return;
    const li = document.createElement('li');
    li.className = 'lesson-sequence-item';
    const number = document.createElement('span');
    number.className = 'lesson-step-number';
    number.textContent = String(index + 1);
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'lesson-step-copy';
    copy.innerHTML = `<strong>${escapeHtml(annotation.title || `Etapa ${index + 1}`)}</strong><small>${escapeHtml(annotationSummary(annotation))}</small>`;
    copy.addEventListener('click', () => focusAnnotation(annotation));
    const controls = document.createElement('span');
    controls.className = 'lesson-step-controls';
    const up = document.createElement('button');
    up.type = 'button';
    up.textContent = '↑';
    up.title = 'Mover para cima';
    up.disabled = index === 0;
    up.addEventListener('click', () => moveLessonStep(id, -1));
    const down = document.createElement('button');
    down.type = 'button';
    down.textContent = '↓';
    down.title = 'Mover para baixo';
    down.disabled = index === count - 1;
    down.addEventListener('click', () => moveLessonStep(id, 1));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.title = 'Remover da aula';
    remove.addEventListener('click', () => removeLessonStep(id));
    controls.append(up, down, remove);
    li.append(number, copy, controls);
    ui.lessonSequenceList.appendChild(li);
  });
}

function setLessonPreparing(enabled) {
  state.lessonPreparing = Boolean(enabled && hasOpenSlide());
  if (state.lessonPreparing) {
    setActivePanel('panel-notes');
    if (window.innerWidth <= 760) openSidebar();
    showToast('Modo de preparação ativado', 'info');
  }
  renderLessonPanel();
  renderAnnotations();
}

function addAnnotationToLesson(annotationId, { silent = false, commit = true } = {}) {
  const id = Number(annotationId);
  if (!annotationById(id)) return false;
  normalizeLessonSequence();
  if (state.lessonSequence.includes(id)) return false;
  state.lessonSequence.push(id);
  markProjectDirty();
  renderLessonPanel();
  renderAnnotationList();
  renderAnnotations();
  if (commit) commitHistory();
  if (!silent) showToast(`Etapa ${state.lessonSequence.length} adicionada`, 'success');
  return true;
}

function removeLessonStep(annotationId) {
  const id = Number(annotationId);
  state.lessonSequence = state.lessonSequence.filter((value) => Number(value) !== id);
  markProjectDirty();
  renderLessonPanel();
  renderAnnotationList();
  renderAnnotations();
  commitHistory();
}

function moveLessonStep(annotationId, delta) {
  const id = Number(annotationId);
  const index = state.lessonSequence.findIndex((value) => Number(value) === id);
  const next = index + Number(delta || 0);
  if (index < 0 || next < 0 || next >= state.lessonSequence.length) return;
  [state.lessonSequence[index], state.lessonSequence[next]] = [state.lessonSequence[next], state.lessonSequence[index]];
  markProjectDirty();
  renderLessonPanel();
  renderAnnotationList();
  renderAnnotations();
  commitHistory();
}

function clearLessonSequence() {
  if (!state.lessonSequence.length) return;
  if (!window.confirm('Limpar toda a sequência do Modo Aula?')) return;
  state.lessonSequence = [];
  markProjectDirty();
  renderLessonPanel();
  renderAnnotationList();
  renderAnnotations();
  commitHistory();
  showToast('Sequência da aula removida', 'info');
}

function currentLessonAnnotation() {
  normalizeLessonSequence();
  const id = state.lessonSequence[state.lessonIndex];
  return annotationById(id);
}

function updateLessonPresentationBar() {
  if (!ui.lessonPresentationBar) return;
  const count = state.lessonSequence.length;
  const annotation = currentLessonAnnotation();
  ui.lessonPresentationBar.hidden = !state.lessonPresenting;
  if (!state.lessonPresenting || !annotation) return;
  ui.lessonPresentationTitle.textContent = state.lessonTitle.trim() || state.currentFile?.name?.replace(/\.svs$/i, '') || 'Modo Aula';
  ui.lessonCounter.textContent = `${state.lessonIndex + 1} / ${count}`;
  ui.lessonStepTitle.textContent = annotation.title || `Etapa ${state.lessonIndex + 1}`;
  const note = String(annotation.note || '').trim();
  ui.lessonStepNote.textContent = note;
  ui.lessonStepNote.hidden = !note;
  ui.lessonPrevBtn.disabled = state.lessonIndex <= 0;
  ui.lessonNextBtn.disabled = state.lessonIndex >= count - 1;
  ui.lessonNextBtn.title = state.lessonIndex >= count - 1 ? 'Fim da sequência' : 'Próxima etapa';
}

function goToLessonStep(index) {
  normalizeLessonSequence();
  if (!state.lessonSequence.length) return;
  state.lessonIndex = Math.min(state.lessonSequence.length - 1, Math.max(0, Number(index) || 0));
  const annotation = currentLessonAnnotation();
  if (!annotation) return;
  renderAnnotations();
  focusAnnotation(annotation, false);
  updateLessonPresentationBar();
  setStatus(`Modo Aula · etapa ${state.lessonIndex + 1} de ${state.lessonSequence.length}`);
}

function startLessonPresentation() {
  normalizeLessonSequence();
  if (!hasOpenSlide() || !state.lessonSequence.length) {
    showToast('Adicione pelo menos uma anotação à aula', 'info');
    return;
  }
  state.lessonPreparing = false;
  state.lessonPresenting = true;
  state.lessonIndex = 0;
  hideLibrary();
  setMeasureMode(false);
  setAnnotationMode(null);
  setPresentationMode(true, false);
  renderLessonPanel();
  goToLessonStep(0);
  showToast('Modo Aula iniciado · use ← e →', 'success');
}

function stopLessonPresentation() {
  const wasActive = state.lessonPresenting;
  state.lessonPresenting = false;
  if (ui.lessonPresentationBar) ui.lessonPresentationBar.hidden = true;
  if (state.presentationMode) setPresentationMode(false, false);
  if (wasActive) {
    setStatus('Modo Aula encerrado');
    showToast('Modo Aula encerrado', 'info');
  }
}

function openLessonSetup() {
  if (!hasOpenSlide()) {
    showToast('Abra uma lâmina para preparar uma aula', 'info');
    return;
  }
  closeMoreMenu();
  setActivePanel('panel-notes');
  setLessonPreparing(true);
  if (window.innerWidth <= 760) openSidebar();
  else setSidebarCollapsed(false);
}

function openAnnotationDialog({ point = null, annotation = null, draft = null } = {}) {
  if (!hasOpenSlide()) return;
  const pendingDraft = draft || (point ? { type: 'marker', point: { x: point.x, y: point.y } } : null);
  state.pendingAnnotationDraft = pendingDraft ? cloneData(pendingDraft) : null;
  state.pendingMarkerPoint = pendingDraft?.type === 'marker' && pendingDraft.point ? { ...pendingDraft.point } : null;
  state.editingAnnotationId = annotation?.id ?? null;
  const type = annotation?.type || pendingDraft?.type || 'marker';
  ui.annotationDialogTitle.textContent = annotation ? `Editar ${annotationTypeLabel(type).toLowerCase()}` : `Novo ${annotationTypeLabel(type).toLowerCase()}`;
  ui.annotationTitleInput.value = annotation?.title || defaultAnnotationTitle(type);
  ui.annotationNoteInput.value = annotation?.note || '';
  ui.annotationTextRow.hidden = type !== 'text';
  ui.annotationTextInput.value = annotation?.text || (type === 'text' ? annotation?.title || '' : '');
  ui.annotationColorInput.value = annotationColor(annotation || { type, color: ANNOTATION_DEFAULT_COLORS[type] });
  ui.annotationGroupInput.value = annotation ? annotationGroup(annotation) : 'Geral';
  renderAnnotationGroupOptions();
  if (typeof ui.annotationDialog.showModal === 'function') ui.annotationDialog.showModal();
  else ui.annotationDialog.setAttribute('open', '');
  window.setTimeout(() => (type === 'text' ? ui.annotationTextInput : ui.annotationTitleInput).focus(), 0);
}

function closeAnnotationDialog() {
  state.pendingMarkerPoint = null;
  state.pendingAnnotationDraft = null;
  state.editingAnnotationId = null;
  if (ui.annotationDialog.open && typeof ui.annotationDialog.close === 'function') ui.annotationDialog.close();
  else ui.annotationDialog.removeAttribute('open');
}

function saveAnnotationFromDialog(event) {
  event.preventDefault();
  const editing = state.editingAnnotationId !== null ? annotationById(state.editingAnnotationId) : null;
  const draft = state.pendingAnnotationDraft;
  const type = editing?.type || draft?.type || 'marker';
  const title = ui.annotationTitleInput.value.trim() || defaultAnnotationTitle(type);
  const note = ui.annotationNoteInput.value.trim();
  const color = normalizeAnnotationColor(ui.annotationColorInput.value, type);
  const group = ui.annotationGroupInput.value.trim() || 'Geral';
  const visibleText = type === 'text' ? (ui.annotationTextInput.value.trim() || title) : undefined;

  if (editing) {
    editing.title = title;
    editing.note = note;
    editing.color = color;
    editing.group = group;
    if (type === 'text') editing.text = visibleText;
    markProjectDirty();
    renderAnnotations();
    renderAnnotationList();
    renderAnnotationGroupFilters();
    renderLessonPanel();
    commitHistory();
    setStatus(`Anotação atualizada: ${title}`);
    showToast('Anotação atualizada', 'success');
    closeAnnotationDialog();
    return;
  }

  if (!draft) return;
  const created = {
    id: state.annotationId++,
    ...cloneData(draft),
    title,
    note,
    color,
    group,
  };
  if (type === 'text') created.text = visibleText;
  state.annotations.push(created);
  if (state.lessonPreparing) addAnnotationToLesson(created.id, { silent: true, commit: false });
  markProjectDirty();
  renderAnnotations();
  renderAnnotationList();
  renderAnnotationGroupFilters();
  renderLessonPanel();
  commitHistory();
  setStatus(`${annotationTypeLabel(type)} registrado: ${title}`);
  showToast(state.lessonPreparing ? 'Anotação salva e adicionada à aula' : `${annotationTypeLabel(type)} salvo`, 'success');
  closeAnnotationDialog();
}

function addAreaPoint(imagePoint) {
  state.areaDraft.push({ x: imagePoint.x, y: imagePoint.y });
  ui.finishAreaBtn.disabled = state.areaDraft.length < 3;
  ui.cancelAreaBtn.disabled = false;
  if (state.areaDraft.length >= 3) ui.toolBadge.textContent = 'Área pronta · finalize no painel';
  setStatus(`Área: ${state.areaDraft.length} ponto(s). ${state.areaDraft.length >= 3 ? 'Você já pode finalizar.' : ''}`);
  renderAnnotations();
}

function finishArea() {
  if (state.areaDraft.length < 3) return;
  const points = state.areaDraft.map((point) => ({ ...point }));
  const area = polygonArea(points);
  const created = {
    id: state.annotationId++,
    type: 'area',
    points,
    title: `Área ${state.annotationId - 1}`,
    note: '',
    color: ANNOTATION_DEFAULT_COLORS.area,
    group: 'Geral',
    areaValue: area.value,
    areaUnit: area.unit,
    areaLabel: area.label,
  };
  state.annotations.push(created);
  if (state.lessonPreparing) addAnnotationToLesson(created.id, { silent: true, commit: false });
  state.areaDraft = [];
  markProjectDirty();
  ui.finishAreaBtn.disabled = true;
  ui.cancelAreaBtn.disabled = true;
  renderAnnotations();
  renderAnnotationList();
  renderAnnotationGroupFilters();
  renderLessonPanel();
  commitHistory();
  setStatus(`Área registrada: ${area.label}`);
  showToast(state.lessonPreparing ? 'Área salva e adicionada à aula' : 'Área salva', 'success');
}

function cancelAreaDraft() {
  state.areaDraft = [];
  ui.finishAreaBtn.disabled = true;
  ui.cancelAreaBtn.disabled = true;
  renderAnnotations();
  if (hasOpenSlide()) setStatus('Desenho de área cancelado.');
}

function annotationLabel(group, point, textValue, color = '#ffffff', classPrefix = 'annotation') {
  const textValueSafe = String(textValue || '').slice(0, 90);
  const width = Math.max(58, Math.min(280, textValueSafe.length * 6.7 + 18));
  group.appendChild(createSvgElement('rect', {
    x: point.x - width / 2,
    y: point.y - 31,
    width,
    height: 23,
    rx: 7,
    class: `${classPrefix}-label-bg`,
    stroke: color,
  }));
  const label = createSvgElement('text', { x: point.x, y: point.y - 19.5, class: `${classPrefix}-label`, fill: '#ffffff' });
  label.textContent = textValueSafe;
  group.appendChild(label);
}

function annotationTextBox(group, point, textValue, color) {
  const value = String(textValue || '').slice(0, 160);
  const lines = value.match(/.{1,34}(?:\s|$)|\S+$/g)?.map((line) => line.trim()).filter(Boolean) || [value];
  const maxLen = Math.max(...lines.map((line) => line.length), 4);
  const width = Math.min(320, Math.max(74, maxLen * 7.2 + 22));
  const height = Math.max(30, lines.length * 17 + 14);
  group.appendChild(createSvgElement('rect', {
    x: point.x + 10,
    y: point.y - height / 2,
    width,
    height,
    rx: 8,
    class: 'annotation-text-bg',
    stroke: color,
  }));
  const textEl = createSvgElement('text', {
    x: point.x + 21,
    y: point.y - height / 2 + 20,
    class: 'annotation-text-content',
    fill: color,
  });
  lines.slice(0, 5).forEach((line, index) => {
    const span = createSvgElement('tspan', { x: point.x + 21, dy: index === 0 ? 0 : 17 });
    span.textContent = line;
    textEl.appendChild(span);
  });
  group.appendChild(textEl);
  group.appendChild(createSvgElement('circle', { cx: point.x, cy: point.y, r: 3.5, fill: color }));
}

function arrowHeadPoints(start, end, size = 12) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy;
  const py = ux;
  const baseX = end.x - ux * size;
  const baseY = end.y - uy * size;
  return [
    end,
    { x: baseX + px * size * 0.48, y: baseY + py * size * 0.48 },
    { x: baseX - px * size * 0.48, y: baseY - py * size * 0.48 },
  ];
}

function renderShapeStartDraft() {
  if (!state.shapeStart || !['arrow', 'circle', 'rect'].includes(state.annotationMode)) return;
  const p = imagePointToViewerPixel(state.shapeStart);
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
  ui.annotationOverlay.appendChild(createSvgElement('circle', {
    cx: p.x,
    cy: p.y,
    r: 6,
    class: 'annotation-shape-start',
  }));
}

function renderAnnotations() {
  const width = ui.viewer.clientWidth;
  const height = ui.viewer.clientHeight;
  ui.annotationOverlay.setAttribute('viewBox', `0 0 ${Math.max(1, width)} ${Math.max(1, height)}`);
  ui.annotationOverlay.replaceChildren();
  if (!hasOpenSlide()) return;

  for (const annotation of state.annotations) {
    const lessonStep = lessonStepNumber(annotation.id);
    const isCurrentLesson = state.lessonPresenting && lessonStep === state.lessonIndex + 1;
    if (!isAnnotationGroupVisible(annotationGroup(annotation)) && !isCurrentLesson) continue;

    const group = createSvgElement('g');
    const color = annotationColor(annotation);
    group.style.color = color;
    if (isCurrentLesson) group.setAttribute('class', 'lesson-current-annotation');

    if (annotation.type === 'marker' && annotation.point) {
      const p = imagePointToViewerPixel(annotation.point);
      if (![p.x, p.y].every(Number.isFinite)) continue;
      group.appendChild(createSvgElement('circle', { cx: p.x, cy: p.y, r: 12, class: 'annotation-pin-ring', stroke: color, fill: color, 'fill-opacity': '.14' }));
      group.appendChild(createSvgElement('circle', { cx: p.x, cy: p.y, r: 5.5, class: 'annotation-pin', fill: color }));
      const title = annotation.title || `Marcador ${annotation.id}`;
      annotationLabel(group, p, lessonStep ? `${lessonStep}. ${title}` : title, color);
    } else if (annotation.type === 'area' && Array.isArray(annotation.points) && annotation.points.length >= 3) {
      const pixels = annotation.points.map(imagePointToViewerPixel).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
      if (pixels.length < 3) continue;
      group.appendChild(createSvgElement('polygon', {
        points: pixels.map((p) => `${p.x},${p.y}`).join(' '),
        class: 'annotation-area',
        stroke: color,
        fill: color,
        'fill-opacity': '.16',
      }));
      for (const p of pixels) group.appendChild(createSvgElement('circle', { cx: p.x, cy: p.y, r: 3.8, class: 'annotation-vertex', stroke: color }));
      const centroid = pixels.reduce((acc, p) => ({ x: acc.x + p.x / pixels.length, y: acc.y + p.y / pixels.length }), { x: 0, y: 0 });
      const title = annotation.title || `Área ${annotation.id}`;
      const prefix = lessonStep ? `${lessonStep}. ${title}` : title;
      annotationLabel(group, centroid, `${prefix} · ${annotation.areaLabel || polygonArea(annotation.points).label}`, color);
    } else if (annotation.type === 'arrow' && annotation.start && annotation.end) {
      const a = imagePointToViewerPixel(annotation.start);
      const b = imagePointToViewerPixel(annotation.end);
      if (![a.x, a.y, b.x, b.y].every(Number.isFinite)) continue;
      group.appendChild(createSvgElement('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'annotation-shape-line', stroke: color }));
      const arrow = arrowHeadPoints(a, b);
      group.appendChild(createSvgElement('polygon', { points: arrow.map((p) => `${p.x},${p.y}`).join(' '), fill: color, class: 'annotation-arrow-head' }));
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const title = annotation.title || `Seta ${annotation.id}`;
      annotationLabel(group, mid, lessonStep ? `${lessonStep}. ${title}` : title, color);
    } else if (annotation.type === 'circle' && annotation.center && annotation.edge) {
      const c = imagePointToViewerPixel(annotation.center);
      const e = imagePointToViewerPixel(annotation.edge);
      if (![c.x, c.y, e.x, e.y].every(Number.isFinite)) continue;
      const radius = Math.hypot(e.x - c.x, e.y - c.y);
      group.appendChild(createSvgElement('circle', { cx: c.x, cy: c.y, r: radius, class: 'annotation-shape-outline', stroke: color, fill: color, 'fill-opacity': '.08' }));
      const title = annotation.title || `Círculo ${annotation.id}`;
      annotationLabel(group, { x: c.x, y: c.y - radius }, lessonStep ? `${lessonStep}. ${title}` : title, color);
    } else if (annotation.type === 'rect' && annotation.a && annotation.b) {
      const corners = annotationGeometryPoints(annotation).map(imagePointToViewerPixel);
      if (corners.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) continue;
      group.appendChild(createSvgElement('polygon', { points: corners.map((p) => `${p.x},${p.y}`).join(' '), class: 'annotation-shape-outline', stroke: color, fill: color, 'fill-opacity': '.08' }));
      const top = corners.reduce((best, p) => p.y < best.y ? p : best, corners[0]);
      const title = annotation.title || `Retângulo ${annotation.id}`;
      annotationLabel(group, top, lessonStep ? `${lessonStep}. ${title}` : title, color);
    } else if (annotation.type === 'text' && annotation.point) {
      const p = imagePointToViewerPixel(annotation.point);
      if (![p.x, p.y].every(Number.isFinite)) continue;
      const textValue = annotation.text || annotation.title || `Texto ${annotation.id}`;
      annotationTextBox(group, p, lessonStep ? `${lessonStep}. ${textValue}` : textValue, color);
    }
    ui.annotationOverlay.appendChild(group);
  }

  if (state.annotationMode === 'area' && state.areaDraft.length) {
    const pixels = state.areaDraft.map(imagePointToViewerPixel).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
    if (pixels.length) {
      const group = createSvgElement('g');
      if (pixels.length >= 2) group.appendChild(createSvgElement('polyline', { points: pixels.map((p) => `${p.x},${p.y}`).join(' '), class: 'annotation-area-draft' }));
      for (const p of pixels) group.appendChild(createSvgElement('circle', { cx: p.x, cy: p.y, r: 4.5, class: 'annotation-vertex' }));
      ui.annotationOverlay.appendChild(group);
    }
  }
  renderShapeStartDraft();
}

function annotationSummary(annotation) {
  const group = annotationGroup(annotation);
  if (annotation.type === 'area') return `${annotation.areaLabel || polygonArea(annotation.points || []).label} · ${group}`;
  if (annotation.type === 'text') return `${annotation.text || annotation.title || 'Texto'} · ${group}`;
  if (annotation.note) return `${annotation.note} · ${group}`;
  return `${annotationTypeLabel(annotation.type)} · ${group}`;
}

function renderAnnotationList() {
  ui.annotationList.replaceChildren();
  if (state.annotations.length === 0) {
    const li = document.createElement('li');
    li.className = 'measurement-empty';
    li.textContent = 'Nenhuma anotação.';
    ui.annotationList.appendChild(li);
  } else {
    for (const annotation of state.annotations) {
      const li = document.createElement('li');
      li.classList.add('navigable-item');
      if (!isAnnotationGroupVisible(annotationGroup(annotation))) li.classList.add('annotation-item-hidden');
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `Centralizar anotação ${annotation.title || annotation.id}`);
      li.title = 'Clique para centralizar esta anotação';

      const swatch = document.createElement('span');
      swatch.className = 'annotation-color-swatch';
      swatch.style.background = annotationColor(annotation);
      swatch.title = annotationTypeLabel(annotation.type);

      const copy = document.createElement('span');
      copy.className = 'annotation-copy';
      const lessonStep = lessonStepNumber(annotation.id);
      if (lessonStep) {
        const badge = document.createElement('span');
        badge.className = 'annotation-lesson-badge';
        badge.textContent = `Etapa ${lessonStep}`;
        copy.appendChild(badge);
      }
      const title = document.createElement('strong');
      title.textContent = annotation.title || `${annotationTypeLabel(annotation.type)} ${annotation.id}`;
      const detail = document.createElement('small');
      detail.textContent = annotationSummary(annotation);
      copy.append(title, detail);

      const actions = document.createElement('span');
      actions.className = 'annotation-item-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'annotation-edit';
      edit.textContent = '✎';
      edit.setAttribute('aria-label', `Editar anotação ${annotation.id}`);
      edit.addEventListener('click', (event) => { event.stopPropagation(); openAnnotationDialog({ annotation }); });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'annotation-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Excluir anotação ${annotation.id}`);
      remove.addEventListener('click', (event) => { event.stopPropagation(); removeAnnotation(annotation.id); });
      actions.append(edit, remove);
      li.addEventListener('click', () => focusAnnotation(annotation));
      li.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          focusAnnotation(annotation);
        }
      });
      li.append(swatch, copy, actions);
      ui.annotationList.appendChild(li);
    }
  }
  ui.clearAnnotationsBtn.disabled = !hasOpenSlide() || state.annotations.length === 0;
  renderAnnotationGroupFilters();
  renderLessonPanel();
}

function removeAnnotation(id) {
  state.annotations = state.annotations.filter((item) => Number(item.id) !== Number(id));
  state.lessonSequence = state.lessonSequence.filter((value) => Number(value) !== Number(id));
  markProjectDirty();
  renderAnnotations();
  renderAnnotationList();
  renderLessonPanel();
  commitHistory();
}

function clearAnnotations(updateStatus = true) {
  state.annotations = [];
  state.annotationId = 1;
  state.areaDraft = [];
  state.shapeStart = null;
  state.pendingMarkerPoint = null;
  state.pendingAnnotationDraft = null;
  state.editingAnnotationId = null;
  state.hiddenAnnotationGroups = [];
  state.lessonSequence = [];
  state.lessonPreparing = false;
  if (state.lessonPresenting) state.lessonPresenting = false;
  if (ui.lessonPresentationBar) ui.lessonPresentationBar.hidden = true;
  if (updateStatus) markProjectDirty();
  renderAnnotations();
  renderAnnotationList();
  renderAnnotationGroupFilters();
  renderLessonPanel();
  if (updateStatus) commitHistory();
  if (updateStatus && hasOpenSlide()) setStatus('Anotações removidas.');
}

function resetVisualAdjustments(updateStatus = true) {
  state.brightness = 100;
  state.contrast = 100;
  state.saturation = 100;
  state.sharpness = 0;
  state.highDefinition = false;
  state.pixelPerfect = false;
  applyVisualAdjustments();
  savePreferences();
  if (updateStatus) {
    markProjectDirty();
    commitHistory();
  }
  if (updateStatus && hasOpenSlide()) setStatus('Ajustes visuais restaurados.');
}

function projectPayload() {
  const dims = state.slides[0]?.levelDimensions?.[0] || null;
  return {
    schema: 'virtum-svs-annotations',
    schemaVersion: 6,
    appVersion: '0.5.2.1',
    exportedAt: new Date().toISOString(),
    slide: {
      name: state.currentFile?.name || null,
      size: state.currentFile?.size || null,
      width: dims?.width || null,
      height: dims?.height || null,
      mppX: state.mppX,
      mppY: state.mppY,
    },
    view: {
      rotation: state.rotation,
      brightness: state.brightness,
      contrast: state.contrast,
      saturation: state.saturation,
      sharpness: state.sharpness,
      highDefinition: state.highDefinition,
      pixelPerfect: state.pixelPerfect,
      performanceProfile: state.performanceProfile,
      hiddenAnnotationGroups: state.hiddenAnnotationGroups,
    },
    measurements: state.measurements,
    annotations: state.annotations,
    lesson: {
      title: state.lessonTitle,
      sequence: state.lessonSequence,
    },
  };
}

function saveAnnotationsJson() {
  if (!hasOpenSlide()) return;
  const data = JSON.stringify(projectPayload(), null, 2);
  downloadBlob(new Blob([data], { type: 'application/json;charset=utf-8' }), `${sanitizeBaseName(state.currentFile?.name)}_anotacoes.json`);
  saveLocalAutosave();
  state.projectDirty = false;
  setStatus('Projeto de anotações salvo em JSON.');
  showToast('Projeto salvo', 'success');
}

function validateProjectData(data) {
  if (!data || data.schema !== 'virtum-svs-annotations' || !Array.isArray(data.measurements) || !Array.isArray(data.annotations)) {
    throw new Error('Este arquivo não parece ser um projeto de anotações do Virtum SVS Viewer.');
  }
  return data;
}

function applyProjectData(data, { safe = true, resetHistoryAfter = true } = {}) {
  const validated = validateProjectData(data);
  state.measurements = validated.measurements.filter((m) => m && m.a && m.b).map((m) => cloneData(m));
  for (const measurement of state.measurements) {
    const distance = measurementDistance(measurement.a, measurement.b);
    measurement.value = distance.numeric;
    measurement.unit = distance.unit;
    measurement.label = distance.label;
  }
  state.measurementId = Math.max(0, ...state.measurements.map((m) => Number(m.id) || 0)) + 1;
  const allowedAnnotationTypes = new Set(['marker', 'area', 'arrow', 'circle', 'rect', 'text']);
  state.annotations = validated.annotations.filter((a) => a && allowedAnnotationTypes.has(a.type)).map((a) => cloneData(a));
  state.annotationId = Math.max(0, ...state.annotations.map((a) => Number(a.id) || 0)) + 1;
  for (const annotation of state.annotations) {
    annotation.color = annotationColor(annotation);
    annotation.group = annotationGroup(annotation);
    if (annotation.type === 'text' && !annotation.text) annotation.text = annotation.title || 'Texto';
    if (annotation.type === 'area' && Array.isArray(annotation.points)) {
      const area = polygonArea(annotation.points);
      annotation.areaValue = area.value;
      annotation.areaUnit = area.unit;
      annotation.areaLabel = area.label;
    }
  }
  state.measureStart = null;
  state.areaDraft = [];
  state.shapeStart = null;
  state.pendingAnnotationDraft = null;
  state.rotation = Number(validated.view?.rotation) || 0;
  state.brightness = Math.min(160, Math.max(50, Number(validated.view?.brightness) || 100));
  state.contrast = Math.min(180, Math.max(50, Number(validated.view?.contrast) || 100));
  state.saturation = Math.min(150, Math.max(70, Number(validated.view?.saturation) || 100));
  state.sharpness = Math.min(50, Math.max(0, Number(validated.view?.sharpness) || 0));
  state.highDefinition = Boolean(validated.view?.highDefinition);
  state.pixelPerfect = Boolean(validated.view?.pixelPerfect);
  {
    const savedProfile = validated.view?.performanceProfile;
    const legacyBalanced = savedProfile === 'balanced' && validated.appVersion && validated.appVersion !== '0.5.1';
    state.performanceProfile = legacyBalanced ? 'auto' : (PERFORMANCE_PROFILES[savedProfile] ? savedProfile : 'auto');
  }
  state.hiddenAnnotationGroups = Array.isArray(validated.view?.hiddenAnnotationGroups) ? validated.view.hiddenAnnotationGroups.map(String) : [];
  state.lessonTitle = String(validated.lesson?.title || '');
  state.lessonSequence = Array.isArray(validated.lesson?.sequence) ? validated.lesson.sequence.map(Number).filter(Number.isFinite) : [];
  normalizeLessonSequence();
  state.lessonPreparing = false;
  state.lessonPresenting = false;
  state.lessonIndex = 0;
  viewer.viewport.setRotation(state.rotation);
  applyVisualAdjustments();
  renderMeasurementList();
  renderAnnotationList();
  renderAnnotationGroupFilters();
  renderLessonPanel();
  redrawOverlays();
  state.projectDirty = !safe;
  savePreferences();
  if (resetHistoryAfter) resetHistory();
}

async function loadAnnotationsJson(file) {
  if (!hasOpenSlide() || !file) return;
  try {
    const data = validateProjectData(JSON.parse(await file.text()));
    const dims = state.slides[0]?.levelDimensions?.[0];
    const mismatch = data.slide && (
      (data.slide.width && dims?.width && Number(data.slide.width) !== Number(dims.width)) ||
      (data.slide.height && dims?.height && Number(data.slide.height) !== Number(dims.height))
    );
    if (mismatch && !window.confirm('As dimensões do projeto não correspondem à lâmina aberta. Carregar mesmo assim?')) return;
    if ((state.measurements.length || state.annotations.length) && !window.confirm('Carregar este projeto substituirá as medições e anotações atuais desta lâmina. Continuar?')) return;

    flushLocalAutosave();
    applyProjectData(data, { safe: false, resetHistoryAfter: false });
    commitHistory();
    scheduleLocalAutosave();
    setStatus(`Projeto carregado: ${state.measurements.length} medição(ões) e ${state.annotations.length} anotação(ões).`);
    showToast('Projeto carregado', 'success');
  } catch (error) {
    console.error('Falha ao carregar projeto:', error);
    setStatus(`Não foi possível carregar o JSON: ${error?.message || error}`);
    showToast('Falha ao carregar projeto', 'error');
  } finally {
    ui.annotationsFileInput.value = '';
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getPrimaryCanvas() {
  const canvases = [...ui.viewer.querySelectorAll('canvas')]
    .filter((canvas) => !canvas.closest('.navigator') && canvas.width > 0 && canvas.height > 0)
    .sort((a, b) => (b.width * b.height) - (a.width * a.height));
  return viewer.drawer?.canvas instanceof HTMLCanvasElement ? viewer.drawer.canvas : canvases[0];
}

function applySharpenToContext(ctx, width, height, amountPercent) {
  const amount = Math.max(0, Number(amountPercent) || 0) / 100;
  if (!(amount > 0)) return;
  const src = ctx.getImageData(0, 0, width, height);
  const out = ctx.createImageData(width, height);
  const a = Math.min(0.5, amount * 0.6);
  const kernel = [0, -a, 0, -a, 1 + (4 * a), -a, 0, -a, 0];
  const data = src.data;
  const dst = out.data;
  const idx = (x, y) => ((y * width) + x) * 4;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const base = idx(x, y);
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        dst[base] = data[base];
        dst[base + 1] = data[base + 1];
        dst[base + 2] = data[base + 2];
        dst[base + 3] = data[base + 3];
        continue;
      }
      let r = 0, g = 0, b = 0;
      let k = 0;
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          const source = idx(x + ox, y + oy);
          const kv = kernel[k++];
          r += data[source] * kv;
          g += data[source + 1] * kv;
          b += data[source + 2] * kv;
        }
      }
      dst[base] = Math.max(0, Math.min(255, Math.round(r)));
      dst[base + 1] = Math.max(0, Math.min(255, Math.round(g)));
      dst[base + 2] = Math.max(0, Math.min(255, Math.round(b)));
      dst[base + 3] = data[base + 3];
    }
  }
  ctx.putImageData(out, 0, 0);
}

function getFilteredCaptureCanvas() {
  const canvas = getPrimaryCanvas();
  if (!canvas) throw new Error('O navegador não expôs o canvas principal do visualizador.');
  const output = document.createElement('canvas');
  output.width = canvas.width;
  output.height = canvas.height;
  const ctx = output.getContext('2d');
  if (!ctx) throw new Error('Não foi possível criar o canvas da captura.');
  ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%)`;
  ctx.drawImage(canvas, 0, 0);
  if (state.sharpness > 0) applySharpenToContext(ctx, output.width, output.height, state.sharpness);
  ctx.filter = 'none';
  return output;
}

async function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem.')), type, quality);
    } catch (error) { reject(error); }
  });
}

async function getFilteredCaptureBlob() {
  return canvasToBlob(getFilteredCaptureCanvas(), 'image/png');
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Falha ao ler captura.'));
    reader.readAsDataURL(blob);
  });
}

function reportVisibleAnnotations() {
  return state.annotations.filter((annotation) => isAnnotationGroupVisible(annotationGroup(annotation)));
}

function reportIdentity() {
  const libraryEntry = state.currentFile ? findLibraryEntryForFile(state.currentFile) : null;
  return {
    title: ui.reportTitleInput?.value.trim() || state.lessonTitle.trim() || state.activeSessionName || 'Relatório de Lâmina Histológica',
    professor: ui.reportProfessorInput?.value.trim() || '',
    student: ui.reportStudentInput?.value.trim() || '',
    institution: ui.reportInstitutionInput?.value.trim() || '',
    category: libraryEntry?.category || 'Outros',
    session: state.activeSessionName || '',
  };
}

function reportOptions() {
  return {
    includeImage: Boolean(ui.reportIncludeImage?.checked),
    includeMeasurements: Boolean(ui.reportIncludeMeasurements?.checked),
    includeAnnotations: Boolean(ui.reportIncludeAnnotations?.checked),
    includeLesson: Boolean(ui.reportIncludeLesson?.checked),
  };
}

function saveReportPreferences() {
  try {
    localStorage.setItem(REPORT_PREFS_KEY, JSON.stringify({
      professor: ui.reportProfessorInput?.value || '',
      student: ui.reportStudentInput?.value || '',
      institution: ui.reportInstitutionInput?.value || '',
      ...reportOptions(),
    }));
  } catch (_) {
    // Preferências do relatório são opcionais.
  }
}

function loadReportPreferences() {
  try {
    const data = JSON.parse(localStorage.getItem(REPORT_PREFS_KEY) || '{}');
    ui.reportProfessorInput.value = String(data.professor || '');
    ui.reportStudentInput.value = String(data.student || '');
    ui.reportInstitutionInput.value = String(data.institution || '');
    if (typeof data.includeImage === 'boolean') ui.reportIncludeImage.checked = data.includeImage;
    if (typeof data.includeMeasurements === 'boolean') ui.reportIncludeMeasurements.checked = data.includeMeasurements;
    if (typeof data.includeAnnotations === 'boolean') ui.reportIncludeAnnotations.checked = data.includeAnnotations;
    if (typeof data.includeLesson === 'boolean') ui.reportIncludeLesson.checked = data.includeLesson;
  } catch (_) {
    // Ignora preferências antigas/corrompidas.
  }
}

function defaultReportTitle() {
  if (state.lessonTitle.trim()) return state.lessonTitle.trim();
  if (state.activeSessionName) return state.activeSessionName;
  return state.currentFile?.name?.replace(/\.svs$/i, '') || 'Relatório de Lâmina Histológica';
}

function updateReportSummary() {
  if (!ui.reportSummary) return;
  const visibleAnnotations = reportVisibleAnnotations();
  const lessonCount = state.lessonSequence.filter((id) => annotationById(id)).length;
  ui.reportSummary.textContent = `${state.measurements.length} medição(ões) · ${visibleAnnotations.length} anotação(ões) visível(is) · ${lessonCount} etapa(s) no Modo Aula.`;
  if (ui.reportIncludeLesson) ui.reportIncludeLesson.disabled = lessonCount === 0;
}

function openReportDialog() {
  if (!hasOpenSlide()) return;
  loadReportPreferences();
  ui.reportTitleInput.value = defaultReportTitle();
  updateReportSummary();
  if (typeof ui.reportDialog.showModal === 'function') ui.reportDialog.showModal();
  else ui.reportDialog.setAttribute('open', '');
  window.setTimeout(() => ui.reportTitleInput.focus(), 0);
}

function closeReportDialog() {
  saveReportPreferences();
  if (ui.reportDialog.open && typeof ui.reportDialog.close === 'function') ui.reportDialog.close();
  else ui.reportDialog.removeAttribute('open');
}

function reportCanvasScale(canvas) {
  const width = Math.max(1, ui.viewer.clientWidth);
  const height = Math.max(1, ui.viewer.clientHeight);
  return {
    x: canvas.width / width,
    y: canvas.height / height,
    s: ((canvas.width / width) + (canvas.height / height)) / 2,
  };
}

function reportCanvasPoint(point, scale) {
  if (!point) return null;
  const p = imagePointToViewerPixel(point);
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
  return { x: p.x * scale.x, y: p.y * scale.y };
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawReportBadge(ctx, point, value, color, scale) {
  if (!point) return;
  const radius = 12 * scale.s;
  const x = point.x + (12 * scale.s);
  const y = point.y - (12 * scale.s);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.32)';
  ctx.shadowBlur = 5 * scale.s;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1.5, 2 * scale.s);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.max(11, 12 * scale.s)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(value), x, y + (0.5 * scale.s));
  ctx.restore();
}

function drawReportMeasurementLabel(ctx, point, textValue, scale) {
  const fontSize = Math.max(10, 11 * scale.s);
  ctx.save();
  ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
  const paddingX = 7 * scale.s;
  const height = 22 * scale.s;
  const width = ctx.measureText(textValue).width + paddingX * 2;
  const x = point.x - width / 2;
  const y = point.y - height / 2;
  roundedRectPath(ctx, x, y, width, height, 6 * scale.s);
  ctx.fillStyle = 'rgba(12,14,18,.84)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = Math.max(1, scale.s);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(textValue, point.x, point.y);
  ctx.restore();
}

function drawReportMeasurements(ctx, canvas, scale) {
  for (const measurement of state.measurements) {
    const a = reportCanvasPoint(measurement.a, scale);
    const b = reportCanvasPoint(measurement.b, scale);
    if (!a || !b) continue;
    ctx.save();
    ctx.strokeStyle = '#ff334a';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, 2.2 * scale.s);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    for (const p of [a, b]) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(3, 4.5 * scale.s), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff334a';
      ctx.lineWidth = Math.max(1.5, 2 * scale.s);
      ctx.stroke();
    }
    ctx.restore();
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    drawReportMeasurementLabel(ctx, mid, `M${measurement.id} · ${measurement.label}`, scale);
  }
}

function annotationReportAnchor(annotation, scale) {
  if (annotation.type === 'marker' || annotation.type === 'text') return reportCanvasPoint(annotation.point, scale);
  if (annotation.type === 'arrow') {
    const a = reportCanvasPoint(annotation.start, scale);
    const b = reportCanvasPoint(annotation.end, scale);
    return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : null;
  }
  if (annotation.type === 'circle') return reportCanvasPoint(annotation.center, scale);
  const points = annotationGeometryPoints(annotation).map((point) => reportCanvasPoint(point, scale)).filter(Boolean);
  if (!points.length) return null;
  return points.reduce((acc, p) => ({ x: acc.x + p.x / points.length, y: acc.y + p.y / points.length }), { x: 0, y: 0 });
}

function drawReportAnnotations(ctx, canvas, scale, annotations) {
  annotations.forEach((annotation, index) => {
    const color = annotationColor(annotation);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(2, 2.4 * scale.s);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (annotation.type === 'marker') {
      const p = reportCanvasPoint(annotation.point, scale);
      if (p) {
        ctx.globalAlpha = .18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 12 * scale.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5 * scale.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111318';
        ctx.stroke();
      }
    } else if (annotation.type === 'arrow') {
      const a = reportCanvasPoint(annotation.start, scale);
      const b = reportCanvasPoint(annotation.end, scale);
      if (a && b) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        const size = 13 * scale.s;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - Math.cos(angle - Math.PI / 6) * size, b.y - Math.sin(angle - Math.PI / 6) * size);
        ctx.lineTo(b.x - Math.cos(angle + Math.PI / 6) * size, b.y - Math.sin(angle + Math.PI / 6) * size);
        ctx.closePath();
        ctx.fill();
      }
    } else if (annotation.type === 'circle') {
      const c = reportCanvasPoint(annotation.center, scale);
      const e = reportCanvasPoint(annotation.edge, scale);
      if (c && e) {
        const radius = Math.hypot(e.x - c.x, e.y - c.y);
        ctx.globalAlpha = .1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
      }
    } else if (annotation.type === 'rect') {
      const points = annotationGeometryPoints(annotation).map((point) => reportCanvasPoint(point, scale)).filter(Boolean);
      if (points.length === 4) {
        ctx.globalAlpha = .1;
        ctx.beginPath();
        points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
      }
    } else if (annotation.type === 'area') {
      const points = (annotation.points || []).map((point) => reportCanvasPoint(point, scale)).filter(Boolean);
      if (points.length >= 3) {
        ctx.globalAlpha = .15;
        ctx.beginPath();
        points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
      }
    } else if (annotation.type === 'text') {
      const p = reportCanvasPoint(annotation.point, scale);
      if (p) {
        const textValue = annotation.text || annotation.title || `Texto ${annotation.id}`;
        const fontSize = Math.max(11, 12 * scale.s);
        ctx.font = `700 ${fontSize}px system-ui, sans-serif`;
        const width = Math.min(canvas.width * .42, ctx.measureText(textValue).width + (18 * scale.s));
        const height = 26 * scale.s;
        roundedRectPath(ctx, p.x, p.y - height / 2, width, height, 7 * scale.s);
        ctx.fillStyle = 'rgba(10,12,16,.82)';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(textValue, p.x + (9 * scale.s), p.y, width - (18 * scale.s));
      }
    }
    ctx.restore();
    const anchor = annotationReportAnchor(annotation, scale);
    drawReportBadge(ctx, anchor, index + 1, color, scale);
  });
}

function drawReportScaleBar(ctx, canvas, scale) {
  if (ui.scaleBar.hidden || !ui.scaleLabel.textContent || ui.scaleLabel.textContent === '—') return;
  const lineCssWidth = parseFloat(ui.scaleLine.style.width || '') || ui.scaleLine.offsetWidth || 80;
  const lineWidth = lineCssWidth * scale.x;
  const x = 24 * scale.x;
  const y = canvas.height - (28 * scale.y);
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = 'rgba(8,9,11,.75)';
  const boxWidth = Math.max(lineWidth + (20 * scale.x), 90 * scale.x);
  const boxHeight = 42 * scale.y;
  roundedRectPath(ctx, x - (10 * scale.x), y - (27 * scale.y), boxWidth, boxHeight, 7 * scale.s);
  ctx.fill();
  ctx.lineWidth = Math.max(2, 2 * scale.s);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + lineWidth, y);
  ctx.moveTo(x, y - (6 * scale.y));
  ctx.lineTo(x, y + (2 * scale.y));
  ctx.moveTo(x + lineWidth, y - (6 * scale.y));
  ctx.lineTo(x + lineWidth, y + (2 * scale.y));
  ctx.stroke();
  ctx.font = `700 ${Math.max(10, 10 * scale.s)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(ui.scaleLabel.textContent, x + lineWidth / 2, y - (8 * scale.y));
  ctx.restore();
}

function getAnnotatedCaptureCanvas() {
  const output = getFilteredCaptureCanvas();
  const ctx = output.getContext('2d');
  const scale = reportCanvasScale(output);
  drawReportMeasurements(ctx, output, scale);
  drawReportAnnotations(ctx, output, scale, reportVisibleAnnotations());
  drawReportScaleBar(ctx, output, scale);
  return output;
}

async function exportAnnotatedPng() {
  if (!hasOpenSlide()) return;
  try {
    setStatus('Gerando captura anotada…');
    const canvas = getAnnotatedCaptureCanvas();
    const blob = await canvasToBlob(canvas, 'image/png');
    const filename = `${sanitizeBaseName(state.currentFile?.name)}_anotado.png`;
    downloadBlob(blob, filename);
    saveReportPreferences();
    setStatus(`Captura anotada salva: ${filename}`);
    showToast('PNG anotado exportado', 'success');
  } catch (error) {
    console.error('Falha ao exportar PNG anotado:', error);
    setStatus(`Não foi possível gerar o PNG anotado: ${error?.message || error}`);
    showToast('Falha ao gerar PNG', 'error');
  }
}

function reportAnnotationDetail(annotation) {
  const parts = [annotationTypeLabel(annotation.type), annotationGroup(annotation)];
  if (annotation.type === 'area') parts.push(annotation.areaLabel || polygonArea(annotation.points || []).label);
  if (annotation.note) parts.push(annotation.note);
  return parts.filter(Boolean).join(' · ');
}

function getReportHtml({ imageData = '' } = {}) {
  const payload = projectPayload();
  const identity = reportIdentity();
  const opts = reportOptions();
  const visibleAnnotations = reportVisibleAnnotations();
  const measurements = state.measurements.map((m) => `<tr><td>M${escapeHtml(m.id)}</td><td>${escapeHtml(m.label)}</td></tr>`).join('') || '<tr><td colspan="2">Nenhuma medição</td></tr>';
  const annotations = visibleAnnotations.map((a, index) => `<tr><td><span class="num" style="background:${escapeHtml(annotationColor(a))}">${index + 1}</span></td><td>${escapeHtml(a.title || annotationTypeLabel(a.type))}</td><td>${escapeHtml(reportAnnotationDetail(a))}</td></tr>`).join('') || '<tr><td colspan="3">Nenhuma anotação visível</td></tr>';
  const lessonRows = state.lessonSequence.map((id, index) => {
    const annotation = annotationById(id);
    if (!annotation) return '';
    return `<tr><td>${index + 1}</td><td>${escapeHtml(annotation.title || `Etapa ${index + 1}`)}</td><td>${escapeHtml(annotation.note || annotationSummary(annotation))}</td></tr>`;
  }).join('');
  const imageSection = opts.includeImage && imageData ? `<section><h2>Região documentada</h2><img class="shot" src="${imageData}" alt="Captura anotada da lâmina"></section>` : '';
  const measurementSection = opts.includeMeasurements ? `<section><h2>Medições</h2><table><thead><tr><th>ID</th><th>Valor</th></tr></thead><tbody>${measurements}</tbody></table></section>` : '';
  const annotationSection = opts.includeAnnotations ? `<section><h2>Legenda das anotações</h2><table><thead><tr><th>#</th><th>Anotação</th><th>Detalhes</th></tr></thead><tbody>${annotations}</tbody></table></section>` : '';
  const lessonSection = opts.includeLesson && lessonRows ? `<section><h2>${escapeHtml(state.lessonTitle || 'Sequência do Modo Aula')}</h2><table><thead><tr><th>Etapa</th><th>Título</th><th>Observação</th></tr></thead><tbody>${lessonRows}</tbody></table></section>` : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(identity.title)}</title><style>
  *{box-sizing:border-box}body{font:14px Inter,system-ui,sans-serif;margin:0;color:#1f2530;background:#eef1f5}.page{max-width:920px;margin:24px auto;background:white;box-shadow:0 12px 42px #0002}.head{padding:30px 38px 24px;background:#151820;color:#fff;border-top:7px solid #d92335}.head h1{margin:0;font-size:27px}.head p{margin:6px 0 0;color:#b9c0ca}.content{padding:28px 38px 38px}.identity{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0 0 20px}.identity div,.meta div{padding:10px 12px;background:#f4f6f8;border-radius:8px}.identity b,.meta b{display:block;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}.meta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:0 0 26px}.meta div{font-size:12px}.shot{display:block;width:100%;max-height:520px;object-fit:contain;border:1px solid #d8dde4;border-radius:10px;background:#f3f4f6}h2{font-size:16px;margin:28px 0 10px}table{border-collapse:collapse;width:100%;margin:0 0 20px}th,td{border-bottom:1px solid #e0e4ea;padding:9px 8px;text-align:left;vertical-align:top}th{font-size:10px;color:#667085;text-transform:uppercase}.num{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;color:white;font-weight:800}.foot{padding:16px 38px;border-top:1px solid #e2e6eb;color:#737b87;font-size:10px;display:flex;justify-content:space-between}.no-print{padding:0 38px 30px}@media(max-width:700px){.page{margin:0}.identity,.meta{grid-template-columns:1fr 1fr}.content,.head,.foot{padding-left:20px;padding-right:20px}}@media print{body{background:white}.page{max-width:none;margin:0;box-shadow:none}.no-print{display:none}@page{size:A4;margin:12mm}}
  </style></head><body><article class="page"><header class="head"><h1>${escapeHtml(identity.title)}</h1><p>Virtum SVS Viewer · relatório local · v0.5.3.2</p></header><div class="content"><div class="identity"><div><b>Professor(a)</b>${escapeHtml(identity.professor || '—')}</div><div><b>Aluno(a)</b>${escapeHtml(identity.student || '—')}</div><div><b>Instituição / disciplina</b>${escapeHtml(identity.institution || '—')}</div><div><b>Sessão / categoria</b>${escapeHtml([identity.session, identity.category].filter(Boolean).join(' · ') || '—')}</div></div><div class="meta"><div><b>Lâmina</b>${escapeHtml(payload.slide.name)}</div><div><b>Dimensões</b>${escapeHtml(payload.slide.width)} × ${escapeHtml(payload.slide.height)} px</div><div><b>Ampliação</b>${state.objectivePower ? `${escapeHtml(state.objectivePower)}×` : 'não informado'}</div><div><b>MPP</b>${payload.slide.mppX ? `${escapeHtml(payload.slide.mppX)} µm/px` : 'não informado'}</div></div>${imageSection}${measurementSection}${annotationSection}${lessonSection}</div><footer class="foot"><span>Gerado pelo Virtum SVS Viewer</span><span>${escapeHtml(new Date().toLocaleString('pt-BR'))}</span></footer><div class="no-print"><button onclick="window.print()">Imprimir / Salvar em PDF</button></div></article></body></html>`;
}

async function exportHtmlReport() {
  if (!hasOpenSlide()) return;
  try {
    setStatus('Gerando relatório HTML…');
    let imageData = '';
    if (reportOptions().includeImage) {
      try { imageData = (await blobToDataUrl(await canvasToBlob(getAnnotatedCaptureCanvas(), 'image/jpeg', .9))); } catch (error) { console.warn('Relatório HTML sem captura:', error); }
    }
    const filename = `${sanitizeBaseName(state.currentFile?.name)}_relatorio.html`;
    downloadBlob(new Blob([getReportHtml({ imageData })], { type: 'text/html;charset=utf-8' }), filename);
    saveReportPreferences();
    setStatus(`Relatório exportado: ${filename}`);
    showToast('Relatório HTML exportado', 'success');
  } catch (error) {
    console.error('Falha ao exportar relatório HTML:', error);
    setStatus(`Não foi possível gerar o relatório: ${error?.message || error}`);
    showToast('Falha ao gerar relatório', 'error');
  }
}

function pdfSetTextColor(pdf, hex) {
  const value = normalizeAnnotationColor(hex, 'marker').replace('#', '');
  pdf.setTextColor(parseInt(value.slice(0,2),16), parseInt(value.slice(2,4),16), parseInt(value.slice(4,6),16));
}

function pdfPageHeader(pdf, title, subtitle = '') {
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(21, 24, 32);
  pdf.rect(0, 0, pageWidth, 22, 'F');
  pdf.setFillColor(217, 35, 53);
  pdf.rect(0, 0, pageWidth, 3, 'F');
  pdf.setTextColor(255,255,255);
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(14);
  pdf.text(title, 14, 11);
  pdf.setFont('helvetica','normal');
  pdf.setFontSize(8);
  pdf.setTextColor(190,196,205);
  if (subtitle) pdf.text(subtitle, 14, 16.5);
}

function pdfEnsureSpace(pdf, y, needed = 12, title = 'Virtum SVS Viewer') {
  const pageHeight = pdf.internal.pageSize.getHeight();
  if (y + needed <= pageHeight - 17) return y;
  pdf.addPage();
  pdfPageHeader(pdf, title, 'Continuação do relatório');
  return 31;
}

function pdfAddWrapped(pdf, textValue, x, y, width, options = {}) {
  const fontSize = options.fontSize || 9;
  const lineHeight = options.lineHeight || fontSize * .43;
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', options.bold ? 'bold' : 'normal');
  if (options.color) pdfSetTextColor(pdf, options.color); else pdf.setTextColor(42,48,58);
  const lines = pdf.splitTextToSize(String(textValue || '—'), width);
  pdf.text(lines, x, y);
  return y + Math.max(1, lines.length) * lineHeight;
}

function pdfAddSectionTitle(pdf, title, y, reportTitle) {
  y = pdfEnsureSpace(pdf, y, 13, reportTitle);
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(11);
  pdf.setTextColor(31,37,48);
  pdf.text(title, 14, y);
  pdf.setDrawColor(220,224,231);
  pdf.line(14, y + 2.5, pdf.internal.pageSize.getWidth() - 14, y + 2.5);
  return y + 8;
}

async function exportPdfReport() {
  if (!hasOpenSlide()) return;
  const identity = reportIdentity();
  const opts = reportOptions();
  saveReportPreferences();
  closeReportDialog();
  try {
    setBusy(true, 'Gerando PDF', 'Carregando módulo de PDF…');
    setStatus('Gerando PDF profissional…');
    const { jsPDF } = await import('jspdf');
    setBusy(true, 'Gerando PDF', 'Montando captura, legenda e dados da lâmina…');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 28;
    pdfPageHeader(pdf, identity.title, 'Virtum SVS Viewer · Reports & Export · v0.5.3.2');
    let y = 31;

    const identityRows = [
      ['Professor(a)', identity.professor || '—', 'Aluno(a)', identity.student || '—'],
      ['Instituição / disciplina', identity.institution || '—', 'Sessão / categoria', [identity.session, identity.category].filter(Boolean).join(' · ') || '—'],
    ];
    pdf.setFillColor(246,247,249);
    for (const row of identityRows) {
      pdf.roundedRect(14, y - 4, contentWidth, 13, 2, 2, 'F');
      pdf.setFontSize(6.8); pdf.setTextColor(110,118,131); pdf.setFont('helvetica','bold');
      pdf.text(row[0].toUpperCase(), 18, y);
      pdf.text(row[2].toUpperCase(), 111, y);
      pdf.setFontSize(9); pdf.setTextColor(40,46,56); pdf.setFont('helvetica','normal');
      pdf.text(pdf.splitTextToSize(row[1], 82)[0] || '—', 18, y + 5);
      pdf.text(pdf.splitTextToSize(row[3], 82)[0] || '—', 111, y + 5);
      y += 16;
    }

    const payload = projectPayload();
    y = pdfAddSectionTitle(pdf, 'Dados da lâmina', y + 1, identity.title);
    const meta = [
      ['Arquivo', payload.slide.name || '—'],
      ['Dimensões', payload.slide.width && payload.slide.height ? `${Number(payload.slide.width).toLocaleString('pt-BR')} × ${Number(payload.slide.height).toLocaleString('pt-BR')} px` : '—'],
      ['Ampliação', state.objectivePower ? `${state.objectivePower}×` : 'não informado'],
      ['MPP', payload.slide.mppX ? `${Number(payload.slide.mppX).toFixed(3)} µm/px` : 'não informado'],
      ['Ajustes', `Brilho ${state.brightness}% · Contraste ${state.contrast}% · Saturação ${state.saturation}% · Nitidez ${state.sharpness}%`],
    ];
    for (const [label, value] of meta) {
      y = pdfEnsureSpace(pdf, y, 7, identity.title);
      pdf.setFontSize(7); pdf.setFont('helvetica','bold'); pdf.setTextColor(111,118,130); pdf.text(`${label}:`, 16, y);
      pdf.setFontSize(8.5); pdf.setFont('helvetica','normal'); pdf.setTextColor(42,48,58); pdf.text(pdf.splitTextToSize(String(value), 145)[0], 43, y);
      y += 5.3;
    }

    if (opts.includeImage) {
      y = pdfAddSectionTitle(pdf, 'Região documentada', y + 4, identity.title);
      const canvas = getAnnotatedCaptureCanvas();
      const dataUrl = canvas.toDataURL('image/jpeg', .88);
      const maxH = 104;
      const ratio = canvas.width / canvas.height;
      let imageWidth = contentWidth;
      let imageHeight = imageWidth / ratio;
      if (imageHeight > maxH) { imageHeight = maxH; imageWidth = imageHeight * ratio; }
      y = pdfEnsureSpace(pdf, y, imageHeight + 6, identity.title);
      const imageX = (pageWidth - imageWidth) / 2;
      pdf.setDrawColor(216,221,228);
      pdf.roundedRect(imageX - 1, y - 1, imageWidth + 2, imageHeight + 2, 2, 2, 'S');
      pdf.addImage(dataUrl, 'JPEG', imageX, y, imageWidth, imageHeight, undefined, 'FAST');
      y += imageHeight + 7;
    }

    if (opts.includeMeasurements) {
      y = pdfAddSectionTitle(pdf, 'Medições', y + 2, identity.title);
      if (!state.measurements.length) {
        y = pdfAddWrapped(pdf, 'Nenhuma medição registrada.', 16, y, contentWidth - 4, { fontSize: 8.5 });
      } else {
        for (const measurement of state.measurements) {
          y = pdfEnsureSpace(pdf, y, 8, identity.title);
          pdf.setFillColor(255,51,74); pdf.circle(18, y - 1, 2.2, 'F');
          pdf.setFontSize(8.5); pdf.setFont('helvetica','bold'); pdf.setTextColor(39,45,55);
          pdf.text(`M${measurement.id}`, 24, y);
          pdf.setFont('helvetica','normal'); pdf.text(measurement.label, 42, y);
          y += 6.2;
        }
      }
    }

    if (opts.includeAnnotations) {
      const visibleAnnotations = reportVisibleAnnotations();
      y = pdfAddSectionTitle(pdf, 'Legenda das anotações', y + 3, identity.title);
      if (!visibleAnnotations.length) {
        y = pdfAddWrapped(pdf, 'Nenhuma anotação visível.', 16, y, contentWidth - 4, { fontSize: 8.5 });
      } else {
        visibleAnnotations.forEach((annotation, index) => {
          y = pdfEnsureSpace(pdf, y, annotation.note ? 15 : 11, identity.title);
          const hex = annotationColor(annotation).replace('#','');
          pdf.setFillColor(parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16));
          pdf.circle(19, y - 1, 3.4, 'F');
          pdf.setFontSize(7.4); pdf.setFont('helvetica','bold'); pdf.setTextColor(255,255,255);
          pdf.text(String(index + 1), 19, y + .2, { align: 'center' });
          pdf.setTextColor(34,40,50); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
          pdf.text(annotation.title || annotationTypeLabel(annotation.type), 26, y);
          pdf.setFontSize(7.6); pdf.setFont('helvetica','normal'); pdf.setTextColor(105,113,125);
          pdf.text(`${annotationTypeLabel(annotation.type)} · ${annotationGroup(annotation)}${annotation.type === 'area' ? ` · ${annotation.areaLabel || polygonArea(annotation.points || []).label}` : ''}`, 26, y + 4);
          if (annotation.note) {
            pdf.setTextColor(58,65,76);
            const lines = pdf.splitTextToSize(annotation.note, contentWidth - 14);
            pdf.text(lines.slice(0, 3), 26, y + 8);
            y += Math.min(3, lines.length) * 3.2;
          }
          y += 8.5;
        });
      }
    }

    if (opts.includeLesson && state.lessonSequence.length) {
      y = pdfAddSectionTitle(pdf, state.lessonTitle.trim() || 'Sequência do Modo Aula', y + 3, identity.title);
      state.lessonSequence.forEach((id, index) => {
        const annotation = annotationById(id);
        if (!annotation) return;
        y = pdfEnsureSpace(pdf, y, annotation.note ? 17 : 12, identity.title);
        pdf.setFillColor(217,35,53); pdf.circle(19, y - 1, 3.6, 'F');
        pdf.setFontSize(7.5); pdf.setFont('helvetica','bold'); pdf.setTextColor(255,255,255);
        pdf.text(String(index + 1), 19, y + .2, { align: 'center' });
        pdf.setFontSize(9); pdf.setTextColor(34,40,50); pdf.text(annotation.title || `Etapa ${index + 1}`, 27, y);
        pdf.setFontSize(7.5); pdf.setFont('helvetica','normal'); pdf.setTextColor(105,113,125);
        pdf.text(`${annotationTypeLabel(annotation.type)} · ${annotationGroup(annotation)}`, 27, y + 4);
        if (annotation.note) {
          pdf.setTextColor(58,65,76);
          const lines = pdf.splitTextToSize(annotation.note, contentWidth - 15);
          pdf.text(lines.slice(0, 4), 27, y + 8);
          y += Math.min(4, lines.length) * 3.2;
        }
        y += 9;
      });
    }

    const totalPages = pdf.getNumberOfPages();
    for (let page = 1; page <= totalPages; page += 1) {
      pdf.setPage(page);
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setDrawColor(226,229,234);
      pdf.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);
      pdf.setFontSize(7.5); pdf.setFont('helvetica','normal'); pdf.setTextColor(115,123,135);
      pdf.text('Gerado pelo Virtum SVS Viewer', 14, pageHeight - 6.5);
      pdf.text(`${new Date().toLocaleDateString('pt-BR')} · página ${page}/${totalPages}`, pageWidth - 14, pageHeight - 6.5, { align: 'right' });
    }

    const filename = `${sanitizeBaseName(state.currentFile?.name)}_relatorio.pdf`;
    pdf.save(filename);
    setStatus(`PDF exportado: ${filename}`);
    showToast('PDF profissional exportado', 'success');
  } catch (error) {
    console.error('Falha ao exportar PDF:', error);
    setStatus(`Não foi possível gerar o PDF: ${error?.message || error}`);
    showToast('Falha ao gerar PDF', 'error');
  } finally {
    setBusy(false);
  }
}

function niceScaleValue(maxValue) {
  if (!(maxValue > 0)) return null;
  const power = 10 ** Math.floor(Math.log10(maxValue));
  let best = power;
  for (const factor of [1, 2, 2.5, 5, 10]) {
    const candidate = factor * power;
    if (candidate <= maxValue) best = candidate;
  }
  return best;
}

function updateScaleBar() {
  if (!hasOpenSlide() || !state.mppX || !state.mppY) {
    ui.scaleBar.hidden = true;
    return;
  }

  const width = ui.viewer.clientWidth;
  const height = ui.viewer.clientHeight;
  if (width < 100 || height < 100) {
    ui.scaleBar.hidden = true;
    return;
  }

  const samplePx = Math.min(120, Math.max(60, width * 0.12));
  const y = height / 2;
  const x1 = width / 2 - samplePx / 2;
  const x2 = width / 2 + samplePx / 2;
  const vp1 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x1, y), true);
  const vp2 = viewer.viewport.pointFromPixel(new OpenSeadragon.Point(x2, y), true);
  const im1 = viewer.viewport.viewportToImageCoordinates(vp1);
  const im2 = viewer.viewport.viewportToImageCoordinates(vp2);
  const microns = Math.hypot((im2.x - im1.x) * state.mppX, (im2.y - im1.y) * state.mppY);
  const micronsPerScreenPx = microns / samplePx;

  if (!(micronsPerScreenPx > 0) || !Number.isFinite(micronsPerScreenPx)) {
    ui.scaleBar.hidden = true;
    return;
  }

  const targetMax = micronsPerScreenPx * Math.min(130, width * 0.22);
  const niceValue = niceScaleValue(targetMax);
  const lineWidth = niceValue / micronsPerScreenPx;
  if (!niceValue || !Number.isFinite(lineWidth)) {
    ui.scaleBar.hidden = true;
    return;
  }

  ui.scaleLabel.textContent = formatMicrons(niceValue);
  ui.scaleLine.style.width = `${Math.max(30, lineWidth)}px`;
  ui.scaleBar.hidden = false;
}

function updatePosition(event) {
  if (!hasOpenSlide() || !event?.position) {
    ui.positionText.textContent = 'Posição —';
    return;
  }
  const viewportPoint = viewer.viewport.pointFromPixel(event.position, true);
  const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
  if (!Number.isFinite(imagePoint.x) || !Number.isFinite(imagePoint.y)) return;
  ui.positionText.textContent = `X ${Math.round(imagePoint.x).toLocaleString('pt-BR')} · Y ${Math.round(imagePoint.y).toLocaleString('pt-BR')}`;
}

function sanitizeBaseName(name) {
  return (name || 'lamina')
    .replace(/\.svs$/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'lamina';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function captureViewport() {
  if (!hasOpenSlide()) return;

  try {
    const blob = await getFilteredCaptureBlob();
    const filename = `${sanitizeBaseName(state.currentFile?.name)}_captura.png`;
    downloadBlob(blob, filename);
    setStatus(`Captura salva: ${filename}`);
    showToast('Captura PNG salva', 'success');
  } catch (error) {
    console.error('Falha ao capturar viewport:', error);
    setStatus(`Não foi possível capturar a imagem: ${error?.message || error}`);
    showToast('Falha ao capturar imagem', 'error');
  }
}

function openMoreMenu() {
  ui.moreMenu.hidden = false;
  ui.moreBtn.setAttribute('aria-expanded', 'true');
}

function closeMoreMenu() {
  ui.moreMenu.hidden = true;
  ui.moreBtn.setAttribute('aria-expanded', 'false');
}

function toggleMoreMenu() {
  if (ui.moreMenu.hidden) openMoreMenu();
  else closeMoreMenu();
}

function refreshAfterLayoutChange() {
  window.requestAnimationFrame(() => {
    viewer.forceRedraw?.();
    redrawOverlays();
  });
}

function openSidebar() {
  closeMoreMenu();
  if (window.innerWidth > 760) {
    setSidebarCollapsed(false);
    return;
  }
  ui.sidebar.classList.add('open');
  ui.sidebarBackdrop.hidden = false;
  ui.panelBtn.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  ui.sidebar.classList.remove('open');
  ui.sidebarBackdrop.hidden = true;
  ui.panelBtn.setAttribute('aria-expanded', 'false');
}

function setSidebarCollapsed(collapsed, persist = true) {
  state.sidebarCollapsed = Boolean(collapsed);
  ui.app.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
  ui.collapseSidebarBtn.setAttribute('aria-label', state.sidebarCollapsed ? 'Mostrar painel' : 'Recolher painel');
  ui.collapseSidebarBtn.textContent = state.sidebarCollapsed ? '›' : '‹';
  if (persist) savePreferences();
  refreshAfterLayoutChange();
}

function setPresentationMode(enabled, notify = true) {
  state.presentationMode = Boolean(enabled);
  if (!state.presentationMode && state.lessonPresenting) {
    state.lessonPresenting = false;
    if (ui.lessonPresentationBar) ui.lessonPresentationBar.hidden = true;
  }
  closeMoreMenu();
  closeSidebar();
  ui.app.classList.toggle('presentation-mode', state.presentationMode);
  ui.presentationBtn.textContent = state.presentationMode ? 'Sair da apresentação' : 'Apresentar';
  ui.presentationBtn.setAttribute('aria-pressed', String(state.presentationMode));
  refreshAfterLayoutChange();
  if (notify) showToast(state.presentationMode ? 'Modo apresentação ativado' : 'Modo apresentação encerrado', 'info');
}

function setActivePanel(panelId) {
  state.activePanel = panelId;
  for (const button of panelTabs) {
    const active = button.dataset.panelTarget === panelId;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  }
  for (const page of panelPages) {
    page.hidden = page.dataset.panelPage !== panelId;
  }
  savePreferences();
}

function toggleSidebar() {
  if (window.innerWidth > 760) {
    setSidebarCollapsed(!state.sidebarCollapsed);
    return;
  }
  if (ui.sidebar.classList.contains('open')) closeSidebar();
  else openSidebar();
}

let overlayRedrawFrame = 0;
let diagnosticsTimer = 0;

function scheduleDiagnosticsUpdate(delay = 120) {
  if (diagnosticsTimer) return;
  diagnosticsTimer = window.setTimeout(() => {
    diagnosticsTimer = 0;
    updateDiagnostics();
    updateStartupDiagnostics();
  }, delay);
}

function redrawOverlays() {
  renderMeasurements();
  renderAnnotations();
  updateScaleBar();
  updateZoomText();
  updateQualityInfo();
  scheduleDiagnosticsUpdate();
}

function scheduleRedrawOverlays() {
  if (overlayRedrawFrame) return;
  overlayRedrawFrame = window.requestAnimationFrame(() => {
    overlayRedrawFrame = 0;
    redrawOverlays();
  });
}

viewer.addHandler('open', () => {
  viewer.viewport.goHome(true);
  setViewerControlsEnabled(true);
  if (state.pendingAutosaveData) {
    try {
      applyProjectData(state.pendingAutosaveData, { safe: true, resetHistoryAfter: true });
      const time = state.autosaveSavedAt ? new Date(state.autosaveSavedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;
      if (state.activeSessionName) {
        setAutosaveStatus(`Sessão · ${state.activeSessionName}`, 'saved');
        showToast(`Sessão restaurada: ${state.activeSessionName}`, 'success');
      } else {
        setAutosaveStatus(time ? `Autosave local · ${time}` : 'Autosave local · restaurado', 'saved');
        showToast('Sessão local restaurada', 'success');
      }
    } catch (error) {
      console.warn('Não foi possível restaurar o autosave:', error);
      resetHistory();
      setAutosaveStatus('Autosave local · ativo', 'idle');
    } finally {
      state.pendingAutosaveData = null;
    }
  } else {
    resetHistory();
  }
  applyQualityModeSettings();
  redrawOverlays();
});
viewer.addHandler('zoom', scheduleRedrawOverlays);
viewer.addHandler('pan', scheduleRedrawOverlays);
viewer.addHandler('animation', scheduleRedrawOverlays);
viewer.addHandler('rotate', scheduleRedrawOverlays);
viewer.addHandler('resize', scheduleRedrawOverlays);
viewer.addHandler('canvas-move', updatePosition);
viewer.addHandler('canvas-exit', () => { ui.positionText.textContent = 'Posição —'; });
viewer.addHandler('canvas-click', (event) => {
  if (!hasOpenSlide() || !event.quick) return;
  if (!state.measureMode && !state.annotationMode) return;
  event.preventDefaultAction = true;
  const viewportPoint = viewer.viewport.pointFromPixel(event.position, true);
  const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
  if (!Number.isFinite(imagePoint.x) || !Number.isFinite(imagePoint.y)) return;
  if (state.measureMode) addMeasurementPoint(imagePoint);
  else if (state.annotationMode === 'marker') openAnnotationDialog({ draft: { type: 'marker', point: { x: imagePoint.x, y: imagePoint.y } } });
  else if (state.annotationMode === 'text') openAnnotationDialog({ draft: { type: 'text', point: { x: imagePoint.x, y: imagePoint.y } } });
  else if (['arrow', 'circle', 'rect'].includes(state.annotationMode)) addShapePoint(state.annotationMode, imagePoint);
  else if (state.annotationMode === 'area') addAreaPoint(imagePoint);
});
viewer.addHandler('canvas-double-click', (event) => {
  if (!hasOpenSlide() || state.measureMode || state.annotationMode || state.presentationMode || state.lessonPresenting || !event?.position) return;
  event.preventDefaultAction = true;
  const viewportPoint = viewer.viewport.pointFromPixel(event.position, true);
  const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
  if (!Number.isFinite(imagePoint.x) || !Number.isFinite(imagePoint.y)) return;
  openAnnotationDialog({ draft: { type: 'marker', point: { x: imagePoint.x, y: imagePoint.y } } });
});
viewer.addHandler('tile-loaded', () => {
  if (!state.tileLoaded) {
    state.tileLoaded = true;
    state.awaitingFirstTile = false;
    clearFirstTileTimer();
    setBusy(false);
    redrawOverlays();
    state.firstViewMs = state.openStartedAt ? performance.now() - state.openStartedAt : null;
    const timing = state.firstTileTotalMs != null ? ` · tile ${Math.round(state.firstTileTotalMs)} ms` : '';
    const totalTiming = state.firstViewMs != null ? ` · primeira imagem ${(state.firstViewMs / 1000).toFixed(1)} s` : '';
    setStartupPhase(`Lâmina pronta${timing}${totalTiming}`);
    if (state.currentFile) {
      const fastTiming = state.firstViewMs != null ? ` · ${(state.firstViewMs / 1000).toFixed(1)} s` : '';
      setStatus(`${state.currentFile.name} · primeira imagem pronta${fastTiming} · ${qualitySummaryText(screenPixelsPerImagePixel())}`);
    }
  }
});
viewer.addHandler('tile-load-failed', (event) => {
  state.tileErrors += 1;
  console.error('Falha ao carregar tile:', event);
  if (!state.tileLoaded && state.tileErrors <= 3) {
    const detail = event?.message || event?.errorMsg || 'falha ao decodificar bloco';
    setStatus(`Falha ao renderizar tile (${state.tileErrors}): ${detail}`);
  }
});
viewer.addHandler('open-failed', (event) => {
  state.awaitingFirstTile = false;
  clearFirstTileTimer();
  setBusy(false);
  console.error('OpenSeadragon não conseguiu abrir a fonte:', event);
  state.lastEngineError = event?.message || event?.errorMsg || 'Falha ao preparar a pirâmide de zoom da lâmina.';
  setStartupPhase('Falha no Deep Zoom', state.lastEngineError);
  setStatus('Falha ao preparar a pirâmide de zoom da lâmina.');
});

viewer.addHandler('zoom', () => { if (state.compareActive && state.compareSync) syncPrimaryToCompare(); });
viewer.addHandler('pan', () => { if (state.compareActive && state.compareSync) syncPrimaryToCompare(); });

compareViewer.addHandler('open', () => {
  compareViewer.viewport.goHome(true);
  ui.compareBusy.hidden = true;
  ui.compareEmpty.hidden = true;
  ui.compareStatusText.textContent = state.compareFile?.name || 'Segunda lâmina pronta';
  applyQualityModeSettings();
  if (state.compareSync) window.requestAnimationFrame(syncPrimaryToCompare);
});
compareViewer.addHandler('tile-loaded', () => {
  ui.compareBusy.hidden = true;
  ui.compareEmpty.hidden = true;
});
compareViewer.addHandler('open-failed', (event) => {
  console.error('Falha ao abrir a segunda lâmina:', event);
  ui.compareBusy.hidden = true;
  ui.compareEmpty.hidden = false;
  ui.compareStatusText.textContent = 'Falha ao abrir a segunda lâmina';
  showToast('Falha ao renderizar a segunda lâmina', 'error');
});
compareViewer.addHandler('zoom', () => { if (state.compareActive && state.compareSync) syncCompareToPrimary(); });
compareViewer.addHandler('pan', () => { if (state.compareActive && state.compareSync) syncCompareToPrimary(); });

ui.openBtn.addEventListener('click', () => { state.pendingLibraryOpen = null; openPicker(); });
ui.emptyOpenBtn.addEventListener('click', () => { state.pendingLibraryOpen = null; openPicker(); });
ui.fileInput.addEventListener('change', () => openSvs(ui.fileInput.files?.[0]));
ui.compareFileInput.addEventListener('change', () => openCompareSvs(ui.compareFileInput.files?.[0]));
ui.zoomInBtn.addEventListener('click', () => zoomBy(1.5));
ui.zoomOutBtn.addEventListener('click', () => zoomBy(1 / 1.5));
ui.homeBtn.addEventListener('click', goHome);
ui.measureBtn.addEventListener('click', toggleMeasureMode);
ui.markerBtn.addEventListener('click', () => toggleAnnotationMode('marker'));
ui.areaBtn.addEventListener('click', () => toggleAnnotationMode('area'));
ui.proMarkerBtn.addEventListener('click', () => toggleAnnotationMode('marker'));
ui.proArrowBtn.addEventListener('click', () => toggleAnnotationMode('arrow'));
ui.proCircleBtn.addEventListener('click', () => toggleAnnotationMode('circle'));
ui.proRectBtn.addEventListener('click', () => toggleAnnotationMode('rect'));
ui.proTextBtn.addEventListener('click', () => toggleAnnotationMode('text'));
ui.proAreaBtn.addEventListener('click', () => toggleAnnotationMode('area'));
ui.showAllGroupsBtn.addEventListener('click', () => hideOrShowAllAnnotationGroups(true));
ui.hideAllGroupsBtn.addEventListener('click', () => hideOrShowAllAnnotationGroups(false));
ui.finishAreaBtn.addEventListener('click', finishArea);
ui.cancelAreaBtn.addEventListener('click', cancelAreaDraft);
ui.captureBtn.addEventListener('click', captureViewport);
ui.clearMeasurementsBtn.addEventListener('click', () => {
  if (state.measurements.length > 1 && !window.confirm(`Remover as ${state.measurements.length} medições desta lâmina?`)) return;
  clearMeasurements(true);
});
ui.clearAnnotationsBtn.addEventListener('click', () => {
  if (state.annotations.length > 1 && !window.confirm(`Remover as ${state.annotations.length} anotações desta lâmina?`)) return;
  clearAnnotations(true);
});
ui.annotationForm.addEventListener('submit', saveAnnotationFromDialog);
ui.annotationCancelBtn.addEventListener('click', closeAnnotationDialog);
ui.annotationDialogClose.addEventListener('click', closeAnnotationDialog);
ui.annotationDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeAnnotationDialog(); });
ui.saveAnnotationsBtn.addEventListener('click', saveAnnotationsJson);
ui.loadAnnotationsBtn.addEventListener('click', () => { ui.annotationsFileInput.value = ''; ui.annotationsFileInput.click(); });
ui.annotationsFileInput.addEventListener('change', () => loadAnnotationsJson(ui.annotationsFileInput.files?.[0]));
ui.reportBtn.addEventListener('click', openReportDialog);
ui.reportForm.addEventListener('submit', (event) => event.preventDefault());
ui.reportPdfBtn.addEventListener('click', exportPdfReport);
ui.reportPngBtn.addEventListener('click', exportAnnotatedPng);
ui.reportHtmlBtn.addEventListener('click', exportHtmlReport);
ui.reportCancelBtn.addEventListener('click', closeReportDialog);
ui.reportDialogClose.addEventListener('click', closeReportDialog);
ui.reportDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeReportDialog(); });
[ui.reportIncludeImage, ui.reportIncludeMeasurements, ui.reportIncludeAnnotations, ui.reportIncludeLesson].forEach((control) => control?.addEventListener('change', updateReportSummary));
ui.saveSessionBtn.addEventListener('click', openSessionDialog);
ui.sessionForm.addEventListener('submit', saveSessionFromDialog);
ui.sessionCancelBtn.addEventListener('click', closeSessionDialog);
ui.sessionDialogClose.addEventListener('click', closeSessionDialog);
ui.sessionDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeSessionDialog(); });
ui.libraryBtn.addEventListener('click', showLibrary);
ui.libraryDiagBtn.addEventListener('click', openStartupDiagnostics);
ui.deviceDiagBtn.addEventListener('click', openStartupDiagnostics);
ui.startupDiagClose.addEventListener('click', closeStartupDiagnostics);
ui.startupDiagDoneBtn.addEventListener('click', closeStartupDiagnostics);
ui.startupTestEngineBtn?.addEventListener('click', testOpenSlideEngine);
ui.startupProbeMemoryBtn?.addEventListener('click', () => runWasmMemoryProbe({ notify: true }));
ui.startupCopyDiagBtn?.addEventListener('click', copyStartupDiagnostics);
ui.startupDiagDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeStartupDiagnostics(); });
ui.compareBtn.addEventListener('click', openComparePicker);
ui.compareOpenBtn.addEventListener('click', openComparePicker);
ui.compareEmptyOpenBtn.addEventListener('click', openComparePicker);
ui.compareCloseBtn.addEventListener('click', () => closeCompareMode(true));
ui.compareSyncToggle.addEventListener('change', () => {
  state.compareSync = ui.compareSyncToggle.checked;
  if (state.compareSync && hasCompareSlide()) syncPrimaryToCompare();
  showToast(state.compareSync ? 'Sincronização ativada' : 'Sincronização desativada', 'info');
});
ui.libraryOpenBtn.addEventListener('click', () => { state.pendingLibraryOpen = null; openPicker(); });
ui.libraryEmptyOpenBtn.addEventListener('click', () => { state.pendingLibraryOpen = null; openPicker(); });
ui.librarySearch.addEventListener('input', () => { state.librarySearchQuery = ui.librarySearch.value; renderLibrary(); });
ui.libraryCategoryChips.addEventListener('click', (event) => {
  const button = event.target.closest('[data-library-category]');
  if (!button) return;
  state.libraryFilter = button.dataset.libraryCategory || 'all';
  ui.libraryCategoryChips.querySelectorAll('[data-library-category]').forEach((chip) => chip.classList.toggle('is-active', chip === button));
  renderLibrary();
});
ui.lessonBtn.addEventListener('click', openLessonSetup);
ui.prepareLessonBtn.addEventListener('click', () => setLessonPreparing(!state.lessonPreparing));
ui.presentLessonBtn.addEventListener('click', startLessonPresentation);
ui.lessonTitleInput.addEventListener('input', () => {
  state.lessonTitle = ui.lessonTitleInput.value;
  markProjectDirty();
});
ui.lessonTitleInput.addEventListener('change', () => {
  commitHistory();
  renderLessonPanel();
});
ui.lessonAnnotationSelect.addEventListener('change', () => {
  ui.addLessonStepBtn.disabled = !ui.lessonAnnotationSelect.value;
});
ui.addLessonStepBtn.addEventListener('click', () => {
  const id = Number(ui.lessonAnnotationSelect.value);
  if (!Number.isFinite(id)) return;
  addAnnotationToLesson(id);
});
ui.clearLessonBtn.addEventListener('click', clearLessonSequence);
ui.lessonPrevBtn.addEventListener('click', () => goToLessonStep(state.lessonIndex - 1));
ui.lessonNextBtn.addEventListener('click', () => goToLessonStep(state.lessonIndex + 1));
ui.lessonExitBtn.addEventListener('click', stopLessonPresentation);

ui.brightnessRange.addEventListener('input', () => { state.brightness = Number(ui.brightnessRange.value); markProjectDirty(); applyVisualAdjustments(); savePreferences(); });
ui.contrastRange.addEventListener('input', () => { state.contrast = Number(ui.contrastRange.value); markProjectDirty(); applyVisualAdjustments(); savePreferences(); });
ui.saturationRange.addEventListener('input', () => { state.saturation = Number(ui.saturationRange.value); markProjectDirty(); applyVisualAdjustments(); savePreferences(); });
ui.sharpnessRange.addEventListener('input', () => { state.sharpness = Number(ui.sharpnessRange.value); markProjectDirty(); applyVisualAdjustments(); savePreferences(); });
[ui.brightnessRange, ui.contrastRange, ui.saturationRange, ui.sharpnessRange].forEach((control) => control.addEventListener('change', commitHistory));
ui.highQualityToggle.addEventListener('change', () => { state.highDefinition = ui.highQualityToggle.checked; markProjectDirty(); applyVisualAdjustments(); savePreferences(); commitHistory(); setStatus(state.highDefinition ? 'Modo alta definição ativado.' : 'Modo alta definição desativado.'); });
ui.pixelPerfectToggle.addEventListener('change', () => { state.pixelPerfect = ui.pixelPerfectToggle.checked; markProjectDirty(); if (state.pixelPerfect) goNativePixelZoom(); else { applyVisualAdjustments(); commitHistory(); setStatus('Modo pixel 1:1 desativado.'); } });
ui.maxQualityBtn.addEventListener('click', applyMaximumQualityPreset);
ui.nativeZoomBtn.addEventListener('click', goNativePixelZoom);
ui.perfProfileSelect.addEventListener('change', () => setPerformanceProfileFromUi(ui.perfProfileSelect.value));
ui.startupPerfProfileSelect.addEventListener('change', () => setPerformanceProfileFromUi(ui.startupPerfProfileSelect.value));
ui.memorySafeToggle.addEventListener('change', () => setMemorySafeMode(ui.memorySafeToggle.checked, { userSet: true, notify: true }));
ui.startupSafeModeToggle.addEventListener('change', () => setMemorySafeMode(ui.startupSafeModeToggle.checked, { userSet: true, notify: true }));
ui.rerunBenchmarkBtn.addEventListener('click', () => rerunBenchmarkAction(ui.rerunBenchmarkBtn));
ui.startupRerunBenchmarkBtn.addEventListener('click', () => rerunBenchmarkAction(ui.startupRerunBenchmarkBtn));
ui.resetVisualBtn.addEventListener('click', () => resetVisualAdjustments(true));
ui.undoBtn.addEventListener('click', undoHistory);
ui.redoBtn.addEventListener('click', redoHistory);
ui.panelBtn.addEventListener('click', toggleSidebar);
ui.collapseSidebarBtn.addEventListener('click', () => setSidebarCollapsed(true));
ui.sidebarRevealBtn.addEventListener('click', () => setSidebarCollapsed(false));
ui.sidebarBackdrop.addEventListener('click', closeSidebar);
ui.moreBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMoreMenu();
});
ui.moreMenu.addEventListener('click', (event) => event.stopPropagation());
ui.moreMenu.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => closeMoreMenu()));
document.addEventListener('click', () => closeMoreMenu());
panelTabs.forEach((button, index) => {
  button.addEventListener('click', () => setActivePanel(button.dataset.panelTarget));
  button.addEventListener('keydown', (event) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % panelTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + panelTabs.length) % panelTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = panelTabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const next = panelTabs[nextIndex];
    setActivePanel(next.dataset.panelTarget);
    next.focus();
  });
});
ui.presentationBtn.addEventListener('click', () => setPresentationMode(!state.presentationMode));
ui.presentationExitBtn.addEventListener('click', () => { if (state.lessonPresenting) stopLessonPresentation(); else setPresentationMode(false); });
ui.rotateBtn.addEventListener('click', () => {
  if (!hasOpenSlide()) return;
  state.rotation = (state.rotation + 90) % 360;
  markProjectDirty();
  viewer.viewport.setRotation(state.rotation);
  redrawOverlays();
  commitHistory();
});
ui.fullscreenBtn.addEventListener('click', async () => {
  try {
    closeSidebar();
    if (!document.fullscreenElement) await ui.viewerShell.requestFullscreen();
    else await document.exitFullscreen();
  } catch (error) {
    console.warn('Não foi possível alternar tela cheia:', error);
    setStatus('O navegador bloqueou a troca para tela cheia.');
  }
});

window.addEventListener('keydown', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return;
  if (state.lessonPresenting && event.key === 'ArrowRight') {
    event.preventDefault();
    goToLessonStep(state.lessonIndex + 1);
    return;
  }
  if (state.lessonPresenting && event.key === 'ArrowLeft') {
    event.preventDefault();
    goToLessonStep(state.lessonIndex - 1);
    return;
  }
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === 'z' && !event.shiftKey) {
    event.preventDefault();
    undoHistory();
  } else if (((event.ctrlKey || event.metaKey) && key === 'y') || ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'z')) {
    event.preventDefault();
    redoHistory();
  } else if ((event.ctrlKey || event.metaKey) && key === 's' && hasOpenSlide()) {
    event.preventDefault();
    saveAnnotationsJson();
  } else if ((event.ctrlKey || event.metaKey) && key === 'o') {
    event.preventDefault();
    openPicker();
  } else if (event.key === '+' || event.key === '=') {
    zoomBy(1.4);
  } else if (event.key === '-') {
    zoomBy(1 / 1.4);
  } else if (key === 'f') {
    goHome();
  } else if (key === 'm' && hasOpenSlide() && !event.ctrlKey && !event.metaKey && !event.altKey) {
    toggleMeasureMode();
  } else if (key === 'p' && hasOpenSlide() && !event.ctrlKey && !event.metaKey && !event.altKey) {
    toggleAnnotationMode('marker');
  } else if (key === 'a' && hasOpenSlide() && !event.ctrlKey && !event.metaKey && !event.altKey) {
    toggleAnnotationMode('area');
  } else if (key === 'c' && hasOpenSlide() && !event.ctrlKey && !event.metaKey && !event.altKey) {
    captureViewport();
  } else if (event.key === 'Escape') {
    if (state.lessonPresenting) stopLessonPresentation();
    else if (state.presentationMode) setPresentationMode(false);
    else if (ui.startupDiagDialog?.open) closeStartupDiagnostics();
    else if (ui.reportDialog?.open) closeReportDialog();
    else if (ui.sessionDialog?.open) closeSessionDialog();
    else if (!ui.moreMenu.hidden) closeMoreMenu();
    else if (ui.annotationDialog.open) closeAnnotationDialog();
    else if (!ui.libraryScreen.hidden && hasOpenSlide()) hideLibrary();
    else if (ui.sidebar.classList.contains('open')) closeSidebar();
    else if (state.measureMode) setMeasureMode(false);
    else if (state.annotationMode) setAnnotationMode(null);
  }
});

ui.viewerShell.addEventListener('dragenter', (event) => {
  event.preventDefault();
  state.dragDepth += 1;
  ui.dropOverlay.hidden = false;
});
ui.viewerShell.addEventListener('dragover', (event) => event.preventDefault());
ui.viewerShell.addEventListener('dragleave', (event) => {
  event.preventDefault();
  state.dragDepth = Math.max(0, state.dragDepth - 1);
  if (state.dragDepth === 0) ui.dropOverlay.hidden = true;
});
ui.viewerShell.addEventListener('drop', (event) => {
  event.preventDefault();
  state.dragDepth = 0;
  ui.dropOverlay.hidden = true;
  const file = event.dataTransfer?.files?.[0];
  if (file) openSvs(file);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeSidebar();
  window.requestAnimationFrame(() => {
    if (state.compareActive) {
      try {
        compareViewer.viewport.resize(new OpenSeadragon.Point(ui.compareViewer.clientWidth, ui.compareViewer.clientHeight), true);
        compareViewer.viewport.applyConstraints();
      } catch (_) {}
    }
    redrawOverlays();
  });
});

document.addEventListener('fullscreenchange', () => window.requestAnimationFrame(() => {
  if (state.compareActive) {
    try {
      compareViewer.viewport.resize(new OpenSeadragon.Point(ui.compareViewer.clientWidth, ui.compareViewer.clientHeight), true);
      compareViewer.viewport.applyConstraints();
    } catch (_) {}
  }
  redrawOverlays();
}));

window.addEventListener('beforeunload', (event) => {
  const volatile = hasVolatileWork();
  const autosaved = state.projectDirty ? flushLocalAutosave() : true;
  if (volatile || !autosaved) {
    event.preventDefault();
    event.returnValue = '';
    return;
  }
  try {
    clearFirstTileTimer();
    for (const slide of state.slides) slide.close();
    state.compareSlide?.close?.();
    state.openslide?.terminate();
  } catch (_) {
    // O navegador está encerrando a página.
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && state.projectDirty) flushLocalAutosave();
});

window.addEventListener('pagehide', () => {
  if (state.projectDirty) flushLocalAutosave();
});

function bootstrap() {
  loadPreferences();
  applyStartupMemorySafety();
  if (state.memorySafeMode) state.highDefinition = false;
  migrateAutosavesIntoLibrary();
  setViewerControlsEnabled(false);
  renderMeasurementList();
  renderAnnotationList();
  ui.perfProfileSelect.value = state.performanceProfile;
  ui.startupPerfProfileSelect.value = state.performanceProfile;
  ui.memorySafeToggle.checked = state.memorySafeMode;
  ui.startupSafeModeToggle.checked = state.memorySafeMode;
  setActivePanel(state.activePanel);
  setSidebarCollapsed(state.sidebarCollapsed, false);
  applyVisualAdjustments();
  ui.compatInfo.textContent = diagnosticSummary();
  resetMetadata();
  updateDiagnostics();
  updateStartupDiagnostics();
  runDeviceBenchmark(false)
    .then(() => { applyPerformanceProfile(true); updateDiagnostics(); })
    .catch((error) => console.warn('Benchmark automático indisponível:', error));
  renderLibrary();
  ui.libraryScreen.hidden = false;
  ui.app.classList.add('library-open');

  const compatibilityProblem = getCompatibilityProblem();
  if (compatibilityProblem) {
    setEngineState('Aguardando correção', 'error');
    setStatus(compatibilityProblem);
    showEmptyStateError(compatibilityProblem);
    return;
  }

  setEngineState('Em espera', 'standby');
  setStatus('Biblioteca local · selecione ou abra uma lâmina .SVS');
}

bootstrap();
