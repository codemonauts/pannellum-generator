# pannellum-generator
Small tool to quickly generate an interactive tour from 360° panorama images with [Pannellum](https://pannellum.org/) including a handy in-browser editor to add hotspots to the images.

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Provide footage](#provide-footage)
    * [Generate HTML Code](#generate-the-html-code)
    * [Use a Backend for persistent editing](#persistent-mode)

## Requirements

  * python3 with the jinja2 package

Having `cjpeg` (CLI tool for mozjpg) is optional and will be used if available to reduze the image size.


## Usage
### Provide footage
If you used a Insta360 Pro2 to shot your images and you had the "Real-time stitching" button in the mobile app activated, the camera generated a preview panorama image which we can directly use for the tour. This is e.g. pretty neat when you are still at the customers site and want to show something to them. Connect your camera to the network (or join the cameras wifi with your laptop) and mount the Samba share. Then run:
```
./import.sh /path/to/the/mounted/camera/
```
It doesn't matter which folder level you exactly provide because the tool will run through it recursively and just look for all files called **pano.jpg**.

If you have image from an other source, just copy them into the **out/assets** folder.

Keep in mind that the name of the images will be used to generate the single scenes in the tour so renaming **pano-34980.jpg** to something meaningful like **office_main-entrance.jpg** could be helpful ;)

### Generate the HTML code
When all your images are in the assets folder and are named correctly, the last step is to run
```
./generate.sh
```
This will generate the index.html with the generated structure needed for all the scenes in Pannellum. After the generation a small webserver is started on port 8000 so you can fire up you browser and start to browse the tour and begin adding hotspots with informations and scene changes. When you are finished you can take the final Pannellum structure from the gray box on the right which includes all the scenes with all the hotspots you just created and put this into your website.

### Persistent mode
Beacuse we had the usecase that the customer wanted to take a look at the images and provide the hotspots themselfs we added a mode where the user can add new info hotspots to the panorama and they directly get send to an API which saves the hotspot data to a table in DynamoDB (We used this, because it's nearly free with super low traffic applications like this when run in 'on-demand' mode). The API needs to provide one endpoint which returns a list of all hotspots on GET and accepts single new hotspots on POST. Take a look at the `lambda.py` for an example AWS Lambda function which we used.

To switch from the local edting mode to this mode you have to modify the includes on the bottom of the generated index.html file. Comment out the editor.js and include the two script blocks beneath it and add the URL to your backend.
