import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend, } from "recharts";

const ALLOWED_OCCUPATIONS = [
  "Engineer",
  "Accountant",
  "Lawyer",
  "Teacher",
  "Salesperson",
  "Doctor",
];

function StatRow({ label, userValue, occupationValue, better = null }) {
  const background =
    better === "user"
      ? "rgba(120, 200, 140, 0.18)"
      : better === "occupation"
      ? "rgba(245, 204, 140, 0.25)"
      : "#ffffff";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr",
        gap: 1,
        alignItems: "center",
        p: 1.25,
        borderRadius: 2,
        background,
        border: "1px solid rgba(40, 50, 70, 0.12)",
      }}
    >
      <Typography sx={{ fontWeight: 700, color: "#2b3a52" }}>{label}</Typography>
      <Typography sx={{ textAlign: "center", color: "#2b3a52" }}>{userValue}</Typography>
      <Typography sx={{ textAlign: "center", color: "#2b3a52" }}>{occupationValue}</Typography>
    </Box>
  );
}

function parseBP(bpString) {
  if (!bpString || typeof bpString !== "string") return null;
  const parts = bpString.split("/").map((x) => Number(x.trim()));
  if (parts.length !== 2 || parts.some((x) => !Number.isFinite(x))) return null;
  return { sys: parts[0], dia: parts[1] };
}

function formatValue(value, suffix = "") {
  if (value == null || value === "") return "—";
  return `${value}${suffix}`;
}

export default function ComparisonView({
  data,
  userInput,
  onBackDashboard,
  onEditInput,
}) {
  const [occupation, setOccupation] = useState("Doctor");

  const filtered = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((d) => d.occupation === occupation);
  }, [data, occupation]);

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
    "Normal Weight": 22,
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

  const occupationDisorderPct = filtered.length
    ? ((filtered.filter((d) => d.disorder !== "None").length / filtered.length) * 100).toFixed(0)
    : "—";

  const userBP = parseBP(userInput?.bloodPressure ?? "");
  const occupationBP = parseBP(bpAvg);

  const compareLowerBetter = (user, occ) => {
    if (user == null || occ == null || occ === "—") return null;
    return Number(user) <= Number(occ) ? "user" : "occupation";
  };

  const compareHigherBetter = (user, occ) => {
    if (user == null || occ == null || occ === "—") return null;
    return Number(user) >= Number(occ) ? "user" : "occupation";
  };

  const compareBP = () => {
    if (!userBP || !occupationBP) return null;
    const userScore = userBP.sys + userBP.dia;
    const occScore = occupationBP.sys + occupationBP.dia;
    return userScore <= occScore ? "user" : "occupation";
  };

