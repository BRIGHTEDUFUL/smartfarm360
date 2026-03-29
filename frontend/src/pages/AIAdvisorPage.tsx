import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AI_DEMO_PRESETS,
  AdvisorSampleInput,
  CROP_OPTIONS,
  DEFAULT_DEMO_PRESET,
  GOAL_OPTIONS,
  MONTH_OPTIONS,
  REGION_OPTIONS,
  SOIL_OPTIONS,
  STAGE_OPTIONS,
  AdvisorFormState,
  buildAdvisorAnalysis,
  buildAdvisorFormFromPreset,
  getCropProfile,
  getDemoPreset,
} from "../data/aiAdvisorDemo";
import "./AIAdvisorPage.css";

const heroStats = [
  { value: "5", label: "Crop profiles" },
  { value: "10", label: "Regional datasets" },
  { value: "4", label: "Reasoning layers" },
  { value: "<90s", label: "Advisory refresh" },
];

const intelligenceSources = [
  "Crop vision",
  "Regional suitability",
  "Season timing",
  "Buyer demand",
];

const capabilityCards = [
  {
    icon: "fas fa-seedling",
    title: "Seed grading",
    text: "Turn seed lots into vigor, germination, and planting guidance before they hit the field.",
  },
  {
    icon: "fas fa-map-marked-alt",
    title: "Where to grow",
    text: "Rank production zones so farmers can see where each crop has the strongest chance of winning.",
  },
  {
    icon: "fas fa-clock",
    title: "When to act",
    text: "Translate crop stage into planting windows, scouting times, irrigation slots, and dispatch timing.",
  },
  {
    icon: "fas fa-chart-line",
    title: "Market awareness",
    text: "Combine field readiness with buyer timing so the harvest plan feels commercial, not theoretical.",
  },
];

const accentClassMap = {
  green: "is-green",
  amber: "is-amber",
  blue: "is-blue",
  purple: "is-purple",
};

const analysisSteps = [
  "Vision ingest",
  "Climate fit mapping",
  "Soil and field reasoning",
  "Market timing calibration",
];

const buildReferenceSampleInput = (
  presetId: string,
  sampleName: string,
): AdvisorSampleInput => ({
  source: "reference-library",
  fileName: sampleName,
  mimeType: "image/reference",
  traceSeed: presetId,
});

const buildUploadSampleInput = (file: File): AdvisorSampleInput => ({
  source: "farmer-upload",
  fileName: file.name,
  mimeType: file.type,
  fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
  traceSeed: `${file.name}-${file.size}-${file.lastModified}`,
});

const buildScenarioReferenceSampleInput = (form: AdvisorFormState) =>
  buildReferenceSampleInput(
    `${form.cropId}-${form.stage}-${form.region}-${form.month}`,
    form.sampleName || "Crop reference scan",
  );

