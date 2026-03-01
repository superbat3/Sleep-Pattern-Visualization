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

export default function SleepProfile() {
  const [occupation, setOccupation] = useState("Software Engineer");
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");

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
              {["Software Engineer", "Nurse", "Doctor", "Teacher", "Sales Representative"].map((x) => (
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
              {["All", "Male", "Female"].map((x) => (
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
          <Grid item xs={12} md={3}>
            <Tile icon="🌙" label="Avg" value="6.5" sub=" h" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Tile icon="🙂" label="Quality" value="7.1" sub="/10" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Tile icon="🔥" label="Stress" value="7" sub="/10" tone="warn" />
          </Grid>
          <Grid item xs={12} md={3}>
            <Tile icon="⚠️" label="Disorder" value="18" sub="%" tone="warn" />
          </Grid>

          {/* Bottom: left + right columns */}
          <Grid item xs={12} md={8} sx={{ minHeight: 0 }}>
            <Grid container spacing={1.5} sx={{ height: "100%" }}>
              <Grid item xs={12} sx={{ minHeight: 0 }}>
                <Panel title="Lifestyle">
                  <Placeholder label="Lifestyle arc / distribution placeholder" />
                </Panel>
              </Grid>

              <Grid item xs={12} sx={{ minHeight: 0 }}>
                <Panel title="Distribution">
                  <Placeholder label="Histogram placeholder" />
                </Panel>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} sx={{ minHeight: 0 }}>
            <Panel title="Health impact">
              <Box className="sp-risk-col">
                <Box className="sp-risk sp-risk-pink">
                  <span className="sp-risk-ic">🌙</span>
                  <div>
                    <div className="sp-risk-title">Short Sleep</div>
                    <div className="sp-risk-pct">38%</div>
                  </div>
                </Box>

                <Box className="sp-risk sp-risk-amber">
                  <span className="sp-risk-ic">🔥</span>
                  <div>
                    <div className="sp-risk-title">High Stress</div>
                    <div className="sp-risk-pct">47%</div>
                  </div>
                </Box>

                <Box className="sp-risk sp-risk-lav">
                  <span className="sp-risk-ic">🧾</span>
                  <div>
                    <div className="sp-risk-title">Elevated BMI/BP</div>
                    <div className="sp-risk-pct">24%</div>
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