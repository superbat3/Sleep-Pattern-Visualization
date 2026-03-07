import { useEffect, useMemo, useRef, useState } from "react";

const STRESS_ORDER = ["Low", "Medium", "High"];
const SLEEP_ORDER = ["Short", "Normal", "Long"];

const STRESS_COLORS = {
  Low: "#4C9A6A",
  Medium: "#CF933D",
  High: "#C65B5B",
};

const SLEEP_COLORS = {
  Short: "#E7D4DA",
  Normal: "#D9E3F4",
  Long: "#D7EBDD",
};

function stressBucket(level) {
  if (!Number.isFinite(level)) return null;
  if (level <= 4) return "Low";
  if (level <= 6) return "Medium";
  return "High";
}

function sleepBucket(hours) {
  if (!Number.isFinite(hours)) return null;
  if (hours < 6.5) return "Short";
  if (hours <= 8) return "Normal";
  return "Long";
}

function useResizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries?.[0]?.contentRect;
      if (!rect) return;
      setSize({ width: rect.width, height: rect.height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function curvePath(x0, y0, x1, y1) {
  const dx = x1 - x0;
  const c = dx * 0.4;
  return `M ${x0} ${y0} C ${x0 + c} ${y0}, ${x1 - c} ${y1}, ${x1} ${y1}`;
}

function buildNodeLayout(keys, totals, yTop, gap, scale) {
  const nodes = {};
  let y = yTop;

  for (const key of keys) {
    const value = totals[key] ?? 0;
    const height = value * scale;
    nodes[key] = { value, y0: y, y1: y + height, h: height };
    y += height + gap;
  }

  return nodes;
}

function assignCenters({ keys, triplets, keyForTriplet, sortFn, nodes, scale }) {
  const centers = {};
  const grouped = new Map(keys.map((key) => [key, []]));

  for (const triplet of triplets) {
    const key = keyForTriplet(triplet);
    grouped.get(key)?.push(triplet);
  }

  for (const key of keys) {
    const list = (grouped.get(key) ?? []).sort(sortFn);
    let offset = 0;

    for (const item of list) {
      const dy = item.value * scale;
      centers[item.id] = (nodes[key]?.y0 ?? 0) + offset + dy / 2;
      offset += dy;
    }
  }

  return centers;
}

export default function SankeyFlow({
  data,
  selectedOccupation,
  onSelectOccupation,
  height = 260,
}) {
  const wrapRef = useRef(null);
  const { width } = useResizeObserver(wrapRef);

  const [hoveredFlowId, setHoveredFlowId] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const model = useMemo(() => {
    if (!Array.isArray(data) || !data.length) {
      return null;
    }

    const occupationTotals = {};
    const stressTotals = Object.fromEntries(STRESS_ORDER.map((key) => [key, 0]));
    const sleepTotals = Object.fromEntries(SLEEP_ORDER.map((key) => [key, 0]));
    const tripletCounts = new Map();

    for (const row of data) {
      const occupation = (row?.occupation ?? "").trim();
      const stress = stressBucket(Number(row?.stress));
      const sleep = sleepBucket(Number(row?.sleepDuration));

      if (!occupation || !stress || !sleep) continue;

      occupationTotals[occupation] = (occupationTotals[occupation] ?? 0) + 1;
      stressTotals[stress] += 1;
      sleepTotals[sleep] += 1;

      const id = `${occupation}|${stress}|${sleep}`;
      const prev = tripletCounts.get(id);
      if (prev) {
        prev.value += 1;
      } else {
        tripletCounts.set(id, { id, occupation, stress, sleep, value: 1 });
      }
    }

    const totalCount = Object.values(occupationTotals).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (!totalCount) return null;

    const baseOccupations = Object.keys(occupationTotals).sort((a, b) => {
      const diff = (occupationTotals[b] ?? 0) - (occupationTotals[a] ?? 0);
      return diff || a.localeCompare(b);
    });

    const occupations =
      selectedOccupation && baseOccupations.includes(selectedOccupation)
        ? [
            selectedOccupation,
            ...baseOccupations.filter((name) => name !== selectedOccupation),
          ]
        : baseOccupations;

    const occupationIndex = Object.fromEntries(
      occupations.map((name, idx) => [name, idx]),
    );
    const stressIndex = Object.fromEntries(STRESS_ORDER.map((name, idx) => [name, idx]));
    const sleepIndex = Object.fromEntries(SLEEP_ORDER.map((name, idx) => [name, idx]));

    const triplets = [...tripletCounts.values()].sort((a, b) => {
      const occDiff = occupationIndex[a.occupation] - occupationIndex[b.occupation];
      if (occDiff !== 0) return occDiff;

      const stressDiff = stressIndex[a.stress] - stressIndex[b.stress];
      if (stressDiff !== 0) return stressDiff;

      return sleepIndex[a.sleep] - sleepIndex[b.sleep];
    });

    return {
      totalCount,
      occupations,
      occupationTotals,
      stressTotals,
      sleepTotals,
      stressIndex,
      sleepIndex,
      occupationIndex,
      triplets,
    };
  }, [data, selectedOccupation]);

  const layout = useMemo(() => {
    if (!model) return null;

    const svgWidth = Math.max(640, width || 0);
    const nodeWidth = 16;
    const pad = { top: 8, right: 14, bottom: 20, left: 14 };

    const x = {
      occupation: pad.left + 4,
      stress: Math.round((svgWidth - nodeWidth) / 2),
      sleep: svgWidth - pad.right - nodeWidth - 4,
    };

    const flowTop = pad.top + 22;
    const flowBottom = height - pad.bottom;
    const availableHeight = Math.max(40, flowBottom - flowTop);
    const gap = 8;

    const largestNodeCount = Math.max(
      model.occupations.length,
      STRESS_ORDER.length,
      SLEEP_ORDER.length,
    );

    const maxGapBudget = gap * Math.max(0, largestNodeCount - 1);
    const scale = Math.max(
      0.12,
      (availableHeight - maxGapBudget) / Math.max(1, model.totalCount),
    );

    const occupationNodes = buildNodeLayout(
      model.occupations,
      model.occupationTotals,
      flowTop,
      gap,
      scale,
    );
    const stressNodes = buildNodeLayout(
      STRESS_ORDER,
      model.stressTotals,
      flowTop,
      gap,
      scale,
    );
    const sleepNodes = buildNodeLayout(
      SLEEP_ORDER,
      model.sleepTotals,
      flowTop,
      gap,
      scale,
    );

    const occupationCenters = assignCenters({
      keys: model.occupations,
      triplets: model.triplets,
      keyForTriplet: (item) => item.occupation,
      sortFn: (a, b) => {
        const stressDiff = model.stressIndex[a.stress] - model.stressIndex[b.stress];
        if (stressDiff !== 0) return stressDiff;
        return model.sleepIndex[a.sleep] - model.sleepIndex[b.sleep];
      },
      nodes: occupationNodes,
      scale,
    });

    const stressCenters = assignCenters({
      keys: STRESS_ORDER,
      triplets: model.triplets,
      keyForTriplet: (item) => item.stress,
      sortFn: (a, b) => {
        const occDiff =
          model.occupationIndex[a.occupation] - model.occupationIndex[b.occupation];
        if (occDiff !== 0) return occDiff;
        return model.sleepIndex[a.sleep] - model.sleepIndex[b.sleep];
      },
      nodes: stressNodes,
      scale,
    });

    const sleepCenters = assignCenters({
      keys: SLEEP_ORDER,
      triplets: model.triplets,
      keyForTriplet: (item) => item.sleep,
      sortFn: (a, b) => {
        const stressDiff = model.stressIndex[a.stress] - model.stressIndex[b.stress];
        if (stressDiff !== 0) return stressDiff;
        return model.occupationIndex[a.occupation] - model.occupationIndex[b.occupation];
      },
      nodes: sleepNodes,
      scale,
    });

    const flows = model.triplets.map((item) => ({
      ...item,
      dy: item.value * scale,
      occupationY: occupationCenters[item.id],
      stressY: stressCenters[item.id],
      sleepY: sleepCenters[item.id],
      color: STRESS_COLORS[item.stress],
    }));

    return {
      svgWidth,
      nodeWidth,
      pad,
      x,
      occupationNodes,
      stressNodes,
      sleepNodes,
      flows,
    };
  }, [height, model, width]);

  const handleFlowMove = (event, flow) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setHoveredFlowId(flow.id);
    setTooltip({
      x: event.clientX - rect.left + 10,
      y: event.clientY - rect.top + 10,
      flow,
    });
  };

  const handleClearHover = () => {
    setHoveredFlowId(null);
    setTooltip(null);
  };

  if (!model || !layout) {
    return (
      <BoxFallback label="No data available for current filters. Adjust gender or age filters." />
    );
  }

  const activeHoverId = layout.flows.some((flow) => flow.id === hoveredFlowId)
    ? hoveredFlowId
    : null;
  const hasHover = activeHoverId !== null;
  const totalCount = model.totalCount;

  return (
    <div ref={wrapRef} className="sp-sankey-wrap">
      <svg
        className="sp-sankey-svg"
        width="100%"
        height={height}
        viewBox={`0 0 ${layout.svgWidth} ${height}`}
      >
        <text
          x={layout.x.occupation + layout.nodeWidth + 6}
          y={16}
          className="sp-sankey-col-label"
          textAnchor="start"
        >
          Occupation
        </text>
        <text
          x={layout.x.stress + layout.nodeWidth / 2}
          y={16}
          className="sp-sankey-col-label"
          textAnchor="middle"
        >
          Stress Bucket
        </text>
        <text
          x={layout.x.sleep - 6}
          y={16}
          className="sp-sankey-col-label"
          textAnchor="end"
        >
          Sleep Outcome
        </text>

        {layout.flows.map((flow) => {
          const selectedMatch =
            !selectedOccupation || flow.occupation === selectedOccupation;
          const isActive = activeHoverId === flow.id;
          const opacity = hasHover
            ? isActive
              ? 0.9
              : 0.06
            : selectedMatch
              ? 0.52
              : 0.14;

          const occPath = curvePath(
            layout.x.occupation + layout.nodeWidth,
            flow.occupationY,
            layout.x.stress,
            flow.stressY,
          );

          const sleepPath = curvePath(
            layout.x.stress + layout.nodeWidth,
            flow.stressY,
            layout.x.sleep,
            flow.sleepY,
          );

          const hitWidth = Math.max(8, flow.dy + 3);

          return (
            <g key={flow.id}>
              <path
                d={occPath}
                fill="none"
                stroke={flow.color}
                strokeWidth={flow.dy}
                strokeOpacity={opacity}
              />
              <path
                d={sleepPath}
                fill="none"
                stroke={flow.color}
                strokeWidth={flow.dy}
                strokeOpacity={opacity}
              />

              <path
                d={occPath}
                fill="none"
                stroke="transparent"
                strokeWidth={hitWidth}
                onMouseMove={(event) => handleFlowMove(event, flow)}
                onMouseLeave={handleClearHover}
                onClick={() => onSelectOccupation?.(flow.occupation)}
                style={{ cursor: "pointer" }}
              />
              <path
                d={sleepPath}
                fill="none"
                stroke="transparent"
                strokeWidth={hitWidth}
                onMouseMove={(event) => handleFlowMove(event, flow)}
                onMouseLeave={handleClearHover}
                onClick={() => onSelectOccupation?.(flow.occupation)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}

        {model.occupations.map((name) => {
          const node = layout.occupationNodes[name];
          const isSelected = name === selectedOccupation;

          return (
            <g key={name}>
              <rect
                x={layout.x.occupation}
                y={node.y0}
                width={layout.nodeWidth}
                height={Math.max(1, node.h)}
                rx="4"
                fill={isSelected ? "#2F4F88" : "#C7D8F2"}
                stroke={isSelected ? "#20355D" : "#AFC6E7"}
                strokeWidth={isSelected ? 1.6 : 1}
                onClick={() => onSelectOccupation?.(name)}
                style={{ cursor: "pointer" }}
              />
              <text
                x={layout.x.occupation + layout.nodeWidth + 6}
                y={node.y0 + node.h / 2 + 4}
                className="sp-sankey-row-label"
                textAnchor="start"
              >
                {name} ({node.value})
              </text>
            </g>
          );
        })}

        {STRESS_ORDER.map((name) => {
          const node = layout.stressNodes[name];
          return (
            <g key={name}>
              <rect
                x={layout.x.stress}
                y={node.y0}
                width={layout.nodeWidth}
                height={Math.max(1, node.h)}
                rx="4"
                fill={STRESS_COLORS[name]}
                fillOpacity="0.82"
                stroke={STRESS_COLORS[name]}
                strokeWidth="1"
              />
              <text
                x={layout.x.stress + layout.nodeWidth / 2}
                y={node.y0 + node.h / 2 + 4}
                className="sp-sankey-row-label"
                textAnchor="middle"
              >
                {name} ({node.value})
              </text>
            </g>
          );
        })}

        {SLEEP_ORDER.map((name) => {
          const node = layout.sleepNodes[name];
          return (
            <g key={name}>
              <rect
                x={layout.x.sleep}
                y={node.y0}
                width={layout.nodeWidth}
                height={Math.max(1, node.h)}
                rx="4"
                fill={SLEEP_COLORS[name]}
                stroke="#A6B4CA"
                strokeWidth="1"
              />
              <text
                x={layout.x.sleep - 6}
                y={node.y0 + node.h / 2 + 4}
                className="sp-sankey-row-label"
                textAnchor="end"
              >
                {name} ({node.value})
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip?.flow && activeHoverId === tooltip.flow.id ? (
        <div
          className="sp-sankey-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className="sp-sankey-tooltip-line">
            {tooltip.flow.occupation} -&gt; {tooltip.flow.stress} -&gt; {tooltip.flow.sleep}
          </div>
          <div className="sp-sankey-tooltip-line">
            {tooltip.flow.value} people ({((tooltip.flow.value / totalCount) * 100).toFixed(1)}
            %)
          </div>
          <div className="sp-sankey-tooltip-line">Click path to select occupation</div>
        </div>
      ) : null}
    </div>
  );
}

function BoxFallback({ label }) {
  return <div className="sp-sankey-empty">{label}</div>;
}
