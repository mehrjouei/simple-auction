import { Bid } from './bid.model';

export interface Product {
  id:string;
  title: string;
  beginningPrice: number;
  bids: Bid[];
  image:string;
}
