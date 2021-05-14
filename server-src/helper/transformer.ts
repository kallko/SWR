import { IFrontLegendTable, IFrontColorUpMod } from '../@types/IFrontEnd';
import { ILegendPlayerProgress } from '../@types/IGuild';
import { IMod } from '../@types/IMod';
import { Sorter } from './sorter';
import { IUnitSQLCreationAttributes } from '../service/dbModels';
import { IImportUnit } from '../@types/IUnit';

export const Transformer = {
	transformColorUpMods(mods: IMod[]): IFrontColorUpMod[] {
		return mods.map((mod: IMod) => {
			return {
				character: mod.character,
				slot: mod.slot,
				rarity: mod.rarity
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
		const tablePalp: IFrontLegendTable[] = legendPlayerProgresses.map(
			(progress) => {
				return {
					player: progress.player_name,
					sort: progress.legend_progress[2].display_data.sorting_data,
					display: progress.legend_progress[2].display_data.display_status
				};
			}
		);
		const tableLuke: IFrontLegendTable[] = legendPlayerProgresses.map(
			(progress) => {
				return {
					player: progress.player_name,
					sort: progress.legend_progress[3].display_data.sorting_data,
					display: progress.legend_progress[3].display_data.display_status
				};
			}
		);
		tableKylo.sort(Sorter.sortByProgress);
		tableRey.sort(Sorter.sortByProgress);
		tablePalp.sort(Sorter.sortByProgress);
		tableLuke.sort(Sorter.sortByProgress);
		return [tableKylo, tableRey, tablePalp, tableLuke];
	},
	fromGameToSQLDB(
		unit: IImportUnit,
		allyCode: number
	): IUnitSQLCreationAttributes {
		return {
			allyCode,
			baseId: unit.data.base_id,
			power: unit.data.power,
			relic: unit.data.relic_tier,
			combatType: unit.data.combat_type,
			gearLevel: unit.data.gear_level,
			name: unit.data.name ? unit.data.name : 'noname',
			level: unit.data.level ? unit.data.level : null,
			rarity: unit.data.rarity,
			health: unit.data.stats ? unit.data.stats['1'] : null,
			speed: unit.data.stats ? unit.data.stats['5'] : null,
			damage: unit.data.stats ? unit.data.stats['6'] : null,
			damageSpecial: unit.data.stats ? unit.data.stats['7'] : null,
			defense: unit.data.stats ? +unit.data.stats['8'].toFixed(1) : null,
			criticalChance: unit.data.stats
				? +unit.data.stats['14'].toFixed(2)
				: null,
			criticalChanceSpecial: unit.data.stats
				? +unit.data.stats['15'].toFixed(2)
				: null,
			criticalDamage: unit.data.stats ? unit.data.stats['16'] * 100 : null,
			potency: unit.data.stats ? unit.data.stats['17'] * 100 : null,
			tenacity: unit.data.stats ? unit.data.stats['18'] * 100 : null,
			protection: unit.data.stats ? unit.data.stats['28'] : null,
			updatedAt: new Date()
		};
	}
};
