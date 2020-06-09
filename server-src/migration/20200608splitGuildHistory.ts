import {
	ILegendPlayerProgressArchiv,
	ILegendPlayerProgress
} from '../@types/IGuild';

import { BRAZZERS } from '../@const/brazzers';

import { readWriteService } from '../service/readWriteService';

export const splitGuildHistory = {
	run: async function (): Promise<void> {
		const files: string[] = await readWriteService.readDirAsync('./files/arch');
		const guildResult: {
			name: string;
			id: number;
			data: ILegendPlayerProgressArchiv[];
		}[] = [];
		for (let i: number = 0; i < files.length; i++) {
			if (files[i].indexOf('braz') === 0) {
				const playersResp = await readWriteService.readJson(`arch/${files[i]}`);
				const players: ILegendPlayerProgress[] = await JSON.parse(playersResp);
				const dataDateString = files[i]
					.replace('braz', '')
					.replace('.json', '');
				const dataDate = dataDateString.split('.');
				BRAZZERS.forEach((braz) => {
					if (!guildResult[braz.name]) {
						guildResult[braz.name] = { name: braz.name, id: braz.id, data: [] };
					}
					const player = players.find(
						(player) => player.player_name === braz.name
					);
					if (player) {
						guildResult[braz.name].data.push({
							month: parseInt(dataDate[1]),
							day: parseInt(dataDate[0]),
							year: 2020,
							legend_progress: player.legend_progress
						});
					}
				});
			}
		}
		for (let key in guildResult) {
			let playerData = guildResult[key].data;
			playerData.sort(sortByCustomDate);
			await readWriteService.saveJson(
				playerData,
				`arch/players/lp/${guildResult[key].id}.json`
			);
		}
	}
};

function sortByCustomDate(
	first: ILegendPlayerProgressArchiv,
	second: ILegendPlayerProgressArchiv
) {
	return first.month === second.month
		? first.day - second.day
		: first.month - second.month;
}
