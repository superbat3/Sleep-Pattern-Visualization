import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const DEFAULT_VALUES = {
  sleepDuration: "",
  stress: "",
  activityLevel: "",
  bmi: "",
  heartRate: "",
  disorder: "None",
};

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const inputBackground = `linear-gradient(135deg, rgba(13, 26, 45, 0.84), rgba(38, 68, 110, 0.78)), url('${asset("slide-bg/custom/slide-1.jpg")}')`;

function isBlank(v) {
  return v === "" || v == null;
}

export default function ComparisonInput({ initialValues, onBack, onSubmit }) {
  const [values, setValues] = useState({
    ...DEFAULT_VALUES,
    ...(initialValues ?? {}),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};

    const sleepDuration = Number(values.sleepDuration);
    const stress = Number(values.stress);
    const activityLevel = Number(values.activityLevel);
    const bmi = Number(values.bmi);
    const heartRate = Number(values.heartRate);

    if (isBlank(values.sleepDuration)) {
      nextErrors.sleepDuration = "Required";
    } else if (
      !Number.isFinite(sleepDuration) ||
      sleepDuration <= 0 ||
      sleepDuration > 24
    ) {
      nextErrors.sleepDuration = "Enter a value between 0 and 24";
    }

    if (
      !isBlank(values.stress) &&
      (!Number.isFinite(stress) || stress < 0 || stress > 10)
    ) {
      nextErrors.stress = "Enter a value from 0 to 10";
    }

    if (
      !isBlank(values.activityLevel) &&
      (!Number.isFinite(activityLevel) || activityLevel < 0 || activityLevel > 10)
    ) {
      nextErrors.activityLevel = "Enter a value from 0 to 10";
    }

    if (
      !isBlank(values.bmi) &&
      (!Number.isFinite(bmi) || bmi < 10 || bmi > 80)
    ) {
      nextErrors.bmi = "Enter a BMI from 10 to 80";
    }

    if (
      !isBlank(values.heartRate) &&
      (!Number.isFinite(heartRate) || heartRate < 30 || heartRate > 220)
    ) {
      nextErrors.heartRate = "Enter a heart rate from 30 to 220";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      sleepDuration:
        values.sleepDuration === "" ? null : Number(values.sleepDuration),
      stress: values.stress === "" ? null : Number(values.stress),
      activityLevel:
        values.activityLevel === "" ? null : Number(values.activityLevel),
      bmi: values.bmi === "" ? null : Number(values.bmi),
      heartRate: values.heartRate === "" ? null : Number(values.heartRate),
      disorder: values.disorder || "None",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        p: 3,
        height: "100%",
        overflow: "auto",
        background: inputBackground,
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

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          mx: "auto",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(246, 249, 255, 0.56))",
          border: "1px solid rgba(34, 49, 74, 0.14)",
          borderRadius: 4,
          boxShadow: "0 12px 34px rgba(10, 20, 40, 0.16)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          p: 3,
          color: "#1A1E2A",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, mb: 1, color: "#142B4F" }}
        >
          Enter Your Own Information
        </Typography>

        <Typography sx={{ mb: 3, color: "#334D73" }}>
          Fill out your information to compare your stats against the dashboard
          occupations. Sleep duration is required.
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
              label="Hours of Sleep"
              type="number"
              value={values.sleepDuration}
              onChange={handleChange("sleepDuration")}
              error={!!errors.sleepDuration}
              helperText={errors.sleepDuration}
              inputProps={{ step: "0.1", min: 0.1, max: 24 }}
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
              label="Activity Level /10"
              type="number"
              value={values.activityLevel}
              onChange={handleChange("activityLevel")}
              error={!!errors.activityLevel}
              helperText={errors.activityLevel}
              inputProps={{ step: "0.1", min: 0, max: 10 }}
            />

            <TextField
              label="BMI"
              type="number"
              value={values.bmi}
              onChange={handleChange("bmi")}
              error={!!errors.bmi}
              helperText={errors.bmi || "Example: 18.5 – 24.9 is often considered healthy"}
              inputProps={{ step: "0.1", min: 10, max: 80 }}
            />

            <TextField
              label="Heart Rate"
              type="number"
              value={values.heartRate}
              onChange={handleChange("heartRate")}
              error={!!errors.heartRate}
              helperText={errors.heartRate}
              inputProps={{ step: "0.1", min: 30, max: 220 }}
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
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{ color: "#2E5AA7", borderColor: "rgba(46, 90, 167, 0.5)" }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: "linear-gradient(90deg, #2E5AA7, #6A8BFF)",
              }}
            >
              Enter Comparison Mode
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}