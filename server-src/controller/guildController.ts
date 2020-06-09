import { IFrontLegendTable } from '../@types/IFrontEnd';
import {
	IGuild,
	ILegendPlayerProgress,
	ILegendProgress
} from '../@types/IGuild';
import { BRAZZERS } from '../@const/brazzers';

import { readWriteService } from '../service/readWriteService';

import { playerController } from './playerController';

import { Transformer } from '../helper/transformer';
import { DateHelper } from '../helper/dateHelper';

export const guildController = {
	getLegendProgress: async function (): Promise<IFrontLegendTable[][]> {
		let guildResult: ILegendPlayerProgress[] = [];
		const test: number = process.env.NODE_ENV === 'PRODUCTION' ? 300 : 3;
		const players: number = Math.min(test, BRAZZERS.length);

		for (let i: number = 0; i < players; i++) {
			const result: ILegendProgress[] = await playerController.getLegendProgress(
				BRAZZERS[i].id.toString()
			);
			guildResult.push({
				player_name: BRAZZERS[i].name,
				legend_progress: result
			});
		}
		const fileName: string =
			'arch/braz' +
			DateHelper.getDate() +
			'.' +
			DateHelper.getMonth() +
			'.json';
		readWriteService.saveLegendProgressForGuild(guildResult, fileName);
		readWriteService.saveLegendProgressForGuild(
			guildResult,
			'brazzersLast.json'
		);
		return Transformer.transformLegendProgress(guildResult);
	},
	getGuild: function (): IGuild[] {
		return BRAZZERS;
	}
};
