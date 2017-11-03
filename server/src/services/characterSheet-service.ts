import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { Promise } from 'bluebird';
import { CharacterSheetModel } from '../db/models/characterSheet.model';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { CharacterAspectModel } from '../db/models/characterAspect.model';

export class CharacterSheetService {
    private characterSheetRepository: CharacterSheetRepository;
    private characterAspectRepository: CharacterAspectRepository;

    constructor() {
        this.characterSheetRepository = new CharacterSheetRepository();
        this.characterAspectRepository = new CharacterAspectRepository();
    }

    public saveCharacterSheet(characterSheetObj: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.characterSheetRepository.findById(characterSheetObj._id).then((characterSheet: CharacterSheetModel) => {
                this.characterAspectRepository.findByCharacterSheetId(characterSheet._id).then((aspects: CharacterAspectModel[]) => {
                    let aspectPromise = new Promise((aspectResolve, aspectReject) => {
                        let aspectCount = characterSheetObj.aspects.length;
                        if (aspectCount === 0) {
                            aspectResolve();
                        }
                        characterSheetObj.aspects.forEach((aspectObj) => {
                            if (aspectObj.hasOwnProperty('_id')) {
                                for (let i = 0; i < aspects.length; i++) {
                                    if (aspects[i]._id == aspectObj._id) {
                                        aspects.splice(i, 1);
                                    }
                                }
                                this.characterAspectRepository.update(aspectObj).then(() => {
                                    if (--aspectCount === 0) {
                                        aspectResolve();
                                    }
                                }).catch(error => aspectReject(error));
                            }
                            else {
                                this.characterAspectRepository.create(characterSheetObj._id, aspectObj).then(() => {
                                    if (--aspectCount === 0) {
                                        aspectResolve();
                                    }
                                }).catch(error => aspectReject(error));
                            }
                        });
                    });
                    aspectPromise.then(() => {
                        let deletePromise = new Promise((deleteResolve, deleteReject) => {
                            if (aspects.length > 0) {
                                let deleteCount = aspects.length;
                                if (deleteCount === 0) {
                                    deleteResolve();
                                }
                                aspects.forEach((deleteAspect: CharacterAspectModel) => {
                                    this.characterAspectRepository.deleteById(deleteAspect._id).then(() => {
                                        if (--deleteCount === 0) {
                                            deleteResolve();
                                        }
                                    }).catch(error => deleteReject(error));
                                });
                            }
                        });
                        deletePromise.then(() => {
                            resolve();
                        }).catch(error => reject(error));
                    }).catch(error => reject(error));
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }
}