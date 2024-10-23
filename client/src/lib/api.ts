export type Portfolio = {
  id: number;
  createdAt: string;
  updateAt: string;
  userId: number;
  balance: number;
  total: number;
};

export type Session = {
  id: number;
  createdAt: string;
  expiresAt: string;
  userId: number;
  token: string;
};

export type Holding = {
  id: number;
  createdAt: string;
  updatedAt: string;
  portfolioId: number;
  stockId: number;
  shares: number;
  stock: Stock;
};

export type Stock = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: number;
};

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
};

export type Order = {
  id: number;
  createdAt: string;
  updatedAt: string;
  portfolioId: number;
  stockId: number;
  status: string;
  type: string;
  price: number;
  shares: number;
  remaining: number;
  stock: Stock;
};

export type Trade = {
  id: number;
  executeddAt: string;
  askId: number;
  bidId: number;
  shares: number;
};
