#!/bin/bash
# Credit for this script: https://stackoverflow.com/questions/53924934/can-i-run-my-expo-app-on-multiple-ios-simulators-at-once

declare -a simulators=(  "1B88BDDC-1F1A-4895-9E02-E6D9EF0CB2ED" "7F420951-4F1F-421D-AF72-055B4C7E56C5"
"06BC29B8-5B5C-496A-8FC8-31E029B91B5C" "D6C21895-1046-4BB3-88D7-337D3FC644AA")
# iPhone 8
# iPhone 8 Plus
# iPhone 11
# iPhone 11 Pro Max

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.14.0.tar.app # If this file is not present, please run `npm i -g expo-cli`
    xcrun simctl openurl $i exp://127.0.0.1:19000      
done
