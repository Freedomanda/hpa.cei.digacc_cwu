sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox",
	"hpa/cei/digital_account/util/Const"
], function(UI5Object, MessageBox, Const) {
	"use strict";

	return UI5Object.extend("hpa.cei.digital_account.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias hpa.cei.digital_account.controller.ErrorHandler
		 */
		constructor: function(oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");
			this._sValidationErrorText = this._oResourceBundle.getText("validationErrorText");
			this._oModel.attachMetadataFailed(function(oEvent) {
				var oParams = oEvent.getParameters();
				this._showMetadataError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function(oEvent) {
				var oParams = oEvent.getParameters();

				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though

				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
						"Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
		 * The user can try to refresh the metadata.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showMetadataError: function(sDetails) {
			MessageBox.error(
				this._sErrorText, {
					id: "metadataErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
					onClose: function(sAction) {
						if (sAction === MessageBox.Action.RETRY) {
							this._oModel.refreshMetadata();
						}
					}.bind(this)
				}
			);
		},

		_showMessageBoxError: function(sDetails) {
			this._bMessageOpen = true;
			MessageBox.error(
				this._sErrorText, {
					id: "serviceErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);

		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * if a app/sec id validation error is fetched,no error message box is shown at this time.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function(sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			try {
				var oErrorMsg = JSON.parse(sDetails.responseText);
				var sErrorCode = oErrorMsg.error.code;
				if (sErrorCode === Const.errorMsgConst.noCommAreaError || sErrorCode === Const.errorMsgConst.createTGError) {

					var iCodeLength = sErrorCode.length;
					var sErrorMsg = oErrorMsg.error.message.value;
					if (sErrorMsg.indexOf("business/error") !== -1) {
						sErrorMsg = sErrorMsg.substr(iCodeLength + 2);
					}
					MessageBox.error(sErrorMsg);
				}
				// else if (sErrorCode === Const.errorMsgConst.invalidAppError || oErrorMsg.error.code === Const.errorMsgConst.longTermTokenError || oErrorMsg.error.code === Const.errorMsgConst.keyCheckError) {
				// //	this._bMessageOpen = true;
				// }
				else if (sErrorCode.indexOf("CM_CUAN_DA") !== -1) {
					// if(Const.handledErrorCodeArray.indexOf(sErrorCode) === -1){

					// var iCodeLength = sErrorCode.length;
					// var sErrorMsg = oErrorMsg.error.message.value;
					// if (sErrorMsg.indexOf("CM_CUAN_DA") !== -1) {
					// 	sErrorMsg = sErrorMsg.substr(iCodeLength + 2);
					// }
					// MessageBox.error(sErrorMsg);
					// }
					//	this._bMessageOpen = true;
				} else {
					this._showMessageBoxError(sDetails);
				}
			} catch (e) {
				this._showMessageBoxError(sDetails);
			}

		}

	});
});