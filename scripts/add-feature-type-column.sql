-- SQL script to add featureType column to listing table
-- Run this if Prisma db push doesn't work

-- First, create the enum if it doesn't exist (MySQL doesn't have native enums, we use ENUM type)
-- Note: MySQL ENUM is created automatically, but we need to ensure the column exists

ALTER TABLE `listing` 
ADD COLUMN `featureType` ENUM('HOMES', 'EXPERIENCES', 'SERVICES') NOT NULL DEFAULT 'HOMES' 
AFTER `listingType`;

-- Update existing records to have HOMES as default
UPDATE `listing` SET `featureType` = 'HOMES' WHERE `featureType` IS NULL;

