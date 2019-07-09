#!/bin/sh

git_setup() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

git_commit() {
  git checkout -b ${$TRAVIS_BRANCH}
  git add dist
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

git_push() {
  git remote add origin https://${GH_TOKEN}@github.com/io-gui/io.git > /dev/null 2>&1
  git push --quiet --set-upstream origin ${$TRAVIS_BRANCH}
}

if [ "$TRAVIS_BRANCH" == "master" ]; then
  git_setup
  git_commit
  git_push
fi
