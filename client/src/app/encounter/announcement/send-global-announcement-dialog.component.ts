import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	templateUrl: 'send-global-announcement-dialog.component.html',
	styleUrls: ['send-global-announcement-dialog.component.scss']
})
export class SendGlobalAnnouncementDialogComponent {
	public announcement: string;

	constructor(private dialogRef: MatDialogRef<SendGlobalAnnouncementDialogComponent>) {

	}

	public broadcast(): void {
		this.dialogRef.close(this.announcement);
	}
}
