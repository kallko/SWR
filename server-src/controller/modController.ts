import { fetchDataService } from '../service/fetchDataService';
import { IMod, IBestMods, IModEvaluation } from '../@types/IMod';
import { IFrontColorUpMod } from '../@types/IFrontEnd';
import { MOD_OPTIONS, STATS } from '../@const/modOptions';
import { Sorter } from '../helper/sorter';
import { Transformer } from '../helper/transformer';
import { getModForms, getUnitsWithStats } from '../helper/modHelper';
import { squadController } from './squadController';
import { UnitService } from '../service/UnitService';
import { Unit } from '../service/dbModels';
let currentSecondary = null;
let currentUnit = null;

export const modController = {
	async getColorUpMods(id: number): Promise<IFrontColorUpMod[]> {
		const playerMods: IMod[] = await fetchDataService.getAllMods(id);
		const colorUpMods5: IMod[] = filter5StarModsForColorUp(playerMods);
		const colorUpMods6: IMod[] = filter6StarModsForColorUp(playerMods);
		return Transformer.transformColorUpMods([...colorUpMods5, ...colorUpMods6]);
	},
	async creator(allyCode: number) {
		let newSets = [];
		let blockedHeroes = [];
		let mods: IMod[] = await fetchDataService.getAllMods(allyCode);
		const player = await fetchDataService.getPlayer(allyCode);
		const existingMods = JSON.parse(JSON.stringify(mods));
		const units = getUnitsWithStats(player.units, mods);
		//todo getOptions for Arena Units
		const squadOptions = await squadController.getModeRulesForArenaSquad(
			allyCode
		);
		squadOptions.forEach((hero) => {
			const unit = units.find((unit) => unit.data.base_id === hero.name);
			if (unit) {
				let possibleMods: IMod[] = getPossibleMods({
					mods,
					blockedHeroes,
					hero,
					unit
				});
				let bestMods = getBestMods({ possibleMods, hero, unit });

				let bestModsForUnit: IMod[] = modVariator(
					hero,
					bestMods,
					unit,
					hero.possibleSets
				);
				let newSpeed = bestModsForUnit[bestModsForUnit.length - 1];
				bestModsForUnit.pop();
				calculateNewStats(unit, bestModsForUnit);
				mods = mods.map((mod) => {
					if (mod.character === hero.name) {
						mod.character = '';
					}
					return mod;
				});
				bestModsForUnit.forEach((bMod) => {
					let mod = mods.find((m) => m.id === bMod.id);
					mod.character = hero.name;
				});
				newSets.push({
					hero,
					bestModsForUnit,
					unit,
					newSpeed
				});
			}
			blockedHeroes.push(hero.name);
		});

		// todo why we need lefted mods?
		// let leftMods = mods.filter(
		// 	(mod) =>
		// 		!result.blockedHeroes.some((blocked) => blocked === mod.character)
		// );
		// let niceSpeedValue = 100000;
		// leftMods = leftMods.filter((mod) => {
		// 	let speedStat = mod.secondary_stats.find((ss) => ss.name === 'Speed');
		// 	let niceSpeed = speedStat ? speedStat.value >= niceSpeedValue : false;
		// 	return mod.character === '' && mod.slot !== 2 && niceSpeed;
		// });
		// console.log(
		// 	'We left behind ',
		// 	leftMods.length,
		// 	' mods with speed ',
		// 	niceSpeedValue / 10000 + '+'
		// );
		// currentSecondary = null;
		// leftMods.sort(sortBySpeed);
		// todo console with losted mods
		// MOD_OPTIONS.sets.forEach((set) => {
		// 	let quant = leftMods.filter((mod) => mod.set === set.id).length;
		// 	console.log('For set ', set.name, ' we lost ', quant, ' mods');
		// });
		return { existingMods, squadOptions, newSets };
	},
	async getModForEvolution(
		allyCode: number,
		parameters: any
	): Promise<{ result: IModEvaluation[]; baseId: string }> {
		let units: Unit[] = await UnitService.getAllPlayerUnits(allyCode, [
			'power',
			'DESC'
		]);
		units = units.filter((unit) => unit.combatType === 1);
		const mods: IMod[] = await fetchDataService.getAllMods(allyCode);
		let baseId = await getBaseIdForModEvolution(parameters, units);
		let rankedModSets = [];
		if (!baseId) {
			for (const unit of units) {
				rankedModSets = rankMods(units, mods, unit.baseId);
				if (rankedModSets.length > 0) {
					baseId = unit.baseId;
					break;
				}
			}
		} else {
			rankedModSets = rankMods(units, mods, baseId);
		}
		rankedModSets.forEach(
			(rankedModSet) =>
				(rankedModSet.children.length =
					rankedModSet.children.length > 3 ? 3 : rankedModSet.children.length)
		);
		return { result: sortMods(rankedModSets), baseId };
	}
};

