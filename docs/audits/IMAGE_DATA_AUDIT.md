# Image Data Audit Report

**Date**: 2026-08-21T15:58:05.539Z  
**Mode**: DRY_RUN  
**Total References Checked**: 16  

---

## 1. Summary Statistics

| Category | Count | Description |
| :--- | :--- | :--- |
| **Valid Local Assets** | 9 | Assets verified to exist in `public/` |
| **Valid External URLs** | 7 | Verified CDNs (Google, Pinterest, Cloudinary) |
| **Legacy / Typo Fields** | 0 | Resolved by `src/utils/imageUrl.js` fallback map |
| **Missing Assets** | 0 | Broken or non-existent paths |
| **Orphaned Storage Files** | 0 | Unreferenced storage objects |

---

## 2. Detailed Audit Log

```json
[
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/d4/16/12/d41612e4db1ef4157d6e3f11e4b832c0.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/aa/a0/66/aaa066bd92f5721e603358173e219353.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/pashmina_shawl.png",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/09/41/ae/0941aefdc7b7a3151698e1c3dcc3853d.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "https://i.pinimg.com/736x/63/0d/01/630d013345d875610fec89f4c28dd2b6.jpg",
    "status": "EXTERNAL_VALID",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/daura_suruwal.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/gunyo-choli.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/hakupatasi.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/bhadgauletopi.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/dhakasaree.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/peacock_window.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/shilajit.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  },
  {
    "source": "productsData.js",
    "reference": "/singing_bowl.jpg",
    "status": "VALID_LOCAL",
    "recommendedAction": "NONE"
  }
]
```
