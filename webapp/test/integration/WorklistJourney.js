sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Worklist");

	// opaTest("navigation back",
	// 	function(Given, When, Then) {
	// 		//Actions
	// 		When.onTheWorklistPage.iPressTheBackButton().
	// 			//	and.iTriggerRefresh();

	// 		// Assertions
	// 		Then.onTheWorklistPage.iTeardownMyAppFrame();
	// 	});

	opaTest("Should see the table with all entries", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		//Actions
		When.onTheWorklistPage.iLookAtTheScreen();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheTable();
		//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

	opaTest("Should see the table with some entries after clicking type account", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheWorklistPage.iClickIconTab("WEC");

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();

		//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

	opaTest("Should see the table with all entries after clicking all account", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheWorklistPage.iClickIconTab("ALL");

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();
		//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

	opaTest("Should see the table with no entries after clicking my segment button", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheWorklistPage.iClickSegmentButton("MyPas");

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();

		//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

	opaTest("Should see the table with all entries after clicking all segment button", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheWorklistPage.iClickSegmentButton("AllPas");

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();

		//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	});
	
		opaTest("Search for the First object should deliver results that contain the firstObject in the name", function(Given, When, Then) {
		//Actions
		When.onTheWorklistPage.iSearchForTheFirstObject();

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();
	});

	opaTest("Create Account Scenario", function(Given, When, Then) {
		// Arrangements

		//Actions
		When.onTheWorklistPage.iCreateButtonPress();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheCreateDialog();

		//Actions
		When.onTheWorklistPage.iCreateCancelButtonPress();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheTable();
		//Actions
		When.onTheWorklistPage.iCreateButtonPress();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheCreateDialog();

		//Actions
		When.onTheWorklistPage.iTileClick();

		//

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheCreateDialogAndOk();

		//Actions
		// 			When.onTheWorklistPage.iCreateInputValue();

		// When.onTheWorklistPage.iCreateErrorPress("test:Alternative Key Check Failed");
		// 	When.onTheWorklistPage.iCreateOkButtonPress();

		// // Assertions
		// Then.onTheWorklistPage.iShouldSeeTheCreateDialog();

		// 	//Actions
		// When.onTheWorklistPage.iCreateErrorPress("test:Invalid appid");

		// // Assertions
		// Then.onTheWorklistPage.iShouldSeeTheCreateDialog();

		// 		//Actions
		// When.onTheWorklistPage.iCreateErrorPress("test");

		// // Assertions
		// Then.onTheWorklistPage.iShouldSeeTheCreateDialog();

		//Actions
		When.onTheWorklistPage.iCreateInputValue(1);
				When.onTheWorklistPage.iCreateOkButtonPress();
				When.onTheWorklistPage.iCreateInputValue(2);
					When.onTheWorklistPage.iCreateCancelButtonPress();
			//	Then.onTheWorklistPage.theTableHasEntries();
				
				
	//	When.onTheWorklistPage.iCreateCancelButtonPress();
		//	When.onTheWorklistPage.iCreateOkButtonPress();

		// Assertions
		Then.onTheWorklistPage.theCreateDialogShouldClosed();
		Then.onTheWorklistPage.iTeardownMyAppFrame();

		//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	});

	// opaTest("Filter and sort the table", function(Given, When, Then) {
	// 	//Actions
	// 	When.onTheWorklistPage.iFilterButtonPress();

	// 	// Assertions
	// 	Then.onTheWorklistPage.iShouldSeeTheFilterDialog();

	// 		When.onTheWorklistPage.iFilterFilterButtonPress();

	// 		When.onTheWorklistPage.iSelectDescFilter(1);

	// 		//Actions
	// 	When.onTheWorklistPage.iFilterInputValue("Digacc");

	// 	//Actions
	// 	When.onTheWorklistPage.iFilterConfirmButtonPress();

	// 	// Assertions
	// 	Then.onTheWorklistPage.iShouldSeeTheFilterDialog();

	// });

	// opaTest("Should see the table with all entries after back and refresh", function(Given, When, Then) {
	// 	// Arrangements

	// 	//Actions
	// 	When.onTheWorklistPage.iPressTheBackButton();
	// 	When.onTheBrowser.iRestartTheApp();

	// 	// Assertions
	// 	Then.onTheWorklistPage.theTableShouldHaveAllEntries();
	// 	//		and.theTitleShouldDisplayTheTotalAmountOfItems();
	// });

	// opaTest(" table personlization", function(Given, When, Then) {
	// 	//Actions
	// 	When.onTheWorklistPage.iPersonalizationButtonPress();

	// 	// Assertions
	// 	Then.onTheWorklistPage.theTableHasEntries();

	// 	// // Assertions
	// 	// Then.onTheWorklistPage.iShouldSeeTheFilterDialog();

	// 	// //Actions
	// 	// When.onTheWorklistPage.iFilterConfirmButtonPress();

	// 	// // Assertions
	// 	// Then.onTheWorklistPage.iShouldSeeTheFilterDialog();

	// });



	// opaTest("Search for all objects with empty string should deliver results of all the objects", function(Given, When, Then) {
	// 	//Actions
	// 	When.onTheWorklistPage.iSearchForAllObjects();

	// 	// Assertions
	// 	Then.onTheWorklistPage.theTableHasEntries();
	// });

	// opaTest("Entering something that cannot be found into search field and pressing search field's refresh should leave the list as it was",
	// 	function(Given, When, Then) {
	// 		//Actions
	// 		When.onTheWorklistPage.iTypeSomethingInTheSearchThatCannotBeFound().
	// 		and.iTriggerRefresh();

	// 		// Assertions
	// 		Then.onTheWorklistPage.theTableHasEntries();
	// 	});

	// opaTest("navigation back",
	// 	function(Given, When, Then) {
	// 		//Actions
	// 		When.onTheWorklistPage.iPressTheBackButton().
	// 			//	and.iTriggerRefresh();

	// 		// Assertions
	// 		Then.onTheWorklistPage.iTeardownMyAppFrame();
	// 	});

	// opaTest("Should open the share menu and display the share buttons", function (Given, When, Then) {
	// 	// Actions
	// 	When.onTheWorklistPage.iPressOnTheShareButton();

	// 	// Assertions
	// 	Then.onTheWorklistPage.iShouldSeeTheShareEmailButton().
	// 		and.iTeardownMyAppFrame();
	// });

	// opaTest("Should see the busy indicator on app view while worklist view metadata is loaded", function (Given, When, Then) {
	// 	// Arrangements
	// 	Given.iStartMyApp({
	// 		delay: 5000
	// 	});

	// 	//Actions
	// 	When.onTheWorklistPage.iLookAtTheScreen();

	// 	// Assertions
	// 	Then.onTheAppPage.iShouldSeeTheBusyIndicatorForTheWholeApp();
	// });

	// opaTest("Should see the busy indicator on worklist table after metadata is loaded", function (Given, When, Then) {
	// 	//Actions
	// 	When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

	// 	// Assertions
	// 	Then.onTheWorklistPage.iShouldSeeTheWorklistTableBusyIndicator().
	// 		and.iTeardownMyAppFrame();
	// });

});