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
	var InteractionAnaly = function() {
		var oController = null;
		var sAccountId = "";
		//var oIntAnalyTable;
		var aInteractionTypes = [];
		var oIntAnalyBar;
		var oIntAnalyLine;
		var oIntAnalyBarPopover;
		var oIntAnalyLinePopover;
		var oChartContainer;
		var oBarAxisFeed;
		var oLineAxisFeed;
		var sAccountType = "";
		//var oIntAnalyDataset;
		//	var aLineAxisFeeds;
		//		var oMeasureSelect;
		var oResourceBundle;
		var oDatePeroid;
		this.formatter = formatter;
		var oObjectView;
		//	var oChartContainer;
		// var oViewModel = new JSONModel({
		// 	busy: true,
		// 	tableBusyDelay: 0,
		// 	isChartView: false,
		// 	isTableView: true

		// });

		var oIntAnalyCountModel = new JSONModel({
			IntAnalySum: []

		});

		var oIntAnalyDateModel = new JSONModel({
			DaInteractionAnalys: [{}]

		});

		var oInteractionTypeModel = new JSONModel({
			IntType: []

		});

		var _addZeroToNullValue = function(aDateRange, aIntAnalyData, aSelectedInteractionType) {
			var aZeroAddedData = [];

			var iaDateRangeLength = aDateRange.length;
			var iaITLength = aSelectedInteractionType.length;
			//          console.log(new Date().getTime());
			for (var i = 0; i < iaDateRangeLength; i++) {
				var dDate = aDateRange[i];
				for (var j = 0; j < iaITLength; j++) {
					var oInteractionType = aSelectedInteractionType[j];

					var oZeroData = {};
					oZeroData.InteractionType = oInteractionType.InteractionTypeCode;
					oZeroData.InteractionTypeName = oInteractionType.InteractionTypeDescription.replace(/(^\s*)/g, "");
					oZeroData.InteractionUTCDate = dDate;
					oZeroData.NumberOfInteractionContacts = 0;
					oZeroData.NumberOfInteractions = 0;
					aZeroAddedData.push(oZeroData);

				}

			}

			var aConcatData = aZeroAddedData.concat(aIntAnalyData);
			var aMergedData = [];
			aConcatData.forEach(function(sourceRow) {

				if (!aMergedData.some(function(row) {
						return (row.InteractionUTCDate.getDate() === sourceRow.InteractionUTCDate.getDate() && row.InteractionUTCDate.getMonth() ===
							sourceRow.InteractionUTCDate.getMonth() && row.InteractionType === sourceRow.InteractionType);
					})) {
					aMergedData.push(sourceRow);
				} else {
					var targetRow = aMergedData.filter(function(targetRow) {
						return (targetRow.InteractionUTCDate.getDate() === sourceRow.InteractionUTCDate.getDate() && targetRow.InteractionUTCDate.getMonth() ===
							sourceRow.InteractionUTCDate.getMonth() && targetRow.InteractionType === sourceRow.InteractionType);
					})[0];

					targetRow.NumberOfInteractionContacts = Number(sourceRow.NumberOfInteractionContacts) + Number(targetRow.NumberOfInteractionContacts);
					targetRow.NumberOfInteractions = Number(sourceRow.NumberOfInteractions) + Number(targetRow.NumberOfInteractions);
				}
			});

			return aMergedData;

			// 			var fnFilterAnalyData = function(dDate, oInteractionType) {
			// 				return function(oAnalyData) {
			// 	//					console.log("filter function" + new Date().getTime());
			// 					var iMinusTime = 0;

			// 						var dFormatDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
			// 							pattern: "yyyyMMdd"
			// 						}).parse(oAnalyData.InteractionUTCDate);
			// 						var iTZOffsetMs = dDate.getTimezoneOffset() * 60 * 1000;
			// 						iMinusTime = new Date(dFormatDate).getTime() - dDate.getTime() - iTZOffsetMs;
			// 						if (iMinusTime > -1000 && iMinusTime < 1000 && oAnalyData.InteractionType === oInteractionType.InteractionTypeCode) {
			// 							return true;
			// 						}

			// //						console.log("filter function end" + new Date().getTime());
			// 				};
			// 			};
			// 			var iaDateRangeLength = aDateRange.length;
			// 			var iaITLength = aSelectedInteractionType.length;
			//   //          console.log(new Date().getTime());
			// 			for (var i = 0; i < iaDateRangeLength; i++) {
			// 				var dDate = aDateRange[i];
			// 				for (var j = 0; j < iaITLength; j++) {
			// 					var oInteractionType = aSelectedInteractionType[j];

			// 					var aCheckData = aIntAnalyData.filter(fnFilterAnalyData(dDate, oInteractionType));
			// 					if (aCheckData === undefined || aCheckData === null || aCheckData.length === 0) {
			// 						var oZeroData = {};
			// 						oZeroData.InteractionType = oInteractionType.InteractionTypeCode;
			// 						oZeroData.InteractionTypeName = oInteractionType.InteractionTypeDescription.replace(/(^\s*)/g, "");
			// 						oZeroData.InteractionUTCDate = dDate;
			// 						oZeroData.NumberOfInteractionContacts = 0;
			// 						oZeroData.NumberOfInteractions = 0;
			// 						aZeroAddedData.push(oZeroData);
			// 					} else {
			// 						var oNoZeroData = jQuery.extend({}, aCheckData[0]);
			// 						oNoZeroData.InteractionTypeName = oInteractionType.InteractionTypeDescription.replace(/(^\s*)/g, "");
			// 						oNoZeroData.InteractionUTCDate = dDate;
			// 						//	aCheckData[0].InteractionUTCDate = dDate;
			// 						aZeroAddedData.push(oNoZeroData);
			// 					}

			// 				}

			// 			}
			//			console.log(new Date().getTime());

			// for(var i =0;i<zeroAddedData.length;i++){
			// 	var oDate = zeroAddedData[i].InteractionUTCDate;
			// 	if(oDate instanceof Date){

			// 	}else{
			// 			zeroAddedData[i].InteractionUTCDate = new Date(oDate.substr(6,13)*1);
			// 	}

			// }

			//		return aZeroAddedData;

		};

		/**
		 * get Bar Chart Data according to the filter of interaction types and all the data from backend
		 * and count the count of the contact/interactions
		 * @function
		 * @param {array} aInteractionType the chosen interactiontype you choose.
		 * @param {array} aIntAnalyData the backend data of the interaction/contact
		 * @private
		 */

		var _fnGetBarChartData = function(aInteractionType, aIntAnalyData) {
			var aIntAnalySum = [];

			//var fnFilterData = ;
			var fnReduceData = function(oSum, oAnalyData) {
				return {
					IntTypeCode: oAnalyData.InteractionType,
					IntTypeDesc: oAnalyData.InteractionTypeName,
					NumberOfInteractionContacts: Number(oSum.NumberOfInteractionContacts) + Number(oAnalyData.NumberOfInteractionContacts),
					NumberOfInteractions: Number(oSum.NumberOfInteractions) + Number(oAnalyData.NumberOfInteractions)
				};
			};

			// var fnFilterData = function(oAnalyData,sInteractonTypeCode) {
			// 		if (oAnalyData.InteractionTypeCode === sInteractonTypeCode) {
			// 			return true;
			// 		}
			// };

			var fnFilterData = function(aInsideIntAnalyData, sInteractionTypeCode) {
				return aInsideIntAnalyData.filter(function(oAnalyData) {
					if (oAnalyData.InteractionType === sInteractionTypeCode) {
						return true;
					}
				});
			};

			for (var i = 0; i < aInteractionType.length; i++) {

				var aFilterTypeData = fnFilterData(aIntAnalyData, aInteractionType[i].InteractionTypeCode);
				// aIntAnalyData.filter(function(oAnalyData) {
				// 	if (oAnalyData.InteractionTypeCode === aInteractionType[i].InteractionTypeCode) {
				// 		return true;
				// 	}
				// });

				if (aFilterTypeData.length === 1) {
					var oAnalyData = {
						IntTypeCode: aFilterTypeData[0].InteractionType,
						IntTypeDesc: aFilterTypeData[0].InteractionTypeName,
						NumberOfInteractionContacts: aFilterTypeData[0].NumberOfInteractionContacts,
						NumberOfInteractions: aFilterTypeData[0].NumberOfInteractions
					};
					aIntAnalySum.push(oAnalyData);
				} else if (aFilterTypeData.length > 1) {

					var oIntAnalySum = aFilterTypeData.reduce(fnReduceData);
					aIntAnalySum.push(oIntAnalySum);

				}
			}
			if (aIntAnalySum.length === 0) {
				aIntAnalySum = [{}];
			}
			return aIntAnalySum;
		};

		/**
		 * get Line Chart Data according to the filter of interaction types and date period
		 * and will call the barchart data get function
		 * @function
		 * @param {Date} dDateFrom from date from filter.
		 * @param {Date} dDateTo to date from filter
		 * @param {Array} aInteractionType interaction type from filter
		 * @private
		 */

		var _fnFilterChart = function(dDateFrom, dDateTo, aInteractionType) {
			//get the offset of the current timezone and adjust to the standard GMT.
			oChartContainer.setBusy(true);
			oIntAnalyBar.setBusy(true);
			oIntAnalyLine.setBusy(true);
			var dAdjDateFrom = formatter.adjustDate(dDateFrom, true);
			var dAdjDateTo = formatter.adjustDate(dDateTo, true);
			var sAdjDateFrom = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH%3Amm%3Ass"
			}).format(dAdjDateFrom);
			var sAdjDateTo = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH%3Amm%3Ass"
			}).format(dAdjDateTo);

			// dDateFrom.setHours(0);
			// dDateFrom.setMinutes(0);
			// dDateFrom.setSeconds(0);
			// dDateTo.setHours(0);
			// dDateTo.setMinutes(0);
			// dDateTo.setSeconds(0);
			// var iTZOffsetMs = dDateFrom.getTimezoneOffset() * 60 * 1000;
			//  var dAdjDateFrom= new Date(dDateFrom.getTime() - iTZOffsetMs);
			// var dAdjDateTo = new Date(dDateTo.getTime() - iTZOffsetMs);

			var aIaTypeFilters = [];

			for (var i = 0; i < aInteractionType.length; i++) {
				var oITFilter = new Filter("InteractionType", FilterOperator.EQ, aInteractionType[i].InteractionTypeCode);
				aIaTypeFilters.push(oITFilter);
			}

			var oIatypeFilter = new Filter({
				filters: aIaTypeFilters,
				and: false
			});

			var oDAFilter = new Filter("DigitalAccountUUID", FilterOperator.EQ, sAccountId);

			//	var aTableFilters = [new Filter("InteractionUTCDate", FilterOperator.BT, dAdjDateFrom, dAdjDateTo)];
			var aTableFilters = [];
			if (aIaTypeFilters.length > 0) {
				aTableFilters.push(oIatypeFilter);
			}
			aTableFilters.push(oDAFilter);

			var oTableFilter = new sap.ui.model.Filter({
				filters: aTableFilters,
				and: true
			});

			//	oIntAnalyLine.getDataset().getBinding("data").filter(oTableFilter, "Application");

			if (sAccountId) {
				//	sAccountId = new Guid().parseValue(sAccountId,"string");

				var sPath = "/C_MKT_DGTLACCTINTACTNQ(P_EndDate=datetime'" + sAdjDateTo + "',P_StartDate=datetime'" + sAdjDateFrom + "')/Results";
				oController.getOwnerComponent().getModel().read(sPath, {
					urlParameters: {
						"$select": "InteractionType,InteractionTypeName,InteractionUTCDate,NumberOfInteractions,NumberOfInteractionContacts"
					},
					filters: [oTableFilter],
					success: function(oResult) {
						oIntAnalyCountModel.setProperty("/IntAnalySum", _fnGetBarChartData(aInteractionType, oResult.results));

						//  fnCreateLineChartTemplate(aInteractionType);
						if (oResult.results.length > 0) {
							var iDateRange = Math.round((dAdjDateTo.getTime() - dAdjDateFrom.getTime()) / (1000 * 60 * 60 * 24));
							var aDateRange = [];
							for (var j = 0; j <= iDateRange; j++) {
								var dateEle = new Date(dAdjDateFrom);
								dateEle.setDate(dAdjDateFrom.getDate() + j);
								aDateRange.push(dateEle);
							}
							var aFormatedResult = [];
							for (var i = 0; i < oResult.results.length; i++) {
								var oFormatedResult = oResult.results[i];
								var dDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "yyyyMMdd"
								}).parse(oFormatedResult.InteractionUTCDate);
								var iTZOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;

								oFormatedResult.InteractionUTCDate = new Date(new Date(dDate).getTime() - iTZOffsetMs);
								aFormatedResult.push(oFormatedResult);
							}

							var addedZeroData = _addZeroToNullValue(aDateRange, aFormatedResult, aInteractionType);

							oIntAnalyDateModel.setProperty("/DaInteractionAnalys", addedZeroData);
						} else {
							oIntAnalyDateModel.setProperty("/DaInteractionAnalys", [{}]);
						}
						oIntAnalyLine.setBusy(false);
						oIntAnalyBar.setBusy(false);
						oChartContainer.setBusy(false);
						//		oController.getView().setBusy(false);
						oObjectView.setBusy(false);
					}.bind(this),
					error: function(oError) {
						oIntAnalyLine.setBusy(false);
						oIntAnalyBar.setBusy(false);
						oChartContainer.setBusy(false);
						//	oController.getView().setBusy(false);
						if (oObjectView) {
							oObjectView.setBusy(false);
						}
					}.bind(this)

				});
			}

			//	oIntAnalyBar.getDataset().getBinding("data").filter(oTableFilter, "Application");
			//	oIntAnalyBar.setBusy(false);
			//	getContactsNum(oTypeSelect.getSelectedKey());
		};

		// var oIntAnalyModel = new JSONModel({
		// 	InteractionAnaly: []

		// });

		// var fnGetInteractionNums = function() {

		// };

		/**
		 * Called when the interactionanaly controller is instantiated.
		 * @public
		 */

		this.onInit = function() {
			oController = this;
			//oController.getOwnerComponent().getModel().setRefreshAfterChange(false);
			oController.getOwnerComponent().getRouter("object")
				.attachRouteMatched(this._onObjectMatched); //	oIntAnalyTable = this.byId("memberAnalysisTable");
			//		oChartContainer = this.byId("barChartContainer");
			oIntAnalyBar = this.byId("intAnalyBar");
			oIntAnalyLine = this.byId("intAnalyLine");
			oBarAxisFeed = this.byId("valueAxisFeed");
			oLineAxisFeed = this.byId("lineValueAxisId");
			oChartContainer = this.byId("barChartContainer");
			oResourceBundle = this.getResourceBundle();
			this.byId("valueAxisFeed").setValues([oResourceBundle.getText("interactionCountMeasure")]);
			this.byId("categoryAxisFeed").setValues([oResourceBundle.getText("typeDimension")]);
			this.byId("lineValueAxisId").setValues([oResourceBundle.getText("interactionCountMeasure")]);
			this.byId("lineCategoryAxisFeed").setValues([oResourceBundle.getText("dateDimension")]);
			this.byId("lineColor").setValues(["inttype"]);

			oIntAnalyBarPopover = new sap.viz.ui5.controls.Popover();
			oIntAnalyLinePopover = new sap.viz.ui5.controls.Popover();
			//			oMeasureSelect = this.byId("measureSelect");
			//		oIntAnalyDataset = oIntAnalyLine.getDataset();
			oIntAnalyBar.setModel(oIntAnalyCountModel, "intAnalyCountModel");
			oIntAnalyLine.setModel(oIntAnalyDateModel, "intAnalyDateModel");
			oDatePeroid = sap.ui.getCore().byId("contactFilterDatePeroidDate");

			//	oIntAnalyLine.setModel(oIntAnalyDateModel,"intAnalyDateCountModel");
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.InteractionAnalyFilter", this);
				this.getView().addDependent(
					this._oFilterDialog);
				this._oFilterDialog.setModel(oInteractionTypeModel, "intTypeModel");
				oDatePeroid = sap.ui.getCore().byId("intFilterDatePeroidDate");

				///filter
				// Set initial and reset value for Slider in custom control

			}
		};
		
			this.filterZero = function(	aDateRange, aIntAnalyData, aSelectedInteractionType){
			
			return _addZeroToNullValue(	aDateRange, aIntAnalyData, aSelectedInteractionType);
		};
		
		this.getBarData = function(aInteractionType, aIntAnalyData){
			return _fnGetBarChartData(aInteractionType, aIntAnalyData);
		};
		/**
		 * Called when the interactionanaly controller is destroyed.
		 * @public
		 */
		this.onExit = function() {
			if (this._oFilterDialog) {
				this.getView().removeDependent(
					this._oFilterDialog);
				this._oFilterDialog.destroy();
				this._oFilterDialog = null;
			}
		};

		/**
		 * Event handler  for pressing the filter button of the chartcontainer.
		 * open the filter dialog.
		 * @public
		 */

		this.onFilter = function() {

			//		this._oDialog.setModel(this.getView().getModel());
			// toggle compact style
			//		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oFilterDialog.open();
		};

		this.fnInitType = function(sTypeKey, oObjView) {
			sAccountType = sTypeKey;
			oObjectView = oObjView;
			var dNowDate = new Date();
			//	var dBefore6Date = new Date();

			//	dBefore6Date.setDate(dNowDate.getDate() - 30);

			//var dNowDate = new Date();
			var dBefore30Date = new Date();

			dBefore30Date.setDate(dNowDate.getDate() - 30);
			sap.ui.getCore().byId("intFilterDatePeroidDate").setDateValue(dBefore30Date);
			sap.ui.getCore().byId("intFilterDatePeroidDate").setSecondDateValue(dNowDate);

			var oIntTypeFilter = sap.ui.getCore().byId("intTypeFilter");
			for (var i = 0; i < oIntTypeFilter.getItems().length; i++) {
				var oIntTypeFilterItem = oIntTypeFilter.getItems()[i];
				oIntTypeFilterItem.setSelected(true);
			}

			var oAccountTypeFilter = [new Filter("Type", FilterOperator.EQ, sAccountType)];

			oController.getOwnerComponent().getModel().read("/InteractionTypes", {
				filters: oAccountTypeFilter,

				success: function(oResult) {
					aInteractionTypes = oResult.results;
					// var aIntTypes = [];

					// for(var i=0;i<aInteractionTypes.length;i++){
					// 	var oIntType = {};
					// 	oIntType.InteractionTypeCode = aInteractionTypes[i].InteractionTypeCode;
					// 	oIntType.InteractionTypeDescription = aInteractionTypes[i].InteractionTypeDescription;
					// 	aIntTypes.push(oIntType);
					// }
					oInteractionTypeModel.setProperty("/IntType", aInteractionTypes);

					// oIntAnalyCountModel.setProperty("/IntAnalySum",fnGetBarChartData(aInteractionType,oResult));

				},
				error: function(oError) {

				}

			});
		};

		/**
		 * filter the interaction data with the type.
		 * called by object when object controller is initialized.
		 * @param {String} sTypeKey: passed by object page.
		 * @private
		 */

		this.fnInitIntAnaly = function() {
			//this.getView().setBusy(true);
			//	oObjectView.setBusy(true);
			oIntAnalyCountModel.setData([]);
			oIntAnalyDateModel.setData([]);

			oChartContainer.setBusyIndicatorDelay(5);
			oChartContainer.setBusy(true);
			var dBeforeDate = sap.ui.getCore().byId("intFilterDatePeroidDate").getDateValue();
			var dAfterDate = sap.ui.getCore().byId("intFilterDatePeroidDate").getSecondDateValue();
			var aSelectedInteractionTypes = [];
			var oIntTypeFilter = sap.ui.getCore().byId("intTypeFilter");
			for (var i = 0; i < oIntTypeFilter.getItems().length; i++) {
				var oIntTypeFilterItem = oIntTypeFilter.getItems()[i];
				if (oIntTypeFilterItem.getSelected() === true) {
					var oIntTypeItem = {};
					oIntTypeItem.InteractionTypeCode = oIntTypeFilterItem.getKey();
					oIntTypeItem.InteractionTypeDescription = oIntTypeFilterItem.getText();
					aSelectedInteractionTypes.push(oIntTypeItem);
				}
			}

			// var aIntTypes = [];
			_fnFilterChart(dBeforeDate, dAfterDate, aSelectedInteractionTypes);
			// for(var i=0;i<aInteractionTypes.length;i++){
			// 	var oIntType = {};
			// 	oIntType.InteractionTypeCode = aInteractionTypes[i].InteractionTypeCode;
			// 	oIntType.InteractionTypeDescription = aInteractionTypes[i].InteractionTypeDescription;
			// 	aIntTypes.push(oIntType);
			// }

		};

		/**
		 * Event handler  for changing the date period value .
		 * check whether date period is larger then one year.
		 * if so ,make it one year.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 */

		this.onDateChange = function(oEvent) {
			//if the period>20 days,popup message.

			var iDateFrom = oEvent.getParameter("from").getTime();
			var iDateTo = oEvent.getParameter("to").getTime();

			var iDatePeroid = Math.round((iDateTo - iDateFrom) / (1000 * 60 * 60 * 24));
			if (iDatePeroid > 30) {
				//popup
				sap.m.MessageBox.warning(
					oResourceBundle.getText("datePeroidTooLongWarningText")

				);

				var oDateFrom = oEvent.getParameter("from");
				var oDate20Days = new Date(oEvent.getParameter("from"));
				oDate20Days.setDate(oDateFrom.getDate() + 29);
				oDatePeroid.setDateValue(oDateFrom);
				oDatePeroid.setSecondDateValue(oDate20Days);
			}

		};

		/**
		 * after initalize the controller match the digital account key.
		 * @function
		 * @param {sap.ui.base.Event} oEvent route of the app.
		 * @private
		 */

		this._onObjectMatched = function(oEvent) {
			sAccountId = oEvent.getParameter("arguments").objectId;

			if (sAccountId !== undefined) {

				//			var sMeasureSelectedKey = oMeasureSelect.getSelectedKey();
				//         oBarAxisFeed.setValues([sMeasureSelectedKey]);
				oIntAnalyBarPopover.connect(oIntAnalyBar.getVizUid());
				oIntAnalyLinePopover.connect(oIntAnalyLine.getVizUid());
				oIntAnalyBar.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: true,
							positon: "outside"
						},
						dataPointSize: {
							max: 60
						}
					},
					valueAxis: {

						title: {
							visible: true
						}
					},

					general: {
						groupData: true
					},
					categoryAxis: {
						title: {
							visible: true
						}
					},
					title: {
						visible: false

					}
				});

				oIntAnalyLine.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: true,
							positon: "outside",
							hideWhenOverlap: true
						},
						dataPointSize: {
							max: 60
						}
					},
					valueAxis: {

						title: {
							visible: true
						}
					},

					general: {
						groupData: true
					},
					categoryAxis: {
						title: {
							visible: true
						}
					},
					title: {
						visible: false

					}
				});

			}

		};

		/**
		 * Event handler  for pressing the confirm button of the filter dialog.
		 * filter the data.
		 * @param {sap.ui.base.Event} oEvent the button's press event
		 * @public
		 * 
		 */
		this.onFilterConfirm = function(oEvent) {
			var dBeginDate = sap.ui.getCore().byId("intFilterDatePeroidDate").getDateValue();

			var iDateFrom = sap.ui.getCore().byId("intFilterDatePeroidDate").getDateValue().getTime();
			var iDateTo = sap.ui.getCore().byId("intFilterDatePeroidDate").getSecondDateValue().getTime();
			var iDatePeroid = Math.round((iDateTo - iDateFrom) / (1000 * 60 * 60 * 24));
			if (iDatePeroid > 30) {
				//popup
				sap.m.MessageBox.warning(
					oResourceBundle.getText("datePeroidTooLongWarningText")

				);

				var oDateFrom = dBeginDate;
				var oDate20Days = new Date(dBeginDate);
				oDate20Days.setDate(oDateFrom.getDate() + 29);
				sap.ui.getCore().byId("intFilterDatePeroidDate").setDateValue(oDateFrom);
				sap.ui.getCore().byId("intFilterDatePeroidDate").setSecondDateValue(oDate20Days);
			}
			var dEndDate = sap.ui.getCore().byId("intFilterDatePeroidDate").getSecondDateValue();
			var aFilterItems = oEvent.getParameters().filterItems;
			var aIaTypes = [];
			if (aFilterItems.length === 0) {
				aInteractionTypes = [];
				_fnFilterChart(dBeginDate, dEndDate, aInteractionTypes);
			} else {

				for (var i = 0; i < aFilterItems.length; i++) {
					var aIaType = {};
					aIaType.InteractionTypeCode = aFilterItems[i].getKey();
					aIaType.InteractionTypeDescription = aFilterItems[i].getText();

					aIaTypes.push(aIaType);
				}
				//aInteractionTypes = aIaTypes;
				//	var aIaTypes = sap.ui.getCore().byId("intFilterIntTypeComboBox").getSelectedKeys();

				_fnFilterChart(dBeginDate, dEndDate, aIaTypes);
			}
			//	this._oFilterDialog.close();

		};
		/**
		 * Event handler  for pressing the cancel button of the filter dialog.
		 * @public
		 * 
		 */
		this.onFilterCancel = function() {
			this._oFilterDialog.close();
		};

		this.fnRemoveCreateDialog = function() {
			if (this._oFilterDialog) {
				this.getView().removeDependent(
					this._oFilterDialog);
				this._oFilterDialog.destroy();
				this._oFilterDialog = null;
			}
		};
		/**
		 * Event handler  for select the measure.
		 * change the measure and filter the data.
		 * @param {sap.ui.base.Event} oEvent the Select's value
		 * @public
		 * 
		 */
		this.onHandleMeasureChange = function(oEvent) {
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			oIntAnalyBar.removeFeed(oBarAxisFeed);
			oBarAxisFeed.setValues([sSelectedKey]);
			oIntAnalyBar.addFeed(oBarAxisFeed);
			oIntAnalyLine.removeFeed(oLineAxisFeed);
			oLineAxisFeed.setValues([sSelectedKey]);
			oIntAnalyLine.addFeed(oLineAxisFeed);

		};

	};
	return BaseController.extend("hpa.cei.digital_account.controller.InteractionAnaly", new InteractionAnaly());

});