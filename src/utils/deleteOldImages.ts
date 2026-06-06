import fs from "fs";
import path from "path";

// Çoxlu şəkilləri sil
export function deleteManyOldImages(imagePaths: string[]): void {
  imagePaths.forEach((item: string) => {
    const fullImagePath: string = path.join(item);
    fs.unlink(fullImagePath, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.log("An error occurred while deleting the many images:", err);
      } else {
        console.log("Old many images deleted successfully");
      }
    });
  });
}

// Tək şəkli sil
export function deleteSingleOldImage(imagePath: string | null | undefined): void {
  if (!imagePath) return;
  const fullImagePath: string = path.join(imagePath);
  fs.unlink(fullImagePath, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      if (err) console.log("An error occurred while deleting the single image:", err);
    } else {
      console.log("Old single image deleted successfully");
    }
  });
}