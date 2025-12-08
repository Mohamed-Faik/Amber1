/**
 * File Uploads Backup Script
 * 
 * Creates a backup of uploaded files (images, documents)
 * 
 * Usage:
 *   node scripts/backup-files.js [options]
 * 
 * Options:
 *   --output-dir <path>  Directory to save backups (default: ./backups)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const outputDirIndex = args.indexOf('--output-dir');
const outputDir = outputDirIndex !== -1 && args[outputDirIndex + 1] 
	? args[outputDirIndex + 1] 
	: path.join(process.cwd(), 'backups');

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// Create backup directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
	console.log(`✅ Created backup directory: ${outputDir}`);
}

// Create dated subdirectory
const today = new Date().toISOString().split('T')[0];
const todayBackupDir = path.join(outputDir, today, 'uploads');
if (!fs.existsSync(todayBackupDir)) {
	fs.mkdirSync(todayBackupDir, { recursive: true });
}

// Generate backup filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
	new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const backupFileName = `uploads_backup_${timestamp}.tar.gz`;
const backupFilePath = path.join(path.dirname(todayBackupDir), backupFileName);

// Check if uploads directory exists
if (!fs.existsSync(uploadsDir)) {
	console.warn('⚠️  Uploads directory does not exist:', uploadsDir);
	console.log('💡 Creating empty uploads directory...');
	fs.mkdirSync(uploadsDir, { recursive: true });
}

try {
	console.log('📦 Creating file uploads backup...');
	
	// Use tar for compression (cross-platform compatible)
	if (process.platform === 'win32') {
		// Windows: Use PowerShell compression
		console.log('💻 Using PowerShell compression for Windows...');
		const zipPath = backupFilePath.replace('.tar.gz', '.zip');
		
		// Copy files first
		const tempDir = path.join(path.dirname(backupFilePath), 'temp_uploads');
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
		fs.cpSync(uploadsDir, tempDir, { recursive: true });
		
		// Compress using PowerShell
		execSync(`powershell Compress-Archive -Path "${tempDir}" -DestinationPath "${zipPath}" -Force`, { stdio: 'inherit' });
		
		// Cleanup temp directory
		fs.rmSync(tempDir, { recursive: true, force: true });
		
		console.log(`✅ Backup created: ${path.basename(zipPath)}`);
	} else {
		// Linux/Mac: Use tar
		const tarCommand = `tar -czf "${backupFilePath}" -C "${path.dirname(uploadsDir)}" uploads`;
		execSync(tarCommand, { stdio: 'inherit' });
		
		const stats = fs.statSync(backupFilePath);
		const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
		console.log(`✅ Backup created: ${path.basename(backupFilePath)} (${fileSizeMB} MB)`);
	}
	
	// Create metadata
	const metadata = {
		timestamp: new Date().toISOString(),
		sourceDir: uploadsDir,
		backupFile: path.basename(backupFilePath),
		backupPath: path.dirname(backupFilePath)
	};
	
	const metadataPath = path.join(path.dirname(backupFilePath), `uploads_metadata_${timestamp}.json`);
	fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
	console.log(`📄 Metadata saved: ${path.basename(metadataPath)}`);
	
	console.log('\n✨ File backup completed successfully!');
} catch (error) {
	console.error('❌ File backup failed:', error.message);
	process.exit(1);
}

