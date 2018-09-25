/*global location*/
sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"hpa/cei/digital_account/model/formatter",
	"sap/m/MessageBox",
	"hpa/cei/digital_account/util/Const",
	"hpa/cei/digital_account/manager/AccountManager",
	"hpa/cei/digital_account/model/ExtModelHelper"
], function(BaseController, JSONModel, History, formatter, MessageBox, Const, AccountManager, ExtHelper) {
	"use strict";

	return BaseController.extend("hpa.cei.digital_account.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0,
					isChartView: false,
					isTableView: true,
					basicnormalmode: false,
					basiceditmode: false,
					crenormalmode: true,
					creeditmode: false,
					candelete: true,
					contactlist: false,
					canPrepare: false,
					canActive: false,
					canArchive: false,
					contactList: false,
					contactAnaly: false,
					interactionAnaly: false,
					shakeNearbyAnaly: false
						//	isCloud: this.getOwnerComponent().getModel("system").getData().isCloud,
						//	isOnPremise: !this.getOwnerComponent().getModel("system").getData().isCloud
				});

			//		var aExtFields = [];
			this.oAuthorization = {
				Display: false,
				Change: false,
				Create: false
			};

			this.sPubAccKey = "";
			this.sAccKey = "";
			this._oResourceBundle = this.getResourceBundle();
			this.sStatusCode = "";
			this.bIsEditMode = false;
			this.sProtectType = "nav";
			// var oCAModel = new JSONModel({
			// 	CAList: []

			// });

			// this.byId("commArrInput").setModel(oCAModel, "CAWithNoneModel");

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
				this.addCustomFieldsToBasicData();

			}.bind(this));
		},

		addCustomFieldsToBasicData: function(oThis) {
			var oView = this.getOwnerComponent();

			/*
			 * Steps
			 * 
			 * 1) Get all CollectionFacets from annotations: done 2) Create Sections from CollectionFacets: done 3) Add
			 * Sections to ObjectPage: done 4) Generate a default SmartForm to display on the basic data Section with unused
			 * Fields: to be done
			 * 
			 */

			var aCollectionFacets = ExtHelper.getCollectionFacetsFromAnnotations("DigitalAccount", oView.getModel());

			for (var i = 0; i < aCollectionFacets.length; i++) {
				var oCurrentCollectionFacet = aCollectionFacets[i];

				var oSmartForm =
					ExtHelper.generateSmartFormFromFilteredAnnotations("DigitalAccount", 2, oView, "idDaSmartForm" + i, oCurrentCollectionFacet);

				//	this.addLiveChangeToSmartFields(oSmartForm);

				var sSectionId = oCurrentCollectionFacet.ID.String.replace(/\s+/g, "_");
				ExtHelper.addSmartFormToNewSectionOnObjectPage(oSmartForm, "detailObjectHeader", sSectionId, oCurrentCollectionFacet.Label.String,
					this.getView(), false);

				this.aIdsSmartformsCreatedByExtensibility.push("idOfferSmartForm" + i);
			}
		},

		onExit: function() {
			//	this._removeDataLossDialog();
			//this._removeServerUrlDialog();
			this.getView().getModel().resetChanges();
			if (this.oAccountManager) {

				this.oAccountManager.destroyManager();
				this.oAccountManager = null;
			}
		},

		onShowServerUrl: function() {
			this._removeServerUrlDialog();
			this._oServerUrlDialog = sap.ui
				.xmlfragment(
					"hpa.cei.digital_account.view.fragments.AccountExternalUrl",
					this);
			this.getView().addDependent(
				this._oServerUrlDialog);
			var sPath = "/DigitalAccounts('" + this.sPubAccKey + "')";
			var oServerUrlModel = new JSONModel();
			this._oServerUrlDialog.setModel(oServerUrlModel, "serverUrlView");
			this.getView().getModel().read(sPath, {
				success: jQuery.proxy(function(oResult) {
					oServerUrlModel.setData(oResult);
					jQuery.sap.syncStyleClass(
						"sapUiSizeCompact", this
						.getView(),
						this._oServerUrlDialog);
					this._oServerUrlDialog.open();
				}, this)
			});
		},
		onCloseButton: function() {

			this._removeServerUrlDialog();
		},

		/**
		 * Remove the server Url  dialog
		 * @function
		 * @private
		 */

		_removeServerUrlDialog: function() {
			if (this._oServerUrlDialog) {
				this.getView().removeDependent(
					this._oServerUrlDialog);
				this._oServerUrlDialog.destroy();
				this._oServerUrlDialog = null;
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				//	var bReplace = true;
				this.getRouter().navTo("worklist");
			}
		},

		/**
		 * Event handler  for pressing the edit button.
		 * The screen into the edit mode.Show the save/cancel button and some input can be edited.
		 * @public
		 */
		onBasicEditPress: function() {
			var oViewModel = this.getModel("objectView");
			this.getView().getModel().setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

			oViewModel.setProperty("/basicnormalmode", false);
			oViewModel.setProperty("/basiceditmode", true);
			this.byId("emailInput").setEditable(true);
			//	this.byId("hsTokenInput").setEditable(true);
			this.byId("descInput").setEditable(true);
			//	this.byId("originalIdInput").setEditable(true);
			//		this.byId("appIdInput").setEditable(true);
			//		this.byId("securityIdInput").setEditable(true);
			// oViewModel.setProperty("/canPrepare", false);
			// oViewModel.setProperty("/canActive", false);
			// oViewModel.setProperty("/canArchive", false);
			this.bIsEditMode = true;
			this._setSmartFieldEditable("ObjectPageInfoBasicSmartForm", true);
			if (this.oAccountManager) {

				this.oAccountManager.setEditable(true);
			}
			//	this._setSmartFieldEditable("ObjectPageInfoCredentialSmartForm", true);

		},

		/**
		 * Event handler  for pressing the cancel button.
		 * The screen into the normal mode. And data will not be saved.
		 * @public
		 */
		onBasicCancelPress: function() {
			var oViewModel = this.getModel("objectView");
			// this.byId("appIdInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("appIdInput").setValueStateText("");
			// this.byId("securityIdInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("securityIdInput").setValueStateText("");
			// this.byId("originalIdInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("originalIdInput").setValueStateText("");
			// this.byId("hsTokenInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("hsTokenInput").setValueStateText("");

			oViewModel.setProperty("/basicnormalmode", true);
			oViewModel.setProperty("/basiceditmode", false);
			this.bIsEditMode = false;
			//		this.getView().getModel().setRefreshAfterChange(true);
			this.getView().getModel().resetChanges();

			//	this.getView().getModel().refresh(true);
			this._setModeByStatus(this.sStatusCode);

			//	MessageBox.alert(this.byId("accIdText").getBindingContext());
			this._setSmartFieldEditable("ObjectPageInfoBasicSmartForm", false);
			if (this.oAccountManager) {

				this.oAccountManager.setEditable(false);
				this.oAccountManager.refreshAdditionalData();
			}

			//		this._setSmartFieldEditable("ObjectPageInfoCredentialSmartForm", false);

		},

		/**
		 * Event handler  for pressing the save button.
		 * The screen into the normal mode.Data will be saved.
		 * @public
		 */
		onBasicSavePress: function() {

			this._updateDigitalAccount(false, true);

		},

		/**
		 * Event handler  for Prepare Button press.
		 * 
		 * @public
		 */

		onPreparePress: function() {
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/basicnormalmode", true);
			oViewModel.setProperty("/basiceditmode", false);
			this.bIsEditMode = false;
			this._setStatus("1");
			this.getView().getModel().resetChanges();
			if (this.oAccountManager) {

				this.oAccountManager.setEditable(false);
			}
		},

		/**
		 * Event handler  for Active Button press.
		 * 
		 * @public
		 */
		onActivePress: function() {
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/basicnormalmode", true);
			oViewModel.setProperty("/basiceditmode", false);
			this.bIsEditMode = false;
			// if (this.getOwnerComponent().getModel("system").getData().isCloud && this.byId("commArrInput").getSelectedKey() === "INITIAL") {
			// 	MessageBox.error(this._oResourceBundle.getText("digitalAccountCANoneActiveErrorMessage"));
			// } else {
			this._setStatus("2");
			//	}
			this.getView().getModel().resetChanges();
			if (this.oAccountManager) {

				this.oAccountManager.setEditable(false);
			}

		},

		/**
		 * Event handler  for pressing archive button.
		 * @param {sap.ui.base.Event} oEvent delete button press event object.
		 * @public
		 */
		onArchivePress: function(oEvent) {
			//var fnSetStatus = this._setStatus;

			sap.m.MessageBox.confirm(this._oResourceBundle
				.getText("deleteConfirmText"), {
					onClose: jQuery
						.proxy(function(oResult) {
							if (oResult === sap.m.MessageBox.Action.CANCEL) {
								return;
							}
							var oViewModel = this.getModel("objectView");
							oViewModel.setProperty("/basicnormalmode", true);
							oViewModel.setProperty("/basiceditmode", false);
							this.bIsEditMode = false;
							this.getView().getModel().resetChanges();
							if (this.oAccountManager) {

								this.oAccountManager.setEditable(false);
							}

							//oViewModel.setProperty("/busy", true);
							this._setStatus("3");
						}, this)
				});
		},
		/**
		 * Event handler  for dataloss dialog save button.
		 * @public
		 */
		onSaveNav: function() {
			this._oDataLossDialog.close();
			this._updateDigitalAccount(true, true);

		},
		/**
		 * Event handler  for dataloss dialog nosave and navigation button.
		 * @public
		 */
		onNoSaveNav: function() {
			this._oDataLossDialog.close();
			this.getView().getModel().resetChanges();
			// this.byId("appIdInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("appIdInput").setValueStateText("");
			// this.byId("securityIdInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("securityIdInput").setValueStateText("");
			// this.byId("originalIdInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("originalIdInput").setValueStateText("");
			// this.byId("hsTokenInput").setValueState(sap.ui.core.ValueState.None);
			// this.byId("hsTokenInput").setValueStateText("");
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/basicnormalmode", true);
			oViewModel.setProperty("/basiceditmode", false);
			// oViewModel.setProperty("/crenormalmode", true);
			// oViewModel.setProperty("/creeditmode", false);
			//		this.getView().getModel().setRefreshAfterChange(true);
			this.bIsEditMode = false;
			if (this.oAccountManager) {

				this.oAccountManager.setEditable(false);
				this.oAccountManager.refreshAdditionalData();
			}

			//	this.getView().getModel().refresh(true);
			if (this.sProtectType === "nav") {

				this.onNavBack();
			} else if (this.sProtectType === "prepare") {
				this.onPreparePress();
			} else if (this.sProtectType === "active") {
				this.onActivePress();
			} else if (this.sProtectType === "archive") {
				this.onArchivePress();
			}
		},

		/**
		 * Event handler  for dataloss dialog cancel navigation button.
		 * @public
		 */

		onCancelNav: function() {
			this._oDataLossDialog.close();

		},

		/**
		 * Event handler  for pressing back.
		 * if edit mode, dataloss workprotect dialog should appear.if normal mode,just navback.
		 * @public
		 */

		onWorkProtectNavBack: function() {
			this.sProtectType = "nav";
			if (this.bIsEditMode) {
				this._showDataLossDialog();
			} else {
				this.onNavBack();
			}
		},

		onWorkProtectPreparePress: function() {
			this.sProtectType = "prepare";
			if (this.bIsEditMode) {
				this._showDataLossDialog();
			} else {
				this.onPreparePress();
			}
		},

		onWorkProtectActivePress: function() {
			this.sProtectType = "active";
			if (this.bIsEditMode) {
				this._showDataLossDialog();
			} else {
				this.onActivePress();
			}
		},

		onWorkProtectArchivePress: function() {
			this.sProtectType = "archive";
			if (this.bIsEditMode) {
				this._showDataLossDialog();
			} else {
				this.onArchivePress();
			}
		},

		onNavigate: function(oEvent) {
			var oSelectionId = oEvent.getParameters().section.getId();
			if (oSelectionId.indexOf("ObjectPageSectionContactList") !== -1) {
				this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getController().fnGetData(this.sPubAccKey);
			} else if (oSelectionId.indexOf("ObjectPageSectionContactAnaly") !== -1) {
				this.byId("ObjectPageSubSectionContactAnaly").getBlocks()[0].getController().fnRefreshData();
			} else if (oSelectionId.indexOf("ObjectPageSectionIntAnaly") !== -1) {
				this.byId("ObjectPageSubSectionIntAnaly").getBlocks()[0].getController().fnInitIntAnaly();
			} else if (oSelectionId.indexOf("ObjectPageSectionShakeNearbyAnaly") !== -1) {
				this.byId("ObjectPageSubSectionShakeNearbyAnaly").getBlocks()[0].getController().fnFilterBarInit(this.getView());
			}

		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			//	var oViewModel = this.getModel("objectView");
			//this.getView().setBusy(true);
			this.sPubAccKey = sObjectId;
			//	this.oAuth = oEvent.getParameter("arguments").objectId;
			this._setSmartFieldEditable("ObjectPageInfoBasicSmartForm", false);
			//	this._setSmartFieldEditable("ObjectPageInfoCredentialSmartForm", false);
			this.getModel().metadataLoaded().then(function() {

				if (sObjectId && sObjectId !== "") {
					var sObjectPath = this.getModel().createKey("DigitalAccounts", {
						Key: sObjectId
					});
					this._bindView("/" + sObjectPath);
				}

				// var aObjectSections = this.getView().byId("ObjectPageSectionInfo").getSubSections();

				// //	this._delegate.getView().byId("ObjectPageSectionInfo").removeAllSubSections();
				// for (var i = 1; i < aObjectSections.length; i++) {
				// 	var oSubSection = aObjectSections[i];
				// 	if (oSubSection) {

				// 		this.getView().byId("ObjectPageSectionInfo").removeSubSection(oSubSection);
				// 		oSubSection.destroy();
				// 	}
				// }

				this._resetButtonStatus();
				this.getView().byId("detailDAObjectHeader").setSelectedSection(
					"application-DigitalAccount-showList-component---object--ObjectPageSectionInfo");

				//	this.getView().setBusy(false);

				//		this.getView().byId("DAObjectPageLayoutHeaderTitle").setBusy(true);
				this.getView().getModel().resetChanges();
				this.getView().setBusy(false);

				this.getView().byId("DAObjectPageLayoutHeaderTitle").setBusy(true);
				this._getAuthorization("CUAN_DIGITAL_ACCOUNT").then(function(oData) {
					this._setEditable((oData.results[0].Create || oData.results[0].Change));
					this.getView().byId("DAObjectPageLayoutHeaderTitle").setBusy(false);
					this.getView().setBusy(false);
					//	oView.setBusy(false);

				}.bind(this), function(oError) {
					this.getView().byId("DAObjectPageLayoutHeaderTitle").setBusy(false);
					this.getView().setBusy(false);
					//oView.setBusy(false);

				}.bind(this));
				//this.getView().byId("detailDAObjectHeader").setBusy(true);

				//	this.getView().byId("infoTabFilter").getBinding("content").refresh();

			}.bind(this));
		},

		_resetButtonStatus: function() {
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/canPrepare", false);
			oViewModel.setProperty("/canActive", false);
			oViewModel.setProperty("/canArchive", false);
			oViewModel.setProperty("/basicnormalmode", false);
			oViewModel.setProperty("/basiceditmode", false);
			oViewModel.setProperty("/crenormalmode", false);
			oViewModel.setProperty("/creeditmode", false);
			this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getModel("contactListView").setProperty("/canCreateTG", false);
		},

		_getAuthorization: function(sObjectId) {

			var oUrlParams = {
				"BOName": "'" + sObjectId + "'"

			};

			return new Promise(function(resolve, reject) {
				this.getView().getModel().read("/READBOAUTHORIZATION", {
					urlParameters: oUrlParams,
					success: function(oData, oResponse) {
						//Handle Success  
						if (oResponse.statusCode === "200" || oResponse.statusCode === 200) {

							resolve(oData);

							//	this._showOrHideEditPageSections(that._bInEditMode);

						} else {
							reject(oData);
						}
					},
					error: function(oError) {
						reject(oError);
						//this._setEditable(this.oAuthorization.Change);
						//
						//Handle Error  
					}
				});
			}.bind(this));

		},

		/**
		 * update the digital account.
		 * @function
		 * @param {boolean} bIsNavBack decide whether to navigation back after update success.
		 * @private
		 */
		_updateDigitalAccount: function(bIsNavBack) {

			var oViewModel = this.getModel("objectView");
			this.getView().setBusy(true);
			oViewModel.setProperty("/busy", true);

			if (this.oAccountManager) {

				this.oAccountManager.updateAdditionalData().then(function() {
					if (this.getView().getModel().hasPendingChanges()) {
						this.getView().getModel().submitChanges({
							success: function(oData) {
								//this.getView().setBusy(false);
								if (oData.__batchResponses.length > 0) {

									if (!oData.__batchResponses[0].message) {
										var sStatusCode = oData.__batchResponses[0].__changeResponses[0].statusCode;
										if (sStatusCode === "201" || sStatusCode === 201 || sStatusCode === "204" || sStatusCode === 204) {

											this._updateSuccess(bIsNavBack);

										}
									} else {
										//	this.getView().getModel().resetChanges();

										var sErrorText = oData.__batchResponses[0].response.body;
										MessageBox.error(sErrorText);

										// if (this.oAccountManager) {

										// 	this.oAccountManager.handleError(sErrorText, false);
										// }
										this.getView().setBusy(false);
										oViewModel.setProperty("/busy", false);

									}

								}
							}.bind(this),

							error: jQuery
								.proxy(
									function(oError) {
										this.getView().getModel().resetChanges();
										this.getView().setBusy(false);
										oViewModel.setProperty("/busy", false);

									},
									this)
						});
					} else {
						this._updateSuccess(bIsNavBack);
					}
				}.bind(this), function() {
					this.getView().setBusy(false);
					oViewModel.setProperty("/busy", false);
					//		this.getView().getModel().resetChanges();
				}.bind(this));

			}

			// if (this.oAccountManager) {

			// 	this.oAccountManager.updateAdditionalData().then(function() {
			// 		oViewModel.setProperty("/busy", false);
			// 		this.getView().setBusy(false);
			// 		// if (bIsNavBack) {
			// 		// 	oViewModel.setProperty("/basicnormalmode", true);
			// 		// 	oViewModel.setProperty("/basiceditmode", false);
			// 		// 	oViewModel.setProperty("/crenormalmode", true);
			// 		// 	oViewModel.setProperty("/creeditmode", false);
			// 		// } else {

			// 		oViewModel.setProperty("/basicnormalmode", true);
			// 		oViewModel.setProperty("/basiceditmode", false);

			// 		//	}

			// 		this.bIsEditMode = false;

			// 		this._setSmartFieldEditable("ObjectPageInfoBasicSmartForm", false);
			// 		this.oAccountManager.refreshAdditionalData();
			// 	}.bind(this), function() {
			// 		oViewModel.setProperty("/busy", false);
			// 		this.getView().setBusy(false);
			// 	}.bind(this));

			// }

			//			this._setSmartFieldEditable("ObjectPageInfoCredentialSmartForm", false);
			//	}
			// if (this.oAccountManager) {

			// 	this.oAccountManager.updateAddtitionalData();
			// }

		},

		/**
		 * Show the message toast.
		 * @function
		 * @param {String} messagetext
		 * @private
		 */

		_showMessageToast: function(sMessage) {
			sap.ui.require(["sap/m/MessageToast"], function(MessageToast) {
				MessageToast.show(sMessage, {
					closeOnBrowserNavigation: false
				});
			});
		},

		/**
		 * Save the data when in edit mode.
		 * @function
		 * @param {boolean} bIsNavBack: if is from navigation back.
		 * @private
		 */
		_updateSuccess: function(bIsNavBack) {
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/busy", false);
			this.getView().setBusy(false);
			// if (bIsNavBack) {
			// 	oViewModel.setProperty("/basicnormalmode", true);
			// 	oViewModel.setProperty("/basiceditmode", false);
			// 	oViewModel.setProperty("/crenormalmode", true);
			// 	oViewModel.setProperty("/creeditmode", false);
			// } else {

			oViewModel.setProperty("/basicnormalmode", true);
			oViewModel.setProperty("/basiceditmode", false);

			//	}

			this.bIsEditMode = false;
			var sUpdateMessage = this._oResourceBundle.getText("msg.updateMessage");
			this._showMessageToast(sUpdateMessage);

			this._setSmartFieldEditable("ObjectPageInfoBasicSmartForm", false);
			//	this._setSmartFieldEditable("ObjectPageInfoCredentialSmartForm", false);
			//	this.getView().getModel().refresh(true);
			//	this.getView().getModel().setRefreshAfterChange(true);
			this._setModeByStatus(this.sStatusCode);
			if (this.oAccountManager) {
				this.oAccountManager.setEditable(false);

				this.oAccountManager.refreshAdditionalData();

			}

			// if (this.oAccountManager) {

			// 	this.oAccountManager.updateModel(oUpdateStatus, true);
			// }

			if (bIsNavBack) {
				if (this.sProtectType === "nav") {

					this.onNavBack();
				} else if (this.sProtectType === "prepare") {
					this.onPreparePress();
				} else if (this.sProtectType === "active") {
					this.onActivePress();
				} else if (this.sProtectType === "archive") {
					this.onArchivePress();
				}
			}
			//
		},

		_setSmartFieldEditable: function(sSmartFormId, bIsEditable) {
			var oInfo = this.byId(sSmartFormId);
			ExtHelper.setSmartFieldEditable(oInfo, bIsEditable);
		},

		_getSmartFieldValue: function(sSmartFormId) {

		},

		/**
		 * Set the status of the account.
		 * @function
		 * @param {String} sStatusCode target status code.
		 * @private
		 */
		_setStatus: function(sStatusCode) {

			var oUpdateStatus = {
				StatusCode: sStatusCode
					//		ApiUserId: this.byId("appIdInput").getValue(),
					//		ApiUserPassword: this.byId("securityIdInput").getValue()

			};
			// if (this.oAccountManager) {

			// 	this.oAccountManager.updateModel(oUpdateStatus, true);
			// }

			var oViewModel = this.getModel("objectView");
			this.getView().setBusy(true);
			oViewModel.setProperty("/busy", true);
			//	this.getView().getModel().setRefreshAfterChange(false);
			//	var oContactListModel = this.byId("idContactTableView").getModel("contactListView");

			this.getView().getModel().update("/DigitalAccounts('" + this.sPubAccKey + "')", oUpdateStatus, {
				success: jQuery
					.proxy(
						function() {
							this._setModeByStatus(sStatusCode);
							this.getView().setBusy(false);
							this.sStatusCode = sStatusCode;
							//	this.getView().getModel().refresh(true);
							//		this.getView().getModel().setRefreshAfterChange(true);

							oViewModel.setProperty("/busy", false);
							var sUpdateMessage = this._oResourceBundle.getText("msg.updateMessage");
							this._showMessageToast(sUpdateMessage);
						},
						this),
				error: jQuery
					.proxy(
						function(oError) {
							oViewModel.setProperty("/busy", false);
							this.getView().setBusy(false);

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
									if (this.oAccountManager) {
										this.oAccountManager.handleError(sErrorCode, sErrorMessage, false, aAttributes);
									}

								}

							} catch (e) {
								sap.m.MessageBox.error(sErrorText);

							}

							// 			oViewModel.setProperty("/busy", false);
							//			this.getView().getModel().setRefreshAfterChange(true);

						},
						this)
			});

		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			//  var oMemberListView = this.getView().byId("idMemberTableView");
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);

						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
						//	oDataModel.refresh();
					}
				}
			});

			// oMemberListView.bindElement({
			// 		path: sObjectPath,
			// 		events: {
			// 			change: this._onBindingChange.bind(this),
			// 			dataRequested: function() {
			// 				oDataModel.metadataLoaded().then(function() {
			// 					// Busy indicator on view should only be set if metadata is loaded,
			// 					// otherwise there may be two busy indications next to each other on the
			// 					// screen. This happens because route matched handler already calls '_bindView'
			// 					// while metadata is loaded.
			// 					oViewModel.setProperty("/busy", true);
			// 				});
			// 			},
			// 			dataReceived: function() {
			// 				oViewModel.setProperty("/busy", false);
			// 			}
			// 		}
			// 	});
		},

		/**
		 * Show the dataloss workprotect dialog
		 * @function
		 * @private
		 */
		_showDataLossDialog: function() {
			if (!this._oDataLossDialog) {
				this._oDataLossDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.DataLossDialog", this);
				this.getView().addDependent(
					this._oDataLossDialog);

			}

			this._oDataLossDialog.open();

		},

		/**
		 * Set View Mode by statuscode
		 * @function
		 * @param {string} sStatusCode the status code of account
		 * @private
		 */

		_setModeByStatus: function(sStatusCode) {
			var oViewModel = this.getModel("objectView");
			var oContactListModel = this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getModel("contactListView");
			//	var oContactListModel = this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getModel("contactListView");

			var fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
			oContactListModel.setProperty("/canCreateTG", false);
			//var sTgID = ;
			var oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");
			if (oCrossAppNavigator) {

				oCrossAppNavigator.isNavigationSupported([{
						target: {
							semanticObject: "TargetGroup",
							action: "maintain"
						}
					}])
					.done(function(aResponses) {
						if (aResponses[0].supported === true && sStatusCode !== "3") {

							/* eslint-disable sap-cross-application-navigation */
							oContactListModel.setProperty("/canCreateTG", true);
						} else {
							oContactListModel.setProperty("/canCreateTG", false);

						}

					})
					.fail(function() {
						oContactListModel.setProperty("/canCreateTG", false);

						//error handling
					});
			}

			if (sStatusCode === "1") {

				oViewModel.setProperty("/canPrepare", false);
				oViewModel.setProperty("/canActive", true);
				oViewModel.setProperty("/canArchive", true);
				//	oContactListModel.setProperty("/canCreateTG", true);
				oViewModel.setProperty("/basicnormalmode", true);
				oViewModel.setProperty("/basiceditmode", false);
				oViewModel.setProperty("/crenormalmode", true);
				oViewModel.setProperty("/creeditmode", false);

			} else if (sStatusCode === "2") {
				oViewModel.setProperty("/canPrepare", true);
				oViewModel.setProperty("/canActive", false);
				oViewModel.setProperty("/canArchive", true);
				//	oContactListModel.setProperty("/canCreateTG", true);
				oViewModel.setProperty("/basicnormalmode", true);
				oViewModel.setProperty("/basiceditmode", false);
				oViewModel.setProperty("/crenormalmode", true);
				oViewModel.setProperty("/creeditmode", false);
			} else if (sStatusCode === "3") {

				oViewModel.setProperty("/canPrepare", true);
				oViewModel.setProperty("/canActive", false);
				oViewModel.setProperty("/canArchive", false);
				oViewModel.setProperty("/basicnormalmode", false);
				oViewModel.setProperty("/basiceditmode", false);
				oViewModel.setProperty("/crenormalmode", false);
				oViewModel.setProperty("/creeditmode", false);
				//	oContactListModel.setProperty("/canCreateTG", false);
			}
		},

		_setEditable: function(bIsEditable) {
			//	var oViewModel = this.getModel("objectView");
			if (!bIsEditable) {
				this._resetButtonStatus();
				//this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getModel("contactListView").setProperty("/canCreateTG", false);

			} else {
				this._setModeByStatus(this.sStatusCode);
			}

		},

		/**
		 * destroy the dataloss workprotect dialog.
		 * @function
		 * @private
		 */
		// _removeDataLossDialog: function() {
		// 	if (this._oDataLossDialog) {
		// 		this.getView().removeDependent(
		// 			this._oDataLossDialog);
		// 		this._oDataLossDialog.destroy();
		// 		this._oDataLossDialog = null;
		// 	}
		// },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {Object} oEvent binding event object
		 * @private
		 */
		_onBindingChange: function(oEvent) {

			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
			//	oView.setBusy(true);

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}
			//		oView.setBusy(true);
			var oThisAccount = this.getView().getBindingContext().getObject();
			if (oThisAccount.Key !== this.sAccKey) {
				this.sAccKey = oThisAccount.Key;

				this.sStatusCode = oThisAccount.StatusCode;
				var sMktAreaKey = oThisAccount.MarketingAreaId;
				var sTypeCode = oThisAccount.Type;
				this.sTypeCode = sTypeCode;

				if (!this.oAccountManager) {

					this.oAccountManager = new hpa.cei.digital_account.manager.AccountManager(this, sTypeCode);

				}

				if (sTypeCode !== this.oAccountManager.getAccountTypeCode()) {
					this.oAccountManager.changeAccountType(sTypeCode);
					//	this.oAccountManager.addObjectAccountFragment();
				}

				this.oAccountManager.addObjectAccountFragment();
				this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getController().setMktAreaKey(sMktAreaKey);

				var oModelControl = this.oAccountManager.getModelControl();
				//	var oViewModel = this.getModel("objectView");
				if (oModelControl) {
					oViewModel.setProperty("/contactList", oModelControl.contactList);
					oViewModel.setProperty("/contactAnaly", oModelControl.contactAnaly);
					oViewModel.setProperty("/interactionAnaly", oModelControl.interactionAnaly);
					oViewModel.setProperty("/shakeNearbyAnaly", oModelControl.shakeNearbyAnaly);

					// else{
					// 	oModelControl={
					// 		contactList:true,
					// 		contactAnaly:true,
					// 		interactionAnaly:true,
					// 		shakeNearbyAnaly:true
					// 	};

					// }

					//	var sAccountType = this.getView().getBindingContext().getObject().Type;
					if (oModelControl.interactionAnaly === true) {
						this.byId("ObjectPageSubSectionIntAnaly").getBlocks()[0].getController().fnInitType(sTypeCode, this.getView());

						//		this.byId("ObjectPageSubSectionIntAnaly").getBlocks()[0].getController().fnInitIntAnaly(sTypeCode);
					}
					//temply remove the shake nearby view if not wechat type. should be donwe in digital account refactory.
					// if(sAccountType === hpa.cei.digital_account.util.accountTypeConst.service || sAccountType === hpa.cei.digital_account.util.accountTypeConst.sub){
					// 	this.getView().byId("shakeNearbyAnalyIconTab").setVisible(true);
					// }else{
					// 	this.getView().byId("shakeNearbyAnalyIconTab").setVisible(false);
					// }
					//	if (oModelControl.shakeNearbyAnaly === true) {

					//		this.byId("ObjectPageSubSectionShakeNearbyAnaly").getBlocks()[0].getController().fnFilterBarInit();
					//	}
				}
				//		this.getView().getModel().refresh();

				if (this.sStatusCode === "3") {
					this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getModel("contactListView").setProperty("/canCreateTG", false);

				}

				this.bIsEditMode = false;

			}
			//	this.getView().byId("DAObjectPageLayoutHeaderTitle").setBusy(false);
			//this._getAuthorization("CUAN_TARGET_GROUP").then(function(oData){
			//	this.byId("ObjectPageSubSectionContactList").getBlocks()[0].getModel("contactListView").setProperty("/canCreateTG", (oData.results[0].Create));

			//}.bind(this));

			//	this.getView().setBusy(false);
			//	oView.setBusy(false);

		}

	});

});