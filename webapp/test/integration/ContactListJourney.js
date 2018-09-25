sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("ContactList");

	opaTest("Should see the table", function(Given, When, Then) {
		// Arrangements
		When.onTheBrowser.iPressOnTheBackwardsButton();
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);

		When.onTheObjectPage.iPressIconTabItem(1);
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheContactListPage.iShouldSeeTheContactTable();
	});

	opaTest("Should see the TG create window", function(Given, When, Then) {

		//Actions
		When.onTheContactListPage.iPressTGButtonInTable();

		// Assertions
		Then.onTheContactListPage.iShouldSeeTheTargetGroupPopOver();

		When.onTheContactListPage.iCancelButtonPress();

		// Assertions
		Then.onTheContactListPage.iShouldSeeTheContactTable();

	});

	opaTest("Should see the filter window", function(Given, When, Then) {

		//Actions
		When.onTheContactListPage.iPressFilterButtonInTable();

		// Assertions
		Then.onTheContactListPage.iShouldSeeTheFilterPopOver();

		When.onTheContactListPage.iFilterCancelButtonPress();

		// Assertions
		Then.onTheContactListPage.iShouldSeeTheContactTable();

	});

	// opaTest("Should see the personalize window", function(Given, When, Then) {

	// 	//Actions
	// 	When.onTheContactListPage.iPressPerButtonInTable();

	// 	// Assertions
	// 	Then.onTheContactListPage.iShouldSeeTheContactTable();

	// 	When.onTheContactListPage.iPerCancelButtonPress();

	// 	// Assertions
	// 	Then.onTheContactListPage.iShouldSeeTheContactTable();

	// });

});