import { MOD_FORM } from '../@types/IMod';
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
			unit.data['base' + secondaryName] = getBaseStat(
				secondaryName,
				existStat,
				secondary
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
		getSecondarySet(heroMods, name, secondary)
	);
}

export function getSecondarySet(mods, name, secondary) {
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

export function getBaseStat(secondaryName, existStat, secondary) {
	let baseStat: number = 0;
	switch (secondaryName) {
		case 'Potency':
		case 'Offense':
		case 'Health':
		case 'Tenacity':
		case 'Protection':
		case 'Critical Chance': {
			baseStat =
				(existStat - secondary[secondaryName].additionalSecondary) /
				(1 +
					secondary[secondaryName].additionalSecondaryPercent / 100 +
					secondary[secondaryName].secondaryFromSet / 100);
			break;
		}
		case 'Defense': {
			baseStat =
				existStat -
				secondary[secondaryName].additionalSecondaryPercent -
				secondary[secondaryName].additionalSecondary / 10;
			break;
		}
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
