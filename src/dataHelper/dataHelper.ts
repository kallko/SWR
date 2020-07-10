export const dataHelper = {
	guildDataunite: function (guild: any) {
		let kyloProgress = guild.map((member: any) => {
			return {
				player: member?.player,
				display: member?.result[0]?.display_data?.display_status,
				sort: member?.result[0]?.display_data?.sorting_data,
				weekProgress: member?.result[0]?.display_data?.last_week_add
			};
		});
		kyloProgress.sort(sortByProgress);
		kyloProgress = addIndex(kyloProgress);
		let reyProgress = guild.map((member: any) => {
			return {
				player: member?.player,
				display: member?.result[1]?.display_data?.display_status,
				sort: member?.result[1]?.display_data?.sorting_data,
				weekProgress: member?.result[1]?.display_data?.last_week_add
			};
		});
		reyProgress.sort(sortByProgress);
		reyProgress = addIndex(reyProgress);
		let result = kyloProgress
			.concat({ player: '', display: 'Legend REY' })
			.concat(reyProgress);
		result.unshift({ player: '', display: 'Legend Kylo' });
		//todo log for Brazzers
		if (result.length > 85) {
			let con = result.reduce(
				(sum, res) =>
					sum +
					res.index +
					' ' +
					res.player +
					' ' +
					res.display +
					' (' +
					res.weekProgress +
					')\n',
				''
			);
			console.info('Brazzers Console ', con);
		}
		return result;
	}
};

function sortByProgress(first: any, second: any): number {
	return second.sort - first.sort;
}

function addIndex(members: any) {
	return members.map((member: any, index: number) => {
		return {
			player: member.player,
			display: member.display,
			index: index + 1,
			weekProgress: member.weekProgress
		};
	});
}
