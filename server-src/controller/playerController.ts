import {
	ILegendPlayerProgress,
	ILegendPlayerProgressArchiv,
	ILegendProgress,
	ILegendRequirements,
	ILegendReqUnit,
	IReqUnits
} from '../@types/IGuild';
import { IUnit } from '../@types/IUnit';
import { IMod } from '../@types/IMod';

import { LEGEND } from '../@const/legendRequirements';

import { fetchDataService } from '../service/fetchDataService';
import { readWriteService } from '../service/readWriteService';
import { DateHelper } from '../helper/dateHelper';

export const playerController = {
	getLegendProgress: async function (id: string): Promise<ILegendProgress[]> {
		let result: ILegendProgress[] = [];
		let units: IUnit[] = (await fetchDataService.getPlayer(id)).units;
		const mods: IMod[] = await fetchDataService.getAllMods(id);
		const lastWeekDataPlayer = await getLastWeekPlayerData(id);
		LEGEND.forEach((legend) => {
			if (isExist(legend.name, units)) {
				result.push({
					legend_name: legend.name,
					display_data: {
						display_status: 'EXIST',
						sorting_data: 101,
						last_week_add: 0
					}
				});
			} else {
				let unitProgress: ILegendReqUnit[] = [];
				legend.req_units.forEach((reqUnit): void => {
					const playerUnit: IUnit | undefined =
						units &&
						units.find((unit) => unit.data.base_id === reqUnit.base_id);
					if (playerUnit) {
						if (isComplete(playerUnit, reqUnit)) {
							unitProgress.push({
								base_id: reqUnit.base_id,
								isComplete: true,
								need_power: reqUnit.power,
								current_power: reqUnit.power,
								previous_power: getLastWeekData(
									lastWeekDataPlayer,
									legend,
									reqUnit.base_id
								)
							});
						} else {
							unitProgress.push({
								base_id: reqUnit.base_id,
								isComplete: false,
								need_power: reqUnit.power,
								current_power: playerUnit.data.power,
								previous_power: getLastWeekData(
									lastWeekDataPlayer,
									legend,
									reqUnit.base_id
								)
							});
						}
					} else {
						unitProgress.push({
							base_id: reqUnit.base_id,
							isComplete: false,
							need_power: reqUnit.power,
							current_power: 0,
							previous_power: 0
						});
					}
				});
				let progress: number = unitProgress.reduce(
					(sum: number, unit: ILegendReqUnit) => {
						return sum + getCorrectedPower(unit, units, mods, legend.req_units);
					},
					0
				);
				let maximum: number = legend.req_units.reduce(
					(sum: number, rUnit) => sum + rUnit.power,
					0
				);
				let playerLegendProgress: number = Math.round(
					(progress / maximum) * 100
				);
				result.push({
					legend_name: legend.name,
					display_data: {
						display_status: '' + playerLegendProgress + '%',
						sorting_data: playerLegendProgress,
						last_week_add:
							playerLegendProgress -
							getLastWeekProgress(lastWeekDataPlayer, legend)
					},
					data: unitProgress
				});
			}
		});
		await playerController.saveLegendProgress(id, result);
		return result;
	},
	saveLegendProgress: async function (id: string, data: ILegendProgress[]) {
		let playerArchiveData: ILegendPlayerProgressArchiv[];
		try {
			const playerArchiveDataResp: string = await readWriteService.readJson(
				`arch/players/lp/${id}.json`
			);
			playerArchiveData = await JSON.parse(playerArchiveDataResp);
		} catch (e) {
			playerArchiveData = [];
		}
		if (playerArchiveData.length > 0 && isTodayDataExist(playerArchiveData)) {
			let todayData = playerArchiveData.find(
				(entry) =>
					entry.year === DateHelper.getYear() &&
					entry.month === DateHelper.getMonth() &&
					entry.day === DateHelper.getDate()
			);
			todayData.legend_progress = data;
		} else {
			playerArchiveData.push({
				month: DateHelper.getMonth(),
				day: DateHelper.getDate(),
				year: DateHelper.getYear(),
				legend_progress: data
			});
		}
		await readWriteService.saveJson(
			playerArchiveData,
			`arch/players/lp/${id}.json`
		);
	},
	check: async function (id: string) {
		let player = await fetchDataService.getPlayer(id);
		if (player.data && player.data.name) {
		} else {
			player.data = {
				name: player.detail
			};
		}
		return player.data.name;
	}
};

function isExist(name: string, units: IUnit[]) {
	return units && units.some((unit: IUnit) => unit.data.base_id === name);
}
function isComplete(playerUnit: IUnit, unit: IReqUnits) {
	return (
		playerUnit.data.relic_tier - 2 === unit.relic ||
		playerUnit.data.rarity === unit.rarity
	);
}

function getCorrectedPower(
	unit: ILegendReqUnit,
	playerUnits: IUnit[],
	mods: IMod[],
	reqUnits: IReqUnits[]
) {
	if (unit.isComplete || unit.current_power === 0) {
		return unit.current_power;
	}
	let playerUnit = playerUnits.find(
		(pUnit) => pUnit.data.base_id === unit.base_id
	);
	if (!playerUnit) {
		return 0;
	}
	if (playerUnit.data.combat_type === 1) {
		const unitMods = mods.filter((mod) => mod.character === unit.base_id)
			.length;
		const modsPower = 750 * unitMods;
		return Math.min(unit.current_power - modsPower, unit.need_power * 0.99);
	}
	let reqUnit = reqUnits.find((rUnit) => rUnit.base_id === unit.base_id);
	return Math.min(
		(unit.current_power * playerUnit.data.rarity) / reqUnit.rarity,
		unit.current_power
	);
}

function getLastWeekData(
	lastWeekData: ILegendPlayerProgress,
	legend: ILegendRequirements,
	base_id: string
): number {
	if (!lastWeekData) {
		return 0;
	}
	let index: number = legend.name === 'SUPREMELEADERKYLOREN' ? 0 : 1;
	let unit = lastWeekData.legend_progress[index].data.find(
		(unit) => unit.base_id === base_id
	);
	return unit ? unit.current_power : 0;
}

function getLastWeekProgress(lastWeekDataPlayer, legend) {
	if (!lastWeekDataPlayer) {
		return 0;
	}
	let index: number = legend.name === 'SUPREMELEADERKYLOREN' ? 0 : 1;
	return lastWeekDataPlayer.legend_progress[index].display_data.sorting_data;
}

export async function getLastWeekPlayerData(
	id: string
): Promise<ILegendPlayerProgress> {
	try {
		const playerDataResp: string = await readWriteService.readJson(
			`arch/players/lp/${id}.json`
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
		return null;
	}
}

function isTodayDataExist(data: ILegendPlayerProgressArchiv[]): boolean {
	const currentDate = DateHelper.getDate();
	const currentMonth = DateHelper.getMonth();
	return (
		data[data.length - 1].month === currentMonth &&
		data[data.length - 1].day === currentDate
	);
}
