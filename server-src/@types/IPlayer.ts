import { IImportUnit } from './IUnit';

export interface IPlayer {
	units: IImportUnit[];
	detail: string;
	data: {
		name: string;
		guild_id: number;
		guild_name: string;
		arena_rank: number;
		fleet_arena: {
			leader: string;
			rank: number;
		};
		arena: {
			leader: string;
			rank: number;
			members?: string[];
		};
		galactic_power: number;
	};
	ally_code: number;
}
