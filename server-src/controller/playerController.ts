import * as moment from 'moment';
import * as lodash from 'lodash';

import { ILegendProgress } from '../@types/IGuild';
import { IImportUnit } from '../@types/IUnit';
import { IMod } from '../@types/IMod';

import { fetchDataService } from '../service/fetchDataService';
import { LegendService } from '../service/LegendService';
import { LegendRequirementsService } from '../service/LegendRequirementsService';
import { Unit, LegendRequirements, LegendProgress } from '../service/dbModels';
import { UnitService } from '../service/UnitService';
import { IPlayer } from '../@types/IPlayer';
import { userService } from '../service/UserService';

let LEGEND_REQUIREMENTS: LegendRequirements[];
if (process.env.NODE_ENV !== 'TEST') {
	(async function f() {
		LEGEND_REQUIREMENTS = await LegendRequirementsService.getAll();
	})();
}

export const playerController = {
	getPlayer: async function (allyCode: number): Promise<IPlayer> {
		let player = await fetchDataService.getPlayer(allyCode);
		if (!player.data) {
			player = await fetchDataService.getPlayer2(allyCode);
		}
		return player;
	},
	updatePlayerUnits: async function (
		allyCode: number,
		forceUpdate: boolean = false
	): Promise<boolean> {
		let player: IPlayer;
		if (forceUpdate || (await isPlayerUnitsNeedUpdate(allyCode))) {
			player = await playerController.getPlayer(allyCode);
			if (player) {
				const units: IImportUnit[] = player.units;
				for (let i: number = 0; i < units.length; i++) {
					await UnitService.createOrUpdate(allyCode, units[i]);
				}
			}
		}
		return !!player?.units[0]?.data?.stats;
	},
	getLegendProgress: async function (
		allyCode: number
	): Promise<ILegendProgress[]> {
		const unitsForLegends: LegendRequirements[] = await LegendService.getUnitsForLegends();
		const legendsBaseIds: string[] = Object.keys(
			lodash.groupBy(unitsForLegends, 'name')
		);
		let result: ILegendProgress[] = [];
		if (await isPlayerUnitsNeedUpdate(allyCode)) {
			await playerController.updatePlayerUnits(allyCode, true);
		}
		const units: Unit[] = await UnitService.getAllPlayerUnits(allyCode);
		await playerController.saveLegendProgress(allyCode);
		//todo update mods
		const mods: IMod[] = await fetchDataService.getAllMods(allyCode);
		for (const legendBaseId of legendsBaseIds) {
			const history: {
				createdAt: Date;
			} = await LegendService.getDateFromPastInterval(
				allyCode,
				7,
				legendBaseId
			);
			if (isLegendExist(legendBaseId, units)) {
				result.push({
					//todo take name no baseId
					legend_name: legendBaseId,
					display_data: {
						display_status: 'EXIST',
						sorting_data: 101,
						last_week_add: 0
					}
				});
			} else {
				const unitsForThisLegend = unitsForLegends.filter(
					(unitForLegend) => unitForLegend.name === legendBaseId
				);
				const progress: number = getLegendProgress(
					unitsForThisLegend,
					units,
					mods
				);
				const progressLastWeek = history?.createdAt
					? await getLegendProgressByInterval(legendBaseId, 7, allyCode, mods)
					: progress;
				result.push({
					//todo take name no baseId
					legend_name: legendBaseId,
					display_data: {
						display_status: '' + progress + '%',
						sorting_data: progress,
						last_week_add: progress - progressLastWeek,
						estimated_date:
							history?.createdAt && progress !== progress - progressLastWeek
								? await getEstimatedDate(
										legendBaseId,
										30,
										allyCode,
										mods,
										progress
								  )
								: moment('1990-01-01').toDate()
					}
				});
			}
		}
		return result;
	},
	check: async function (allyCode: number) {
		let player = await fetchDataService.getPlayer(allyCode);
		return player?.data?.name || player.detail;
	},
	async saveLegendProgress(allyCode: number): Promise<boolean> {
		const user = await userService.getUserByAllyCode({ allyCode });
		if (user) {
			const legendNames = await LegendService.getLegendNames();
			const existLegends = await UnitService.getPlayerUnitsByBaseId(
				allyCode,
				legendNames.map((legend) => legend.name)
			);

			let legendBaseIds: string[] = LEGEND_REQUIREMENTS.map((unit) => {
				if (!existLegends.some((legend) => legend.baseId === unit.name)) {
					return unit.baseId;
				}
			}).filter((unit) => unit);
			let freshLegendUnits = await UnitService.getPlayerUnitsByBaseId(
				allyCode,
				legendBaseIds
			);
			const createdAt: Date = new Date();
			createdAt.setHours(0, 0, 0, 0);
			for (let i: number = 0; i < legendBaseIds.length; i++) {
				const existUnit = freshLegendUnits.find(
					(unit) => unit.baseId === legendBaseIds[i]
				);
				const legendUnit = LEGEND_REQUIREMENTS.find(
					(lUnit) => lUnit.baseId === legendBaseIds[i]
				);
				await LegendService.createOrUpdate({
					baseId: legendBaseIds[i],
					power: existUnit?.power || 0,
					relic: existUnit?.relic || null,
					ship: existUnit?.combatType === 2 || null,
					rarity: existUnit?.rarity || null,
					createdAt: createdAt,
					allyCode: allyCode,
					isComplete: existUnit?.isComplete || isComplete(legendUnit, existUnit)
				});
			}
			return true;
		}
	},
	async getArenaUnitsSwapi(allyCode: number): Promise<string[]> {
		const player = await fetchDataService.getPlayerFromSWAPI(allyCode);
		return player[0].arena.char.squad.map((unit) => unit.defId);
	},
	async getArenaUnits(allyCode: number): Promise<string[]> {
		const player = await fetchDataService.getPlayer(allyCode);
		return player.data.arena.members;
	}
};

