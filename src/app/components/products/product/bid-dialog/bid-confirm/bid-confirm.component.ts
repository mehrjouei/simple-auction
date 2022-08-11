import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bid-confirm',
  templateUrl: './bid-confirm.component.html',
  styleUrls: ['./bid-confirm.component.scss'],
})
export class BidConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public bidAmount: number
  ) {}

  closeDialog(val: boolean) {
    this.dialogRef.close(val);
  }
}
