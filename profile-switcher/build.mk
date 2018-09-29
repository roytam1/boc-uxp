# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

package:
	cd $(DIST)/bin; \
  zip -Dr9X ../${ADDON_XPI_NAME}-${ADDON_VERSION}.xpi * -x \*/.mkdir.done; \
