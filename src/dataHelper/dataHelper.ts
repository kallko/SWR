
export const dataHelper = {
    guildDataunite: function (guild: any) {
        let kyloProgress = guild.map((member: any) => {
            return {
                player: member.player,
                display: member.result[0].display_data.display_status,
                sort: member.result[0].display_data.sorting_data
            }
        });
        kyloProgress.sort(sortByProgress);
        kyloProgress = addIndex(kyloProgress);
        let reyProgress = guild.map((member: any) => {
            return {
                player: member.player,
                display: member.result[1].display_data.display_status,
                sort: member.result[1].display_data.sorting_data
            }
        });
        reyProgress.sort(sortByProgress);
        reyProgress = addIndex(reyProgress);
        let result = kyloProgress
            .concat({player: '', display:'Legend REY'})
            .concat(reyProgress);
        result.unshift({player: '', display: 'Legend Kylo'});
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
            index: index + 1
        }
    })
}
