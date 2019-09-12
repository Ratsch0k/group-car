#!/bin/bash
#set -x

# Test if branch is master branch
if [ $TRAVIS_BRANCH == "master" ]; then

    # encrypt key
    openssl aes-256-cbc -K $encrypted_e9ce4c9f2f9f_key -iv $encrypted_e9ce4c9f2f9f_iv -in deploy-key.enc -out deploy-key -d
    rm deploy-key.enc
    chmod 600 deploy-key
    mv deploy-key ~/.ssh/id_rsa

    # change to build directory, initialize local repository and push to server
    cd build
    git init

    git remote add deploy "deploy@$SERVER_IP:$SERVER_HTML_PATH"
    git config user.name = "Travis CI"

    git add .
    git commit -m "Deploy Commit: $TRAVIS_COMMIT"
    git push --force deploy master

else
    echo "Not on master branch, not deploying"
fi