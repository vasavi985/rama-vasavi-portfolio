# Rama Vasavi - Personal Developer Portfolio

A modern, clean, and professional personal developer portfolio built from scratch with **React** and **Vite**, featuring a dark navy & charcoal theme with elegant blue/purple accents.

## 🌟 Overview & Key Sections

The portfolio strictly includes the 5 designated sections with **no footer**:
1. **Home / Hero**: Clean two-column introduction, prominent name typography, Java Full Stack & Data Science enthusiast credentials, "View Projects" and "Contact Me" buttons, social links, and an avatar placeholder with an "Open to Opportunities" status badge.
2. **Internships**: Clean 3-tab interface featuring:
   - APSSDC Intern
   - Infosys Springboard Intern
   - Pragathi Path to Future Intern
3. **About Me**: Two-column layout showcasing professional summary, categorized technical skills (Languages, Frontend, Backend, Database, Data/Analytics, Cloud, Tools), and an education timeline (GIET, G.B.R. Junior College, Z.P.P. High School).
4. **Featured Projects**: Responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile) featuring all 6 projects:
   - LandLens – Real Estate Property Advisor & Document Evaluator
   - PriceWise AI – AI-Powered Price Comparison Platform
   - HerCycle – Menstrual Tracking & Women's Health Application
   - My Period Tracker – Full Stack Web Application
   - Rudra Online Store – E-commerce / General Store Application
   - StreamScope – Netflix Content Strategy Analyzer
5. **Project Details Modal & Video Support**: Interactive modal showing project description, key features, technology stack, role & contribution, live & GitHub links, and a dedicated **PROJECT DEMO** video player (with a professional "Project Demo Video Coming Soon" placeholder).
6. **Contact ("Let's Connect")**: The final section featuring direct contact cards (Email, LinkedIn, GitHub) and a structured message form.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ How to Customize Your Information

All your portfolio data is centralized in dedicated files inside `src/data/` for easy editing:

- **Personal Profile & Socials**: [src/data/profile.js](file:///d:/vasu/my-portfolio/src/data/profile.js)
  - Update your bio, email, GitHub URL, and LinkedIn URL.
- **Internships**: [src/data/internships.js](file:///d:/vasu/my-portfolio/src/data/internships.js)
  - Fill in dates, role details, responsibilities, and outcomes.
- **Skills & Education**: [src/data/skills.js](file:///d:/vasu/my-portfolio/src/data/skills.js)
  - Update CGPA, dates, or add technical skills.
- **Projects & Demo Videos**: [src/data/projects.js](file:///d:/vasu/my-portfolio/src/data/projects.js)
  - Add your YouTube video links, local mp4 paths, live website URLs, or GitHub repo links.