function sortBySpeed(first, second) {
	if (first.slot !== 2) {
		let firstSpeed = first.secondary_stats.find(
			(ss) => ss.name === 'Speed'
		) || { value: 0 };
		let secondSpeed = second.secondary_stats.find(
			(ss) => ss.name === 'Speed'
		) || { value: 0 };
		if (
			secondSpeed.value - firstSpeed.value === 0 &&
			currentSecondary &&
			currentUnit
		) {
			let firstSecondarytemp = getAdditionalSecondaryForUnit(first);
			let secondSecondarytemp = getAdditionalSecondaryForUnit(second);
			return secondSecondarytemp - firstSecondarytemp;
		} else {
			return secondSpeed.value - firstSpeed.value;
		}
	}
	let firstSpeed =
		first.primary_stat.name === 'Speed' ? first.primary_stat.value : 0;
	let secondSpeed =
		second.primary_stat.name === 'Speed' ? second.primary_stat.value : 0;
	if (secondSpeed - firstSpeed === 0 && currentSecondary) {
		let firstSecondary = first.secondary_stats.find(
			(ss) => ss.name === currentSecondary
		) || { value: 0 };
		let secondSecondary = second.secondary_stats.find(
			(ss) => ss.name === currentSecondary
		) || { value: 0 };
		return secondSecondary.value - firstSecondary.value;
	} else {
		return secondSpeed - firstSpeed;
	}
}

function modVariator(hero, mods, unit, possibleSets) {
	let result = [];
	let forms = [].concat(MOD_OPTIONS.form);
	forms.shift();
	let bestSpeed = 0;
	let bestSecondary = 0;
	mods.square.forEach((mSquare) => {
		mods.arrow.forEach((mArrow) => {
			mods.romb.forEach((mRomb) => {
				mods.triangle.forEach((mTriangle) => {
					mods.circle.forEach((mCircle) => {
						mods.cross.forEach((mCross) => {
							let completeSets = isCompleteSets(
								{ mSquare, mArrow, mRomb, mTriangle, mCircle, mCross },
								possibleSets
							);
							const mods = [mSquare, mArrow, mRomb, mTriangle, mCircle, mCross];
							if (!hero.completeSets || (hero.completeSets && completeSets)) {
								const speed = getSpeed([
									mSquare,
									mArrow,
									mRomb,
									mTriangle,
									mCircle,
									mCross
								]);
								const withNewSetSpeed = Math.round(
									unit.data.speed.baseSpeed * (1 + speed.speedFromSet / 100) +
										speed.additionalSpeed
								);
								if (withNewSetSpeed >= bestSpeed) {
									const newUnit = JSON.parse(JSON.stringify(unit));
									// todo calculate only 1 field
									calculateNewStats(newUnit, [
										mSquare,
										mArrow,
										mRomb,
										mTriangle,
										mCircle,
										mCross
									]);
									const newSecondary = newUnit.data['new' + hero.secondary];
									if (
										withNewSetSpeed > bestSpeed ||
										(withNewSetSpeed === bestSpeed &&
											newSecondary > bestSecondary)
									) {
										bestSpeed = withNewSetSpeed;
										bestSecondary = newSecondary;
										result = mods;
									}
								}
							}
						});
					});
				});
			});
		});
	});
	result.push(bestSpeed);
	return result;
}

function cutBestMods(mods) {
	let result = [];
	MOD_OPTIONS.sets.forEach((set) => {
		let setMods = mods.filter((mod) => mod.set === set.id);
		if (setMods.length > 3) {
			let index = setMods.findIndex((mod, index) => {
				let currentSpeed = getSpeed([mod]);
				let baseSpeed = getSpeed([setMods[0]]);
				return (
					index >= 2 && currentSpeed.additionalSpeed < baseSpeed.additionalSpeed
				);
			});
			if (index > 0) {
				setMods.length = index;
			}
			result = result.concat(setMods);
		} else {
			result = result.concat(setMods);
		}
	});
	return result;
}

export function calculateNewStats(unit, mods) {
	[
		'Health',
		'Protection',
		'Offense',
		'Critical Chance',
		'Critical Damage',
		'Potency'
	].forEach((secondary) => {
		let additional = getSecondarySet(mods, '', secondary)[secondary];
		let addPercent =
			secondary === 'Critical Damage' ? 1 : unit.data['base' + secondary];
		unit.data['new' + secondary] =
			unit.data['base' + secondary] +
			additional.additionalSecondary +
			(addPercent * additional.additionalSecondaryPercent) / 100 +
			(addPercent * additional.secondaryFromSet) / 100;
	});
}

