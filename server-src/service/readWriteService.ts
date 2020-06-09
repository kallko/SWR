import { ILegendPlayerProgress } from '../@types/IGuild';
const { promisify } = require('util');
const fs = require('fs');
const baseSaveUrl = './files/';
const readDirAsyncFunction = promisify(fs.readdir);

export const readWriteService = {
	saveLegendProgressForGuild(
		results: ILegendPlayerProgress[],
		fileName = 'last.json'
	) {
		const filePath = join(baseSaveUrl, fileName);
		fs.writeFile(filePath, JSON.stringify(results), 'utf8', (err: any) => {
			if (err) {
				return console.error(err);
			}
			console.info('The file was saved: ', fileName);
		});
	},
	async readJson(fileName: string = 'brazzers.json') {
		const filePath = join(baseSaveUrl, fileName);
		return fs.readFileSync(filePath, 'utf8', async function (
			err: any,
			data: any
		) {
			if (err) {
				console.error('ERRROR ', err);
				throw err;
			}
			return await JSON.parse(data);
		});
	},
	async saveJson(data: any, fileName: string): Promise<void> {
		const filePath = join(baseSaveUrl, fileName);
		fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err: any) => {
			if (err) {
				return console.error(err);
			}
			console.info('The file was saved : ', fileName);
		});
	},
	async readDirAsync(name: string): Promise<string[]> {
		return readDirAsyncFunction(name);
	}
};

function join(...args: string[]) {
	return args.reduce((sum, arg) => sum + arg, '');
}