function isLegendExist(legendBaseId: string, units: Unit[]) {
	return (
		legendBaseId &&
		units &&
		units.some((unit: Unit) => unit.baseId === legendBaseId)
	);
}
function isComplete(legendUnit: LegendRequirements, unit: Unit) {
	return (
		unit &&
		(unit.relic - 2 >= legendUnit.relic ||
			(legendUnit.ship && legendUnit.rarity >= unit.rarity))
	);
}

function getCorrectedPower(
	legendUnit: LegendRequirements,
	unit: Unit,
	mods: IMod[]
): number {
	if (!unit || unit.power === 0) {
		return 0;
	}
	if (unit.isComplete || isComplete(legendUnit, unit)) {
		return legendUnit.power;
	}
	if (!legendUnit.ship) {
		const unitMods = mods.filter((mod) => mod.character === unit.baseId).length;
		const modsPower = 750 * unitMods;
		return Math.min(unit.power - modsPower, legendUnit.power * 0.99);
	}
	const rarity = unit.rarity || 4;
	return Math.floor((legendUnit.power * rarity) / legendUnit.rarity);
}

export async function isPlayerUnitsNeedUpdate(
	allyCode: number
): Promise<boolean> {
	const unit: Unit = await UnitService.getPlayerUnit(allyCode);
	return !unit || moment(new Date()).diff(unit.updatedAt, 'days') > 1;
}

export function getLegendProgress(
	legendUnits: LegendRequirements[],
	units: Unit[],
	mods: IMod[]
): number {
	let power = legendUnits.reduce((sum, lUnit) => {
		const unit: Unit = units.find((playerUnit: Unit) => {
			return playerUnit.baseId === lUnit.baseId;
		});
		return sum + getCorrectedPower(lUnit, unit, mods);
	}, 0);
	let needPower = legendUnits.reduce((sum, unit) => sum + unit.power, 0);
	return Math.round((power * 100) / needPower);
}

export async function getLegendProgressByInterval(
	legendBaseId: string,
	interval: number,
	allyCode: number,
	mods: IMod[]
): Promise<number> {
	const unitsForLegend = await LegendService.getUnitsForLegendsByName(
		legendBaseId
	);
	const date: {
		createdAt: Date;
	} = await LegendService.getDateFromPastInterval(
		allyCode,
		interval,
		legendBaseId
	);
	const pastUnits: LegendProgress[] = await LegendService.getUnitsCreatedInTenSecondsInterval(
		allyCode,
		date.createdAt
	);
	return getLegendProgress(unitsForLegend, (pastUnits as any) as Unit[], mods);
}

export async function getEstimatedDate(
	legendBaseId: string,
	interval: number,
	allyCode: number,
	mods: IMod[],
	currentProgress: number
): Promise<Date> {
	let result;
	let date: {
		createdAt: Date;
	} = await LegendService.getDateFromPastInterval(
		allyCode,
		interval,
		legendBaseId
	);
	let diffDays: number = date
		? moment(new Date()).diff(moment(date.createdAt), 'days')
		: 0;
	if (diffDays < 30) {
		interval = diffDays;
		date = await LegendService.getDateFromPastInterval(
			allyCode,
			interval,
			legendBaseId
		);
		diffDays = date
			? moment(new Date()).diff(moment(date.createdAt), 'days')
			: 0;
	}
	const progress = await getLegendProgressByInterval(
		legendBaseId,
		interval,
		allyCode,
		mods
	);
	if (currentProgress === 100) {
		result = moment().add(11, 'day');
	} else {
		if (diffDays < 7) {
			result = moment('1980-01-01');
		} else {
			const averageDayProgress = (currentProgress - progress) / diffDays;
			if (averageDayProgress === 0) {
				result = moment('1970-01-01');
			} else {
				const dayToFinish =
					11 + Math.round((100 - currentProgress) / averageDayProgress);
				result = moment().add(dayToFinish, 'day');
			}
		}
	}
	return result;
}
