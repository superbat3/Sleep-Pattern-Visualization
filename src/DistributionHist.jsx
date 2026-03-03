import { useEffect, useMemo, useRef, useState } from "react";

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function useResizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries?.[0]?.contentRect;
      if (!cr) return;
      setSize({ width: cr.width, height: cr.height });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

export default function DistributionHist({
  data,
  valueKey = "sleepDuration",
  title = "Sleep Duration Distribution",
  bins = 12,
}) {
  const wrapRef = useRef(null);
  const { width } = useResizeObserver(wrapRef);

  const values = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((d) => Number(d?.[valueKey]))
      .filter((v) => Number.isFinite(v));
  }, [data, valueKey]);

  const { edges, counts, maxCount } = useMemo(() => {
    if (!values.length) {
      return { edges: [], counts: [], maxCount: 0 };
    }

    let vmin = Math.min(...values);
    let vmax = Math.max(...values);

    if (vmin === vmax) {
      vmin -= 0.5;
      vmax += 0.5;
    }

    const nBins = Math.max(4, Math.floor(bins));
    const step = (vmax - vmin) / nBins;

    const e = Array.from({ length: nBins + 1 }, (_, i) => vmin + i * step);
    const c = Array.from({ length: nBins }, () => 0);

    for (const v of values) {
      let idx = Math.floor((v - vmin) / step);
      idx = clamp(idx, 0, nBins - 1);
      c[idx] += 1;
    }

    const mc = c.length ? Math.max(...c) : 0;
    return { edges: e, counts: c, maxCount: mc };
  }, [values, bins]);

  const height = 220;
  const pad = { top: 28, right: 16, bottom: 36, left: 45 };

  const innerW = Math.max(0, (width || 0) - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;

  const barW = counts.length ? innerW / counts.length : 0;
  const xLabelEvery = counts.length > 12 ? 2 : 1;

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      <svg width="100%" height={height} viewBox={`0 0 ${Math.max(1, width || 1)} ${height}`}>
        <text x={pad.left} y={18} fontSize="13" fontWeight="700" opacity="0.9">
          {title}
        </text>

        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerH}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.35"
        />

        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={pad.left + innerW}
          y2={pad.top + innerH}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.35"
        />

        {counts.map((cnt, i) => {
          const h = maxCount ? (cnt / maxCount) * innerH : 0;
          const x = pad.left + i * barW + 2;
          const y = pad.top + innerH - h;
          const w = Math.max(0, barW - 4);

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="6"
                ry="6"
                fill="#00008B"
                opacity="0.9"
              />
              <title>
                {`${edges[i].toFixed(1)}–${edges[i + 1].toFixed(1)} h: ${cnt}`}
              </title>
            </g>
          );
        })}

        {edges.length > 1 &&
          edges.slice(0, -1).map((e, i) => {
            if (i % xLabelEvery !== 0) return null;
            const x = pad.left + i * barW;
            return (
              <text
                key={i}
                x={x + 2}
                y={pad.top + innerH + 24}
                fontSize="12"
                fontWeight="600"
                opacity="0.75"
              >
                {e.toFixed(1)}
              </text>
            );
          })}

        <text x={10} y={pad.top + innerH} fontSize="12" fontWeight="600" opacity="0.75">
          0
        </text>

        <text x={10} y={pad.top + 12} fontSize="12" fontWeight="600" opacity="0.75">
          {maxCount || 0}
        </text>

        {!values.length && (
          <text x={pad.left} y={pad.top + innerH / 2} fontSize="13" opacity="0.6">
            No data for current filters
          </text>
        )}
      </svg>
    </div>
  );
}