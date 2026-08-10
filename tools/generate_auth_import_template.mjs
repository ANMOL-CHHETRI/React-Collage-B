import fs from 'fs';

// This script generates a template users.json file for Firebase Auth SCRYPT import.
// If you have legacy users, you can map their data into this structure.

const usersTemplate = {
  "users": [
    {
      "localId": "user-id-1",
      "email": "admin@shopease.com",
      "emailVerified": true,
      // The passwordHash must be the base64 encoded SCRYPT hash from your legacy Firebase project
      "passwordHash": "J3i1... (base64 string)",
      // The salt used during the hash generation
      "salt": "a2... (base64 string)",
      "displayName": "ShopEase Admin",
      "photoUrl": "https://example.com/admin.png"
    },
    {
      "localId": "user-id-2",
      "email": "user@shopease.com",
      "emailVerified": false,
      "passwordHash": "K9z2... (base64 string)",
      "salt": "b4... (base64 string)",
      "displayName": "Test User"
    }
  ]
};

const outputPath = './users_import_template.json';

fs.writeFileSync(outputPath, JSON.stringify(usersTemplate, null, 2));
console.log(`✅ Created template at: ${outputPath}`);
console.log('\nOnce you have your users_import_template.json filled out with your real hashes, run the following command in your terminal:');
console.log(`
npx firebase auth:import users_import_template.json \`
  --hash-algo=SCRYPT \`
  --hash-key="1CCg8CLpkUKdAIWS6L2mRnqaWfwi8ZSOnb6laZUc34YopYHaIY1gxmqibGa0Lg+hBL/Qja0isPV7I/dX6xvrBw==" \`
  --salt-separator="Bw==" \`
  --rounds=8 \`
  --mem-cost=14
`);
