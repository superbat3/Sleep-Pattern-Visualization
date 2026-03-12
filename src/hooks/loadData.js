import * as d3 from "d3";
import { useEffect, useMemo, useState } from "react";

const CSV_PATH = "/data/nhanes_sleep_dataset.csv";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Convert systolic/diastolic into numeric fields */
function parseBP(sys, dia) {
  const s = num(sys);
  const d = num(dia);
  return {
    bpSys: Number.isFinite(s) ? s : null,
    bpDia: Number.isFinite(d) ? d : null,
  };
}

/** Convert BMI → category */
function bmiCategory(bmi) {
  if (!Number.isFinite(bmi)) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
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

        console.log("Loaded NHANES rows:", raw.length);
        console.log("CSV keys:", Object.keys(raw[0]));

        const cleaned = raw.map((d) => {
        const sleepDuration = num(d.sleepDuration);
        const activity = num(d.activityLevel);
          const stress = num(d.stress);
          const bmi = num(d.bmi);
          const heartRate = num(d.heartRate);

          const { bpSys, bpDia } = parseBP(d.bpSys, d.bpDia);

          return {
            id: num(d.SEQN),
            occupation: d.occupation ?? "",
            sleepDuration,
            sleepQuality: null, 
            activityLevel: activity,
            stress,
            stressBucket: d.stressBucket,
            bmi,
            bmiCategory: bmiCategory(bmi),
            bpSys,
            bpDia,
            heartRate,
            disorder: d.disorder ?? "None",
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