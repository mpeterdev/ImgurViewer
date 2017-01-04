# Imgur Viewer
A chrome extension to provide better Imgur album/gallery viewing with images zoomed to fit the window and easy navigation.

It uses the Imgur API to access images beyond the first few that are loaded by default for large albums. It also preloads the upcoming images in the album so that while you are looking at one, the next few are readied in the background and you don't have to wait each time you advance.

## Opening the viewer
Whenever you are on an Imgur page that is recognized as an album, the viewer button will appear in the header, like this:

![Viewer button](assets/viewerButton.png)

## Navigation
The arrow keys are unavailable because, by default, Imgur uses them to navigate between posts. This extension offers two choices to move between images: vim style and game style.

##### Vim Style
Left&nbsp;&nbsp;&nbsp;: h  
Right&nbsp;: l

##### Game style
Left&nbsp;&nbsp;&nbsp;: a  
Right&nbsp;: d


Thats basically it for navigation. You can also exit the viewer by hitting ESC or clicking outside an image. I am open to adding more keys, but nothing else seems necessary at the moment.


### That's all
I hope you find this extension useful. I made it for fun and out of some slight frustration that, for some reason, Imgur seems to hate the slideshow viewing mode and has repeatedly cut it out of their feature set.

Enjoy
