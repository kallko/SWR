import { expect } from "chai";
import {playerController} from "../server-src/controller/playerController";


describe('playerController tests:', async function () {
    it.only('shoul upload old file', async function () {
        this.timeout(5000);
        let result: any = await playerController.getLegendProgress(621723826);
        console.log('Result', result);
        expect(result).equal(7);
    });
});
