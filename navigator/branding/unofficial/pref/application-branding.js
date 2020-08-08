#filter substitution

#define BINOC_URL binaryoutcast.com
#define BINOC_PROJECT projects/@MOZ_APP_NAME@
#define BRANDING_APPUPDATEPATH ?component=aus&application=%PRODUCT%&schema=2&version=%VERSION%&arch=%BUILD_TARGET%&flavor=%BUILD_SPECIAL%&toolkit=%WIDGET_TOOLKIT%&buildid=%BUILD_ID%&channel=%CHANNEL%

// Base URL for web-based support pages.
pref("app.support.baseURL", "https://@BINOC_URL@/@BINOC_PROJECT@/support/");

// Update service URL:
/*
%PRODUCT%
%VERSION%
%BUILD_ID%
%BUILD_TARGET%
%LOCALE%
%CHANNEL%
%OS_VERSION%

*/
pref("app.update.url", "https://@BINOC_URL@/@BRANDING_APPUPDATEPATH@");
// URL user can browse to manually if for some reason all update installation
// attempts fail.
pref("app.update.url.manual", "https://@BINOC_URL@/@BINOC_PROJECT@/download/");
// A default value for the "More information about this update" link
// supplied in the "An update is available" page of the update wizard.
pref("app.update.url.details", "https://@BINOC_URL@/@BINOC_PROJECT@/release-notes/");

pref("browser.throbber.url","https://@BINOC_URL@/@BINOC_PROJECT@/");

// Preferences for AMO integration
#define AM_DOMAIN borealis-addons.binaryoutcast.com
#define AM_AUS_ARGS reqVersion=%REQ_VERSION%&id=%ITEM_ID%&version=%ITEM_VERSION%&maxAppVersion=%ITEM_MAXAPPVERSION%&status=%ITEM_STATUS%&appID=%APP_ID%&appVersion=%APP_VERSION%&appOS=%APP_OS%&appABI=%APP_ABI%&locale=%APP_LOCALE%&currentAppVersion=%CURRENT_APP_VERSION%&updateType=%UPDATE_TYPE%&compatMode=%COMPATIBILITY_MODE%

// Preferences for AMO integration
pref("extensions.getAddons.cache.enabled", false);
pref("extensions.getAddons.maxResults", 10);
pref("extensions.getAddons.get.url", "https://@AM_DOMAIN@/?component=integration&type=internal&request=get&addonguid=%IDS%&os=%OS%&version=%VERSION%");
pref("extensions.getAddons.getWithPerformance.url", "https://@AM_DOMAIN@/?component=integration&type=internal&request=get&addonguid=%IDS%&os=%OS%&version=%VERSION%");
pref("extensions.getAddons.search.browseURL", "http://@AM_DOMAIN@/search/?terms=%TERMS%");
pref("extensions.getAddons.search.url", "https://@AM_DOMAIN@/?component=integration&type=internal&request=search&q=%TERMS%&locale=%LOCALE%&os=%OS%&version=%VERSION%");
pref("extensions.webservice.discoverURL", "http://@AM_DOMAIN@/?component=discover");
pref("extensions.getAddons.recommended.url", "https://@AM_DOMAIN@/?component=integration&type=internal&request=recommended&locale=%LOCALE%&os=%OS%");
pref("extensions.getAddons.browseAddons", "http://@AM_DOMAIN@/");
pref("extensions.getAddons.recommended.browseURL", "http://@AM_DOMAIN@/?component=integration&type=external&request=recommended");

// Blocklist preferences
pref("extensions.blocklist.enabled", true);
pref("extensions.blocklist.interval", 86400);
// %APP_ID%/%APP_VERSION%/%PRODUCT%/%BUILD_ID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/
pref("extensions.blocklist.url", "https://@BINOC_URL@/?component=blocklist&id=%APP_ID%&channel=%CHANNEL%");
pref("extensions.blocklist.detailsURL", "https://addons.mozilla.org/%LOCALE%/%APP%/blocked/");
pref("extensions.blocklist.itemURL", "https://blocklist.addons.mozilla.org/%LOCALE%/%APP%/blocked/%blockID%");

// Symmetric (can be overridden by individual extensions) update preferences.
// e.g.
//  extensions.{GUID}.update.enabled
//  extensions.{GUID}.update.url
//  .. etc ..
//
pref("extensions.update.enabled", true);
pref("extensions.update.url", "http://@AM_DOMAIN@/?component=aus&@AM_AUS_ARGS@");
pref("extensions.update.interval", 86400);  // Check for updates to Extensions and 
                                            // Themes every day

pref("xpinstall.whitelist.add", "borealis-addons.binaryoutcast.org,addons.binaryoutcast.com,addons.thunderbird.net");
pref("xpinstall.whitelist.required", false);
// Allow installing XPI add-ons by direct URL requests (no referrer)
pref("xpinstall.whitelist.directRequest", true);
// Allow installing XPI add-ons from file referrers (chrome/file)
pref("xpinstall.whitelist.fileRequest", true);

pref("extensions.install.requireBuiltInCerts", false);
// Only allow installation of extensions from https, chrome or file schemes
pref("extensions.install.requireSecureOrigin", false);

pref("browser.search.searchEnginesURL", "https://@AM_DOMAIN@/search-plugins/");

pref("geo.wifi.uri", "https://pro.ip-api.com/json/?fields=lat,lon,status,message&key=Xo7pBl68uXPzeOs");

pref("browser.geolocation.warning.infoURL", "https://@BINOC_URL@/@BINOC_PROJECT@/support/");

pref("toolkit.mozprotocol.url", "https://@BINOC_URL@/");

#include uaoverrides.inc