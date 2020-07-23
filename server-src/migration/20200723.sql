CREATE TABLE `swr`.`Idea` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(512) NOT NULL,
  `allyCode` INT NULL,
  `discordId` INT NULL,
  PRIMARY KEY (`id`));

  ALTER TABLE `swr`.`Idea`
CHANGE COLUMN `discordId` `discordId` VARCHAR(64) NULL DEFAULT NULL ;
