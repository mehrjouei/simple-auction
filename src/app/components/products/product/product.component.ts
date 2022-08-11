import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Bid } from 'src/app/models/bid.model';
import { Product } from 'src/app/models/product.model';
import { BidDialogComponent } from './bid-dialog/bid-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @ViewChild('imageFull') imageFull: any;
  @Input() product!: Product;
  dialogRef!: MatDialogRef<any>;
  constructor(public dialog: MatDialog) {}

  public get highestBid(): Bid | null {
    const sortedBids = [...this.product.bids].sort(
      (a, b) => b.amount - a.amount
    );
    if (sortedBids.length > 0) {
      return sortedBids[0];
    }
    return null;
  }

  showImage() {
    this.dialogRef = this.dialog.open(this.imageFull);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showBidDialog() {
    this.dialogRef = this.dialog.open(BidDialogComponent, {
      data: { ...this.product },
    });
  }

}
