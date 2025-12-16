Prisma schema changed: `Application.status` is now `ApplicationStatus` enum.

To apply this safely:

1. Ensure you have a database backup.
2. Generate a migration:

   npx prisma migrate dev --name convert-status-to-enum

3. If the migration fails due to incompatible existing values, you may need to run a manual SQL migration to map old string values to enum values.

4. After successful migration, regenerate Prisma Client:

   npx prisma generate

5. Restart the dev server.

Note: This change only updates the schema file; you must run the commands above locally to apply.
