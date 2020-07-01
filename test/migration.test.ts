import { splitGuildHistory } from '../server-src/migration/20200608splitGuildHistory';
import {
	fillLegendReq,
	fillUsers,
	fillLegendHistory
} from '../server-src/migration/20200628fillSql';
import { expect } from 'chai';
import { readWriteService } from '../server-src/service/readWriteService';

//depricated
describe('splitGuildHistory tests:', async function () {
	xit('should load file with guild info n times', async function () {
		this.timeout(50000);
		let files: string[] = await readWriteService.readDirAsync('./files/arch');
		const result = await splitGuildHistory.run();
		expect(files.length).equal(8);
	});
	xit('should create users from file', async function () {
		this.timeout(50000);
		await fillUsers();
	});
	xit('should create legend Requirements from const', async function () {
		this.timeout(50000);
		await fillLegendReq();
	});
	xit('should create legend history from files', async function () {
		this.timeout(50000);
		await fillLegendHistory();
	});
});
