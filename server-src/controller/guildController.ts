import { IFrontLegendTable } from '../@types/IFrontEnd';
import {
	IGuild,
	ILegendPlayerProgress,
	ILegendProgress
} from '../@types/IGuild';

import { fetchDataService } from '../service/fetchDataService';

import { playerController } from './playerController';

import { Transformer } from '../helper/transformer';

export const guildController = {
	getLegendProgress: async function (
		allyCode: number
	): Promise<IFrontLegendTable[][]> {
		let guildResult: ILegendPlayerProgress[] = [];
		const test: number = process.env.NODE_ENV === 'PRODUCTION' ? 300 : 3;
		const guild: IGuild = await fetchDataService.getGuildPlayersCode(allyCode);
		const players: number = Math.min(test, guild.members.length);

		for (let i: number = 0; i < players; i++) {
			const result: ILegendProgress[] = await playerController.getLegendProgress(
				guild.members[i].id.toString()
			);
			guildResult.push({
				player_name: guild.members[i].name,
				legend_progress: result
			});
		}

		return Transformer.transformLegendProgress(guildResult);
	},
	getGuildAll: async function (allyCode: number): Promise<IGuild> {
		return await fetchDataService.getGuildPlayersCode(allyCode);
	}
};
