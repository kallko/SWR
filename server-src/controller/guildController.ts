import { BRAZZERS } from '../@const/brazzers';
import { readWriteService } from '../service/readWriteService';
import {
	IGuild,
	ILegendPlayerProgress,
	ILegendProgress
} from '../@types/IGuild';
import { Transformer } from '../helper/transformer';
import { playerController } from './playerController';
import {IFrontLegendTable} from "../@types/IFrontEnd";

export const guildController = {
	getLegendProgress: async function (): Promise<IFrontLegendTable[][]> {
		let guildResult: ILegendPlayerProgress[] = [];
		//todo for testing
		let test: number = 3;
		let players: number = Math.min(test, BRAZZERS.length);

		for (let i: number = 0; i < players; i++) {
			let result: ILegendProgress[] = await playerController.getLegendProgress(
				BRAZZERS[i].id
			);
			guildResult.push({
				player_name: BRAZZERS[i].name,
				legend_progress: result
			});
		}
		const fileName: string =
			'arch/braz' +
			new Date().getDate().toLocaleString() +
			'.' +
			(new Date().getMonth() + 1) +
			'.json';
		console.log('filename ', fileName);
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
