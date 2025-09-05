/*
  Warnings:

  - You are about to drop the column `category` on the `expense` table. All the data in the column will be lost.
  - You are about to alter the column `note` on the `expense` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `amount` on the `expense` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `category`,
    ADD COLUMN `source` VARCHAR(191) NULL,
    MODIFY `note` VARCHAR(191) NULL,
    MODIFY `amount` DECIMAL(65, 30) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;
