import { NgModule } from '@angular/core';
import { BreadCrumbComponent } from './component/bread-crumb.component';
import { BreadCrumbService } from './bread-crumb.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule
	],
	declarations: [
			BreadCrumbComponent,
	],
	entryComponents: [],
	providers: [
			BreadCrumbService,
	],
	exports: [
		BreadCrumbComponent
	],
})
export class BreadCrumbModule {

}