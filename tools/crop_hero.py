from PIL import Image
import os

source_path = "/Users/ahn/.gemini/antigravity/brain/b4ebc50a-8cef-47c8-be66-d61d170e7ba2/hero_girl_no_bed_landscape_1770514659900.png"
output_path = "/Volumes/FILE/SAT/Practix/_Sever/images/hero_girl_mobile_final_v2.png"

def crop_final_landscape():
    try:
        img = Image.open(source_path)
        width, height = img.size
        
        # In this gen: iPad is at ~30-50%, Girl is at ~50-80%
        # Let's crop from 30% to 90% (Includes iPad + Girl)
        left = int(width * 0.30)
        right = int(width * 0.90)
        top = 0
        bottom = height
        
        box = (left, top, right, bottom)
        cropped_img = img.crop(box)
        cropped_img.save(output_path)
        print(f"Final Landscape Crop: Saved {cropped_img.size} to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    crop_final_landscape()
