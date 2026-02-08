from PIL import Image
import os

source_path = "/Users/ahn/.gemini/antigravity/brain/b4ebc50a-8cef-47c8-be66-d61d170e7ba2/hero_girl_no_bed_final_gen_1770514540654.png"
output_path = "/Volumes/FILE/SAT/Practix/_Sever/images/hero_girl_mobile_final.png"

def crop_final():
    try:
        img = Image.open(source_path)
        width, height = img.size
        
        # In this specific gen: 
        # Girl is on the left, iPad is on the right.
        # Crop to a portrait that includes both.
        # Let's take x=10% to x=90% (80% width)
        left = int(width * 0.10)
        right = int(width * 0.90)
        top = 0
        bottom = height
        
        box = (left, top, right, bottom)
        cropped_img = img.crop(box)
        cropped_img.save(output_path)
        print(f"Final Crop: Saved {cropped_img.size} to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    crop_final()
