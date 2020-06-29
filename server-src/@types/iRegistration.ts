export const Rang = {
	hope: 'hope',
	officer: 'officer',
	lord: 'lord',
	emperor: 'emperor'
};

export interface IRegistration {
	id?: number;
	discordId?: string;
	allyCode: string;
	playerName: string;
	discordName?: string;
	rang: keyof typeof Rang;
}
