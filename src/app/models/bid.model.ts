import { User } from './user.model';

export interface Bid {
  amount: number;
  user?: User;
  userId?: string;
  date: Date;
}

