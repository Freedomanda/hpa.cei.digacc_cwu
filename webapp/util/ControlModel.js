/*global history */
sap.ui.define(["sap/ui/base/Object",
	"hpa/cei/digital_account/util/Const",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator"
], function(Object, Const,Filter,Sorter,FilterOperator) {
	"use strict";

	return Object.extend("hpa.cei.digital_account.util.ControlModel", {

		constructor: function(o) {
		
			this._delegate = o;
			this.oResourceBundle = o.getResourceBundle();
		},
		
		validateManValue : function(oContent, sStateText, bIsInput) {
				var sValue = "";
				if (bIsInput) {
					sValue = oContent.getValue();
				} else {
					sValue = oContent.getSelectedKey();
				}
				if (sValue === null || sValue === "") {
					oContent.setValueState(sap.ui.core.ValueState.Error);
					oContent.setValueStateText(sStateText);
					return false;
				} else {
					oContent.setValueState(sap.ui.core.ValueState.None);
					return true;
				}

			},
			
			getAttributes:function(sCommMedia,oControl){
				var oCAFilter = new Filter("CommunicationMedium", FilterOperator.EQ,sCommMedia);
				var oVisbileFilter = new Filter("IsVisible", FilterOperator.EQ,"X");
				var oSequenceSorter = new Sorter("Sequence",false);
				oControl.setBusy(true);
				
				return new Promise(function(resolve,reject){
					this._delegate.getView().getModel().read("/DigitalAccountAttributeDefSet",{
						filters:[oCAFilter,oVisbileFilter],
						sorters:[oSequenceSorter],
							success: function(oData, oResponse) {
									oControl.setBusy(false);
						//Handle Success  
						if (oResponse.statusCode === "200" || oResponse.statusCode === 200) {

							resolve(oData);

							//	this._showOrHideEditPageSections(that._bInEditMode);

						}
					},
					error: function(oError) {
							oControl.setBusy(false);
						reject(oError);
						//this._setEditable(this.oAuthorization.Change);
						//
						//Handle Error  
					}
						
					
				});
				}.bind(this));
			},
			
			
		// 	getAuthorization: function(sObjectId) {

		// 	var oUrlParams = {
		// 		"BOName": "'" + sObjectId + "'"

		// 	};

		// 	return new Promise(function(resolve, reject) {
		// 		this.getView().getModel().read("/READBOAUTHORIZATION", {
		// 			urlParameters: oUrlParams,
		// 			success: function(oData, oResponse) {
		// 				//Handle Success  
		// 				if (oResponse.statusCode === "200" || oResponse.statusCode === 200) {

		// 					resolve(oData);

		// 					//	this._showOrHideEditPageSections(that._bInEditMode);

		// 				}
		// 			},
		// 			error: function(oError) {
		// 				reject(oError);
		// 				//this._setEditable(this.oAuthorization.Change);
		// 				//
		// 				//Handle Error  
		// 			}
		// 		});
		// 	}.bind(this));

		// }

	

	});
});