import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Bid } from '../models/bid.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private firestore: AngularFirestore) {}

  getProducts(): Observable<Product[]> {
    return this.firestore
      .collection<Product>('products')
      .valueChanges({ idField: 'id' })
      .pipe(
        switchMap((products) =>
          this.firestore
            .collection<User>('users')
            .valueChanges({ idField: 'uid' })
            .pipe(
              map((users) =>
                products.map((p) => ({
                  ...p,
                  bids: p.bids.map((bid) => ({
                    ...bid,
                    user: users.find((u) => u.uid == bid.userId),
                  })),
                }))
              )
            )
        )
      );
  }

  addBid(product: Product, bid: Bid) {
    this.firestore.doc(`products/${product.id}`).update({
      bids: [...product.bids, bid],
    });
  }
}
