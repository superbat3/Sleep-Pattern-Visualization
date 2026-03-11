import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const DEFAULT_VALUES = {
  sleepDuration: "",
  sleepQuality: "",
  stress: "",
  activity: "",
  bmi: "",
  bloodPressure: "",
  heartRate: "",
  steps: "",
  disorder: "None",
};

function isBlank(v) {
  return v === "" || v == null;
}

function parseBP(value) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{2,3})\/(\d{2,3})$/);
  if (!match) return null;
  return { sys: Number(match[1]), dia: Number(match[2]) };
}

export default function ComparisonInput({ initialValues, onBack, onSubmit }) {
  const [values, setValues] = useState({ ...DEFAULT_VALUES, ...(initialValues ?? {}) });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};

    const sleepDuration = Number(values.sleepDuration);
    const sleepQuality = Number(values.sleepQuality);
    const stress = Number(values.stress);
    const activity = Number(values.activity);
    const bmi = Number(values.bmi);
    const heartRate = Number(values.heartRate);
    const steps = Number(values.steps);

    if (isBlank(values.sleepDuration)) {
      nextErrors.sleepDuration = "Required";
    } else if (!Number.isFinite(sleepDuration) || sleepDuration <= 0 || sleepDuration > 24) {
      nextErrors.sleepDuration = "Enter a value between 0 and 24";
    }

    if (isBlank(values.sleepQuality)) {
      nextErrors.sleepQuality = "Required";
    } else if (!Number.isFinite(sleepQuality) || sleepQuality < 0 || sleepQuality > 10) {
      nextErrors.sleepQuality = "Enter a value from 0.0 to 10.0";
    }

    if (!isBlank(values.stress) && (!Number.isFinite(stress) || stress < 0 || stress > 10)) {
      nextErrors.stress = "Enter a value from 0 to 10";
    }

    if (!isBlank(values.activity) && (!Number.isFinite(activity) || activity < 0 || activity > 100)) {
      nextErrors.activity = "Enter a value from 0 to 100";
    }

    if (!isBlank(values.bmi) && (!Number.isFinite(bmi) || bmi < 10 || bmi > 60)) {
      nextErrors.bmi = "Enter a BMI from 10 to 60";
    }

    if (!isBlank(values.bloodPressure)) {
      const parsed = parseBP(values.bloodPressure);
      if (!parsed) {
        nextErrors.bloodPressure = "Use format SYS/DIA, e.g. 125/80";
      } else if (
        parsed.sys < 70 ||
        parsed.sys > 250 ||
        parsed.dia < 40 ||
        parsed.dia > 150
      ) {
        nextErrors.bloodPressure = "Enter a realistic blood pressure, e.g. 125/80";
      }
    }

    if (!isBlank(values.heartRate) && (!Number.isFinite(heartRate) || heartRate < 30 || heartRate > 220)) {
      nextErrors.heartRate = "Enter a heart rate from 30 to 220";
    }

    if (!isBlank(values.steps) && (!Number.isFinite(steps) || steps < 0 || steps > 50000)) {
      nextErrors.steps = "Enter daily steps from 0 to 50000";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      sleepDuration: values.sleepDuration === "" ? null : Number(values.sleepDuration),
      sleepQuality: values.sleepQuality === "" ? null : Number(values.sleepQuality),
      stress: values.stress === "" ? null : Number(values.stress),
      activity: values.activity === "" ? null : Number(values.activity),
      bmi: values.bmi === "" ? null : Number(values.bmi),
      bloodPressure: values.bloodPressure || "",
      heartRate: values.heartRate === "" ? null : Number(values.heartRate),
      steps: values.steps === "" ? null : Number(values.steps),
      disorder: values.disorder || "None",
    });
  };

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          background: "#fbfbfc",
          border: "2px solid rgba(40, 50, 70, 0.18)",
          borderRadius: 3,
          boxShadow: "0 10px 24px rgba(25, 35, 55, 0.08)",
          p: 3,
          color: "#2b3a52",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "#2b3a52" }}>
          Enter Your Own Information
        </Typography>

        <Typography sx={{ mb: 3, color: "rgba(43, 58, 82, 0.78)" }}>
          Fill out your information to compare your stats against the dashboard occupations.
          Sleep duration and sleep quality are required.
        </Typography>

        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Hours of Sleep (24)"
              type="number"
              value={values.sleepDuration}
              onChange={handleChange("sleepDuration")}
              error={!!errors.sleepDuration}
              helperText={errors.sleepDuration}
              inputProps={{ step: "0.1", min: 0.1, max: 24.0 }}
            />

            <TextField
              label="Sleep Quality /10 *"
              type="number"
              value={values.sleepQuality}
              onChange={handleChange("sleepQuality")}
              error={!!errors.sleepQuality}
              helperText={errors.sleepQuality}
              inputProps={{ step: "0.1", min: 0, max: 10 }}
            />

            <TextField
              label="Stress Level /10"
              type="number"
              value={values.stress}
              onChange={handleChange("stress")}
              error={!!errors.stress}
              helperText={errors.stress}
              inputProps={{ step: "0.1", min: 0, max: 10 }}
            />

            <TextField
              label="Physical Activity Level (100)"
              type="number"
              value={values.activity}
              onChange={handleChange("activity")}
              error={!!errors.activity}
              helperText={errors.activity}
              inputProps={{ step: "0.1", min: 0, max: 100 }}
            />

            <TextField
              label="BMI"
              type="number"
              value={values.bmi}
              onChange={handleChange("bmi")}
              error={!!errors.bmi}
              helperText={errors.bmi || "Healthy Weight: 18.5 – 24.9"}
              inputProps={{ step: "0.1", min: 10, max: 60 }}
            />

            <TextField
              label="Blood Pressure"
              value={values.bloodPressure}
              onChange={handleChange("bloodPressure")}
              error={!!errors.bloodPressure}
              helperText={errors.bloodPressure || "Format: SYS/DIA"}
              placeholder="125/80"
            />

            <TextField
              label="Heart Rate (min:30, max:220)"
              type="number"
              value={values.heartRate}
              onChange={handleChange("heartRate")}
              error={!!errors.heartRate}
              helperText={errors.heartRate}
              inputProps={{ step: "0.1", min: 30, max: 220 }}
            />

            <TextField
              label="Daily Steps"
              type="number"
              value={values.steps}
              onChange={handleChange("steps")}
              error={!!errors.steps}
              helperText={errors.steps}
              inputProps={{ step: "1", min: 0, max: 50000 }}
              placeholder = "2,000 steps≈1 mile"
            />

            <TextField
              select
              label="Sleep Disorder"
              value={values.disorder}
              onChange={handleChange("disorder")}
            >
              {["None", "Insomnia", "Sleep Apnea"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", pt: 1 }}>
            <Button variant="outlined" onClick={onBack}>
              Back to Dashboard
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Enter Comparison Mode
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}