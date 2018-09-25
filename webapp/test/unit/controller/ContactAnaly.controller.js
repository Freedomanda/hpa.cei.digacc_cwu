sap.ui.define([
	"hpa/cei/digital_account/controller/ContactAnaly.controller",
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/base/ManagedObject",
	"test/unit/helper/FakeI18nModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ContactAnalyController, BaseController, ManagedObject, FakeI18n) {
	"use strict";

	QUnit.module("Table busy indicator delay", {

		beforeEach: function() {
			this.oContactAnalyController = new ContactAnalyController();
			this.oElementStub = new ManagedObject();
			this.oViewStub = new ManagedObject();
			this.oComponentStub = new ManagedObject();
			this.oComponentStub.setModel(new FakeI18n(), "i18n");
			sinon.stub(this.oContactAnalyController, "getOwnerComponent").returns(this.oComponentStub);
			sinon.stub(this.oContactAnalyController, "getView").returns(this.oViewStub);
			sinon.stub(this.oContactAnalyController, "byId").returns(this.oElementStub);

		},

		afterEach: function() {
			this.oContactAnalyController.destroy();
			this.oElementStub.destroy();
			this.oViewStub.destroy();
			this.oComponentStub.destroy();
		}
	});

	QUnit.test("Test add zero to null function", function(assert) {
		//	Arrange
		var dDate = new Date();
		var dDate2 = new Date();
		var dDate1 = new Date();
		dDate.setFullYear(2017, 7, 10);
		dDate1.setFullYear(2017, 7, 10);
		dDate2.setFullYear(2017, 7, 10);
		dDate.setHours(0,0,0);
		dDate1.setHours(0,0,0);
		dDate2.setHours(0,0,0);
		dDate1.setDate(dDate.getDate() + 1);
		dDate2.setDate(dDate.getDate() + 2);
		

		var aDate = [dDate, dDate1, dDate2];
		
		var aIntAnalyData = [{InteractionUTCDate:dDate,NetNumberOfFollowers:0,NumberOfFollowers:2,NumberOfUnfollowers:3}];
		
			var aIntAnalyData2 = [{InteractionUTCDate:"20170810",NetNumberOfFollowers:0,NumberOfFollowers:2,NumberOfUnfollowers:3}];

		//	Act
		
		var aResult = this.oContactAnalyController.filterZero(aDate,aIntAnalyData);
		var aResult2 = this.oContactAnalyController.filterZero(aDate,aIntAnalyData2);

		//	Assert
		
		var aShouldResult = [{InteractionUTCDate:dDate,NetNumberOfFollowers:0,NumberOfFollowers:2,NumberOfUnfollowers:3},{InteractionUTCDate:dDate1,NetNumberOfFollowers:0,NumberOfFollowers:0,NumberOfUnfollowers:0},{InteractionUTCDate:dDate2,NetNumberOfFollowers:0,NumberOfFollowers:0,NumberOfUnfollowers:0}];
		assert.strictEqual(aResult.length, aShouldResult.length, "the nulltozero function is working");
		assert.strictEqual(aResult2.length, aShouldResult.length, "the nulltozero function is working");
	});

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