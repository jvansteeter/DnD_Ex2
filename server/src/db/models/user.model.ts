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

        this.methods.setPassword = this.setPassword;
        this.methods.checkPassword = this.checkPassword;
        this.methods.setFirstName = this.setFirstName;
        this.methods.setLastName = this.setLastName;
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

    public checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.passwordHash);
    }

    private save() {
        this.methods.save();
    }
}

mongoose.model('User', new UserModel());