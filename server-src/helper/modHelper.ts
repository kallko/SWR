import { MOD_FORM, IMod } from '../@types/IMod';
import { IImportUnit } from '../@types/IUnit';
import { MOD_OPTIONS, STATS } from '../@const/modOptions';

export function getModForms(): (string | MOD_FORM)[] {
	const forms = Object.values(MOD_FORM);
	forms.length = forms.length / 2;
	forms.shift();
	return forms;
}

export function getUnitsWithStats(units: IImportUnit[], mods) {
	units.forEach((unit) => {
		unit.data.speed = getExistingSpeed(mods, unit);
		unit.data.fromMods = getExistingSecondary(mods, unit);
		unit.data.fromMods.forEach((secondary) => {
			let secondaryName = Object.keys(secondary)[0];
			let statsNumber = STATS[secondaryName];
			let existStat = unit.data.stats['' + statsNumber];
			let print = false;
			unit.data['base' + secondaryName] = getBaseStat(
				secondaryName,
				existStat,
				secondary,
				print
			);
		});
	});
	return units;
}

export function getExistingSpeed(mods, unit) {
	const name = unit.data.base_id;
	const heroMods = mods.filter((mod) => mod.character === name);
	const speed = getSpeed(heroMods);
	const existingSpeed = unit.data.stats['5'];
	const baseSpeed = Math.round(
		(existingSpeed - speed.additionalSpeed) / (1 + speed.speedFromSet / 100)
	);
	return { existingSpeed, baseSpeed };
}

export function getExistingSecondary(mods, unit) {
	const name = unit.data.base_id;
	const heroMods = mods.filter((mod) => mod.character === name);
	return MOD_OPTIONS.secondary.map((secondary) =>
		getSecondarySet(heroMods, secondary)
	);
}

export function getSecondarySet(mods, secondary) {
	let additionalSecondaryPercent = 0;
	let additionalSecondary = 0;
	const addPrimeSecondaryPercent = mods.reduce((summ, mod) => {
		if (mod.primary_stat.name === secondary) {
			if (secondary === 'Defense') {
				additionalSecondary += mod.primary_stat.value / 100;
				return summ;
			} else {
				return summ + mod.primary_stat.value / 100;
			}
		}
		return summ;
	}, 0);
	mods.forEach((mod) => {
		mod.secondary_stats.forEach((ss) => {
			if (ss.name === secondary) {
				if (ss.value % 10000 === 0) {
					additionalSecondary += ss.value / 10000;
				} else {
					additionalSecondaryPercent += ss.value / 100;
				}
			}
		});
	});
	additionalSecondaryPercent += addPrimeSecondaryPercent;
	// todo calculate additional from set
	const set = MOD_OPTIONS.sets.find((set) => set.name === secondary);
	if (!set) {
		return {
			[secondary]: {
				additionalSecondaryPercent,
				additionalSecondary,
				secondaryFromSet: 0
			}
		};
	}
	const setCount = set.setCount;
	const setId = set.id;
	const setBonus = set.fullBonus;
	const fullModInSet = mods.filter(
		(mod) => mod.set === setId && mod.level === 15
	).length;
	const modInSet = mods.filter((mod) => mod.set === setId && mod.level < 15)
		.length;

	const secondaryFromSet =
		((fullModInSet / setCount) | 0) * setBonus +
		(((((fullModInSet + modInSet) / setCount) | 0) -
			((fullModInSet / setCount) | 0)) *
			setBonus) /
			2;
	if (secondary === 'Speed') {
		additionalSecondary += additionalSecondaryPercent / 100;
		additionalSecondaryPercent = 0;
	}
	return {
		[secondary]: {
			additionalSecondaryPercent,
			additionalSecondary,
			secondaryFromSet
		}
	};
}

export function getSpeed(mods) {
	let speedFromSet = 0;
	let additionalSpeed = mods.reduce((summ, mod) => {
		const addPrimeSpeed =
			mod.primary_stat.name === 'Speed' ? mod.primary_stat.value / 10000 : 0;
		let addSecSpeed = 0;
		const addSecSpeedStat = mod.secondary_stats.find(
			(ss) => ss.name === 'Speed'
		);
		if (addSecSpeedStat) {
			addSecSpeed = addSecSpeedStat.value / 10000;
		}
		return summ + addPrimeSpeed + addSecSpeed;
	}, 0);
	if (mods.filter((mod) => mod.set === 4 && mod.level >= 1).length >= 4) {
		speedFromSet = 5;
		if (mods.filter((mod) => mod.set === 4 && mod.level === 15).length >= 4) {
			speedFromSet = 10;
		}
	}
	return { additionalSpeed, speedFromSet };
}

export function getBaseStat(
	secondaryName,
	existStat,
	secondary,
	print = false
) {
	let baseStat: number = 0;
	switch (secondaryName) {
		case 'Offense':
		case 'Health':
		case 'Protection': {
			baseStat =
				(existStat - secondary[secondaryName].additionalSecondary) /
				(1 +
					secondary[secondaryName].additionalSecondaryPercent / 100 +
					secondary[secondaryName].secondaryFromSet / 100);
			break;
		}
		case 'Critical Chance':
		case 'Defense': {
			baseStat =
				existStat -
				secondary[secondaryName].additionalSecondaryPercent -
				secondary[secondaryName].additionalSecondary / 10 -
				secondary[secondaryName].secondaryFromSet;
			break;
		}
		case 'Potency':
		case 'Tenacity':
		case 'Critical Damage': {
			baseStat =
				existStat -
				secondary[secondaryName].additionalSecondaryPercent / 100 -
				secondary[secondaryName].secondaryFromSet / 100;
			break;
		}
		default: {
			baseStat = null;
		}
	}
	return baseStat;
}

