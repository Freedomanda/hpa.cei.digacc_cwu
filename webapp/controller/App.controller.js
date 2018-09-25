sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController",
	"hpa/cei/digital_account/util/Const",
	"sap/ui/model/json/JSONModel"
], function(BaseController, Const,JSONModel) {
	"use strict";

	return BaseController.extend("hpa.cei.digital_account.controller.App", {
		
		_getAccountTypeMedium:function(){
					
				this.getOwnerComponent().getModel().read("/DigitalAccountTypes", {
				
					success: function(oData, oResponse) {
						//Handle Success  
						if (oResponse.statusCode === "200" || oResponse.statusCode === 200) {

						var aResults = oData.results;
						for(var i=0;i<aResults.length;i++){
							var oResult = aResults[i];
							Const.typeCommMedium[oResult.TypeCode] = oResult.CommMedium;
						}

							//	this._showOrHideEditPageSections(that._bInEditMode);

						}
					},
					error: function(oError) {
					
						//this._setEditable(this.oAuthorization.Change);
						//
						//Handle Error  
					}
				});
		
			},

		onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			this.getOwnerComponent().getModel().metadataLoaded().
			then(fnSetAppNotBusy);
			
			this._getAccountTypeMedium();
		

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});