import { readWriteService } from '../service/readWriteService';
import {ILegendPlayerProgress} from "../@types/IGuild";

export const Comparer = {
	async compareGuildLegendWeekProgress(freshGuild: ILegendPlayerProgress[]): Promise<ILegendPlayerProgress[]> {
		let oldGuildString: string = await readWriteService.readJson('arch/braz12.5.json');
		let oldGuild: ILegendPlayerProgress[] = await JSON.parse(oldGuildString);
		console.log(' OldGuild ', JSON.stringify(oldGuild[0]));
		freshGuild.forEach((freshMember: ILegendPlayerProgress) => {
			let oldMember = oldGuild.find(
				(oldMember: ILegendPlayerProgress) => oldMember.player_name === freshMember.player_name
			);
			let kDiff =
				freshMember.legend_progress[0].display_data.sorting_data -
				oldMember.legend_progress[0].display_data.sorting_data;
			freshMember.legend_progress[0].display_data.last_week_add = kDiff;
			let rDiff =
				freshMember.legend_progress[1].display_data.sorting_data -
				oldMember.legend_progress[1].display_data.sorting_data;
            freshMember.legend_progress[1].display_data.last_week_add = rDiff;
			console.log(
				freshMember.player_name,
				' KPROGRESS ',
				freshMember.legend_progress[0].display_data.sorting_data,
				kDiff,
				' RPROGRESS ',
				freshMember.legend_progress[1].display_data.sorting_data,
				rDiff
			);
		});
		return freshGuild;
	}
};
