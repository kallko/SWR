import * as moment from 'moment';
import * as lodash from 'lodash';

import {
	ILegendPlayerProgress,
	ILegendPlayerProgressArchiv,
	ILegendProgress
} from '../@types/IGuild';
import { IImportUnit } from '../@types/IUnit';
import { IMod } from '../@types/IMod';

import { fetchDataService } from '../service/fetchDataService';
import { readWriteService } from '../service/readWriteService';
import { DateHelper } from '../helper/dateHelper';
import { LegendService } from '../service/LegendService';
import { LegendRequirementsService } from '../service/LegendRequirementsService';
import { Unit, LegendRequirements, LegendProgress } from '../service/dbModels';
import { UnitService } from '../service/UnitService';
let LEGEND_REQUIREMENTS: LegendRequirements[];
(async function f() {
	LEGEND_REQUIREMENTS = await LegendRequirementsService.getAll();
})();

export const playerController = {
	updatePlayerUnits: async function (
		allyCode: number,
		forceUpdate: boolean = false
	): Promise<boolean> {
		if (forceUpdate || (await isPlayerUnitsNeedUpdate(allyCode))) {
			const units: IImportUnit[] = (await fetchDataService.getPlayer(allyCode))
				.units;
			for (let i: number = 0; i < units.length; i++) {
				await UnitService.createOrUpdate(allyCode, units[i]);
			}
			return true;
		}
		return false;
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
		await UnitService.getPlayerUnitsByBaseId(allyCode, legendsBaseIds);
		const units: Unit[] = await UnitService.getAllPlayerUnits(allyCode);
		//todo update mods
		const mods: IMod[] = await fetchDataService.getAllMods(allyCode);
		const progress: {
			createdAt: Date;
		} = await LegendService.getDateForWeekUpdate(allyCode);
		if (progress?.createdAt) {
			const lastWeekProgress: LegendProgress[] = await LegendService.getUnitsCreatedInTenSecondsInterval(
				allyCode,
				progress.createdAt
			);
			legendsBaseIds.forEach((legendBaseId) => {
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
					result.push({
						//todo take name no baseId
						legend_name: legendBaseId,
						display_data: {
							display_status: '' + progress + '%',
							sorting_data: progress,
							last_week_add:
								progress -
								getLegendProgress(
									unitsForThisLegend,
									(lastWeekProgress as any) as Unit[],
									mods
								)
						}
					});
				}
			});
		}
		return result;
	},
	check: async function (allyCode: number) {
		let player = await fetchDataService.getPlayer(allyCode);
		if (player.data && player.data.name) {
		} else {
			player.data = {
				name: player.detail
			};
		}
		return player.data.name;
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
		unit.relic - 2 === legendUnit.relic ||
		(legendUnit.ship && legendUnit.rarity === unit.rarity)
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

export async function getLastWeekPlayerData(
	allyCode: number
): Promise<ILegendPlayerProgress> {
	try {
		const playerDataResp: string = await readWriteService.readJson(
			`arch/players/lp/${allyCode}.json`
		);
		const playerData: ILegendPlayerProgressArchiv[] = await JSON.parse(
			playerDataResp
		);
		const currentDate = DateHelper.getDate();
		const currentMonth = DateHelper.getMonth();
		const result = playerData
			.reverse()
			.find(
				(entry) =>
					DateHelper.getDayDiff(
						currentDate,
						currentMonth,
						entry.day,
						entry.month
					) >= 7
			);
		return result || playerData[0];
	} catch (e) {
		console.error('getLastWeekPlayerData', e);
		return null;
	}
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