const AIAdvisorPage = () => {
  const defaultForm = buildAdvisorFormFromPreset(DEFAULT_DEMO_PRESET);
  const defaultSampleInput = buildReferenceSampleInput(
    DEFAULT_DEMO_PRESET.id,
    DEFAULT_DEMO_PRESET.sampleName,
  );
  const [form, setForm] = useState<AdvisorFormState>(defaultForm);
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_DEMO_PRESET.id);
  const [sampleInput, setSampleInput] = useState<AdvisorSampleInput>(defaultSampleInput);
  const [analysis, setAnalysis] = useState(() =>
    buildAdvisorAnalysis(defaultForm, defaultSampleInput),
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [previewSrc, setPreviewSrc] = useState(DEFAULT_DEMO_PRESET.image);
  const [previewLabel, setPreviewLabel] = useState(DEFAULT_DEMO_PRESET.sampleName);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const timerRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCrop = getCropProfile(form.cropId) ?? getCropProfile(DEFAULT_DEMO_PRESET.cropId);
  const selectedPreset = selectedPresetId ? getDemoPreset(selectedPresetId) : undefined;
  const scenarioNote =
    selectedPreset?.note ??
    "Custom agronomy scenario using the same advisory workflow with your own crop, region, soil, and timing choices.";

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      if (stepTimerRef.current !== null) {
        window.clearInterval(stepTimerRef.current);
      }
      clearPreviewUrl();
    };
  }, []);

  const runAnalysis = (
    nextForm: AdvisorFormState,
    nextSampleInput: AdvisorSampleInput = sampleInput,
  ) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    if (stepTimerRef.current !== null) {
      window.clearInterval(stepTimerRef.current);
    }

    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    stepTimerRef.current = window.setInterval(() => {
      setAnalysisStepIndex((currentStep) =>
        currentStep < analysisSteps.length - 1 ? currentStep + 1 : currentStep,
      );
    }, 260);

    timerRef.current = window.setTimeout(() => {
      if (stepTimerRef.current !== null) {
        window.clearInterval(stepTimerRef.current);
        stepTimerRef.current = null;
      }
      setAnalysis(buildAdvisorAnalysis(nextForm, nextSampleInput));
      setIsAnalyzing(false);
    }, 1100);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = getDemoPreset(presetId);
    if (!preset) {
      return;
    }

    const nextForm = buildAdvisorFormFromPreset(preset);
    const nextSampleInput = buildReferenceSampleInput(preset.id, preset.sampleName);
    clearPreviewUrl();
    setSelectedPresetId(preset.id);
    setUploadedFileName("");
    setPreviewSrc(preset.image);
    setPreviewLabel(preset.sampleName);
    setSampleInput(nextSampleInput);
    setForm(nextForm);
    runAnalysis(nextForm, nextSampleInput);
  };

  const updateForm = <K extends keyof AdvisorFormState>(
    key: K,
    value: AdvisorFormState[K],
  ) => {
    const nextForm = {
      ...form,
      [key]: value,
    };

    setSelectedPresetId("");
    setForm(nextForm);

    if (key === "cropId" && !uploadedFileName) {
      const nextCrop = getCropProfile(value as string);
      if (nextCrop) {
        setPreviewSrc(nextCrop.image);
        setPreviewLabel(`${nextCrop.name} sample preview`);
      }
    }

    if (!uploadedFileName) {
      setSampleInput(buildScenarioReferenceSampleInput(nextForm));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAnalysis(form, sampleInput);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    clearPreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setSelectedPresetId("");
    setUploadedFileName(file.name);
    setSampleInput(buildUploadSampleInput(file));
    setPreviewSrc(objectUrl);
    setPreviewLabel(file.name);
    setForm((currentForm) => ({
      ...currentForm,
      sampleName: file.name.replace(/\.[^.]+$/, ""),
    }));
  };

  const handleResetToReference = () => {
    clearPreviewUrl();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const referenceInput = buildScenarioReferenceSampleInput(form);
    const referenceCrop = getCropProfile(form.cropId) ?? selectedCrop;
    const referenceLabel = selectedPreset?.sampleName ?? `${referenceCrop?.name ?? "Crop"} sample preview`;
    const referenceImage = selectedPreset?.image ?? referenceCrop?.image ?? previewSrc;

    setUploadedFileName("");
    setSampleInput(referenceInput);
    setPreviewSrc(referenceImage);
    setPreviewLabel(referenceLabel);
  };

  if (!selectedCrop) {
    return null;
  }

  const analysisProgress = ((analysisStepIndex + 1) / analysisSteps.length) * 100;

  return (
    <div className="ai-advisor-page">
      <section className="ai-advisor-hero">
        <div className="ai-advisor-shell ai-advisor-hero-grid">
          <div className="ai-hero-copy">
            <div className="ai-hero-badge">
              <i className="fas fa-brain" aria-hidden="true" />
              <span>Smart Farming 360 AI Advisor</span>
            </div>

            <h1>Scan seeds. Read produce. Plan the season with AI.</h1>
            <p>
              Smart Farming 360 AI Advisor turns crop samples into practical
              guidance for how to grow, where to grow, and when to act. This
              advisory workspace combines regional fit, timing windows, sample
              evidence, and commercial planning into one operational view for
              Ghanaian agriculture.
            </p>

            <div className="ai-hero-actions">
              <a href="#ai-advisor-workspace" className="ai-hero-primary-link">
                <i className="fas fa-satellite-dish" aria-hidden="true" />
                Open advisor workspace
              </a>
              <Link to="/register" className="ai-hero-secondary-link">
                <i className="fas fa-user-plus" aria-hidden="true" />
                Activate for my farm
              </Link>
            </div>

            <div className="ai-hero-stats" aria-label="AI advisor highlights">
              {heroStats.map((stat) => (
                <div key={stat.label} className="ai-hero-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-hero-console">
            <div className="ai-console-header">
              <div>
                <span className="ai-console-eyebrow">{analysis.scanModeLabel}</span>
                <h2>{analysis.title}</h2>
              </div>
              <span className="ai-console-run">{analysis.runLabel}</span>
            </div>

            <div className="ai-console-preview">
              <img src={previewSrc} alt={previewLabel} />
              <div className="ai-console-scanline" aria-hidden="true" />
              <div className="ai-console-chip">
                <i className="fas fa-camera-retro" aria-hidden="true" />
                <span>{analysis.stageLabel}</span>
              </div>
            </div>

            <div className="ai-console-grid">
              <div className="ai-console-card">
                <small>Top region</small>
                <strong>{analysis.regionRanking[0]?.name}</strong>
                <span>{analysis.regionRanking[0]?.score}% suitability</span>
              </div>
              <div className="ai-console-card">
                <small>Readiness</small>
                <strong>{analysis.confidence}%</strong>
                <span>{analysis.readinessBand}</span>
              </div>
              <div className="ai-console-card">
                <small>Market signal</small>
                <strong>{analysis.metrics[3]?.value}%</strong>
                <span>{analysis.marketHeadline}</span>
              </div>
              <div className="ai-console-card">
                <small>Sample quality</small>
                <strong>{analysis.sampleQuality}%</strong>
                <span>{analysis.sampleSourceLabel}</span>
              </div>
            </div>

            <p className="ai-console-summary">{analysis.summary}</p>

            <div className="ai-console-footer">
              <div className="ai-console-status">
                <span className="ai-console-status-dot" aria-hidden="true" />
                <strong>Advisory online</strong>
                <span>{analysis.traceId}</span>
              </div>
              <div className="ai-console-sources" aria-label="Advisory intelligence sources">
                {intelligenceSources.map((source) => (
                  <span key={source}>{source}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-advisor-workspace" id="ai-advisor-workspace">
        <div className="ai-advisor-shell ai-workspace-grid">
          <aside className="ai-control-panel">
            <div className="ai-panel-heading">
              <div>
                <span className="ai-section-eyebrow">Advisor setup</span>
                <h2>Seed and produce analysis</h2>
                <p className="ai-panel-description">{scenarioNote}</p>
              </div>
              <span className="ai-panel-mode">Live advisory</span>
            </div>

            <div className="ai-preset-grid">
              {AI_DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`ai-preset-card${selectedPresetId === preset.id ? " active" : ""}`}
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <img src={preset.image} alt={preset.sampleName} />
                  <div>
                    <strong>{preset.label}</strong>
                    <span>{preset.note}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="ai-upload-card">
              <div className="ai-upload-topline">
                <div>
                  <span className="ai-section-eyebrow">Sample preview</span>
                  <h3>{previewLabel}</h3>
                </div>
                {uploadedFileName && (
                  <span className="ai-upload-badge">Live upload</span>
                )}
              </div>

              <div className="ai-upload-preview">
                <img src={previewSrc} alt={previewLabel} />
              </div>

              <label className="ai-upload-trigger">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <i className="fas fa-cloud-upload-alt" aria-hidden="true" />
                <span>Attach a crop image</span>
              </label>

              <div className="ai-upload-meta">
                <div className="ai-upload-meta-chip">
                  <i className="fas fa-wave-square" aria-hidden="true" />
                  <span>{analysis.scanModeLabel}</span>
                </div>
                <div className="ai-upload-meta-chip">
                  <i className="fas fa-fingerprint" aria-hidden="true" />
                  <span>{analysis.traceId}</span>
                </div>
                {sampleInput.fileSizeKb && (
                  <div className="ai-upload-meta-chip">
                    <i className="fas fa-image" aria-hidden="true" />
                    <span>{sampleInput.fileSizeKb} KB sample</span>
                  </div>
                )}
              </div>

              {uploadedFileName && (
                <button
                  type="button"
                  className="ai-upload-reset"
                  onClick={handleResetToReference}
                >
                  <i className="fas fa-undo-alt" aria-hidden="true" />
                  Use verified library sample
                </button>
              )}

              <p className="ai-upload-note">
                {uploadedFileName
                  ? "Your uploaded image is being used as the active sample while the advisory engine recalculates evidence, timing, and market fit."
                  : "Upload is optional. Verified crop scans already show the full advisory workflow while you tune the field scenario."}
              </p>
            </div>

            <form className="ai-analysis-form" onSubmit={handleSubmit}>
              <div className="ai-field-group">
                <label htmlFor="ai-sample-name">Sample label</label>
                <input
                  id="ai-sample-name"
                  type="text"
                  value={form.sampleName}
                  onChange={(event) => updateForm("sampleName", event.target.value)}
                  placeholder="e.g. Certified maize hybrid lot"
                />
              </div>

              <div className="ai-segment-group">
                <span className="ai-field-label">Analysis type</span>
                <div className="ai-segment-grid">
                  {STAGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`ai-segment-card${form.stage === option.value ? " active" : ""}`}
                      onClick={() =>
                        updateForm("stage", option.value as AdvisorFormState["stage"])
                      }
                    >
                      <strong>{option.label}</strong>
                      <span>{option.helper}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ai-form-grid">
                <div className="ai-field-group">
                  <label htmlFor="ai-crop">Crop</label>
                  <select
                    id="ai-crop"
                    value={form.cropId}
                    onChange={(event) => updateForm("cropId", event.target.value)}
                  >
                    {CROP_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ai-field-group">
                  <label htmlFor="ai-region">Target region</label>
                  <select
                    id="ai-region"
                    value={form.region}
                    onChange={(event) => updateForm("region", event.target.value)}
                  >
                    {REGION_OPTIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ai-field-group">
                  <label htmlFor="ai-soil">Soil profile</label>
                  <select
                    id="ai-soil"
                    value={form.soil}
                    onChange={(event) => updateForm("soil", event.target.value)}
                  >
                    {SOIL_OPTIONS.map((soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ai-field-group">
                  <label htmlFor="ai-month">Planning month</label>
                  <select
                    id="ai-month"
                    value={form.month}
                    onChange={(event) => updateForm("month", event.target.value)}
                  >
                    {MONTH_OPTIONS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ai-segment-group">
                <span className="ai-field-label">Business goal</span>
                <div className="ai-goal-grid">
                  {GOAL_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`ai-goal-card${form.goal === option.value ? " active" : ""}`}
                      onClick={() =>
                        updateForm("goal", option.value as AdvisorFormState["goal"])
                      }
                    >
                      <strong>{option.label}</strong>
                      <span>{option.helper}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="ai-run-button" disabled={isAnalyzing}>
                <i className={`fas ${isAnalyzing ? "fa-spinner fa-spin" : "fa-wave-square"}`} aria-hidden="true" />
                {isAnalyzing ? "Updating advisory..." : "Generate AI advisory"}
              </button>
            </form>
          </aside>

          <section className={`ai-results-panel${isAnalyzing ? " is-loading" : ""}`}>
            {isAnalyzing && (
              <div className="ai-results-overlay" aria-live="polite">
                <div className="ai-overlay-card">
                  <div className="ai-overlay-spinner" aria-hidden="true" />
                  <strong>{analysisSteps[analysisStepIndex]}</strong>
                  <span>
                    Computer vision, soil fit, climate timing, and market
                    signal are synchronizing into one advisory run.
                  </span>
                  <div className="ai-overlay-progress" aria-hidden="true">
                    <span style={{ width: `${analysisProgress}%` }} />
                  </div>
                  <div className="ai-overlay-steps">
                    {analysisSteps.map((step, index) => (
                      <div
                        key={step}
                        className={`ai-overlay-step${
                          index === analysisStepIndex
                            ? " is-active"
                            : index < analysisStepIndex
                              ? " is-complete"
                              : ""
                        }`}
                      >
                        <span>{index + 1}</span>
                        <strong>{step}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="ai-results-header">
              <div>
                <span className="ai-section-eyebrow">AI advisory output</span>
                <h2>{analysis.title}</h2>
                <p>{analysis.summary}</p>
              </div>

              <div
                className="ai-confidence-ring"
                style={{
                  background: `radial-gradient(circle at center, #ffffff 48%, transparent 49%), conic-gradient(#0d5415 0deg, #1b7e28 calc(3.6deg * ${analysis.confidence}), #dbe4ef 0deg)`,
                }}
                aria-label={`${analysis.confidence}% confidence`}
              >
                <strong>{analysis.confidence}%</strong>
                <span>{analysis.readinessBand}</span>
              </div>
            </div>

            <div className="ai-summary-strip">
              <div className="ai-summary-tile">
                <span>Capture mode</span>
                <strong>{analysis.scanModeLabel}</strong>
                <p>{analysis.sampleSourceLabel}</p>
              </div>
              <div className="ai-summary-tile">
                <span>Advisory ID</span>
                <strong>{analysis.traceId}</strong>
                <p>Use this advisory ID to revisit the same scenario later.</p>
              </div>
              <div className="ai-summary-tile">
                <span>Advisory focus</span>
                <strong>{analysis.advisoryFocus}</strong>
                <p>{analysis.sampleSummary}</p>
              </div>
            </div>

            <div className="ai-metric-grid">
              {analysis.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`ai-metric-card ${accentClassMap[metric.accent]}`}
                >
                  <span>{metric.label}</span>
                  <strong>{metric.value}%</strong>
                  <p>{metric.hint}</p>
                </div>
              ))}
            </div>

            <div className="ai-engine-grid">
              {analysis.engines.map((engine) => (
                <div key={engine.name} className="ai-engine-card">
                  <div className="ai-engine-topline">
                    <strong>{engine.name}</strong>
                    <span>{engine.value}%</span>
                  </div>
                  <div className="ai-engine-bar" aria-hidden="true">
                    <span style={{ width: `${engine.value}%` }} />
                  </div>
                  <p>{engine.detail}</p>
                </div>
              ))}
            </div>

            <div className="ai-results-grid">
              <article className="ai-insight-card">
                <div className="ai-card-header">
                  <h3>Confidence drivers</h3>
                  <span>Why the score moved</span>
                </div>
                <div className="ai-driver-list">
                  {analysis.confidenceDrivers.map((driver) => (
                    <div
                      key={driver.label}
                      className={`ai-driver-item status-${driver.status}`}
                    >
                      <div className="ai-driver-topline">
                        <strong>{driver.label}</strong>
                        <span>{driver.status === "strong" ? "Strong" : "Watch"}</span>
                      </div>
                      <p>{driver.detail}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ai-insight-card">
                <div className="ai-card-header">
                  <h3>Recommended actions</h3>
                  <span>Next operating moves</span>
                </div>
                <div className="ai-action-list">
                  {analysis.actionPlan.map((action) => (
                    <div key={`${action.window}-${action.title}`} className="ai-action-item">
                      <span>{action.window}</span>
                      <strong>{action.title}</strong>
                      <p>{action.detail}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ai-insight-card">
                <div className="ai-card-header">
                  <h3>How to grow</h3>
                  <span>{selectedCrop.scientificName}</span>
                </div>
                <ul className="ai-bullet-list">
                  {analysis.growthPlaybook.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="ai-insight-card">
                <div className="ai-card-header">
                  <h3>Where to grow</h3>
                  <span>Regional ranking</span>
                </div>
                <div className="ai-region-list">
                  {analysis.regionRanking.map((region) => (
                    <div
                      key={region.name}
                      className={`ai-region-item${region.selected ? " selected" : ""}`}
                    >
                      <div>
                        <strong>{region.name}</strong>
                        <p>{region.detail}</p>
                      </div>
                      <span>{region.score}%</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ai-insight-card">
                <div className="ai-card-header">
                  <h3>When to act</h3>
                  <span>Timing engine</span>
                </div>
                <div className="ai-timing-list">
                  {analysis.timingPlan.map((timing) => (
                    <div key={timing.label} className="ai-timing-item">
                      <strong>{timing.label}</strong>
                      <span>{timing.value}</span>
                      <p>{timing.detail}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ai-insight-card">
                <div className="ai-card-header">
                  <h3>Vision evidence</h3>
                  <span>Crop scan signals</span>
                </div>
                <div className="ai-signal-list">
                  {analysis.visionSignals.map((signal) => (
                    <div key={signal.label} className="ai-signal-item">
                      <div className="ai-signal-topline">
                        <strong>{signal.label}</strong>
                        <span>{signal.value}%</span>
                      </div>
                      <div className="ai-engine-bar" aria-hidden="true">
                        <span style={{ width: `${signal.value}%` }} />
                      </div>
                      <p>{signal.note}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ai-insight-card ai-insight-card-wide">
                <div className="ai-card-header">
                  <h3>Commercial outlook</h3>
                  <span>Route to market</span>
                </div>
                <div className="ai-commercial-grid">
                  {analysis.commercialSignals.map((signal) => (
                    <div key={signal.label} className="ai-commercial-card">
                      <span>{signal.label}</span>
                      <strong>{signal.value}</strong>
                      <p>{signal.detail}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ai-insight-card ai-insight-card-wide">
                <div className="ai-card-header">
                  <h3>Risk monitor</h3>
                  <span>Field pressure to watch</span>
                </div>
                <div className="ai-risk-grid">
                  {analysis.riskFlags.map((risk) => (
                    <div key={risk.title} className={`ai-risk-card level-${risk.level.toLowerCase()}`}>
                      <span>{risk.level}</span>
                      <strong>{risk.title}</strong>
                      <p>{risk.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="ai-next-step">
                  <i className="fas fa-route" aria-hidden="true" />
                  <div>
                    <strong>Recommended next step</strong>
                    <p>{analysis.nextStep}</p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section className="ai-capabilities-section">
        <div className="ai-advisor-shell">
          <div className="ai-capabilities-header">
            <span className="ai-section-eyebrow">Why this matters</span>
            <h2>Make agronomy intelligence usable for every farmer</h2>
            <p>
              AI in farming should not stop at generic chat. It should connect
              sample quality, field conditions, timing, and market demand into
              one operational view farmers can actually act on.
            </p>
          </div>

          <div className="ai-capability-grid">
            {capabilityCards.map((card) => (
              <article key={card.title} className="ai-capability-card">
                <div className="ai-capability-icon">
                  <i className={card.icon} aria-hidden="true" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAdvisorPage;
