import { IFrontLegendTable, IFrontColorUpMod } from '../@types/IFrontEnd';
import { ILegendPlayerProgress } from '../@types/IGuild';
import { IMod } from '../@types/IMod';
import { Sorter } from './sorter';

export const Transformer = {
	transformColorUpMods(mods: IMod[]): IFrontColorUpMod[] {
		return mods.map((mod: IMod) => {
			return {
				col1: mod.character,
				col2: mod.slot
			};
		});
	},
	transformLegendProgress(
		legendPlayerProgresses: ILegendPlayerProgress[]
	): IFrontLegendTable[][] {
		let tableKylo: IFrontLegendTable[] = legendPlayerProgresses.map(
			(progress) => {
				return {
					player: progress.player_name,
					sort: progress.legend_progress[0].display_data.sorting_data,
					display: progress.legend_progress[0].display_data.display_status
				};
			}
		);
		let tableRey: IFrontLegendTable[] = legendPlayerProgresses.map(
			(progress) => {
				return {
					player: progress.player_name,
					sort: progress.legend_progress[1].display_data.sorting_data,
					display: progress.legend_progress[1].display_data.display_status
				};
			}
		);
		tableKylo.sort(Sorter.sortByProgress);
		tableRey.sort(Sorter.sortByProgress);
		return [tableKylo, tableRey];
	}
};
