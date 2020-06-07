import { BRAZZERS } from '../@const/brazzers';
import {
	ILegendPlayerProgress,
	ILegendProgress,
	ILegendRequirements,
	ILegendReqUnit,
	IReqUnits
} from '../@types/IGuild';
import { IUnit } from '../@types/IUnit';
import { fetchDataService } from '../service/fetchDataService';
import { IMod } from '../@types/IMod';
import { LEGEND } from '../@const/legendRequirements';
import { readWriteService } from '../service/readWriteService';

export const playerController = {
	getLegendProgress: async function (id: string): Promise<ILegendProgress[]> {
		// @ts-ignore: Object is possibly 'null'.
		const playerName =
			BRAZZERS.find((member) => member.id.toString() === id).name || '';
		let result: ILegendProgress[] = [];
		let units: IUnit[] = (await fetchDataService.getPlayer(id)).units;
		const mods: IMod[] = await fetchDataService.getAllMods(id);
		let lastWeek = await readWriteService.readJson('brazzersLast.json');
		let lastWeekDataPlayers: ILegendPlayerProgress[] = await JSON.parse(
			lastWeek
		);
		let lastWeekDataPlayer = lastWeekDataPlayers.find(
			(player) => player.player_name === playerName
		);
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
					const playerUnit: IUnit | undefined = units.find(
						(unit) => unit.data.base_id === reqUnit.base_id
					);
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
		return result;
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
	return units.some((unit: IUnit) => unit.data.base_id === name);
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
