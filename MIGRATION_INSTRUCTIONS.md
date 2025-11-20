# Database Migration Instructions

## Issue
The `status` field exists in the Prisma schema but may not exist in the database, causing the error:
```
Unknown argument `status`. Available options are marked with ?.
```

## Solution

### Option 1: Sync Database Schema (Recommended - Quick Fix)

1. **Stop the development server** (if running)
   - Press `Ctrl+C` in the terminal where `npm run dev` is running

2. **Sync the database schema**:
   ```bash
   npx prisma db push
   ```
   This will add the missing `status` column to the `user` table.

3. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Restart the development server**:
   ```bash
   npm run dev
   ```

### Option 2: Create a Migration (For Production)

1. **Stop the development server**

2. **Create a migration**:
   ```bash
   npx prisma migrate dev --name add_user_status_field
   ```

3. **Restart the development server**

## What This Does

- Adds the `status` column to the `user` table in your MySQL database
- Creates the `user_status` enum type (Active, Inactive)
- Sets default value to "Active" for existing users
- Regenerates Prisma Client to recognize the new field

## Verification

After running the migration, you can verify the column exists by:
1. Opening Prisma Studio: `npx prisma studio`
2. Checking the `user` table - you should see a `status` column

## Note

If you're using a remote database (like Hostinger), make sure:
- Your IP is whitelisted
- The `DATABASE_URL` in `.env` is correct
- You have proper database permissions

