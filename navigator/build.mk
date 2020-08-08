# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

ifndef COMM_BUILD
installer:
	@$(MAKE) -C application/navigator/installer installer

package:
	@$(MAKE) -C application/navigator/installer

package-compare:
	@$(MAKE) -C application/navigator/installer package-compare

install::
	@$(MAKE) -C application/navigator/installer install

source-package::
	@$(MAKE) -C application/navigator/installer source-package

upload::
	@$(MAKE) -C application/navigator/installer upload

source-upload::
	@$(MAKE) -C application/navigator/installer source-upload


# mochitests need to be run from the Mozilla build system
ifdef ENABLE_TESTS
# Backend is implemented in mozilla/testing/testsuite-targets.mk.
# This part is copied from mozilla/browser/build.mk.

mochitest-browser-chrome:
	$(RUN_MOCHITEST) --browser-chrome
	$(CHECK_TEST_ERROR)

mochitest:: mochitest-browser-chrome

.PHONY: mochitest-browser-chrome
endif
endif
