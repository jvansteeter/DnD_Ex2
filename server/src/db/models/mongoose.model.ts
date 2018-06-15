import * as mongoose from 'mongoose';

export class MongooseModel extends mongoose.Schema {

	constructor(schema: {}) {
		super(schema);
	}

	protected async save(): Promise<this> {
		// return new Promise((resolve, reject) => {
		// 	this.methods.save((error, encounter: EncounterModel) => {
		// 		if (error) {
		// 			reject(error);
		// 			return;
		// 		}
		//
		// 		resolve(encounter);
		// 	})
		// });
		try {
			return await this.methods.save();
		}
		catch (error) {
			throw error;
		}
	}
}

