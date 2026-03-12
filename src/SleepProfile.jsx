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
  "Management",
  "Healthcare",
  "Production",
  "Food_Preparation_Serving",
  "Sales",
  "Office_Administrative_Support",
  "Construction_Extraction",
  "Transportation_Material_Moving"
];
const OCC_LABELS = {
  Management: "Management",
  Healthcare: "Healthcare",
  Production: "Production",
  Food_Preparation_Serving: "Food Service",
  Sales: "Sales",
  Office_Administrative_Support: "Office / Admin Support",
  Construction_Extraction: "Construction & Extraction",
  Transportation_Material_Moving: "Transportation / Material Moving"
};




const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const sleepDashboardBackground =
  `linear-gradient(135deg, rgba(13, 26, 45, 0.84), rgba(38, 68, 110, 0.78)), url('${asset("slide-bg/custom/slide-2.jpg")}')`;
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
          color: "#42506E",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}



export default function SleepProfile({ data, onEnterCompare }) {
  const [occupation, setOccupation] = useState("Management");
  const [distributionViewIndex, setDistributionViewIndex] = useState(0);

  const safeData = data ?? EMPTY_DATA;
  const scopedData = useMemo(() => {
    return safeData
      .map(d => {
        let occ = d.occupation;

        if (occ === "Healthcare_Practitioners" || occ === "Healthcare_Support") {
          occ = "Healthcare";
        }

        return { ...d, occupation: occ };
      })
      .filter(d => ALLOWED_OCCUPATIONS.includes(d.occupation));
  }, [safeData]);

  const occupations = ALLOWED_OCCUPATIONS;

  const selectedOccupation = ALLOWED_OCCUPATIONS.includes(occupation)
    ? occupation
    : ALLOWED_OCCUPATIONS[0];


  const demographicFiltered = scopedData
     
  const filtered = useMemo(
    () => demographicFiltered.filter((d) => d.occupation === selectedOccupation),
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
  
  const stressVals = filtered
  .map((d) => d.stress)
  .filter(Number.isFinite);

  let avgStress = "—";

  if (stressVals.length > 0) {
    const minStress = Math.min(...stressVals);
    const maxStress = Math.max(...stressVals);

    if (maxStress !== minStress) {
      avgStress = (
        stressVals
          .map((v) => ((v - minStress) / (maxStress - minStress)) * 10)
          .reduce((a, b) => a + b, 0) / stressVals.length
      ).toFixed(1);
    } else {
      avgStress = stressVals[0].toFixed(1);
    }
  }

  const avgActivity = avg(
    filtered.map((d) => d.activityLevel).filter(Number.isFinite), 
  );
  const avgHeartRate = avg(
    filtered.map((d) => d.heartRate).filter(Number.isFinite),
  );

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

  const disorderPct = "—";

  const shortSleepPct = filtered.length
    ? (
        (filtered.filter((d) => d.sleepDuration < 7).length / filtered.length) *
        100
      ).toFixed(0)
    : "—";

  const highStressPct = filtered.length
    ? (
        (filtered.filter((d) => d.stress >= 5).length / filtered.length) *
        100
      ).toFixed(0)
    : "—";

  const highBPPct = filtered.length
  ? (
      (filtered.filter((d) => d.bpSys >= 130 || d.bpDia >= 80).length /
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
    <Box
      sx={{
        position: "relative",
        height: "100%",
        p: 2,
        overflow: "hidden",
        background: sleepDashboardBackground,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 14% 16%, rgba(255,255,255,0.24), transparent 28%), radial-gradient(circle at 88% 78%, rgba(255,255,255,0.18), transparent 26%)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
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
                {ALLOWED_OCCUPATIONS.map((occ) => (
                  <MenuItem key={occ} value={occ}>
                    {OCC_LABELS[occ]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="text"
                onClick={onEnterCompare}
                sx={{
                  color: "#2E5AA7",
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
                <Tile
                  label="Avg Stress Level"
                  value={avgStress}
                  sub="/10"
                  tone={avgStress !== "—" && +avgStress >= 7 ? "warn" : "normal"}
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

              {/* Steps removed: NHANES dataset has no steps column */}

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
                      Stress buckets represent relative mental-health score tiers
                      (lowest third, middle third, highest third of the dataset).
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
                          Short Sleep (&lt; avg 6 hours)
                        </div>
                        <div className="sp-risk-pct">{shortSleepPct}%</div>
                      </div>
                    </Box>

                    <Box className="sp-risk sp-risk-amber">
                      <div>
                        <div className="sp-risk-title">High Stress (≥ 5)</div>
                        <div className="sp-risk-pct">{highStressPct}%</div>
                      </div>
                    </Box>

                    <Box className="sp-risk sp-risk-lav">
                      <div>
                        <div className="sp-risk-title">
                          Elevated BP (≥ 130/80)
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
                          Dealing with stress and mental health
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
    </Box>
  );
}