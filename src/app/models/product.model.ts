import { Bid } from './bid.model';

export interface Product {
  title: string;
  beginningPrice: number;
  bids: Bid[];
  image:string;
}
