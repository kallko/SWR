import { guildController } from '../controller/guildController';

const cron = require('node-cron');

export const cronJob = {
	start: function () {
		cron.schedule('00 50 23 * * *', async () => {
			const start = Date.now();
			console.info('Cron JOB night update guild');
			await guildController.updateData();
			console.info(
				'Update finished in ',
				Math.floor((Date.now() - start) / 1000)
			);
		});
		cron.schedule('00 50 11 * * *', async () => {
			const start = Date.now();
			console.info('Cron JOB day update guild');
			await guildController.updateData();
			console.info(
				'Update finished in ',
				Math.floor((Date.now() - start) / 1000)
			);
		});
	}
};
