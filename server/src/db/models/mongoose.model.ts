import * as mongoose from 'mongoose';

export class MongooseModel extends mongoose.Schema {

	constructor(schema: {}) {
		super(schema);
	}

	protected async save(): Promise<this> {
		try {
			return await this.methods.save();
		}
		catch (error) {
			throw error;
		}
	}
}

