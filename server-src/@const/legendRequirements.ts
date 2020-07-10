import { ILegendRequirements } from '../@types/IGuild';

const KAYLO: ILegendRequirements = {
	name: 'SUPREMELEADERKYLOREN',
	req_units: [
		{
			baseId: 'KYLORENUNMASKED',
			power: 30429,
			relic: 7
		},
		{
			baseId: 'FIRSTORDERTROOPER',
			power: 23248,
			relic: 5
		},
		{
			baseId: 'FIRSTORDEROFFICERMALE',
			power: 21052,
			relic: 5
		},
		{
			baseId: 'KYLOREN',
			power: 27448,
			relic: 7
		},
		{
			baseId: 'PHASMA',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'FIRSTORDEREXECUTIONER',
			power: 21052,
			relic: 5
		},
		{
			baseId: 'SMUGGLERHAN',
			power: 21984,
			relic: 3
		},
		{
			baseId: 'FOSITHTROOPER',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'FIRSTORDERSPECIALFORCESPILOT',
			power: 19003,
			relic: 3
		},
		{
			baseId: 'GENERALHUX',
			power: 24817,
			relic: 5
		},
		{
			baseId: 'FIRSTORDERTIEPILOT',
			power: 21199,
			relic: 3
		},
		{
			baseId: 'EMPERORPALPATINE',
			power: 30429,
			relic: 7
		},

		{
			baseId: 'CAPITALFINALIZER',
			power: 30300,
			ship: true,
			rarity: 5
		}
	]
};

const RAY: ILegendRequirements = {
	name: 'GLREY',
	req_units: [
		{
			baseId: 'REYJEDITRAINING',
			power: 33409,
			relic: 7
		},
		{
			baseId: 'FINN',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'RESISTANCETROOPER',
			power: 20842,
			relic: 5
		},
		{
			baseId: 'REY',
			power: 27448,
			relic: 7
		},
		{
			baseId: 'RESISTANCEPILOT',
			power: 18793,
			relic: 3
		},
		{
			baseId: 'POE',
			power: 21627,
			relic: 5
		},
		{
			baseId: 'EPIXFINN',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'AMILYNHOLDO',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'ROSETICO',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'EPIXPOE',
			power: 24033,
			relic: 5
		},
		{
			baseId: 'BB8',
			power: 30429,
			relic: 7
		},
		{
			baseId: 'SMUGGLERCHEWBACCA',
			power: 21984,
			relic: 3
		},

		{
			baseId: 'CAPITALRADDUS',
			power: 30000,
			ship: true,
			rarity: 5
		}
	]
};

export const LEGEND = [KAYLO, RAY];
