/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mozilla/ModuleUtils.h"
#include "nsSuiteDirectoryProvider.h"
#include "nsNetCID.h"
#include "nsRDFCID.h"
#include "nsFeedSniffer.h"

/////////////////////////////////////////////////////////////////////////////

NS_GENERIC_FACTORY_CONSTRUCTOR(nsSuiteDirectoryProvider)
NS_GENERIC_FACTORY_CONSTRUCTOR(nsFeedSniffer)

NS_DEFINE_NAMED_CID(NS_SUITEDIRECTORYPROVIDER_CID);
NS_DEFINE_NAMED_CID(NS_FEEDSNIFFER_CID);

/////////////////////////////////////////////////////////////////////////////

static const mozilla::Module::CIDEntry kSuiteCIDs[] = {
  { &kNS_SUITEDIRECTORYPROVIDER_CID, false, NULL, nsSuiteDirectoryProviderConstructor },
  { &kNS_FEEDSNIFFER_CID, false, NULL, nsFeedSnifferConstructor },
  { NULL }
};

static const mozilla::Module::ContractIDEntry kSuiteContracts[] = {
  { NS_SUITEDIRECTORYPROVIDER_CONTRACTID, &kNS_SUITEDIRECTORYPROVIDER_CID },
  { NS_FEEDSNIFFER_CONTRACTID, &kNS_FEEDSNIFFER_CID },
  { NULL }
};

static const mozilla::Module::CategoryEntry kSuiteCategories[] = {
  { XPCOM_DIRECTORY_PROVIDER_CATEGORY, "suite-directory-provider", NS_SUITEDIRECTORYPROVIDER_CONTRACTID },
  { NS_CONTENT_SNIFFER_CATEGORY, "Feed Sniffer", NS_FEEDSNIFFER_CONTRACTID },
  { NULL }
};

static const mozilla::Module kSuiteModule = {
  mozilla::Module::kVersion,
  kSuiteCIDs,
  kSuiteContracts,
  kSuiteCategories
};

NSMODULE_DEFN(SuiteModule) = &kSuiteModule;
