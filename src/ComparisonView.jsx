import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ALLOWED_OCCUPATIONS = [
  "Management",
  "Healthcare",
  "Production",
  "Food_Preparation_Serving",
  "Sales",
  "Office_Administrative_Support",
  "Construction_Extraction",
  "Transportation_Material_Moving",
];

const OCC_LABELS = {
  Management: "Management",
  Healthcare: "Healthcare",
  Production: "Production",
  Food_Preparation_Serving: "Food Service",
  Sales: "Sales",
  Office_Administrative_Support: "Office / Admin Support",
  Construction_Extraction: "Construction & Extraction",
  Transportation_Material_Moving: "Transportation / Material Moving",
};

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const comparisonBackground = `linear-gradient(140deg, rgba(15, 37, 58, 0.8), rgba(35, 87, 98, 0.75)), url('${asset("slide-bg/custom/slide-2.jpg")}')`;

function StatRow({ label, userValue, occupationValue, better = null }) {
  const background =
    better === "user"
      ? "rgba(120, 200, 140, 0.18)"
      : better === "occupation"
        ? "rgba(245, 204, 140, 0.25)"
        : "rgba(255,255,255,0.84)";

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
      <Typography sx={{ fontWeight: 700, color: "#134851" }}>{label}</Typography>
      <Typography sx={{ textAlign: "center", color: "#134851" }}>{userValue}</Typography>
      <Typography sx={{ textAlign: "center", color: "#134851" }}>{occupationValue}</Typography>
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

function toNumberOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalize(value, max) {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(n / max, 1);
}

function formatRadarRaw(value, suffix = "") {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(1)}${suffix}`;
}

function CustomRadarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(40, 50, 70, 0.16)",
        borderRadius: 2,
        px: 1.5,
        py: 1,
        boxShadow: "0 8px 20px rgba(10, 20, 40, 0.14)",
      }}
    >
      <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#134851", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#1E6C75" }}>
        You: {formatRadarRaw(row.youRaw, row.suffix)}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#d13c3c" }}>
        Occupation Avg: {formatRadarRaw(row.occRaw, row.suffix)}
      </Typography>
    </Box>
  );
}

function ComparisonRadar({ userInput, stats }) {
  const radarData = [
    {
      metric: "Sleep",
      you: normalize(userInput?.sleepDuration, 10),
      occ: normalize(stats.avgSleep, 10),
      youRaw: toNumberOrNull(userInput?.sleepDuration),
      occRaw: toNumberOrNull(stats.avgSleep),
      suffix: " h",
    },
    {
      metric: "Stress",
      you: normalize(userInput?.stress, 10),
      occ: normalize(stats.avgStress, 10),
      youRaw: toNumberOrNull(userInput?.stress),
      occRaw: toNumberOrNull(stats.avgStress),
      suffix: "/10",
    },
    {
      metric: "Activity",
      you: normalize(userInput?.activityLevel, 10),
      occ: normalize(stats.avgActivity, 10),
      youRaw: toNumberOrNull(userInput?.activityLevel),
      occRaw: toNumberOrNull(stats.avgActivity),
      suffix: "/10",
    },
    {
      metric: "BMI",
      you: normalize(userInput?.bmi, 60),
      occ: normalize(stats.avgBMI, 60),
      youRaw: toNumberOrNull(userInput?.bmi),
      occRaw: toNumberOrNull(stats.avgBMI),
      suffix: "",
    },
    {
      metric: "Heart Rate",
      you: normalize(userInput?.heartRate, 120),
      occ: normalize(stats.avgHeartRate, 120),
      youRaw: toNumberOrNull(userInput?.heartRate),
      occRaw: toNumberOrNull(stats.avgHeartRate),
      suffix: " bpm",
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 380, mb: 4 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius="72%">
          <PolarGrid
            radialLines={true}
            stroke="rgba(60,80,110,0.45)"
          />

          <PolarAngleAxis
            dataKey="metric"
            tickLine={false}
            axisLine={false}
          />

          <PolarRadiusAxis
            domain={[0, 1]}
            tick={false}
            axisLine={false}
          />

          <Tooltip content={<CustomRadarTooltip />} cursor={false} />

          <Radar
            name="You"
            dataKey="you"
            stroke="#1E6C75"
            fill="#1E6C75"
            fillOpacity={0.45}
            dot={false}
            activeDot={false}
          />

          <Radar
            name="Occupation Avg"
            dataKey="occ"
            stroke="#d13c3c"
            fill="#d13c3c"
            fillOpacity={0.35}
            dot={false}
            activeDot={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default function ComparisonView({
  data,
  userInput,
  onBackDashboard,
  onEditInput,
}) {
  const [occupation, setOccupation] = useState(ALLOWED_OCCUPATIONS[0]);

  const filtered = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((d) => d.occupation === occupation);
  }, [data, occupation]);

  const avg = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "—";

  const avgSleep = avg(filtered.map((d) => d.sleepDuration).filter(Number.isFinite));
  const avgStress = avg(filtered.map((d) => d.stress).filter(Number.isFinite));
  const avgActivity = avg(filtered.map((d) => d.activityLevel).filter(Number.isFinite));
  const avgHeartRate = avg(filtered.map((d) => d.heartRate).filter(Number.isFinite));
  const avgBMI = avg(filtered.map((d) => d.bmi).filter(Number.isFinite));

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
    ? (
        (filtered.filter((d) => d.disorder && d.disorder !== "None").length /
          filtered.length) *
        100
      ).toFixed(0)
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

  return (
    <Box
      sx={{
        position: "relative",
        p: 3,
        height: "100%",
        overflow: "auto",
        background: comparisonBackground,
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
            "radial-gradient(circle at 14% 16%, rgba(255,255,255,0.20), transparent 28%), radial-gradient(circle at 88% 78%, rgba(255,255,255,0.14), transparent 26%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1050,
          mx: "auto",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(245, 253, 253, 0.62))",
          border: "1px solid rgba(33, 99, 107, 0.2)",
          borderRadius: 4,
          boxShadow: "0 12px 34px rgba(10, 20, 40, 0.16)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          p: 3,
          color: "#134851",
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
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#134851" }}>
              Comparison Mode
            </Typography>
            <Typography sx={{ color: "#2B5E67", mt: 0.5 }}>
              Compare your input against an occupation average from the dashboard.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              onClick={onEditInput}
              sx={{ color: "#1E6C75", borderColor: "rgba(30, 108, 117, 0.45)" }}
            >
              Re-input Data
            </Button>
            <Button
              variant="outlined"
              onClick={onBackDashboard}
              sx={{ color: "#1E6C75", borderColor: "rgba(30, 108, 117, 0.45)" }}
            >
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
            {ALLOWED_OCCUPATIONS.map((occ) => (
              <MenuItem key={occ} value={occ}>
                {OCC_LABELS[occ] ?? occ}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 4, md: 8 },
            alignItems: "center",
            mb: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#1E6C75",
              }}
            />
            <Typography sx={{ fontWeight: 800, color: "#1E6C75" }}>You</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#d13c3c",
              }}
            />
            <Typography sx={{ fontWeight: 800, color: "#d13c3c" }}>
              {OCC_LABELS[occupation] ?? occupation}
            </Typography>
          </Box>
        </Box>

        <ComparisonRadar
          userInput={userInput}
          stats={{
            avgSleep,
            avgStress,
            avgActivity,
            avgHeartRate,
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
            label="Stress Level"
            userValue={formatValue(userInput?.stress, "/10")}
            occupationValue={formatValue(avgStress, "/10")}
            better={compareLowerBetter(userInput?.stress, avgStress)}
          />

          <StatRow
            label="Physical Activity Level"
            userValue={formatValue(userInput?.activityLevel, "/10")}
            occupationValue={formatValue(avgActivity, "/10")}
            better={compareHigherBetter(userInput?.activityLevel, avgActivity)}
          />

          <StatRow
            label="BMI"
            userValue={formatValue(userInput?.bmi)}
            occupationValue={formatValue(avgBMI)}
            better={compareLowerBetter(userInput?.bmi, avgBMI)}
          />

          <StatRow
            label="Heart Rate"
            userValue={formatValue(userInput?.heartRate, " bpm")}
            occupationValue={formatValue(avgHeartRate, " bpm")}
            better={compareLowerBetter(userInput?.heartRate, avgHeartRate)}
          />

          <StatRow
            label="Sleep Disorder"
            userValue={formatValue(userInput?.disorder)}
            occupationValue={
              occupationDisorderPct === "—"
                ? "—"
                : `${occupationDisorderPct}% prevalence`
            }
          />
        </Stack>
      </Box>
    </Box>
  );
}