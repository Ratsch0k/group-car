#!/bin/bash
set -e

# change to build directory
cd build

# Replace existing html directory with updated one
rsync --recursive --times --compress --delete --quiet ./ $SERVER_USER@$SERVER_IP:$SERVER_HTML_PATH