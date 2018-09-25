sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"hpa/cei/digital_account/test/integration/pages/Common",
	"sap/ui/core/util/MockServer"

], function(Opa5, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Common, MockServer) {
	"use strict";
	var sViewName = "ContactList",
	    sTableId  = "contactTable";
	    
	function createWaitForItemAtPosition(oOptions) {
		var iPosition = oOptions.position;
		return {
			id: sTableId,
			viewName: sViewName,
			matchers: function(oTable) {
				return oTable.getItems()[iPosition];
			},
			success: oOptions.success,
			errorMessage: "Table in view '" + sViewName + "' does not contain an Item at position '" + iPosition + "'"
		};
	}

	Opa5.createPageObjects({
		onTheContactListPage: {
			baseClass : Common,
			actions : {
				
				iPressTGButtonInTable: function() {
					return this.waitFor({
						viewName: sViewName,
						id: sTableId,

						success: function(oTable) {
						
						   oTable.getHeaderToolbar().getContent()[2].firePress();
						},
						errorMessage: "did not find the TG button"
					});

				},
				
				
				
				iPressFilterButtonInTable: function() {
					return this.waitFor({
						viewName: sViewName,
						id: sTableId,

						success: function(oTable) {
						//	oTable.getHeaderToolbar().getContent()[2].setVisible(true);
						   oTable.getHeaderToolbar().getContent()[3].firePress();
						},
						errorMessage: "did not find the icontab"
					});

				},
				
				iPressPerButtonInTable: function() {
					return this.waitFor({
						viewName: sViewName,
						id: sTableId,

						success: function(oTable) {
						//	oTable.getHeaderToolbar().getContent()[2].setVisible(true);
						   oTable.getHeaderToolbar().getContent()[4].firePress();
						},
						errorMessage: "did not find the icontab"
					});

				},
				iCancelButtonPress: function() {
					return this.waitFor({
						id: "targetGroupCancelButton",
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[0].firePress();
						},
						errorMessage: "did not find the cancel button"
					});
				},
				
				iFilterCancelButtonPress: function() {
					return this.waitFor({
						viewName: sViewName,
					
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[aButtons.length - 1].firePress();
						},
						errorMessage: "did not find the cancel button"
					});
				},
				
					iPerCancelButtonPress: function() {
					return this.waitFor({
						viewName: sViewName,
					
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[aButtons.length - 1].firePress();
						},
						errorMessage: "did not find the cancel button"
					});
				},
				
				
				iPressTheBackButton : function (iPosition) {
					return this.waitFor(createWaitForItemAtPosition({
						position: iPosition,
						success : function (oPage) {
							oPage.$("#backBtn").trigger("tap");
						}
					}));
				},
					iWaitUntilTheTableIsVisible: function() {
					return this.waitFor({
						id: "contactTable",
						viewName: sViewName,
						visible: true,
						matchers: function(oButton) {
							// visible false also returns visible controls so we need an extra check here
							return oButton.$().is(":visible");
						},
						errorMessage: "The container is still invisible"
					});
				},
				
				iPressCreateTGButton: function(iPosition) {
					return this.waitFor(createWaitForItemAtPosition({
						position: iPosition,
						success : function (oPage) {
							oPage.$("#createTGButton").trigger("tap");
						}
					}));
				}
				
			},
			
			assertions: jQuery.extend({
				
				
					iShouldSeeTheContactTable : function () {
						return this.waitFor({
							id : "contactTable",
							viewName : sViewName,
							success : function (oView) {
									oView.getHeaderToolbar().getContent()[2].setVisible(true);
									oView.getHeaderToolbar().getContent()[2].setEnabled(true);
								Opa5.assert.ok(oView, "Found the table");
							},
							errorMessage : "Can't see the contact table."
						});
					},
					
				iShouldSeeTheTargetGroupPopOver: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						id: "targetGroupCancelButton",
						success: function(oView) {
							Opa5.assert.ok(oView, "Found the Target Group Popup");
						},
						errorMessage: "Could not find the target group popover"
					});
				},
				
				iShouldSeeTheFilterPopOver: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						success: function(oView) {
							Opa5.assert.ok(oView, "Found the Target Group Popup");
						},
						errorMessage: "Could not find the target group popover"
					});
				},
				
				pressedTheBack  : function() {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							Opa5.assert.ok(oTable, "Found the object Table");
						},
						errorMessage: "Can't see the master Table."
					});
				},
				
				pressedCreateTGButton: function() {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							Opa5.assert.ok(oTable, "Found the object Table");
						},
						errorMessage: "Can't see the master Table."
					});
				}
			})
		}
	});
});