from PIL import Image
import os

source_path = "/Users/ahn/.gemini/antigravity/brain/b4ebc50a-8cef-47c8-be66-d61d170e7ba2/hero_girl_zoomed_out_1770505344194.png"
output_path = "/Volumes/FILE/SAT/Practix/_Sever/images/hero_girl_mobile_perfect.png"

def crop_perfect():
    try:
        img = Image.open(source_path)
        width, height = img.size
        
        # 43% Crop: Strips the bed (which was visible at 35%) 
        # but keeps the girl (who was cut at 50%).
        left = int(width * 0.43)
        right = width
        top = 0
        bottom = height
        
        box = (left, top, right, bottom)
        cropped_img = img.crop(box)
        cropped_img.save(output_path)
        print(f"Perfect Crop (43%): Saved {cropped_img.size} to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    crop_perfect()
