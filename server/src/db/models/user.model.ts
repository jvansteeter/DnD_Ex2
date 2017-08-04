import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// export let Schema = mongoose.Schema;
//
// export interface UserData extends mongoose.Document {
//     username: string;
//     profilePhotoUrl: string;
//     firstName: string;
//     lastName: string;
//     passwordHash: string;
// }
//
// let schema = new Schema({
//     username: {type: String, index: true, unique: true},
//     profilePhotoUrl: {type: String, required: true, default: 'image/common/noImage.png'},
//     firstName: String,
//     lastName: String,
//     passwordHash: String
// });
//
// export class UserModel {
//     private userData: UserData;
//
//     constructor(data: UserData) {
//         this.userData = data;
//     }
//
//     public getUsername(): string {
//         return this.userData.username;
//     }
//
//     public getProfilePhotoUrl(): string {
//         return this.userData.profilePhotoUrl;
//     }
//
//     public getFirstName(): string {
//         return this.userData.firstName;
//     }
//
//     public getLastName(): string {
//         return this.userData.lastName;
//     }
// }
//
// export let UserSchema = mongoose.model<UserData>('User', schema);
//
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

        this.methods.setPassword = this.setPassword;
        this.methods.checkPassword = this.checkPassword;
        this.methods.testMethod = this.testMethod;
    }

    public setPassword(password: string): void {
        console.log('set password')
        this.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync());
        this.save();
    }

    public checkPassword(password: string): boolean {
        console.log('checking password');
        console.log(password);
        console.log(this.passwordHash);
        console.log(bcrypt.compareSync(password, this.passwordHash));

        return bcrypt.compareSync(password, this.passwordHash);
    }

    public testMethod() {
        console.log('test method')
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('User', new UserModel());