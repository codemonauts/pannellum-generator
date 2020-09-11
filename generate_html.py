#! /usr/bin/env python3
from jinja2 import FileSystemLoader, Environment
from os import listdir

template_loader = FileSystemLoader(searchpath=".")
env = Environment(loader=template_loader)
template = env.get_template("template.j2.html")

path = "out/assets"
images = [f for f in listdir(path) if f.endswith(".jpg")]

# Remove the '.jpg'  at the end
scenes = [f[:-4] for f in images]

print("Generated the following scenes:")
print(scenes)

ctx = {"first_scene": scenes[0], "scenes": scenes}

with open("out/index.html", "w") as fh:
    fh.write(template.render(ctx))
