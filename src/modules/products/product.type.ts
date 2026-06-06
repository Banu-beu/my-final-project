export interface ProductAttributes {
  id: number;
  slug: string; // URL üçün 
  //images: string; 
  titleAz: string;
  titleRu: string;
  titleEn: string;
  descriptionAz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  price: number; 
  discountPrice: number | null; //kohne qiymet
  //categoryId: number;
  //brandId: number;
  stock: number;
  installmentPrice: number; // Aylıq taksit ödənişi
  //installmentMonths: string; // Keçərli olan aylar
  isAction: boolean; // Kampaniyadadir?
  actionTextAz: string | null; // Kampaniya yazısı (məs: "0 0 18 ay")
  actionTextRu: string | null;
  actionTextEn: string | null;
  rating: number;
  reviewCount: number; // Rəy sayı
}