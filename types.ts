export type Product = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  image?: string;
  imageUrls?: string[];
  category?: string;
  location?: string;
  vendorId?: number;
};

export type Vendor = {
  id: number;
  fullName?: string;
  username?: string;
  phone?: string;
  location?: string;
  status?: string;
  avatarUrl?: string;
};
