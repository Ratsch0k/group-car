#!/bin/bash
set -e

# encrypt key
openssl aes-256-cbc -K $encrypted_e9ce4c9f2f9f_key -iv $encrypted_e9ce4c9f2f9f_iv -in deploy-key.enc -out deploy-key -d
rm deploy-key.enc
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa

# change to build directory, initialize local repository and push to server
cd build

# Replace existing html directory with updated one
rsync --recursive --times --compress --delete --quiet ./ $SERVER_USER@$SERVER_IP:$SERVER_HTML_PATH