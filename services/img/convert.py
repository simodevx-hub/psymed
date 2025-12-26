import os
from PIL import Image

def convert_to_webp(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            file_path = os.path.join(directory, filename)
            img = Image.open(file_path)
            # Create new filename with .webp extension
            new_filename = os.path.splitext(filename)[0] + '.webp'
            new_file_path = os.path.join(directory, new_filename)
            
            print(f"Converting {filename} to {new_filename}...")
            img.save(new_file_path, 'WEBP')
            print("Done.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    convert_to_webp(current_dir)
