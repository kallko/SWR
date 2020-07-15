import { fetchDataService } from '../service/fetchDataService';
import { IMod } from '../@types/IMod';
import { IFrontColorUpMod } from '../@types/IFrontEnd';
import { MOD_OPTIONS } from '../@const/modOptions';
import { Sorter } from '../helper/sorter';
import { Transformer } from '../helper/transformer';

export const modController = {
	async getColorUpMods(id: number ): Promise<IFrontColorUpMod[]> {
		const playerMods: IMod[] = await fetchDataService.getAllMods(id);
		let colorUpMods: IMod[] = playerMods.filter(
			(mod) => mod.rarity === 5 && mod.slot !== 2
		);
		colorUpMods = colorUpMods.filter((mod) => {
			const minSpeed = MOD_OPTIONS.speedForUpgrade[mod.tier];
			return mod.secondary_stats.some(
				(second) => second.name === 'Speed' && second.value / 10000 > minSpeed
			);
		});
		colorUpMods.sort(Sorter.sortByTier);

		return Transformer.transformColorUpMods(colorUpMods);
	}
};
