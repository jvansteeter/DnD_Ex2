import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: 'show-global-announcement-dialog.component.html'
})
export class ShowGlobalAnnouncementDialogComponent {
	public announcement: string;

	constructor(@Inject(MAT_DIALOG_DATA) data: any) {
		this.announcement = data;
	}
}
