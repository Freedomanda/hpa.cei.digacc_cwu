sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("InteractionAnaly");

	opaTest("Should see the container", function(Given, When, Then) {
		// Arrangements
		When.onTheBrowser.iPressOnTheBackwardsButton();
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);

		When.onTheObjectPage.iPressIconTabItem(3);
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheInteractionAnalyPage.iShouldSeeTheContainer();
	});

	opaTest("test select", function(Given, When, Then) {

		//Actions
		When.onTheInteractionAnalyPage.iPressMeasureSelect(1);

		// Assertions
	Then.onTheInteractionAnalyPage.iShouldSeeTheContainer();

			When.onTheInteractionAnalyPage.iPressMeasureSelect(0);

		// Assertions
	Then.onTheInteractionAnalyPage.iShouldSeeTheContainer();

	});
	
		opaTest("test filter", function(Given, When, Then) {

		//Actions
		When.onTheInteractionAnalyPage.iPressFilterButton();

		// Assertions
	Then.onTheInteractionAnalyPage.iShouldSeeTheFilterDialog();
	
		//Actions
		When.onTheInteractionAnalyPage.iFilterCancelButtonPress();

		// Assertions
	Then.onTheInteractionAnalyPage.iShouldSeeTheContainer();
	
		//Actions
		When.onTheInteractionAnalyPage.iPressFilterButton();

		// Assertions
	Then.onTheInteractionAnalyPage.iShouldSeeTheFilterDialog();
	
		//Actions
		When.onTheInteractionAnalyPage.iFilterSaveButtonPress();

		// Assertions
	Then.onTheInteractionAnalyPage.iShouldSeeTheContainer();

		

	});


	// opaTest("Should see the personalize window", function(Given, When, Then) {

	// 	//Actions
	// 	When.onTheContactListPage.iPressPerButtonInTable();

	// 	// Assertions
	// 	Then.onTheContactListPage.iShouldSeeTheTable();

	// 	When.onTheContactListPage.iPerCancelButtonPress();

	// 	// Assertions
	// 	Then.onTheContactListPage.iShouldSeeTheTable();

	// });

});