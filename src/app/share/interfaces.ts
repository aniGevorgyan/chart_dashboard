export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface IList {
  limit: number;
  products: IProduct[];
  skip: number;
  total: number;
}

export interface IPagination {
  limit: number;
  skip: number;
  total?: number;
}

export interface IChartDatasets {
  label: string;
  data: number[];
  backgroundColor: string;
}
