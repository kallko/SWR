import { IUnit } from './IUnit';

export interface IPlayer {
	units: IUnit[];
	detail: string;
	data: {
		name: string;
	};
}
