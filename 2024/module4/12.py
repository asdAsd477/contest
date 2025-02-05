from PIL import Image, ImageDraw
from math import hypot

img = Image.open('photo.jpg').convert('RGB')
img2 = Image.open('play.png').convert('RGB')
img2.resize((150, 200))

w,h = img.size
w2,h2 = img2.size

for x in range(w):
    for y in range(h):
        r,g,b = img.getpixel((x,y))
        if r > 250 and g > 250 and b > 250:
            r,g,b = img2.getpixel((x % w2, y % h2))
        img.putpixel((x,y), (r,g,b))

img.show()