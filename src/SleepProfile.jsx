import { useMemo, useState } from "react";
import "./SleepProfile.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import DistributionHist from "./DistributionHist";
import SankeyFlow from "./SankeyFlow";
import ScatterPlot from "./ScatterPlot";

const EMPTY_DATA = [];
const ALLOWED_OCCUPATIONS = [
  "Engineer",
  "Accountant",
  "Lawyer",
  "Teacher",
  "Salesperson",
  "Doctor",
  "Nurse",
];

function Tile({ label, value, sub, tone = "normal" }) {
  return (
    <Box className={`sp-tile sp-${tone}`}>
      <Box className="sp-tile-top">
        <Typography className="sp-label">{label}</Typography>
      </Box>
      <Box className="sp-value">
        {value}
        {sub ? <span className="sp-sub">{sub}</span> : null}
      </Box>
    </Box>
  );
}

function Panel({ title, children, headerAction = null }) {
  return (
    <Box className="sp-panel">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography className="sp-panel-title">{title}</Typography>
        {headerAction}
      </Box>
      {children}
    </Box>
  );
}

function RowLabel({ title }) {
  return (
    <Box sx={{ px: 0.25, pt: 0.5, pb: 0.25 }}>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: 12,
          opacity: 0.75,
          letterSpacing: 0.4,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function matchesAgeBucket(ageValue, ageBucket) {
  if (ageBucket === "All") return true;

  const normalized = String(ageBucket).replace(/[–—]/g, "-");
  const ageRanges = {
    "25-34": [25, 34],
    "35-44": [35, 44],
    "45-59": [45, 59],
  };

  const [min, max] = ageRanges[normalized] ?? [];
  if (!Number.isFinite(min) || !Number.isFinite(max)) return true;

  return Number.isFinite(ageValue) && ageValue >= min && ageValue <= max;
}

export default function SleepProfile({ data, onEnterCompare }) {
  const [occupation, setOccupation] = useState("Doctor");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");
  const [distributionViewIndex, setDistributionViewIndex] = useState(0);

  const safeData = data ?? EMPTY_DATA;
  const scopedData = useMemo(
    () => safeData.filter((d) => ALLOWED_OCCUPATIONS.includes(d.occupation)),
    [safeData],
  );

  const occupations = ALLOWED_OCCUPATIONS;
  const genders = useMemo(
    () => ["All", ...new Set(safeData.map((d) => d.gender))],
    [safeData],
  );
  const selectedOccupation = occupations.includes(occupation)
    ? occupation
    : ALLOWED_OCCUPATIONS[0];

  const demographicFiltered = useMemo(() => {
    if (!scopedData.length) return [];
    return scopedData
      .filter((d) => gender === "All" || d.gender === gender)
      .filter((d) => matchesAgeBucket(d.age, age));
  }, [scopedData, gender, age]);

  const filtered = useMemo(
    () =>
      demographicFiltered.filter((d) => d.occupation === selectedOccupation),
    [demographicFiltered, selectedOccupation],
  );

  const avg = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "—";

  const avgSleep = avg(
    filtered.map((d) => d.sleepDuration).filter(Number.isFinite),
  );
  const avgQuality = avg(
    filtered.map((d) => d.sleepQuality).filter(Number.isFinite),
  );
  const avgStress = avg(filtered.map((d) => d.stress).filter(Number.isFinite));

  const avgActivity = avg(
    filtered.map((d) => d.activity).filter(Number.isFinite),
  );
  const avgHeartRate = avg(
    filtered.map((d) => d.heartRate).filter(Number.isFinite),
  );
  const avgSteps = avg(filtered.map((d) => d.steps).filter(Number.isFinite));

  const bmiMap = {
    Underweight: 18,
    Normal: 22,
    "Normal Weight": 22,
    Overweight: 27,
    Obese: 32,
  };

  const avgBMI = avg(
    filtered.map((d) => bmiMap[d.bmiCategory]).filter(Number.isFinite),
  );

  const bpAvg = (() => {
    if (!filtered.length) return "—";
    const sys = filtered.map((d) => d.bpSys).filter(Number.isFinite);
    const dia = filtered.map((d) => d.bpDia).filter(Number.isFinite);
    if (!sys.length || !dia.length) return "—";
    const s = (sys.reduce((a, b) => a + b, 0) / sys.length).toFixed(0);
    const di = (dia.reduce((a, b) => a + b, 0) / dia.length).toFixed(0);
    return `${s}/${di}`;
  })();

  const disorderPct = filtered.length
    ? (
        (filtered.filter((d) => d.disorder !== "None").length /
          filtered.length) *
        100
      ).toFixed(0)
    : "—";

  const shortSleepPct = filtered.length
    ? (
        (filtered.filter((d) => d.sleepDuration < 7).length / filtered.length) *
        100
      ).toFixed(0)
    : "—";

  const highStressPct = filtered.length
    ? (
        (filtered.filter((d) => d.stress >= 7).length / filtered.length) *
        100
      ).toFixed(0)
    : "—";

  const highBPPct = filtered.length
    ? (
        (filtered.filter((d) => d.bpSys >= 130 && d.bpDia >= 80).length /
          filtered.length) *
        100
      ).toFixed(0)
    : "—";

  const distributionViews = [
    {
      title: `Sleep Duration Distribution (${selectedOccupation})`,
      content: (
        <Box sx={{ height: 220 }}>
          <DistributionHist
            data={filtered}
            valueKey="sleepDuration"
            title=""
            bins={12}
          />
        </Box>
      ),
    },
    {
      title: `Sleep Scatterplot (${selectedOccupation})`,
      content: (
        <Box sx={{ height: 220 }}>
          <ScatterPlot data={filtered} />
        </Box>
      ),
    },
  ];

  const currentDistributionView = distributionViews[distributionViewIndex];

  const cycleDistributionView = (direction) => {
    setDistributionViewIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return distributionViews.length - 1;
      if (next >= distributionViews.length) return 0;
      return next;
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Box className="sp-card">
        <Box className="sp-header">
          <Box className="sp-controls">
            <Typography className="sp-h-label">Occupation:</Typography>
            <TextField
              select
              size="small"
              value={selectedOccupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="sp-select"
            >
              {occupations.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>

            <Typography className="sp-divider">|</Typography>

            <Typography className="sp-h-label">Gender:</Typography>
            <TextField
              select
              size="small"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="sp-select"
            >
              {genders.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>

            <Typography className="sp-divider">|</Typography>

            <Typography className="sp-h-label">Age:</Typography>
            <TextField
              select
              size="small"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="sp-select"
            >
              {["All", "25–34", "35–44", "45–59"].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="text"
              onClick={onEnterCompare}
              sx={{
                color: "#ff6b6b",
                fontWeight: 800,
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              Enter your own information to compare
            </Button>
            <Typography className="sp-caret">▾</Typography>
          </Box>
        </Box>

        <Box className="sp-body">
          <Grid container spacing={1.5} sx={{ alignContent: "flex-start" }}>
            <Grid size={12}>
              <RowLabel title="Sleep indicators" />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Tile label="Avg Sleep Duration" value={avgSleep} sub=" h" />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Tile label="Avg Sleep Quality" value={avgQuality} sub="/10" />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Tile
                label="Avg Stress Level"
                value={avgStress}
                sub="/10"
                tone={avgStress !== "—" && +avgStress >= 7 ? "warn" : "normal"}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Tile
                label="Sleep Disorder Prevalence"
                value={disorderPct}
                sub="%"
                tone={
                  disorderPct !== "—" && +disorderPct >= 20 ? "warn" : "normal"
                }
              />
            </Grid>

            <Grid size={12}>
              <RowLabel title="Health indicators" />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Tile label="Avg Activity Level" value={avgActivity} />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Tile label="Avg BMI" value={avgBMI} />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Tile label="Avg Blood Pressure" value={bpAvg} />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Tile label="Avg Heart Rate" value={avgHeartRate} sub=" bpm" />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Tile label="Avg Daily Steps" value={avgSteps} />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }} sx={{ minHeight: 0 }}>
              <Grid container spacing={1.5}>
                <Grid size={12} sx={{ minHeight: 0 }}>
                  <Panel title="Sankey: Occupation -> Stress -> Sleep">
                    <SankeyFlow
                      data={demographicFiltered}
                      selectedOccupation={selectedOccupation}
                      onSelectOccupation={setOccupation}
                      height={220}
                    />
                    <Box className="sp-sankey-note">
                      Stress buckets: Low 3-4, Medium 5-6, High 7-8. Sleep
                      buckets: Short &lt; 6.5h, Normal 6.5-8h, Long &gt; 8h.
                    </Box>
                  </Panel>
                </Grid>

                <Grid size={12} sx={{ minHeight: 0 }}>
                  <Panel
                    title={currentDistributionView.title}
                    headerAction={
                      <Box className="sp-panel-nav">
                        <IconButton
                          size="small"
                          onClick={() => cycleDistributionView(-1)}
                          className="sp-panel-arrow"
                        >
                          ←
                        </IconButton>
                        <Typography className="sp-panel-page">
                          {distributionViewIndex + 1}/{distributionViews.length}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => cycleDistributionView(1)}
                          className="sp-panel-arrow"
                        >
                          →
                        </IconButton>
                      </Box>
                    }
                  >
                    {currentDistributionView.content}
                  </Panel>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ minHeight: 0 }}>
              <Panel title="Health risks">
                <Box className="sp-risk-col">
                  <Box className="sp-risk sp-risk-pink">
                    <div>
                      <div className="sp-risk-title">
                        Short Sleep (&lt; 7 hours)
                      </div>
                      <div className="sp-risk-pct">{shortSleepPct}%</div>
                    </div>
                  </Box>

                  <Box className="sp-risk sp-risk-amber">
                    <div>
                      <div className="sp-risk-title">High Stress (≥ 7)</div>
                      <div className="sp-risk-pct">{highStressPct}%</div>
                    </div>
                  </Box>

                  <Box className="sp-risk sp-risk-lav">
                    <div>
                      <div className="sp-risk-title">
                        Elevated BP (&gt; 130/80)
                      </div>
                      <div className="sp-risk-pct">{highBPPct}%</div>
                    </div>
                  </Box>
                </Box>
                <Box className="sp-risk-links" sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 800, mb: 0.75, fontSize: 13 }}>
                    Learn about these risks
                  </Typography>

                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    <li>
                      <a
                        href="https://www.cdc.gov/sleep/about/?CDC_AAref_Val=https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Short sleep health effects
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.cdc.gov/mental-health/?CDC_AAref_Val=https://www.cdc.gov/mentalhealth/stress-coping/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Effects of chronic stress
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.cdc.gov/high-blood-pressure/about/?CDC_AAref_Val=https://www.cdc.gov/bloodpressure/about.htm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        High blood pressure risks
                      </a>
                    </li>
                  </ul>
                </Box>
              </Panel>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
