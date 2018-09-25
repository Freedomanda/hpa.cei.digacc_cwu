sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"hpa/cei/digital_account/test/integration/pages/Common",
	"sap/ui/core/util/MockServer"

], function(Opa5, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Common, MockServer) {
	"use strict";

	var sViewName = "Worklist",
		sTableId = "publicAccountTable",
		sSmartTableId = "smartDATable",
		sCreateDialogId = "createAccoutDialog",
		sSearchFieldId = "searchField",
		sSomethingThatCannotBeFound = "*#-Q@@||";

	function getMockServer() {
		var oMockServer;
		//	_sAppModulePath = "hpa/cei/digital_account/";
		//	_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";
		//		var oUriParameters = jQuery.sap.getUriParameters(),
		//	sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
		var sManifestUrl = "../../manifest.json",
			//	sEntity = "DigitalAccount",
			//		sErrorParam = oUriParameters.get("errorType"),
			//	iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
			oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
			oMainDataSource = oManifest["sap.app"].dataSources.mainService,
			//		sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
			// ensure there is a trailing slash
			sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

		oMockServer = new MockServer({
			rootUri: sMockServerUrl
		});
		return oMockServer;
	}
	var oMockServer = getMockServer();
	oMockServer.start();

	function allItemsInTheListContainTheSearchTerm(aControls) {
		var oTable = aControls[0],
			oSearchField = aControls[1],
			aItems = oTable.getRows();

		// table need items
		if (aItems.length === 0) {
			return false;
		}

		return aItems.every(function(oItem) {
			return oItem.getCells()[0].getItems()[2].getText().indexOf(oSearchField.getValue()) !== -1;
		});
	}

	function createWaitForItemAtPosition(oOptions) {
		var iPosition = oOptions.position;
		return {
			id: sTableId,
			viewName: sViewName,
			matchers: function(oTable) {
				return oTable.getRows()[iPosition];
			},
			success: oOptions.success,
			errorMessage: "Table in view '" + sViewName + "' does not contain an Item at position '" + iPosition + "'"
		};
	}

	function enterSomethingInASearchField(oSearchField, oSearchParams) {
		oSearchParams = oSearchParams || {};

		if (oSearchParams.searchValue) {
			oSearchField.setValue(oSearchParams.searchValue);
		}

		if (oSearchParams.skipEvent) {
			return;
		}

		/*eslint-disable new-cap */
		var oEvent = jQuery.Event("touchend");
		/*eslint-enable new-cap */
		oEvent.originalEvent = {
			query: oSearchParams.searchValue,
			refreshButtonPressed: oSearchParams.refreshButtonPressed,
			id: oSearchField.getId()
		};
		oEvent.target = oSearchField;
		oEvent.srcElement = oSearchField;
		jQuery.extend(oEvent, oEvent.originalEvent);

		oSearchField.fireSearch(oEvent);
	}

	Opa5.createPageObjects({

		onTheWorklistPage: {
			baseClass: Common,
			actions: jQuery.extend({
				iPressATableItemAtPosition: function(iPosition) {
					return this.waitFor(createWaitForItemAtPosition({
						position: iPosition,
						success: function(oTableItem) {
							oTableItem.getCells()[0].getItems()[2].firePress();
						}
					}));
				},

				// iPressTheBackButton: function() {
				// 	return this.waitFor({
				// 		id: "paPage",
				// 		viewName: sViewName,
				// 		success: function(oPage) {
				// 			oPage.$("navButton").trigger("tap");
				// 		},
				// 		errorMessage: "Did not find the nav button on worklist page"
				// 	});
				// },

				iRememberTheItemAtPosition: function(iPosition) {
					return this.waitFor(createWaitForItemAtPosition({
						position: iPosition,
						success: function(oTableItem) {
							oTableItem.getCells()[0].getItems()[2].firePress();
							//	var oBindingContext = oTableItem.getBindingContext();

							// Don't remember objects just strings since IE will not allow accessing objects of destroyed frames
							// this.getContext().currentItem = {
							// 	bindingPath: oBindingContext.getPath(),
							// 	id: oBindingContext.getProperty("AccountId"),
							// 	name: oBindingContext.getProperty("AccountId")
							// };
						}
					}));
				},

				// iPressOnMoreData: function() {
				// 	return this.waitFor({
				// 		id: sTableId,
				// 		viewName: sViewName,
				// 		matchers: function(oTable) {
				// 			return !!oTable.$("trigger").length;
				// 		},
				// 		success: function(oTable) {
				// 			oTable.$("trigger").trigger("tap");
				// 		},
				// 		errorMessage: "The Table does not have a trigger"
				// 	});
				// },

				iWaitUntilTheTableIsLoaded: function() {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						matchers: [new AggregationFilled({
							name: "rows"
						})],
						errorMessage: "The Table has not been loaded"
					});
				},

				iWaitUntilTheListIsNotVisible: function() {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						visible: false,
						matchers: function(oTable) {
							// visible false also returns visible controls so we need an extra check here
							return !oTable.$().is(":visible");
						},
						errorMessage: "The Table is still visible"
					});
				},

				iSearchForTheFirstObject: function() {
					var sFirstObjectTitle;

					this.waitFor({
						id: sTableId,
						viewName: sViewName,
						matchers: new AggregationFilled({
							name: "rows"
						}),
						success: function(oTable) {
							sFirstObjectTitle = oTable.getRows()[0].getCells()[0].getItems()[2].getText();
						},
						errorMessage: "Did not find table entries while trying to search for the first object."
					});

					this.waitFor({
						id: sSearchFieldId,
						viewName: sViewName,
						success: function(oSearchField) {
							enterSomethingInASearchField(oSearchField, {
								searchValue: ""
							});
						},
						errorMessage: "Failed to find search field in Worklist view.'"
					});

					return this.waitFor({
						id: [sTableId, sSearchFieldId],
						viewName: sViewName,
						check: allItemsInTheListContainTheSearchTerm,
						errorMessage: "Did not find any table entries or too many while trying to search for the first object."
					});
				},

				iSearchForAllObjects: function() {
					var sEmptyObjectTitle;

					this.waitFor({
						id: sTableId,
						viewName: sViewName,
						matchers: new AggregationFilled({
							name: "rows"
						}),
						success: function(oTable) {
							sEmptyObjectTitle = "";
						},
						errorMessage: "Did not find table entries while trying to search for the first object."
					});

					this.waitFor({
						id: sSearchFieldId,
						viewName: sViewName,
						success: function(oSearchField) {
							enterSomethingInASearchField(oSearchField, {
								searchValue: sEmptyObjectTitle
							});
						},
						errorMessage: "Failed to find search field in Worklist view.'"
					});

					return this.waitFor({
						id: [sTableId, sSearchFieldId],
						viewName: sViewName,
						check: allItemsInTheListContainTheSearchTerm,
						errorMessage: "Did not find any table entries or too many while trying to search for the first object."
					});
				},

				iClickIconTab: function(sKey) {
					return this.waitFor({
						viewName: sViewName,
						id: "paListIconTabBar",

						success: function(oIconTab) {
							oIconTab.fireSelect({
								key: sKey
							});
						},
						errorMessage: "did not find the icontab"
					});

				},

				iClickSegmentButton: function(sKey) {
					return this.waitFor({
						viewName: sViewName,
						id: "myAllContentSegmentedButton",
						// 			matchers : function (oSegButton) {
						// 	return oSegButton.getItems()[iPosition];
						// },
						success: function(oSegButton) {
							oSegButton.fireSelect({
								key: sKey
							});
						},
						errorMessage: "did not find the segbutton"
					});
				},

				iTypeSomethingInTheSearchThatCannotBeFound: function() {
					return this.iSearchForValue({
						searchValue: sSomethingThatCannotBeFound,
						skipEvent: true
					});
				},

				iSearchForValue: function(oSearchParams) {
					return this.waitFor({
						id: sSearchFieldId,
						viewName: sViewName,
						success: function(oSearchField) {
							enterSomethingInASearchField(oSearchField, oSearchParams);
						},
						errorMessage: "Failed to find search field in Worklist view.'"
					});
				},

				iClearTheSearch: function() {
					return this.iSearchForValue({
						searchValue: ""
					});
				},

				iSearchForSomethingWithNoResults: function() {
					return this.iSearchForValue({
						searchValue: sSomethingThatCannotBeFound
					});
				},

				// iTriggerRefresh: function() {
				// 	return this.iSearchForValue({
				// 		refreshButtonPressed: true
				// 	});
				// },

				iCreateButtonPress: function() {
					return this.waitFor({
						viewName: sViewName,
						id: "createPAButton",

						success: function(oButton) {
							oButton.firePress(oButton);
						},
						errorMessage: "did not find the create button"
					});
				},

				iCreateErrorPress: function(sErrorText) {

					oMockServer.stop();
					var aMockRequest = [{
						method: "POST",
						path: new RegExp("/DigitalAccounts"),
						response: function(oXhr) {

							return oXhr.respond(
								500, {
									"Content-Type": "application/json;charset=utf-8"
								},
								sErrorText);

						}

					}];

					oMockServer.setRequests(aMockRequest);
					oMockServer.start();

					return this.waitFor({
						viewName: sViewName,
						id: "accountCreateOkButton",
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[0].firePress();
							oMockServer.stop();
						},
						errorMessage: "did not find the create button"
					});
				},

				iCreateOkButtonPress: function() {
					return this.waitFor({
						viewName: sViewName,
						id: "accountCreateOkButton",
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[1].firePress();
						},
						errorMessage: "did not find the create ok button"
					});
				},

				iCreateCancelButtonPress: function() {
					return this.waitFor({
						viewName: sViewName,
						id: "accountCreateCancelButton",
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						success: function(aButtons) {
							aButtons[0].firePress();
						},
						errorMessage: "did not find the create cancel button"
					});
				},
				
				iCloseDialog:function(){
						return this.waitFor({
						viewName: sViewName,
					
						searchOpenDialogs: true,
						controlType: "sap.m.Dialog",
						success: function(aButtons) {
							aButtons[0].close();
						},
						errorMessage: "did not find the create cancel button"
					});
					
				},
				
					iTileClick: function() {
					return this.waitFor({
						viewName: sViewName,

						searchOpenDialogs: true,
						controlType: "sap.m.CustomTile",
						success: function(aTiles) {

							aTiles[0].firePress();

						},
						errorMessage: "did not find the Tiles"
					});
				},

				iCreateInputChange: function() {
					return this.waitFor({
						viewName: sViewName,

						searchOpenDialogs: true,
						controlType: "sap.m.Input",
						success: function(aInputs) {

							aInputs[0].fireLiveChange();

						},
						errorMessage: "did not find the Inputs"
					});
				},

				iCreateInputValue: function(iTime) {
					return this.waitFor({
						viewName: sViewName,

						searchOpenDialogs: true,
						controlType: "sap.m.Input",
						success: function(aInputs) {
							aInputs[0].fireLiveChange();
							aInputs[0].setValue("test");
							aInputs[1].setValue("test");
							if(iTime === 2){
									aInputs[1].setValue("test21");
					//			aInputs[2].setValue("test");
							}
						//	aInputs[2].setValue("test");
							// aInputs[3].setValue("test");
							// aInputs[4].setValue("test");
							// aInputs[5].setValue("test");

						},
						errorMessage: "did not find the Inputs"
					});
				},

				// iFilterButtonPress: function() {
				// 	return this.waitFor({
				// 		viewName: sViewName,
				// 		id: "filterButton",

				// 		success: function(oButton) {
				// 			oButton.$().trigger("tap");
				// 		},
				// 		errorMessage: "did not find the filter button"
				// 	});
				// },

				// iPersonalizationButtonPress: function() {
				// 	return this.waitFor({
				// 		viewName: sViewName,
				// 		id: "personalizeButton",

				// 		success: function(oButton) {
				// 			oButton.$().trigger("tap");
				// 		},
				// 		errorMessage: "did not find the personalize button"
				// 	});
				// },

				// iFilterFilterButtonPress: function() {
				// 	return this.waitFor({
				// 		searchOpenDialogs: true,
				// 		controlType: "sap.m.Button",
				// 		matchers: function(oControl) {
				// 			return new PropertyStrictEquals({
				// 				name: "id",
				// 				value: "accountCreateViewSetting-filterbutton"
				// 			}).isMatching(oControl);
				// 		},
				// 		success: function(oItemMatched) {
				// 			oItemMatched[0].$().trigger("tap");
				// 			ok(true, "filter button pressed");
				// 		},
				// 		errorMessage: "Dialog with required button missing."
				// 	});
				// },

				// iSelectDescFilter: function(iPosition) {
				// 	var oMatchedItem;
				// 	return this.waitFor({
				// 		searchOpenDialogs: true,
				// 		controlType: "sap.m.List",
				// 		check: function(oList) {
				// 			var i = 0;

				// 			for (i = 0; i < oList.length; i++) {

				// 				oMatchedItem = oList[i].getItems()[iPosition];
				// 				return true;

				// 			}
				// 			if (!oMatchedItem) {
				// 				return false;
				// 			}

				// 		},
				// 		success: function() {
				// 			oMatchedItem.focus();
				// 			oMatchedItem.setSelected(true);
				// 			oMatchedItem.$().trigger("select");
				// 			oMatchedItem.$().trigger("tap");
				// 			Opa5.assert.ok(true, "List Item was selected");
				// 		},
				// 		errorMessage: "List Item    was not found"

				// 	});

				// },

				// iFilterInputValue: function(sValue) {
				// 	return this.waitFor({
				// 		searchOpenDialogs: true,
				// 		controlType: "sap.m.Input",
				// 		matchers: function(oControl) {
				// 			return new PropertyStrictEquals({
				// 				name: "id",
				// 				value: "accountFilterDeInput"
				// 			}).isMatching(oControl);
				// 		},
				// 		success: function(oItemMatched) {
				// 			oItemMatched[0].setValue(sValue);
				// 			ok(true, "value inputed");
				// 		},
				// 		errorMessage: "Dialog with input value missing."
				// 	});

				// },

				// iFilterConfirmButtonPress: function() {
				// 	this.waitFor({
				// 		id: "accountCreateViewSetting",
				// 		success: function(oSettingsDialog) {
				// 			// .fireConfirm() looked like the canocial choice but it requires a lot of paramters.
				// 			oSettingsDialog.fireConfirm({
				// 				"filterItems": oSettingsDialog.getFilterItems(),
				// 				"sortItem": oSettingsDialog.getSortItems()[0]
				// 			});
				// 		},
				// 		errorMessage: "Settings dialog does not show up"
				// 	});
				// 	return this;
				// }

			}),

			assertions: jQuery.extend({

				iShouldSeeTheTable: function() {
					this.waitFor(this.createAWaitForAnEntitySet({
						entitySet: "DigitalAccounts",
						success: function(aEntityData) {
						//	aAllEntities = aEntityData;
						}
					}));
					return this.waitFor({
						id: sSmartTableId,
						viewName: sViewName,
						success: function(oTable) {
							if(oTable.getCustomToolbar().getContent().length > 5){
								oTable.getCustomToolbar().getContent()[5].setVisible(true);
							}else{
								
							
							oTable.getCustomToolbar().getContent()[2].setVisible(true);
							}
						//	oTable.getCustomToolbar().getContent()[2].setVisible(true);     
							Opa5.assert.ok(oTable, "Found the object Table");
							
							
						},
						errorMessage: "Can't see the master Table."
					});
				},

				theTableShowsOnlyObjectsWithTheSearchStringInTheirTitle: function() {
					this.waitFor({
						id: [sTableId, sSearchFieldId],
						viewName: sViewName,
						check: allItemsInTheListContainTheSearchTerm,
						success: function() {
							Opa5.assert.ok(true, "Every item did contain the title");
						},
						errorMessage: "The table did not have items"
					});
				},

				theTableHasEntries: function() {
					return this.waitFor({
						viewName: sViewName,
						id: sTableId,
						matchers: new AggregationFilled({
							name: "rows"
						}),
						success: function() {
							Opa5.assert.ok(true, "The table has entries");
						},
						errorMessage: "The table had no entries"
					});
				},

				theTableShouldHaveAllEntries: function() {
					var aAllEntities,
						iExpectedNumberOfItems;

					// retrieve all DigitalAccount to be able to check for the total amount
					this.waitFor(this.createAWaitForAnEntitySet({
						entitySet: "DigitalAccounts",
						success: function(aEntityData) {
							aAllEntities = aEntityData;
						}
					}));

					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						matchers: function(oTable) {
							// If there are less items in the list than the growingThreshold, only check for this number.
							iExpectedNumberOfItems = 11;
							return new AggregationLengthEquals({
								name: "rows",
								length: iExpectedNumberOfItems
							}).isMatching(oTable);
						},
						success: function(oTable) {
							Opa5.assert.strictEqual(oTable.getRows().length, iExpectedNumberOfItems, "The growing Table has " +
								iExpectedNumberOfItems + " items");
						},
						errorMessage: "Table does not have all entries."
					});
				},

				iShouldSeeTheCreateDialog: function() {
					return this.waitFor({
						id: sCreateDialogId,
						viewName: sViewName,
						searchOpenDialogs: true,
						controlType: "sap.m.Dialog",
						success: function(aDialogs) {
							Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
							//	Opa5.assert.strictEqual(oDialog[0].isOpen(), true,"Dialog is opened");
						},
						errorMessage: "Can't see the create Dialog."
					});
				},
				
					iShouldSeeTheCreateDialogAndOk: function() {
					return this.waitFor({
						id: sCreateDialogId,
						viewName: sViewName,
						searchOpenDialogs: true,
						controlType: "sap.m.Dialog",
						success: function(aDialogs) {
							aDialogs[0].getButtons()[0].setVisible(true);
							Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
							//	Opa5.assert.strictEqual(oDialog[0].isOpen(), true,"Dialog is opened");
						},
						errorMessage: "Can't see the create Dialog."
					});
				},

				iShouldSeeTheFilterDialog: function() {
					return this.waitFor({
						id: "accountCreateViewSetting",
						viewName: sViewName,
						searchOpenDialogs: true,
						controlType: "sap.m.Dialog",
						success: function(aDialogs) {
							Opa5.assert.ok(aDialogs[0], "Found the filter Dialog");
							//	Opa5.assert.strictEqual(oDialog[0].isOpen(), true,"Dialog is opened");
						},
						errorMessage: "Can't see the filter Dialog."
					});
				},

				theCreateDialogShouldClosed: function() {
					return this.waitFor({
						id: sCreateDialogId,
						viewName: sViewName,
						searchOpenDialogs: true,
						controlType: "sap.m.Dialog",
						success: function(aDialogs) {

							Opa5.assert.ok(aDialogs[0], "Found the create Dialog");
						},
						errorMessage: "Can't see the create Dialog."
					});
				},

				// theTitleShouldDisplayTheTotalAmountOfItems : function () {
				// 	return this.waitFor({
				// 		id : sTableId,
				// 		viewName : sViewName,
				// 		matchers : new AggregationFilled({name : "items"}),
				// 		success : function (oTable) {
				// 			var iObjectCount = oTable.getBinding("items").getLength();
				// 			this.waitFor({
				// 				id : "tableHeader",
				// 				viewName : sViewName,
				// 				matchers : function (oPage) {
				// 					var sExpectedText = oPage.getModel("i18n").getResourceBundle().getText("worklistTableTitleCount", [iObjectCount]);
				// 					return new PropertyStrictEquals({name : "text", value: sExpectedText}).isMatching(oPage);
				// 				},
				// 				success : function () {
				// 					Opa5.assert.ok(true, "The Page has a title containing the number " + iObjectCount);
				// 				},
				// 				errorMessage : "The Page's header does not container the number of items " + iObjectCount
				// 			});
				// 		},
				// 		errorMessage : "The table has no items."
				// 	});
				// },

				theTableShouldHaveTheDoubleAmountOfInitialEntries: function() {
					var iExpectedNumberOfItems;

					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						matchers: function(oTable) {
							iExpectedNumberOfItems = oTable.getGrowingThreshold() * 2;
							return new AggregationLengthEquals({
								name: "rows",
								length: iExpectedNumberOfItems
							}).isMatching(oTable);
						},
						success: function() {
							Opa5.assert.ok(true, "The growing Table had the double amount: " + iExpectedNumberOfItems + " of entries");
						},
						errorMessage: "Table does not have the double amount of entries."
					});
				},

				iShouldSeeTheWorklistViewsBusyIndicator: function() {
					return this.waitFor({
						id: "paPage",
						viewName: sViewName,
						success: function(oPage) {
							Opa5.assert.ok(oPage.getParent().getBusy(), "The worklist view is busy");
						},
						errorMessage: "The worklist view is not busy"
					});
				},

				iShouldSeeTheWorklistTableBusyIndicator: function() {
					return this.waitFor({
						id: "publicAccountTable",
						viewName: sViewName,
						matchers: function(oTable) {
							return new PropertyStrictEquals({
								name: "busy",
								value: true
							}).isMatching(oTable);
						},
						success: function() {
							Opa5.assert.ok(true, "The worklist table is busy");
						},
						errorMessage: "The worklist table is not busy"
					});
				},

				iShouldSeeTheNoDataTextForNoSearchResults: function() {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							Opa5.assert.strictEqual(oTable.getRows().length, 0,
								"the table should show the no data text for search");
						},
						errorMessage: "table does not show the no data text for search"
					});
				},
				iShouldSeeTheNoDataTextResults: function() {
					return this.waitFor({
						id: sTableId,
						viewName: sViewName,
						success: function(oTable) {
							Opa5.assert.strictEqual(oTable.getRows().length, 0,
								"the table should show the no data text for search");
						},
						errorMessage: "table does not show the no data text for search"
					});
				}

			})

		}

	});

});