function getAdditionalSecondaryForUnit(mod) {
	let result = 0;
	let baseStatNumber = STATS[currentSecondary];
	let baseStat = currentUnit.data.stats[baseStatNumber];
	switch (currentSecondary) {
		case 'Health':
		case 'Protection':
		case 'Offense': {
			let addSecondaryStats = mod.secondary_stats.filter(
				(ss) => ss.name === currentSecondary
			);
			let add = 0;
			let addPercent = 0;
			addSecondaryStats.forEach((stat) => {
				if (stat.value % 10000 === 0) {
					add += stat.value / 10000;
				} else {
					addPercent += stat.value / 100;
				}
			});
			if (mod.primary_stat.name === currentSecondary) {
				if (mod.primary_stat.value % 10000 === 0) {
					add += mod.primary_stat.value / 10000;
				} else {
					addPercent += mod.primary_stat.value / 100;
				}
			}

			result = baseStat + add + (baseStat * addPercent) / 100;
			break;
		}
		case 'Potency':
		case 'Tenacity':
		case 'Critical Chance': {
			let secondaryStat = mod.secondary_stats.find(
				(ss) => ss.name === currentSecondary
			);
			if (secondaryStat) {
				result = baseStat + secondaryStat.value / 100;
			}
			if (mod.primary_stat.name === currentSecondary) {
				result += mod.primary_stat.value / 100;
			}
			break;
		}
		default: {
			result = 0;
		}
	}
	return result;
}

function isCompleteSets(
	{ mSquare, mArrow, mRomb, mTriangle, mCircle, mCross },
	possibleSets
) {
	const modSets = [
		mArrow.set,
		mCircle.set,
		mCross.set,
		mRomb.set,
		mTriangle.set,
		mSquare.set
	];
	let existSets = [];
	let result = true;
	modSets.forEach((set) => {
		const setCountObj = MOD_OPTIONS.sets.find((mSet) => mSet.id === set);
		const setCount = setCountObj.setCount;
		const setName = setCountObj.name;
		const modSetExistCount = modSets.filter((mss) => mss === set).length;
		if (modSetExistCount % setCount !== 0) {
			result = false;
		} else if (!existSets.some((eSet) => eSet === setName)) {
			existSets.push(setName);
		}
	});
	if (!possibleSets.every((es) => existSets.some((ps) => ps === es))) {
		return false;
	}
	return result;
}

