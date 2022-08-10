import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';

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

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [undefined, Validators.required],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addBid() {
    this.productService.addBid(this.product, {
      amount: parseInt(this.form.get('amount')?.value),
      userId: this.user.uid,
      date: new Date(),
    });
  }

  login() {
    this.authService.GoogleAuth();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
