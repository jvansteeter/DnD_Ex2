import * as mongoose from 'mongoose';
import Promise from 'bluebird';
import { Encounter } from '../../../../shared/types/encounter';


export class EncounterModel extends mongoose.Schema implements Encounter {
    public id;
    public label: string;
    public campaignId: string;
    public gameMasters: string[];

    constructor() {
        super ({
            label: String,
            campaignId: String,
            gameMasters: [String]
        });

        this.id = this.methods._id;
        this.label = this.methods.label;
        this.campaignId = this.methods.campaignId;
        this.gameMasters = this.methods.gameMasters;

        this.methods.addGameMaster = this.addGameMaster;
    }

    public addGameMaster(userId: string): Promise<EncounterModel> {
        this.gameMasters.push(userId);
        return this.save();
    }

    private save(): Promise<EncounterModel> {
        return new Promise((resolve, reject) => {
            this.methods.save((error, encounter: EncounterModel) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(encounter);
            })
        });
    }
}

mongoose.model('Encounter', new EncounterModel());