from PIL import Image, ImageDraw

img1 = Image.open('khepri.png')
img2 = Image.open('khepri.png')

r = 200
x = img1.width/2
y = img1.height/2
ImageDraw.Draw(img1).ellipse((x-r, y-r, x+r, y+r), fill=(0,0,0))

img = Image.blend(img1, img2, alpha=.25)
img.save('123.png')
img.show()