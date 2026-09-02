/* oxlint-disable next/no-img-element -- LifeMap is a Vite SPA using a bundled local protagonist asset. */
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  Crown,
  Database,
  Download,
  Eye,
  FilePlus2,
  FileSpreadsheet,
  Filter,
  Flame,
  Footprints,
  Gauge,
  Heart,
  Lightbulb,
  LockKeyhole,
  Map,
  Menu,
  Mountain,
  Palette,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Save,
  Trash2,
  Trophy,
  UploadCloud,
  UserRound,
  Waypoints,
  X,
} from 'lucide-react';
import {
  type CSSProperties,
  type ChangeEvent,
  type DragEvent,
  type SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';

import {
  CHARACTER_BIBLE,
  CHARACTER_BIBLE_BY_ID,
} from '../character-bible';
import {
  analyze,
  availableMonths,
  comparePeriods,
  formatDuration,
  monthLabel,
  percentageChange,
  recordsForMonth,
} from '../analytics';
import { createDemoData } from '../data/demo';
import {
  CANONICAL_FIELDS,
  mappingRecipeKey,
  mergeActivityRecords,
  normalizeRows,
  parseCsv,
  parseJson,
  parseLifeMapPassport,
  suggestMapping,
} from '../data/import';
import {
  downloadCapsule,
  downloadCsv,
  downloadPassport,
} from '../export';
import {
  createCharacterProfile,
  createWorldConfiguration,
} from '../world-generation';
import type {
  ActivityRecord,
  AppView,
  CanonicalField,
  CharacterArchetypeId,
  FieldMapping,
  MappingRecipes,
  PassportImport,
  RawRow,
  ValidationIssue,
} from '../types';
import { FaithfulProtagonist } from './faithful-protagonist';
import { CharacterPortrait, WorldMap } from './world';

const navItems: Array<{ id: AppView; label: string; icon: typeof Map }> = [
  { id: 'world', label: 'World', icon: Map },
  { id: 'character', label: 'Character', icon: UserRound },
  { id: 'timeline', label: 'Journey', icon: CalendarDays },
  { id: 'insights', label: 'Discoveries', icon: Lightbulb },
  { id: 'compare', label: 'Compare', icon: BarChart3 },
  { id: 'data', label: 'Data', icon: FileSpreadsheet },
  { id: 'methodology', label: 'Codex', icon: CircleHelp },
];

const fieldLabels: Record<CanonicalField, string> = {
  date: 'Date',
  activity: 'Activity',
  category: 'Category',
  duration: 'Duration (minutes)',
  startTime: 'Start time',
  endTime: 'End time',
  subcategory: 'Subcategory',
  energy: 'Energy (1–5)',
  mood: 'Mood (1–5)',
  planned: 'Planned',
  completed: 'Completed',
  location: 'Location',
  notes: 'Notes',
};

const accentChoices = ['#e7cc78', '#67d2a7', '#e87969', '#9f8add'];

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function metric(value: number | undefined, suffix = '') {
  return value == null
    ? 'Not recorded'
    : `${value.toFixed(1).replace('.0', '')}${suffix}`;
}

function formatRecordCount(count: number) {
  return `${count} ${count === 1 ? 'record' : 'records'}`;
}

export function LifeMapApp() {
  const demoRecords = useMemo(() => createDemoData(), []);
  const previewAnalytics = useMemo(() => analyze(demoRecords), [demoRecords]);
  const [records, setRecords] = useState<ActivityRecord[] | null>(null);
  const [dataMode, setDataMode] = useState<'demo' | 'user'>('demo');
  const [view, setView] = useState<AppView>('world');
  const [onboarding, setOnboarding] = useState<
    'closed' | 'choose' | 'mapping' | 'manual'
  >('closed');
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>({});
  const [importName, setImportName] = useState('');
  const [importError, setImportError] = useState('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [manualRecords, setManualRecords] = useState<ActivityRecord[]>([]);
  const [mappingRecipes, setMappingRecipes] = useState<MappingRecipes>({});
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [accent, setAccent] = useState('#e7cc78');
  const [avatarStyle, setAvatarStyle] = useState<'trail' | 'city' | 'field'>(
    'trail',
  );
  const [recordFocus, setRecordFocus] = useState<string[] | null>(null);
  const [dailyOpen, setDailyOpen] = useState(false);
  const [pendingPassport, setPendingPassport] = useState<PassportImport | null>(
    null,
  );
  const [notice, setNotice] = useState<{
    tone: 'success' | 'error';
    message: string;
  } | null>(null);
  const [undoState, setUndoState] = useState<{
    records: ActivityRecord[];
    dataMode: 'demo' | 'user';
  } | null>(null);

  const months = useMemo(
    () => (records ? availableMonths(records) : []),
    [records],
  );
  const visibleRecords = useMemo(
    () => (records ? recordsForMonth(records, selectedMonth) : []),
    [records, selectedMonth],
  );
  const analytics = useMemo(() => analyze(visibleRecords), [visibleRecords]);
  const allTimeAnalytics = useMemo(() => analyze(records ?? []), [records]);
  const categoryOrder = useMemo(
    () => allTimeAnalytics.categories.map((category) => category.category),
    [allTimeAnalytics],
  );

  const activeCategory = analytics.categories.some(
    (category) => category.category === selectedCategory,
  )
    ? selectedCategory
    : (analytics.categories[0]?.category ?? '');
  const hudProfile = useMemo(
    () => createCharacterProfile(analytics, activeCategory),
    [analytics, activeCategory],
  );
  const hudXpPercent =
    (analytics.xpInLevel /
      Math.max(1, analytics.xpInLevel + analytics.xpToNext)) *
    100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, records]);

  const begin = (nextRecords: ActivityRecord[], mode: 'demo' | 'user') => {
    setRecords(nextRecords);
    setDataMode(mode);
    setSelectedMonth('all');
    setView('world');
    setOnboarding('closed');
    setSelectedCategory(analyze(nextRecords).categories[0]?.category ?? '');
    setDisplayName('');
  };

  const loadFile = async (file: File) => {
    setImportError('');
    setIssues([]);
    if (file.size > 10 * 1024 * 1024) {
      setImportError('Choose a file smaller than 10 MB. Nothing was uploaded.');
      return;
    }
    try {
      const text = await file.text();
      const isJson =
        file.name.toLowerCase().endsWith('.json') || file.type.includes('json');
      const rows = isJson ? parseJson(text) : parseCsv(text);
      if (!rows.length)
        throw new Error('The file contains no activity objects.');
      const columns = Object.keys(rows[0]);
      setRawRows(rows);
      setMapping(
        mappingRecipes[mappingRecipeKey(columns)] ?? suggestMapping(columns),
      );
      setImportName(file.name);
      setOnboarding('mapping');
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : 'This file could not be read.',
      );
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
  };
  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void loadFile(file);
  };
  const generateImported = () => {
    const result = normalizeRows(rawRows, mapping);
    setIssues(result.issues);
    if (
      result.records.length &&
      !result.issues.some(
        (issue) => issue.row === 0 && issue.severity === 'error',
      )
    ) {
      const columns = rawRows[0] ? Object.keys(rawRows[0]) : [];
      if (columns.length) {
        setMappingRecipes((current) => ({
          ...current,
          [mappingRecipeKey(columns)]: mapping,
        }));
      }
      if (records && dataMode === 'user') {
        const merged = mergeActivityRecords(records, result.records);
        if (!merged.added.length) {
          setImportError('Every valid record is already in this LifeMap. Nothing changed.');
          return;
        }
        setUndoState({ records, dataMode });
        setRecords(merged.records);
        setSelectedMonth('all');
        setSelectedCategory(analyze(merged.records).categories[0]?.category ?? '');
        setOnboarding('closed');
        setNotice({
          tone: 'success',
          message: `${merged.added.length} new ${merged.added.length === 1 ? 'record' : 'records'} added${merged.duplicateCount ? `, ${merged.duplicateCount} duplicate${merged.duplicateCount === 1 ? '' : 's'} skipped` : ''}.`,
        });
      } else {
        begin(result.records, 'user');
        setNotice({
          tone: 'success',
          message: `${result.records.length} ${result.records.length === 1 ? 'record' : 'records'} shaped a new personal realm.`,
        });
      }
      setRawRows([]);
      setImportError('');
    }
  };

  const addManual = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const formString = (name: string) => {
      const value = form.get(name);
      return typeof value === 'string' ? value : '';
    };
    const duration = Number(formString('duration'));
    const record: ActivityRecord = {
      id: `manual-${Date.now()}-${manualRecords.length}`,
      date: formString('date'),
      activity: formString('activity').trim(),
      category: formString('category').trim(),
      startTime: formString('startTime') || undefined,
      duration,
      energy: Number(formString('energy')) || undefined,
      mood: Number(formString('mood')) || undefined,
      planned: form.get('planned') === 'on',
      completed: form.get('completed') === 'on',
      notes: formString('notes').slice(0, 5000) || undefined,
    };
    if (
      !record.date ||
      !record.activity ||
      !record.category ||
      !Number.isFinite(duration) ||
      duration < 0 ||
      duration > 1440
    ) {
      setImportError(
        'Add a valid date, activity, category, and duration from 0 to 1,440 minutes.',
      );
      return;
    }
    setManualRecords((current) => [...current, record]);
    setImportError('');
    event.currentTarget.reset();
  };

  const reset = () => {
    setRecords(null);
    setSelectedMonth('all');
    setSelectedCategory('');
    setRawRows([]);
    setManualRecords([]);
    setIssues([]);
    setImportName('');
    setRecordFocus(null);
    setDisplayName('');
    setMappingRecipes({});
    setDailyOpen(false);
    setPendingPassport(null);
    setNotice(null);
    setUndoState(null);
    setResetOpen(false);
    setMenuOpen(false);
  };

  const openDataInbox = () => {
    setRawRows([]);
    setMapping({});
    setManualRecords([]);
    setIssues([]);
    setImportName('');
    setImportError('');
    setOnboarding('choose');
  };

  const generateManual = () => {
    if (!manualRecords.length) return;
    if (records && dataMode === 'user') {
      const merged = mergeActivityRecords(records, manualRecords);
      if (!merged.added.length) {
        setImportError('Every staged record is already in this LifeMap. Nothing changed.');
        return;
      }
      setUndoState({ records, dataMode });
      setRecords(merged.records);
      setSelectedMonth('all');
      setSelectedCategory(analyze(merged.records).categories[0]?.category ?? '');
      setOnboarding('closed');
      setNotice({
        tone: 'success',
        message: `${merged.added.length} manual ${merged.added.length === 1 ? 'record' : 'records'} added to your realm.`,
      });
    } else {
      begin(manualRecords, 'user');
      setNotice({ tone: 'success', message: 'Your personal realm is ready.' });
    }
    setManualRecords([]);
  };

  const addDailyRecord = (record: ActivityRecord) => {
    const previous = records ?? [];
    const base = records && dataMode === 'user' ? records : [];
    const merged = mergeActivityRecords(base, [record]);
    setUndoState({ records: previous, dataMode });
    setRecords(merged.records);
    setDataMode('user');
    setSelectedMonth('all');
    setSelectedCategory(record.category);
    setDailyOpen(false);
    setView('world');
    setNotice({
      tone: 'success',
      message:
        dataMode === 'demo'
          ? 'Your first personal record replaced the fictional demo realm.'
          : 'Today’s record was added. Your world has been rebuilt.',
    });
  };

  const handlePassportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ tone: 'error', message: 'Choose a Passport smaller than 10 MB.' });
      return;
    }
    try {
      setPendingPassport(parseLifeMapPassport(await file.text()));
      setOnboarding('closed');
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'This Passport could not be restored.',
      });
    }
  };

  const restorePassport = () => {
    if (!pendingPassport) return;
    if (records) setUndoState({ records, dataMode });
    setRecords(pendingPassport.records);
    setDataMode('user');
    setDisplayName(pendingPassport.preferences.displayName);
    setAccent(pendingPassport.preferences.accent);
    setAvatarStyle(pendingPassport.preferences.avatarStyle);
    setMappingRecipes(pendingPassport.mappingRecipes);
    setSelectedMonth('all');
    setSelectedCategory(analyze(pendingPassport.records).categories[0]?.category ?? '');
    setView('world');
    setPendingPassport(null);
    setNotice({
      tone: 'success',
      message: `${formatRecordCount(pendingPassport.records.length)} restored from your LifeMap Passport.`,
    });
  };

  const undoLastChange = () => {
    if (!undoState) return;
    setRecords(undoState.records.length ? undoState.records : null);
    setDataMode(undoState.dataMode);
    setSelectedMonth('all');
    setSelectedCategory(analyze(undoState.records).categories[0]?.category ?? '');
    setUndoState(null);
    setNotice({ tone: 'success', message: 'The last data change was undone.' });
  };

  if (!records) {
    return (
      <Landing
        analytics={previewAnalytics}
        onCreate={() => setOnboarding('choose')}
        onDemo={() => begin(demoRecords, 'demo')}
        onboarding={onboarding}
        setOnboarding={setOnboarding}
        rawRows={rawRows}
        mapping={mapping}
        setMapping={setMapping}
        importName={importName}
        importError={importError}
        issues={issues}
        onFile={handleFile}
        onDrop={handleDrop}
        onGenerateImport={generateImported}
        onManualSubmit={addManual}
        manualRecords={manualRecords}
        onGenerateManual={() =>
          manualRecords.length && generateManual()
        }
        onDemoChoice={() => begin(demoRecords, 'demo')}
        activeRealm={false}
        existingRecords={[]}
        onPassportFile={handlePassportFile}
      />
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="app-topbar game-hud">
        <button
          className="brand-button"
          type="button"
          onClick={() => setView('world')}
          aria-label="LifeMap world"
        >
          <span>
            <Compass />
          </span>
          <b>LifeMap</b>
          <small>Living atlas</small>
        </button>
        <div className="player-hud" aria-label="Protagonist progression">
          <div className="player-token">
            <img src={hudProfile.portraitSrc} alt="" />
          </div>
          <div className="player-identity">
            <span>{displayName || hudProfile.archetypeName}</span>
            <small>{hudProfile.title}</small>
            <i
              aria-label={`${Math.round(hudXpPercent)} percent toward next level`}
            >
              <b style={{ width: `${hudXpPercent}%` }} />
            </i>
          </div>
          <strong>LV {analytics.level}</strong>
        </div>
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          <Menu />
        </button>
        <nav
          className={menuOpen ? 'app-nav open' : 'app-nav'}
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={view === item.id ? 'page' : undefined}
              onClick={() => {
                setView(item.id);
                setMenuOpen(false);
              }}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="world-status" aria-label="Current world state">
          <span>
            <Map />
            <small>Region</small>
            <strong>{activeCategory || 'Unmapped'}</strong>
          </span>
          <span>
            <CalendarDays />
            <small>Era</small>
            <strong>
              {selectedMonth === 'all' ? 'All time' : monthLabel(selectedMonth)}
            </strong>
          </span>
          <span className="dataset-badge">
            <i className={dataMode} />
            <small>{dataMode === 'demo' ? 'Demo realm' : 'Local realm'}</small>
            <strong>{formatRecordCount(records.length)}</strong>
          </span>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="quick-log-action"
            onClick={() => setDailyOpen(true)}
          >
            <Plus /> Log today
          </button>
          <button
            type="button"
            className="icon-action"
            onClick={() => downloadCsv(visibleRecords)}
            aria-label="Download normalized CSV"
          >
            <Download />
          </button>
          <button
            type="button"
            className="reset-action"
            onClick={() => setResetOpen(true)}
          >
            <Trash2 /> Reset
          </button>
        </div>
      </header>

      <main id="main-content" className={`view-shell view-${view}`}>
        {view === 'world' && (
          <WorldView
            analytics={analytics}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            months={months}
            categoryOrder={categoryOrder}
            selectedCategory={activeCategory}
            setSelectedCategory={setSelectedCategory}
            dataMode={dataMode}
            onView={setView}
            onInspectRecords={(ids) => {
              setRecordFocus(ids);
              setView('data');
            }}
            accent={accent}
            avatarStyle={avatarStyle}
            name={displayName || hudProfile.archetypeName}
          />
        )}
        {view === 'character' && (
          <CharacterView
            analytics={analytics}
            currentLocation={activeCategory}
            name={displayName || hudProfile.archetypeName}
            setName={setDisplayName}
            accent={accent}
            setAccent={setAccent}
            style={avatarStyle}
            setStyle={setAvatarStyle}
          />
        )}
        {view === 'timeline' && (
          <TimelineView
            analytics={allTimeAnalytics}
            records={records}
            categoryOrder={categoryOrder}
            selectedMonth={selectedMonth}
            onMonth={setSelectedMonth}
            onEnterWorld={() => setView('world')}
          />
        )}
        {view === 'insights' && <InsightsView analytics={analytics} />}
        {view === 'compare' && (
          <CompareView
            records={records}
            months={months}
            categoryOrder={categoryOrder}
          />
        )}
        {view === 'data' && (
          <DataView
            records={records}
            periodRecords={visibleRecords}
            focusRecordIds={recordFocus}
            onClearFocus={() => setRecordFocus(null)}
            onCsv={() => downloadCsv(visibleRecords)}
            onCapsule={() => downloadCapsule(visibleRecords, analytics)}
            onAddRecords={openDataInbox}
            onPassport={() =>
              downloadPassport(
                records,
                { displayName, accent, avatarStyle },
                mappingRecipes,
              )
            }
            onPassportFile={handlePassportFile}
          />
        )}
        {view === 'methodology' && <MethodologyView />}
      </main>

      <div className="mobile-dock" aria-label="Mobile navigation">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.id}
            aria-label={item.label}
            className={view === item.id ? 'active' : ''}
            type="button"
            onClick={() => setView(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
        <button
          className="daily-action"
          aria-label="Log today"
          type="button"
          onClick={() => setDailyOpen(true)}
        >
          <Plus />
          <span>Log</span>
        </button>
        {navItems.slice(2, 5).map((item) => (
          <button
            key={item.id}
            aria-label={item.label}
            className={view === item.id ? 'active' : ''}
            type="button"
            onClick={() => setView(item.id)}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      {onboarding !== 'closed' && (
        <Onboarding
          analytics={previewAnalytics}
          onCreate={openDataInbox}
          onDemo={() => begin(demoRecords, 'demo')}
          onboarding={onboarding}
          setOnboarding={setOnboarding}
          rawRows={rawRows}
          mapping={mapping}
          setMapping={setMapping}
          importName={importName}
          importError={importError}
          issues={issues}
          onFile={handleFile}
          onDrop={handleDrop}
          onGenerateImport={generateImported}
          onManualSubmit={addManual}
          manualRecords={manualRecords}
          onGenerateManual={generateManual}
          onDemoChoice={() => begin(demoRecords, 'demo')}
          activeRealm={dataMode === 'user'}
          existingRecords={dataMode === 'user' ? records : []}
          onPassportFile={handlePassportFile}
        />
      )}
      {dailyOpen && (
        <DailyDock
          categories={allTimeAnalytics.categories.map((item) => item.category)}
          recentActivities={[...records]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((record) => record.activity)}
          startsNewRealm={dataMode === 'demo'}
          onClose={() => setDailyOpen(false)}
          onSubmit={addDailyRecord}
        />
      )}
      {pendingPassport && (
        <ConfirmPassportRestore
          recordCount={pendingPassport.records.length}
          onCancel={() => setPendingPassport(null)}
          onConfirm={restorePassport}
        />
      )}
      {notice && (
        <output className={`session-notice ${notice.tone}`}>
          <span>{notice.message}</span>
          {undoState && notice.tone === 'success' && (
            <button type="button" onClick={undoLastChange}>Undo</button>
          )}
          <button
            type="button"
            className="notice-close"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            <X />
          </button>
        </output>
      )}
      {resetOpen && (
        <ConfirmReset onCancel={() => setResetOpen(false)} onConfirm={reset} />
      )}
    </div>
  );
}

type LandingProps = {
  analytics: ReturnType<typeof analyze>;
  onCreate: () => void;
  onDemo: () => void;
  onboarding: 'closed' | 'choose' | 'mapping' | 'manual';
  setOnboarding: (value: 'closed' | 'choose' | 'mapping' | 'manual') => void;
  rawRows: RawRow[];
  mapping: FieldMapping;
  setMapping: (mapping: FieldMapping) => void;
  importName: string;
  importError: string;
  issues: ValidationIssue[];
  onFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onGenerateImport: () => void;
  onManualSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  manualRecords: ActivityRecord[];
  onGenerateManual: () => void;
  onDemoChoice: () => void;
  activeRealm: boolean;
  existingRecords: ActivityRecord[];
  onPassportFile: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Landing(props: LandingProps) {
  const { analytics, onCreate, onDemo } = props;
  const previewProfile = createCharacterProfile(
    analytics,
    analytics.categories[0]?.category,
  );
  const [showcaseId, setShowcaseId] = useState<CharacterArchetypeId>(
    previewProfile.archetypeId,
  );
  const showcase = CHARACTER_BIBLE_BY_ID[showcaseId];
  const previewXp =
    (analytics.xpInLevel /
      Math.max(1, analytics.xpInLevel + analytics.xpToNext)) *
    100;
  return (
    <main className="landing-shell">
      <a className="skip-link" href="#privacy">
        Skip to privacy explanation
      </a>
      <header className="landing-nav">
        <div className="brand-static">
          <span>
            <Compass />
          </span>
          <div>
            <strong>LifeMap</strong>
            <small>Your living atlas</small>
          </div>
        </div>
        <div className="device-pill">
          <LockKeyhole /> Your data stays on this device
        </div>
        <Button className="pill-button" onClick={onCreate}>
          Create my LifeMap <ArrowRight />
        </Button>
      </header>
      <section className="landing-hero rpg-landing-hero">
        <div className="hero-copy">
          <p className="overline">
            <span /> Twelve heroes shaped by twelve different lives
          </p>
          <h1>
            Your records forge
            <br />
            the hero you become.
          </h1>
          <p>
            A career-heavy month does not wear the same skin as a season of
            training, study, community, or rest. Your activity changes the
            face, silhouette, equipment, and realm.
          </p>
          <div className="hero-actions">
            <Button className="hero-primary" onClick={onCreate}>
              Create my world <ArrowRight />
            </Button>
            <button type="button" className="text-action" onClick={onDemo}>
              <Sparkles /> Explore fictional demo
            </button>
          </div>
          <div className="trust-row">
            <ShieldCheck />
            <div>
              <strong>Local by design</strong>
              <span>No account · No upload · No AI · No tracking</span>
            </div>
          </div>
        </div>
        <div
          className="hero-world hero-realm"
          aria-label="Fictional LifeMap world preview"
          style={
            {
              '--hero-accent': showcase.palette[0],
              '--hero-secondary': showcase.palette[1],
            } as CSSProperties
          }
        >
          <div className="hero-atmosphere" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hero-map-stage">
            <WorldMap
              analytics={analytics}
              selectedCategory={analytics.categories[0]?.category}
              compact
            />
          </div>
          <div className="hero-wayfinder" aria-hidden="true">
            <i />
            <FaithfulProtagonist
              archetypeId={showcase.id}
              fallbackSrc={showcase.portraitSrc}
              evolutionTier={previewProfile.evolutionTier}
              className="hero-protagonist-3d"
            />
          </div>
          <div className="hero-game-hud">
            <div className="hero-player-token">
              <img src={showcase.portraitSrc} alt="" />
            </div>
            <span>
              <small>{showcase.form} protagonist</small>
              <strong>{showcase.name}</strong>
              <em>{showcase.domainLabel}</em>
            </span>
            <b>LV {analytics.level}</b>
            <i>
              <span style={{ width: `${previewXp}%` }} />
            </i>
          </div>
          <div className="hero-identity-dossier">
            <span>{showcase.form} form</span>
            <strong>{showcase.name}</strong>
            <p>{showcase.identity}</p>
            <small>{showcase.signatureProps.join(' · ')}</small>
          </div>
          <div className="hero-region-readout">
            <small>Current region</small>
            <strong>{analytics.categories[0]?.category}</strong>
            <span>
              {Math.round((analytics.categories[0]?.share ?? 0) * 100)}% of
              tracked time · {analytics.categories[0]?.sessions} records
            </span>
          </div>
          <div className="preview-tag">
            <i /> Living demo realm <span>Fictional data</span>
          </div>
          <div className="hero-roster-picker">
            <div>
              <span>Choose a life pattern</span>
              <small>The exact identity and equipment change with every selection</small>
            </div>
            <ul className="hero-roster-track">
              {CHARACTER_BIBLE.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={entry.id === showcase.id ? 'active' : ''}
                    onClick={() => setShowcaseId(entry.id)}
                    aria-pressed={entry.id === showcase.id}
                    aria-label={`Preview ${entry.name}`}
                    title={entry.name}
                  >
                    <img src={entry.portraitSrc} alt="" />
                    <span>{entry.name.replace('The ', '')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="landing-principles rpg-principles" id="privacy">
        <div>
          <p className="overline">
            <span /> The LifeMap loop
          </p>
          <h2>
            Your records are the world’s
            <br />
            source material.
          </h2>
        </div>
        <div className="world-loop" aria-label="How records create a LifeMap">
          {[
            ['01', 'Data', 'Your normalized activity records'],
            ['02', 'XP', 'Transparent deterministic progression'],
            ['03', 'World', 'Regions, paths, and landmarks'],
            [
              '04',
              'Journey',
              'One of twelve protagonists evolving through history',
            ],
          ].map(([number, title, detail]) => (
            <article key={title}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <small>{detail}</small>
              </div>
              <ChevronRight />
            </article>
          ))}
        </div>
        <div className="principle-grid rpg-oaths">
          <article>
            <LockKeyhole />
            <h3>Private realm</h3>
            <p>
              Files are read with browser APIs and processed in memory. LifeMap
              has no backend or user database.
            </p>
          </article>
          <article>
            <Gauge />
            <h3>Rules, not guesses</h3>
            <p>
              Consistency, XP, trends, and associations use documented
              deterministic formulas instead of generated guesses.
            </p>
          </article>
          <article>
            <Mountain />
            <h3>Every landmark has evidence</h3>
            <p>
              Time shapes district size; consistency shapes development; streaks
              and milestones reveal landmarks.
            </p>
          </article>
        </div>
      </section>
      {props.onboarding !== 'closed' && <Onboarding {...props} />}
    </main>
  );
}

function Onboarding(props: LandingProps) {
  const columns = props.rawRows[0] ? Object.keys(props.rawRows[0]) : [];
  const preview =
    props.onboarding === 'mapping'
      ? normalizeRows(props.rawRows, props.mapping)
      : null;
  const mergePreview = preview
    ? mergeActivityRecords(props.existingRecords, preview.records)
    : null;
  const validToAdd = mergePreview?.added.length ?? preview?.records.length ?? 0;
  const duplicateCount =
    (preview?.duplicateCount ?? 0) + (mergePreview?.duplicateCount ?? 0);
  const rejectedCount =
    preview?.issues.filter((issue) => issue.severity === 'error' && issue.row > 0)
      .length ?? 0;
  return (
    <div className="modal-backdrop" role="presentation">
      <dialog
        open
        className="onboarding-panel"
        aria-labelledby="onboarding-title"
      >
        <button
          className="modal-close"
          type="button"
          onClick={() => props.setOnboarding('closed')}
          aria-label="Close onboarding"
        >
          <X />
        </button>
        {props.onboarding === 'choose' && (
          <>
            <p className="step-label">
              {props.activeRealm ? 'Grow your realm' : 'Step 1 of 3'}
            </p>
            <h2 id="onboarding-title">
              {props.activeRealm
                ? 'Bring more of your life into view.'
                : 'How would you like to begin?'}
            </h2>
            <p className="panel-lead">
              {props.activeRealm
                ? 'New records are checked against your current archive before anything changes.'
                : 'No registration. Nothing you choose leaves this browser.'}
            </p>
            <div
              className="choice-grid with-passport"
              onDragOver={(event) => event.preventDefault()}
              onDrop={props.onDrop}
            >
              <label className="choice-card upload-choice">
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={props.onFile}
                />
                <UploadCloud />
                <strong>Import data</strong>
                <span>
                  Drop a CSV or JSON file, or choose one from this device.
                </span>
                <em>CSV · JSON · max 10 MB</em>
              </label>
              <button
                className="choice-card"
                type="button"
                onClick={() => props.setOnboarding('manual')}
              >
                <Plus />
                <strong>Enter data</strong>
                <span>Add activities one at a time with a simple form.</span>
                <em>Best for a small LifeMap</em>
              </button>
              <label className="choice-card upload-choice">
                <input
                  type="file"
                  accept=".lifemap,.json,application/json"
                  onChange={props.onPassportFile}
                />
                <Save />
                <strong>Restore Passport</strong>
                <span>
                  Continue a LifeMap you deliberately backed up on another device.
                </span>
                <em>Validated local backup</em>
              </label>
              {!props.activeRealm && (
                <button
                  className="choice-card"
                  type="button"
                  onClick={props.onDemoChoice}
                >
                  <Sparkles />
                  <strong>Explore demo</strong>
                  <span>
                    Enter a deterministic fictional world with months of activity.
                  </span>
                  <em>No personal data</em>
                </button>
              )}
            </div>
            {props.importError && (
              <p className="form-error" role="alert">
                {props.importError}
              </p>
            )}
            <div className="privacy-note">
              <LockKeyhole />
              <p>
                <strong>What “stays on this device” means</strong>
                <br />
                The file is read into browser memory. LifeMap does not call an
                upload endpoint, create an account, or silently save your
                activity data.
              </p>
            </div>
          </>
        )}
        {props.onboarding === 'mapping' && (
          <>
            <p className="step-label">Step 2 of 3 · {props.importName}</p>
            <h2 id="onboarding-title">Check the field mapping.</h2>
            <p className="panel-lead">
              We detected likely matches. Required fields are marked; change any
              assumption before generating the world.
            </p>
            <div className="mapping-grid">
              {CANONICAL_FIELDS.map((field) => (
                <label key={field}>
                  <span>
                    {fieldLabels[field]}
                    {['date', 'activity', 'category'].includes(field) && (
                      <b>Required</b>
                    )}
                  </span>
                  <select
                    value={props.mapping[field] ?? ''}
                    onChange={(event) =>
                      props.setMapping({
                        ...props.mapping,
                        [field]: event.target.value || undefined,
                      })
                    }
                  >
                    <option value="">Not provided</option>
                    {columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            {preview && (
              <div className="import-preview" aria-label="Import preview">
                <span><strong>{validToAdd}</strong> new</span>
                <span><strong>{duplicateCount}</strong> duplicates skipped</span>
                <span><strong>{rejectedCount}</strong> rejected</span>
                <p>
                  {props.activeRealm
                    ? `Your archive will grow from ${props.existingRecords.length} to ${props.existingRecords.length + validToAdd} records.`
                    : 'Only valid records will shape the new realm.'}
                </p>
              </div>
            )}
            {props.issues.length > 0 && (
              <output className="issue-list">
                {props.issues.slice(0, 8).map((issue, index) => (
                  <p key={`${issue.row}-${index}`} className={issue.severity}>
                    {issue.row ? `Row ${issue.row}: ` : ''}
                    {issue.message}
                  </p>
                ))}
              </output>
            )}
            <div className="panel-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={() => props.setOnboarding('choose')}
              >
                Back
              </button>
              <Button
                className="hero-primary"
                disabled={!validToAdd}
                onClick={props.onGenerateImport}
              >
                {props.activeRealm ? `Add ${validToAdd} records` : 'Generate world'} <ArrowRight />
              </Button>
            </div>
          </>
        )}
        {props.onboarding === 'manual' && (
          <>
            <p className="step-label">Step 2 of 3</p>
            <h2 id="onboarding-title">Add a few activity records.</h2>
            <p className="panel-lead">
              Date, activity, and category are required. Duration is stored as
              minutes.
            </p>
            <form className="manual-form" onSubmit={props.onManualSubmit}>
              <label>
                Date
                <input name="date" type="date" required />
              </label>
              <label>
                Activity
                <input
                  name="activity"
                  required
                  maxLength={240}
                  placeholder="e.g. Practiced guitar"
                />
              </label>
              <label>
                Category
                <input
                  name="category"
                  required
                  maxLength={120}
                  placeholder="e.g. Creative"
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  name="duration"
                  type="number"
                  min="0"
                  max="1440"
                  required
                  placeholder="60"
                />
              </label>
              <label>
                Start time
                <input name="startTime" type="time" />
              </label>
              <label>
                Energy (1–5)
                <input name="energy" type="number" min="1" max="5" />
              </label>
              <label>
                Mood (1–5)
                <input name="mood" type="number" min="1" max="5" />
              </label>
              <label className="full-field">
                Notes
                <textarea
                  name="notes"
                  maxLength={5000}
                  placeholder="Optional context"
                />
              </label>
              <label className="check-field">
                <input name="planned" type="checkbox" /> Planned
              </label>
              <label className="check-field">
                <input name="completed" type="checkbox" /> Completed
              </label>
              <button className="add-record" type="submit">
                <Plus /> Add record
              </button>
            </form>
            {props.importError && (
              <p className="form-error" role="alert">
                {props.importError}
              </p>
            )}
            <div className="manual-list">
              <strong>{formatRecordCount(props.manualRecords.length)} ready</strong>
              {props.manualRecords.slice(-3).map((record) => (
                <span key={record.id}>
                  {record.date} · {record.activity} · {record.category} ·{' '}
                  {record.duration}m
                </span>
              ))}
            </div>
            <div className="panel-actions">
              <button
                type="button"
                className="secondary-action"
                onClick={() => props.setOnboarding('choose')}
              >
                Back
              </button>
              <Button
                className="hero-primary"
                disabled={!props.manualRecords.length}
                onClick={props.onGenerateManual}
              >
                {props.activeRealm ? 'Add to world' : 'Generate world'} <ArrowRight />
              </Button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}

function WorldView({
  analytics,
  selectedMonth,
  setSelectedMonth,
  months,
  categoryOrder,
  selectedCategory,
  setSelectedCategory,
  dataMode,
  onView,
  onInspectRecords,
  accent,
  avatarStyle,
  name,
}: {
  analytics: ReturnType<typeof analyze>;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  months: string[];
  categoryOrder: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  dataMode: 'demo' | 'user';
  onView: (view: AppView) => void;
  onInspectRecords: (ids: string[]) => void;
  accent: string;
  avatarStyle: 'trail' | 'city' | 'field';
  name: string;
}) {
  const world = useMemo(
    () => createWorldConfiguration(analytics, selectedMonth, categoryOrder),
    [analytics, selectedMonth, categoryOrder],
  );
  const [selectedLandmarkId, setSelectedLandmarkId] = useState('');
  const district =
    world.districts.find((item) => item.category === selectedCategory) ??
    world.districts[0];
  const landmark =
    world.districts
      .flatMap((item) => item.landmarks)
      .find((item) => item.id === selectedLandmarkId) ?? district?.landmarks[0];
  const protagonist = createCharacterProfile(analytics, district?.category);
  if (!analytics.records.length)
    return (
      <EmptyState
        title="This period is unexplored."
        detail="Choose another period or add records to reveal this part of your world."
        action={() => setSelectedMonth('all')}
        actionLabel="Show all time"
      />
    );
  return (
    <section className="world-view world-v2">
      <div className="world-sky" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <header className="world-command">
        <div>
          <p className="overline">
            <span />{' '}
            {dataMode === 'demo'
              ? 'Fictional expedition'
              : 'Personal expedition'}
          </p>
          <h1>
            {selectedMonth === 'all'
              ? 'The living atlas'
              : monthLabel(selectedMonth)}
          </h1>
          <p>
            {formatDate(analytics.dateStart)} to {formatDate(analytics.dateEnd)}{' '}
            · rebuilt from {formatRecordCount(analytics.records.length)}
          </p>
        </div>
        <div className="world-vitals" aria-label="World summary">
          <span>
            <small>Tracked</small>
            <strong>{formatDuration(analytics.totalMinutes)}</strong>
          </span>
          <span>
            <small>Rhythm</small>
            <strong>
              {analytics.consistency}
              <em>/100</em>
            </strong>
          </span>
          <span>
            <small>Level</small>
            <strong>{analytics.level}</strong>
          </span>
        </div>
        <label className="era-switcher">
          <span>World era</span>
          <select
            value={selectedMonth}
            onChange={(event) => {
              setSelectedLandmarkId('');
              setSelectedMonth(event.target.value);
            }}
          >
            <option value="all">All recorded time</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {monthLabel(month)}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="exploration-stage">
        <div className="world-map-frame">
          <WorldMap
            analytics={analytics}
            periodKey={selectedMonth}
            categoryOrder={categoryOrder}
            selectedCategory={selectedCategory}
            selectedLandmarkId={landmark?.id}
            onSelect={(category) => {
              setSelectedCategory(category);
              const nextDistrict = world.districts.find(
                (item) => item.category === category,
              );
              setSelectedLandmarkId(nextDistrict?.landmarks[0]?.id ?? '');
            }}
            onLandmarkSelect={(item) => setSelectedLandmarkId(item.id)}
            accent={accent}
            avatarStyle={avatarStyle}
          />
        </div>

        <aside
          className="wayfinder-presence"
          aria-label="Current protagonist state"
        >
          <div className="wayfinder-halo" aria-hidden="true" />
          <FaithfulProtagonist
            archetypeId={protagonist.archetypeId}
            fallbackSrc={protagonist.portraitSrc}
            evolutionTier={protagonist.evolutionTier}
            className="world-protagonist-3d"
            label={`${protagonist.archetypeName}, the data-selected LifeMap protagonist`}
          />
          <div className="wayfinder-state">
            <span>Current protagonist</span>
            <strong>{name || protagonist.archetypeName}</strong>
            <small>
              {protagonist.archetypeName} · {protagonist.title} · exploring{' '}
              {protagonist.currentLocation}
            </small>
            <button type="button" onClick={() => onView('character')}>
              Open character <ChevronRight />
            </button>
          </div>
        </aside>

        <nav className="district-compass" aria-label="Explore districts">
          <p>
            <span>Districts</span>
            <small>Select a place</small>
          </p>
          <div>
            {world.districts.map((item) => (
              <button
                type="button"
                key={item.category}
                className={item.category === district?.category ? 'active' : ''}
                onClick={() => {
                  setSelectedCategory(item.category);
                  setSelectedLandmarkId(item.landmarks[0]?.id ?? '');
                }}
              >
                <i style={{ '--district': item.color } as React.CSSProperties}>
                  {item.development}
                </i>
                <span>
                  <strong>{item.category}</strong>
                  <small>{item.stage}</small>
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="era-reveal" key={world.fingerprint} aria-hidden="true">
          <span>
            {selectedMonth === 'all'
              ? 'All eras aligned'
              : monthLabel(selectedMonth)}
          </span>
        </div>
      </div>

      {district && landmark && (
        <aside className="discovery-ribbon">
          <div
            className="discovery-mark"
            style={{ '--district': district.color } as React.CSSProperties}
          >
            <span>{district.development}</span>
            <small>Stage</small>
          </div>
          <div className="discovery-copy">
            <span>
              {landmark.kind} discovery · {district.category}
            </span>
            <h2>{landmark.title}</h2>
            <p>{landmark.represents}</p>
          </div>
          <dl>
            <div>
              <dt>Evidence</dt>
              <dd>{landmark.metric}</dd>
            </div>
            <div>
              <dt>Leading activity</dt>
              <dd>{district.leadingActivity}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => onInspectRecords(landmark.sourceRecordIds)}
          >
            Trace {landmark.sourceRecordIds.length} records <ChevronRight />
          </button>
          <button
            className="method-link"
            type="button"
            onClick={() => onView('methodology')}
          >
            Why it appeared
          </button>
        </aside>
      )}
    </section>
  );
}

function EquipmentIcon({ id }: { id: string }) {
  if (id === 'codex') return <BookOpenCheck />;
  if (id === 'satchel') return <Database />;
  if (id === 'bracers') return <Activity />;
  if (id === 'lantern') return <Flame />;
  if (id === 'keepsake') return <Heart />;
  if (id === 'sketchbook') return <Palette />;
  return <Compass />;
}

function CharacterView({
  analytics,
  currentLocation,
  name,
  setName,
  accent,
  setAccent,
  style,
  setStyle,
}: {
  analytics: ReturnType<typeof analyze>;
  currentLocation: string;
  name: string;
  setName: (name: string) => void;
  accent: string;
  setAccent: (color: string) => void;
  style: 'trail' | 'city' | 'field';
  setStyle: (style: 'trail' | 'city' | 'field') => void;
}) {
  const profile = useMemo(
    () => createCharacterProfile(analytics, currentLocation),
    [analytics, currentLocation],
  );
  const xpPercent =
    (analytics.xpInLevel /
      Math.max(1, analytics.xpInLevel + analytics.xpToNext)) *
    100;
  return (
    <section className="character-view character-rpg">
      <div className="character-sanctum">
        <div className="sanctum-atmosphere" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <header className="character-identity">
          <p className="overline">
            <span /> Protagonist record
          </p>
          <span className="evolution-state">
            <Crown /> {profile.archetypeName} · {profile.evolutionLabel}
          </span>
          <h1>{name || profile.archetypeName}</h1>
          <h2>{profile.title}</h2>
          <p className="archetype-origin">{profile.archetypeDescription}</p>
          <p className="archetype-evidence">
            <strong>Why this form:</strong> {profile.archetypeEvidence} The
            archetype visualizes an activity pattern; it does not infer your
            gender.
          </p>
          <p className="character-location">
            <Map /> Exploring <strong>{profile.currentLocation}</strong>
          </p>
          <div className="character-xp">
            <strong>Level {analytics.level}</strong>
            <i>
              <b style={{ width: `${xpPercent}%` }} />
            </i>
            <span>
              {analytics.xpInLevel.toLocaleString()} /{' '}
              {(analytics.xpInLevel + analytics.xpToNext).toLocaleString()} XP
            </span>
          </div>
          <small>
            Progress reflects recorded engagement. It does not measure worth,
            morality, or performance.
          </small>
        </header>

        <div className="character-stage">
          <div className="character-render-switch canonical-form-badge">
            Canonical living portrait
          </div>
          <CharacterPortrait
            profile={profile}
            accent={accent}
            style={style}
            name={name}
          />
          <p className="character-render-note">
            The authoritative character design with spatial depth, light, and
            movement. No substitute face or body.
          </p>
        </div>

        <aside className="character-loadout" aria-label="Data-earned equipment">
          <div className="loadout-title">
            <span>Equipped domains</span>
            <small>Derived from activity share</small>
          </div>
          {profile.equipment.map((item) => (
            <article key={item.id}>
              <i>
                <EquipmentIcon id={item.id} />
              </i>
              <div>
                <strong>{item.name}</strong>
                <span>{item.category ?? 'Core equipment'}</span>
                <small>{item.reason}</small>
              </div>
            </article>
          ))}
        </aside>

        <section
          className="attribute-console"
          aria-label="Character attributes"
        >
          <div className="attribute-console-title">
            <span>Recorded attributes</span>
            <small>Evidence-backed</small>
          </div>
          {profile.attributes.map((attribute) => (
            <article key={attribute.id} title={attribute.evidence}>
              <span>{attribute.label}</span>
              <strong>{attribute.value}</strong>
              <i>
                <b style={{ width: `${attribute.value}%` }} />
              </i>
              <small>{attribute.evidence}</small>
            </article>
          ))}
        </section>

        <div className="character-customizer">
          <label>
            <span>Display name</span>
            <input
              value={name}
              maxLength={40}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <fieldset>
            <legend>Journey style</legend>
            {(['trail', 'city', 'field'] as const).map((value) => (
              <button
                type="button"
                key={value}
                className={style === value ? 'active' : ''}
                onClick={() => setStyle(value)}
              >
                {value}
              </button>
            ))}
          </fieldset>
          <fieldset className="accent-fieldset">
            <legend>Sigil color</legend>
            {accentChoices.map((color) => (
              <button
                type="button"
                aria-label={`Use ${color} accent`}
                key={color}
                className={accent === color ? 'active color' : 'color'}
                style={{ background: color }}
                onClick={() => setAccent(color)}
              >
                {accent === color && <Check />}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      <section
        className="original-form-archive"
        aria-labelledby="original-form-title"
      >
        <div className="section-legend original-form-heading">
          <div>
            <p className="overline">
              <span /> Original form archive
            </p>
            <h2 id="original-form-title">
              Twelve identities. No interchangeable bodies.
            </h2>
          </div>
          <p>
            Activity chooses the protagonist form. It never rewrites the face,
            age, body, heritage, wardrobe, or signature tools that make that
            character recognizable.
          </p>
        </div>
        <div className="original-form-grid">
          {CHARACTER_BIBLE.map((entry) => {
            const selected = entry.id === profile.archetypeId;
            return (
              <article
                key={entry.id}
                className={selected ? 'selected' : ''}
                aria-current={selected ? 'true' : undefined}
              >
                <figure>
                  <img
                    src={entry.portraitSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  {selected && <figcaption>Your current form</figcaption>}
                  {entry.productionPriority && !selected && (
                    <figcaption>
                      3D blueprint priority {entry.productionPriority}
                    </figcaption>
                  )}
                </figure>
                <div>
                  <span>
                    {entry.domainLabel} · {entry.form}
                  </span>
                  <h3>{entry.name}</h3>
                  <p>{entry.identity}</p>
                  <ul aria-label={`${entry.name} locked design traits`}>
                    <li>Face locked</li>
                    <li>Silhouette locked</li>
                    <li>Gear locked</li>
                  </ul>
                  <small>{entry.signatureProps.join(' · ')}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="category-constellation">
        <div className="section-legend">
          <div>
            <p className="overline">
              <span /> Domain mastery
            </p>
            <h2>Skills forged by recorded time.</h2>
          </div>
          <small>XP rules are published in the Codex.</small>
        </div>
        <div className="skill-paths">
          {analytics.categories.map((category, index) => (
            <article
              key={category.category}
              style={{ '--skill-order': index } as React.CSSProperties}
            >
              <i>
                <Star />
              </i>
              <div>
                <span>{category.category}</span>
                <strong>Level {category.level}</strong>
                <small>
                  {category.xp.toLocaleString()} XP · {category.xpToNext} to
                  next
                </small>
              </div>
              <b>
                <span
                  style={{
                    width: `${(category.xpInLevel / Math.max(1, category.xpInLevel + category.xpToNext)) * 100}%`,
                  }}
                />
              </b>
            </article>
          ))}
        </div>
      </section>

      <section className="achievement-section achievement-chronicle">
        <div className="section-legend">
          <div>
            <p className="overline">
              <span /> Collected milestones
            </p>
            <h2>The achievement chronicle.</h2>
          </div>
          <strong>
            {
              profile.achievements.filter((achievement) => achievement.unlocked)
                .length
            }{' '}
            / {profile.achievements.length} discovered
          </strong>
        </div>
        <div className="achievement-grid">
          {profile.achievements.map((achievement) => (
            <article
              key={achievement.id}
              className={achievement.unlocked ? 'unlocked' : 'locked'}
            >
              <i>{achievement.unlocked ? <Trophy /> : <LockKeyhole />}</i>
              <div>
                <span>
                  {achievement.unlocked ? 'Discovered' : 'Undiscovered'}
                </span>
                <strong>{achievement.title}</strong>
                <p>{achievement.description}</p>
                <small>
                  <b>Rule</b> {achievement.rule}
                  <br />
                  <b>Evidence</b> {achievement.evidence}
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="record-strip">
        <article>
          <Footprints />
          <span>
            Longest streak<strong>{analytics.longestStreak} days</strong>
          </span>
        </article>
        <article>
          <Activity />
          <span>
            Longest session
            <strong>
              {analytics.longestSession
                ? formatDuration(analytics.longestSession.duration)
                : 'Not recorded'}
            </strong>
          </span>
        </article>
        <article>
          <BookOpenCheck />
          <span>
            Planned completion
            <strong>
              {analytics.completionRate == null
                ? 'Not enough data'
                : `${Math.round(analytics.completionRate * 100)}%`}
            </strong>
          </span>
        </article>
      </div>
    </section>
  );
}

function TimelineView({
  analytics,
  records,
  categoryOrder,
  selectedMonth,
  onMonth,
  onEnterWorld,
}: {
  analytics: ReturnType<typeof analyze>;
  records: ActivityRecord[];
  categoryOrder: string[];
  selectedMonth: string;
  onMonth: (month: string) => void;
  onEnterWorld: () => void;
}) {
  const selectedAnalytics =
    selectedMonth === 'all'
      ? analytics
      : analyze(recordsForMonth(records, selectedMonth));
  const selectedWorld = createWorldConfiguration(
    selectedAnalytics,
    selectedMonth,
    categoryOrder,
  );
  const selectedProfile = createCharacterProfile(
    selectedAnalytics,
    selectedAnalytics.categories[0]?.category,
  );
  const maxDay = Math.max(
    ...analytics.dailyMinutes.map((item) => item.minutes),
    1,
  );
  return (
    <section className="timeline-view journey-view">
      <header className="journey-heading">
        <div>
          <p className="overline">
            <span /> Chronicle of recorded worlds
          </p>
          <h1>Travel through your history.</h1>
        </div>
        <p>
          Select an era. Terrain, districts, landmarks, XP, and the protagonist
          are reconstructed from only that period’s records.
        </p>
      </header>

      <div className="time-gate" data-era={selectedMonth}>
        <div className="time-gate-rings" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="time-world" key={selectedWorld.fingerprint}>
          <WorldMap
            analytics={selectedAnalytics}
            periodKey={selectedMonth}
            categoryOrder={categoryOrder}
            selectedCategory={selectedAnalytics.categories[0]?.category}
            compact
          />
        </div>
        <div
          className={`time-wayfinder evolution-${selectedProfile.evolutionTier}`}
          aria-hidden="true"
        >
          <i />
          <FaithfulProtagonist
            archetypeId={selectedProfile.archetypeId}
            fallbackSrc={selectedProfile.portraitSrc}
            evolutionTier={selectedProfile.evolutionTier}
            className="time-protagonist-3d"
          />
        </div>
        <div className="era-title" key={`title-${selectedWorld.fingerprint}`}>
          <span>
            {selectedMonth === 'all'
              ? 'Complete chronicle'
              : 'Reconstructed era'}
          </span>
          <h2>
            {selectedMonth === 'all'
              ? 'All recorded time'
              : monthLabel(selectedMonth)}
          </h2>
          <p>
            {formatRecordCount(selectedAnalytics.records.length)} ·{' '}
            {formatDuration(selectedAnalytics.totalMinutes)} ·{' '}
            {selectedWorld.districts.length} regions
          </p>
        </div>
        <div className="era-character-state">
          <small>Protagonist state</small>
          <strong>Level {selectedProfile.level}</strong>
          <span>
            {selectedProfile.archetypeName} · {selectedProfile.evolutionLabel}
          </span>
          <em>{selectedProfile.title}</em>
        </div>
        <Button className="enter-era" onClick={onEnterWorld}>
          Enter this world <ArrowRight />
        </Button>
        <div
          className="time-shift"
          key={`shift-${selectedWorld.fingerprint}`}
          aria-hidden="true"
        >
          <span>World state aligned</span>
        </div>
      </div>

      <nav className="era-rail" aria-label="Choose a historical world state">
        <button
          type="button"
          className={selectedMonth === 'all' ? 'active' : ''}
          onClick={() => onMonth('all')}
        >
          <i>
            <Waypoints />
          </i>
          <span>
            <strong>All eras</strong>
            <small>{formatDuration(analytics.totalMinutes)}</small>
          </span>
        </button>
        {analytics.monthlyMinutes.map((item, index) => {
          const monthAnalytics = analyze(recordsForMonth(records, item.month));
          return (
            <button
              type="button"
              key={item.month}
              className={selectedMonth === item.month ? 'active' : ''}
              onClick={() => onMonth(item.month)}
            >
              <em>{String(index + 1).padStart(2, '0')}</em>
              <span>
                <strong>{monthLabel(item.month)}</strong>
                <small>
                  {formatDuration(item.minutes)} · level {monthAnalytics.level}
                </small>
              </span>
              <i>
                <ChevronRight />
              </i>
            </button>
          );
        })}
      </nav>

      <div className="history-river">
        <div className="river-copy">
          <span className="overline">
            <i /> The trail beneath every era
          </span>
          <h2>Recorded intensity, day by day.</h2>
          <p>
            Dim cells show gaps, not failure. The map only reveals what you
            chose to track.
          </p>
          <dl>
            <div>
              <dt>Longest streak</dt>
              <dd>{analytics.longestStreak} days</dd>
            </div>
            <div>
              <dt>Longest gap</dt>
              <dd>{analytics.longestGap} days</dd>
            </div>
          </dl>
        </div>
        <div className="heat-field" aria-label="Daily tracked time heat map">
          {analytics.dailyMinutes.map((day) => (
            <span
              key={day.date}
              title={`${day.date}: ${formatDuration(day.minutes)}`}
              style={
                {
                  '--heat': Math.max(0.12, day.minutes / maxDay),
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className="timeline-events chronicle-events">
        {analytics.insights.slice(0, 4).map((insight, index) => (
          <article key={insight.id}>
            <i>
              <Route />
            </i>
            <div>
              <span>
                Chapter {String(index + 1).padStart(2, '0')} ·{' '}
                {index === 0 ? analytics.dateStart : 'Observed record'}
              </span>
              <strong>{insight.title}</strong>
              <p>{insight.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InsightsView({
  analytics,
}: {
  analytics: ReturnType<typeof analyze>;
}) {
  return (
    <section className="insights-view discoveries-view">
      <div className="view-heading discovery-heading">
        <div>
          <p className="overline">
            <span /> World intelligence
          </p>
          <h1>Discoveries with receipts.</h1>
          <p>
            The atlas records defensible patterns rather than predictions. Every
            observation opens back onto a calculation.
          </p>
        </div>
        <div className="sample-badge">
          <Eye />
          <strong>{analytics.records.length}</strong>
          <span>records observed</span>
        </div>
      </div>
      {analytics.insights.length ? (
        <div className="discovery-log">
          {analytics.insights.map((insight, index) => (
            <article
              key={insight.id}
              className={`discovery-entry tone-${insight.tone}`}
            >
              <span className="insight-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <i className="discovery-glyph">
                {insight.tone === 'up' ? (
                  <Sparkles />
                ) : insight.tone === 'down' ? (
                  <Filter />
                ) : (
                  <Compass />
                )}
              </i>
              <div>
                <span>Recorded observation</span>
                <h2>{insight.title}</h2>
                <p>{insight.detail}</p>
              </div>
              <aside>
                <small>Supporting calculation</small>
                <strong>{insight.evidence}</strong>
              </aside>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No supported insight yet."
          detail="Add more records or choose a wider period to reveal defensible patterns."
        />
      )}
      <div className="association-section intelligence-chamber">
        <div>
          <p className="overline">
            <span /> Co-occurrence chamber
          </p>
          <h2>What appeared together?</h2>
          <p>
            Group-mean comparisons require at least five observations inside and
            outside the group.
          </p>
        </div>
        {analytics.associations.length ? (
          <div className="association-readings">
            {analytics.associations.map((association) => (
              <article key={association.label}>
                <i>
                  <Award />
                </i>
                <strong>{association.label}</strong>
                <p>{association.detail}</p>
                <small>Sample size n = {association.sampleSize}</small>
              </article>
            ))}
          </div>
        ) : (
          <div className="not-enough">
            <CircleHelp />
            <strong>Not enough data.</strong>
            <span>
              Add optional energy or mood values across multiple categories.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function CompareView({
  records,
  months,
  categoryOrder,
}: {
  records: ActivityRecord[];
  months: string[];
  categoryOrder: string[];
}) {
  const [firstMonth, setFirstMonth] = useState(
    months.at(-2) ?? months[0] ?? '',
  );
  const [secondMonth, setSecondMonth] = useState(
    months.at(-1) ?? months[0] ?? '',
  );
  if (months.length < 2)
    return (
      <EmptyState
        title="Not enough historical data for comparison."
        detail="Import records spanning at least two calendar months."
      />
    );
  const comparison = comparePeriods(
    recordsForMonth(records, firstMonth),
    recordsForMonth(records, secondMonth),
    monthLabel(firstMonth),
    monthLabel(secondMonth),
  );
  const firstAnalytics = analyze(recordsForMonth(records, firstMonth));
  const secondAnalytics = analyze(recordsForMonth(records, secondMonth));
  const firstWorld = createWorldConfiguration(
    firstAnalytics,
    firstMonth,
    categoryOrder,
  );
  const secondWorld = createWorldConfiguration(
    secondAnalytics,
    secondMonth,
    categoryOrder,
  );
  const firstProfile = createCharacterProfile(
    firstAnalytics,
    firstAnalytics.categories[0]?.category,
  );
  const secondProfile = createCharacterProfile(
    secondAnalytics,
    secondAnalytics.categories[0]?.category,
  );
  const rows = [
    [
      'Tracked time',
      formatDuration(comparison.first.totalMinutes),
      formatDuration(comparison.second.totalMinutes),
      percentageChange(comparison.changes.trackedTime),
    ],
    [
      'Sessions',
      String(comparison.first.sessions),
      String(comparison.second.sessions),
      percentageChange(comparison.changes.sessions),
    ],
    [
      'Active days',
      String(comparison.first.activeDays),
      String(comparison.second.activeDays),
      percentageChange(comparison.changes.activeDays),
    ],
    [
      'Consistency',
      String(comparison.first.consistency),
      String(comparison.second.consistency),
      `${comparison.changes.consistency >= 0 ? '+' : ''}${comparison.changes.consistency} pts`,
    ],
    [
      'Planned completion',
      comparison.first.completionRate == null
        ? 'Not recorded'
        : `${Math.round(comparison.first.completionRate * 100)}%`,
      comparison.second.completionRate == null
        ? 'Not recorded'
        : `${Math.round(comparison.second.completionRate * 100)}%`,
      comparison.changes.completion == null
        ? 'Not enough data'
        : percentageChange(comparison.changes.completion),
    ],
    [
      'Recorded energy',
      metric(comparison.first.averageEnergy),
      metric(comparison.second.averageEnergy),
      comparison.changes.energy == null
        ? 'Not enough data'
        : `${comparison.changes.energy >= 0 ? '+' : ''}${comparison.changes.energy.toFixed(1)}`,
    ],
    [
      'Recorded mood',
      metric(comparison.first.averageMood),
      metric(comparison.second.averageMood),
      comparison.changes.mood == null
        ? 'Not enough data'
        : `${comparison.changes.mood >= 0 ? '+' : ''}${comparison.changes.mood.toFixed(1)}`,
    ],
  ];
  const categories = [
    ...new Set([
      ...comparison.first.categories.map((category) => category.category),
      ...comparison.second.categories.map((category) => category.category),
    ]),
  ];
  return (
    <section className="compare-view atlas-compare">
      <div className="view-heading">
        <div>
          <p className="overline">
            <span /> Parallel chapters
          </p>
          <h1>Stand between two worlds.</h1>
          <p>
            Change is shown neutrally. More recorded time is not inherently
            better.
          </p>
        </div>
      </div>
      <div className="compare-selectors chapter-selectors">
        <label>
          Earlier period
          <select
            value={firstMonth}
            onChange={(event) => setFirstMonth(event.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {monthLabel(month)}
              </option>
            ))}
          </select>
        </label>
        <span>
          <Waypoints /> versus
        </span>
        <label>
          Later period
          <select
            value={secondMonth}
            onChange={(event) => setSecondMonth(event.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {monthLabel(month)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="compare-worlds atlas-spread">
        <article className="chapter-world chapter-a">
          <div className="chapter-kicker">
            <span>World A</span>
            <small>Earlier chapter</small>
          </div>
          <div className="chapter-scene">
            <WorldMap
              analytics={firstAnalytics}
              periodKey={firstMonth}
              categoryOrder={categoryOrder}
              compact
            />
            <FaithfulProtagonist
              archetypeId={firstProfile.archetypeId}
              fallbackSrc={firstProfile.portraitSrc}
              evolutionTier={firstProfile.evolutionTier}
              className={`chapter-wayfinder evolution-${firstProfile.evolutionTier}`}
            />
          </div>
          <div>
            <strong>{monthLabel(firstMonth)}</strong>
            <span>
              Level {firstAnalytics.level} · {firstWorld.districts.length}{' '}
              districts ·{' '}
              {firstWorld.districts.reduce(
                (sum, district) => sum + district.structureCount,
                0,
              )}{' '}
              structures
            </span>
            <em>
              {firstProfile.archetypeName} · {firstProfile.evolutionLabel} ·{' '}
              {firstProfile.title}
            </em>
          </div>
        </article>
        <i className="chapter-axis" aria-hidden="true">
          <span>World shift</span>
          <ArrowRight />
        </i>
        <article className="chapter-world chapter-b">
          <div className="chapter-kicker">
            <span>World B</span>
            <small>Later chapter</small>
          </div>
          <div className="chapter-scene">
            <WorldMap
              analytics={secondAnalytics}
              periodKey={secondMonth}
              categoryOrder={categoryOrder}
              compact
            />
            <FaithfulProtagonist
              archetypeId={secondProfile.archetypeId}
              fallbackSrc={secondProfile.portraitSrc}
              evolutionTier={secondProfile.evolutionTier}
              className={`chapter-wayfinder evolution-${secondProfile.evolutionTier}`}
            />
          </div>
          <div>
            <strong>{monthLabel(secondMonth)}</strong>
            <span>
              Level {secondAnalytics.level} · {secondWorld.districts.length}{' '}
              districts ·{' '}
              {secondWorld.districts.reduce(
                (sum, district) => sum + district.structureCount,
                0,
              )}{' '}
              structures
            </span>
            <em>
              {secondProfile.archetypeName} · {secondProfile.evolutionLabel} ·{' '}
              {secondProfile.title}
            </em>
          </div>
        </article>
      </div>
      <div className="compare-panel chapter-ledger">
        <div className="compare-head">
          <span>Metric</span>
          <strong>{comparison.first.label}</strong>
          <strong>{comparison.second.label}</strong>
          <span>Change</span>
        </div>
        {rows.map((row) => (
          <div className="compare-row" key={row[0]}>
            <span>{row[0]}</span>
            <b>{row[1]}</b>
            <b>{row[2]}</b>
            <em>{row[3]}</em>
          </div>
        ))}
      </div>
      <div className="distribution-compare region-shift">
        <h2>How the regions changed shape</h2>
        {categories.map((category) => {
          const first =
            comparison.first.categories.find(
              (item) => item.category === category,
            )?.share ?? 0;
          const second =
            comparison.second.categories.find(
              (item) => item.category === category,
            )?.share ?? 0;
          return (
            <article key={category}>
              <strong>{category}</strong>
              <div>
                <span>
                  <i style={{ width: `${first * 100}%` }} />
                  <small>{Math.round(first * 100)}%</small>
                </span>
                <span>
                  <i style={{ width: `${second * 100}%` }} />
                  <small>{Math.round(second * 100)}%</small>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DataView({
  records,
  periodRecords,
  focusRecordIds,
  onClearFocus,
  onCsv,
  onCapsule,
  onAddRecords,
  onPassport,
  onPassportFile,
}: {
  records: ActivityRecord[];
  periodRecords: ActivityRecord[];
  focusRecordIds: string[] | null;
  onClearFocus: () => void;
  onCsv: () => void;
  onCapsule: () => void;
  onAddRecords: () => void;
  onPassport: () => void;
  onPassportFile: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'date' | 'duration'>('date');
  const focusedRecords = focusRecordIds
    ? records.filter((record) => focusRecordIds.includes(record.id))
    : periodRecords;
  const categories = [
    ...new Set(focusedRecords.map((record) => record.category)),
  ].sort();
  const filtered = focusedRecords
    .filter(
      (record) =>
        (category === 'all' || record.category === category) &&
        `${record.activity} ${record.category} ${record.notes ?? ''}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'date' ? b.date.localeCompare(a.date) : b.duration - a.duration,
    );
  return (
    <section className="data-view source-archive">
      <div className="view-heading archive-heading">
        <div>
          <p className="overline">
            <span /> The source archive
          </p>
          <h1>The records beneath the realm.</h1>
          <p>
            Inspect the exact local material that generated every region, level,
            landmark, achievement, and discovery.
          </p>
        </div>
        <div className="export-actions">
          <Button onClick={onAddRecords}>
            <FilePlus2 /> Add records
          </Button>
          <Button onClick={onCsv}>
            <Download /> Normalized CSV
          </Button>
          <button type="button" onClick={onCapsule}>
            <Download /> LifeMap Capsule
          </button>
          <button type="button" onClick={onPassport}>
            <Save /> Passport backup
          </button>
          <label className="passport-restore-action">
            <input
              type="file"
              accept=".lifemap,.json,application/json"
              onChange={onPassportFile}
            />
            <UploadCloud /> Restore Passport
          </label>
        </div>
      </div>
      <div className="lineage-path" aria-label="LifeMap generation pipeline">
        <span>
          <Database />
          <small>Source</small>
          <strong>{formatRecordCount(records.length)}</strong>
        </span>
        <ChevronRight />
        <span>
          <Gauge />
          <small>Engine</small>
          <strong>Deterministic analytics</strong>
        </span>
        <ChevronRight />
        <span>
          <Map />
          <small>Realm</small>
          <strong>World + character</strong>
        </span>
        <i>
          <LockKeyhole /> Processed in this browser
        </i>
      </div>
      {focusRecordIds && (
        <div className="trace-banner">
          <Map />
          <div>
            <strong>Landmark source trace</strong>
            <span>
              Showing the exact {focusedRecords.length} normalized records that
              generated the selected world landmark.
            </span>
          </div>
          <button type="button" onClick={onClearFocus}>
            Clear trace
          </button>
        </div>
      )}
      <div className="data-toolbar archive-controls">
        <label>
          <Search />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search activities"
          />
        </label>
        <label>
          <Filter />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as 'date' | 'duration')
            }
          >
            <option value="date">Newest date</option>
            <option value="duration">Longest duration</option>
          </select>
        </label>
        <span>{filtered.length} shown</span>
      </div>
      <div className="data-table-wrap archive-ledger">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity</th>
              <th>Category</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Energy</th>
              <th>Mood</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((record) => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>
                  <strong>{record.activity}</strong>
                  {record.notes && <small>{record.notes}</small>}
                </td>
                <td>{record.category}</td>
                <td>{record.startTime ?? 'Not recorded'}</td>
                <td>{formatDuration(record.duration)}</td>
                <td>{record.energy ?? 'Not recorded'}</td>
                <td>{record.mood ?? 'Not recorded'}</td>
                <td>
                  {record.planned
                    ? record.completed
                      ? 'Completed plan'
                      : 'Incomplete plan'
                    : 'Recorded'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > 100 && (
        <p className="table-note">
          Showing the first 100 matching records for responsiveness. Exports
          include all matching period records.
        </p>
      )}
    </section>
  );
}

function MethodologyView() {
  const sections = [
    [
      'Tracked time',
      'Sum of normalized duration in minutes. If duration is absent, start and end time are used. Values below 0 or above 1,440 minutes are rejected.',
    ],
    [
      'Time allocation',
      'Category minutes divided by all tracked minutes in the selected period. District footprint and world-index percentage use this same share.',
    ],
    [
      'Consistency',
      'Overall: active-day frequency 55% + gap regularity 30% + longest-streak strength 15%. Category consistency uses frequency 50% + gap regularity 30% + streak strength 20%.',
    ],
    [
      'XP and levels',
      'Category XP = duration minutes ÷ 3 + 8 per record + consistency × 2 + 18 per completed planned record. Total XP is the sum of category XP. Level thresholds are 120 × level^1.55.',
    ],
    [
      'Fragmentation',
      'Sessions are normalized records. Short sessions are records below 30 minutes. A context switch is counted when adjacent records on the same date use different categories.',
    ],
    [
      'Associations',
      'Recorded energy or mood is compared between a category and all other categories. Both groups need at least five values and a mean difference of at least 0.15. This never establishes causation.',
    ],
    [
      'World mapping',
      'District footprint = 0.80 + min(0.34, time share × 0.90). Structures = clamp(1 + development + floor(records ÷ 12), 2, 9). Session lights = clamp(ceil(records ÷ 4), 1, 12). Vegetation = clamp(ceil(consistency ÷ 14), 1, 8).',
    ],
    [
      'Development stages',
      'Category XP below 360 creates a small settlement; 360–719 an early township; 720–1,199 a developing district; 1,200–1,999 an established district; and 2,000 or more a civic landmark.',
    ],
    [
      'Landmark rules',
      'Every represented category gets a district landmark. A leading-activity landmark needs two records. A streak beacon needs a 5-day category streak. A milestone marker needs development stage 4 or 5. Every landmark stores its source record IDs.',
    ],
    [
      'Roads and bridges',
      'Adjacent records on the same date create a transition between their categories. One or two transitions produce a trail, three to five a road, and six or more a bridge. Quiet deterministic trails connect any otherwise isolated district.',
    ],
    [
      'Time reconstruction',
      'Each month is re-analyzed from only that month’s records. The all-time category order fixes district slots so places do not jump around. A stable fingerprint derived from sorted record values makes identical inputs produce identical worlds.',
    ],
    [
      'Protagonist archetype',
      'Minutes are aggregated into recognized life domains. Every domain has a core protagonist, while Career, Learning, Fitness, Social, and Recreation reveal a second specialist when that domain reaches at least 68% of tracked time. Recognized domains outrank generic labels, exact ties use the published fixed domain order, and identical records always produce the same one of twelve original forms. The selection visualizes activity and never infers gender.',
    ],
    [
      'Character and achievements',
      'The title uses overall level, represented categories, and unlocked achievement count. Equipment is selected from categories holding at least 12% of the period, with the primary category always considered. Achievement cards publish their thresholds and evidence.',
    ],
  ];
  return (
    <section className="method-view codex-view">
      <div className="view-heading codex-heading">
        <div>
          <p className="overline">
            <span /> The LifeMap Codex
          </p>
          <h1>How the world is forged.</h1>
          <p>
            The full rulebook: no hidden model, generated score, or unsupported
            claim.
          </p>
        </div>
      </div>
      <ol
        className="codex-path"
        aria-label="LifeMap deterministic architecture"
      >
        {[
          ['01', 'Data', 'Normalized local records'],
          ['02', 'Analytics', 'Time, rhythm, and patterns'],
          ['03', 'Progression', 'XP, levels, and achievements'],
          ['04', 'World', 'Regions, structures, and landmarks'],
          ['05', 'Character', 'Identity, loadout, and evolution'],
        ].map(([number, title, detail]) => (
          <li key={title}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
            <ChevronRight />
          </li>
        ))}
      </ol>
      <div className="formula-callout">
        <ShieldCheck />
        <div>
          <strong>Reproducible by design</strong>
          <p>
            The same normalized records always produce the same analytics and
            world, including the same protagonist archetype.
          </p>
        </div>
      </div>
      <div className="method-list codex-entries">
        {sections.map(([title, detail], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="threshold-note">
        <CircleHelp />
        <p>
          <strong>Small datasets stay honest.</strong>
          <br />
          When a period lacks enough historical or optional data, LifeMap says
          “Not enough data” or leaves the region unexplored.
        </p>
      </div>
    </section>
  );
}

function EmptyState({
  title,
  detail,
  action,
  actionLabel,
}: {
  title: string;
  detail: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <section className="empty-state">
      <div>
        <Compass />
      </div>
      <h1>{title}</h1>
      <p>{detail}</p>
      {action && (
        <Button onClick={action}>
          {actionLabel}
          <ArrowRight />
        </Button>
      )}
    </section>
  );
}

function localDateValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function DailyDock({
  categories,
  recentActivities,
  startsNewRealm,
  onClose,
  onSubmit,
}: {
  categories: string[];
  recentActivities: string[];
  startsNewRealm: boolean;
  onClose: () => void;
  onSubmit: (record: ActivityRecord) => void;
}) {
  const suggestedCategories = [
    ...new Set([
      ...categories,
      'Career',
      'Learning',
      'Fitness',
      'Social',
      'Recreation',
      'Creative',
    ]),
  ].slice(0, 12);
  const suggestions = [...new Set(recentActivities)].slice(0, 12);
  const [duration, setDuration] = useState(30);
  const submit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const candidate = form.get(name);
      return typeof candidate === 'string' ? candidate.trim() : '';
    };
    const date = value('date');
    const activity = value('activity').slice(0, 240);
    const category = value('category').slice(0, 120);
    if (!date || !activity || !category || duration < 0 || duration > 1440) return;
    onSubmit({
      id: `daily-${Date.now()}`,
      date,
      activity,
      category,
      duration,
      energy: Number(value('energy')) || undefined,
      mood: Number(value('mood')) || undefined,
      notes: value('notes').slice(0, 5000) || undefined,
    });
  };
  return (
    <div className="modal-backdrop">
      <dialog open className="daily-dock-panel" aria-labelledby="daily-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close daily log">
          <X />
        </button>
        <p className="step-label">Daily Dock</p>
        <h2 id="daily-title">Add today in under a minute.</h2>
        <p className="panel-lead">
          {startsNewRealm
            ? 'The demo is fictional. This entry starts a clean personal realm.'
            : 'One honest record is enough. Mood, energy, and notes are always optional.'}
        </p>
        <form className="daily-form" onSubmit={submit}>
          <label>
            Date
            <input name="date" type="date" defaultValue={localDateValue()} required />
          </label>
          <label className="wide-field">
            What did you do?
            <input name="activity" list="recent-activities" maxLength={240} placeholder="Walked, studied, designed, rested..." required autoFocus />
            <datalist id="recent-activities">
              {suggestions.map((activity) => <option key={activity} value={activity}>{activity}</option>)}
            </datalist>
          </label>
          <label>
            Life region
            <input name="category" list="known-categories" maxLength={120} placeholder="Fitness" required />
            <datalist id="known-categories">
              {suggestedCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </datalist>
          </label>
          <fieldset className="duration-field wide-field">
            <legend>Duration</legend>
            <div>
              {[15, 30, 60, 90].map((minutes) => (
                <button
                  key={minutes}
                  className={duration === minutes ? 'active' : ''}
                  type="button"
                  onClick={() => setDuration(minutes)}
                >
                  {minutes}m
                </button>
              ))}
              <label>
                Custom
                <input
                  aria-label="Custom duration in minutes"
                  type="number"
                  min="0"
                  max="1440"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                />
              </label>
            </div>
          </fieldset>
          <label>
            Energy (optional)
            <select name="energy" defaultValue="">
              <option value="">Not recorded</option>
              {[1, 2, 3, 4, 5].map((score) => <option key={score}>{score}</option>)}
            </select>
          </label>
          <label>
            Mood (optional)
            <select name="mood" defaultValue="">
              <option value="">Not recorded</option>
              {[1, 2, 3, 4, 5].map((score) => <option key={score}>{score}</option>)}
            </select>
          </label>
          <label className="wide-field">
            A little context (optional)
            <textarea name="notes" maxLength={5000} placeholder="What made this meaningful?" />
          </label>
          <div className="daily-actions wide-field">
            <span><LockKeyhole /> Kept in this browser until you export a Passport</span>
            <Button className="hero-primary" type="submit">
              Add to my world <ArrowRight />
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

function ConfirmPassportRestore({
  recordCount,
  onCancel,
  onConfirm,
}: {
  recordCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <section className="confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="passport-title" aria-describedby="passport-detail">
        <Save />
        <h2 id="passport-title">Restore this Passport?</h2>
        <p id="passport-detail">
          It contains {recordCount} valid {recordCount === 1 ? 'record' : 'records'} and will replace the realm currently open on this device. You can undo immediately afterward.
        </p>
        <div>
          <button type="button" onClick={onCancel}>Cancel</button>
          <Button onClick={onConfirm}>Restore LifeMap</Button>
        </div>
      </section>
    </div>
  );
}

function ConfirmReset({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <section
        className="confirm-panel"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-detail"
      >
        <Trash2 />
        <h2 id="reset-title">Reset this LifeMap?</h2>
        <p id="reset-detail">
          This clears the current in-memory dataset and returns to the landing
          page. Download an export first if you want to keep a copy.
        </p>
        <div>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <Button variant="destructive" onClick={onConfirm}>
            Reset LifeMap
          </Button>
        </div>
      </section>
    </div>
  );
}
