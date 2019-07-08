import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { MongooseModel } from './mongoose.model';
import { CharacterData } from '../../../../shared/types/character.data';
import { CharacterSheetData } from '../../../../shared/types/rule-set/character-sheet.data';
import { TokenData } from '../../../../shared/types/token.data';
import { AbilityData } from "../../../../shared/types/ability.data";

export class CharacterModel extends MongooseModel implements CharacterData {
	public _id: string;
	public label: string;
	public creatorUserId: string;
	public tokens: TokenData[];
	public characterSheetId: string;
	public characterSheet?: CharacterSheetData;
	public ruleSetId?: string;
	public campaignId?: string;
	public npc: boolean;
	public abilities: AbilityData[];
	public values: {};

	constructor() {
		super({
			label: {type: String, required: true},
			creatorUserId: {type: String, required: true},
			tokens: [{
				url: String,
				widthInCells: Number,
				heightInCells: Number
			}],
			characterSheetId: String,
			ruleSetId: String,
			campaignId: String,
			npc: {type: Boolean, default: true},
			abilities: [{
				name: String,
				rolls: [{
					name: String,
					equation: String,
				}]
			}],
			values: {type: Object, default: {}}
		});

		this._id = this.methods._id;
		this.label = this.methods.label;
		this.creatorUserId = this.methods.creatorUserId;
		this.tokens = this.methods.tokens;
		this.characterSheetId = this.methods.characterSheetId;
		this.ruleSetId = this.methods.ruleSetId;
		this.campaignId = this.methods.campaignId;
		this.npc = this.methods.npc;
		this.values = this.methods.values;
		this.abilities = this.methods.abilities;

		this.methods.setRuleSetId = this.setRuleSetId;
		this.methods.setValues = this.setValues;
		this.methods.setCampaignId = this.setCampaignId;
		this.methods.setTokens = this.setTokens;
	}

	public setRuleSetId(id: string): Promise<void> {
		this.ruleSetId = id;
		return this.save();
	}

	public setCampaignId(id: string): Promise<void> {
		this.campaignId = id;
		return this.save();
	}

	public setValues(values): Promise<void> {
		this.values = values;
		return this.save();
	}

	public setAbilities(abilities: AbilityData[]): Promise<void> {
		this.abilities = abilities;
		return this.save();
	}

	public setTokens(tokens: TokenData[]): Promise<void> {
		this.tokens = tokens;
		return this.save();
	}
}

mongoose.model('Character', new CharacterModel());