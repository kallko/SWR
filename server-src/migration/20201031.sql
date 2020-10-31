CREATE TABLE `swr`.`Squad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `squad` TEXT NOT NULL,
  `used` INT NULL,
  `allyCode` INT NULL,
  `createdAt` DATETIME NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`));
