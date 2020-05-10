import {IMod} from "../@types/IMod";

export const Sorter = {
    sortByTier(first: IMod, second: IMod): number {
    return second.tier - first.tier;
    },
    sortByProgress(first: any, second: any): number {
        return second.sort - first.sort;
    }
}
