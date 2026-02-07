from PIL import Image
import os

source_path = "/Users/ahn/.gemini/antigravity/brain/b4ebc50a-8cef-47c8-be66-d61d170e7ba2/hero_girl_zoomed_out_1770505344194.png"
output_path = "/Volumes/FILE/SAT/Practix/_Sever/images/hero_girl_mobile_no_bed.png"

def crop_bed():
    try:
        img = Image.open(source_path)
        width, height = img.size
        
        # Crop 50% from the left to remove bed/nightstand COMPLETELY
        # "Rotate camera right" = Shift frame right = Cut left
        crop_amount = int(width * 0.50)
        
        # Define box (left, upper, right, lower)
        box = (crop_amount, 0, width, height)
        
        cropped_img = img.crop(box)
        
        # Save
        cropped_img.save(output_path)
        print(f"Successfully cropped {crop_amount}px from left. Saved to {output_path}")
        print(f"New dimensions: {cropped_img.size}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    crop_bed()
