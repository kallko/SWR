import { IImportUnit } from './IUnit';

export interface IPlayer {
	units: IImportUnit[];
	detail: string;
	data: {
		name: string;
	};
}