function getSpeed(mods) {
	let speedFromSet = 0;
	let additionalSpeed = mods.reduce((summ, mod) => {
		const addPrimeSpeed =
			mod.primary_stat.name === 'Speed' ? mod.primary_stat.value / 10000 : 0;
		let addSecSpeed = getSecondaryModSpeed(mod);
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

function getSecondarySet(mods, name, secondary) {
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

function getPossibleMods({ mods, blockedHeroes, hero, unit }): IMod[] {
	let resultMods: IMod[] = mods
		.filter(
			(mod) => !blockedHeroes.some((blocked) => blocked === mod.character)
		)
		.filter((mod) =>
			hero.possibleSets.some((pset) => {
				let set = MOD_OPTIONS.sets.find((m) => m.id === mod.set);
				return set.name === pset;
			})
		);
	if (unit.data.gear_level < 12) {
		resultMods = resultMods.filter((mod) => mod.rarity <= 5);
	}
	return resultMods;
}
function getBestMods({ hero, possibleMods, unit }): IBestMods {
	let bestMods: IBestMods | {} = {};
	const forms = getModForms();

	forms.forEach((form, index) => {
		if (form in hero) {
			possibleMods = possibleMods.filter(
				(mod) =>
					mod.slot !== index + 1 ||
					(mod.slot === index + 1 &&
						hero[form].some((spec) => spec === mod.primary_stat.name))
			);
		}

		let temp = possibleMods.filter((mod) => mod.slot === index + 1);
		if (hero.secondary) {
			currentSecondary = hero.secondary;
			currentUnit = unit;
		} else {
			currentSecondary = null;
			currentUnit = null;
		}
		temp.sort(sortBySpeed);
		if (temp.length > 3) {
			temp = cutBestMods(temp);
		}
		bestMods[form] = [...temp];
	});
	return bestMods as IBestMods;
}

function rankMods(units: Unit[], mods: IMod[], baseId: string) {
	const result = [];
	const unit = units.find((unit) => unit.baseId === baseId);
	const unitMods = mods.filter(
		(mod) => mod.character === unit.baseId && mod.slot !== 2 && mod.rarity < 6
	);
	unitMods.forEach((unitMod) => {
		const unitPower = unit.power;
		let possibleMods = mods.filter(
			(mod) =>
				mod.character !== unitMod.character &&
				mod.set === unitMod.set &&
				mod.slot === unitMod.slot &&
				mod.primary_stat.name === unitMod.primary_stat.name &&
				(unitMod.rarity > mod.rarity ||
					(unitMod.rarity === mod.rarity && unitMod.tier >= mod.tier))
		);
		possibleMods = possibleMods.filter((pmod) => {
			const unit = units.find((unit) => unit.baseId === pmod.character);
			return !unit || unit.power <= unitPower * 0.8;
		});

		possibleMods = possibleMods.filter(
			(pMod) => getComparedSpeed(unitMod, pMod) > getSecondaryModSpeed(unitMod)
		);
		if (possibleMods.length > 0) {
			possibleMods.forEach(
				(mod) => (mod.expectedSpeed = getComparedSpeed(unitMod, mod))
			);
			result.push({ parent: unitMod, children: possibleMods });
		}
	});
	return result;
}

function getComparedSpeed(parentMod: IMod, childMod: IMod): number {
	const baseSpeed = getSecondaryModSpeed(childMod);
	if (baseSpeed === 0) {
		return baseSpeed;
	}
	const secondarySpeed = childMod.secondary_stats.find(
		(ss) => ss.name === 'Speed'
	);
	if (childMod.rarity < 5) {
		const updates = 5 - childMod.tier;
		return baseSpeed + updates * 5;
	}
	let updates =
		childMod.rarity === parentMod.rarity
			? parentMod.tier - childMod.tier
			: 5 - childMod.tier + parentMod.tier;
	updates = Math.min(updates, 5 - secondarySpeed.roll);
	const rarityDiff = parentMod.rarity - childMod.rarity;
	return baseSpeed + rarityDiff + updates * 4;
}

function getSecondaryModSpeed(mod: IMod): number {
	let addSecSpeed = 0;
	const addSecSpeedStat = mod.secondary_stats.find((ss) => ss.name === 'Speed');
	if (addSecSpeedStat) {
		addSecSpeed = addSecSpeedStat.value / 10000;
	}
	return addSecSpeed;
}

function sortMods(evalModSets: IModEvaluation[]): IModEvaluation[] {
	return evalModSets.map((set) => {
		return {
			parent: set.parent,
			children: set.children.sort(sortByExpectedSpeed)
		};
	});
}

function sortByExpectedSpeed(first: IMod, second: IMod): number {
	return getSecondaryModSpeed(second) - getSecondaryModSpeed(first) === 0
		? second.tier - first.tier
		: getSecondaryModSpeed(second) - getSecondaryModSpeed(first);
}

async function getBaseIdForModEvolution(
	parameters,
	units: Unit[]
): Promise<string> {
	if (!parameters?.unit || parameters.unit == 0) {
		return null;
	}
	if (parameters.unit >>> 0 === parseFloat(parameters.unit)) {
		const index = parseInt(parameters.unit);
		const realIndex = Math.min(index - 1, units.length - 1);
		return units[realIndex].baseId;
	}
	const unit = units.find(
		(unit) => unit.baseId === parameters.unit.toUpperCase().trim()
	);
	if (unit) {
		return unit.baseId;
	}
	throw new Error(
		'Wrong baseId for unit. You could try find unit by power rank or baseId, for example:\n swr -mue -unit=3\n swr -mue -unit=23\n swr -mue -unit=KYLOREN'
	);
}

function filter5StarModsForColorUp(mods: IMod[]): IMod[] {
	let colorUpMods: IMod[] = mods.filter(
		(mod) => mod.rarity === 5 && mod.slot !== 2
	);
	const colorUpMods5 = colorUpMods.filter((mod) => {
		const minSpeed = MOD_OPTIONS.speedForUpgrade[mod.tier];
		return mod.secondary_stats.some(
			(second) => second.name === 'Speed' && second.value / 10000 > minSpeed
		);
	});
	return colorUpMods5.sort(Sorter.sortByTier);
}

function filter6StarModsForColorUp(mods: IMod[]): IMod[] {
	const colorUpMods6 = mods.filter(
		(mod) =>
			mod.rarity > 5 &&
			mod.slot !== 2 &&
			mod.secondary_stats.some(
				(secondary) =>
					secondary.name === 'Speed' &&
					((secondary.roll <= 4 && secondary.value >= 200000 && mod.tier < 4) ||
						(secondary.roll <= 3 && secondary.value >= 160000 && mod.tier < 3))
			)
	);
	return colorUpMods6.sort(Sorter.sortByTier);
}
