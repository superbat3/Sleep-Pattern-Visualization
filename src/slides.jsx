import BarChart from "./BarChart.jsx";

export const slides = (data) => [
  {
    title: "Why Sleep Matters",
    subtitle: "An overlooked part of everyday health",
    body: (
      <>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <img
            src="/sleep_intro.png"
            alt="Person sleeping"
            style={{
              width: 240,
              borderRadius: 8,
            }}
          />
        </div>

        <p>
          Sleep is one of the most important parts of overall health, yet it is often ignored in
          everyday life. Many people focus on work, productivity, school, and activity while
          treating sleep as something flexible that can always be sacrificed later.
        </p>

        <p>
          Even though sleep is so central, many people rarely stop to think about how lifestyle,
          work demands, and occupation shape the quality and consistency of their sleep. This
          visualization explores those patterns through a dataset of sleep, stress, and health
          indicators across different professions.
        </p>
      </>
    ),
  },

  {
    title: "Average Sleep by Occupation",
    subtitle: "A quick overview of how sleep duration differs across jobs",
    body: (
      <>
        <p>
          This chart compares the <b>average sleep duration</b> for selected occupations in the
          dataset. It gives a simple overview of which professions tend to sleep more and which
          tend to sleep less.
        </p>

        <div style={{ width: "100%", minHeight: 320 }}>
          <BarChart data={data} />
        </div>

        <p>
          At a high level, some patterns appear surprising. For example, one might expect lawyers
          or doctors to consistently get less sleep because of demanding schedules. Yet the data
          suggests that sleep patterns are more nuanced, and that sleep quality, stress, and other
          health indicators help explain the fuller story.
        </p>
      </>
    ),
  },

  {
    title: "Sleep Patterns Visualization",
    subtitle: "What we discovered in the data",
    body: (
      <>
        <p>
          Our dataset of about 400 individuals revealed clear, occupation-driven differences in
          sleep, stress, and health. These differences are not random — they form recognizable
          sleep profiles for different job types.
        </p>

        <ul>
          <li>
            <b>Healthcare workers</b> such as nurses and doctors show the <b>highest variance</b> in
            stress and sleep duration. Some sleep very little, others sleep normally, but stress is
            consistently high.
          </li>

          <li>
            <b>Sales workers</b> have one of the <b>most uniform sleep patterns</b>, with
            <b> insomnia</b> appearing especially often in the dataset.
          </li>

          <li>
            Individuals with <b>sleep apnea</b> show the <b>highest blood pressure</b> of any group,
            creating a strong health-risk signal.
          </li>

          <li>
            Occupations with <b>low physical activity</b> tend to show <b>lower sleep quality</b>
            even when sleep duration appears relatively normal.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "How to Read the Dashboard",
    subtitle: "Encodings and what they reveal in our dataset",
    body: (
      <>
        <p>
          The dashboard uses consistent encodings to surface patterns quickly. These encodings help
          expose several non-obvious findings in the data:
        </p>

        <ul>
          <li>
            <b>Stress buckets</b> show that high-stress occupations often shift sleep duration
            downward, especially in healthcare and sales roles.
          </li>

          <li>
            <b>Sleep arcs and histograms</b> reveal whether an occupation has a tight sleep cluster
            or a wider, more uneven distribution.
          </li>

          <li>
            <b>Risk flags</b> such as short sleep percentage, high stress percentage, and elevated
            blood pressure percentage highlight occupations with stronger health-risk combinations.
          </li>

          <li>
            <b>Linked filtering</b> makes it easier to compare occupations, genders, and age groups
            and see how those differences affect both sleep and health indicators.
          </li>
        </ul>

        <p>
          These encodings are not just decorative — they are designed to reveal relationships
          between occupation, lifestyle, sleep outcomes, and health risks.
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
          As you begin exploring the dashboard, look for the patterns that emerged most clearly in
          our analysis:
        </p>

        <ul>
          <li>
            Occupations with <b>high stress and low activity</b> often tend to have the
            <b> lowest sleep quality</b>.
          </li>

          <li>
            Jobs with <b>irregular or demanding schedules</b> often show
            <b> wider sleep duration distributions</b>.
          </li>

          <li>
            <b>Sleep disorders</b> do not appear evenly across occupations. Some cluster more around
            insomnia, while others show stronger signs of apnea-related risk.
          </li>

          <li>
            Elevated blood pressure appears strongly associated with combinations of
            <b> short sleep</b> and <b>sleep disorder risk</b>.
          </li>
        </ul>

        <p>
          These findings form the backbone of the narrative, and the dashboard allows users to move
          from guided explanation into open-ended exploration.
        </p>
      </>
    ),
  },
];