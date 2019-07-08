import { NgModule } from '@angular/core';
import { AddAbilityDialogComponent } from './add-ability-dialog.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { AbilityService } from "./ability.service";
import { CharacterSheetService } from "../character-sheet/sheet/character-sheet.service";

@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
	],
	declarations: [
			AddAbilityDialogComponent,
	],
	entryComponents: [
			AddAbilityDialogComponent,
	],
	providers: [
			AbilityService,
			CharacterSheetService
	]
})
export class AbilityModule {

}
