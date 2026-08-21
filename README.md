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
npm run test    # Runs Vitest suite (52/52 tests passing)
```

---

## 🌐 Live Production Deployment

* **Firebase Hosting**: [https://shopease-nepal-anmol-196e7.web.app](https://shopease-nepal-anmol-196e7.web.app)
* **Firestore Security Rules**: Deployed & active on `shopease-nepal-anmol-196e7`
* **Test Accounts**: Refer to [docs/development/CREDENTIALS.md](docs/development/CREDENTIALS.md) for demo admin & user accounts.

---

## 📚 Documentation Index

* 🏛️ **System Architecture**: [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)
* 🛡️ **Phase 6 Data Truth & Migration Audit**: [docs/audits/MIGRATION_AUDIT_PHASE6.md](docs/audits/MIGRATION_AUDIT_PHASE6.md)
* 🗺️ **Data Provenance Architecture**: [docs/audits/DATA_PROVENANCE_REPORT.md](docs/audits/DATA_PROVENANCE_REPORT.md)
* 📖 **Backend Operations Guide**: [docs/backend/BACKEND.md](docs/backend/BACKEND.md)
* 📡 **REST API Reference**: [docs/backend/API.md](docs/backend/API.md)
* 🚀 **Production Deployment Runbook**: [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md)
* ✅ **Production Readiness Checklist**: [docs/deployment/PRODUCTION_CHECKLIST.md](docs/deployment/PRODUCTION_CHECKLIST.md)
* 🛡️ **Backup & Disaster Recovery**: [docs/deployment/BACKUP_AND_RECOVERY.md](docs/deployment/BACKUP_AND_RECOVERY.md)
* 🔒 **Final Security & Compliance Audit**: [docs/audits/FINAL_SECURITY_AUDIT.md](docs/audits/FINAL_SECURITY_AUDIT.md)
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
