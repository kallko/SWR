export enum Rang {
	'hope',
	'officer',
	'lord',
	'emperor'
}

export interface IRegistration {
	id?: number;
	discordId?: string;
	allyCode: number;
	playerName: string;
	discordName?: string;
	rang: Rang;
}
