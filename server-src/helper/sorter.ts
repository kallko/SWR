import { IMod } from '../@types/IMod';
import {IFrontLegendTable} from "../@types/IFrontEnd";

export const Sorter = {
	sortByTier(first: IMod, second: IMod): number {
		return second.tier - first.tier;
	},
	sortByProgress(first: IFrontLegendTable, second: IFrontLegendTable): number {
		return second.sort - first.sort;
	}
};
