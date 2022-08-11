import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Bid } from 'src/app/models/bid.model';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { BidConfirmComponent } from './bid-confirm/bid-confirm.component';

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.scss'],
})
export class BidDialogComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  user!: User;
  subscriptions = new Subscription();
  product!: Product;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    private authService: AuthService,
    private productService: ProductsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.product = this.data;
    this.subscriptions.add(
      this.productService.getProducts().subscribe((products) => {
        this.product = products.find((p) => p.id == this.data.id) as Product;
      })
    );

    this.subscriptions.add(
      this.authService.user.subscribe((user) => {
        this.user = user as User;
      })
    );
  }

  public get highestBid(): Bid | null {
    const sortedBids = [...this.product.bids].sort(
      (a, b) => b.amount - a.amount
    );
    if (sortedBids.length > 0) {
      return sortedBids[0];
    }
    return null;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [
        undefined,
        [
          Validators.required,
          Validators.min(
            (this.highestBid?.amount || this.product.beginningPrice) +
              this.product.minBidIncrease
          ),
        ],
      ],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addBid() {
    this.dialog
      .open(BidConfirmComponent, {
        data: this.form.get('amount')?.value,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.applyBid();
        }
      });
  }

  applyBid() {
    const bidAmount = parseInt(this.form.get('amount')?.value);
    this.productService.addBid(this.product, {
      amount: bidAmount,
      userId: this.user.uid,
      date: new Date(),
    });
    this.form.get('amount')?.clearValidators();
    this.form
      .get('amount')
      ?.addValidators([
        Validators.required,
        Validators.min(bidAmount + this.product.minBidIncrease),
      ]);
    this.form.get('amount')?.setValue(undefined);
    this.form.markAsPristine();
    this.form.updateValueAndValidity();
  }
  login() {
    this.authService.GoogleAuth();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
