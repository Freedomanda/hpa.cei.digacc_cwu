sap.ui.define([
		"hpa/cei/digital_account/controller/Worklist.controller",
		"hpa/cei/digital_account/controller/BaseController",
		"sap/ui/base/ManagedObject",
		"test/unit/helper/FakeI18nModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	], function(WorklistController, BaseController ,ManagedObject, FakeI18n) {
		"use strict";

		QUnit.module("Table busy indicator delay", {

			beforeEach : function () {
				this.oWorklistController = new WorklistController();
				this.oTableStub = new ManagedObject();
				this.oTableStub.getBusyIndicatorDelay = sinon.stub();
				this.oViewStub = new ManagedObject();
				this.oComponentStub = new ManagedObject();
				this.oComponentStub.setModel(new FakeI18n(), "i18n");
				sinon.stub(this.oWorklistController, "getOwnerComponent").returns(this.oComponentStub);
				sinon.stub(this.oWorklistController, "getView").returns(this.oViewStub);
				sinon.stub(this.oWorklistController, "byId").returns(this.oTableStub);
				 
			},

			afterEach : function () {
				this.oWorklistController.destroy();
				this.oTableStub.destroy();
				this.oViewStub.destroy();
				this.oComponentStub.destroy();
			}
		});

		//QUnit.test("Should set the create dialog to null", function (assert) {
			//Arrange
			// this.oWorklistController._oCreateDialog =  sap.ui
			// 	.xmlfragment(
			// 		"hpa.cei.digital_account.view.fragments.AccountCreate",
			// 		this);
			
			
			// Act
			// this.oWorklistController._removeCreateDialog();

			// Assert
			// assert.strictEqual(this.oWorklistController._oCreateDialog, null, "The original busy delay was restored");
	//	});

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

	}
);