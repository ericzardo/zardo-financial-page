-- AlterTable
ALTER TABLE `buckets` ADD COLUMN `total_allocated` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `is_allocated` BOOLEAN NOT NULL DEFAULT false;
