import { Rang } from '../../@types/iRegistration';

export interface IDiscordOption {
	id: number;
	key: string;
	description: string;
	handler: string;
	minimalRang?: Rang;
	retry?: number;
}

export const discordConfig: IDiscordOption[] = [
	{
		id: 0,
		key: '-h',
		description: '   Help. Usage: swr - h Help about acceptable commands',
		handler: 'help'
	},
	{
		id: 9,
		key: '-r',
		description:
			'   Registering. Usage: swr -r 111222333 Register your user ally code for next operations',
		handler: 'register'
	},
	{
		id: 10,
		key: '-cu',
		description:
			' ColorUp. Usage: swr -cu Find mods, wich after color-up, could add more than 20 speed',
		handler: 'colorUp'
	},
	{
		id: 12,
		key: '-lp',
		description:
			' LegendProgress. Usage: swr -lp Check Your progress to receiving Legends',
		handler: 'legendProgress'
	},
	{
		id: 13,
		key: '-gl',
		minimalRang: Rang.officer,
		retry: 24 * 7,
		description:
			' GuildList. usage: swr -gl Returns list of guild members with allycodes, estimated response time 20 sec.',
		handler: 'guildList'
	},
	{
		id: 14,
		key: '-gtu',
		minimalRang: Rang.officer,
		retry: 24 * 7,
		description:
			' Guild Top Units. usage: swr -gth -rank=health Returns top units of guild by Health.(Possible ranks: health, speed, power, damage, defence, potency, tenacity, protection)',
		handler: 'guildTop'
	}
];
