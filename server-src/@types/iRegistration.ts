export const Rang = {
	hope: 'hope',
	officer: 'officer',
	emperor: 'emperor'
};

export interface IRegistration {
	discordId: string;
	allyCode: string;
	playerName: string;
	discordName: string;
	rang: keyof typeof Rang;
}
