import { expect } from "chai";
import {playerController} from "../server-src/controller/playerController";


describe('playerController tests:', async function () {
    it('should load file with progress and compare it', async function () {
        this.timeout(5000);
        let result: any = await playerController.getLegendProgress('621723826');
        expect(result.length).equal(2);
    });
});
