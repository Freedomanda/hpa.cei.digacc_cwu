sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hpa/cei/digital_account/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/TablePersoController",
	"sap/ui/model/odata/type/Guid"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter, TablePersoController, Guid) {
	"use strict";

	var ContactAnaly = function() {
		var oController = null;
		var oContactAnalyTable;
		var sAccountId = "";
		var oDatePeroid;
		var oVizFrameLine;
		var oPopOver;
		var oChartContainer;
		var oTypeSelect;
		//	var sPubaccKey = "";
		var oResourceBundle;
		var oTablePersoController;
		var oTablePersoProvider;
		var oVariantManagement;
		var oViewModel = new JSONModel({
			busy: true,
			tableBusyDelay: 0,
			isChartView: false,
			isTableView: true

		});

		var oContactAnalyModel = new JSONModel({
			ContactAnaly: []

		});

		var oContactAnalyTableModel = new JSONModel({
			ContactAnaly: []
		});

		var _addZeroToNullValue = function(aDateRange, aIntAnalyData) {
			var aZeroAddedData = [];
			var fnFilterAnalyData = function(dDate) {
				return function(oAnalyData) {
					var iMinusTime = 0;
					if (oAnalyData.InteractionUTCDate instanceof Date) {
						iMinusTime = oAnalyData.InteractionUTCDate - dDate.getTime();
						if (iMinusTime > -1000 && iMinusTime < 1000) {
							return true;
						}
					} else if (oAnalyData.InteractionUTCDate.indexOf("/Date") !== -1) {

						iMinusTime = new Date(oAnalyData.InteractionUTCDate.substr(6, 13) * 1).getTime() - dDate.getTime();
						if (iMinusTime > -1000 && iMinusTime < 1000) {
							return true;
						}
					} else {
						var dFormatDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyyMMdd"
						}).parse(oAnalyData.InteractionUTCDate);
						var iTZOffsetMs = dDate.getTimezoneOffset() * 60 * 1000;
						iMinusTime = new Date(dFormatDate).getTime() - dDate.getTime() - iTZOffsetMs;
						if (iMinusTime > -1000 && iMinusTime < 1000) {
							return true;
						}
					}
				};
			};

			for (var i = 0; i < aDateRange.length; i++) {
				var dDate = aDateRange[i];

				var aCheckData = aIntAnalyData.filter(fnFilterAnalyData(dDate));
				if (aCheckData === undefined || aCheckData === null || aCheckData.length === 0) {
					var oZeroData = {};

					oZeroData.InteractionUTCDate = dDate;
					oZeroData.NumberOfFollowers = 0;
					oZeroData.NumberOfUnfollowers = 0;
					oZeroData.NetNumberOfFollowers = 0;
					aZeroAddedData.push(oZeroData);
				} else {
					var oNoZeroData = jQuery.extend({}, aCheckData[0]);
					oNoZeroData.InteractionUTCDate = dDate;
					//	aCheckData[0].InteractionUTCDate = dDate;
					aZeroAddedData.push(oNoZeroData);
				}

			}
			// for(var i =0;i<zeroAddedData.length;i++){
			// 	var oDate = zeroAddedData[i].InteractionUTCDate;
			// 	if(oDate instanceof Date){

			// 	}else{
			// 			zeroAddedData[i].InteractionUTCDate = new Date(oDate.substr(6,13)*1);
			// 	}

			// }

			return aZeroAddedData;

		};

		/**
		 * refresh the variantmanagement items
		 * @function
		 * @private
		 */

		var _fnRefreshVmItems = function() {

			var aSavedVariantItems = [];
			if (oTablePersoProvider && oTablePersoProvider !== null) {

				var oPerData = oTablePersoProvider.getPersData();
				oPerData.done(jQuery.proxy(function(oPersData) { // Success callback
					if (oPersData && oPersData !== "") {

						aSavedVariantItems = oPersData.Items;
						var sDefaultKey = oPersData.DefaultKey;

						oVariantManagement.removeAllItems();
						oVariantManagement.destroyItems();
						if (aSavedVariantItems) {

							for (var i = 0; i < aSavedVariantItems.length; i++) {
								var oVariantItem = new sap.ui.comp.variants.VariantItem({
									key: aSavedVariantItems[i].key,
									text: aSavedVariantItems[i].text,

									customData: [{
										key: "fromdate",
										value: aSavedVariantItems[i].fromDate
									}, {
										key: "todate",
										value: aSavedVariantItems[i].toDate
									}]

								});
								oVariantManagement.addItem(oVariantItem);
							}
						}
						if (sDefaultKey) {
							oVariantManagement.setDefaultVariantKey(sDefaultKey);
							oVariantManagement.setInitialSelectionKey(sDefaultKey);
							oVariantManagement.fireSelect({
								key: sDefaultKey
							});
						}

					}
					//	return aSavedVariantItems;

				}));

			} else {
				return;
			}

		};

		/**
		 * get the contact number according to the selected count key.
		 * @function
		 * @param {String} sFilterKey select key of the count type:new,unfollow,etc..
		 * @private
		 */
		var _fnGetContactsNum = function(sFilterKey) {
			oChartContainer.setBusy(true);
			if (sFilterKey === "") {
				sFilterKey = "NumberOfFollowers";
			}
			var aContactAnalyTableItems = oContactAnalyTableModel.getProperty("/ContactAnaly");
			var aContactsAnaly = [];
			for (var i = 0; i < aContactAnalyTableItems.length; i++) {
				var iItemsLength = aContactAnalyTableItems.length;
				//reverse the table
				var sNum = aContactAnalyTableItems[iItemsLength - 1 - i][sFilterKey];
				var sDate = aContactAnalyTableItems[iItemsLength - 1 - i].InteractionUTCDate;
				var oContactAnaly = {
					Createddate: sDate,
					Num: sNum
				};
				aContactsAnaly.push(oContactAnaly);

			}
			if (aContactsAnaly.length === 0) {
				oContactAnalyModel.setProperty("/ContactAnaly", [{}]);
			} else {

				oContactAnalyModel.setProperty("/ContactAnaly", aContactsAnaly);
			}

			oChartContainer.setBusy(false);

		};

		/**
		 * filter the table according to the date period and after that get the contact numbers.
		 * @function
		 * @param {Date} dDateFrom date period first value.
		 * @param {Date} dDateTo date period second value.
		 * @private
		 */
		var _fnFilterTable = function(dDateFrom, dDateTo) {
			//get the offset of the current timezone and adjust to the standard GMT.
			//	oContactAnalyTable.setBusy(true);
			oChartContainer.setBusy(true);
			dDateFrom.setHours(0);
			dDateFrom.setMinutes(0);
			dDateFrom.setSeconds(0);
			dDateTo.setHours(0);
			dDateTo.setMinutes(0);
			dDateTo.setSeconds(0);
			var iTZOffsetMs = dDateFrom.getTimezoneOffset() * 60 * 1000;
			var dAdjDateFrom = new Date(dDateFrom.getTime() - iTZOffsetMs);
			var dAdjDateTo = new Date(dDateTo.getTime() - iTZOffsetMs);

			var sAdjDateFrom = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH%3Amm%3Ass"
			}).format(dAdjDateFrom);
			var sAdjDateTo = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH%3Amm%3Ass"
			}).format(dAdjDateTo);

			//	var aTableFilters = [new Filter("InteractionUTCDate", FilterOperator.BT, dAdjDateFrom, dAdjDateTo)];
			//	var aTableFilters = [];
			var aDAFilter = [new Filter("DigitalAccountUUID", FilterOperator.EQ, sAccountId)];

			var oTableFilter = new sap.ui.model.Filter({
				filters: aDAFilter,
				and: true
			});
			if (sAccountId && sAccountId !== "") {

				var sPath = "/C_MKT_DGTLACCTSUBSCRPNQ(P_EndDate=datetime'" + sAdjDateTo + "',P_StartDate=datetime'" + sAdjDateFrom + "')/Results";

				oController.getOwnerComponent().getModel().read(sPath, {
					urlParameters: {
						"$select": "DigitalAccountUUID,InteractionUTCDate,NumberOfFollowers,NumberOfUnfollowers,NetNumberOfFollowers"
					},
					filters: [oTableFilter],
					success: function(oResult) {

						var iDateRange = Math.round((dAdjDateTo.getTime() - dAdjDateFrom.getTime()) / (1000 * 60 * 60 * 24));
						var aDateRange = [];
						for (var j = 0; j <= iDateRange; j++) {
							var dateEle = new Date(dAdjDateFrom);
							dateEle.setDate(dAdjDateFrom.getDate() + j);
							aDateRange.push(dateEle);
						}
						var addedZeroData = _addZeroToNullValue(aDateRange, oResult.results);
						oContactAnalyTableModel.setProperty("/ContactAnaly", addedZeroData);

						oContactAnalyTable.setBusy(false);
						oChartContainer.setBusy(false);
					},
					error: function(oError) {
						oChartContainer.setBusy(false);
						oContactAnalyTable.setBusy(false);
					}
				});
			}
			//	oContactAnalyTable.getBinding("items").filter(oTableFilter, "Application");
			//	getContactsNum(oTypeSelect.getSelectedKey());
		};

		this.formatter = formatter;

		/**
		 * Called when the contactAnaly controller is instantiated.
		 * @public
		 */
		this.onInit = function() {
			oController = this;

			oContactAnalyTable = this.byId("contactAnalysisTable");
			oChartContainer = this.byId("contactAnalyChartContainer");
			oVizFrameLine = this.byId("contactAnalyLine");

			oPopOver = new sap.viz.ui5.controls.Popover();
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.ContactAnalyListFilter", this);
				this.getView().addDependent(
					this._oFilterDialog);
				oDatePeroid = sap.ui.getCore().byId("contactFilterDatePeroidDate");

				// Set initial and reset value for Slider in custom control

			}

			//	this.byId("smartvm").getPersonalizableControls()[0].setControl(oContactAnalyTable);

			oTypeSelect = this.byId("typeSelect");
			oResourceBundle = this.getResourceBundle();
			this.byId("valueAxisFeed").setValues([oResourceBundle.getText("contactCountMeasure")]);
			this.byId("categoryAxisFeed").setValues([oResourceBundle.getText("dateDimension")]);
			this.setModel(oViewModel, "contactAnalyView");
			oVizFrameLine.setModel(oContactAnalyModel, "contactAnalyModel");
			oContactAnalyTable.setModel(oContactAnalyTableModel, "contactAnalyTableModel");

			oVariantManagement = this.byId("vmForContactAnalyTable");
			var oPersId = {
				container: "ContactAnaly",
				item: "contactanalylist"
			};

			// Get a personalization service provider from the shell
			oTablePersoProvider = sap.ushell.Container.getService("Personalization").getPersonalizer(oPersId);

			//	var aVmItems = fnGetVmItems();

			// Instantiate a controller connecting your table and the persistence service
			oTablePersoController = new TablePersoController({
				table: oContactAnalyTable,
				persoService: oTablePersoProvider
			}).activate();
			oController.getOwnerComponent().getRouter("object")
				.attachRouteMatched(this._onObjectMatched);

		};
		
		
		this.filterZero = function(aDateRange, aIntAnalyData){
			return _addZeroToNullValue(aDateRange, aIntAnalyData);
		};

		/**
		 * Event handler  for change the type select.
		 * @param {sap.ui.base.Event} oEvent Select.
		 * @public
		 */

		this.handleTypeChange = function(oEvent) {
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			_fnGetContactsNum(sSelectedKey);

		};

		/**
		 * Event handler  for initialize the varaintmanagement.
		 * @param {sap.ui.base.Event} oEvent variantmanagement.
		 * @public
		 */

		// this.onVariantInit = function(oEvent) {

		// };

		/**
		 * Event handler  for pressting the save button of the varaintmanagement.
		 * @param {sap.ui.base.Event} oEvent variantmanagement.
		 * @public
		 */
		this.onVariantSave = function(oEvent) {

			var oCurrentPersData = oTablePersoProvider.getPersData();
			var bIsOverwritten = oEvent.getParameters().overwrite;
			var sKey = oEvent.getParameters().key;
			var sText = oEvent.getParameters().name;
			var bIsDefault = oEvent.getParameters().def;
			var sDefaultKey = "";

			oCurrentPersData.done(jQuery.proxy(function(oPersData) { // Success callback
				var aCurrentPersData = [];
				if (oPersData && oPersData !== "") {
					aCurrentPersData = oPersData.Items ? oPersData.Items : [];
					sDefaultKey = oPersData.DefaultKey ? oPersData.DefaultKey : "";
					if (bIsDefault) {
						sDefaultKey = sKey;
					}
					if (!bIsOverwritten) {
						var oNewItem = {
							key: sKey,
							text: sText,

							fromDate: oDatePeroid.getDateValue(),
							toDate: oDatePeroid.getSecondDateValue()

						};
						aCurrentPersData.push(oNewItem);
					} else {
						for (var i = 0; i < aCurrentPersData.length; i++) {
							if (aCurrentPersData[i].key === sKey) {
								aCurrentPersData[i].text = sText;
								aCurrentPersData[i].fromDate = oDatePeroid.getDateValue();
								aCurrentPersData[i].toDate = oDatePeroid.getSecondDateValue();
								break;
							}
						}

					}

				} else {

					aCurrentPersData.push({
						key: sKey,
						text: sText,

						fromDate: oDatePeroid.getDateValue(),
						toDate: oDatePeroid.getSecondDateValue()
					});
					if (bIsDefault) {
						sDefaultKey = sKey;
					}
				}

				oTablePersoProvider.setPersData({
					Items: aCurrentPersData,
					DefaultKey: sDefaultKey

				});

				_fnRefreshVmItems();
			}));

		};

		/**
		 * Event handler  for after managing the varaintmanagement.
		 * @param {sap.ui.base.Event} oEvent variantmanagement.
		 * @public
		 */
		this.onVariantManage = function(oEvent) {
			var aRenamedVariantItems = oEvent.getParameters().renamed;
			var aDeletedVariantItems = oEvent.getParameters().deleted;
			var oCurrentPersData = oTablePersoProvider.getPersData();
			oCurrentPersData.done(jQuery.proxy(function(oPersData) { // Success callback
				var aCurrentPersData = [];
				if (oPersData && oPersData !== "") {
					aCurrentPersData = oPersData.Items ? oPersData.Items : [];
					var sDefaultKey = oPersData.DefaultKey ? oPersData.DefaultKey : "";
					for (var i = 0; i < aRenamedVariantItems.length; i++) {
						var sKey = aRenamedVariantItems[i].key;
						var sName = aRenamedVariantItems[i].name;
						for (var j = 0; j < aCurrentPersData.length; j++) {
							if (aCurrentPersData[j].key === sKey) {
								aCurrentPersData[j].text = sName;

								break;
							}
						}
					}

					for (var i2 = 0; i2 < aDeletedVariantItems.length; i2++) {
						var sDeletedKey = aDeletedVariantItems[i2];

						for (var j2 = 0; j2 < aCurrentPersData.length; j2++) {
							if (aCurrentPersData[j2].key === sDeletedKey) {
								aCurrentPersData.splice(j2, 1);

								break;
							}
						}
					}

					oTablePersoProvider.setPersData({
						Items: aCurrentPersData,
						DefaultKey: sDefaultKey

					});
				}
				_fnRefreshVmItems();
			}));

		};
		/**
		 * Event handler  for select the item of varaintmanagement.
		 * @param {sap.ui.base.Event} oEvent variantmanagement.
		 * @public
		 */
		this.onVariantSelect = function(oEvent) {
			var dFromDate = new Date(oEvent.getSource().oSelectedItem.data("fromdate"));
			var dToDate = new Date(oEvent.getSource().oSelectedItem.data("todate"));
			_fnFilterTable(dFromDate, dToDate);
			oDatePeroid.setDateValue(dFromDate);
			oDatePeroid.setSecondDateValue(dToDate);

		};
		/**
		 * Called when the contactAnaly controller is destroyed.
		 * @public
		 */
		this.onExit = function() {
			if (this._oFilterDialog) {
				this.getView().removeDependent(
					this._oFilterDialog);
				this._oFilterDialog.destroy();
				this._oFilterDialog = null;
			}

			if (this._oSortDialog) {
				this.getView().removeDependent(
					this._oSortDialog);
				this._oSortDialog.destroy();
				this._oSortDialog = null;
			}

		};

		this.fnRefreshData = function() {
			_fnFilterTable(oDatePeroid.getDateValue(), oDatePeroid.getSecondDateValue());
		};

		/**
		 * after initalize the controller match the digital account key.
		 * @function
		 * @param {sap.ui.base.Event} oEvent route of the app.
		 * @private
		 */
		this._onObjectMatched = function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			//	oContactAnalyTable.setBusy(true);
			oController.getOwnerComponent().getModel().metadataLoaded().then(function() {
				if (sObjectId !== undefined) {

					//	oPopOver = this.getView().byId("contactAnalyLinePopOver");
					oPopOver.connect(oVizFrameLine.getVizUid());

					//			sPubaccKey = sObjectId;

					// 	var oTableFilter = [new Filter("Key", FilterOperator.EQ, sPubaccKey)];
					// 	oContactAnalyTable.getBinding("items").filter(oTableFilter, "Application");
					// 	oContactAnalyTable.getBinding("items").refresh();
					oVizFrameLine.setVizProperties({
						plotArea: {
							dataLabel: {
								visible: true,
								positon: "outside",
								hideWhenOverlap: true
							}
						},
						valueAxis: {
							label: {},
							title: {
								visible: true
							}
						},
						categoryAxis: {
							title: {
								visible: true
							}
						},
						title: {
							visible: true,
							text: ""
						}
					});
					//inital 7 dates
					var dNowDate = new Date();
					var dBefore6Date = new Date();

					dBefore6Date.setDate(dNowDate.getDate() - 6);
					oDatePeroid.setDateValue(dBefore6Date);
					oDatePeroid.setSecondDateValue(dNowDate);

					if (sObjectId) {
						//		sAccountId = new Guid().parseValue(sObjectId,"string");
						sAccountId = sObjectId;

						//					 var sPath = "/C_MKT_DgtlAcctCntctAnlys(P_DigitalAccountUUID=guid'" + sObjectId + "')/Set";

						//	_fnFilterTable(dBefore6Date, dNowDate);
						_fnRefreshVmItems();
					}

				}

				// var _sContextPath = oController.getOwnerComponent().getModel().createKey("Contacts", {
				// 	PubaccId : sObjectId
				// });

			});

			// this._onGetContactListData();
		};

		this.onRefresh = function() {
			//	oContactAnalyTable.getBinding("items").refresh();
		};

		/**
		 * Event handler  for pressing the clear button of the filter.
		 * initial the date period. minus 6 days from now date
		 * @public
		 */
		this.onClear = function() {
			var dNowDate = new Date();
			var dBefore6Date = new Date();

			dBefore6Date.setDate(dNowDate.getDate() - 6);
			oDatePeroid.setDateValue(dBefore6Date);
			oDatePeroid.setSecondDateValue(dNowDate);
			_fnFilterTable(dBefore6Date, dNowDate);

		};

		/**
		 * Event handler  for pressing the confirm button of the filter.
		 * initial the date period. minus 6 days from now date
		 * @public
		 */
		this.onFilterConfirm = function() {

			var iDateFrom = oDatePeroid.getDateValue().getTime();
			var iDateTo = oDatePeroid.getSecondDateValue().getTime();
			var iDatePeroid = Math.round((iDateTo - iDateFrom) / (1000 * 60 * 60 * 24));
			if (iDatePeroid > 30) {
				//popup
				sap.m.MessageBox.warning(
					oResourceBundle.getText("datePeroidTooLongWarningText")

				);

				var oDateFrom = oDatePeroid.getDateValue();
				var oDate20Days = new Date(oDatePeroid.getDateValue());
				oDate20Days.setDate(oDateFrom.getDate() + 29);
				oDatePeroid.setDateValue(oDateFrom);
				oDatePeroid.setSecondDateValue(oDate20Days);
			}
			_fnFilterTable(oDatePeroid.getDateValue(), oDatePeroid.getSecondDateValue());
		};

		/**
		 * Event handler  for pressing the filter button of the chart.
		 * open the filter dialog
		 * @public
		 */

		this.onFilter = function() {

			//		this._oDialog.setModel(this.getView().getModel());
			// toggle compact style
			//		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oFilterDialog.open();

		};

		/**
		 * Event handler  for pressing the sort button of the table.
		 * open the sort dialog
		 * @public
		 */

		this.onSort = function() {
			if (!this._oSortDialog) {
				this._oSortDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.ContactAnalyListSort", this);
				this.getView().addDependent(
					this._oSortDialog);
				// Set initial and reset value for Slider in custom control

			}

			//		this._oDialog.setModel(this.getView().getModel());
			// toggle compact style
			//		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oSortDialog.open();

		};

		/**
		 * Event handler  for pressing the personalize button of the talbe.
		 * open the personalize dialog
		 * @public
		 */

		this.onPersonalize = function() {
			oTablePersoController.openDialog();
		};

		/**
		 * Event handler  for pressing the confirm button of the sort dialog.
		 * @param {sap.ui.base.Event} oEvent sort values.
		 * @public
		 */
		this.onSortConfirm = function(oEvent) {

			var aSorters = [];
			var sPath = oEvent.getParameters().sortItem.getKey();
			var bDescending = oEvent.getParameters().sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oContactAnalyTable.getBinding("items").sort(aSorters);
		};

		/**
		 * Event handler  for changing the date peroid value.
		 * check if the date is more than one year?
		 * @param {sap.ui.base.Event} oEvent Date peroid.
		 * @public
		 */

		this.onDateChange = function(oEvent) {
			//if the period>20 days,popup message.

			var iDateFrom = oEvent.getParameter("from").getTime();
			var iDateTo = oEvent.getParameter("to").getTime();

			var iDatePeroid = Math.round((iDateTo - iDateFrom) / (1000 * 60 * 60 * 24));
			if (iDatePeroid > 20) {
				//popup
				sap.m.MessageBox.warning(
					oResourceBundle.getText("datePeroidTooLongWarningText")

				);

				var oDateFrom = oEvent.getParameter("from");
				var oDate20Days = new Date(oEvent.getParameter("from"));
				oDate20Days.setDate(oDateFrom.getDate() + 19);
				oDatePeroid.setDateValue(oDateFrom);
				oDatePeroid.setSecondDateValue(oDate20Days);
			}

		};

		/**
		 * Event handler  for changing the mode of the chartcontainer.
		 * change the mode property
		 * @param {sap.ui.base.Event} oEvent chartcontainer.
		 * @public
		 */

		this.onTableChartSelect = function(oEvent) {
			var sKey = oEvent.getParameters().selectedItemId;
			//	var oModel = this.getModel("objectView");
			if (sKey.indexOf("contactAnalysisTable") !== -1) {
				oViewModel.setProperty("/isChartView", false);
				oViewModel.setProperty("/isTableView", true);
				//	this.byId("vmForContactAnalyTable").setVisible(true);

			} else {
				oViewModel.setProperty("/isChartView", true);
				oViewModel.setProperty("/isTableView", false);
				this.byId("sortButton").setVisible(false);

			}

		};

		/**
		 * Event handler  for updating the data of the table
		 * @public
		 */

		this.onUpdateFinished = function() {
			oContactAnalyTable.setBusy(false);
			_fnGetContactsNum(oTypeSelect.getSelectedKey());
		};

	};
	return BaseController.extend("hpa.cei.digital_account.controller.ContactAnaly", new ContactAnaly());

});