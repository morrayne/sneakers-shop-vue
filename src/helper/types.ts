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

export interface sneaker_item {
  id: number;
  cost: number;
  displayColor: number;
  colors: sneaker_color[];
  brand: string;
  gender: string;
  name: string;
  rating: number;
}

export interface product_item {
  id: number;
  color: string;
  size: string;
}

export interface sneaker_color {
  name: string;
  folder_name: string;
  color: string;
}

export interface color_item {
  name: string;
  folder_name: string;
}

export interface basket_item {
  id: number;
  name: string;
  favouriteColor: number;
  favouriteSize: string;
  colors: color_item[];
  gender: string;
  rating: number;
  cost: number;
}

interface filters {
  color: string;
  gender: string;
  brand: string;
}

export interface everything_type {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filters: filters;
}

interface provide_arrays {
  colors: string[];
  genders: string[];
  brands: string[];
}

export interface arrays_sidebar_main {
  color_array: string[];
  brand_array: string[];
  gender_array: string[];
}

export interface provide_everything {
  state: everything_type;
  arrays: provide_arrays;
  methods: any;
}

export interface sidebar_item {
  name: string;
  val: string;
  display_color: boolean;
  color: string;
  active: boolean;
  direction: string | boolean;
}

export interface history_item {
  id: number;
  name: string;
  cost: number;
  colors: color_item[];
}

export interface order_item {
  id: number;
  date: string;
  items: product_item[];
  total: number;
  status: string;
}