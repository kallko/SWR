import { IFrontLegendTable, IFrontColorUpMod } from '../@types/IFrontEnd';
import { ILegendPlayerProgress } from '../@types/IGuild';
import { IMod } from '../@types/IMod';
import { Sorter } from './sorter';
import { IUnitSQLCreationAttributes } from '../service/dbModels';
import { IUnit } from '../@types/IUnit';

export const Transformer = {
	transformColorUpMods(mods: IMod[]): IFrontColorUpMod[] {
		return mods.map((mod: IMod) => {
			return {
				character: mod.character,
				slot: mod.slot
			};
		});
	},
	transformLegendProgress(
		legendPlayerProgresses: ILegendPlayerProgress[]
	): IFrontLegendTable[][] {
		const tableKylo: IFrontLegendTable[] = legendPlayerProgresses.map(
			(progress) => {
				return {
					player: progress.player_name,
					sort: progress.legend_progress[0].display_data.sorting_data,
					display: progress.legend_progress[0].display_data.display_status
				};
			}
		);
		const tableRey: IFrontLegendTable[] = legendPlayerProgresses.map(
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
	},
	fromGameToSQLDB(unit: IUnit, allyCode: number): IUnitSQLCreationAttributes {
		return {
			allyCode,
			baseId: unit.data.base_id,
			power: unit.data.power,
			relic: unit.data.relic_tier,
			combatType: unit.data.combat_type,
			gearLevel: unit.data.gear_level,
			name: unit.data.name,
			level: unit.data.level,
			rarity: unit.data.rarity,
			health: unit.data.stats['1'],
			speed: unit.data.stats['5'],
			damage: unit.data.stats['6'],
			damageSpecial: unit.data.stats['7'],
			defense: +unit.data.stats['8'].toFixed(1),
			criticalChance: +unit.data.stats['14'].toFixed(2),
			criticalChanceSpecial: +unit.data.stats['15'].toFixed(2),
			criticalDamage: unit.data.stats['16'] * 100,
			potency: unit.data.stats['17'] * 100,
			tenacity: unit.data.stats['18'] * 100,
			protection: unit.data.stats['28'],
			updatedAt: new Date()
		};
	}
};
