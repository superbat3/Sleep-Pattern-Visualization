export const slides = [
  {
    title: "Sleep Patterns Visualization",
    subtitle: "What we discovered in the data",
    body: (
      <>
        <p>
          Our dataset of ~400 individuals revealed clear, occupation‑driven differences in sleep,
          stress, and health. These differences are not random — they form recognizable “sleep
          profiles” for each job type.
        </p>

        <ul>
          <li>
            <b>Healthcare workers</b> (nurses, doctors) show the <b>highest variance</b> in stress and sleep duration —
            some sleep extremely little, others sleep normally, but stress is consistently high.
          </li>

          <li>
            <b>Sales workers</b> have the <b>most uniform sleep pattern</b>, with <b>insomnia</b> being the most common
            disorder in the entire dataset.
          </li>

          <li>
            Individuals with <b>sleep apnea</b> have the <b>highest blood pressure</b> of any group — a strong
            health‑risk signal.
          </li>

          <li>
            Occupations with <b>low physical activity</b> tend to show <b>lower sleep quality</b> even when sleep
            duration is normal.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "How to Read the Dashboard",
    subtitle: "Encodings + what they reveal in our dataset",
    body: (
      <>
        <p>
          The dashboard uses consistent encodings to surface patterns quickly. These encodings
          helped us uncover several non‑obvious findings:
        </p>

        <ul>
          <li>
            <b>Stress buckets</b> (low/medium/high) show that high‑stress occupations almost always shift
            sleep duration downward — especially in healthcare and sales.
          </li>

          <li>
            <b>Sleep arcs / histograms</b> reveal that some occupations have <b>bimodal</b> sleep patterns
            (e.g., nurses split between 4–5h and 7–8h), while others cluster tightly.
          </li>

          <li>
            <b>Risk flags</b> (short sleep %, high stress %, elevated BP %) highlight which occupations
            have the strongest health‑risk combinations.
          </li>

          <li>
            <b>Linked filtering</b> shows that individuals with both high stress and low activity almost
            always report <b>sleep quality below 6/10</b>.
          </li>
        </ul>

        <p>
          These encodings aren’t just visual — they directly expose the relationships we want users
          to understand.
        </p>
      </>
    ),
  },

  {
    title: "Transition to Exploration",
    subtitle: "What to look for when you enter the dashboard",
    body: (
      <>
        <p>
          As you explore occupations, look for patterns that emerged in our analysis:
        </p>

        <ul>
          <li>
            Occupations with <b>high stress + low activity</b> tend to have the <b>lowest sleep quality</b>.
          </li>

          <li>
            Jobs with <b>irregular schedules</b> (healthcare, service roles) show <b>wider sleep duration
            distributions</b>.
          </li>

          <li>
            <b>Sleep disorders</b> cluster differently: insomnia in sales, apnea in older/high‑BMI groups.
          </li>

          <li>
            Elevated blood pressure is strongly associated with <b>short sleep + apnea</b>.
          </li>
        </ul>

        <p>
          These findings form the backbone of the narrative — and the dashboard lets users
          discover them interactively.
        </p>
      </>
    ),
  },
];
