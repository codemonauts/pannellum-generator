# pannelum-generator
Small tool to quickly generate an interactive 360° tour in your browser with [Pannellum](https://pannellum.org/) with fotos from an Insta360 Pro2.

The Pro2 generates a new folder for every image you take, with all the 6 (or 12 if RAW is enabled) original images
from every camera including a single 'pano.jpg' when you have `Real-time stitching` enabled in the app. This is an
already stitched equirectangular panorama image. This tool will copy this 'pano.jpg' from every folder, will optimize
it with mozjpg if you have it installed and move it into the `out/assets/` folder. Then you have the chance to rename
all the images to something meaningful. The names from the images then get used as names for the single scenes and a
full boilerplate index.html is generated in the `out/` folder where you now only have to add the missing hotspot to
jump between the scenes.

## Requirements

  * python3 with the jinja2 package

Having `cjpeg` is optional and will be used if available to reduze the image size.


## Usage
Connect the Pro2 either via WiFi or a network cable to your computer and mount the Samba share.
```
./run /path/to/the/mounted/sdcard/
```

It doesn't matter which folder level you exactly provide because the tool will run through it recursively and just look for all files called 'pano.jpg'.