export function stringifyBestMods(
	{ hero, bestModsForUnit, unit, newSpeed },
	existingMods
): string {
	let result: string = '';
	const isNotUpgradable = bestModsForUnit.every((mod) => {
		const oldMod = existingMods.find((eMod) => eMod.id === mod.id);
		return oldMod.character === mod.character;
	});
	if (isNotUpgradable) {
		result = `Have best mod set with speed ${newSpeed}`;
	} else {
		result = `
		${getSpeedChanging(unit, newSpeed)}${getHealthChanging(
			unit
		)}${getProtectionChanging(unit)}${getDamageChanging(
			unit
		)}${getPotencyChanging(unit)}${getCriticalChanceChanging(
			unit
		)}${getCriticalDamageChanging(unit)}\n`;

		bestModsForUnit.forEach((mod) => {
			let emod = existingMods.find((eMod) => eMod.id === mod.id);
			if (emod.character !== hero.name) {
				result += getNewModInfo(mod, emod);
			}
		});
	}

	return result;
}

export function getNameWithSecondary(hero): string {
	return hero.name + (hero.secondary ? ' (' + hero.secondary + ')' : '');
}

function getSpeedChanging(unit: IImportUnit, newSpeed: number): string {
	return unit.data.speed.existingSpeed !== newSpeed
		? `Speed: ${unit.data.speed.existingSpeed}/${newSpeed}\n`
		: '';
}

function getHealthChanging(unit: IImportUnit): string {
	return unit.data.stats['1'] !== unit.data.newHealth
		? `Health: ${unit.data.stats['1']}/${Math.round(unit.data.newHealth)}\n`
		: '';
}

function getProtectionChanging(unit: IImportUnit): string {
	return unit.data.stats['28'] !== unit.data.newProtection
		? `Protection: ${unit.data.stats['28']}/${Math.round(
				unit.data.newProtection
		  )}\n`
		: '';
}

function getDamageChanging(unit: IImportUnit): string {
	return unit.data.stats['6'] !== unit.data.newOffense
		? `Damage: ${unit.data.stats['6']}/${Math.round(unit.data.newOffense)}\n`
		: '';
}

function getPotencyChanging(unit: IImportUnit): string {
	return Math.round(unit.data.stats['17'] * 100) !==
		Math.round(unit.data.newPotency * 100)
		? `Potency: ${Math.round(unit.data.stats['17'] * 100)}/${Math.round(
				unit.data.newPotency * 100
		  )}\n`
		: '';
}

// todo add tenacity calculating
// function getTenacityChanging(unit: IImportUnit): string {
// 	return `Tenacity: ${unit.data.newTenacity}\n`;
// }

function getCriticalChanceChanging(unit: IImportUnit): string {
	return Math.round(unit.data.stats['14']) !==
		Math.round(unit.data['newCritical Chance'])
		? `C-Chance: ${Math.round(unit.data.stats['14'])}/${Math.round(
				unit.data['newCritical Chance']
		  )}\n`
		: '';
}

function getCriticalDamageChanging(unit: IImportUnit): string {
	return Math.round(unit.data.stats['16'] * 100) / 100 !==
		Math.round(unit.data['newCritical Damage'] * 100) / 100
		? `C-Damage: ${Math.round(unit.data.stats['16'] * 100) / 100}/${
				Math.round(unit.data['newCritical Damage'] * 100) / 100
		  }\n`
		: '';
}

function getNewModInfo(mod: IMod, existMod: IMod): string {
	const identifier =
		mod.secondary_stats[0].name +
		' ' +
		(('' + mod.secondary_stats[0].value).indexOf('0000') !== -1
			? mod.secondary_stats[0].value / 10000
			: Math.round(mod.secondary_stats[0].value) / 100 + '%');
	const set = MOD_OPTIONS.sets.find((mmm) => mmm.id === mod.set);
	return `${MOD_OPTIONS.form[mod.slot]} from ${existMod.character} \nSET: ${
		set.name
	} Prime: ${mod.primary_stat.name} ${
		('' + mod.primary_stat.value).indexOf('0000') !== -1
			? mod.primary_stat.value / 10000
			: Math.round(mod.primary_stat.value) / 100 + '%'
	} Second: ${identifier} tier: ${mod.tier} rarity: ${mod.rarity} \n`;
}

export function getModRules(options): string {
	return options.reduce(
		(result, option) => result + getHeroModRules(option),
		''
	);
}

function getHeroModRules(option) {
	return `${option.name}:\n Possible sets: ${
		option.possibleSets.toString() ?? 'Any'
	} Main Stat: ${option.secondary}\n${
		'arrow: ' + (option.arrow ? option.arrow : 'any')
	}\n${'triangle: ' + (option.triangle ? option.triangle : 'any')}\n${
		'circle: ' + (option.circle ? option.circle : 'any')
	}\n${'cross: ' + (option.cross ? option.cross : 'any')}\n`;
}
