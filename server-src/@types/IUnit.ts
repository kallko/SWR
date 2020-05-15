export interface IUnit {
	data: {
		id: string;
		relic_tier: number;
		power: number;
		combat_type: number;
		mod_set_ids: number[];
		base_id: string;
		gear_level: number;
		stats: {
			1: number;
			2: number;
			3: number;
			4: number;
			5: number;
			6: number;
			7: number;
			8: number;
			9: number;
			10: number;
			11: number;
			12: number;
			13: number; //test
			14: number;
			15: number;
			16: number;
			17: number;
			18: number;
			27: number;
			28: number;
			37: number;
			38: number;
			39: number;
			40: number;
		};
		name: string;
		level: number;
		rarity: number;
	};
}
