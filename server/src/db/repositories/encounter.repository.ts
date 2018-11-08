import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { EncounterModel } from '../models/encounter.model';

export class EncounterRepository {
  private Encounter: mongoose.Model<mongoose.Document>;

  constructor() {
    this.Encounter = mongoose.model('Encounter');
  }

  public async create(label: string, campaignId: string, mapDimX: number, mapDimY: number): Promise<EncounterModel> {
    return new Promise((resolve, reject) => {
      this.Encounter.create({
        label: label,
        date: new Date(),
        campaignId: campaignId,
	      mapDimX: mapDimX,
	      mapDimY: mapDimY,
	      teamsData: {
        	teams: [
            'GM',
		        'Player',
	        ],
		      users: []
	      },
      }, (error, encounterModel: EncounterModel) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(encounterModel);
      });
    });
  }

  public findById(id: string): Promise<EncounterModel> {
    return new Promise((resolve, reject) => {
      this.Encounter.findById(id, (error, encounter) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(encounter);
      })
    });
  }

  public findByCampaignId(id: string): Promise<EncounterModel[]> {
    return new Promise<EncounterModel[]>((resolve, reject) => {
      this.Encounter.find({campaignId: id}, (error, encounters: EncounterModel[]) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(encounters);
      })
    });
  }

  public deleteById(id: string): Promise<void> {
  	return new Promise((resolve, reject) => {
  		this.Encounter.remove({_id: id}, (error) => {
  			if (error) {
  				reject(error);
  				return;
			  }

			  resolve();
		  });
	  });
  }
}
