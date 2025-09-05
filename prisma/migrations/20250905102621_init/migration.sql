/*
  Warnings:

  - You are about to drop the column `source` on the `expense` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `expense` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `type` on the `expense` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `source`,
    ADD COLUMN `category` VARCHAR(100) NULL,
    MODIFY `note` VARCHAR(255) NULL,
    MODIFY `amount` DECIMAL(10, 2) NOT NULL,
    MODIFY `type` VARCHAR(10) NOT NULL;
