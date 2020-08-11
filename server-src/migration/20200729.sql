CREATE TABLE `swr`.`Guilds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `guildId` INT NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `guildId_UNIQUE` (`guildId` ASC) VISIBLE);

CREATE TABLE `swr`.`GuildMembers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `allyCode` INT NOT NULL,
  `guildId` id NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `allyCode_UNIQUE` (`allyCode` ASC) VISIBLE);


ALTER TABLE `swr`.`GuildMembers`
CHANGE COLUMN `allyCode` `allyCode` INT NULL ;


ALTER TABLE `swr`.`GuildMembers`
CHANGE COLUMN `allyCode` `allyCode` INT NOT NULL ;

ALTER TABLE `swr`.`GuildMembers`
ADD COLUMN `name` VARCHAR(45) NOT NULL AFTER `guildId`;

