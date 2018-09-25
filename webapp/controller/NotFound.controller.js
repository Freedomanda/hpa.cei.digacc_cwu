sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("hpa.cei.digital_account.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function() {
			this.getRouter().navTo("worklist");
		}

	});

});