function ComparisonRadar({ userInput, stats }) {
  const normalize = (value, max) =>
    Number((Number(value) / max).toFixed(2));

  const data = [
    { metric: "Sleep", you: normalize(userInput.sleepDuration, 10), occ: normalize(stats.avgSleep, 10) },
    { metric: "Quality", you: normalize(userInput.sleepQuality, 10), occ: normalize(stats.avgQuality, 10) },
    { metric: "Stress", you: normalize(userInput.stress, 10), occ: normalize(stats.avgStress, 10) },
    { metric: "Activity", you: normalize(userInput.activity, 100), occ: normalize(stats.avgActivity, 100) },
    { metric: "BMI", you: normalize(userInput.bmi, 40), occ: normalize(stats.avgBMI, 40) },
    { metric: "Heart Rate", you: normalize(userInput.heartRate, 120), occ: normalize(stats.avgHeartRate, 120) },
    { metric: "Steps", you: normalize(userInput.steps, 15000), occ: normalize(stats.avgSteps, 15000) },
  ];

  return (
    <Box sx={{ width: "100%", height: 380, mb: 4 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Radar
            name="You"
            dataKey="you"
            stroke="#4A6CF7"
            fill="#4A6CF7"
            fillOpacity={0.45}
          />
          <Radar
            name="Occupation Avg"
            dataKey="occ"
            stroke="#f11313"
            fill="#f11313"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          maxWidth: 1050,
          mx: "auto",
          background: "#fbfbfc",
          border: "2px solid rgba(40, 50, 70, 0.18)",
          borderRadius: 3,
          boxShadow: "0 10px 24px rgba(25, 35, 55, 0.08)",
          p: 3,
          color: "#2b3a52",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#2b3a52" }}>
              Comparison Mode
            </Typography>
            <Typography sx={{ color: "rgba(43, 58, 82, 0.78)", mt: 0.5 }}>
              Compare your input against an occupation average from the dashboard.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={onEditInput}>
              Re-input Data
            </Button>
            <Button variant="outlined" onClick={onBackDashboard}>
              Back to Dashboard
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ mb: 3, maxWidth: 280 }}>
          <TextField
            select
            fullWidth
            label="Compare against occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          >
            {ALLOWED_OCCUPATIONS.map((x) => (
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: 1,
            mb: 1.5,
            px: 1.25,
          }}
        >
          <Typography sx={{ fontWeight: 800, opacity: 0.75, color: "#33435d" }}>
            Metric
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontWeight: 800, opacity: 0.75, color: "#4A6CF7" }}
          >
            You
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontWeight: 800, opacity: 0.75, color: "#f11313" }}
          >
            {occupation}
          </Typography>
        </Box>

      <ComparisonRadar
        userInput={userInput}
        stats={{
          avgSleep,
          avgQuality,
          avgStress,
          avgActivity,
          avgHeartRate,
          avgSteps,
          avgBMI,
        }}
      />

        <Stack spacing={1.2}>
          <StatRow
            label="Sleep Duration"
            userValue={formatValue(userInput?.sleepDuration, " h")}
            occupationValue={formatValue(avgSleep, " h")}
            better={compareHigherBetter(userInput?.sleepDuration, avgSleep)}
          />

          <StatRow
            label="Sleep Quality"
            userValue={formatValue(userInput?.sleepQuality, "/10")}
            occupationValue={formatValue(avgQuality, "/10")}
            better={compareHigherBetter(userInput?.sleepQuality, avgQuality)}
          />

          <StatRow
            label="Stress Level"
            userValue={formatValue(userInput?.stress, "/10")}
            occupationValue={formatValue(avgStress, "/10")}
            better={compareLowerBetter(userInput?.stress, avgStress)}
          />

          <StatRow
            label="Physical Activity"
            userValue={formatValue(userInput?.activity)}
            occupationValue={formatValue(avgActivity)}
            better={compareHigherBetter(userInput?.activity, avgActivity)}
          />

          <StatRow
            label="BMI"
            userValue={formatValue(userInput?.bmi)}
            occupationValue={formatValue(avgBMI)}
            better={compareLowerBetter(userInput?.bmi, avgBMI)}
          />

          <StatRow
            label="Blood Pressure"
            userValue={formatValue(userInput?.bloodPressure)}
            occupationValue={formatValue(bpAvg)}
            better={compareBP()}
          />

          <StatRow
            label="Heart Rate"
            userValue={formatValue(userInput?.heartRate, " bpm")}
            occupationValue={formatValue(avgHeartRate, " bpm")}
            better={compareLowerBetter(userInput?.heartRate, avgHeartRate)}
          />

          <StatRow
            label="Daily Steps"
            userValue={formatValue(userInput?.steps)}
            occupationValue={formatValue(avgSteps)}
            better={compareHigherBetter(userInput?.steps, avgSteps)}
          />

          <StatRow
            label="Sleep Disorder"
            userValue={formatValue(userInput?.disorder)}
            occupationValue={occupationDisorderPct === "—" ? "—" : `${occupationDisorderPct}% prevalence`}
          />
        </Stack>
      </Box>
    </Box>
  );
}