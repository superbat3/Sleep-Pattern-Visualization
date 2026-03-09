import { useState } from "react";
import "./SleepProfile.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // stable Grid
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

<<<<<<< Updated upstream
=======
import DistributionHist from "./DistributionHist";
import SankeyFlow from "./SankeyFlow";
import BarChart from "./barChart";

const EMPTY_DATA = [];
const ALLOWED_OCCUPATIONS = [
  "Engineer",
  "Accountant",
  "Lawyer",
  "Teacher",
  "Salesperson",
  "Doctor"
];

>>>>>>> Stashed changes
function Tile({ icon, label, value, sub, tone = "normal" }) {
  return (
    <Box className={`sp-tile sp-${tone}`}>
      <Box className="sp-tile-top">
        <Box className="sp-icon">{icon}</Box>
        <Typography className="sp-label">{label}</Typography>
      </Box>
      <Box className="sp-value">
        {value}
        {sub ? <span className="sp-sub">{sub}</span> : null}
      </Box>
    </Box>
  );
}

function Panel({ title, children }) {
  return (
    <Box className="sp-panel">
      <Typography className="sp-panel-title">{title}</Typography>
      {children}
    </Box>
  );
}

function Placeholder({ label }) {
  return <Box className="sp-placeholder">{label}</Box>;
}

