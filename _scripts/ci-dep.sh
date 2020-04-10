#!/bin/bash
set -ev

# encrypt key
openssl aes-256-cbc -K $encrypted_e9ce4c9f2f9f_key -iv $encrypted_e9ce4c9f2f9f_iv -in deploy-key.enc -out deploy-key -d
rm deploy-key.enc
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa

# change to build directory, initialize local repository and push to server
cd build

# Delete files on server
ssh $SERVER_USER@$SERVER_IP rm -R $SERVER_HTML_PATH/*

# Copy build to server
scp -r $PWD/* $SERVER_USER@$SERVER_IP:$SERVER_HTML_PATH