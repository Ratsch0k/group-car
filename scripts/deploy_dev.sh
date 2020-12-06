#!/bin/bash
set -e

# import ssh key
mkdir ~/.ssh
echo "$SSH_KEY" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519

# Test ssh
ssh $SERVER_USER@$SERVER_IP

# change to build directory
cd build

# Replace existing html directory with updated one
rsync --recursive --times --compress --delete --quiet ./ $SERVER_USER@$SERVER_IP:$SERVER_HTML_PATH_DEV