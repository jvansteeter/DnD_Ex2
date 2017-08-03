import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export class UserModel extends mongoose.Schema {
    public username: string;
    public profilePhotoUrl: string;
    public firstName: string;
    public lastName: string;
    public passwordHash: string;

    constructor() {
        super ({
            username: {type: String, index: true, unique: true},
            profilePhotoUrl: {type: String, required: true, default: 'image/common/noImage.png'},
            firstName: String,
            lastName: String,
            passwordHash: String
        });

        this.username = this.methods.username;
        this.profilePhotoUrl = this.methods.profilePhotoUrl;
        this.firstName = this.methods.firstName;
        this.lastName = this.methods.lastName;
        this.passwordHash = this.methods.passwordHash;
    }

    public setPassword(password: string): void {
        this.methods.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync());
    }

    public checkPassword(password: string): boolean {
        console.log('checking password');
        return bcrypt.compareSync(password, this.methods.passwordHash);
    }

    public testMethod() {
        console.log('test method')
    }
}

mongoose.model('User', new UserModel());