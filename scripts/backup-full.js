/**
 * Full Backup Script
 * 
 * Creates a complete backup of both database and file uploads
 * 
 * Usage:
 *   node scripts/backup-full.js [options]
 * 
 * Options:
 *   --output-dir <path>  Directory to save backups (default: ./backups)
 *   --docker             Use Docker MySQL container
 *   --remote             Use remote DATABASE_URL
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting full backup process...\n');

// Get output directory from arguments
const args = process.argv.slice(2);
const outputDirIndex = args.indexOf('--output-dir');
const outputDir = outputDirIndex !== -1 && args[outputDirIndex + 1] 
	? args[outputDirIndex + 1] 
	: path.join(process.cwd(), 'backups');

// Build command arguments
const scriptArgs = args.filter(arg => arg !== '--output-dir' && 
	(args[outputDirIndex + 1] !== arg || outputDirIndex === -1 || args.indexOf(arg) !== outputDirIndex + 1));
const dockerArg = args.includes('--docker') ? '--docker' : '';
const remoteArg = args.includes('--remote') ? '--remote' : '';

try {
	// Step 1: Backup database
	console.log('📦 Step 1/2: Backing up database...');
	console.log('─'.repeat(50));
	execSync(`node scripts/backup-database.js --output-dir "${outputDir}" ${dockerArg} ${remoteArg}`, { 
		stdio: 'inherit',
		cwd: process.cwd()
	});
	
	// Step 2: Backup files
	console.log('\n📦 Step 2/2: Backing up file uploads...');
	console.log('─'.repeat(50));
	execSync(`node scripts/backup-files.js --output-dir "${outputDir}"`, { 
		stdio: 'inherit',
		cwd: process.cwd()
	});
	
	console.log('\n✨ Full backup completed successfully!');
	console.log(`📁 Backup location: ${outputDir}`);
	
} catch (error) {
	console.error('\n❌ Full backup failed:', error.message);
	process.exit(1);
}

