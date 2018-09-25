/*global history */
sap.ui.define(["sap/ui/base/Object",
	"hpa/cei/digital_account/util/Const"
], function(Object, Const) {
	"use strict";

	return Object.extend("hpa.cei.digital_account.util.AppNavigator", {

		constructor: function(o) {
			this._initCrossAppNavigator();
			this._delegate = o;
			this.oResourceBundle = o.getResourceBundle();
		},

		navigateToTargetGroup: function(sTargetGrpId) {
			if (this.oCrossAppNavigator) {
				this.oCrossAppNavigator.isNavigationSupported([{
						target: {
							semanticObject: "TargetGroup",
							action: "maintain"
						},
						params: {
							"id": [sTargetGrpId],
							"sap-hpa-targetobject": ["TARGETGROUP_TI"]
						}
					}])
					.done(function(aResponses1) {
						if (aResponses1[0].supported === true) {
							/* eslint-disable sap-cross-application-navigation */
							var sHash = this.oCrossAppNavigator.hrefForExternal({
								target: {
									semanticObject: "TargetGroup",
									action: "maintain"
								},
								params: {
									"id": [sTargetGrpId],
									"sap-hpa-targetobject": ["TARGETGROUP_TI"]
								}
							});
							var url = window.location.href.split('#')[0] + sHash;

							sap.m.URLHelper.redirect(url, true);
						} else {
							sap.m.MessageBox.error(this.oResourceBundle.getText("navtoTargetGroupNotSupportedError"));

						}

					}.bind(this))
					.fail(function() {
						sap.m.MessageBox.error(this.oResourceBundle.getText("navtoTargetGroupNotSupportedError"));

						//error handling
					}.bind(this));
			}
		},
		// navigateToContactDetail: function(sContactId) {
		// 	if (this.oCrossAppNavigator) {

		// 		this.oCrossAppNavigator.isNavigationSupported([{
		// 				target: {
		// 					semanticObject: "MarketingContact",
		// 					action: "displayFactSheet"
		// 				},
		// 				params: {
		// 					"id": [sContactId],
		// 					"icrelcode": "0"
		// 				}
		// 			}])
		// 			.done(function(aResponses) {
		// 				if (aResponses[0].supported === true) {
		// 					/* eslint-disable sap-cross-application-navigation */
		// 					var sHash = this.oCrossAppNavigator.hrefForExternal({
		// 						target: {
		// 							semanticObject: "MarketingContact",
		// 							action: "displayFactSheet"
		// 						},
		// 						params: {
		// 							"id": [sContactId],
		// 							"icrelcode": "0"
		// 						}
		// 					});
		// 					var url = window.location.href.split('#')[0] + sHash;
		// 					sap.m.URLHelper.redirect(url, true);
		// 				} else {
		// 					sap.m.MessageBox.error(this.oResourceBundle.getText("navtoContactNotSupportedError"));
		// 				}
		// 				/* eslint-enable sap-cross-application-navigation */
		// 			}.bind(this))
		// 			.fail(function() {
		// 				sap.m.MessageBox.error(this.oResourceBundle.getText("navtoContactNotSupportedError"));
		// 				//	sap.m.MessageBox.error("not supported");
		// 				//error handling
		// 			});

		// 	}
		// },

		_initCrossAppNavigator: function() {
			var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
		}

	});
});