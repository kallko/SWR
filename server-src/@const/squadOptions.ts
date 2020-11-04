import { IUnitModOptions } from '../@types/ISquad';

export const squadOptions: IUnitModOptions[] = [
	{
		name: 'SUPREMELEADERKYLOREN',
		possibleSets: ['Offense', 'Critical Chance'],
		completeSets: true,
		arrow: ['Speed'],
		triangle: ['Critical Damage'],
		cross: ['Offense'],
		secondary: 'Offense'
	},
	{
		name: 'GENERALHUX',
		possibleSets: ['Health', 'Speed'],
		completeSets: true,
		arrow: ['Speed'],
		secondary: 'Health'
	},
	{
		name: 'KYLORENUNMASKED',
		possibleSets: ['Health'],
		completeSets: true,
		arrow: ['Health'],
		cross: ['Health'],
		triangle: ['Health'],
		circle: ['Health'],
		secondary: 'Health'
	},
	{
		name: 'FOSITHTROOPER',
		possibleSets: ['Critical Damage', 'Critical Chance'],
		arrow: ['Speed'],
		triangle: ['Critical Damage'],
		cross: ['Offense'],
		completeSets: true,
		secondary: 'Offense'
	},
	{
		name: 'FIRSTORDERTROOPER',
		possibleSets: ['Defense'],
		arrow: ['Speed'],
		completeSets: true,
		secondary: 'Tenacity'
	}
];
