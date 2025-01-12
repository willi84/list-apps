#!/bin/bash


# #!/usr/bin/env bash
# # change dir with a path form args
# # Usage: cd.sh path
# # Example: cd.sh /home/user

# # echo "Changing dir to '$1' now"
# # cd $1

# echo "ru cd.sh"
# cd $1
# pwd

cd src || { echo "Failed to change directory to $1"; exit 1; }
# cd "$1" || { echo "Failed to change directory to $1"; exit 1; }
echo "Changed directory to: $(pwd)"