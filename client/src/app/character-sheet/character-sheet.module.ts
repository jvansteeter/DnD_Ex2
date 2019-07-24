import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CharacterSheetComponent } from './sheet/character-sheet.component';
import { CharacterSheetRepository } from '../repositories/character-sheet.repository';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
	MatAutocompleteModule,
	MatButtonModule, MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDialogModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatSelectModule,
	MatSidenavModule,
	MatSlideToggleModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FunctionComponent } from './shared/subcomponents/function/function.component';
import { TokenComponent } from './shared/subcomponents/token/token.component';
import { CategoryComponent } from './shared/subcomponents/category/category.component';
import { TextListComponent } from './shared/subcomponents/text-list/text-list.component';
import { CheckboxListComponent } from './shared/subcomponents/checkbox-list/checkbox-list.component';
import { NumberComponent } from './shared/subcomponents/number/number.component';
import { CheckboxComponent } from './shared/subcomponents/checkbox/checkbox.component';
import { TextComponent } from './shared/subcomponents/text/text.component';
import { AddComponentComponent } from './maker/dialog/add-component.component';
import { CharacterMakerComponent } from './maker/character-maker.component';
import { CharacterMakerService } from './maker/character-maker.service';
import { CharacterSheetService } from './sheet/character-sheet.service';
import { CharacterInterfaceFactory } from './shared/character-interface.factory';
import { CharacterGridComponent } from './shared/character-grid.component';
import { CharacterAspectComponent } from './shared/character-aspect.component';
import { FunctionTextComponent } from './shared/subcomponents/function/function-text.component';
import { AppCDKModule } from '../cdk/cdk.module';
import { TextAreaComponent } from './shared/subcomponents/text-area/text-area.component';
import { AlertModule } from '../alert/alert.module';
import { CharacterTooltipComponent } from './character-tooltip/character-tooltip.component';
import { AddTooltipAspectComponent } from "./maker/dialog/add-tooltip-aspect.component";
import { CharacterRepository } from '../repositories/character.repository';
import { CurrentMaxComponent } from './shared/subcomponents/currentMax/current-max.component';
import { GridsterModule } from 'angular-gridster2';
import { RuleSetService } from '../data-services/ruleSet.service';
import { ConditionsAspectComponent } from './shared/subcomponents/conditions/conditions-aspect.component';
import { ConditionsModule } from '../conditions/conditions.module';
import { RulesConfigService } from '../data-services/rules-config.service';
import { AbilityModule } from '../abilities/ability.module';
import { CharacterRuleDialogComponent } from './shared/rule/character-rule-dialog.component';
import { RulesComponent } from './shared/rule/rules.component';
import { RuleService } from './shared/rule/rule.service';

@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		HttpClientModule,
		MatCardModule,
		BrowserAnimationsModule,
		MatInputModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		MatGridListModule,
		MatMenuModule,
		MatChipsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatListModule,
		MatExpansionModule,
		AppCDKModule,
		MatSidenavModule,
		MatSlideToggleModule,
		AlertModule,
		MatTabsModule,
		GridsterModule,
		ConditionsModule,
		MatButtonToggleModule,
		AbilityModule
	],
	declarations: [
		CharacterSheetComponent,
		CharacterMakerComponent,
		AddComponentComponent,
		TextComponent,
		CheckboxComponent,
		NumberComponent,
		CheckboxListComponent,
		TextListComponent,
		CategoryComponent,
		TokenComponent,
		FunctionComponent,
		CharacterGridComponent,
		CharacterAspectComponent,
		FunctionTextComponent,
		TextAreaComponent,
		CharacterTooltipComponent,
		AddTooltipAspectComponent,
		CurrentMaxComponent,
		ConditionsAspectComponent,
		CharacterRuleDialogComponent,
		RulesComponent,
	],
	providers: [
		CharacterSheetRepository,
		CharacterMakerService,
		CharacterSheetService,
		CharacterInterfaceFactory,
		CharacterRepository,
		RuleSetService,
		RulesConfigService,
		RuleService,
	],
	entryComponents: [
		AddComponentComponent,
		FunctionTextComponent,
		AddTooltipAspectComponent,
		CharacterTooltipComponent,
		CharacterRuleDialogComponent,
	],
	exports: [
		CharacterSheetComponent,
		CharacterMakerComponent,
		CharacterTooltipComponent,
	]
})
export class CharacterSheetModule {

}
