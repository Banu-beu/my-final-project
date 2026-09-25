export interface ProductAttributes {
  id: number;
  slug: string; 
  coverImage: string; 
  images: string[];
  titleAz: string;
  titleRu: string;
  titleEn: string;
  descriptionAz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  price: number; 
  discountPrice: number | null; 
  categoryId: number | null;
  brandId: number | null;
  stock: number;
  color:string | null;
  installmentMonths: number[]; 
  installmentOptions?:{months:number;monthlyPrice:number}[]
  isAction: boolean; 
  actionTextAz: string | null; 
  actionTextRu: string | null;
  actionTextEn: string | null;
}