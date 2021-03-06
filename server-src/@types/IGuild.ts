export interface IGuild {
	name: string;
	members: {
		id: number;
		name: string;
	}[];
}

export interface IReqUnits {
	id?: number;
	baseId: string;
	power: number;
	relic?: number;
	ship?: boolean;
	rarity?: number;
}

export interface ILegendRequirements {
	name: string;
	req_units: IReqUnits[];
}

export interface ILegendPlayerProgressArchiv {
	year: number;
	month: number;
	day: number;
	legend_progress: ILegendProgress[];
}
export interface ILegendPlayerProgress {
	player_name?: string;
	legend_progress: ILegendProgress[];
}
export interface ILegendProgress {
	legend_name: string;
	display_data: {
		display_status: string;
		display_week_progress?: string;
		sorting_data: number;
		last_week_add: number;
		estimated_date?: Date;
	};
	data?: ILegendReqUnit[];
}
export interface ILegendReqUnit {
	base_id: string;
	isComplete: boolean;
	current_power: number;
	previous_power: number;
	need_power: number;
}
