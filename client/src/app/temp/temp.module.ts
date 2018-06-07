import { NgModule } from '@angular/core';
import { AddPlayerComponent } from './add-player.component';
import { MatButtonModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	imports: [
			FormsModule,
			BrowserModule,
			MatListModule,
			MatButtonModule,
	],
	declarations: [
			AddPlayerComponent
	],
	providers: [

	],
	exports: [
			AddPlayerComponent
	]
})
export class TempModule {

}