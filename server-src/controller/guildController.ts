import { IFrontLegendTable } from '../@types/IFrontEnd';
import {
	IGuild,
	ILegendPlayerProgress,
	ILegendProgress
} from '../@types/IGuild';

import { fetchDataService } from '../service/fetchDataService';

import { playerController } from './playerController';

import { Transformer } from '../helper/transformer';
import { guildService } from '../service/guildService';
import { userService } from '../service/UserService';
import { GuildMembers, User } from '../service/dbModels';

export const guildController = {
	getLegendProgress: async function (
		allyCode: number
	): Promise<IFrontLegendTable[][]> {
		const guildResult: ILegendPlayerProgress[] = [];
		const test: number = process.env.NODE_ENV === 'PRODUCTION' ? 300 : 3;
		const guild: IGuild = await fetchDataService.getGuildPlayersCode(allyCode);
		const players: number = Math.min(test, guild.members.length);

		for (let i: number = 0; i < players; i++) {
			const result: ILegendProgress[] = await playerController.getLegendProgress(
				guild.members[i].id
			);
			guildResult.push({
				player_name: guild.members[i].name,
				legend_progress: result
			});
		}

		return Transformer.transformLegendProgress(guildResult);
	},
	getGuildAll: async function (allyCode: number): Promise<IGuild> {
		let guildId = await guildService.getGuildId(allyCode);
		let player;
		if (!guildId) {
			player = await fetchDataService.getPlayer(allyCode);
			guildId = player.data.guild_id;
		}
		let guildName =
			(await guildService.getGuildName(guildId)) || player.data.guild_name;
		let guild = await guildService.getGuildMembers(guildId);
		let members;
		if (guild?.length === 0) {
			const fetchedGuild = await fetchDataService.getGuildPlayersCode(allyCode);
			members = fetchedGuild
				? fetchedGuild.members.map((member) => {
						return { id: member.id, name: member.name };
				  })
				: [];
		} else {
			members = guild.map((member) => {
				return { id: member.allyCode, name: member.name };
			});
		}
		return {
			members,
			name: guildName
		};
	},
	updateData: async function (): Promise<void> {
		const guildMembers: GuildMembers[] = await guildController.getAllAllyCodes();
		for (const member of guildMembers) {
			const next = await playerController.updatePlayerUnits(
				member.allyCode,
				true
			);
			await playerController.saveLegendProgress(member.allyCode);
			if (!next) {
				await sleep(30000);
			}
		}
	},
	getAllAllyCodes: async function (): Promise<Partial<GuildMembers[]>> {
		const guildMembers: Partial<GuildMembers[]> = await guildService.getAll();
		const players: Partial<User[]> = await userService.getUsersAllyCode();
		//todo check format allyCode
		// todo check format guildMembers (s in the end);
		players.forEach((player) => {
			if (
				!guildMembers.some(
					(member) => member.allyCode.toString() === player.allyCode.toString()
				)
			) {
				guildMembers.push({
					allyCode: parseInt(String(player.allyCode))
				} as any);
			}
		});
		return guildMembers;
	},
	updateGuilds: async function (guildMembers: GuildMembers[]): Promise<void> {
		let allMembers = [];
		for (const member of guildMembers) {
			if (!allMembers.some((cm) => cm.id === member.allyCode)) {
				const guild = await fetchDataService.getGuildPlayersCode(
					member.allyCode
				);
				if (guild?.members) {
					allMembers = allMembers.concat(guild.members);
				} else {
					allMembers = allMembers.concat({
						id: member.allyCode,
						name: member.name
					});
				}
			}
		}
		await guildController.updateGuildMembers(allMembers);
	},
	updateGuildMembers: async function (members) {
		for (const member of members) {
			await guildService.updateGuildMember(member.id);
		}
	}
};

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
