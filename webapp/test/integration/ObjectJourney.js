sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Object");

	opaTest("Should see the busy indicator on object view after metadata is loaded", function(Given, When, Then) {
		// Arrangements
		//	Given.iStartMyApp();

		//	When.onTheBrowser.iRestartTheApp();
		//Actions
		//			When.onTheWorklistPage.iLookAtTheScreen();
		
		Given.iStartMyApp();
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();
		//Then.onTheWorklistPage.theTableHasEntries();
		//Then.onTheWorklistPage.theTableShouldHaveAllEntries();
       //When.onTheWorklistPage.iCloseDialog();         
    	//
    	
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);
		
		// When.onTheBrowser.iRestartTheAppWithTheRememberedItem({
		// 	delay: 1000
		// });


		// Assertions
		Then.onTheObjectPage.iShouldSeeTheObject();

		//	and.iShouldSeeTheRememberedObject();
	});

	opaTest("Should check the 3 status ", function(Given, When, Then) {
		// Arrangements

		//Actions
		// When.onTheBrowser.iPressOnTheBackwardsButton();
		// 	When.onTheWorklistPage.iRememberTheItemAtPosition(0);
		// 	Then.onTheObjectPage.iShouldSeeTheObject();
		// // When.onTheBrowser.iRestartTheAppWithTheRememberedItem({
		// // 	delay: 1000
		// // });
		// When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// // Assertions
		// Then.onTheObjectPage.iShouldSeeTheObject();

		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("inPreparation");

		When.onTheObjectPage.iPressInPrepareButton();
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheObjectPage.iShouldSeeThePage();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("active");

		When.onTheObjectPage.iPressActiveButton();
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheObject();

		// When.onTheObjectPage.iWaitUntilTheButtonIsVisible("archive");
		// When.onTheObjectPage.iPressArchiveButton();

		// When.onTheObjectPage.iClickCancelInMsgBox();
		// When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Edit");

		// Then.onTheObjectPage.iShouldSeeTheObject();

		// When.onTheObjectPage.iPressArchiveButton();

		// Then.onTheObjectPage.iShouldSeeTheObject();

		//	and.iShouldSeeTheRememberedObject();
	});

	opaTest("Edit ", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheObjectPage.iPressTheBackButton();
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);
		Then.onTheObjectPage.iShouldSeeTheObject();

		// });
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Edit");
		When.onTheObjectPage.iPressEditButton();
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		//	Then.onTheObjectPage.iShouldSeeThePage();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Footer-CancelButton");

		When.onTheObjectPage.iPressCancelButton();
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheObjectPage.iShouldSeeThePage();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Edit");

		When.onTheObjectPage.iPressEditButton();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Footer-SaveButton");
		When.onTheObjectPage.iEditSomething();
		When.onTheObjectPage.iPressSaveButton();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("detailDAObjectHeader");

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheObject();

		//	and.iShouldSeeTheRememberedObject();
	});

	opaTest("Web Link Click ", function(Given, When, Then) {
		// Arrangements

		//Actions

		// });
		// When.onTheBrowser.iPressOnTheBackwardsButton();
		//	When.onTheWorklistPage.iRememberTheItemAtPosition(0);
		//		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();
		//		Then.onTheObjectPage.iShouldSeeTheDialog();
		When.onTheObjectPage.iPressWebUrlLink();
		When.onTheObjectPage.iWaitUntilTheDialogIsVisible();
		Then.onTheObjectPage.iShouldSeeTheDialog();

		// Assertions

		When.onTheObjectPage.iCloseWebUrlDial();

		// // Assertions
		Then.onTheObjectPage.iShouldSeeThePage();

		//	and.iShouldSeeTheRememberedObject();
	});

	opaTest("test workprotect ", function(Given, When, Then) {
		// Arrangements

		//Actions

		// });
		// When.onTheBrowser.iPressOnTheBackwardsButton();
		//	When.onTheWorklistPage.iRememberTheItemAtPosition(0);
		//		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();
		//		Then.onTheObjectPage.iShouldSeeTheDialog();
		When.onTheObjectPage.iPressEditButton();
		//When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		//	Then.onTheObjectPage.iShouldSeeThePage();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Footer-CancelButton");
		When.onTheObjectPage.iPressTheBackButton();
		Then.onTheObjectPage.iShouldSeeTheWPDialog();
		When.onTheObjectPage.iClickCancelInMsgBox();
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);
		//When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheObject();

		When.onTheObjectPage.iPressEditButton();
		//When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		//	Then.onTheObjectPage.iShouldSeeThePage();
		When.onTheObjectPage.iWaitUntilTheButtonIsVisible("Footer-CancelButton");
		When.onTheObjectPage.iPressInPrepareButton();
		//When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();
		Then.onTheObjectPage.iShouldSeeTheWPDialog();
		When.onTheObjectPage.iClickCancelInMsgBox();
		Then.onTheObjectPage.iShouldSeeTheObject();
		// When.onTheObjectPage.iPressArchiveButton();
		// When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();
		// Then.onTheObjectPage.iShouldSeeTheWPDialog();
		// When.onTheObjectPage.iClickCancelInMsgBox();
		// Then.onTheObjectPage.iShouldSeeTheObject();

		// Assertions

		//	and.iShouldSeeTheRememberedObject();
	});

	// opaTest("Go to other icons ", function(Given, When, Then) {
	// 	// When.onTheBrowser.iPressOnTheBackwardsButton();
	// 	// When.onTheWorklistPage.iRememberTheItemAtPosition(0);

	// 	When.onTheObjectPage.iPressIconTabItem(1);
	// 	When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

	// 	// Assertions
	// 	Then.onTheObjectPage.iShouldSeeThePage();

	// 	When.onTheObjectPage.iPressIconTabItem(2);
	// 	When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

	// 	// Assertions
	// 	Then.onTheObjectPage.iShouldSeeThePage();

	// 	When.onTheObjectPage.iPressIconTabItem(3);
	// 	When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

	// 	// Assertions
	// 	Then.onTheObjectPage.iShouldSeeThePage();

	// 	When.onTheObjectPage.iPressIconTabItem(4);
	// 	When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

	// 	// Assertions
	// 	Then.onTheObjectPage.iShouldSeeThePage();

	// });

	// opaTest("Should open the share menu and display the share buttons", function (Given, When, Then) {
	// 	// Actions
	// 	When.onTheObjectPage.iPressOnTheShareButton();

	// 	// Assertions
	// 	Then.onTheObjectPage.iShouldSeeTheShareEmailButton().
	// 		and.iTeardownMyAppFrame();
	// });

});