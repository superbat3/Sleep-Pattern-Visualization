import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

export default function SlideDeck({ slides, onFinish, onSlideChange }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const hasSlides = !!slides?.length;
  const isFirst = index === 0;
  const isLast = hasSlides ? index === slides.length - 1 : true;
  const slide = hasSlides ? slides[index] : null;

  useEffect(() => {
    if (!hasSlides) return;
    onSlideChange?.(index);
  }, [index, onSlideChange, hasSlides]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [index]);

  const goPrev = () => setIndex((v) => Math.max(0, v - 1));
  const goNext = () => setIndex((v) => Math.min(slides.length - 1, v + 1));

  const onClickHalfNav = (e) => {
    if (!hasSlides) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      goPrev();
    } else {
      if (isLast) onFinish?.();
      else goNext();
    }
  };

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!hasSlides) return null;

  return (
    <Box
      sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
      onClick={onClickHalfNav}
    >
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
          px: { xs: 2, md: 6 },
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1000, my: "auto", textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.1,
              mb: 1.5,
              overflowWrap: "anywhere",
            }}
          >
            {slide.title}
          </Typography>

          {slide.subtitle ? (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "1.05rem", md: "1.25rem" } }}
            >
              {slide.subtitle}
            </Typography>
          ) : null}

          <Typography component="div" sx={{ lineHeight: 1.7, fontSize: { xs: 16, md: 18 } }}>
            {slide.body}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
        onClick={stop}
      >
        <Button variant="outlined" onClick={goPrev} disabled={isFirst}>
          ← Back
        </Button>

        {!isLast ? (
          <Button variant="contained" onClick={goNext}>
            Next →
          </Button>
        ) : (
          <Button variant="contained" onClick={onFinish}>
            Start Exploring →
          </Button>
        )}
      </Box>
    </Box>
  );
}