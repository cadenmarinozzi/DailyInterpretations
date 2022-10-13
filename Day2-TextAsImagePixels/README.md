# Day 2

Text as image pixels.

# Original

There is no original inspiration for this project, it just came to mind.

# Implementation

Basically you start with an image, and go throug the pixels of the image in chunks. Then for each chunk you average out the pixel values, then you take the average and map it to a character in a density character set, something like `.,-~:;=!*$&@#`. Then you plot out the characters in a grid, and you have your image. Any combination of characters can be used.