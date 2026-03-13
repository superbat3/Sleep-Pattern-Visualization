import BarChart from "./BarChart.jsx";

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const slideThemes = {
  intro: {
    canvasBackground:
      `linear-gradient(135deg, rgba(13, 26, 45, 0.84), rgba(38, 68, 110, 0.78)), url('${asset("slide-bg/intro-night.svg")}')`,
    frameBackground: "linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%)",
    frameBorder: "1px solid rgba(60, 85, 130, 0.18)",
    accent: "#2E5AA7",
    accentSoft: "rgba(46, 90, 167, 0.14)",
    titleColor: "#142B4F",
    subtitleColor: "#334D73",
    navBackground: "linear-gradient(180deg, #f2f6ff 0%, #edf3ff 100%)",
  },
  averageSleep: {
    canvasBackground:
      `linear-gradient(140deg, rgba(15, 37, 58, 0.8), rgba(35, 87, 98, 0.75)), url('${asset("slide-bg/occupation-bars.svg")}')`,
    frameBackground: "linear-gradient(180deg, #ffffff 0%, #f5fdfd 100%)",
    frameBorder: "1px solid rgba(33, 99, 107, 0.2)",
    accent: "#1E6C75",
    accentSoft: "rgba(30, 108, 117, 0.14)",
    titleColor: "#134851",
    subtitleColor: "#2B5E67",
    navBackground: "linear-gradient(180deg, #eefaf9 0%, #e5f4f2 100%)",
  },
  patterns: {
    canvasBackground:
      `linear-gradient(135deg, rgba(20, 34, 64, 0.84), rgba(39, 57, 102, 0.78)), url('${asset("slide-bg/pattern-waves.svg")}')`,
    frameBackground: "linear-gradient(180deg, #ffffff 0%, #f7f8ff 100%)",
    frameBorder: "1px solid rgba(56, 72, 145, 0.2)",
    accent: "#4458B0",
    accentSoft: "rgba(68, 88, 176, 0.14)",
    titleColor: "#1D2E72",
    subtitleColor: "#3D4E86",
    navBackground: "linear-gradient(180deg, #f1f3ff 0%, #e8ecff 100%)",
  },
  readGuide: {
    canvasBackground:
      `linear-gradient(135deg, rgba(22, 32, 48, 0.8), rgba(56, 72, 95, 0.72)), url('${asset("slide-bg/dashboard-guide.svg")}')`,
    frameBackground: "linear-gradient(180deg, #ffffff 0%, #fbfcff 100%)",
    frameBorder: "1px solid rgba(89, 102, 124, 0.2)",
    accent: "#5C6477",
    accentSoft: "rgba(92, 100, 119, 0.14)",
    titleColor: "#2A3345",
    subtitleColor: "#4D5768",
    navBackground: "linear-gradient(180deg, #f6f7fa 0%, #eef1f6 100%)",
  },
  transition: {
    canvasBackground:
      `linear-gradient(135deg, rgba(22, 31, 56, 0.82), rgba(59, 79, 123, 0.8)), url('${asset("slide-bg/explore-transition.svg")}')`,
    frameBackground: "linear-gradient(180deg, #ffffff 0%, #f6f8ff 100%)",
    frameBorder: "1px solid rgba(70, 87, 138, 0.22)",
    accent: "#3E5FAB",
    accentSoft: "rgba(62, 95, 171, 0.14)",
    titleColor: "#1D326A",
    subtitleColor: "#42588C",
    navBackground: "linear-gradient(180deg, #f2f5ff 0%, #e8edff 100%)",
  },
};

export const slides = (data) => [
  {
    title: "Why Sleep Matters",
    subtitle: "An overlooked part of everyday health",
    theme: slideThemes.intro,
    backgroundImage: asset("slide-bg/custom/slide-1.jpg"),
    body: (
      <>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <img
            src={asset("sleep_intro.png")}
            alt="Person sleeping"
            style={{
              width: 180,
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
    theme: slideThemes.averageSleep,
    backgroundImage: asset("slide-bg/custom/slide-2.jpg"),
    highlights: [
      "Start with the highest and lowest bars",
      "Use this as the ranking baseline",
      "Duration alone does not explain risk",
    ],
    body: (
      <>
        <p>
          This chart compares the <b>average sleep duration</b> for selected occupations in the
          dataset. It gives a simple overview of which professions tend to sleep more and which
          tend to sleep less.
        </p>

        <div style={{ width: "100%", height:"auto"}}>
          <BarChart data={data} />
        </div>

        <p>
         While most groups average around six to seven hours of sleep, small differences appear across job types. 
         Physically demanding roles, customer-facing jobs, and managerial work all show slightly different sleep patterns, 
         suggesting that work schedules and job demands may influence sleep behavior.
        </p>
      </>
    ),
  },

  {
    title: "Sleep Patterns Visualization",
    subtitle: "What we discovered in the data",
    theme: slideThemes.patterns,
    backgroundImage: asset("slide-bg/custom/slide-3.jpg"),
    highlights: [
      "434 individuals in this dataset",
      "Healthcare has the highest short sleep share",
      "Transportation leads disorder prevalence",
      "Management tops elevated BP rate",
    ],
    body: (
      <>
        <p>
          The dataset contains <b>434 individuals</b> (with <b>326</b> records in the dashboard's
          eight focus occupations). The results show clear, occupation linked sleep and health
          profiles.
        </p>

        <ul>
          <li>
            <b>Healthcare</b> now has the strongest short sleep signal: <b>66.7% sleep under 7
            hours</b>, and it also has the <b>highest average stress</b> among dashboard
            occupations.
          </li>

          <li>
            <b>Production roles</b> show the widest sleep spread (<b>1.65h standard deviation</b>),
            while <b>Management</b> is the tightest cluster (1.14h), showing different sleep
            consistency profiles by occupation.
          </li>

          <li>
            <b>Transportation / Material Moving</b> shows the highest sleep-disorder prevalence
            (<b>23.1%</b>), followed by <b>Sales</b> (<b>19.1%</b>).
          </li>

          <li>
            <b>Elevated blood pressure</b> is highest in <b>Management (47.6%)</b> and
            <b> Transportation / Material Moving (44.2%)</b>, reinforcing that BP risk clusters by
            occupation.
          </li>
        </ul>
      </>
    ),
  },

  {
    title: "How to Read the Dashboard",
    subtitle: "Encodings and what they reveal in our dataset",
    theme: slideThemes.readGuide,
    backgroundImage: asset("slide-bg/custom/slide-4.jpg"),
    highlights: [
      "Follow Occupation -> Stress -> Sleep",
      "Read distributions before averages",
      "Treat risk flags as warning markers",
    ],
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
    theme: slideThemes.transition,
    backgroundImage: asset("slide-bg/custom/slide-5.jpg"),
    highlights: [
      "Pick one occupation and scan all tiles",
      "Use Sankey to trace likely pathways",
      "Compare two occupations before filtering",
    ],
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
