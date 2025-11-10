export interface user_type {
  id: string;
  email: string;
  password: string;
  name: string;
  icon: number;
  favourite: product_item[];
  basket: product_item[];
  history: product_item[];
}

interface product_item {
  id: number;
  color: number;
  size: string;
}

export interface config_type {
  lang: string;
  theme: string;
}
