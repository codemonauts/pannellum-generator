#! /usr/bin/env bash
use_cp(){
    cp $1 $2
}

use_cjpeg(){
    cjpeg -baseline $1 > $2
}

if [ -z $1 ]; then
    echo "Please provide the path to the sdcard folder of the camera"
    exit 1
fi
set -eu

SD_CARD=$1
COPY_COMMAND="use_cp"

# If we have cjpg installed we can use this to copy the images
if command -v cjpeg &> /dev/null; then
    COPY_COMMAND="use_cjpeg"
fi

# Get all stitched images from the sdcard
for IMG in $(find "$1" -name "pano.jpg"); do
    echo "Copying $IMG..."
    $COPY_COMMAND $IMG out/assets/pano-$RANDOM.jpg;
done

# Wait for user to rename the images
echo "Please rename all images in the 'out/assets/' folder"
read -p "Press enter to continue"

echo "Generating index.html"
./generate_html.py

if command -v code &> /dev/null; then
    echo "Opening generated index.html in VSCode"
    code out/index.html
fi

echo "Starting webserver"
python3 -m http.server --bind 0.0.0.0 --directory out/ 8000
