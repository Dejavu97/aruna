import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import path from 'path';

async function migrate() {
  console.log('Starting migration...');
  
  const serviceAccountPath = process.argv[2];
  if (!serviceAccountPath) {
    console.error('Please provide path to service account json file as first argument.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();
  
  const invitationsSnap = await db.collection('invitations').get();
  console.log(`Found ${invitationsSnap.size} invitations to process.`);
  
  let count = 0;
  for (const doc of invitationsSnap.docs) {
    const data = doc.data();
    if (data.editKey) {
      console.log(`Migrating key for ${doc.id}...`);
      // Write to private_keys
      await db.collection('private_keys').doc(doc.id).set({ editKey: data.editKey });
      
      // We will NOT delete it from invitations yet until everything works. 
      // It's safer to just let the old key sit there for now, or delete it later.
      // Wait, to secure the app, we MUST delete it.
      await db.collection('invitations').doc(doc.id).update({
        editKey: FieldValue.delete()
      });
      count++;
    }
  }
  
  console.log(`Migration complete! Migrated ${count} keys.`);
}

migrate().catch(console.error);
