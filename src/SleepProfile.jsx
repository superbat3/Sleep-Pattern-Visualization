import { useMemo, useState } from "react";
import "./SleepProfile.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import DistributionHist from "./DistributionHist";

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

function RowLabel({ title }) {
  return (
    <Box sx={{ px: 0.25, pt: 0.5, pb: 0.25 }}>
      <Typography sx={{ fontWeight: 900, fontSize: 12, opacity: 0.75, letterSpacing: 0.4 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default function SleepProfile({ data }) {
  const [occupation, setOccupation] = useState("Software Engineer");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");

  const safeData = data ?? [];

  const occupations = useMemo(() => [...new Set(safeData.map((d) => d.occupation))], [safeData]);
  const genders = useMemo(() => ["All", ...new Set(safeData.map((d) => d.gender))], [safeData]);

  const filtered = useMemo(() => {
    if (!safeData.length) return [];

    return safeData
      .filter((d) => d.occupation === occupation)
      .filter((d) => gender === "All" || d.gender === gender)
      .filter((d) => {
        if (age === "All") return true;

        const normalized = String(age).replace(/[–—]/g, "-");

        const ageRanges = {
          "18-24": [18, 24],
          "25-40": [25, 40],
          "41-60": [41, 60],
          "60+": [60, 200],
        };

        const range = ageRanges[normalized];
        if (!range) return true;

        const [min, max] = range;
        return d.age >= min && d.age <= max;
      });
  }, [safeData, occupation, gender, age]);

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
    ? ((filtered.filter((d) => d.disorder !== "None").length / filtered.length) * 100).toFixed(0)
    : "—";

  const shortSleepPct = filtered.length
    ? ((filtered.filter((d) => d.sleepDuration < 6.5).length / filtered.length) * 100).toFixed(0)
    : "—";

  const highStressPct = filtered.length
    ? ((filtered.filter((d) => d.stress >= 7).length / filtered.length) * 100).toFixed(0)
    : "—";

  const highBPPct = filtered.length
    ? (
        (filtered.filter((d) => d.bpSys >= 130 || d.bpDia >= 85).length / filtered.length) *
        100
      ).toFixed(0)
    : "—";

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
              value={occupation}
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
              {["All", "18–24", "25–40", "41–60", "60+"].map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Typography className="sp-caret">▾</Typography>
        </Box>

        <Grid
          container
          spacing={1.5}
          sx={{ p: 1.5, height: "calc(100% - 56px)", alignContent: "flex-start" }}
        >
          <Grid size={12}>
            <RowLabel title="Sleep indicators" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Tile icon="🌙" label="Avg Sleep Duration" value={avgSleep} sub=" h" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Tile icon="🙂" label="Avg Sleep Quality" value={avgQuality} sub="/10" />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Tile
              icon="🔥"
              label="Avg Stress Level"
              value={avgStress}
              sub="/10"
              tone={avgStress !== "—" && +avgStress >= 7 ? "warn" : "normal"}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Tile
              icon="⚠️"
              label="Sleep Disorder Prevalence"
              value={disorderPct}
              sub="%"
              tone={disorderPct !== "—" && +disorderPct >= 20 ? "warn" : "normal"}
            />
          </Grid>

          <Grid size={12}>
            <RowLabel title="Health indicators" />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Tile icon="🏃" label="Avg Activity Level" value={avgActivity} />
          </Grid>

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

          <Grid size={{ xs: 12, md: 8 }} sx={{ minHeight: 0 }}>
            <Grid container spacing={1.5} sx={{ height: "100%" }}>
              <Grid size={12} sx={{ minHeight: 0 }}>
                <Panel title="Lifestyle">
                  <Placeholder label="Lifestyle arc / distribution placeholder" />
                </Panel>
              </Grid>

              <Grid size={12} sx={{ minHeight: 0 }}>
                <Panel title="Sleep Duration Distribution">
                  <Box sx={{ height: 260 }}>
                    <DistributionHist
                      data={filtered}
                      valueKey="sleepDuration"
                      title=""
                      bins={12}
                    />
                  </Box>
                </Panel>
              </Grid>
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
                Mock selection: <b>{occupation}</b>, Gender <b>{gender}</b>, Age <b>{age}</b>
              </Box>
            </Panel>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}