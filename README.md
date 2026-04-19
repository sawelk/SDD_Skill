# SDD_Skill

Spec-driven and skill-assisted development experiments.

## Library desk (frontend)

Browser-only catalog: add books, borrow, return, **edit**, and **delete** rows. Data is saved in **`localStorage`** for this origin (no server). If several tabs are open, **last write wins** when each tab saves.

```bash
cd app
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
cd app
npm run build
npm run preview
```

Repository: [github.com/sawelk/SDD_Skill](https://github.com/sawelk/SDD_Skill).
