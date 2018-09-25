sap.ui.define(["sap/ui/base/Object",
	"hpa/cei/digital_account/util/ControlModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"hpa/cei/digital_account/util/Const"
], function(Object, ControlModel, Fragment, MessageBox, Const) {
	"use strict";

	return Object.extend("hpa.cei.digital_account.manager.AccountManager", {

		constructor: function(o, sTypeCode) {

			this._delegate = o;
			this.oResourceBundle = o.getResourceBundle();
			this.aDynamicValidateControl = [];
			this.aDynamicValidateText = [];
			this.aAdditionalProperty = [];
			this.aUpdateAttributes = [];
			this.oUpdateAttributeValue = {};

			if (sTypeCode && sTypeCode !== "") {

				this.sTypeCode = sTypeCode;
				this.changeAccountType(sTypeCode);
			}

		},

		/**
		 * get account type code 
		 * @public
		 */

		getAccountTypeCode: function() {
			return this.sTypeCode;
		},

		/**
		 * change the manager's communication media based on the account type
		 * @param {string} sTypeCode the account type code
		 * @public
		 */

		changeAccountType: function(sTypeCode) {
			this.sTypeCode = sTypeCode;

			if (Const.typeCommMedium[sTypeCode] && Const.typeCommMedium[sTypeCode] !== null) {
				this.sCommunicationMedia = Const.typeCommMedium[sTypeCode];
			} else {
				this.sCommunicationMedia = "DEFAULT";
			}

		},

		/**
		 * Change the manager's communication media based on the communication media id
		 * @param {string} sCommMedia communication media id
		 * @public
		 */

		changeAccountCommMedia: function(sCommMedia) {
			this.sCommunicationMedia = sCommMedia;
		},

		/**
		 * add the create fragment of account to the create dialog.
		 * @public
		 */

		addCreateAccountFragment: function() {

			var oSpecForm = Fragment.byId("accountCreate_frag", "typeSpecContent");
			//	oSpecForm.removeAllContent();
			oSpecForm.destroyContent();
			this.setupCreateFragment(oSpecForm);

		},

		setupCreateFragment: function(oFragment) {
			this.aDynamicValidateControl = [];
			this.aDynamicValidateText = [];
			this.aAdditionalProperty = [];
			//	Fragment.byId("accountCreate_frag", "detail").setBusy(true);

			var oControlModel = new ControlModel(this._delegate);
			oFragment.destroyContent();
			var fnChangeXToTrue = function(sValue) {
				if (sValue === "X") {
					return true;
				} else {
					return false;
				}

			};

			var fnTypePassword = function(sValue) {
				if (sValue === "X") {
					return "Password";
				} else {
					return "Text";
				}

			};
			oControlModel.getAttributes(this.sCommunicationMedia, Fragment.byId("accountCreate_frag", "detail")).then(function(oData) {
				for (var i = 0; i < oData.results.length; i++) {
					var oProperty = oData.results[i];
					var oLabel = new sap.m.Label("accountCreate" + oProperty.AttributeName + "Label", {
						text: oProperty.AttributeLabel,
						labelFor: "accountCreate" + oProperty.AttributeName + "Input",
						required: fnChangeXToTrue(oProperty.IsMandatory),
						width: "auto"

					});
					var oInput = new sap.m.Input("accountCreate" + oProperty.AttributeName + "Input", {
						valueState: sap.ui.core.ValueState.None,
						maxLength: Number(oProperty.MaxLength),
						value: "",
						type: fnTypePassword(oProperty.IsSecure),
						customData: [new sap.ui.core.CustomData({
								key: "attribute",
								value: oProperty.AttributeName
							})

						]

					});
					if (oProperty.IsMandatory === "X") {
						this.aDynamicValidateControl.push(oInput);
						this.aDynamicValidateText.push(oProperty.Tooltip);
					}
					this.aAdditionalProperty.push(oProperty.AttributeName);
					oInput.attachLiveChange(this._delegate.onAccountCreateChanged, this._delegate);
					oFragment.addContent(oLabel);
					oFragment.addContent(oInput);
				}

			}.bind(this));

		},

		setupObjectFragment: function(oFragment) {

			//	oFragment.destroyGroups();
			this.aDynamicValidateControl = [];
			this.aDynamicValidateText = [];
			this.aAdditionalProperty = [];
			this.aUpdateAttributes = [];
			this.oUpdateAttributeValue = {};
			var oControlModel = new ControlModel(this._delegate);
			var fnChangeXToTrue = function(sValue) {
				if (sValue === "X") {
					return true;
				} else {
					return false;
				}

			};

			var fnTypePassword = function(sValue) {
				if (sValue === "X") {
					return "Password";
				} else {
					return "Text";
				}

			};
			//	var aAttributeValues = this.getAttributesData();
			this.getAttributesData().then(function(oResults) {
				var fnGetValue = function(aAttributeName) {
					var aAttValues = oResults.filter(function(oAttribute) {
						if (oAttribute.AttributeName === aAttributeName) {
							return true;
						}
					});
					if (aAttValues.length > 0) {
						return aAttValues[0].AttributeValue;
					} else {
						return "";
					}

				};

				oControlModel.getAttributes(this.sCommunicationMedia, this._delegate.getView().byId("ObjectPageSubSectionAddProperty")).then(
					function(oData) {
						for (var i = 0; i < oData.results.length; i++) {
							var oProperty = oData.results[i];
							var oLabel = new sap.m.Label("accountObject" + oProperty.AttributeName + "Label", {
								text: oProperty.AttributeLabel,
								labelFor: "accountObject" + oProperty.AttributeName + "Input",
								required: fnChangeXToTrue(oProperty.IsMandatory),
								width: "auto"

							});
							var oInput = new sap.m.Input("accountObject" + oProperty.AttributeName + "Input", {
								valueState: sap.ui.core.ValueState.None,
								maxLength: Number(oProperty.MaxLength),
								value: fnGetValue(oProperty.AttributeName),
								editable: false,
								visible: false,
								type: fnTypePassword(oProperty.IsSecure),
								customData: [new sap.ui.core.CustomData({
										key: "attribute",
										value: oProperty.AttributeName
									}),

								]

							});

							var oText = new sap.m.Text("accountObject" + oProperty.AttributeName + "Text", {
								text: fnGetValue(oProperty.AttributeName),
								customData: [new sap.ui.core.CustomData({
										key: "attribute",
										value: oProperty.AttributeName
									})

								],
								visible: true

							});
							if (oProperty.IsMandatory === "X") {
								this.aDynamicValidateControl.push(oInput);
								this.aDynamicValidateText.push(oProperty.Tooltip);
							}
							this.aAdditionalProperty.push(oProperty.AttributeName);
							var oSmartFormGroupElement = new sap.ui.comp.smartform.GroupElement({
								elements: [new sap.ui.layout.VerticalLayout({
									content: [oLabel, oInput, oText]
								})]
							});
							var oSmartFormGroup = new sap.ui.comp.smartform.Group({
								groupElements: oSmartFormGroupElement

							});
							oInput.attachLiveChange(this.onObjectAddFieldChange, this);
							oFragment.addGroup(oSmartFormGroup);
							//	oFragment.addContent(oInput);
						}

					}.bind(this));

			}.bind(this));

		},

		getAttributesData: function() {
			var aAttributeValues = [];
			return new Promise(function(resolve, reject) {
				this._delegate.getView().getModel().read("/DigitalAccounts('" + this._delegate.sPubAccKey + "')/DigitalAccountExtAttribute", {
					success: function(oResult) {
						aAttributeValues = oResult.results;
						resolve(aAttributeValues);

					},
					error: function() {
						reject();
					}
				});
			}.bind(this));
		},

		/**
		 * add the object fragment to the object view.
		 * @public
		 */

		addObjectAccountFragment: function() {

			var oSpecForm = this._delegate.getView().byId("ObjectPageInfoAddFieldSmartForm");
			//	oSpecForm.removeAllContent();
			oSpecForm.destroyGroups();
			this.setupObjectFragment(oSpecForm);

		},

		/**
		 * validate the create values if null will change the state of the input
		 * @return {boolean} if one value is null return false otherwise return true
		 * @public
		 */

		validateValue: function() {
			var bValidate = true;
			var aValidateControls = this.aDynamicValidateControl;
			var aValidateErrors = this.aDynamicValidateText;

			var oControlModel = new ControlModel(this._delegate);

			for (var i = 0; i < aValidateControls.length; i++) {
				var bValidateNotNull = oControlModel.validateManValue(aValidateControls[i], aValidateErrors[i], true);
				if (!bValidateNotNull) {
					bValidate = false;

				}

			}

			return bValidate;

		},

		/**
		 * add the corresponding properties and values to the account entity
		 * @param {jsonmodel} oAccountModel the original model of account
		 * @param {boolean} bIsConnection if true will only add connection properties(appid,secid etc.)
		 * @return{jsonmodel} the model of account with propeties added.
		 * @public
		 */
		updateModel: function(oAccountModel) {

			oAccountModel.DigitalAccountExtAttribute = this.addProperty(Fragment.byId("accountCreate_frag", "typeSpecContent"));
			return oAccountModel;

		},

		updateAdditionalData: function() {
			var aFragmentContents = this._delegate.getView().byId("ObjectPageInfoAddFieldSmartForm").getGroups();
			for (var i = 0; i < aFragmentContents.length; i++) {
				if (aFragmentContents[i].getFormElements()[0].getFields()[0].getMetadata().getName() === "sap.ui.layout.VerticalLayout") {
					var oAttributeControl = aFragmentContents[i].getFormElements()[0].getFields()[0].getContent()[1];
					//		var oAttributeReadOnly = aFragmentContents[i].getFormElements()[0].getFields()[0].getContent()[2];
					//	oAttributeControl.setValue(fnGetValue(oAttributeControl.getCustomData()[0].getValue()));

					oAttributeControl.setValueState(sap.ui.core.ValueState.None);
				}

				//	oAttributeReadOnly.setText(fnGetValue(oAttributeControl.getCustomData()[0].getValue()));

			}

			if (this.aUpdateAttributes.length > 0) {
				this._delegate.getView().setBusy(true);
				var aUpdateAddAttributes = [];

				for (var i = 0; i < this.aUpdateAttributes.length; i++) {
					var oAtt = {
						AttributeName: this.aUpdateAttributes[i],
						AttributeValue: this.oUpdateAttributeValue[this.aUpdateAttributes[i]]
					};
					aUpdateAddAttributes.push(oAtt);
				}

				var oUpdateDA = {
					Key: this._delegate.sPubAccKey,
					StatusCode: this._delegate.sStatusCode,
					Type: this._delegate.sTypeCode,
					DigitalAccountExtAttribute: aUpdateAddAttributes
				};

				return new Promise(function(resolve, reject) {
					this._delegate.getView().getModel().create("/DigitalAccounts",
						oUpdateDA, {
							success: function(oResult) {
								this._delegate.getView().setBusy(false);
								resolve();
								//	this.setEditable(false);

							}.bind(this),
							error: function(oError) {
								var sErrorText = oError.responseText;
								try {
									var oErrorMsg = JSON.parse(sErrorText);
									var sErrorMessage = oErrorMsg.error.message.value;
									var sErrorCode = oErrorMsg.error.code;
									var aAttributes = oErrorMsg.error.innererror.errordetails.filter(function(oErrorDetail) {
										if (oErrorDetail.code === "ATTRIBUTE_NAME") {
											return true;
										}
									});

									if (aAttributes) {
										this.handleError(sErrorCode, sErrorMessage, false, aAttributes);

									}

								} catch (e) {
									//	sap.m.MessageBox.error(sErrorText);

								}
								this._delegate.getView().setBusy(false);
								reject();

								//	return;
							}.bind(this)
						});
				}.bind(this));
			} else {
				return new Promise(function(resolve, reject) {
					//	this.setEditable(false);
					resolve();
				}.bind(this));
			}

		},

		/**
		 * handle the special error if has one
		 * @params{string} sErrorText the original response of post request.
		 * @params{boolean} bIsCreate if create action true if update action false
		 * 
		 * @public
		 */

		handleError: function(sErrorCode, sErrorText, bIsCreate, aAttributeNames) {

			var aFragmentContents;

			if (bIsCreate) {
				aFragmentContents = Fragment.byId("accountCreate_frag", "typeSpecContent").getContent();

			} else {
				aFragmentContents = this._delegate.getView().byId("ObjectPageInfoAddFieldSmartForm").getGroups();
				if (sErrorCode === "CM_CUAN_DA/010") {
					MessageBox.error(sErrorText);

				} else {

					MessageBox.error(
						this.oResourceBundle.getText("validationErrorText"), {
							id: "errorMessageBox",
							details: sErrorText,

							actions: [MessageBox.Action.CLOSE],
							onClose: function() {
								//	this._bMessageOpen = false;
							}.bind(this)
						}

					);
				}
			}

			if (aAttributeNames.length === 0 || aFragmentContents.length === 0) {
				var iCodeLength = sErrorCode.length;

				if (sErrorText.indexOf("CM_CUAN_DA") !== -1) {
					sErrorText = sErrorText.substr(iCodeLength + 2);
				}
				if (bIsCreate) {

					MessageBox.error(sErrorText);
				}

			} else {

				for (var i = 0; i < aAttributeNames.length; i++) {

					aFragmentContents = aFragmentContents.filter(function(oControl) {
						var aCustomData;
						if (bIsCreate) {
							aCustomData = oControl.getCustomData();
						} else {
							if (oControl.getFormElements()[0].getFields()[0].getMetadata().getName() === "sap.ui.layout.VerticalLayout") {
								aCustomData = oControl.getFormElements()[0].getFields()[0].getContent()[1].getCustomData();
							}
						}

						if (aCustomData.length > 0) {

							if (aCustomData[0].getValue() === aAttributeNames[i].message) {
								return true;
							}
						}

					});
				}

				for (var j = 0; j < aFragmentContents.length; j++) {
					if (bIsCreate) {

						aFragmentContents[j].setValueState(sap.ui.core.ValueState.Error);
						aFragmentContents[j].setValueStateText(sErrorText);
					} else {
						if (aFragmentContents[j].getFormElements()[0].getFields()[0].getMetadata().getName() === "sap.ui.layout.VerticalLayout") {
							aFragmentContents[j].getFormElements()[0].getFields()[0].getContent()[1].setValueState(sap.ui.core.ValueState.Error);
							aFragmentContents[j].getFormElements()[0].getFields()[0].getContent()[1].setValueStateText(sErrorText);
						}
					}
				}

			}

		},

		/**
		 * set editable property to object view for different account type
		 * @params{boolean} bIsEditable editable for true. not for false
		 * @public
		 */

		setEditable: function(bIsEditable) {

			var oSpecForm = this._delegate.getView().byId("ObjectPageInfoAddFieldSmartForm");
			for (var i = 0; i < oSpecForm.getGroups().length; i++) {
				if (oSpecForm.getGroups()[i].getFormElements()[0].getFields()[0].getMetadata().getName() === "sap.ui.layout.VerticalLayout") {

					oSpecForm.getGroups()[i].getFormElements()[0].getFields()[0].getContent()[1].setEditable(bIsEditable);
					oSpecForm.getGroups()[i].getFormElements()[0].getFields()[0].getContent()[1].setVisible(bIsEditable);
					oSpecForm.getGroups()[i].getFormElements()[0].getFields()[0].getContent()[2].setVisible(!bIsEditable);
				}
			}
			oSpecForm.setEditable(bIsEditable);

		},
		/**
		 * get the model control to adjust the icontab of object view
		 * @return {object} the jsonmodel for icontab control
		 * @public
		 */
		getModelControl: function() {
			var aControlObject = Const.accountViewControl;
			if (aControlObject[this.sTypeCode]) {

				return aControlObject[this.sTypeCode];
			} else {
				return {
					contactList: true,
					contactAnaly: true,
					interactionAnaly: true,
					shakeNearbyAnaly: false
				};
			}
		},

		// for twitter or further digital account type to add sepcific icontabs.
		addSpeSections: function() {

		},

		addProperty: function(oFragment) {
			var aExtAttributesSet = [];
			for (var i = 0; i < this.aAdditionalProperty.length; i++) {
				var sProperty = this.aAdditionalProperty[i];
				var sValue = oFragment.getContent()[i * 2 + 1].getValue();
				var oAttributes = {
					AttributeName: sProperty,
					AttributeValue: sValue

				};
				aExtAttributesSet.push(oAttributes);

			}
			return aExtAttributesSet;

		},

		refreshAdditionalData: function() {
			this._delegate.getView().setBusy(true);
			this.getAttributesData().then(function(oResults) {
				var fnGetValue = function(aAttributeName) {
					var aAttValues = oResults.filter(function(oAttribute) {
						if (oAttribute.AttributeName === aAttributeName) {
							return true;
						}
					});
					if (aAttValues.length > 0) {
						return aAttValues[0].AttributeValue;
					} else {
						return "";
					}

				};

				this.aUpdateAttributes = [];
				var aFragmentContents = this._delegate.getView().byId("ObjectPageInfoAddFieldSmartForm").getGroups();
				for (var i = 0; i < aFragmentContents.length; i++) {
					if (aFragmentContents[i].getFormElements()[0].getFields()[0].getMetadata().getName() === "sap.ui.layout.VerticalLayout") {
						var oAttributeControl = aFragmentContents[i].getFormElements()[0].getFields()[0].getContent()[1];
						var oAttributeReadOnly = aFragmentContents[i].getFormElements()[0].getFields()[0].getContent()[2];
						oAttributeControl.setValue(fnGetValue(oAttributeControl.getCustomData()[0].getValue()));

						oAttributeControl.setValueState(sap.ui.core.ValueState.None);

						oAttributeReadOnly.setText(fnGetValue(oAttributeControl.getCustomData()[0].getValue()));
					}
				}
				this._delegate.getView().setBusy(false);

			}.bind(this), function(oError) {
				this._delegate.getView().setBusy(false);
			}.bind(this));

		},

		onObjectAddFieldChange: function(oEvent) {
			var oAttributeInput = oEvent.getSource();
			var sAttributeName = oAttributeInput.getCustomData()[0].getValue();
			var sAttributeValue = oAttributeInput.getValue();
			if ($.inArray(sAttributeName, this.aUpdateAttributes) === -1) {

				this.aUpdateAttributes.push(sAttributeName);
			}
			this.oUpdateAttributeValue[sAttributeName] = sAttributeValue;

		},

		/**
		 * destroy the account manager
		 * @public
		 */
		destroyManager: function() {
			// if (this.sCommunicationMedia === Const.commMediaConst.wechat) {
			// 	return this.oWechatManager.destroyManager();
			// } else if (this.sCommunicationMedia === Const.commMediaConst.line) {
			// 	return this.oLineManager.destroyManager();
			// }
		}

	});
});