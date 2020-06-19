import { IGuild, ILegendProgress } from '../../@types/IGuild';
import { IFrontColorUpMod } from '../../@types/IFrontEnd';
import { MOD_OPTIONS } from '../../@const/modOptions';
export const discordResultStringifier = {
	legendProgress(result: ILegendProgress[]): string {
		return (
			'Your progress for Legends: \n' +
			result[0].legend_name +
			' ' +
			result[0].display_data.display_status +
			'\n' +
			result[1].legend_name +
			' ' +
			result[1].display_data.display_status
		);
	},
	colorUpMods(result: IFrontColorUpMod[]): string {
		if (result.length === 0) {
			return 'You made your best. Nothing to upgrade.';
		}
		return result.reduce(
			(sum, entry) =>
				sum + entry.character + ' - ' + MOD_OPTIONS.form[entry.slot] + '\n',
			'These mods after upgrade could add more than 20 speed: \n'
		);
	},
	guildList(guild: IGuild): string {
		return (
			guild.name +
			': \n' +
			guild.members.reduce(
				(sum, member, index) =>
					(sum += index + 1 + '.  ' + member.name + ' ' + member.id + '\n'),
				''
			)
		);
	}
};
