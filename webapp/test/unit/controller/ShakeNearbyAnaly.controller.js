sap.ui.define([
	"hpa/cei/digital_account/controller/ShakeNearbyAnaly.controller",
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/base/ManagedObject",
	"test/unit/helper/FakeI18nModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ShakeNearbyAnalyController, BaseController, ManagedObject, FakeI18n) {
	"use strict";

	QUnit.module("Table busy indicator delay", {

		beforeEach: function() {
			this.oShakeNearbyAnalyController = new ShakeNearbyAnalyController();
			this.oElementStub = new ManagedObject();
			this.oViewStub = new ManagedObject();
			this.oComponentStub = new ManagedObject();
			this.oComponentStub.setModel(new FakeI18n(), "i18n");
			sinon.stub(this.oShakeNearbyAnalyController, "getOwnerComponent").returns(this.oComponentStub);
			sinon.stub(this.oShakeNearbyAnalyController, "getView").returns(this.oViewStub);
			sinon.stub(this.oShakeNearbyAnalyController, "byId").returns(this.oElementStub);

		},

		afterEach: function() {
			this.oShakeNearbyAnalyController.destroy();
			this.oElementStub.destroy();
			this.oViewStub.destroy();
			this.oComponentStub.destroy();
		}
	});
	
	QUnit.test("Test change table content", function(assert) {
		//	Arrange
	var oResult = this.oShakeNearbyAnalyController.changeTableContent("beacon","Content");
	var oResult1 = this.oShakeNearbyAnalyController.changeTableContent("beacon","Location");
		var oResult2 = this.oShakeNearbyAnalyController.changeTableContent("location","Location");
			var oResult3 = this.oShakeNearbyAnalyController.changeTableContent("location","Content");
			
				var oResult4 = this.oShakeNearbyAnalyController.changeTableContent("content","Content");
			var oResult5 = this.oShakeNearbyAnalyController.changeTableContent("content","Location");
		assert.strictEqual(oResult.getProperty("/location"), false, "the result  is correct");
		assert.strictEqual(oResult1.getProperty("/location"), false, "the result  is correct");
		assert.strictEqual(oResult2.getProperty("/location"), false, "the result  is correct");
		assert.strictEqual(oResult3.getProperty("/location"), false, "the result  is correct");
		assert.strictEqual(oResult4.getProperty("/location"), false, "the result  is correct");
		assert.strictEqual(oResult5.getProperty("/location"), false, "the result  is correct");

	
		
	

		//	Act
	
	//	assert.strictEqual(aResult[0].NumberOfInteractionContacts, 7, "the sum number  is correct");
	});
	
	QUnit.test("Test property produce", function(assert) {
		//	Arrange
		var dDate = new Date();
		var dDate2 = new Date();
		var aLocationList = ["location1","location2"];
		var aContentList = ["content1","content2"];
	var oResult = this.oShakeNearbyAnalyController.produceProperty(dDate,dDate2,aLocationList,aContentList,"Count","Bar","DigitalAccountLocationAnalysis","test");
	
	var oResult1 = this.oShakeNearbyAnalyController.produceProperty(dDate,dDate2,aLocationList,aContentList,"Count","Bar","IBeaconAnalysis","test");
	
		var oResult2 = this.oShakeNearbyAnalyController.produceProperty(dDate,dDate2,aLocationList,aContentList,"Count","Bar","DigitalAccountContentAnalysis","test");
		
			var oResult3 = this.oShakeNearbyAnalyController.produceProperty(dDate,dDate2,aLocationList,aContentList,"Other","Bar","DigitalAccountContentAnalysis","test");
			
			
		assert.strictEqual(oResult.path, "/DigitalAccounts('undefined')/DigitalAccountLocationAnalysis", "the result  is correct");
		assert.strictEqual(oResult1.path, "/IBeaconAnalysis", "the result  is correct");
		assert.strictEqual(oResult2.path, "/DigitalAccounts('undefined')/DigitalAccountContentAnalysis", "the result  is correct");
		assert.strictEqual(oResult3.path, "/DigitalAccounts('undefined')/DigitalAccountContentAnalysis", "the result  is correct");
	

	
		
	

		//	Act
	
	//	assert.strictEqual(aResult[0].NumberOfInteractionContacts, 7, "the sum number  is correct");
	});
	
		QUnit.test("Test new filter", function(assert) {
		//	Arrange
		
		var aLocationList = [{"LocationKey":"test","LocationName":"test","Selected":true}];
		var aContentList = [{"ContentId":"test","ContentName":"test","Selected":true}];
	
		
	var oResult = this.oShakeNearbyAnalyController.addNewFilters(1,2,"Bar",aLocationList,aContentList,{});
	
	var oResult1 = this.oShakeNearbyAnalyController.addNewFilters(1,2,"Pie",aLocationList,aContentList,{});
//	var oShoudResult1 = 	{"2Bar": { "ContentList": [ { "ContentId": "test","ContentName": "test","Selected": true}],"LocationList": [{"LocationKey": "test","LocationName": "test","Selected": true}]}};
			
			
		assert.strictEqual(oResult["2Bar"].ContentList.length,1, "the result  is correct");
		assert.strictEqual(oResult1["2Bar"].ContentList.length, 1, "the result  is correct");
	
	

	
		
	

		//	Act
	
	//	assert.strictEqual(aResult[0].NumberOfInteractionContacts, 7, "the sum number  is correct");
	});
	
	QUnit.test("Test drill down function", function(assert) {
		//	Arrange
	
	var oResult = this.oShakeNearbyAnalyController.drillDownFun(1,"parentid","parenttext","countbyLoc");
	
	var oResult1 = this.oShakeNearbyAnalyController.drillDownFun(1,"parentid","parenttext","personByLoc");
	
			var oResult2 = this.oShakeNearbyAnalyController.drillDownFun(1,"parentid","parenttext","countByCon");
			
	var oResult3 = this.oShakeNearbyAnalyController.drillDownFun(1,"parentid","parenttext","others");
		var oResult4 = this.oShakeNearbyAnalyController.drillDownFun(2,"parentid","parenttext","countbyLoc");
	
	var oResult5 = this.oShakeNearbyAnalyController.drillDownFun(2,"parentid","parenttext","personByLoc");
	
			var oResult6 = this.oShakeNearbyAnalyController.drillDownFun(2,"parentid","parenttext","countByCon");
			
	var oResult7 = this.oShakeNearbyAnalyController.drillDownFun(2,"parentid","parenttext","others");
			
			
		assert.strictEqual(oResult.newLevel, 2, "the result  is correct");
		assert.strictEqual(oResult1.newLevel, 2, "the result  is correct");
		assert.strictEqual(oResult2.newLevel, 2, "the result  is correct");
		assert.strictEqual(oResult3.newLevel, 2, "the result  is correct");
			assert.strictEqual(oResult4.newLevel, 3, "the result  is correct");
		assert.strictEqual(oResult5.newLevel, 3, "the result  is correct");
		assert.strictEqual(oResult6.newLevel, 3, "the result  is correct");
		assert.strictEqual(oResult7.newLevel, 3, "the result  is correct");
	

	
		
	

		//	Act
	
	//	assert.strictEqual(aResult[0].NumberOfInteractionContacts, 7, "the sum number  is correct");
	});
	
	
	

	// QUnit.test("Test add zero to null function", function(assert) {
	// 	//	Arrange
	// 	var dDate = new Date();
	// 	var dDate2 = new Date();
	// 	var dDate1 = new Date();
	// 	dDate.setFullYear(2017, 7, 10);
	// 	dDate1.setFullYear(2017, 7, 10);
	// 	dDate2.setFullYear(2017, 7, 10);
	// 	dDate.setHours(0,0,0);
	// 	dDate1.setHours(0,0,0);
	// 	dDate2.setHours(0,0,0);
	// 	dDate1.setDate(dDate.getDate() + 1);
	// 	dDate2.setDate(dDate.getDate() + 2);
		

	// 	var aDate = [dDate, dDate1, dDate2];
		
	// 			var aIntData = [{InteractionType:"Int1",InteractionTypeName:"Int1",InteractionUTCDate: dDate,NumberOfInteractionContacts:"5",NumberOfInteractions:"4"},{InteractionType:"Int1",InteractionTypeName:"Int1",InteractionUTCDate:dDate1,NumberOfInteractionContacts:"2",NumberOfInteractions:"6"}];

	// 	 var aIntType = [{InteractionTypeCode:"Int1",InteractionTypeDescription:"Int1"},{InteractionTypeCode:"Int2",InteractionTypeDescription:"Int2"}];
	

	// 	//	Act
		
	// 	var aResult = this.oInteractionAnalyController.filterZero(aDate,aIntData,aIntType);
		

	// 	//	Assert
		
	// //	var aShouldResult = [{InteractionUTCDate:dDate,NetNumberOfFollowers:0,NumberOfFollowers:2,NumberOfUnfollowers:3},{InteractionUTCDate:dDate1,NetNumberOfFollowers:0,NumberOfFollowers:0,NumberOfUnfollowers:0},{InteractionUTCDate:dDate2,NetNumberOfFollowers:0,NumberOfFollowers:0,NumberOfUnfollowers:0}];
	// 	assert.strictEqual(aResult.length, 6, "the nulltozero function is working");
	// //	assert.strictEqual(aResult2.length, aShouldResult.length, "the nulltozero function is working");
	// });

	// QUnit.test("Should reset the busy indicator to the original one after the first request completed", function (assert) {
	// 	// Arrange
	// 	var iOriginalBusyDelay = 1;

	// 	this.oTableStub.getBusyIndicatorDelay.returns(iOriginalBusyDelay);

	// 	// Act
	// 	this.oWorklistController.onInit();
	// 	this.oTableStub.fireEvent("updateFinished");

	// 	// Assert
	// 	assert.strictEqual(this.oWorklistController.getModel("worklistView").getData().tableBusyDelay, iOriginalBusyDelay, "The original busy delay was restored");
	// });

});