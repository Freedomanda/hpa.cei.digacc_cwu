sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"hpa/cei/digital_account/test/integration/pages/Common",
		"hpa/cei/digital_account/test/integration/pages/shareOptions",
		"sap/ui/core/util/MockServer"
	], function(Opa5, PropertyStrictEquals, Common, shareOptions,MockServer) {
		"use strict";

		var sViewName = "Object";
		
		

		Opa5.createPageObjects({
			onTheObjectPage: {
				baseClass : Common,

				actions : jQuery.extend({

					iPressTheBackButton : function () {
						return this.waitFor({
							id : "DigitalAccountPage",
							viewName : sViewName,
							success : function (oPage) {
								oPage.fireNavButtonPress();
							},
							errorMessage : "Did not find the nav button on object page"
						});
					},
					iPressEditButton:function(){
						
							return this.waitFor({
						id: "Edit",
						viewName: sViewName,
					
					
						success: function(oButton) {
							oButton.firePress();
                                  //  oToolbar.getContent()[iButtonNum].$().trigger("tap");
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
					
					
						
					},
					
					iWaitUntilTheButtonIsVisible: function(sButtonId) {
					return this.waitFor({
						id: sButtonId,
						viewName: sViewName,
						visible: true,
						matchers: function(oButton) {
							// visible false also returns visible controls so we need an extra check here
							return oButton.$().is(":visible");
						},
						errorMessage: "The Button "+ sButtonId +" is still invisible"
					});
				},
				
				
				iWaitUntilTheDialogIsVisible: function() {
					return this.waitFor({
						id: "serverUrlSimpleForm",
						viewName: sViewName,
						searchOpenDialogs: true,
						matchers: function(oButton) {
							// visible false also returns visible controls so we need an extra check here
							return oButton.$().is(":visible");
						},
						errorMessage: "The Dialog is still invisible"
					});
				},
					
					iEditSomething:function(){
							return this.waitFor({
						
						viewName: sViewName,
						controlType: "sap.ui.comp.smartfield.SmartField",
					
						success: function(aSmartField) {
                                    aSmartField[5].setValue("test1234");
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
						
					},
						iPressCancelButton:function(){
						
							return this.waitFor({
						id: "Footer-CancelButton",
						viewName: sViewName,
					
					
						success: function(oButton) {
                                    oButton.firePress();
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the cancel button."
					});
						
					},
					
					iPressSaveButton:function(){
							return this.waitFor({
						id: "Footer-SaveButton",
						viewName: sViewName,
					
					
						success: function(oButton) {
                                    oButton.firePress();
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
					},
					
					iPressWebUrlLink:function(){
							return this.waitFor({
						id: "serverUrlLink",
						viewName: sViewName,
					
					
						success: function(oLink) {
                                   oLink.firePress();
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
					},
					iCloseWebUrlDial:function(){
						
						return this.waitFor({
						viewName: sViewName,
						id: "externalUrlCloseButton",
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							if(aButtons instanceof Array){
							if(aButtons.length > 1){
							aButtons[1].firePress(aButtons[1]);
						}else{
							aButtons[0].firePress();
						}
							}else{
								aButtons.firePress(aButtons);
							}
					
							
						},
						errorMessage: "did not find the create cancel button"
					});
						
					},
					iPressInPrepareButton:function(){
						
							return this.waitFor({
						id: "inPreparation",
						viewName: sViewName,
					
					
						success: function(oButton) {
                                   oButton.firePress();
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
						
					},
					iPressActiveButton:function(){
						
							return this.waitFor({
						id: "active",
						viewName: sViewName,
					
					
						success: function(oButton) {
                                   oButton.firePress();
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
						
					},
						iPressArchiveButton:function(){
						
							return this.waitFor({
						id: "archive",
						viewName: sViewName,
					
					
						success: function(oButton) {
                                   oButton.firePress(oButton);
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
					
					
						
					},
					
					iClickCancelInMsgBox:function(){
						
							return this.waitFor({
					
						viewName: sViewName,
						searchOpenDialogs: true,
							controlType: "sap.m.Button",
					
					
						success: function(aButtons) {
                                   aButtons[1].firePress();
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
						
					},
					iPressIconTabItem:function(iKey){
							return this.waitFor({
						id: "detailDAObjectHeader",
						viewName: sViewName,
					
					
						success: function(oIconTab) {
							

                                   oIconTab.fireNavigate({section:oIconTab.getSections()[iKey]});
                                   oIconTab.setSelectedSection(oIconTab.getSections()[iKey]);
						//	Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
					}

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
					
						iShouldSeeTheObject : function () {
						return this.waitFor({
							id : "detailDAObjectHeader",
							viewName : sViewName,
							success : function (oView) {
								oView.getHeaderTitle().getActions()[0].setVisible(true);
								oView.getHeaderTitle().getActions()[1].setVisible(true);
								oView.getHeaderTitle().getActions()[2].setVisible(true);
								oView.getHeaderTitle().getActions()[3].setVisible(true);
									oView.getSections()[1].setVisible(true);
										oView.getSections()[2].setVisible(true);
											oView.getSections()[3].setVisible(true);
								oView.getSections()[4].setVisible(true);
								Opa5.assert.ok(oView, "Found the object view");
							},
							errorMessage : "Can't see the object."
						});
					},
					
						iShouldSeeThePage : function () {
						return this.waitFor({
							id : "DigitalAccountPage",
							viewName : sViewName,
							success : function (oView) {
								Opa5.assert.ok(oView, "Found the object view");
							},
							errorMessage : "Can't see the object."
						});
					},
					
						iShouldSeeTheDialog: function() {
					return this.waitFor({
						id: "serverUrlSimpleForm",
						viewName: sViewName,
						searchOpenDialogs: true,
						success: function(aDialogs) {
							Opa5.assert.ok(aDialogs[0], "Found the web url Dialog");
							//	Opa5.assert.strictEqual(oDialog[0].isOpen(), true,"Dialog is opened");
						},
						errorMessage: "Can't see the serverUrlSimpleForm Dialog."
					});
				},
				
					iShouldSeeTheWPDialog: function() {
					return this.waitFor({
						id: "dataLossYesButton",
						viewName: sViewName,
						searchOpenDialogs: true,
						success: function(aDialogs) {
							Opa5.assert.ok(aDialogs[0], "Found the data loss Dialog");
							//	Opa5.assert.strictEqual(oDialog[0].isOpen(), true,"Dialog is opened");
						},
						errorMessage: "Can't see the data loss Dialog."
					});
				},
				
				
					
					

					iShouldSeeTheObjectViewsBusyIndicator : function () {
						return this.waitFor({
							id : "page",
							viewName : sViewName,
							matchers : function (oPage) {
								return oPage.getBusy();
							},
							success : function (oPage) {
								Opa5.assert.ok(oPage.getBusy(), "The object view is busy");
							},
							errorMessage : "The object view is not busy"
						});
					},

					theViewIsNotBusyAnymore : function () {
						return this.waitFor({
							id : "page",
							viewName : sViewName,
							matchers : function (oPage) {
								return !oPage.getBusy();
							},
							success : function (oPage) {
								Opa5.assert.ok(!oPage.getBusy(), "The object view is not busy");
							},
							errorMessage : "The object view is busy"
						});
					},

					theObjectViewsBusyIndicatorDelayIsZero : function () {
						return this.waitFor({
							id : "page",
							viewName : sViewName,
							success : function (oPage) {
								Opa5.assert.strictEqual(oPage.getBusyIndicatorDelay(), 0, "The object view's busy indicator delay is zero.");
							},
							errorMessage : "The object view's busy indicator delay is not zero."
						});
					},

					theObjectViewsBusyIndicatorDelayIsRestored : function () {
						return this.waitFor({
							id : "page",
							viewName : sViewName,
							matchers: new PropertyStrictEquals({
								name : "busyIndicatorDelay",
								value: 1000
							}),
							success : function () {
								Opa5.assert.ok(true, "The object view's busy indicator delay default is restored.");
							},
							errorMessage : "The object view's busy indicator delay is still zero."
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

	}
);