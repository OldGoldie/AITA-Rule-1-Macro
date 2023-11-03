# AITA-Rule-1-Macro

Adds a "RULE 1" button to comments in the AITA mod queue on old reddit. Pressing the button performs 3 actions in one click: Removes the comment, Adds a "R1" note to the user and comments a civility removal reason as the subreddit. **Right now, this only supports Chromium browsers**

It can be modified to support other subreddits, but everything is hardcoded and it's not intended to support more than one.

If you have stumbled across this repo and want to use it on another subreddit, you will need to edit the ``subreddit.toLowerCase()`` check and the ``var removalMessage`` in contentScript.

# Installation

1. Download the code as a zip.
2. Unzip it into a folder.
3. Open the extensions list (eg: chrome://extensions/ or brave://extensions/)
4. Turn on Developer Mode (in the top right)
5. Click on "Load unpacked" and select the folder with all of the code.
6. It should now be loaded; you should see the "Comment Macro" extension. Restart your browser and it should function properly.

# Usage and Demo

Simply open up the modqueue, and press "RULE 1" to action the comment.

![Demo](https://github.com/OldGoldie/AITA-Rule-1-Macro/assets/20398111/c6d3119d-1ab6-4f58-9572-df4354909154)

