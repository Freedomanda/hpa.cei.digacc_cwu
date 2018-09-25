sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hpa/cei/digital_account/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment",
	"hpa/cei/digital_account/util/AppNavigator",
	"sap/m/TablePersoController"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter, Fragment, AppNavigator, TablePersoController) {
	"use strict";

	var ContactList = function() {
		var oController = null;
		var oContactTable;
		//		var sPubaccKey = "";
		var sMktAreaKey = "";
		//	var sMktAreaText = "";
		var oResourceBundle;
		var oViewModel = new JSONModel({
			busy: true,
			tableBusyDelay: 0,
			tableNoDataText: "",
			canCreateTG: true,
			createTGEnabled: false

		});
		var oTablePersoController;

		/**
		 * Called when the contactlist controller is instantiated.
		 * @public
		 */
		this.onInit = function() {
			oController = this;
			//oController.getOwnerComponent().getModel().setRefreshAfterChange(false);
			oController.getOwnerComponent().getRouter("object")
				.attachRouteMatched(this._onObjectMatched);
			oContactTable = this.byId("contactTable");
			oResourceBundle = this.getResourceBundle();
			this.setModel(oViewModel, "contactListView");
			var oPersId = {
				container: "Contact",
				item: "Contactlist"
			};

			// Get a personalization service provider from the shell
			var oProvider = sap.ushell.Container.getService("Personalization").getPersonalizer(oPersId);

			// Instantiate a controller connecting your table and the persistence service
			oTablePersoController = new TablePersoController({
				table: oContactTable,
				persoService: oProvider
			}).activate();

			this._oAppNavigator = new hpa.cei.digital_account.util.AppNavigator(this);

		};
		
		

		/**
		 * Called when the contactlist controller is destroyed.
		 * @public
		 */

		this.onExit = function() {
			this.removeCreateTGDialog();
			if (this._oFilterDialog) {
				this.getView().removeDependent(
					this._oFilterDialog);
				this._oFilterDialog.destroy();
				this._oFilterDialog = null;
			}
		};
		

		/**
		 * Event handler  for select the contact.
		 * decide whether there are at least one contact is selected.
		 * @param {sap.ui.base.Event} oEvent contact table.
		 * @public
		 */

		this.onSelectContact = function(oEvent) {
			var iSelectedItemsCount = oContactTable.getSelectedContexts(true).length;
			if (iSelectedItemsCount === 0) {
				oViewModel.setProperty("/createTGEnabled", false);
			} else {
				oViewModel.setProperty("/createTGEnabled", true);
			}
		};
		
		this.setResouceBundle = function(){
			oResourceBundle = this.getResourceBundle();
		};
		

		/**
		 * function to set marketingarea key.
		 * when the object is initalized it will be called to set the marketing area key from the digitalaccount list.
		 * @param {String} sMktKey marketing area key from the selected digital account.
		 * @public
		 */
		this.setMktAreaKey = function(sMktKey) {
			sMktAreaKey = sMktKey;
		};

		/**
		 * after initalize the controller match the digital account key.
		 * @function
		 * @param {sap.ui.base.Event} oEvent route of the app.
		 * @private
		 */
		this._onObjectMatched = function(oEvent) {
			// var sObjectId = oEvent.getParameter("arguments").objectId;
			// //var sStatusCode = oEvent.getParameter("arguments").statusCode;

			// if (sObjectId !== undefined) {

			// 	oController.byId("searchField").setValue("");
			// 	oController._oKeywordFilter = null;
			// 	oController._aSettingFilters = null;

			// 	oContactTable.removeSelections(true);
			// 	oViewModel.setProperty("/createTGEnabled", false);
			// 	oController.applyFilter();

			// }

		};

		this.fnGetData = function(sObjectId) {
			if (sObjectId !== undefined) {

				oController.byId("searchField").setValue("");
				oController._oKeywordFilter = null;
				oController._aSettingFilters = null;

				oContactTable.removeSelections(true);
				oViewModel.setProperty("/createTGEnabled", false);
				oController.applyFilter();

			}

		};
		/**
		 * Event handler  for refresh data.
		 * 
		 * @public
		 */
		this.onRefresh = function() {
			oContactTable.getBinding("items").refresh();
		};

		/**
		 * Event handler  for press the target group create button.
		 * the create target group dialog will be shown.
		 * @public
		 */

		this.onCreateTGPress = function() {
			this.removeCreateTGDialog();
			this._oCreateTGDialog = sap.ui
				.xmlfragment("targetGroupCreate_frag",
					"hpa.cei.digital_account.view.fragments.CreateTG",
					this);
			this.getView().addDependent(
				this._oCreateTGDialog);
			jQuery.sap.syncStyleClass(
				"sapUiSizeCompact", this
				.getView(),
				this._oCreateTGDialog);
			//	Fragment.byId("idTargetGroupTypeText").setText("Target Group");
			Fragment.byId("targetGroupCreate_frag", "targetGroupMktAreaSelect").setSelectedKey(sMktAreaKey);
			this._oCreateTGDialog.open();

		};

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 *
		 * @private
		 */

		this.applyFilter = function() {
			//var oViewModel = this.getModel("ContactlistView");
			var aFilters = [];

			if (this._oKeywordFilter && this._oKeywordFilter !== null) {
				aFilters.push(this._oKeywordFilter);
			}
			if (this._aSettingFilters && this._aSettingFilters !== null) {
				for (var i = 0; i < this._aSettingFilters.length; i++) {
					aFilters.push(this._aSettingFilters[i]);

				}
			}

			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				var oTableFilter = new sap.ui.model.Filter({
					filters: aFilters,
					and: true
				});
				oContactTable.getBinding("items").filter(oTableFilter, "Application");
				oViewModel.setProperty("/tableNoDataText", oResourceBundle.getText("worklistNoDataWithSearchText"));
			} else {
				oContactTable.getBinding("items").filter([], "Application");
			}
		};

		/**
		 * Event handler when search is triggered.
		 * @param {sap.ui.base.Event} oEvent the searchfield  event
		 * @public
		 */
		this.onSearch = function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					this._oKeywordFilter = new Filter("ContactName", FilterOperator.EQ, sQuery);
				} else {
					this._oKeywordFilter = null;
				}
				this.applyFilter();
			}
		};

		/**
		 * Event handler when the table filter/sort button is pressed.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		this.onFilterSort = function(oEvent) {
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.ContactListFilterSort", this);
				this.getView().addDependent(
					this._oFilterDialog);
				// Set initial and reset value for Slider in custom control

			}

			//		this._oDialog.setModel(this.getView().getModel());
			// toggle compact style
			//		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oFilterDialog.open();
			if (this._aSettingFilters) {

				var aFilterItems = this._oFilterDialog.getFilterItems();
				for (var i = 0; i < aFilterItems.length; i++) {
					var sKey = aFilterItems[i].getKey();
					for (var j = 0; j < this._aSettingFilters.length; j++) {
						var sFilterValue = this._aSettingFilters[j].oValue1;
						var sFilterKey = this._aSettingFilters[j].sPath;
						if (sKey === sFilterKey) {
							aFilterItems[i].getCustomControl().setValue(sFilterValue);
						}

					}
				}
			}

		};

		/**
		 * Event handler when the confirm of the filtersort dialog button is pressed.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		this.onFilterSortConfirm = function(oEvent) {
			var aFilterItems = this._oFilterDialog.getFilterItems();
			this._aSettingFilters = [];
			for (var i = 0; i < aFilterItems.length; i++) {
				var sKey = aFilterItems[i].getKey();
				var sValue = aFilterItems[i].getCustomControl().getValue();
				if (sValue !== "") {

					var oFilter = new Filter(sKey, FilterOperator.EQ, sValue);
					this._aSettingFilters.push(oFilter);
				}

			}
			this.applyFilter();

			var aSorters = [];
			var sPath = oEvent.getParameters().sortItem.getKey();
			var bDescending = oEvent.getParameters().sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oContactTable.getBinding("items").sort(aSorters);
		};

		/**
		 * Event handler when the table personalize button is pressed.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		this.onPersonalize = function() {
			oTablePersoController.openDialog();
		};

		/**
		 * destroy the create targetgroup dialog
		 * 
		 * @private
		 */

		this.removeCreateTGDialog = function() {
			if (this._oCreateTGDialog) {
				this.getView().removeDependent(
					this._oCreateTGDialog);
				this._oCreateTGDialog.destroy();
				this._oCreateTGDialog = null;
			}
		};

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		this.onUpdateFinished = function() {
			oContactTable.setBusy(false);
		};

		/**
		 * Event handler when the cancel button of target group creation is pressed.
		 *
		 * @public
		 */
		this.onCancelTargetGroup = function() {
			this._oCreateTGDialog.close();
		};

		this.onNavigationObtained = function(oEvent) {
			var oParameters = oEvent.getParameters();
		//	var fnOpenContact = this.onOpenContact;
			oContactTable.setBusy(true);
			var sKey = oEvent.getSource().getInnerControl().getCustomData()[0].getKey();
			var sSmartLinkPath = "/SubscriberSmartLinkSet('" + sKey + "')";
			var oLink = oEvent.getSource();
			var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

			oController.getOwnerComponent().getModel().read(sSmartLinkPath, {
				success: function(oResult) {
					oContactTable.setBusy(false);
					if (oResult !== null) {
						
						var oLinkContent = new sap.ui.layout.form.SimpleForm({
							maxContainerCols: 1,
							content:this.fnGenerateSmartLink(oResult)
						});
				//	var oLinkContent = this.fnGenerateSmartLink(oResult);

						if (oCrossAppNavigator) {

							oCrossAppNavigator.isNavigationSupported([{
									target: {
										semanticObject: "MarketingContact",
										action: "displayFactSheet"
									},
									params: {
										"id": [sKey],
										"icrelcode": "0"
									}
								}])
								.done(function(aResponses) {
									if (aResponses[0].supported === true) {
										oParameters.show(oLink.getText(), new sap.ui.comp.navpopover.LinkData({
											key: "MarketingContact",
											target: "_blank"
												//  press : fnOpenContact
										}), [
											new sap.ui.comp.navpopover.LinkData({
												key: "MarketingContactLink",
												href: "#MarketingContact-displayFactSheet?InteractionContactUUID=" + oLink.getInnerControl().getCustomData()[0].getKey(),
												text: oResourceBundle.getText("openContactLinkText"),
												target: "_blank"
											//	press: fnOpenContact
											})
										], oLinkContent);

									} else {
										oParameters.show(oLink.getText(), new sap.ui.comp.navpopover.LinkData({
											key: "MarketingContact",
											target: "_blank"
												//  press : fnOpenContact
										}), null, oLinkContent);

									}
									/* eslint-enable sap-cross-application-navigation */
								}.bind(this))
								.fail(function() {
									oParameters.show(oLink.getText(), new sap.ui.comp.navpopover.LinkData({
										key: "MarketingContact",
										target: "_blank"
											//  press : fnOpenContact
									}), null, oLinkContent);
									//	sap.m.MessageBox.error("not supported");
									//error handling
								});

						}

					}

				}.bind(this),
				error: function(oError) {
					oContactTable.setBusy(false);

					oParameters.show(oLink.getText(), new sap.ui.comp.navpopover.LinkData({
						key: "MarketingContact",
						target: "_blank"
							//  press : fnOpenContact
					}), [
						new sap.ui.comp.navpopover.LinkData({
							key: "MarketingContactLink",
							href: "#MarketingContact-displayFactSheet?InteractionContactUUID=" + oLink.getInnerControl().getCustomData()[0].getKey(),
							text: oResourceBundle.getText("openContactLinkText"),
							target: "_blank"
					//		press: fnOpenContact
						})
					], null);

				}

			});

		};

		/**
		 * Event handler when the contact link is clicked.
		 * app will jump to the contact page
		 * @param {sap.ui.base.Event} oEvent contact link
		 * @public
		 */

		// this.onOpenContact = function(oEvent) {
		// 	var oContactItem = oEvent.getSource();
		// 	var sContactKey = oContactItem.getCustomData()[0].getKey();
		// 	// 			var oNavigationHandler = new sap.ui.generic.app.navigation.service.NavigationHandler(oController);
		// 	// 			var sSemanticObject = "InteractionContact";
		// 	// var sActionName = "showDetail";

		// 	// //simple parameters as Object
		// 	// var vNavigationParameters = {
		// 	// 	"id": [sContactKey],
		// 	// 						"sap-hpa-targetobject": ["ICONTACT_TI"]
		// 	// };
		// 	// oNavigationHandler.navigate(sSemanticObject, sActionName, vNavigationParameters, null, null);

		// 	this._oAppNavigator.navigateToContactDetail(sContactKey);

		// };

		/**
		 * Event handler when the target group input is changed.
		 * check whether is null.
		 * @param {sap.ui.base.Event} oEvent the target group input.
		 * @public
		 */

		this.onTargetGroupNameChanged = function(oEvent) {
			// if (oEvent.getSource().getValue() === "") {
			// 	oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			// 	this._oCreateTGDialog.getButtons()[0].setEnabled(false);
			// 	this._oCreateTGDialog.getButtons()[1].setEnabled(false);

			// } else {
			//			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			this._oCreateTGDialog.getButtons()[0].setEnabled(true);
			this._oCreateTGDialog.getButtons()[1].setEnabled(true);
			//	}
		};
		
		this.fnGenerateSmartLink = function(oContactResult){
			var bHasImageUrl = false;
						var bHasInt = true;
						var sContactImageURL = oContactResult.ContactImageURL;
						if (sContactImageURL !== undefined && sContactImageURL !== "") {
							bHasImageUrl = true;
						}
						if (oContactResult.LastInteractionType !== undefined && oContactResult.LastInteractionType === "") {
							bHasInt = false;
						}
						var oImage = new sap.ui.core.Icon({
							src: "sap-icon://person-placeholder",
							size: "4rem"

						});
						if (bHasImageUrl) {
							oImage = new sap.m.Image({
								src: sContactImageURL,
								width: "4rem",
								height: "4rem"

							});
						}

						var aLinkContent = [new sap.ui.core.Title({
									text: oResourceBundle.getText("personalDataTitle")
								}),

								new sap.m.HBox({
									items: [oImage]
								}), new sap.m.Label({
									text: oResourceBundle.getText("contactGender")
								}), new sap.m.Text({
									text: oContactResult.ContactGender
								}), new sap.m.Label({
									text: oResourceBundle.getText("contactBusRelation")
								}), new sap.m.Text({
									text: oContactResult.BusinessRelationship
								}), new sap.m.Label({
									text: oResourceBundle.getText("contactLevel")
								}), new sap.m.Text({
									text: oContactResult.ContactLevel
								}), new sap.m.Label({
									text: oResourceBundle.getText("contactLastInt")
								}), new sap.m.VBox({
									items: [new sap.m.Text({
										text: oContactResult.LastInteractionType,
										visible: bHasInt
									}), new sap.m.Text({
										visible: bHasInt,
										text: formatter.formatDate(oContactResult.LastInteractionTimestamp)
									}), new sap.m.Text({
										text: "-",
										visible: !bHasInt
									})]
								})

							]
						;
						return aLinkContent;
			
		};

		/**
		 * Event handler when the target group dialog's confirm button is pressed.
		 * will create the target group with the selected contact.
		 * if the button is open and save, will navigate to the target group page.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		this.onCreateTargetGroup = function(oEvent) {
			var bNavigate = false;
			if (oEvent.getSource().getId().indexOf("targetGroupOkAndOpenButton") !== -1) {
				bNavigate = true;
			}
			var fnSuccess = function(oData, response) {
				this._oCreateTGDialog.close();
				var sTgidWithZeros = oData.Id;
				//	var sTgid = sTgidWithZeros.replace(/^[0]+/g, "");
				//	var fnNavigate = null;
				if (bNavigate) {

					this._oAppNavigator.navigateToTargetGroup(sTgidWithZeros);

					// var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
					// //var sTgID = ;
					// var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
					// if (oCrossAppNavigator) {
					// 	// oCrossAppNavigator.toExternal({
					// 	// 	target: {
					// 	// 		semanticObject: "TargetGroup",
					// 	// 		action: "showDetail"
					// 	// 	},
					// 	// 	params: {
					// 	// 		"id": [sTgidWithZeros],
					// 	// 		"sap-hpa-targetobject": ["TARGETGROUP_TI"]
					// 	// 	}
					// 	// });

					// 	oCrossAppNavigator.isNavigationSupported([{
					// 			target: {
					// 				semanticObject: "TargetGroup",
					// 				action: "maintain"
					// 			},
					// 			params: {
					// 				"id": [sTgidWithZeros],
					// 				"sap-hpa-targetobject": ["TARGETGROUP_TI"]
					// 			}
					// 		}])
					// 		.done(function(aResponses1) {
					// 			if (aResponses1[0].supported === true) {

					// 				/* eslint-disable sap-cross-application-navigation */
					// 				var sHash = oCrossAppNavigator.hrefForExternal({
					// 					target: {
					// 						semanticObject: "TargetGroup",
					// 						action: "maintain"
					// 					},
					// 					params: {
					// 						"id": [sTgidWithZeros],
					// 						"sap-hpa-targetobject": ["TARGETGROUP_TI"]
					// 					}
					// 				});
					// 				var url = window.location.href.split('#')[0] + sHash;

					// 				sap.m.URLHelper.redirect(url, true);
					// 			} else {
					// 				sap.m.MessageBox.error(oResourceBundle.getText("navtoTargetGroupNotSupportedError"));

					// 			}

					// 		})
					// 		.fail(function() {
					// 			sap.m.MessageBox.error(oResourceBundle.getText("navtoTargetGroupNotSupportedError"));

					// 			//error handling
					// 		});

					// 	/* eslint-enable sap-cross-application-navigation */
					// 	// oCrossAppNavigator.toExternal({
					// 	// 	target: {
					// 	// 		semanticObject: "TargetGroup",
					// 	// 		action: "showDetail"
					// 	// 	},
					// 	// 	params: {
					// 	// 		"id": [sTgidWithZeros],
					// 	// 		"sap-hpa-targetobject": ["TARGETGROUP_TI"]
					// 	// 	}
					// 	// });
					// }

				}

			};
			var fnError = function(oError) {
				this._oCreateTGDialog.close();

				// this._oMessageHandler.handleError(oError, {
				// 	sMessageKey: "TargetGroupCouldNotBeCreated",
				// 	aMessageParameters: []
				// });
			};
			var sName = Fragment.byId("targetGroupCreate_frag", "targetGroupNameInput").getValue();
			var sMarketingArea = sMktAreaKey;
			var sDescription = Fragment.byId("targetGroupCreate_frag", "targetGroupDescription").getValue();

			var aSelectedContactItems = oContactTable.getSelectedContexts(true);

			var aTargetGroupContacts = [];

			if (sName !== null && sName !== "") {

				Fragment.byId("targetGroupCreate_frag", "targetGroupNameInput").setValueState(sap.ui.core.ValueState.None);

				for (var i = 0; i < aSelectedContactItems.length; i++) {
					var oTargetGroupContact = {

						MemberKey: aSelectedContactItems[i].getProperty("Key")

					};
					aTargetGroupContacts.push(oTargetGroupContact);
				}

				var oNewTargetGroup = {
					TargetGroupName: sName,
					MktAreaId: sMarketingArea,
					TargetGroupMembers: aTargetGroupContacts,
					Description: sDescription,
					Origin: "11",
					MemberType: "03"
				};

				/*var sXAggregationType, sYAggregationType;
				for (var i = 0 ; i < this.aKeyFigures.length ; i++) {
					if (this.aKeyFigures[i].ColumnName === this.oCreateDialog.oRange[0].keyFigure) {
						sXAggregationType = this.aKeyFigures[i].ColumnType;
					}
					if (this.aKeyFigures[i].ColumnName === this.oCreateDialog.oRange[1].keyFigure) {
						sYAggregationType = this.aKeyFigures[i].ColumnType;
					}
				}*/
				oController.getOwnerComponent().getModel().create("/TargetGroups", oNewTargetGroup, {
					success: jQuery.proxy(fnSuccess, this),
					error: jQuery.proxy(fnError, this)
				});
			} else {
				Fragment.byId("targetGroupCreate_frag", "targetGroupNameInput").setValueState(sap.ui.core.ValueState.Error);

			}
		};

	};

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @ContactOf hpa.cei.digital_account.view.ContactList
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @ContactOf hpa.cei.digital_account.view.ContactList
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @ContactOf hpa.cei.digital_account.view.ContactList
	 */
	//	onExit: function() {
	//
	//	}
	return BaseController.extend("hpa.cei.digital_account.controller.ContactList", new ContactList());

});