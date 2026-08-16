# ShopEase Nepal — Ecommerce & Collage Platform

A production-grade full-stack ecommerce and artisan collage platform built for Nepal, featuring Nepali traditional attire, artisan goods, local delivery coverage, and a serverless Express 5 + Firebase backend.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend Cloud Functions
cd functions
npm install
cd ..
```

### 2. Run Development Server
```bash
npm run dev     # Starts Vite dev server at http://localhost:5173
```

### 3. Run Production Build
```bash
npm run build   # Builds client to dist/
```

### 4. Run Backend Tests
```bash
cd functions
npm run test    # Runs Vitest suite (14/14 tests)
```

---

## 📂 Repository Structure

```
React-Collage-B/
├── .github/                 # GitHub Actions CI/CD workflows
├── docs/                    # Organized documentation
│   ├── architecture/        # Frontend & routing SOPs
│   ├── backend/             # Backend architecture & REST API documentation
│   ├── development/         # Developer notes & credentials guide
│   ├── reports/             # Internship reports & weekly progress logs
│   └── ui-ux/               # UI/UX audit & redesign logs
├── functions/               # Firebase Cloud Functions (Express 5 + TypeScript + Admin SDK)
├── public/                  # Static assets & cultural photography
├── QA/                      # Playwright test specs & execution reports
├── src/                     # React 19 + Tailwind CSS 4 frontend application
├── tools/                   # Maintenance scripts & archived utilities
├── firebase.json            # Firebase emulators & hosting config
├── firestore.rules          # Production security rules
├── firestore.indexes.json   # Composite query indexes
├── storage.rules            # Firebase Cloud Storage security rules
└── package.json             # Root dependencies & scripts
```

---

## 📚 Documentation Index

* 📖 **Backend Guide**: [docs/backend/BACKEND.md](docs/backend/BACKEND.md)
* 📡 **REST API Reference**: [docs/backend/API.md](docs/backend/API.md)
* 🔐 **Login & Test Credentials**: [docs/development/CREDENTIALS.md](docs/development/CREDENTIALS.md)
* 🎨 **UI/UX Audit & Design**: [docs/ui-ux/ui-ux-audit.md](docs/ui-ux/ui-ux-audit.md)
* 📝 **Internship Reports**: [docs/reports/internship/](docs/reports/internship/)
* 🧹 **Repository Cleanup Log**: [docs/development/REPOSITORY_CLEANUP.md](docs/development/REPOSITORY_CLEANUP.md)

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS 4, React Router 7, Leaflet
* **Backend**: Node 22, Express 5, TypeScript 5.4, Firebase Functions v2
* **Database & Auth**: Firebase Authentication, Cloud Firestore, Cloud Storage
* **Testing**: Vitest, Supertest, Playwright

---

## 👥 Development Team

| Team Member | Role | Responsibility |
|---|---|---|
| **Anmol Chhetri** | Project Lead | Project Architecture & Coordination |
| **Sahil Tuladhar** | Backend Developer | Express API & Firebase Functions |
| **Sarang Limbu** | Frontend Developer | Page Layouts & Feature Logic |
| **Sanskriti Maharjan & Smriti Tamang** | UI/UX Developers | Design System & Component Library |
| **QA Team** | Quality Assurance | End-to-End & Integration Testing |
