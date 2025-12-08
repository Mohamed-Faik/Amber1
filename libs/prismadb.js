import { PrismaClient } from "@prisma/client";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
	const isVercel = process.env.VERCEL === "1";
	
	const errorMessage = `
❌ DATABASE_URL is not set!

${isVercel ? `
⚠️  DEPLOYED ON VERCEL:
To fix this error:
1. Go to your Vercel Dashboard → Project Settings → Environment Variables
2. Add DATABASE_URL with your database connection string:
   DATABASE_URL="mysql://username:password@host:port/database_name"

3. After adding the environment variable:
   - Go to Deployments tab
   - Click "..." on the latest deployment
   - Select "Redeploy"
   - Make sure "Use existing Build Cache" is UNCHECKED

4. For remote MySQL (Hostinger):
   DATABASE_URL="mysql://username:password@193.203.168.240:3306/database_name"
` : `
For local development:
1. Copy .env.example to .env:
   cp .env.example .env

2. Edit .env and set your DATABASE_URL:
   DATABASE_URL="mysql://username:password@host:port/database_name"

3. For local MySQL:
   DATABASE_URL="mysql://root:password@localhost:3306/your_database"

4. For remote MySQL (Hostinger):
   DATABASE_URL="mysql://username:password@193.203.168.240:3306/database_name"
`}

See README.md for detailed setup instructions.
	`;
	console.error(errorMessage);
	
	const error = new Error(
		isVercel 
			? "DATABASE_URL environment variable is not set in Vercel. Please add it in Project Settings → Environment Variables."
			: "DATABASE_URL environment variable is not set. Please create a .env file with your database connection string."
	);
	
	// Store the detailed message for API routes to access
	error.detailedMessage = errorMessage;
	
	throw error;
}

const globalForPrisma = globalThis || window || {};

if (!globalForPrisma.prisma) {
	globalForPrisma.prisma = new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});
}

const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

module.exports = prisma;
