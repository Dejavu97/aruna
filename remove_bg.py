from PIL import Image
import os

def remove_white_bg(img_path, threshold=220):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return
        
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If the pixel is close to white, make it transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    new_path = img_path.rsplit('.', 1)[0] + '.png'
    img.save(new_path, "PNG")
    print(f"Saved {new_path}")

files = [
    'public/themes/jawa-biru/house.jpg',
    'public/themes/jawa-biru/ornament.jpg',
    'public/themes/jawa-biru/frame.jpg'
]

for f in files:
    remove_white_bg(f)
