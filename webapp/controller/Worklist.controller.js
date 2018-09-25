sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hpa/cei/digital_account/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"hpa/cei/digital_account/manager/AccountManager",
	"hpa/cei/digital_account/util/Const"
], function(BaseController, JSONModel, formatter, Filter, Sorter, FilterOperator, Fragment, AccountManager, Const) {
	"use strict";

	return BaseController.extend("hpa.cei.digital_account.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("publicAccountTable");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTable = oTable;
			// keeps the search state
			this._oTableSearchState = [];
			this._oResourceBundle = this.getResourceBundle();
			this._oOwnerFilterForTab = [];

			this.oAuthorization = {
				Display: false,
				Change: false,
				Create: false
			};
			this.aApplicationFilter = [];
			this.bIsFiredBySmartEvent = false;
			this.bHasOuterFilter = false;

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this._oResourceBundle.getText("worklistTableTitle"),
				tableNoDataText: this._oResourceBundle.getText("tableNoDataText"),
				tableBusyDelay: 0,
				canCreate: false

			});
			this.setModel(oViewModel, "worklistView");
			this._refreshIconCounts(false);

			this._getAuthorization();
			//	this._getAccountTypeMedium();

			//		this.getRouter().getRoute("worklist").attachPatternMatched(this._onWorklistMatched, this);

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);

			});
		},

		/**
		 * Called when the worklist controller is destroyed.
		 * @public
		 */
		onExit: function() {
			this._removeCreateDialog();
		
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the table personlize button is pressed.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		// onPersonalize: function(oEvent) {
		// 	this.oTablePersoController.openDialog();
		// },

		/**
		 * Event handler when the table filter/sort button is pressed.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		// onFilter: function(oEvent) {
		// 	if (!this._oFilterDialog) {
		// 		this._oFilterDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.AccountListFilterSort", this);
		// 		this.getView().addDependent(
		// 			this._oFilterDialog);

		// 	}

		// 	this._oFilterDialog.open();

		// },

		/**
		 * Event handler when the filterdialog's ok button  is pressed.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */
		// onFilterConfirm: function(oEvent) {
		// 	var aFilterItems = this._oFilterDialog.getFilterItems();
		// 	this._aSettingFilters = [];
		// 	for (var i = 0; i < aFilterItems.length - 1; i++) {
		// 		var sKey = aFilterItems[i].getKey();
		// 		var sValue = aFilterItems[i].getCustomControl().getValue();
		// 		if (sValue !== "") {

		// 			var oFilter = new Filter(sKey, FilterOperator.EQ, sValue);
		// 			this._aSettingFilters.push(oFilter);
		// 		}

		// 	}

		// 	var aStatusFilterItems = oEvent.getParameters().filterItems;
		// 	if (aStatusFilterItems.length > 0) {
		// 		var aStatusFilters = [];

		// 		//	var aStatus = [];
		// 		for (var j = 0; j < aStatusFilterItems.length; j++) {
		// 			var oStatusFilter = new Filter("StatusCode", FilterOperator.EQ, aStatusFilterItems[j].getKey());

		// 			aStatusFilters.push(oStatusFilter);

		// 		}
		// 		var oStatusInallFilter = new Filter({
		// 			filters: aStatusFilters,
		// 			and: false
		// 		});
		// 		this._aSettingFilters.push(oStatusInallFilter);

		// 	}

		// 	this._applyFilter();

		// 	var aSorters = [];
		// 	var sPath = oEvent.getParameters().sortItem.getKey();
		// 	var bDescending = oEvent.getParameters().sortDescending;
		// 	aSorters.push(new Sorter(sPath, bDescending));
		// 	this._oTable.getBinding("rows").sort(aSorters);
		// },

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			// var sTitle,
			// 	oTable = oEvent.getSource(),
			// 	iTotalItems = oEvent.getParameter("total");
			// if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
			// 	sTitle = this._oResourceBundle.getText("worklistTableTitleCount", [iTotalItems]);
			// }
			// // else {
			// // 	sTitle = this._oResourceBundle.getText("worklistTableTitle");
			// // }
			// this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		//	this._refreshIconCounts();
			this.getView().setBusy(false);

			this.bIsFiredBySmartEvent = true;

		},

		onDataReceived: function(oEvent) {
			if (this._oTable.getBinding("rows") && this.bIsFiredBySmartEvent === true) {

				this.aApplicationFilter = this._oTable.getBinding("rows").aApplicationFilters;
				if (this.bHasOuterFilter === true) {
					this._applyFilter();
				}

				this.bIsFiredBySmartEvent = false;
			}
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Navigates back in the browser history, if the entry was created by this app.
		 * If not, it navigates to the Fiori Launchpad home page.
		 * @public
		 */
		onNavBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		/**
		 * Event handler when search is triggered.
		 * @param {sap.ui.base.Event} oEvent the searchfield  event
		 * @public
		 */

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {

					this._oKeywordFilter = new Filter("SearchTerm", FilterOperator.EQ, sQuery);

				} else {
					this._oKeywordFilter = null;
				}
				this._applyFilter();
			}

		},

		/**
		 * Event handler when user select a icontab filter to filter type.
		 * @param {sap.ui.base.Event} oEvent the type icontab filter select event
		 * @public
		 */

		onIconTabFilterSelected: function(oEvent) {
			var sFilterKey = oEvent.getParameter("key");
			//	var oTableFilterState = [];

			if (sFilterKey === "ALL") {
				this._oTypeFilter = null;
			} else {
				this._oTypeFilter = new Filter("CommunicationMedium", FilterOperator.EQ, sFilterKey);
			}
			this._applyFilter();
		},

		/**
		 * Event handler when user select a owner filter to filter owner.
		 * @param {sap.ui.base.Event} oEvent the owner  filter select event
		 * @public
		 */

		onMyAllFilterSelect: function(oEvent) {
			var sFilterKey = oEvent.getParameter("key");
			var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser");
			var sCurrentUserId = fnGetUser().getId();
			//	var oTableFilterState = [];

			if (sFilterKey === "MyPas") {
				this._oOwnerFilter = new Filter("CreatedByUserId", FilterOperator.EQ, sCurrentUserId);
				this._oOwnerFilterForTab = [new Filter("CREA_UNAME", FilterOperator.EQ, sCurrentUserId)];
			} else {
				this._oOwnerFilter = null;
				this._oOwnerFilterForTab = [];
			}
			this._applyFilter();
			this._refreshIconCounts(true);
		},

		/**
		 * Event handler when the create button is pressed.
		 * @param {sap.ui.base.Event} oEvent the create account button event
		 * @public
		 */
		onCreatePAPress: function() {
			//this._removeCreateDialog();
			var oSystemView = new JSONModel({
				isCloud: this.getOwnerComponent().getModel("system").getData().isCloud,
				isOnPremise: !this.getOwnerComponent().getModel("system").getData().isCloud

			});
			if (!this._oCreateDialog) {

				this._oCreateDialog = sap.ui
					.xmlfragment("accountCreate_frag",
						"hpa.cei.digital_account.view.fragments.AccountCreate",
						this);
				this._oCreateDialog.setModel(oSystemView, "systemView");
				this.getView().addDependent(
					this._oCreateDialog);
				jQuery.sap.syncStyleClass(
					"sapUiSizeCompact", this
					.getView(),
					this._oCreateDialog);
			}
			this._oCreateDialog.open();
			if (!this.oAccountManager) {

				this.oAccountManager = new hpa.cei.digital_account.manager.AccountManager(this, "");
			}
			//this.oAccountManager.addCreateAccountFragment();                         
		},

		onCreateAccountNavigationStarted: function() {
			Fragment.byId("accountCreate_frag", "navCon").setBusy(true);
		},

		onCreateAccountAfterNavigate: function(oEvent) {
			Fragment.byId("accountCreate_frag", "navCon").setBusy(false);

		},

		onNavToDetail: function(oEvent) {
			Fragment.byId("accountCreate_frag", "navCon").to(Fragment.byId("accountCreate_frag", "detail"));
			var sCommMedia = oEvent.getSource().getBindingContext().getProperty().CommMedium;
			var sCommMediaName = oEvent.getSource().getBindingContext().getProperty().CommMediumDesc;
			var oCommMediaFilter = new Filter("CommMedium", FilterOperator.EQ, sCommMedia);
			Fragment.byId("accountCreate_frag", "accountCreateTypeSelect").getBinding("items").filter(oCommMediaFilter);

			Fragment.byId("accountCreate_frag", "detail").setTitle(sCommMediaName);

			if (this.oAccountManager) {
				this.oAccountManager.changeAccountCommMedia(sCommMedia);
				this.oAccountManager.addCreateAccountFragment();
			}
			Fragment.byId("accountCreate_frag", "accountCreateNameInput").setValueState(sap.ui.core.ValueState.None);
			Fragment.byId("accountCreate_frag", "accountCreateCodeInput").setValueState(sap.ui.core.ValueState.None);
			Fragment.byId("accountCreate_frag", "accountCreateNameInput").setValue("");
			Fragment.byId("accountCreate_frag", "accountCreateCodeInput").setValue("");
			Fragment.byId("accountCreate_frag", "accountCreateOkButton").setVisible(true);

		},
		onNavToMaster: function(oEvent) {
			Fragment.byId("accountCreate_frag", "navCon").back();
			Fragment.byId("accountCreate_frag", "accountCreateOkButton").setVisible(false);
		},

		getCommMediaDesc: function(sCommId) {
			if (sCommId === "WEC") {
				return this._oResourceBundle.getText("wechatAccountDescText");
			} else if (sCommId === "LINE") {

				return this._oResourceBundle.getText("lineAccountDescText");
			}

		},

		/**
		 * Event handler when the create dialog's ok button is pressed.
		 * @param {sap.ui.base.Event} oEvent the create dialog ok button event
		 * @public
		 */

		onCreateOkButton: function() {
				this._oCreateDialog.setBusy(true);
			//	var oCreateContent = this._oCreateDialog.getContent()[0];
			var sAccountNameValue = Fragment.byId("accountCreate_frag", "accountCreateNameInput").getValue();
			var sAccountCodeValue = Fragment.byId("accountCreate_frag", "accountCreateCodeInput").getValue();
			var sAccountTypeKey = Fragment.byId("accountCreate_frag", "accountCreateTypeSelect").getSelectedKey();
			//	var sAccountTypeDesc = oCreateContent.getContent()[5].getSelectedItem().getText();
			var sAccountMarketingAreaKey = Fragment.byId("accountCreate_frag", "accountCreateMarketingAreaSelect").getSelectedKey();
			//	var sAccountMarketingAreaText = oCreateContent.getContent()[7].getSelectedItem().getText();
			// var sAccountIdValue = Fragment.byId("accountCreate_frag", "accountCreateIdInput").getValue();
			// var sHkTokenValue = Fragment.byId("accountCreate_frag", "accountCreateHSTokenInput").getValue();
			// var sAccountAppIdValue = Fragment.byId("accountCreate_frag", "accountCreateAppIdInput").getValue();
			// var sAccountSecIdValue = Fragment.byId("accountCreate_frag", "accountCreateSecIdInput").getValue();
			// //	
			// var sAppIdErrorText = this._oResourceBundle.getText("createValidationAppidError");
			// var sSecIdErrorText = this._oResourceBundle.getText("createValidationSecidError");
			var sAccountIdErrorText = this._oResourceBundle.getText("createValidationAccidError");

			var fnValidateManValue = function(oContent, sStateText, bIsInput) {
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

			};

			var bAccountNameNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateNameInput"), this._oResourceBundle.getText(
				"accountNamePlaceholder"), true);
			var bAccountCodeNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateCodeInput"), this._oResourceBundle.getText(
				"accountCodePlaceholder"), true);
			// var bAccountIdNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateIdInput"), this._oResourceBundle.getText(
			// 	"accountIdPlaceholder"), true);
			// var bHkTokenNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateHSTokenInput"), this._oResourceBundle.getText(
			// 	"accountHSTokenPlaceholder"), true);
			// var bAccountAppIdNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateAppIdInput"), this._oResourceBundle
			// 	.getText(
			// 		"accountAppIdPlaceholder"), true);
			// var bAccountSecIdNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateSecIdInput"), this._oResourceBundle
			// 	.getText(
			// 		"accountSecIdPlaceholder"), true);
			var bAccountTypeNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateTypeSelect"), this._oResourceBundle.getText(
				"accountTypeNotNullText"), false);
			var bAccountMarketingAreaNotNull = fnValidateManValue(Fragment.byId("accountCreate_frag", "accountCreateMarketingAreaSelect"), this
				._oResourceBundle.getText(
					"accountMarketingAreaNotNullText"), false);
			// var bAccountCommAreaNotNull = fnValidateManValue(Fragment.byId("accountCreateCommArrangeSelect"), this._oResourceBundle.getText(
			// "accountCommArrangeNotNullText"),false);

			//

			//var bIsCloud = this.getOwnerComponent().getModel("system").getData().isCloud;

			if (!this.oAccountManager) {

				this.oAccountManager = new hpa.cei.digital_account.manager.AccountManager(this, "WEC_SERACC");
			}

			var bValidateAccountValue = this.oAccountManager.validateValue();
			if (!bAccountNameNotNull || !bAccountCodeNotNull || !bAccountTypeNotNull || !bAccountMarketingAreaNotNull || !bValidateAccountValue) {
				this._oCreateDialog.setBusy(false);
			} else {

				var oNewAccount = {
					DigaccId: sAccountCodeValue,
					DigaccName: sAccountNameValue,
					Type: sAccountTypeKey,
					//	DaTypeDesc:sAccountTypeDesc,

					StatusCode: "2",
					MarketingAreaId: sAccountMarketingAreaKey
						//	MarketingAreaText: sAccountMarketingAreaText

				};
				oNewAccount = this.oAccountManager.updateModel(oNewAccount);

				this.getView().getModel().create("/DigitalAccounts", oNewAccount, {
					success: jQuery
						.proxy(
							this._createSuccess,
							this),
					error: jQuery
						.proxy(
							function(oError) {
								this._oCreateDialog.setBusy(false);
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
									//var aAttributeName = aAttributes

									if (oErrorMsg.error.code === Const.errorMsgConst.keyCheckError) {
										Fragment.byId("accountCreate_frag", "accountCreateCodeInput").setValueState(sap.ui.core.ValueState.Error);
										Fragment.byId("accountCreate_frag", "accountCreateCodeInput").setValueStateText(sAccountIdErrorText);
									}
									// else 
									// if (oErrorMsg.error.code === Const.errorMsgConst.invalidAppError) {

									// 	Fragment.byId("accountCreate_frag", "accountCreateAppIdInput").setValueState(sap.ui.core.ValueState.Error);
									// 	Fragment.byId("accountCreate_frag", "accountCreateAppIdInput").setValueStateText(sAppIdErrorText);
									// 	Fragment.byId("accountCreate_frag", "accountCreateSecIdInput").setValueState(sap.ui.core.ValueState.Error);
									// 	Fragment.byId("accountCreate_frag", "accountCreateSecIdInput").setValueStateText(sSecIdErrorText);
									// }
									// else if (sErrorText.indexOf("wechat") !== -1) {
									// 	var sWechatError = sErrorText.substr(sErrorText.indexOf("wechat"), sErrorText.length - sErrorText.indexOf("wechat"));
									// 	sWechatError = sWechatError.substr(7, sWechatError.indexOf('"}') - 7);
									// 	sap.m.MessageBox.error(this._oResourceBundle.getText("creatationErrorFromWechat") + sWechatError);
									// } 
									//	else {
									else {

										this.oAccountManager.handleError(sErrorCode, sErrorMessage, true, aAttributes);
									}
									// this._oCreateDialog
									// 	.close();
									//	}
								} catch (e) {
									sap.m.MessageBox.error(sErrorText);
								}
								//	this.getView().setBusy(false);
								//	this.onRefresh();
								//sap.m.MessageBox.error("");
							},
							this)
				});
			}

		},

		/**
		 * Event handler when the create dialog cancel button is pressed.
		 * @public
		 */

		onCreateCancelButton: function() {

			this._oCreateDialog
				.close();
			this.onNavToMaster();
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oTable.getBinding("rows").refresh();
		//	this._refreshIconCounts();

		},

		/**
		 * Event handler when the create dialog input's content is changed.
		 * @param {sap.ui.base.Event} oEvent the input content event
		 * @public
		 */

		onAccountCreateChanged: function(oEvent) {

			this._oCreateDialog.getButtons()[0].setEnabled(true);
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);

		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			var sPath = oItem.getBindingContext().getPath();
			var sPubaccKey = sPath.substr(sPath.indexOf("('") + 2, sPath.indexOf("')") - sPath.indexOf("('") - 2);
			//		var sMktAreaKey = oItem.getBindingContext().getProperty("MarketingAreaId");
			// var sMktAreaText = oItem.getBindingContext().getProperty("MarketingAreaDescription");
			//		var sStatusCode = oItem.getBindingContext().getProperty("StatusCode");

			if (sPubaccKey) {

				this.getRouter().navTo("object", {
					objectId: sPubaccKey
						//		marketAreaKey: sMktAreaKey,

					//		statusCode: sStatusCode

				});
			}
		},

		_getAuthorization: function() {
			var oUrlParams = {
				"BOName": "'CUAN_DIGITAL_ACCOUNT'"

			};
			this.getOwnerComponent().getModel().read("/READBOAUTHORIZATION", {
				urlParameters: oUrlParams,
				success: function(oData, oResponse) {
					//Handle Success  
					if (oResponse.statusCode === "200" || oResponse.statusCode === 200) {

						this.oAuthorization.Change = oData.results[0].Change;
						this.oAuthorization.Display = oData.results[0].Display;
						this.oAuthorization.Create = oData.results[0].Create;
						this.getModel("worklistView").setProperty("/canCreate", (this.oAuthorization.Create || this.oAuthorization.Change));
						//	this._showOrHideEditPageSections(that._bInEditMode);

					}
				}.bind(this),
				error: function(oError) {
					//Handle Error  
				}
			});

		},

		// _getAccountTypeMedium:function(){

		// 		this.getOwnerComponent().getModel().read("/DigitalAccountTypes", {

		// 			success: function(oData, oResponse) {
		// 				//Handle Success  
		// 				if (oResponse.statusCode === "200" || oResponse.statusCode === 200) {

		// 				var aResults = oData.results;
		// 				for(var i=0;i<aResults.length;i++){
		// 					var oResult = aResults[i];
		// 					Const.typeCommMedium[oResult.TypeCode] = oResult.CommMedium;
		// 				}

		// 					//	this._showOrHideEditPageSections(that._bInEditMode);

		// 				}
		// 			},
		// 			error: function(oError) {

		// 				//this._setEditable(this.oAuthorization.Change);
		// 				//
		// 				//Handle Error  
		// 			}
		// 		});

		// 	},

		/**
		 * destroy the create dialog
		 * 
		 * @private
		 */

		_removeCreateDialog: function() {
			if (this._oCreateDialog) {
				this.getView().removeDependent(
					this._oCreateDialog);
				this._oCreateDialog.destroy();
				this._oCreateDialog = null;

			}
			if (this.oAccountManager) {

				this.oAccountManager.destroyManager();
				this.oAccountManager = null;
			}
		},

		/**
		 * create successful callback
		 * 
		 * @private
		 */
		_createSuccess: function() {
			this._oCreateDialog.setBusy(false);
			this.getView().setBusy(false);

			this._oCreateDialog.close();
			this.onNavToMaster();

			var sCreateMessage = this._oResourceBundle.getText("msg.createMessage");
			this._showMessageToast(sCreateMessage);
			this.onRefresh();
			this._refreshIconCounts(true);
		},

		/**
		 * refresh the icon counts
		 * 
		 * @private
		 */
		_refreshIconCounts: function(isOnlyCountRef) {

			//Maybe a better way?

			var oIconTabs = this.getView().byId("paListIconTabBar");
			oIconTabs.setBusy(true);
			var iLength = oIconTabs.getItems().length;
			if(!isOnlyCountRef){
				
			
			for (var i = 2; i < iLength; i++) {
				var oFilter = oIconTabs.getItems()[i];
				

				oIconTabs.removeItem(oIconTabs.getItems().length - 1);
				if(oFilter){
				oFilter.destroy();
				}
			}
			}

			this.getOwnerComponent().getModel().read("/IconTabFilters", {
				filters: this._oOwnerFilterForTab,
				success: jQuery.proxy(
					function(oData) {
						if (oData.results.length > 0) {
							var aTypeCountResults = oData.results;
							var iTotalCount = 0;
							

							for (var i = 0; i < aTypeCountResults.length; i++) {

								var iTypeCount = Number(aTypeCountResults[i].Count);
								var sCommMedium = aTypeCountResults[i].CommMedium;
								var sCommMediumDesc = aTypeCountResults[i].CommMediumDesc;
								iTotalCount = iTotalCount + iTypeCount;
								if(!isOnlyCountRef){
									
								
								var oIconFilter = new sap.m.IconTabFilter({
									key: sCommMedium,
									text: sCommMediumDesc,
									tooltip: sCommMediumDesc,
									count: iTypeCount,
									design: "Vertical"

								});
								oIconTabs.addItem(oIconFilter);
								}else{
									oIconTabs.getItems()[i+2].setCount(iTypeCount);
								}
								// if (sCommMedium === Const.accountCommMedium.wechat) {
								// 	this.byId("iconFilterWechat").setCount(iTypeCount);
								// }
								// } else if (sCommMedium === Const.accountCommMedium.line) {
								// 	this.byId("iconFilterLine").setCount(iTypeCount);
								// }
							}

							this.byId("iconTabFilterALL").setCount(iTotalCount);

						}
						oIconTabs.setBusy(false);

					},
					this),
				error: jQuery
					.proxy(
						function(
							oError) {
							oIconTabs.setBusy(false);

						},
						this)
			});
		},

		/**
		 * Show the message
		 * 
		 * @private
		 * @param {String} sMessage: Message text
		 */
		_showMessageToast: function(sMessage) {
			sap.ui.require(["sap/m/MessageToast"], function(MessageToast) {
				MessageToast.show(sMessage, {
					closeOnBrowserNavigation: false
				});
			});
		},

		//		_onWorklistMatched:function(oEvent){
		//	if(this.byId("publicAccountTable").getBinding("rows")){

		//		this.byId("publicAccountTable").getBinding("rows").refresh();
		//	}
		//		},

		_onNoImage: function(oErrorEvent) {
			//If no image is loaded, take the swap the icon controll for the Image control 
			oErrorEvent.getSource().getParent().getItems()[1].setVisible(true); // Make the Icon controll visible
			oErrorEvent.getSource().getParent().getItems()[0].setVisible(false); // Remove the Image control since there is no image
		},

		onImageError: function(oEvent) {
			oEvent.getSource().getParent().getItems()[1].setVisible(true);
			oEvent.getSource().setVisible(false);
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * 
		 * @private
		 */
		_applyFilter: function() {

			var oViewModel = this.getModel("worklistView");
			var aFilters = [];
			if (this._oTypeFilter && this._oTypeFilters !== null) {
				aFilters.push(this._oTypeFilter);
			}
			if (this._oOwnerFilter && this._oOwnerFilters !== null) {
				aFilters.push(this._oOwnerFilter);
			}
			if (this._oKeywordFilter && this._oKeywordFilter !== null) {
				aFilters.push(this._oKeywordFilter);
			}
			if (this._aSettingFilters && this._aSettingFilters !== null) {
				for (var i = 0; i < this._aSettingFilters.length; i++) {
					aFilters.push(this._aSettingFilters[i]);

				}
			}

			var oItems = this._oTable.getBinding("rows");
			if (this.aApplicationFilter) {
				var aAppFilters = this.aApplicationFilter;
				//	var aNewAppFilters = [];
				for (var j = 0; j < aAppFilters.length; j++) {

					if (aAppFilters[j].aFilters) {
						aFilters.push(aAppFilters[j].aFilters[0]);
					} else {
						aFilters.push(aAppFilters[j]);

					}
				}

			}

			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				this.bHasOuterFilter = true;

				var oTableFilter = new sap.ui.model.Filter({
					filters: aFilters,
					and: true
				});
				oItems.aApplicationFilters = [];
				this._oTable.getBinding("rows").filter(oTableFilter);
				oViewModel.setProperty("/tableNoDataText", this._oResourceBundle.getText("worklistNoDataWithSearchText"));
			} else {
				this.bHasOuterFilter = false;
				this._oTable.getBinding("rows").filter([]);
			}
		}

	});
});