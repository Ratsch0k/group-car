#!/bin/bash
set -e

# import ssh key
mkdir ~/.ssh
echo "$SSH_KEY" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519

echo "$SERVER_IP $SSH_KEY_PUBLIC" > ~/.ssh/known_hosts