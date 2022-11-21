# Contribution
## Introduction

It is assumed that you know a little about node.js and git. If not, [here's some help to get started with git](https://help.github.com/en/github/using-git) and [here’s some help to get started with node.js](https://nodejs.org/en/docs/guides/getting-started-guide/). You will also need to run a static file server of your choice. If you are using Visual Studio Code, it is recommended to install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer/) plugin for VS Code, or you can follow many other tutorials you can find [online](https://www.google.com/search?q=how+to+run+a+static+file+server).

* Install [Git](https://git-scm.com/)
* Install [Node.js](https://nodejs.org/)
* Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) 
* [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) Io-Gui
* Open your OS’s terminal
* Change into the directory you’d like
* Clone your forked repo
      
      git clone https://github.com/[yourgithubname]/io-gui/io.git

* Go into the `io` directory.

      cd ./io

* Install dev dependencies and start the typescript watch script with:

      yarn && yarn dev

* Configure static file server to serve files from `io` directory.

## Next Steps

You can build io-gui and bundle it into a single file with:

      yarn build

Details of what exactly is being executed with the `build` script can be found in [package.json](https://github.com/io-gui/io/blob/main/package.json).

You can generate documentation with:

      yarn docs

You can check if the code complies with linting rules by running:

      yarn lint

## Advices

While making changes to files from this git repo it is good to follow some basic [guidelines](https://git-scm.com/book/en/v2/GitHub-Maintaining-a-Project). Some of those guidelines can be found below.

* Update your local repo

````bash
git pull https://github.com/[yourgithubname]/io-gui/io.git
git push
````

* Make a new branch from the dev branch

````bash
git checkout dev
git branch mychangesbranch
git checkout mychangesbranch
````

* Add your changes to your commit.
* Push the changes to your forked repo.
* Open a Pull Request (PR)

## Important notes:

* Don't include any build files in your commit unless you are building a new release.
* Making changes may require changes to the documentation.
* If you make a PR, but it is not actually ready to be pulled into the dev branch, then please [convert it to a draft PR](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/changing-the-stage-of-a-pull-request#converting-a-pull-request-to-a-draft).

This file has been modified from [three.js contributing guide](https://github.com/mrdoob/three.js/blob/dev/.github/CONTRIBUTING.md).