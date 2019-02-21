# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

package:
	cd $(DIST)/bin; \
  zip -Dr9X ../${PROFILESWITCHER_XPI_NAME}-${PROFILESWITCHER_VERSION}.xpi * -x \*/.mkdir.done; \
