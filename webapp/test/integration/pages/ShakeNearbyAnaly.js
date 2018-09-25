sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"hpa/cei/digital_account/test/integration/pages/Common",
	"hpa/cei/digital_account/test/integration/pages/shareOptions"
], function(Opa5, PropertyStrictEquals, Common, shareOptions) {
	"use strict";

	var sViewName = "ShakeNearbyAnaly";

	Opa5.createPageObjects({
		onTheShakeNearByAnalyPage: {
			baseClass: Common,

			actions: jQuery.extend({

				iChangeContent: function(sNum) {
					return this.waitFor({
						id: "shakeAnalyChart",
						viewName: sViewName,
						success: function(oContainer) {
							oContainer.fireContentChange({
								selectedItemId:oContainer.getContent()[sNum]
							});
						},
						errorMessage: "Did not find the measure select"
					});
				},
				
					iPressMeasureSelect: function(iNum) {
					return this.waitFor({
						id: "shakeAnalyChart",
						viewName: sViewName,
						success: function(oContainer) {
						oContainer.getDimensionSelectors()[0].fireChange({selectedItem:	oContainer.getDimensionSelectors()[0].getItems()[iNum]});
						oContainer.getDimensionSelectors()[0].setSelectedItem(oContainer.getDimensionSelectors()[0].getItems()[iNum]);
						},
						errorMessage: "Did not find the measure select"
					});
				},
				
				iPressTableSelect:function(iNum){
					return this.waitFor({
						id: "shakeAnalyChart",
						viewName: sViewName,
						success: function(oContainer) {
						oContainer.getDimensionSelectors()[1].fireChange({selectedItem:	oContainer.getDimensionSelectors()[1].getItems()[iNum]});
						oContainer.getDimensionSelectors()[1].setSelectedItem(oContainer.getDimensionSelectors()[1].getItems()[iNum]);
						},
						errorMessage: "Did not find the measure select"
					});
				},
				
				iSearchField:function(){
						return this.waitFor({
						id: "shakeAnalyChart",
						viewName: sViewName,
						success: function(oContainer) {
						oContainer.getDimensionSelectors()[2].fireSearch({query:	""});
						},
						errorMessage: "Did not find the measure select"
					});
					
				},
				iPressFilterButton: function() {

					return this.waitFor({
						id: "shakeAnalyChart",
						viewName: sViewName,
						success: function(oContainer) {
						oContainer.getCustomIcons()[0].firePress();
						},
						errorMessage: "Did not find the filter button"
					});

				},
				
				
				iFilterSaveButtonPress: function() {
					return this.waitFor({
						viewName: sViewName,
					
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[aButtons.length - 2].firePress();
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
				
				iWaitUntilTheContainerIsVisible: function() {
					return this.waitFor({
						id: "shakeAnalyChart",
						viewName: sViewName,
						
						matchers: function(oButton) {
							// visible false also returns visible controls so we need an extra check here
							return oButton.$().is(":visible");
						},
						errorMessage: "The container is still invisible"
					});
				},
				
				

			}),

			assertions: jQuery.extend({

					// iShouldSeeTheRememberedObject : function () {
					// 	return this.waitFor({
					// 		success : function () {
					// 			var sBindingPath = this.getContext().currentItem.bindingPath;
					// 			this.waitFor({
					// 				id : "page",
					// 				viewName : sViewName,
					// 				matchers : function (oPage) {
					// 					return oPage.getBindingContext() && oPage.getBindingContext().getPath() === sBindingPath;
					// 				},
					// 				success : function (oPage) {
					// 					Opa5.assert.strictEqual(oPage.getBindingContext().getPath(), sBindingPath, "was on the remembered detail page");
					// 				},
					// 				errorMessage : "Remembered object " + sBindingPath + " is not shown"
					// 			});
					// 		}
					// 	});
					// },

					iShouldSeeTheContainer: function() {
						return this.waitFor({
							id: "shakeAnalyChart",
							viewName: sViewName,
							success: function(oView) {
								Opa5.assert.ok(oView, "Found the shakenearby Analy");
							},
							errorMessage: "Can't see the shakenearby Analy."
						});
					},
					
						iShouldSeeTheFilterDialog: function() {
						return this.waitFor({
						id: "ShakedatePeriodFilter",
						viewName: sViewName,
						searchOpenDialogs: true,
							success: function(oView) {
								Opa5.assert.ok(oView, "Found the Interaction filter");
							},
							errorMessage: "Can't see the Interaction filter."
						});
					},
					
						

					iShouldSeeTheObjectViewsBusyIndicator: function() {
						return this.waitFor({
							id: "page",
							viewName: sViewName,
							matchers: function(oPage) {
								return oPage.getBusy();
							},
							success: function(oPage) {
								Opa5.assert.ok(oPage.getBusy(), "The object view is busy");
							},
							errorMessage: "The object view is not busy"
						});
					},

					theViewIsNotBusyAnymore: function() {
						return this.waitFor({
							id: "page",
							viewName: sViewName,
							matchers: function(oPage) {
								return !oPage.getBusy();
							},
							success: function(oPage) {
								Opa5.assert.ok(!oPage.getBusy(), "The object view is not busy");
							},
							errorMessage: "The object view is busy"
						});
					},

					theObjectViewsBusyIndicatorDelayIsZero: function() {
						return this.waitFor({
							id: "page",
							viewName: sViewName,
							success: function(oPage) {
								Opa5.assert.strictEqual(oPage.getBusyIndicatorDelay(), 0, "The object view's busy indicator delay is zero.");
							},
							errorMessage: "The object view's busy indicator delay is not zero."
						});
					},

					theObjectViewsBusyIndicatorDelayIsRestored: function() {
						return this.waitFor({
							id: "page",
							viewName: sViewName,
							matchers: new PropertyStrictEquals({
								name: "busyIndicatorDelay",
								value: 1000
							}),
							success: function() {
								Opa5.assert.ok(true, "The object view's busy indicator delay default is restored.");
							},
							errorMessage: "The object view's busy indicator delay is still zero."
						});
					}

					// theShareTileButtonShouldContainTheRememberedObjectName : function () {
					// 	return this.waitFor({
					// 		id : "shareTile",
					// 		viewName : sViewName,
					// 		matchers : function (oButton) {
					// 			var sObjectName = this.getContext().currentItem.name;
					// 			var sTitle = oButton.getTitle();
					// 			return sTitle && sTitle.indexOf(sObjectName) > -1;
					// 		}.bind(this),
					// 		success : function () {
					// 			Opa5.assert.ok(true, "The Save as Tile button contains the object name");
					// 		},
					// 		errorMessage : "The Save as Tile did not contain the object name"
					// 	});
					// }

				}
				// , shareOptions.createAssertions(sViewName)
			)

		}

	});

});