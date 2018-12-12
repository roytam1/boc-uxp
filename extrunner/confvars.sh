#! /bin/sh
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# Application
MOZ_APP_BASENAME=ExtRunner
MOZ_APP_NAME=extRunner
MOZ_APP_VENDOR=BinOC
MOZ_APP_ID=extrunner@projects.binaryoutcast.com
MOZ_APP_STATIC_INI=1
MOZ_APP_VERSION=1.0.0a1
MOZ_APP_VERSION_DISPLAY=$MOZ_APP_VERSION
#MOZ_BRANDING_DIRECTORY=mail/branding/unofficial
#MOZ_OFFICIAL_BRANDING_DIRECTORY=mail/branding/official
#MOZ_PROFILE_MIGRATOR=1

# Platform build options
MOZ_PLACES=1
MOZ_JSDOWNLOADS=1
MOZ_SEPARATE_MANIFEST_FOR_THEME_OVERRIDES=1
MOZ_SAFE_BROWSING=
MOZ_SERVICES_SYNC=
MOZ_SERVICES_COMMON=
MOZ_SERVICES_CLOUDSYNC=
MOZ_SERVICES_HEALTHREPORT=
MOZ_JETPACK=
MOZ_DEVTOOLS_SERVER=
MOZ_DEVTOOLS=
MOZ_GAMEPAD=
MOZ_NECKO_WIFI=
MOZ_AV1=
MOZ_WEBRTC=

# This should usually be the same as the value MAR_CHANNEL_ID.
# If more than one ID is needed, then you should use a comma separated list
# of values.
ACCEPTED_MAR_CHANNEL_IDS=release,unstable
# The MAR_CHANNEL_ID must not contain the following 3 characters: ",\t "
MAR_CHANNEL_ID=release
