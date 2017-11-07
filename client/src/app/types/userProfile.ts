
export class UserProfile {
    public id: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public profilePhotoUrl: string;

    constructor(profileData: any) {
        this.id = profileData._id;
        this.username = profileData.username;
        if (profileData.hasOwnProperty('firstName')) {
            this.firstName = profileData.firstName;
        }
        if (profileData.hasOwnProperty('lastName')) {
            this.lastName = profileData.lastName;
        }
        if (profileData.hasOwnProperty('profilePhotoUrl')) {
            this.profilePhotoUrl = profileData.profilePhotoUrl;
        }
    }

    public getName(): string {
        if (this.firstName) {
            return this.firstName;
        }
        else {
            return this.username;
        }
    }
}