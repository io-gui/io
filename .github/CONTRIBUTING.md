# Contribution
## Introduction

It is assumed that you know a little about node.js and git. If not, [here's some help to get started with git](https://help.github.com/en/github/using-git) and [here’s some help to get started with node.js](https://nodejs.org/en/docs/guides/getting-started-guide/). You will also need to run a static file server of your choice. One of the ways the server can be configured is by installing a plugin [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer/) for Visual Studio Code, or you can follow many other tutorials you can find [online](https://www.google.com/search?q=how+to+run+a+static+file+server).

* Install [Git](https://git-scm.com/)
* Install [Node.js](https://nodejs.org/)
* Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) 
* [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) Io-Gui
* Open your OS’s terminal
* Change into the directory you’d like
* Clone your forked repo

      git clone https://github.com/[yourgithubname]/io-gui/io.git

* Go into the io directory.

      cd ./io

* Install dev dependencies and start the typescript watch script with:

      yarn && yarn dev

* Configure static file server to serve files.

## Next Steps

You can build the files with:

      yarn build

Details of what exactly is being executed with the command above you can find within file [package.json](https://github.com/io-gui/io/blob/main/package.json). You can see there that before we build the files with the mentioned [yarn](https://yarnpkg.com/) command we delete the old files (if they are present). If you just want to clean the old build files you can do it with:

      yarn clean

You can create documentation with:

      yarn docs

You can check the code with:

      yarn lint

While writing the code it is often useful to check the code, clean build files, and watch input files. You can do that with:

      yarn dev

## Advices

While making changes to files from this git repo it is good to follow some basic [guidelines](https://git-scm.com/book/en/v2/GitHub-Maintaining-a-Project). Some of those guidelines can be found below.

* Update your local repo

      git pull https://github.com/[yourgithubname]/io-gui/io.git
      git push

* Make a new branch from the dev branch

      git checkout dev
      git branch [mychangesbranch]
      git checkout [mychangesbranch]

* Add your changes to your commit.
* Push the changes to your forked repo.
* Open a Pull Request (PR)

## Important notes:

* Don't include any build files in your commit.
* Not all new features will need a new example. Simpler features could be incorporated into an existing example. Bigger features may be asked to add an example demonstrating the feature.
* Making changes may require changes to the documentation.
* If you make a PR, but it is not actually ready to be pulled into the dev branch, then please [convert it to a draft PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request#converting-a-pull-request-to-a-draft).

This project is currently contributed mostly via everyone's spare time. Please keep that in mind as it may take some time for the appropriate feedback to get to you. If you are unsure about adding a new feature, it might be better to ask first to see whether other people think it's a good idea.

This file has been created from [this file](https://github.com/mrdoob/three.js/blob/dev/.github/CONTRIBUTING.md).