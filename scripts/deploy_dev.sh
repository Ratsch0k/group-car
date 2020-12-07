#!/bin/bash
set -e

# Test ssh
ssh $SERVER_USER@$SERVER_IP

# change to build directory
cd build

# Replace existing html directory with updated one
rsync --recursive --times --compress --delete --quiet ./ $SERVER_USER@$SERVER_IP:$SERVER_HTML_PATH_DEV