/*
  Warnings:

  - You are about to drop the column `category` on the `expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `category`,
    ADD COLUMN `source` VARCHAR(100) NULL;
