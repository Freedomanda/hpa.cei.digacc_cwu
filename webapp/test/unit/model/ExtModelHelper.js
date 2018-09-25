sap.ui.define([	"hpa/cei/digital_account/controller/Object.controller",
	"hpa/cei/digital_account/model/ExtModelHelper",
		"sap/ui/base/ManagedObject",
			"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
], function(ObjectController,extModelHelper,ManagedObject) {
	"use strict";

	QUnit.module("ExtModelHelper",
	{beforeEach : function () {
				this.oObjectController = new ObjectController();
			
				this.oViewStub = new ManagedObject();
				this.oComponentStub = new ManagedObject();
			
				sinon.stub(this.oObjectController, "getOwnerComponent").returns(this.oComponentStub);
				sinon.stub(this.oObjectController, "getView").returns(this.oViewStub);
					var sManifestUrl = "../../manifest.json",
			//	sEntity = "DigitalAccount",
			//		sErrorParam = oUriParameters.get("errorType"),
			//	iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
			oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
			oMainDataSource = oManifest["sap.app"].dataSources.mainService,
			//		sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
			// ensure there is a trailing slash
			sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

		// oMockServer = new MockServer({
		// 	rootUri: sMockServerUrl
		// });
this.oTestModel = new  sap.ui.model.odata.ODataModel(sMockServerUrl);
				//sinon.stub(this.oWorklistController, "byId").returns(this.oTableStub);
				 
			}
			});
		

	function getCollectionFactsTestCase(assert, sEntityName, oModel, iExpectedCollectionsLength) {
		// Act
		var aCollections = extModelHelper.getCollectionFacetsFromAnnotations(sEntityName, oModel);

		// Assert
		assert.strictEqual(aCollections.length, iExpectedCollectionsLength, "The collections are okay.");
	}

	QUnit.test("Should get collecction from digitalaccount entity", function(assert) {
		//var oTestModel = new sap.ui.model.odata.ODataModel("https://ldciana.wdf.sap.corp:44300/sap/opu/odata/SAP/CUAN_DIGITAL_ACCOUNT_SRV");
	   // var objectCon = new ObjectController();v、
  // 	var oMockServer;
		//	_sAppModulePath = "hpa/cei/digital_account/";
		//	_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";
		//		var oUriParameters = jQuery.sap.getUriParameters(),
		//	sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
	
		getCollectionFactsTestCase.call(this, assert, "DigitalAccount",this.oTestModel, 0);
	});

	

});