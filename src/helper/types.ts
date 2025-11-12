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

export interface product_item {
  id: number;
  color: string;
  size: string;
}

export interface config_type {
  lang: string;
  theme: string;
}

export interface sneaker_color {
  name: string;
  folder_name: string;
  [key: string]: any;
}