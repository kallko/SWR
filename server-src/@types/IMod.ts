interface IStat {
	name: string;
	value: number;
	display_value: string;
	stat_id: number;
	roll?: number;
}

export interface IMod {
	id: string;
	character: string;
	rarity: number;
	slot: number;
	tier: number;
	level: number;
	set: number;
	secondary_stats: IStat[];
	primary_stat: IStat;
}

enum MOD_FORM {
	'' = 0,
	'square' = 1,
	'arrow' = 2,
	'romb' = 3,
	'triangle' = 4,
	'circle' = 5,
	'cross' = 6
}

export interface ISet {
	id: number;
	name:
		| 'Speed'
		| 'Critical Chance'
		| 'Defense'
		| 'Tenacity'
		| 'Offense'
		| 'Potency'
		| 'Health'
		| 'Critical Damage';
	setCount: 2 | 4;
	fullBonus: number;
}

export interface IMOD_OPTIONS {
	form: (keyof typeof MOD_FORM)[];
	speedForUpgrade: number[];
	sets: ISet[];
	secondary: (
		| 'Defense'
		| 'Potency'
		| 'Offense'
		| 'Speed'
		| 'Health'
		| 'Tenacity'
		| 'Protection'
		| 'Critical Chance'
		| 'Critical Damage'
	)[];
	mainStat: {
		cross: (
			| 'Protection'
			| 'Potency'
			| 'Tenacity'
			| 'Defense'
			| 'Offense'
			| 'Health'
		)[];
		arrow: (
			| 'Speed'
			| 'Offense'
			| 'Health'
			| 'Critical Avoidance'
			| 'Defense'
		)[];
		circle: ('Health' | 'Protection')[];
		romb: 'Defense'[];
		triangle: (
			| 'Protection'
			| 'Critical Chance'
			| 'Health'
			| 'Offense'
			| 'Critical Damage'
			| 'Defense'
		)[];
		square: 'Offense'[];
	};
}
