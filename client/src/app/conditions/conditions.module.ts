import { NgModule } from '@angular/core';
import { NewConditionDialogComponent } from './new-condition-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
	imports: [
			FormsModule,
			ReactiveFormsModule,
			BrowserModule,
			MatIconModule,
			MatFormFieldModule,
			MatButtonModule,
			MatInputModule,
			ColorPickerModule,
	],
	declarations: [
		NewConditionDialogComponent,
	],
	entryComponents: [
		NewConditionDialogComponent,
	],
	exports: [
		NewConditionDialogComponent,
	]
})
export class ConditionsModule {

}