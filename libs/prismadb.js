import { PrismaClient } from "@prisma/client";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
	const errorMessage = `
❌ DATABASE_URL is not set!

To fix this error:
1. Copy .env.example to .env:
   cp .env.example .env

2. Edit .env and set your DATABASE_URL:
   DATABASE_URL="mysql://username:password@host:port/database_name"

3. For local MySQL:
   DATABASE_URL="mysql://root:password@localhost:3306/your_database"

4. For remote MySQL (Hostinger):
   DATABASE_URL="mysql://username:password@193.203.168.240:3306/database_name"

See README.md for detailed setup instructions.
	`;
	console.error(errorMessage);
	throw new Error("DATABASE_URL environment variable is not set. Please create a .env file with your database connection string.");
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
