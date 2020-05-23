import { ILegendPlayerProgress } from '../@types/IGuild';

const fs = require('fs');
const baseSaveUrl = './files/';

export const readWriteService = {
	saveLegendProgressForGuild(
		results: ILegendPlayerProgress[],
		name = 'last.json'
	) {
		const fileName = join(baseSaveUrl, name);
		fs.writeFile(fileName, JSON.stringify(results), 'utf8', (err: any) => {
			if (err) {
				return console.log(err);
			}
			console.log('The file was saved!');
		});
	},
	async readJson(name = 'brazzers.json') {
		const fileName = join(baseSaveUrl, name);
		return fs.readFileSync(fileName, 'utf8', async function (
			err: any,
			data: any
		) {
			if (err) {
				console.log('ERRROR ', err);
				throw err;
			}
			return await JSON.parse(data);
		});
	}
};

function join(...args: string[]) {
	return args.reduce((sum, arg) => sum + arg, '');
}
