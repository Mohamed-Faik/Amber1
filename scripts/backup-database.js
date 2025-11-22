/**
 * Database Backup Script
 * 
 * Creates a backup of the MySQL database
 * 
 * Usage:
 *   node scripts/backup-database.js [options]
 * 
 * Options:
 *   --output-dir <path>  Directory to save backups (default: ./backups)
 *   --docker             Use Docker MySQL container for backup
 *   --remote             Use remote DATABASE_URL for backup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2);
const outputDirIndex = args.indexOf('--output-dir');
const outputDir = outputDirIndex !== -1 && args[outputDirIndex + 1] 
	? args[outputDirIndex + 1] 
	: path.join(process.cwd(), 'backups');

const useDocker = args.includes('--docker');
const useRemote = args.includes('--remote');

// Create backup directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
	console.log(`✅ Created backup directory: ${outputDir}`);
}

// Create dated subdirectory for today's backups
const today = new Date().toISOString().split('T')[0];
const todayBackupDir = path.join(outputDir, today);
if (!fs.existsSync(todayBackupDir)) {
	fs.mkdirSync(todayBackupDir, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
	new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const backupFileName = `backup_${timestamp}.sql`;
const backupFilePath = path.join(todayBackupDir, backupFileName);

let databaseConfig = {};

if (useDocker) {
	// Use Docker MySQL container
	console.log('🐳 Using Docker MySQL container for backup...');
	
	databaseConfig = {
		host: 'localhost',
		port: process.env.MYSQL_PORT || '3306',
		user: process.env.MYSQL_USER || 'teor_user',
		password: process.env.MYSQL_PASSWORD || 'teor_password',
		database: process.env.MYSQL_DATABASE || 'teor_db',
		container: 'teor-mysql'
	};
	
	const mysqldumpCommand = `docker exec ${databaseConfig.container} mysqldump -u${databaseConfig.user} -p${databaseConfig.password} ${databaseConfig.database} > "${backupFilePath}"`;
	
	try {
		console.log(`📦 Creating backup: ${backupFileName}...`);
		execSync(mysqldumpCommand, { stdio: 'inherit' });
		console.log(`✅ Backup created successfully: ${backupFilePath}`);
	} catch (error) {
		console.error('❌ Backup failed:', error.message);
		process.exit(1);
	}
} else if (useRemote || process.env.DATABASE_URL) {
	// Use DATABASE_URL from environment
	console.log('🌐 Using remote DATABASE_URL for backup...');
	
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		console.error('❌ DATABASE_URL environment variable is not set!');
		process.exit(1);
	}
	
	// Parse DATABASE_URL: mysql://user:password@host:port/database
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
	
	const mysqldumpCommand = `mysqldump -h${databaseConfig.host} -P${databaseConfig.port} -u${databaseConfig.user} -p${databaseConfig.password} ${databaseConfig.database} > "${backupFilePath}"`;
	
	try {
		console.log(`📦 Creating backup: ${backupFileName}...`);
		execSync(mysqldumpCommand, { stdio: 'inherit' });
		console.log(`✅ Backup created successfully: ${backupFilePath}`);
	} catch (error) {
		console.error('❌ Backup failed:', error.message);
		console.error('💡 Make sure mysqldump is installed and accessible');
		process.exit(1);
	}
} else {
	// Use local MySQL (default)
	console.log('💻 Using local MySQL for backup...');
	
	databaseConfig = {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || '3306',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'teor_db'
	};
	
	if (process.env.DATABASE_URL) {
		// Parse DATABASE_URL if available
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
	
	const passwordFlag = databaseConfig.password ? `-p${databaseConfig.password}` : '';
	const mysqldumpCommand = `mysqldump -h${databaseConfig.host} -P${databaseConfig.port} -u${databaseConfig.user} ${passwordFlag} ${databaseConfig.database} > "${backupFilePath}"`;
	
	try {
		console.log(`📦 Creating backup: ${backupFileName}...`);
		execSync(mysqldumpCommand, { stdio: 'inherit' });
		console.log(`✅ Backup created successfully: ${backupFilePath}`);
	} catch (error) {
		console.error('❌ Backup failed:', error.message);
		console.error('💡 Make sure mysqldump is installed and MySQL server is running');
		process.exit(1);
	}
}

// Compress backup file (optional, saves space)
try {
	console.log('📦 Compressing backup...');
	const gzipCommand = process.platform === 'win32' 
		? `powershell Compress-Archive -Path "${backupFilePath}" -DestinationPath "${backupFilePath}.zip" -Force && del "${backupFilePath}"`
		: `gzip -f "${backupFilePath}"`;
	
	execSync(gzipCommand, { stdio: 'inherit' });
	
	const compressedFile = backupFilePath + (process.platform === 'win32' ? '.zip' : '.gz');
	const stats = fs.statSync(compressedFile);
	const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
	
	console.log(`✅ Backup compressed: ${path.basename(compressedFile)} (${fileSizeMB} MB)`);
} catch (error) {
	console.warn('⚠️  Compression failed (backup still created):', error.message);
}

// Create backup metadata file
const metadata = {
	timestamp: new Date().toISOString(),
	database: databaseConfig.database,
	host: databaseConfig.host,
	backupFile: path.basename(backupFilePath) + (process.platform !== 'win32' ? '.gz' : '.zip'),
	backupPath: path.dirname(backupFilePath),
	backupMethod: useDocker ? 'docker' : useRemote ? 'remote' : 'local'
};

const metadataPath = path.join(path.dirname(backupFilePath), `metadata_${timestamp}.json`);
fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
console.log(`📄 Backup metadata saved: ${path.basename(metadataPath)}`);

// Cleanup old backups (keep last 30 days)
try {
	console.log('🧹 Cleaning up old backups (keeping last 30 days)...');
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	
	const backupDirs = fs.readdirSync(outputDir, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory() && dirent.name.match(/^\d{4}-\d{2}-\d{2}$/));
	
	backupDirs.forEach(dir => {
		const dirDate = new Date(dir.name);
		if (dirDate < thirtyDaysAgo) {
			const dirPath = path.join(outputDir, dir.name);
			console.log(`🗑️  Deleting old backup: ${dir.name}`);
			fs.rmSync(dirPath, { recursive: true, force: true });
		}
	});
	console.log('✅ Cleanup completed');
} catch (error) {
	console.warn('⚠️  Cleanup failed:', error.message);
}

console.log('\n✨ Backup process completed successfully!');
console.log(`📁 Backup location: ${backupFilePath}${process.platform !== 'win32' ? '.gz' : '.zip'}`);

