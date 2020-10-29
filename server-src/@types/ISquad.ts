export interface IUnitModOptions {
	name: string;
	possibleSets: (
		| 'Speed'
		| 'Critical Chance'
		| 'Defense'
		| 'Tenacity'
		| 'Offense'
		| 'Potency'
		| 'Health'
		| 'Critical Damage'
	)[];
	completeSets: boolean;
	arrow?: ('Speed' | 'Offense' | 'Health' | 'Critical Avoidance' | 'Defense')[];
	triangle?: (
		| 'Protection'
		| 'Critical Chance'
		| 'Health'
		| 'Offense'
		| 'Critical Damage'
		| 'Defense'
	)[];
	cross?: (
		| 'Protection'
		| 'Potency'
		| 'Tenacity'
		| 'Defense'
		| 'Offense'
		| 'Health'
	)[];
	circle?: ('Health' | 'Protection')[];
	square?: 'Offense';
	romb?: 'Defense';
	secondary:
		| 'Critical Chance'
		| 'Defense'
		| 'Tenacity'
		| 'Offense'
		| 'Potency'
		| 'Health'
		| 'Critical Damage';
}
