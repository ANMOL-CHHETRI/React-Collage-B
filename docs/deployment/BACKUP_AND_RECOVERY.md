# Backup & Disaster Recovery Runbook

**Project**: React-Collage-B  
**Date**: August 2026  
**Auditor**: Antigravity Full-Stack Maintainer  

---

## 1. Recovery Objectives

| Metric | Target | Description |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | `< 24 Hours` | Maximum data loss duration in severe outage |
| **RTO (Recovery Time Objective)** | `< 2 Hours` | Target time to restore database and storage assets |

---

## 2. Automated & Manual Firestore Backups

### Automated Cloud Firestore Exports (GCP Cloud Scheduler)
Schedule periodic database exports to Google Cloud Storage bucket:
```bash
# Manual Ad-Hoc Export
gcloud firestore export gs://shopease-nepal-anmol-196e7-backups/firestore-$(date +%Y%m%d) \
  --project=shopease-nepal-anmol-196e7
```

### Firestore Database Restoration Procedure
In the event of accidental data corruption:
```bash
# Restore specific collection or full database
gcloud firestore import gs://shopease-nepal-anmol-196e7-backups/firestore-YYYYMMDD \
  --project=shopease-nepal-anmol-196e7
```

---

## 3. Cloud Storage Media Backup

Sync assets between primary storage bucket and disaster recovery backup bucket:
```bash
# Periodic Storage Mirroring
gcloud storage rsync gs://shopease-nepal-anmol-196e7.firebasestorage.app \
  gs://shopease-nepal-anmol-196e7-storage-backup \
  --recursive
```

---

## 4. Emergency Rollback Procedure

If a production frontend or backend release introduces critical regressions:
1. Roll back Firebase Hosting to previous release:
   ```bash
   npx --yes firebase-tools hosting:rollback
   ```
2. Roll back Cloud Functions:
   Deploy the tagged stable release git commit via CI or CLI:
   ```bash
   git checkout tags/v1.0.0-stable
   cd functions && npm ci && npm run build && cd ..
   npx --yes firebase-tools deploy --only functions --non-interactive
   ```
