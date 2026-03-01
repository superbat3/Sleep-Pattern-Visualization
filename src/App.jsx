import { useMemo, useState } from "react";
import SleepProfile from "./SleepProfile.jsx";
import SlideDeck from "./SlideDeck.jsx";

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
  const [mode, setMode] = useState("slides"); // "slides" | "dashboard"

  const slides = useMemo(
    () => [
      {
        title: "Sleep Patterns Visualization",
        subtitle: "Guided story mode (mock)",
        body: (
          <>
            <p>
              This dashboard explores how sleep duration/quality vary across groups and how they relate
              to stress, lifestyle, and health indicators.
            </p>
            <ul>
              <li>Compare group sleep profiles</li>
              <li>Explore relationships (stress ↔ sleep)</li>
              <li>Connect sleep outcomes to health markers</li>
            </ul>
          </>
        ),
      },
      {
        title: "How to Read It",
        subtitle: "Encodings (placeholder)",
        body: (
          <>
            <p>
              This slide will explain the key encodings: stress buckets, sleep buckets, and risk flags.
            </p>
            <p>For now, it’s a placeholder so you can test the slideshow flow.</p>
          </>
        ),
      },
      {
        title: "Transition to Exploration",
        subtitle: "Go to the dashboard",
        body: (
          <>
            <p>
              Next you’ll enter the dashboard view (still mock data), where controls, tiles, and panels
              update based on selection.
            </p>
          </>
        ),
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      {/* Full window shell */}
      <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", bgcolor: "background.default" }}>
        <Stack sx={{ height: "100%" }}>
          {/* Top Bar */}
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
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Sleep Patterns Visualization
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {mode === "slides" ? (
                <Button variant="outlined" onClick={() => setMode("dashboard")}>
                  Skip to Dashboard
                </Button>
              ) : (
                <Button variant="outlined" onClick={() => setMode("slides")}>
                  Back to Slides
                </Button>
              )}
            </Box>
          </Box>

          {/* Content area MUST have minHeight: 0 to avoid overflow issues */}
          <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
            {mode === "slides" ? (
              <SlideDeck slides={slides} onFinish={() => setMode("dashboard")} />
            ) : (
              <SleepProfile />
            )}
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}