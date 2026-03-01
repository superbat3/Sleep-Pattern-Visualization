import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";

export default function SlideDeck({ slides, onFinish }) {
  const [i, setI] = useState(0);

  const isFirst = i === 0;
  const isLast = i === slides.length - 1;

  const progressText = useMemo(() => `${i + 1} / ${slides.length}`, [i, slides.length]);
  const slide = slides[i];

  if (!slides?.length) return null;

  return (
    <Box
      sx={{
        height: "100%",
        display: "grid",
        placeItems: "center",
        p: 2,
        overflow: "hidden",
      }}
    >
      {/* Card fills most of viewport height, scrolls internally if content is tall */}
      <Box
        sx={{
          width: "min(900px, 100%)",
          height: "100%",
          maxHeight: "760px",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "auto",
        }}
      >
        {/* top meta */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Chip label="Guided Mode" />
          <Typography variant="body2" color="text.secondary">
            {progressText}
          </Typography>
        </Box>

        {/* titles */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
            {slide.title}
          </Typography>
          {slide.subtitle ? (
            <Typography variant="subtitle1" color="text.secondary">
              {slide.subtitle}
            </Typography>
          ) : null}
        </Box>

        {/* body */}
        <Box sx={{ flex: "1 1 auto" }}>
          {/* Use MUI Typography defaults but allow your HTML */}
          <Typography component="div" sx={{ lineHeight: 1.6 }}>
            {slide.body}
          </Typography>
        </Box>

        {/* nav */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <Button variant="outlined" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={isFirst}>
            ← Back
          </Button>

          {!isLast ? (
            <Button variant="contained" onClick={() => setI((v) => Math.min(slides.length - 1, v + 1))}>
              Next →
            </Button>
          ) : (
            <Button variant="contained" onClick={onFinish}>
              Start Exploring →
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}