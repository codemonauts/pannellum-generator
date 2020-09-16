#! /usr/bin/env bash
use_cp(){
    cp "$1" $2
}

use_cjpeg(){
    echo $1
    cjpeg -baseline "$1" > $2
}

if [ -z "$1" ]; then
    echo "Please provide the path to the sdcard folder of the camera"
    exit 1
fi
set -eu

SD_CARD=$1
COPY_COMMAND="use_cp"

# If we have cjpg installed we can use this to copy the images
if command -v cjpeg &> /dev/null; then
    echo "Found cjpeg in your PATH. Will automatically optimize the images"
    COPY_COMMAND="use_cjpeg"
fi

# Find all preview images on the sdcard
for IMG in $(find "$1" -name "pano.jpg"); do
    $COPY_COMMAND "$IMG" out/assets/pano-$RANDOM.jpg;
done

echo "##########"
echo "Please rename all images in the 'out/assets/' folder before running the generate script"
echo "##########"
