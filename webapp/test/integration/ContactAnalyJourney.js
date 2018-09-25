sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("ContactAnaly");

	opaTest("Should see the table", function(Given, When, Then) {
		// Arrangements
		When.onTheBrowser.iPressOnTheBackwardsButton();
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);

		When.onTheObjectPage.iPressIconTabItem(2);
		//When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();
		When.onTheContactAnalyPage.iWaitUntilTheContainerIsVisible();

		// Assertions
		Then.onTheContactAnalyPage.iShouldSeeTheContainer();
	});
	
	

	opaTest("test variantmanagement", function(Given, When, Then) {

		//Actions
				When.onTheContactAnalyPage.iChangeChartButton("test-contactAnalysisTable");

		When.onTheContactAnalyPage.iPressVariantSaveButton();
		
				When.onTheContactAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheContactAnalyPage.iShouldSeeTheContainer();

			When.onTheContactAnalyPage.iPressVariantManageButton();
			
					When.onTheContactAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheContactAnalyPage.iShouldSeeTheContainer();

	});
	
		

	opaTest("Filter scenerio", function(Given, When, Then) {

		//Actions
		When.onTheContactAnalyPage.iChangeChartButton("test-contactAnalysisTable");
		
				When.onTheContactAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheContactAnalyPage.iShouldSeeTheContainer();


		When.onTheContactAnalyPage.iClickFilterButton();

		// Assertions
		Then.onTheContactAnalyPage.iShouldSeeTheFilterDialog();
		
			When.onTheContactAnalyPage.iFilterSaveButtonPress();
			
					When.onTheContactAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
		Then.onTheContactAnalyPage.iShouldSeeTheContainer();
		
		When.onTheContactAnalyPage.iClickFilterButton();

		// Assertions
		Then.onTheContactAnalyPage.iShouldSeeTheFilterDialog();
		
			When.onTheContactAnalyPage.iFilterCancelButtonPress();
			
					When.onTheContactAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
		Then.onTheContactAnalyPage.iShouldSeeTheContainer();



	});
	
		opaTest("test table buttons", function(Given, When, Then) {
					When.onTheContactAnalyPage.iChangeChartButton("test-contactAnalysisTable");


		//Actions
		When.onTheContactAnalyPage.iClickSortButton();

		// Assertions
	Then.onTheContactAnalyPage.iShouldSeeTheContainer();
	
	When.onTheContactAnalyPage.iFilterCancelButtonPress();

		// Assertions
		Then.onTheContactAnalyPage.iShouldSeeTheContainer();
		
	// 		//Actions
	// 	When.onTheContactAnalyPage.iClickPersButton();

	// 	// Assertions
	// Then.onTheContactAnalyPage.iShouldSeeTheContainer();
	
	// When.onTheContactAnalyPage.iFilterCancelButtonPress();

	// 	// Assertions
	// 	Then.onTheContactAnalyPage.iShouldSeeTheContainer();
		
		

		

	});
	
	opaTest("test change select", function(Given, When, Then) {

		//Actions
		When.onTheContactAnalyPage.iChangeSelect(1);

		// Assertions
	Then.onTheContactAnalyPage.iShouldSeeTheContainer();

		

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