/**
 * Database Restore Script
 * 
 * Restores MySQL database from a backup file
 * 
 * Usage:
 *   node scripts/restore-database.js <backup-file> [options]
 * 
 * Options:
 *   --docker             Use Docker MySQL container for restore
 *   --remote             Use remote DATABASE_URL for restore
 *   --no-confirm         Skip confirmation prompt (use with caution)
 * 
 * Example:
 *   node scripts/restore-database.js backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz --docker
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2);
const backupFileIndex = args.findIndex(arg => !arg.startsWith('--'));
const backupFilePath = backupFileIndex !== -1 ? args[backupFileIndex] : null;

if (!backupFilePath) {
	console.error('❌ Error: Backup file path is required!');
	console.log('\nUsage: node scripts/restore-database.js <backup-file> [options]');
	console.log('\nExample:');
	console.log('  node scripts/restore-database.js backups/2024-01-15/backup_2024-01-15_12-30-45.sql.gz --docker');
	process.exit(1);
}

const resolvedBackupPath = path.resolve(backupFilePath);

if (!fs.existsSync(resolvedBackupPath)) {
	console.error(`❌ Error: Backup file not found: ${resolvedBackupPath}`);
	process.exit(1);
}

const useDocker = args.includes('--docker');
const useRemote = args.includes('--remote');
const noConfirm = args.includes('--no-confirm');

let databaseConfig = {};

// Determine if backup is compressed
const isCompressed = resolvedBackupPath.endsWith('.gz') || resolvedBackupPath.endsWith('.zip');
const sqlFilePath = isCompressed 
	? resolvedBackupPath.replace(/\.(gz|zip)$/, '.sql')
	: resolvedBackupPath;

// Decompress if needed
if (isCompressed) {
	console.log('📦 Decompressing backup file...');
	try {
		if (resolvedBackupPath.endsWith('.gz')) {
			execSync(`gunzip -c "${resolvedBackupPath}" > "${sqlFilePath}"`, { stdio: 'inherit' });
		} else if (resolvedBackupPath.endsWith('.zip')) {
			// Windows zip file - use PowerShell or unzip
			if (process.platform === 'win32') {
				execSync(`powershell Expand-Archive -Path "${resolvedBackupPath}" -DestinationPath "${path.dirname(sqlFilePath)}" -Force`, { stdio: 'inherit' });
				// Find the extracted SQL file
				const extractedFiles = fs.readdirSync(path.dirname(sqlFilePath));
				const sqlFile = extractedFiles.find(f => f.endsWith('.sql'));
				if (sqlFile) {
					fs.renameSync(path.join(path.dirname(sqlFilePath), sqlFile), sqlFilePath);
				}
			} else {
				execSync(`unzip -o "${resolvedBackupPath}" -d "${path.dirname(sqlFilePath)}"`, { stdio: 'inherit' });
			}
		}
		console.log('✅ Backup decompressed');
	} catch (error) {
		console.error('❌ Failed to decompress backup:', error.message);
		process.exit(1);
	}
}

// Confirmation prompt
if (!noConfirm) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	console.warn('\n⚠️  WARNING: This will replace all existing data in the database!');
	console.warn('   This action cannot be undone.\n');
	
	rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
		if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
			console.log('❌ Restore cancelled.');
			if (isCompressed && fs.existsSync(sqlFilePath)) {
				fs.unlinkSync(sqlFilePath);
			}
			rl.close();
			process.exit(0);
		}
		
		rl.close();
		performRestore();
	});
} else {
	performRestore();
}

function performRestore() {
	if (useDocker) {
		// Use Docker MySQL container
		console.log('🐳 Using Docker MySQL container for restore...');
		
		databaseConfig = {
			host: 'localhost',
			port: process.env.MYSQL_PORT || '3306',
			user: process.env.MYSQL_USER || 'teor_user',
			password: process.env.MYSQL_PASSWORD || 'teor_password',
			database: process.env.MYSQL_DATABASE || 'teor_db',
			container: 'teor-mysql'
		};
		
		// Copy SQL file into container first (for large files)
		const containerSqlPath = `/tmp/restore.sql`;
		
		try {
			console.log('📦 Copying backup file into container...');
			execSync(`docker cp "${sqlFilePath}" ${databaseConfig.container}:${containerSqlPath}`, { stdio: 'inherit' });
			
			console.log('🔄 Restoring database...');
			const restoreCommand = `docker exec -i ${databaseConfig.container} mysql -u${databaseConfig.user} -p${databaseConfig.password} ${databaseConfig.database} < ${containerSqlPath}`;
			execSync(restoreCommand, { stdio: 'inherit' });
			
			// Cleanup
			execSync(`docker exec ${databaseConfig.container} rm ${containerSqlPath}`, { stdio: 'pipe' });
			
			console.log('✅ Database restored successfully!');
		} catch (error) {
			console.error('❌ Restore failed:', error.message);
			process.exit(1);
		}
	} else if (useRemote || process.env.DATABASE_URL) {
		// Use DATABASE_URL from environment
		console.log('🌐 Using remote DATABASE_URL for restore...');
		
		const databaseUrl = process.env.DATABASE_URL;
		if (!databaseUrl) {
			console.error('❌ DATABASE_URL environment variable is not set!');
			process.exit(1);
		}
		
		// Parse DATABASE_URL
		const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
		if (!urlMatch) {
			console.error('❌ Invalid DATABASE_URL format!');
			process.exit(1);
		}
		
		databaseConfig = {
			host: urlMatch[3],
			port: urlMatch[4],
			user: urlMatch[1],
			password: urlMatch[2],
			database: urlMatch[5]
		};
		
		try {
			console.log('🔄 Restoring database...');
			const restoreCommand = `mysql -h${databaseConfig.host} -P${databaseConfig.port} -u${databaseConfig.user} -p${databaseConfig.password} ${databaseConfig.database} < "${sqlFilePath}"`;
			execSync(restoreCommand, { stdio: 'inherit' });
			console.log('✅ Database restored successfully!');
		} catch (error) {
			console.error('❌ Restore failed:', error.message);
			console.error('💡 Make sure mysql client is installed and accessible');
			process.exit(1);
		}
	} else {
		// Use local MySQL
		console.log('💻 Using local MySQL for restore...');
		
		databaseConfig = {
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || '3306',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_NAME || 'teor_db'
		};
		
		if (process.env.DATABASE_URL) {
			const urlMatch = process.env.DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
			if (urlMatch) {
				databaseConfig = {
					host: urlMatch[3],
					port: urlMatch[4],
					user: urlMatch[1],
					password: urlMatch[2],
					database: urlMatch[5]
				};
			}
		}
		
		try {
			console.log('🔄 Restoring database...');
			const passwordFlag = databaseConfig.password ? `-p${databaseConfig.password}` : '';
			const restoreCommand = `mysql -h${databaseConfig.host} -P${databaseConfig.port} -u${databaseConfig.user} ${passwordFlag} ${databaseConfig.database} < "${sqlFilePath}"`;
			execSync(restoreCommand, { stdio: 'inherit' });
			console.log('✅ Database restored successfully!');
		} catch (error) {
			console.error('❌ Restore failed:', error.message);
			console.error('💡 Make sure mysql client is installed and MySQL server is running');
			process.exit(1);
		}
	}
	
	// Cleanup decompressed file if it was compressed
	if (isCompressed && fs.existsSync(sqlFilePath) && sqlFilePath !== resolvedBackupPath) {
		console.log('🧹 Cleaning up temporary files...');
		fs.unlinkSync(sqlFilePath);
	}
	
	console.log('\n✨ Restore process completed successfully!');
	console.log('💡 You may need to regenerate Prisma Client: npx prisma generate');
}

