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
		description: 'Help. \nHelp about acceptable commands',
		handler: 'help'
	},
	{
		id: 1,
		key: '-i',
		description:
			'Idea. \nYou could add Your idea for SWR Bot, like: Find weak point of my GA Enemy \nAny idea about how this bot could help You. \n Also, you could describe bugs with this option.',
		handler: 'idea'
	},
	{
		id: 9,
		key: '-r',
		description:
			'Registering. \nRegister your user ally code for next operations',
		handler: 'register'
	},
	{
		id: 10,
		key: '-mcu',
		description:
			'Mods ColorUp. \nFind mods, which after color-up, could add more than 20 speed',
		handler: 'colorUp'
	},
	{
		id: 11,
		key: '-mba',
		minimalRang: Rang.officer,
		retry: 24 * 7,
		description:
			'Mods best for Arena. \nCreate fastest set of mods for Your arena team',
		handler: 'arenaMods'
	},
	{
		id: 12,
		key: '-mue',
		minimalRang: Rang.officer,
		retry: 24 * 7,
		description:
			'Mods Unit Evolution. \nFound gold mods for unit which You could change with lower quality mod\nBy default for most powerful unit. You could specify unit like swr -mue -unit=3 (in this case it will be 3 by power unit) \nor swr -mue -unit=PADMEAMIDALA ',
		handler: 'modEvolution'
	},
	{
		id: 12,
		key: '-lp',
		description: 'LegendProgress. \nCheck Your progress to receiving Legends',
		handler: 'legendProgress'
	},
	{
		id: 100,
		key: '-gl',
		minimalRang: Rang.officer,
		retry: 24 * 7,
		description:
			'GuildList. \nReturns list of guild members with allycodes, estimated response time 20 sec.',
		handler: 'guildList'
	},
	{
		id: 101,
		key: '-gtu',
		minimalRang: Rang.officer,
		retry: 24 * 7,
		description:
			'Guild Top Units. \nReturns top units of guild by possible rank.\n(Possible ranks: health, speed, power, damage, defense, potency, tenacity, protection)',
		handler: 'guildTop'
	}
];
