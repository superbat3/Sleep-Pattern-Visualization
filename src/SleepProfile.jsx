import { useState } from "react";
import "./SleepProfile.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // stable Grid
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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

export default function SleepProfile({ data }) {
  const [occupation, setOccupation] = useState("Software Engineer");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");

  // Prevent crash while data is loading
  if (!data) return <div>Loading...</div>;
  console.log("sample row", data[0]);
  console.log("unique occupations", [...new Set(data.map(d => d.occupation))]);
  console.log("unique genders", [...new Set(data.map(d => d.gender))]);
  console.log("RAW AGE VALUE:", JSON.stringify(age));

  const occupations = [...new Set(data.map(d => d.occupation))];
  const genders = ["All", ...new Set(data.map(d => d.gender))];
  

  const filtered = data
    .filter(d => d.occupation === occupation)
    .filter(d => gender === "All" || d.gender === gender)
    .filter(d => {
      if (age === "All") return true;

      // normalize all dash types to a simple hyphen
      const normalized = age.replace(/[–—]/g, "-");

      const ageRanges = {
        "18-24": [18, 24],
        "25-40": [25, 40],
        "41-60": [41, 60],
        "60+": [60, 200],
      };

      const [min, max] = ageRanges[normalized];
      return d.age >= min && d.age <= max;
    });

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
              {["All", "18–24", "25–40", "41–60", "60+"].map((x) => (
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

  <Grid size={{ xs: 12, md: 4 }} sx={{ minHeight: 0 }}>
    <Panel title="Health impact">
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
          <span className="sp-risk-ic">🧾</span>
          <div>
            <div className="sp-risk-title">Elevated BMI/BP</div>
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