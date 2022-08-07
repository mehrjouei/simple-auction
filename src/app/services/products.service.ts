import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private store: Firestore) {}

  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.store, 'products');
    return collectionData(productsCollection) as Observable<Product[]>;
  }
}
