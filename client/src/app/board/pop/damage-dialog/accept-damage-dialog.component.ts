import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Player } from '../../../encounter/player';
import { DamageData } from '../../../../../../shared/types/rule-set/damage.data';

@Component({
	templateUrl: 'accept-damage-dialog.component.html',
	styleUrls: ['accept-damage-dialog.component.scss']
})
export class AcceptDamageDialogComponent {
	private player: Player;

	constructor(@Inject(MAT_DIALOG_DATA) data: any, private dialogRef: MatDialogRef<AcceptDamageDialogComponent>) {
		this.player = data;
	}

	public acceptRequest(damageRequest: DamageData): void {
		this.player.acceptDamageRequest([damageRequest]);
		if (this.player.damageRequests.length === 0) {
			this.dialogRef.close();
		}
	}

	public rejectRequest(damageRequest: DamageData): void {
		this.player.damageRequests.splice(this.player.damageRequests.indexOf(damageRequest), 1);
		this.player.emitChange();
		if (this.player.damageRequests.length === 0) {
			this.dialogRef.close();
		}
	}

	public acceptAll(): void {
		this.player.acceptDamageRequest(this.player.damageRequests);
		this.dialogRef.close();
	}

	public rejectAll(): void {
		this.player.damageRequests.splice(0);
		this.player.emitChange();
		this.dialogRef.close();
	}
}
