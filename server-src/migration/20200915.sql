ALTER TABLE `swr`.`GuildMembers`
CHANGE COLUMN `guildId` `guildId` INT NULL ;


ALTER TABLE `swr`.`Units`
CHANGE COLUMN `health` `health` INT NULL ,
CHANGE COLUMN `speed` `speed` INT NULL ,
CHANGE COLUMN `damage` `damage` INT NULL ,
CHANGE COLUMN `damageSpecial` `damageSpecial` INT NULL ,
CHANGE COLUMN `defense` `defense` DECIMAL(6,2) NULL ,
CHANGE COLUMN `criticalChance` `criticalChance` DECIMAL(6,2) NULL ,
CHANGE COLUMN `criticalChanceSpecial` `criticalChanceSpecial` DECIMAL(6,2) NULL ,
CHANGE COLUMN `criticalDamage` `criticalDamage` INT NULL ,
CHANGE COLUMN `potency` `potency` INT NULL ,
CHANGE COLUMN `tenacity` `tenacity` INT NULL ,
CHANGE COLUMN `protection` `protection` INT NULL ;

INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'EMPERORPALPATINE', '30429', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'VADER', '33409', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'ROYALGUARD', '19003', '3');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'ADMIRALPIETT', '27013', '5');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'DIRECTORKRENNIC', '23545', '4');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'DARTHSIDIOUS', '27448', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'MAUL', '22971', '4');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'COUNTDOOKU', '26335', '6');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'SITHMARAUDER', '24468', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `ship`, `rarity`) VALUES ('SITHPALPATINE', 'TIEBOMBERIMPERIAL', '25000', '1', '6');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'ANAKINKNIGHT', '27448', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'GRANDADMIRALTHRAWN', '28531', '6');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'GRANDMOFFTARKIN', '24964', '3');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'VEERS', '21984', '3');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('SITHPALPATINE', 'COLONELSTARCK', '21984', '3');


INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'OLDBENKENOBI', '27013', '5');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'REYJEDITRAINING', '33409', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'C3POLEGENDARY', '28582', '5');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'MONMOTHMA', '27013', '5');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'C3POCHEWBACCA', '24033', '5');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'JEDIKNIGHTLUKE', '30429', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'R2D2_LEGENDARY', '30429', '7');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'HANSOLO', '25551', '6');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'CHEWBACCALEGENDARY', '28531', '6');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `ship`, `rarity`) VALUES ('GRANDMASTERLUKE', 'YWINGREBEL', '25000', '1', '6');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'PRINCESSLEIA', '21984', '3');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'HERMITYODA', '27013', '5');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'WEDGEANTILLES', '19578', '3');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'BIGGSDARKLIGHTER', '19003', '3');
INSERT INTO `swr`.`LegendRequirements` (`name`, `baseId`, `power`, `relic`) VALUES ('GRANDMASTERLUKE', 'ADMINISTRATORLANDO', '21417', '5');
