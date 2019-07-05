import { NgModule } from '@angular/core';
import { AddAbilityDialogComponent } from './add-ability-dialog.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';

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
			AddAbilityDialogComponent
	],
	entryComponents: [
			AddAbilityDialogComponent
	]
})
export class AbilityModule {

}
