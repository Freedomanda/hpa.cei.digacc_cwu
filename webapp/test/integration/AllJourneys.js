jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

QUnit.config.timeout = 80000;



sap.ui.require([
		"sap/ui/test/Opa5",
		"hpa/cei/digital_account/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"hpa/cei/digital_account/test/integration/pages/ContactList",
			"hpa/cei/digital_account/test/integration/pages/ContactAnaly",
				"hpa/cei/digital_account/test/integration/pages/InteractionAnaly",
				"hpa/cei/digital_account/test/integration/pages/ShakeNearbyAnaly",
		"hpa/cei/digital_account/test/integration/pages/Worklist",
		"hpa/cei/digital_account/test/integration/pages/Object",
		"hpa/cei/digital_account/test/integration/pages/NotFound",
		"hpa/cei/digital_account/test/integration/pages/Browser",
		"hpa/cei/digital_account/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "hpa.cei.digital_account.view.",
		autoWait : true

	});

	sap.ui.require([
	//	"hpa/cei/digital_account/test/integration/ContactListJourney",
		"hpa/cei/digital_account/test/integration/WorklistJourney",
	//	"hpa/cei/digital_account/test/integration/NotFoundJourney",
		"hpa/cei/digital_account/test/integration/ObjectJourney",
				"hpa/cei/digital_account/test/integration/ContactListJourney",
					"hpa/cei/digital_account/test/integration/ContactAnalyJourney",
						"hpa/cei/digital_account/test/integration/InteractionAnalyJourney",
						"hpa/cei/digital_account/test/integration/ShakeNearByAnalyJourney",
		// "hpa/cei/digital_account/test/integration/NavigationJourney",
		// "hpa/cei/digital_account/test/integration/NotFoundJourney"
		// "hpa/cei/digital_account/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});