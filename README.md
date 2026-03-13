# Sleep Patterns Visualization Dashboard

This project is a **React + Vite visualization dashboard** that explores relationships between sleep patterns, lifestyle factors, and health indicators using the **NHANES sleep dataset**.



# Authors

Alex Gao  
Ejiroghene (Ej) Uwhuba  
Tejas Khode  

Special thanks to **Professor Kwan-Liu Ma** and **Teaching Assistant Yun-Hsin Kuo** in **ECS 272: Information Visualization at the University of California, Davis** for providing instruction and feedback.

---

# Visual Tools

This dashboard uses several visualization techniques to explore relationships between sleep, lifestyle, and health.

**Sankey Diagram**  
Shows how demographic and lifestyle variables flow into sleep outcomes and health indicators.

**Scatter Plot**  
Displays relationships between sleep duration and stress levels.

**Histogram**  
Shows the distribution of sleep duration metrics within each occupation.

**Radar Chart**  
Allows users to compare sleep characteristics between user inputted data and occupational data.

---

# Running Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/superbat3/Sleep-Pattern-Visualization.git
cd Sleep-Pattern-Visualization
npm install
```

Then start the development server:

```bash
npm run dev
```

After running the command, Vite will display a local development URL similar to:

```
http://localhost:5173
```

Open this URL in your browser to view the dashboard.

Vite supports **Hot Module Reloading (HMR)**, so changes to the code will automatically update in the browser.

---

# Node Version Requirement

Vite requires **Node.js version 20.19 or newer**.

Check your Node version:

```bash
node -v
```

If needed, install a newer version using `nvm`:

```bash
nvm install 20
nvm use 20
```

---

# Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
