import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserData } from '../../../../shared/types/user-data';
import { MongooseModel } from './mongoose.model';

export class UserModel extends MongooseModel implements UserData {
	public _id;
	public username: string;
	public profilePhotoUrl: string;
	public firstName: string;
	public lastName: string;
	public passwordHash: string;

	constructor() {
		super({
			username: {type: String, index: true, unique: true},
			profilePhotoUrl: {type: String, required: true, default: 'resources/images/noImage.png'},
			firstName: String,
			lastName: String,
			passwordHash: String
		});

		this._id = this.methods._id;
		this.username = this.methods.username;
		this.profilePhotoUrl = this.methods.profilePhotoUrl;
		this.firstName = this.methods.firstName;
		this.lastName = this.methods.lastName;
		this.passwordHash = this.methods.passwordHash;

		this.methods.setPassword = this.setPassword;
		this.methods.checkPassword = this.checkPassword;
		this.methods.setFirstName = this.setFirstName;
		this.methods.setLastName = this.setLastName;
		this.methods.setProfilePhotoUrl = this.setProfilePhotoUrl;
	}

	public setPassword(password: string): void {
		this.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync());
		this.save();
	}

	public setFirstName(firstName: string): void {
		this.firstName = firstName;
		this.save();
	}

	public setLastName(lastName: string): void {
		this.lastName = lastName;
		this.save();
	}

	public setProfilePhotoUrl(url: string): Promise<UserModel> {
		this.profilePhotoUrl = url;
		return this.save();
	}

	public checkPassword(password: string): boolean {
		return bcrypt.compareSync(password, this.passwordHash);
	}
}

mongoose.model('User', new UserModel());