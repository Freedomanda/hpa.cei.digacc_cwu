sap.ui.define([
	"hpa/cei/digital_account/controller/ContactList.controller",
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/base/ManagedObject",
	"test/unit/helper/FakeI18nModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ContactListController, BaseController, ManagedObject, FakeI18n) {
	"use strict";

	QUnit.module("Table busy indicator delay", {

		beforeEach: function() {
			this.oContactListController = new ContactListController();
			this.oElementStub = new ManagedObject();
			this.oViewStub = new ManagedObject();
			this.oComponentStub = new ManagedObject();
			this.oComponentStub.setModel(new FakeI18n(), "i18n");
			sinon.stub(this.oContactListController, "getOwnerComponent").returns(this.oComponentStub);
			sinon.stub(this.oContactListController, "getView").returns(this.oViewStub);
			sinon.stub(this.oContactListController, "byId").returns(this.oElementStub);

		},

		afterEach: function() {
			this.oContactListController.destroy();
			this.oElementStub.destroy();
			this.oViewStub.destroy();
			this.oComponentStub.destroy();
		}
	});

	QUnit.test("Test Generate Smartlink", function(assert) {
		//	Arrange
	var oData1 = {ContactImageURL:"test",LastInteractionType:"test",ContactGender:"test",BusinessRelationship:"",ContactLevel:"test",LastInteractionTimestamp:""};
    var oData2 = {ContactImageURL:"",LastInteractionType:"test",ContactGender:"test",BusinessRelationship:"",ContactLevel:"test",LastInteractionTimestamp:""};
	var oData3 = {ContactImageURL:"test",LastInteractionType:"",ContactGender:"test",BusinessRelationship:"",ContactLevel:"test",LastInteractionTimestamp:""};
		//	Act
	this.oContactListController.setResouceBundle();
		var oSLResult1 = this.oContactListController.fnGenerateSmartLink(oData1);
			var oSLResult2 = this.oContactListController.fnGenerateSmartLink(oData2);
				var oSLResult3 = this.oContactListController.fnGenerateSmartLink(oData3);
//		var aResult2 = this.oContactAnalyController.filterZero(aDate,aIntAnalyData2);

		//	Assert
		
	
		assert.strictEqual(oSLResult1.length, 10, "the smartlink  is working");
				assert.strictEqual(oSLResult2.length, 10, "the smartlink  is working");
		assert.strictEqual(oSLResult3.length, 10, "the smartlink  is working");

			//	assert.strictEqual(aResult2.length, aShouldResult.length, "the nulltozero function is working");

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