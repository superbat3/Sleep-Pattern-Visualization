
export const slides = [
  {
    title: "Sleep Patterns Visualization",
    subtitle: "Guided story mode (mock)",
    body: (
      <>
        <p>
          Our dataset of ~400 individuals revealed clear, occupation‑driven differences in sleep,
          stress, and health. These differences form recognizable “sleep profiles” for each job type.
        </p>

        <ul>
          <li>
            <b>Healthcare workers</b> show the <b>highest variance</b> in stress and sleep duration.
          </li>
          <li>
            <b>Sales workers</b> have the <b>most uniform sleep pattern</b> with high insomnia rates.
          </li>
          <li>
            Individuals with <b>sleep apnea</b> have the <b>highest blood pressure</b>.
          </li>
          <li>
            Low‑activity occupations tend to show <b>lower sleep quality</b>.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Why Sleep Matters",
    subtitle: "Healthy sleep shapes daily functioning and long‑term health",
    body: (
      <>
        <p>
          Poor sleep is linked to high blood pressure, weight gain, reduced life satisfaction, and
          elevated stress. Many of these outcomes are not random — they emerge from differences in
          occupation, lifestyle, and daily demands.
        </p>
        <p>
          Our goal is to reveal how sleep patterns differ across occupations and what factors drive
          those differences.
        </p>
      </>
    ),
  },

  {
    title: "How to Read the Encodings",
    subtitle: "Understanding stress buckets, sleep buckets, and risk flags",
    body: (
      <>
        <p>
          The dashboard uses consistent encodings to surface patterns quickly. These encodings helped
          us uncover several non‑obvious findings:
        </p>

        <ul>
          <li>
            <b>Stress buckets</b> show that high‑stress occupations almost always shift sleep duration
            downward.
          </li>
          <li>
            <b>Sleep arcs / histograms</b> reveal bimodal patterns in healthcare roles.
          </li>
          <li>
            <b>Risk flags</b> highlight occupations with high stress + short sleep + elevated BP.
          </li>
          <li>
            <b>Linked filtering</b> shows that high stress + low activity almost always yields low sleep quality.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "Supporting View: Bar Chart",
    subtitle: "Average sleep duration by occupation",
    body: (
      <>
        <p>
          This bar chart gives a fast, high‑level ranking of occupations by average sleep duration.
          It’s the quickest way to spot which groups sleep more or less than others.
        </p>

        <ul>
          <li>
            Healthcare roles show <b>shorter average sleep</b> and the <b>highest variance</b>.
          </li>
          <li>
            Office and engineering roles cluster around <b>7–7.5 hours</b>.
          </li>
          <li>
            Sales roles show <b>moderate sleep duration</b> but high insomnia rates.
          </li>
        </ul>

        <p>This view acts as the “entry point” into the story.</p>
      </>
    ),
  },

  {
    title: "Supporting View: Scatterplot",
    subtitle: "Sleep duration vs. stress level",
    body: (
      <>
        <p>
          The scatterplot reveals the relationship between stress and sleep. It’s one of the clearest
          patterns in the dataset.
        </p>

        <ul>
          <li>
            High‑stress individuals almost always fall below <b>7 hours</b> of sleep.
          </li>
          <li>
            Low‑stress individuals show a wide spread, including the longest sleepers.
          </li>
          <li>
            Healthcare and sales occupations dominate the <b>high‑stress, low‑sleep</b> quadrant.
          </li>
        </ul>

        <p>This view helps users understand why certain occupations have worse sleep outcomes.</p>
      </>
    ),
  },
  {
    title: "Supporting View: Parallel Coordinates",
    subtitle: "How health and lifestyle factors relate to sleep quality",
    body: (
      <>
        <p>
          The parallel coordinates plot shows how multiple factors interact with sleep quality:
          heart rate, steps, blood pressure, BMI, and stress.
        </p>

        <ul>
          <li>
            Individuals with <b>high blood pressure</b> and <b>high BMI</b> tend to report <b>lower sleep quality</b>.
          </li>
          <li>
            High‑activity individuals generally show <b>better sleep quality</b>.
          </li>
          <li>
            Sleep apnea cases cluster with <b>elevated blood pressure</b> and <b>short sleep</b>.
          </li>
        </ul>

        <p>This view prepares users for the dashboard’s multi‑metric sleep profile.</p>
      </>
    ),
  },

  {
    title: "Transition to Exploration",
    subtitle: "What to look for in the dashboard",
    body: (
      <>
        <p>As you explore occupations, look for patterns that emerged in our analysis:</p>

        <ul>
          <li>
            Occupations with <b>high stress + low activity</b> tend to have the <b>lowest sleep quality</b>.
          </li>
          <li>
            Jobs with <b>irregular schedules</b> show <b>wider sleep duration distributions</b>.
          </li>
          <li>
            <b>Sleep disorders</b> cluster differently: insomnia in sales, apnea in older/high‑BMI groups.
          </li>
          <li>
            Elevated blood pressure is strongly associated with <b>short sleep + apnea</b>.
          </li>
        </ul>

        <p>
          These findings form the backbone of the narrative — and the dashboard lets users discover
          them interactively.
        </p>
      </>
    ),
  },
];