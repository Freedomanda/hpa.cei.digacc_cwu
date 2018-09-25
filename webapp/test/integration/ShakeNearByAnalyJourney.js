sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("ShakeNearByAnaly");

	opaTest("Should see the table", function(Given, When, Then) {
		// Arrangements
		When.onTheBrowser.iPressOnTheBackwardsButton();
		When.onTheWorklistPage.iRememberTheItemAtPosition(0);

		When.onTheObjectPage.iPressIconTabItem(4);
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
	});

	opaTest("test content change", function(Given, When, Then) {

		//Actions
		When.onTheShakeNearByAnalyPage.iChangeContent(1);
		When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();

		// Assertions
	Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
	
		//Actions
		When.onTheShakeNearByAnalyPage.iChangeContent(0);
				When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
		When.onTheShakeNearByAnalyPage.iChangeContent(2);
				When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
	
	
	

		
	});
	
		opaTest("test  select", function(Given, When, Then) {

		//Actions
		When.onTheShakeNearByAnalyPage.iChangeContent(0);
				When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
	
	
		When.onTheShakeNearByAnalyPage.iPressMeasureSelect(1);
			When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();
		When.onTheShakeNearByAnalyPage.iPressMeasureSelect(2);
			When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();
		// When.onTheShakeNearByAnalyPage.iPressMeasureSelect(3);
		// 		When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();

		
		// 	Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
			
		// 		//Actions
		// When.onTheShakeNearByAnalyPage.iChangeContent(2);
		// 		When.onTheShakeNearByAnalyPage.iWaitUntilTheContainerIsVisible();


		// Assertions
	Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
			// 	When.onTheShakeNearByAnalyPage.iPressTableSelect(1);
		
			// Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
			
		
		

	});

// 	opaTest("Filter scenerio", function(Given, When, Then) {

// 		//Actions
// 			When.onTheShakeNearByAnalyPage.iChangeContent(0);

// 		// Assertions
// Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();


// 		When.onTheShakeNearByAnalyPage.iPressFilterButton();

// 		// Assertions
// 		Then.onTheShakeNearByAnalyPage.iShouldSeeTheFilterDialog();
		
// 		// 	When.onTheShakeNearByAnalyPage.iFilterSaveButtonPress();

// 		// // Assertions
// 		// Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
		
// 		// When.onTheShakeNearByAnalyPage.iClickFilterButton();

// 		// // Assertions
// 		// Then.onTheShakeNearByAnalyPage.iShouldSeeTheFilterDialog();
		
// 			When.onTheShakeNearByAnalyPage.iFilterCancelButtonPress();

// 		// Assertions
// 		Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();



// 	});
	
	// 	opaTest("test table search", function(Given, When, Then) {

	// 	When.onTheShakeNearByAnalyPage.iChangeContent(2);

	// 	// Assertions
	// Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
	
	// 	When.onTheShakeNearByAnalyPage.iSearchField();

	// 	// Assertions
	// Then.onTheShakeNearByAnalyPage.iShouldSeeTheContainer();
	

		
		

		

	// });

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