<<<<<<< HEAD
export default function SleepProfile({ data }) {
=======
<<<<<<< Updated upstream
export default function SleepProfile({ data, guidedContent }) {
>>>>>>> c012735 (testing_ej)
  const [occupation, setOccupation] = useState("Software Engineer");
=======
function matchesAgeBucket(ageValue, ageBucket) {
  if (ageBucket === "All") return true;

  const normalized = String(ageBucket).replace(/[–—]/g, "-");
  const ageRanges = {
    "25-40": [25, 40],
    "41-60": [41, 60],
  };

  const [min, max] = ageRanges[normalized] ?? [];
  if (!Number.isFinite(min) || !Number.isFinite(max)) return true;

  return Number.isFinite(ageValue) && ageValue >= min && ageValue <= max;
}

export default function SleepProfile({ data }) {
  const [occupation, setOccupation] = useState("Engineer");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");
  const [vizIndex, setVizIndex] = useState(0);


  const safeData = data ?? EMPTY_DATA;
  const scopedData = useMemo(
    () => safeData.filter((d) => ALLOWED_OCCUPATIONS.includes(d.occupation)),
    [safeData],
  );

  const occupations = ALLOWED_OCCUPATIONS;
  const genders = useMemo(() => ["All", ...new Set(safeData.map((d) => d.gender))], [safeData]);
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
    () => demographicFiltered.filter((d) => d.occupation === selectedOccupation),
    [demographicFiltered, selectedOccupation],
  );

  const avg = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "—";

  const avgSleep = avg(filtered.map((d) => d.sleepDuration).filter(Number.isFinite));
  const avgQuality = avg(filtered.map((d) => d.sleepQuality).filter(Number.isFinite));
  const avgStress = avg(filtered.map((d) => d.stress).filter(Number.isFinite));

  const avgActivity = avg(filtered.map((d) => d.activity).filter(Number.isFinite));
  const avgHeartRate = avg(filtered.map((d) => d.heartRate).filter(Number.isFinite));
  const avgSteps = avg(filtered.map((d) => d.steps).filter(Number.isFinite));

  const bmiMap = {
    Underweight: 18,
    Normal: 22,
    Overweight: 27,
    Obese: 32,
  };

  const avgBMI = avg(filtered.map((d) => bmiMap[d.bmiCategory]).filter(Number.isFinite));

  const avg = arr => (arr.length ? (arr.reduce((a,b)=>a+b,0) / arr.length).toFixed(1) : "—");
  const avgSleep = avg(filtered.map(d => d.sleepDuration));
  const avgQuality = avg(filtered.map(d => d.sleepQuality));
  const avgStress = avg(filtered.map(d => d.stress));

  const disorderPct = filtered.length
    ? ((filtered.filter(d => d.disorder !== "None").length / filtered.length) * 100).toFixed(0)
    : "—";

  const shortSleepPct = filtered.length
    ? ((filtered.filter(d => d.sleepDuration < 6.5).length / filtered.length) * 100).toFixed(0)
    : "—";

  const highStressPct = filtered.length
    ? ((filtered.filter(d => d.stress >= 7).length / filtered.length) * 100).toFixed(0)
    : "—";

  const highBPPct = filtered.length
    ? ((filtered.filter(d => d.bpSys >= 130 || d.bpDia >= 85).length / filtered.length) * 100).toFixed(0)
    : "—";

  if (!data) return <div>Loading...</div>;

  const vizViews = [
  {
    label: "Average Sleep by Occupation",
    component: <BarChart data={scopedData} />,
  },
  /*{
    label: "Sleep vs Stress",
    component: <ScatterPlot data={filtered} />,
  },
  {
    label: "Multi-Factor Relationships",
    component: <ParallelCoords data={filtered} />,
  },*/
  {
    label: "Sleep Duration Distribution",
    component: <DistributionHist data={filtered} />,
  },
  {
    label: "Occupation → Stress → Sleep",
    component: <SankeyFlow data={filtered} />,
  },
];


  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Box className="sp-card">
        {/* Header controls */}
        <Box className="sp-header">
          <Box className="sp-controls">
            <Typography className="sp-h-label">Occupation:</Typography>
            <TextField
              select
              size="small"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="sp-select"
            >
              {occupations.map(x => (
                <MenuItem key={x} value={x}>{x}</MenuItem>
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
              {genders.map(x => (
                 <MenuItem key={x} value={x}>{x}</MenuItem>
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
              {["All", "25–40", "41–60"].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Typography className="sp-caret">▾</Typography>
        </Box>

        {/* Main layout */}
<Grid
  container
  spacing={1.5}
  sx={{
    p: 1.5,
    height: "calc(100% - 56px)",
    alignContent: "flex-start",
  }}
>

  {/* Tiles row */}
  <Grid size={{ xs: 12, md: 3 }}>
    <Tile icon="🌙" label="Avg" value={avgSleep} sub=" h" />
  </Grid>

  <Grid size={{ xs: 12, md: 3 }}>
    <Tile icon="🙂" label="Quality" value={avgQuality} sub="/10" />
  </Grid>

  <Grid size={{ xs: 12, md: 3 }}>
    <Tile
      icon="🔥"
      label="Stress"
      value={avgStress}
      sub="/10"
      tone={avgStress >= 7 ? "warn" : "normal"}
    />
  </Grid>

  <Grid size={{ xs: 12, md: 3 }}>
    <Tile
      icon="⚠️"
      label="Disorder"
      value={disorderPct}
      sub="%"
      tone={disorderPct >= 20 ? "warn" : "normal"}
    />
  </Grid>

  {/* Bottom: left + right columns */}
  <Grid size={{ xs: 12, md: 8 }} sx={{ minHeight: 0 }}>
    <Grid container spacing={1.5} sx={{ height: "100%" }}>
      <Grid size={12} sx={{ minHeight: 0 }}>
        <Panel title="Lifestyle">
          <Placeholder label="Lifestyle arc / distribution placeholder" />
        </Panel>
      </Grid>

      <Grid size={12} sx={{ minHeight: 0 }}>
        <Panel title="Distribution">
          <Placeholder label="Histogram placeholder" />
        </Panel>
      </Grid>
    </Grid>
  </Grid>

<<<<<<< Updated upstream
  <Grid size={{ xs: 12, md: 4 }} sx={{ minHeight: 0 }}>
    <Panel title="Health impact">
      <Box className="sp-risk-col">
        <Box className="sp-risk sp-risk-pink">
          <span className="sp-risk-ic">🌙</span>
          <div>
            <div className="sp-risk-title">Short Sleep</div>
            <div className="sp-risk-pct">{shortSleepPct}%</div>
          </div>
=======
          <Grid size={{ xs: 12, md: 2 }}>
            <Tile icon="🧍" label="Avg BMI" value={avgBMI} />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Tile icon="🩺" label="Avg Blood Pressure" value={bpAvg} />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Tile icon="❤️" label="Avg Heart Rate" value={avgHeartRate} sub=" bpm" />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Tile icon="👣" label="Avg Daily Steps" value={avgSteps} />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Tile
              icon="📈"
              label="Elevated BP Prevalence"
              value={highBPPct}
              sub="%"
              tone={highBPPct !== "—" && +highBPPct >= 20 ? "warn" : "normal"}
            />
          </Grid>
          
            </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <button onClick={() => setVizIndex((vizIndex - 1 + vizViews.length) % vizViews.length)}>
                  ◀ Previous
                </button>

                <h3 style={{ margin: 0 }}>{vizViews[vizIndex].label}</h3>

                <button onClick={() => setVizIndex((vizIndex + 1) % vizViews.length)}>
                  Next ▶
                </button>
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  minHeight: "420px",   // give it real space
                  width: "100%",
                }}
              >
                {vizViews[vizIndex].component}
              </div>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ minHeight: 0 }}>
            <Panel title="Health risks">
              <Box className="sp-risk-col">
                <Box className="sp-risk sp-risk-pink">
                  <span className="sp-risk-ic">🌙</span>
                  <div>
                    <div className="sp-risk-title">Short Sleep</div>
                    <div className="sp-risk-pct">{shortSleepPct}%</div>
                  </div>
                </Box>

                <Box className="sp-risk sp-risk-amber">
                  <span className="sp-risk-ic">🔥</span>
                  <div>
                    <div className="sp-risk-title">High Stress</div>
                    <div className="sp-risk-pct">{highStressPct}%</div>
                  </div>
                </Box>

                <Box className="sp-risk sp-risk-lav">
                  <span className="sp-risk-ic">🩺</span>
                  <div>
                    <div className="sp-risk-title">Elevated BP</div>
                    <div className="sp-risk-pct">{highBPPct}%</div>
                  </div>
                </Box>
              </Box>

              <Box className="sp-footnote">
                Mock selection: <b>{selectedOccupation}</b>, Gender <b>{gender}</b>, Age <b>{age}</b>
              </Box>
            </Panel>
          </Grid>
        </Box>
      </Box>

      <Box className="sp-footnote">
        Mock selection: <b>{occupation}</b>, Gender <b>{gender}</b>, Age <b>{age}</b>
      </Box>
    </Panel>
  </Grid>

</Grid>
      </Box>
    </Box>
  );
}