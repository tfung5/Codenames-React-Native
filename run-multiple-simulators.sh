#!/usr/bin/env bash

# Credit for this script: https://stackoverflow.com/questions/53924934/can-i-run-my-expo-app-on-multiple-ios-simulators-at-once

# The device IDs will differ on every computer and install. You will likely have to find the correct ones in Xcode, or look at what's printed out on the terminal after running this command.

# In the event that your Simulator devices gets deleted or messed up, follow the instructions here to reset them: https://stackoverflow.com/questions/27338042/xcode-simulator-not-coming-up-reinstall-possible/48066998

########################################################
# The following runs 4 simulators of different devices
########################################################

declare -a simulators=("4F02ADA3-365E-4546-8130-25F671BCEA0F" "B5D714E3-5EBB-4392-94B9-EFAAA20CCF0D" "A68E897A-2F43-4D90-BEAA-E63618CA3DB5" "6166093F-ABCC-4929-9521-2F4827A8EE33")
# iPhone X
# iPhone XR
# iPhone 11
# iPhone 11 Pro Max

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.14.0.tar.app # If this file is not present, please run `npm i -g expo-cli`
    xcrun simctl openurl $i exp://127.0.0.1:19000      
done