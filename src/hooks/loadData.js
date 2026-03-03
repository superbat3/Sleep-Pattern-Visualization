import * as d3 from "d3";
import { useEffect, useMemo, useState } from "react";

const CSV_PATH = "/data/Sleep_health_and_lifestyle_dataset.csv";

function parseBloodPressure(bp) {
  const raw = (bp ?? "").toString().trim();
  if (!raw) return { bpSys: null, bpDia: null };

  const parts = raw.split("/").map((s) => Number(s.trim()));
  const sys = Number.isFinite(parts[0]) ? parts[0] : null;
  const dia = Number.isFinite(parts[1]) ? parts[1] : null;

  return { bpSys: sys, bpDia: dia };
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function useDataset() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const raw = await d3.csv(CSV_PATH);

        if (cancelled) return;

        if (!raw?.length) {
          setData([]);
          setLoading(false);
          return;
        }

        console.log("loaded rows:", raw.length);
        console.log("CSV keys:", Object.keys(raw[0]));

        const cleaned = raw.map((d) => {
          const { bpSys, bpDia } = parseBloodPressure(d["Blood Pressure"]);

          return {
            id: num(d["Person ID"]),
            gender: d["Gender"] ?? "",
            age: num(d["Age"]),
            occupation: d["Occupation"] ?? "",
            sleepDuration: num(d["Sleep Duration"]),
            sleepQuality: num(d["Quality of Sleep"]),
            activity: num(d["Physical Activity Level"]),
            stress: num(d["Stress Level"]),
            bmiCategory: d["BMI Category"] ?? "",
            bpSys,
            bpDia,
            heartRate: num(d["Heart Rate"]),
            steps: num(d["Daily Steps"]),
            disorder: d["Sleep Disorder"] ?? "",
          };
        });

        setData(cleaned);
      } catch (e) {
        if (!cancelled) {
          console.error("CSV load failed:", e);
          setError(e);
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}