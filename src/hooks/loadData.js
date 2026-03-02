import { useEffect, useState } from "react";
import * as d3 from "d3";

export function useDataset() {
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.csv("/data/Sleep_health_and_lifestyle_dataset.csv").then(raw => {
        console.log("CSV keys:", Object.keys(raw[0]));
        const cleaned = raw.map(d => {
        const bp = d["Blood Pressure"] || "0/0";
        const [sys, dia] = bp.split("/").map(Number);

        return {
          id: +d["Person ID"],
          gender: d.Gender,
          age: +d.Age,
          occupation: d.Occupation,
          sleepDuration: +d["Sleep Duration"],
          sleepQuality: +d["Quality of Sleep"],
          activity: +d["Physical Activity Level"],
          stress: +d["Stress Level"],
          bmiCategory: d["BMI Category"],
          bpSys: sys,
          bpDia: dia,
          heartRate: +d["Heart Rate"],
          steps: +d["Daily Steps"],
          disorder: d["Sleep Disorder"],
        };
      });

      setData(cleaned);
    });
  }, []);

  return data;
}