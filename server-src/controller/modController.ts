import { fetchDataService } from '../service/fetchDataService';
import { IMod } from '../@types/IMod';
import { IFrontColorUpMod } from '../@types/IFrontEnd';
import { MOD_OPTIONS } from '../@const/modOptions';
import { Sorter } from '../helper/sorter';
import { Transformer } from '../helper/transformer';

export const modController = {
	async getColorUpMods(id: string = '452867287'): Promise<IFrontColorUpMod[]> {
		console.log('Point0');
		let playerMods: IMod[] = await fetchDataService.getAllMods(id);
		console.log('Point0.5');

		let colorUpMods: IMod[] = playerMods.filter(
			(mod) => mod.rarity === 5 && mod.slot !== 2
		);
		console.log('Point0.7');

		colorUpMods = colorUpMods.filter((mod) => {
			const minSpeed = MOD_OPTIONS.speedForUpgrade[mod.tier];
			return mod.secondary_stats.some(
				(second) => second.name === 'Speed' && second.value / 10000 > minSpeed
			);
		});
		console.log('Point1');
		colorUpMods.sort(Sorter.sortByTier);
		console.log('Point2');

		return Transformer.transformColorUpMods(colorUpMods);
	}
};
