import { useState } from "react";
import ComparisonInput from "./ComparisonInput.jsx";
import ComparisonView from "./ComparisonView.jsx";
import SleepProfile from "./SleepProfile.jsx";
import SlideDeck from "./SlideDeck.jsx";
import { useDataset } from "./hooks/loadData.js";
import { slides } from "./slides.jsx";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: grey[800] },
    secondary: { main: grey[700] },
    background: { default: "#ffffff" },
  },
});

export default function App() {
  const [mode, setMode] = useState("slides");
  const [slideIndex, setSlideIndex] = useState(0);
  const [userInput, setUserInput] = useState(null);

  const { data, loading, error } = useDataset();
  const slideData = slides(data);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", bgcolor: "background.default" }}>
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              flex: "0 0 auto",
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {mode === "slides"
                ? "Guided Mode"
                : mode === "dashboard"
                ? "Explore Mode"
                : mode === "input"
                ? "Input Mode"
                : "Comparison Mode"}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {mode === "slides" ? (
                <Button variant="outlined" onClick={() => setMode("dashboard")}>
                  Skip to Dashboard
                </Button>
              ) : mode === "dashboard" ? (
                <Button variant="outlined" onClick={() => setMode("slides")}>
                  Back to Slides
                </Button>
              ) : (
                <Button variant="outlined" onClick={() => setMode("dashboard")}>
                  Back to Dashboard
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
            {error ? (
              <div style={{ padding: 16 }}>Failed to load dataset.</div>
            ) : mode === "slides" ? (
              <SlideDeck
                slides={slideData}
                onFinish={() => setMode("dashboard")}
                onSlideChange={setSlideIndex}
              />
            ) : mode === "dashboard" ? (
              loading ? (
                <div style={{ padding: 16 }}>Loading...</div>
              ) : (
                <SleepProfile
                  data={data}
                  guidedContent={slideData[slideIndex]}
                  loading={loading}
                  onEnterCompare={() => setMode("input")}
                />
              )
            ) : mode === "input" ? (
              <ComparisonInput
                initialValues={userInput}
                onBack={() => setMode("dashboard")}
                onSubmit={(values) => {
                  setUserInput(values);
                  setMode("compare");
                }}
              />
            ) : (
              <ComparisonView
                data={data}
                loading={loading}
                userInput={userInput}
                onBackDashboard={() => setMode("dashboard")}
                onEditInput={() => setMode("input")}
              />
            )}
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}