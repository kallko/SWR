import {fetchDataService} from '../service/fetchDataService'
import {IMod} from "../@types/IMod";
import {MOD_OPTIONS} from "../@const/modOptions";
import {Sorter} from "../helper/sorter";

export const modController = {
    get(field: string): string {
        if (!field) {
            throw new Error('field for config not specified');
        }
        return 'ok'
    },
    async getColorUpMods(id: number = 621723826): Promise<IMod[]> {
        let playerMods: IMod[] = await fetchDataService.getAllMods(id);
        let colorUpMods: IMod [] = playerMods.filter(mod => mod.rarity === 5 && mod.slot !== 2)
        colorUpMods = colorUpMods.filter(mod =>  {
            const minSpeed = MOD_OPTIONS.speedForUpgrade[mod.tier];
            return mod.secondary_stats.some(second => second.name === 'Speed' && second.value / 10000 > minSpeed);
        });
        colorUpMods.sort(Sorter.sortByTier);
        return colorUpMods;
    }
};


