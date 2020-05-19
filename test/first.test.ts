import { expect } from "chai";
import {guildController} from "../server-src/controller/guildController";


describe('guildController', async function () {
	it('shoul upload old file', async function () {
		this.timeout(500000);
		let result: any = await guildController.getLegendProgress();

		expect(result).equal(7);
	});
});
