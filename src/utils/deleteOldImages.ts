import fs from "fs";
import path from "path";

export function deleteManyOldImages(imagePaths: string[]): void {

 if(!Array.isArray(imagePaths) || imagePaths.length===0){
  console.log("There is no old picture to delete");
  return;
  
 }

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