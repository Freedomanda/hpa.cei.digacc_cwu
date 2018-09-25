sap.ui.define([
	"hpa/cei/digital_account/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"hpa/cei/digital_account/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment",
	"sap/m/TablePersoController"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter, Fragment, TablePersoController) {
	"use strict";

	var ShakeNearbyAnaly = function() {
		var iLevel = 1; //determine the drill down level for barchart;
		var iTableLevel = 1; //determine the drill down level for tablechart.
		var oController;
		var oResourceBundle;
		var oShakeAnalyBar;
		var oShakeAnalyLine;
		var oShakeAnalyBarPopover;
		var oShakeAnalyLinePopover;
		var oDimensionSelect;
		var oChartContainer;
		var oBarAxisFeed, oLineAxisFeed;
		var oBreadCrumbContainer;
		var oBreadCrumbTableContainer;
		//	var oFilterBar;
		var oDateFilter;
		var sChartDim, sChartEntity;
		var oObjectView;
		//	var sTableEntity;

		var oTopFilter;
		var sChartContent;
		var sPreviousId;
		var sPreviousDesc;
		var oShakeTable;
		var sDimensionTxtForBar;
		var navLocation = {},
			navContent = {};
		var dFilterBeginDate, dFilterEndDate, aFilterLocationList = [],
			aFilterContentList = [],
			sFilterTop;

		var oLocationListFilterModel = new sap.ui.model.json.JSONModel({
			LocationList: []

		});

		var oContentListFilterModel = new sap.ui.model.json.JSONModel({

			ContentList: []
		});
		// first page Location or Content
		var oShakeTableControl = {
			first: "Location"
		};

		var oShakeAnalyModel = new JSONModel({
			ShakeCountData: []

		});

		var oShakeAnalyDateModel = new JSONModel({
			shakeDateAnalys: [{}]

		});

		var oShakeControlModel = new JSONModel({
			canEditFilter: true,
			canSeeDimChart: true,
			canEditDimChart: true,
			canSeeDimTable: false,
			canEditDimTable: true,
			canSeeBreadChart: true,
			canSeeBreadTable: false,
			showButton: true,
			sDimensionTitle: "",
			sMeasureTitle: "",
			icon: "sap-icon://horizontal-bar-chart"
		});

		var oShakeTableModel = new JSONModel({});

		var oShakeTableControlModel = new JSONModel({
			location: true,
			beacon: false,
			content: false,
			contentBeacon: false,
			contentLocation: false,
			columnListItemType: "Navigation"
		});

		var oLevelFilterStatus = {};

		var sAccountId;

		this.formatter = formatter;
		//	var that = this;

		/**
		 * to modify the UI control(breadcrumb,filter,select) after drilldown action.
		 * determined by iLevel
		 * @function
		 * @param {string} sViewType chart type(bar,line,table).
		 * @param {string} sLevel2Txt text for level2 of the breadcrumb
		 * @param {string} sLevel3Txt text for level3 of the breadcrumb
		 * @private
		 */
		var _drillDownUIControl = function(sViewType, sLevel2Txt, sLevel3Txt) {
			var sLevel1Txt = "";
			var oChangeContent = oChartContainer.getContent()[0];
			var iSepLevel = iLevel;
			var oSepCrumbContainer = oBreadCrumbContainer;

			//  var sContentTitle = oResourceBundle.getText("locationList");

			if (sViewType === "Pie") {

				oChangeContent.setIcon("sap-icon://pie-chart");
				oChangeContent.setTitle(oResourceBundle.getText("pieChartTitle"));
				oChartContainer.removeContent(oChartContainer.getContent()[0]);
				oChartContainer.insertContent(oChangeContent, 0);
				if (oDimensionSelect.getSelectedItem() !== null) {
					sLevel1Txt = oDimensionSelect.getSelectedItem().getText();
					iSepLevel = iLevel;
				}

			} else if (sViewType === "Bar" && sChartContent === "Bar") {
				oChangeContent.setIcon("sap-icon://horizontal-bar-chart");
				oChangeContent.setTitle(oResourceBundle.getText("barChartTitle"));
				oChartContainer.removeContent(oChartContainer.getContent()[0]);
				oChartContainer.insertContent(oChangeContent, 0);
				if (oDimensionSelect.getSelectedItem() !== null) {
					sLevel1Txt = oDimensionSelect.getSelectedItem().getText();
					iSepLevel = iLevel;
				}
			} else if (sViewType === "Table") {
				iSepLevel = iTableLevel;
				oSepCrumbContainer = oBreadCrumbTableContainer;
				if (oShakeTableControl.first === "Location") {
					sLevel1Txt = oResourceBundle.getText("locationList");
				} else if (oShakeTableControl.first === "Content") {
					sLevel1Txt = oResourceBundle.getText("contentList");
				}
			} else {

				//if (iLevel === 1) {
				//		oShakeBreadCrumbModel.setProperty("/level0Visible", false);
				oShakeControlModel.setProperty("/canEditFilter", true);

				oShakeControlModel.setProperty("/showButton", true);
				return;
				//}

			}

			oSepCrumbContainer.setVisible(true);

			if (iSepLevel === 1) {
				oSepCrumbContainer.destroyItems();

				oShakeControlModel.setProperty("/canEditFilter", true);

				oShakeControlModel.setProperty("/showButton", true);
				oShakeControlModel.setProperty("/icon", "sap-icon://horizontal-bar-chart");

			} else if (iSepLevel === 2) {

				oSepCrumbContainer.destroyItems();

				oShakeControlModel.setProperty("/canEditFilter", false);

				oShakeControlModel.setProperty("/showButton", false);
				oShakeControlModel.setProperty("/icon", "sap-icon://horizontal-bar-chart");

				var oBreadLink1 = new sap.m.Link({
					text: sLevel1Txt,
					press: oController.onPressBCLevel1
				});
				var oBC = new sap.m.Breadcrumbs({
					currentLocationText: sLevel2Txt
				});
				oBC.addLink(oBreadLink1);
				oSepCrumbContainer.addItem(oBC);

			} else if (iSepLevel === 3) {

				oSepCrumbContainer.destroyItems();
				oShakeControlModel.setProperty("/canEditFilter", false);
				oShakeControlModel.setProperty("/showButton", false);

				var oBreadLink1L3 = new sap.m.Link({
					text: sLevel1Txt,
					press: oController.onPressBCLevel1
				});
				//		oBreadCrumb.addLink(oBreadLink1);

				var oBreadLink2L3 = new sap.m.Link({
					text: sLevel2Txt,
					press: oController.onPressBCLevel2
				});
				//	oBreadCrumb.addLink(oBreadLink2);

				var oBCL3 = new sap.m.Breadcrumbs({
					currentLocationText: sLevel3Txt
				});
				oBCL3.addLink(oBreadLink1L3);
				oBCL3.addLink(oBreadLink2L3);
				oSepCrumbContainer.addItem(oBCL3);
				//	oShakeAnalyBar.setVizType("pie");
			}

		};

		/**
		 * to reset the filter list.
		 * 
		 * @function
		 * @param {int} iSetLevel the new level of the filter.
		 * @private
		 */

		var _resetFilterList = function(iSetLevel) {

			aFilterLocationList = [];
			aFilterContentList = [];

			var oFilterStatusByLevel = oLevelFilterStatus[iSetLevel + sChartContent];

			if (oFilterStatusByLevel !== undefined) {

				for (var i = 0; i < oFilterStatusByLevel.LocationList.length; i++) {
					if (oFilterStatusByLevel.LocationList[i].Selected === true) {

						aFilterLocationList.push(oFilterStatusByLevel.LocationList[i].LocationKey);
					}
				}
				for (var j = 0; j < oFilterStatusByLevel.ContentList.length; j++) {
					if (oFilterStatusByLevel.ContentList[j].Selected === true) {

						aFilterContentList.push(oFilterStatusByLevel.ContentList[j].ContentId);
					}
				}
			}

		};

		/**
		 * to refresh the filter:location and content.
		 * 
		 * @function
		 * @param {string} aLocationList if drilldown, the location of the previous one.
		 * @param {string} aContentList if drilldown,the content of the previous one
		 * @param {string} iLevelMinus to determine whether it's drill down or drill up.
		 * if drill down, the filter will reduce, if drill up, the filter will restore to the previous status.
		 * @private
		 */

		var _refreshFilter = function(aLocationList, aContentList, iLevelMinus) {

			if (iLevelMinus !== 0) {
				if (oController._oFilterDialog) {
					oController.getView().removeDependent(
						oController._oFilterDialog);
					oController._oFilterDialog.destroy();
					oController._oFilterDialog = null;
					oController._oFilterDialog = sap.ui.xmlfragment("shakeAnalyFilter_frag", "hpa.cei.digital_account.view.fragments.ShakeAnalyFilter",
						oController);
					oController.getView().addDependent(
						oController._oFilterDialog);
					oController._oFilterDialog.setModel(oLocationListFilterModel, "locationListFilterModel");
					oController._oFilterDialog.setModel(oContentListFilterModel, "contentListFilterModel");
					//		this._oFilterDialog.setModel(oShakeControlModel, "shakeControlView");
					oDateFilter = Fragment.byId("shakeAnalyFilter_frag", "shakeNearbyDateRange");
					oTopFilter = Fragment.byId("shakeAnalyFilter_frag", "shakeNearbyTop");
					oDateFilter.setDateValue(dFilterBeginDate);
					oDateFilter.setSecondDateValue(dFilterEndDate);
					oTopFilter.setValue(sFilterTop);

				}

			}

			if (iLevelMinus > 0) {

				//			var oLocFilterItem = sap.ui.getCore().byId("shakeLocationFilter");
				//oLocFilterItem.destroyItems();

				var aFilteredLocationList = oLocationListFilterModel.getProperty("/LocationList").filter(function(oLocationData) {
					for (var i = 0; i < aLocationList.length; i++) {
						var sLocationKey = aLocationList[i];
						if (oLocationData.LocationKey === sLocationKey) {
							return true;
						}
					}
				});

				oLocationListFilterModel.setProperty("/LocationList", aFilteredLocationList);

				// for(var i =0;i<aFilteredLocationList.length;i++){
				// 	var oLocItem = sap.m.ViewSettingsItem({
				// 		key:aFilteredLocationList[i].LocationKey,
				// 		text:aFilteredLocationList[i].LocationName,
				// 		selected:aFilteredLocationList[i].Selected

				// 	});

				// 	oLocFilterItem.addItem(oLocItem);
				//	}

				var aFilteredContentList = oContentListFilterModel.getProperty("/ContentList").filter(function(oContentData) {
					for (var i = 0; i < aContentList.length; i++) {
						var sContentKey = aContentList[i];
						if (oContentData.ContentId === sContentKey) {
							return true;
						}
					}
				});

				oContentListFilterModel.setProperty("/ContentList", aFilteredContentList);
			} else if (iLevelMinus < 0) {

				// if (oController._oFilterDialog) {
				// 	oController.getView().removeDependent(
				// 		oController._oFilterDialog);
				// 	oController._oFilterDialog.destroy();
				// 	oController._oFilterDialog = null;
				// 	oController._oFilterDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.ShakeAnalyFilter", oController);
				// 	oController.getView().addDependent(
				// 		oController._oFilterDialog);
				// 	oController._oFilterDialog.setModel(oLocationListFilterModel, "locationListFilterModel");
				// 	oController._oFilterDialog.setModel(oContentListFilterModel, "contentListFilterModel");
				// 	//		this._oFilterDialog.setModel(oShakeControlModel, "shakeControlView");
				// 	oDateFilter = sap.ui.getCore().byId("shakeNearbyDateRange");
				// 	oTopFilter = sap.ui.getCore().byId("shakeNearbyTop");
				// 	oDateFilter.setDateValue(dFilterBeginDate);
				// 	oDateFilter.setSecondDateValue(dFilterEndDate);
				// 	oTopFilter.setValue(sFilterTop);

				// }

				// if (oController._oFilterDialog) {
				// 	oController.getView().removeDependent(
				// 		oController._oFilterDialog);
				// 	oController._oFilterDialog.destroy();
				// 	oController._oFilterDialog = null;
				// 	oController._oFilterDialog = sap.ui.xmlfragment("hpa.cei.digital_account.view.fragments.ShakeAnalyFilter", oController);
				// 	oController.getView().addDependent(
				// 		oController._oFilterDialog);
				// 	oController._oFilterDialog.setModel(oLocationListFilterModel, "locationListFilterModel");
				// 	oController._oFilterDialog.setModel(oContentListFilterModel, "contentListFilterModel");
				// 	//		this._oFilterDialog.setModel(oShakeControlModel, "shakeControlView");
				// 	oDateFilter = sap.ui.getCore().byId("shakeNearbyDateRange");
				// 	oTopFilter = sap.ui.getCore().byId("shakeNearbyTop");
				// 	oDateFilter.setDateValue(dFilterBeginDate);
				// 	oDateFilter.setSecondDateValue(dFilterEndDate);
				// 	oTopFilter.setValue(sFilterTop);

				// }

				var iSepLevel = iLevel;
				if (sChartContent === "Table") {
					iSepLevel = iTableLevel;
				} else if (sChartContent === "Line") {
					iSepLevel = 1;
				}
				_resetFilterList(iSepLevel);
				var oFilterStatusByLevel = oLevelFilterStatus[iSepLevel + sChartContent];
				if (oFilterStatusByLevel !== undefined) {

					oLocationListFilterModel.setProperty("/LocationList", oFilterStatusByLevel.LocationList);
					oContentListFilterModel.setProperty("/ContentList", oFilterStatusByLevel.ContentList);
				}

			}

		};

		/**
		 * to save the filter:location and content.
		 * 
		 * @function
		 * @param {int} iLevelMinus to see if it is drill down or level up.
		 * @param {int} iNewLevel the new level
		 * @param {string} sViewType the view type of the drill down (check if it is pie chart).
		 *
		 * @private
		 */

		var _saveFilter = function(iLevelMinus, iNewLevel, sViewType) {
			var aNowLocationList = oLocationListFilterModel.getProperty("/LocationList");
			var aNowContentList = oContentListFilterModel.getProperty("/ContentList");
			oLevelFilterStatus = oController.addNewFilters(iLevelMinus, iNewLevel, sViewType,aNowLocationList,aNowContentList,oLevelFilterStatus);

			// if (iLevelMinus >= 0) {

				
			// 	var aNewLocationList = [];
			// 	for (var i = 0; i < aNowLocationList.length; i++) {
			// 		var oNewLocation = {};
			// 		oNewLocation.LocationKey = aNowLocationList[i].LocationKey;
			// 		oNewLocation.LocationName = aNowLocationList[i].LocationName;
			// 		oNewLocation.Selected = aNowLocationList[i].Selected;
			// 		aNewLocationList.push(oNewLocation);
			// 	}

				
			// 	var aNewContentList = [];
			// 	for (var j = 0; j < aNowContentList.length; j++) {
			// 		var oNewContent = {};
			// 		oNewContent.ContentId = aNowContentList[j].ContentId;
			// 		oNewContent.ContentName = aNowContentList[j].ContentName;
			// 		oNewContent.Selected = aNowContentList[j].Selected;
			// 		aNewContentList.push(oNewContent);
			// 	}

			// 	if (sViewType !== "Pie") {

			// 		oLevelFilterStatus[iNewLevel + sViewType] = {
			// 			LocationList: aNewLocationList,
			// 			ContentList: aNewContentList
			// 		};
			// 	} else {
			// 		oLevelFilterStatus[iNewLevel + "Bar"] = {
			// 			LocationList: aNewLocationList,
			// 			ContentList: aNewContentList
			// 		};
			// 	}

			// }

		};
		
		
		this.addNewFilters = function(iLevelMinus, iNewLevel, sViewType,aOldLocationList,aOldContentList,oFilterStatus){
			if (iLevelMinus >= 0) {

				var aNowLocationList = aOldLocationList;
				var aNewLocationList = [];
				for (var i = 0; i < aNowLocationList.length; i++) {
					var oNewLocation = {};
					oNewLocation.LocationKey = aNowLocationList[i].LocationKey;
					oNewLocation.LocationName = aNowLocationList[i].LocationName;
					oNewLocation.Selected = aNowLocationList[i].Selected;
					aNewLocationList.push(oNewLocation);
				}

				var aNowContentList = aOldContentList;
				var aNewContentList = [];
				for (var j = 0; j < aNowContentList.length; j++) {
					var oNewContent = {};
					oNewContent.ContentId = aNowContentList[j].ContentId;
					oNewContent.ContentName = aNowContentList[j].ContentName;
					oNewContent.Selected = aNowContentList[j].Selected;
					aNewContentList.push(oNewContent);
				}

				if (sViewType !== "Pie") {

					oFilterStatus[iNewLevel + sViewType] = {
						LocationList: aNewLocationList,
						ContentList: aNewContentList
					};
				} else {
					oFilterStatus[iNewLevel + "Bar"] = {
						LocationList: aNewLocationList,
						ContentList: aNewContentList
					};
				}

			}
			return oFilterStatus;
			
			
		};
		/**
		 * to set the chart property of the bar/line chart after  action.
		 * @function
		 * @param {string} sDimTitle dimension title of the chart.
		 * @param {string} sMeasureTitle measure title of the chart
		 * @private
		 */

		var _setChartProperty = function(sDimTitle, sMeasureTitle) {
			oShakeAnalyBar.setVizProperties({
				interaction: {
					selectability: {
						mode: "exclusive"
					}
				},

				plotArea: {
					dataLabel: {
						visible: true,
						positon: "outside"
					},
					dataPointSize: {
						max: 60
					}
				},

				general: {
					groupData: true
				},
				categoryAxis: {
					title: {
						visible: true,
						text: sDimTitle

					}
				},
				title: {
					visible: false

				}
			});

			oShakeAnalyLine.setVizProperties({
				interaction: {
					selectability: {
						mode: "exclusive"
					}
				},
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

				general: {
					groupData: true
				},
				title: {
					visible: false

				}
			});

		};

		/**
		 * to change the table content after  action(change the column,etc...)
		 * 
		 * @function
		 * @param {string} sTableType tabletype(location,beacon,content).
		 * @private
		 */

		var _changeTableContent = function(sTableType) {
			oShakeTableControlModel.setProperty("/contentBeacon", false);
			oShakeTableControlModel.setProperty("/contentLocation", false);
			if (sTableType === "beacon") {
				oShakeTableControlModel.setProperty("/location", false);
				oShakeTableControlModel.setProperty("/content", false);
				oShakeTableControlModel.setProperty("/beacon", true);
				oShakeControlModel.setProperty("/canEditDimTable", false);
				if (oShakeTableControl.first === "Content") {
					oShakeTableControlModel.setProperty("/columnListItemType", "Inactive");
				} else {
					oShakeTableControlModel.setProperty("/columnListItemType", "Navigation");
				}

			} else if (sTableType === "location") {
				oShakeTableControlModel.setProperty("/content", false);
				oShakeTableControlModel.setProperty("/beacon", false);
				oShakeTableControlModel.setProperty("/location", true);
				oShakeTableControlModel.setProperty("/columnListItemType", "Navigation");
				if (oShakeTableControl.first === "Location") {
					oShakeControlModel.setProperty("/canEditDimTable", true);
				} else {
					oShakeControlModel.setProperty("/canEditDimTable", false);
				}

				//	oShakeTable.setBusy(true);
			} else if (sTableType === "content") {
				oShakeTableControlModel.setProperty("/location", false);
				oShakeTableControlModel.setProperty("/beacon", false);
				oShakeTableControlModel.setProperty("/content", true);
				if (oShakeTableControl.first === "Content") {
					oShakeControlModel.setProperty("/canEditDimTable", true);
					oShakeTableControlModel.setProperty("/contentLocation", true);
					oShakeTableControlModel.setProperty("/columnListItemType", "Navigation");
				} else {
					oShakeControlModel.setProperty("/canEditDimTable", false);
					oShakeTableControlModel.setProperty("/contentBeacon", true);
					oShakeTableControlModel.setProperty("/columnListItemType", "Inactive");
				}
				//	oShakeTable.setBusy(true);
			}
		};

		var _produceProperty = function(dAdjDateFrom, dAdjDateTo, aLocationList, aContentList, sDimen, sViewType, sEntity, sBeaconKey) {
			var sTimeZone = formatter.getUTC(dAdjDateFrom);
			// var dAdjDateFrom = new Date(dFilterBeginDate.getTime() - iTZOffsetMs);
			// var dAdjDateTo = new Date(dFilterEndDate.getTime() - iTZOffsetMs);
			var oDateFilters = new Filter("Date", FilterOperator.BT, dAdjDateFrom, dAdjDateTo);
			var oTypeFilters = new Filter("ViewType", FilterOperator.EQ, sViewType.toUpperCase());
			var oTimeZoneFilters = new Filter("Timezone", FilterOperator.EQ, sTimeZone);
			var oAccountFilters = new Filter("DigitalAccountKey", FilterOperator.EQ, sAccountId);
			var sEntityName = "";
			var sMeasureTxt = "";

			var aLocationsFilters = [];
			var aContentsFilters = [];

			for (var i = 0; i < aLocationList.length; i++) {
				var sLocationKey;
				if (typeof(aLocationList[i]) === "string") {
					sLocationKey = aLocationList[i];
				} else {
					sLocationKey = aLocationList[i].getKey();
				}
				var oLocFilter = new Filter("LocationKey", FilterOperator.EQ, sLocationKey);
				aLocationsFilters.push(oLocFilter);

			}
			var oLocationsFilter = new Filter({
				filters: aLocationsFilters,
				and: false
			});

			if (aContentList.length > 1 || aContentList[0] !== "") {
				var sContentKey;
				for (var j = 0; j < aContentList.length; j++) {
					if (typeof(aContentList[j]) === "string") {
						sContentKey = aContentList[j];
					} else {
						sContentKey = aContentList[j].getKey();
					}
					var oConFilter = new Filter("ContentKey", FilterOperator.EQ, sContentKey);
					aContentsFilters.push(oConFilter);

				}
			}

			var oContentsFilter = new Filter({
				filters: aContentsFilters,
				and: false
			});

			var aShakeFilters = [oDateFilters, oTypeFilters, oTimeZoneFilters];

			if (aLocationsFilters.length > 0) {
				aShakeFilters.push(oLocationsFilter);
			}
			if (aContentsFilters.length > 0) {
				aShakeFilters.push(oContentsFilter);
			}
			if (sBeaconKey) {
				var oBeaconFilter = new Filter("BeaconId", FilterOperator.EQ, sBeaconKey);
				aShakeFilters.push(oBeaconFilter);
			}

			var sPath = "/" + sEntity;

			if (sEntity !== "IBeaconAnalysis") {

				sPath = "/DigitalAccounts('" + sAccountId + "')/" + sEntity;

			} else {
				aShakeFilters.push(oAccountFilters);
			}
			var oShakeFilter = new sap.ui.model.Filter({
				filters: aShakeFilters,
				and: true
			});
			var sDescProp = "";
			var sIdProp = "";

			var sCountProp = "";
			var oStatSorter;
			if (sDimen === "Count") {
				sCountProp = "IAStatistics";
				if (oResourceBundle) {
					sMeasureTxt = oResourceBundle.getText("shakeMeasure");
				}

				oStatSorter = new Sorter("IAStatistics", true);
			} else {
				sCountProp = "ICStatistics";
				if (oResourceBundle) {
					sMeasureTxt = oResourceBundle.getText("uniqueShakeMeasure");
				}
				oStatSorter = new Sorter("ICStatistics", true);
			}

			if (sEntity === "DigitalAccountLocationAnalysis") {
				sDescProp = "LocationName";
				sIdProp = "LocationKey";
				if (oResourceBundle) {
					sDimensionTxtForBar = oResourceBundle.getText("locationDimension");
				}
				sEntityName = "location";

			} else if (sEntity === "IBeaconAnalysis") {
				sDescProp = "BeaconDescription";
				sIdProp = "BeaconID";
				if (oResourceBundle) {
					sDimensionTxtForBar = oResourceBundle.getText("beaconDimension");
				}
				sEntityName = "beacon";
			} else if (sEntity === "DigitalAccountContentAnalysis") {
				if (oResourceBundle) {
					sDimensionTxtForBar = oResourceBundle.getText("contentDimension");
				}
				//	if (sViewType === "Bar" || sViewType === "Line") {

				sDescProp = "ContentTitle";
				sIdProp = "ContentKey";
				sEntityName = "content";

				//	} else if (sViewType === "Pie") {

				//	}
			}
			return {
				entityName: sEntityName,
				path: sPath,
				measureTxt: sMeasureTxt,
				shakeFilter: oShakeFilter,
				descProp: sDescProp,
				idProp: sIdProp,
				countProp: sCountProp,
				statSorter: oStatSorter

			};

		};

		/**
		 * main function to get the data of the chart and table after every action.
		 * @function
		 * @param {array} aLocationList location id list array.
		 * @param {array} aContentList content id list array.
		 * @param {string} sDimen dimension of the data(count,person)
		 * @param {string} sViewType view type of the chart.(line,bar,table)
		 * @param {string} sEntity which entityset odata should read.(DigitalAccountLocationAnalysis,IBeaconAnalysis,DigitalAccountContentAnalysis)
		 * @param {string} sBeaconKey beacon id value for filter.
		 * @param (Object) oLevelText including the level2text and level3text for breadcrumb.
		 * @param {int} iNewLevel the new level after drill down.
		 * @private
		 */

		var _filterChartData = function(aLocationList, aContentList, sDimen, sViewType, sEntity, sBeaconKey, iNewLevel, oLevelText) {
			if (aLocationList.length === 0 || aContentList.length === 0) {
				oShakeAnalyDateModel.setProperty("/shakeDateAnalys", []);
				oShakeAnalyModel.setProperty("/ShakeCountData", []);
				oShakeTableModel.setData([]);
				return [];
			}

			oShakeAnalyBar.setBusy(true);
			oShakeAnalyLine.setBusy(true);
			oChartContainer.setBusy(true);
			oShakeTable.setBusy(true);
			oObjectView.setBusy(true);

			var dAdjDateFrom = formatter.adjustDate(dFilterBeginDate, true);
			var dAdjDateTo = formatter.adjustDate(dFilterEndDate, false);
			// dFilterBeginDate.setHours(0);
			// dFilterBeginDate.setMinutes(0);
			// dFilterBeginDate.setSeconds(0);
			// dFilterEndDate.setHours(23);
			// dFilterEndDate.setMinutes(59);
			// dFilterEndDate.setSeconds(59);
			//	var iTZOffsetMs = dFilterBeginDate.getTimezoneOffset() * 60 * 1000;
			// var sTimeZone = "UTC";
			// var iTimeZone = 0 - (dFilterBeginDate.getTimezoneOffset() / 60);
			// if (iTimeZone > 0) {
			// 	sTimeZone = "UTC+" + iTimeZone;
			// } else if (iTimeZone < 0) {
			// 	sTimeZone = "UTC" + iTimeZone;

			// }
			var oProperty = _produceProperty(dAdjDateFrom, dAdjDateTo, aLocationList, aContentList, sDimen, sViewType, sEntity, sBeaconKey);

			// oShakeAnalyBar.getDataset().getDimensions()[0].setName(sDimensionTxtForBar);
			// oShakeAnalyBar.getFeeds()[1].setValues([sDimensionTxtForBar]);

			oController.getOwnerComponent().getModel().read(oProperty.path, {
				filters: [oProperty.shakeFilter],
				sorters: [oProperty.statSorter],
				urlParameters: {
					$top: sFilterTop
				},
				success: jQuery
					.proxy(function(oResult) {

							var aBarAnalyData = [];
							var aLineAnalyData = [];
							var aLocationResults = [];
							var aContentResults = [];

							for (var k = 0; k < oResult.results.length; k++) {

								var oShakeData = oResult.results[k];

								aLocationResults.push(oShakeData[oProperty.idProp]);
								aContentResults.push(oShakeData[oProperty.idProp]);

								if (sViewType === "Bar" || sViewType === "Pie") {
									var oBarAnalyData = {};
									//	if(sDimen === "Count"){
									oBarAnalyData.LocationDesc = oShakeData[oProperty.descProp];
									oBarAnalyData.LocationId = oShakeData[oProperty.idProp];
									oBarAnalyData.Count = oShakeData[oProperty.countProp];
									aBarAnalyData.push(oBarAnalyData);

									//	oBarAnalyData.Person = 

									//		}
								} else if (sViewType === "Line") {
									var oLineAnalyData = {};
									oLineAnalyData.Date = oShakeData.Date;
									oLineAnalyData.LocationDescription = oShakeData[oProperty.descProp];
									oLineAnalyData.LocationId = oShakeData[oProperty.idProp];
									oLineAnalyData.Count = oShakeData[oProperty.countProp];
									aLineAnalyData.push(oLineAnalyData);

								}

							}
							var iLevelMinus = 0;
							if (sViewType === "Bar" || sViewType === "Pie") {
								iLevelMinus = iNewLevel - iLevel;
								iLevel = iNewLevel;
								if (aBarAnalyData.length === 0) {
									aBarAnalyData = [];
								}
								if (sViewType === "Pie") {
									oShakeAnalyBar.setVizType("pie");
								} else {
									oShakeAnalyBar.setVizType("bar");
								}
								oShakeAnalyModel.setProperty("/ShakeCountData", aBarAnalyData);
								_setChartProperty(sDimensionTxtForBar, oProperty.measureTxt);

							} else if (sViewType === "Line") {
								//iLevelMinus = iNewLevel - iLevel;
								//iLevel = iNewLevel;
								if (aLineAnalyData.length === 0) {
									aLineAnalyData = [];
								}
								oShakeAnalyDateModel.setProperty("/shakeDateAnalys", aLineAnalyData);
								_setChartProperty(sDimensionTxtForBar, oProperty.measureTxt);

							} else if (sViewType === "Table") {
								iLevelMinus = iNewLevel - iTableLevel;
								iTableLevel = iNewLevel;

								oResult.results.forEach(function(result) {
									if (result.LocationKey) {
										result.LocationUrl = "#MarketingLocation-maintain&/Locations/" + result.LocationKey;
									}
								});
								oShakeTableModel.setData(oResult.results);
								_changeTableContent(oProperty.entityName);
							}
							oShakeAnalyBar.setBusy(false);
							oShakeAnalyLine.setBusy(false);
							oShakeTable.setBusy(false);
							//	oIntAnalyLine.setBusy(false);
							//	oIntAnalyBar.setBusy(false);
							oChartContainer.setBusy(false);
							oObjectView.setBusy(false);
							//	var iFilterLevel = 0;
							//	if (iNewLevel) {
							//	iFilterLevel = iNewLevel;

							// if (sViewType === "Table") {

							// } else {

							// }
							//	} else {
							// if (sViewType === "Table") {
							// 	iFilterLevel = iTableLevel;
							// } else {
							// 	iFilterLevel = iLevel;
							// }
							//		}

							if (oLevelText !== undefined) {
								_drillDownUIControl(sViewType, oLevelText.level2Txt, oLevelText.level3Txt);
							}
							if (sEntity === "DigitalAccountLocationAnalysis") {
								_refreshFilter(aLocationResults, aContentList, iLevelMinus);
							} else if (sEntity === "DigitalAccountContentAnalysis") {
								_refreshFilter(aLocationList, aContentResults, iLevelMinus);
							} else {
								_refreshFilter(aLocationList, aContentList, iLevelMinus);
							}

							_saveFilter(iLevelMinus, iNewLevel, sViewType);

						},
						this),
				error: function(oError) {
					oShakeAnalyBar.setBusy(false);
					oShakeAnalyLine.setBusy(false);
					//	oIntAnalyLine.setBusy(false);
					//	oIntAnalyBar.setBusy(false);
					oChartContainer.setBusy(false);
					oShakeTable.setBusy(false);
					oObjectView.setBusy(false);
				}

			});

		};

		/**
		 * to update the table's breadcrumb after drill down.
		 *
		 * @function
		 * @param {int} level the new level after drill down 
		 * @param {object} data including the location/beacon description.
		 * @return {object} oLevelText text for level(2,3)
		 * @private
		 */
		var _getTableLevelText = function(level, data) {
			var
				sLevel2Txt = "",
				sLevel3Txt = "";
			//	iTableLevel = level;
			if (level > 2) {

				if (oShakeTableControl.first === "Location") {
					if (data.beacon) {
						sLevel3Txt = oResourceBundle.getText("contentListOfBeacon", data.beacon.beaconDescription);
					}
				} else {
					if (data.location) {
						sLevel3Txt = oResourceBundle.getText("beaconListOfLocation", data.location.locationName);
					}
				}
			}
			if (level > 1) {
				// if (oShakeTableControl.first === "Location") {
				// 	sLevel1Txt = oResourceBundle.getText("locationList");
				// } else if (oShakeTableControl.first === "Content") {
				// 	sLevel1Txt = oResourceBundle.getText("contentList");
				// }
				if (oShakeTableControl.first === "Location") {
					if (data.location) {
						sLevel2Txt = oResourceBundle.getText("beaconListOfLocation", data.location.locationName);
					}
				} else if (oShakeTableControl.first === "Content") {
					if (data.content) {
						sLevel2Txt = oResourceBundle.getText("locationListOfContent", data.content.contentTitle);
					}
				}

			}
			var oLevelText = {
				level2Txt: sLevel2Txt,
				level3Txt: sLevel3Txt
			};
			return oLevelText;

		};

		/**
		 * to get the table data after drill down or any action
		 *
		 * @function
		 * @param {string} sEntityName dimension name(content,location)
		 * @private
		 */

		var _getListData = function(sEntityName) {
			var sTableDim = "";
			var sTableEntity = "";
			if (sEntityName === "content") {

				sTableEntity = "DigitalAccountContentAnalysis";
			} else if (sEntityName === "location") {
				sTableEntity = "DigitalAccountLocationAnalysis";
			}
			var oLevelText = _getTableLevelText(1);

			if (dFilterBeginDate && dFilterEndDate) {
				_filterChartData(aFilterLocationList, aFilterContentList, sTableDim, "Table",
					sTableEntity, "", 1, oLevelText);
				//	_onTableContentChange(sEntityName);

			}
		};

		/**
		 * initialize the filter 
		 * called when change the filter content/change the chart type/initialize the view
		 *
		 * @function
		 * @private
		 */

		var _initializeFilter = function(bIsAll) {
			var iNewLevel = 1;
			var oLevelText = {
				level2Txt: "",
				level3Txt: ""
			};
			var sDimensionKey = oDimensionSelect.getSelectedKey();

			if (sDimensionKey === "countbyLoc" || sDimensionKey === "") {
				sChartDim = "Count";
				sChartEntity = "DigitalAccountLocationAnalysis";

			} else if (sDimensionKey === "personByLoc") {
				sChartDim = "Person";
				sChartEntity = "DigitalAccountLocationAnalysis";

			} else if (sDimensionKey === "countByCon") {
				sChartDim = "Count";
				sChartEntity = "DigitalAccountContentAnalysis";

			} else {
				sChartDim = "Person";
				sChartEntity = "DigitalAccountContentAnalysis";
			}
			if (bIsAll) {
				// if (oShakeTableControl.first === "Location") {
				// 	_listNavigation("location");
				// } else if (oShakeTableControl.first === "Content") {
				// 	_listNavigation("content");
				// }
				if (dFilterBeginDate && dFilterEndDate) {
					_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, "Bar", sChartEntity,
						"", iLevel, oLevelText);
					_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, "Line", sChartEntity,
						"", iLevel, oLevelText);
					_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, "Table", sChartEntity,
						"", iTableLevel, oLevelText);
				}

			} else {

				_resetFilterList(1);

				if (sChartContent === "Table") {
					if (oShakeTableControl.first === "Location") {
						_getListData("location");
					} else if (oShakeTableControl.first === "Content") {
						_getListData("content");
					}
				} else if (sChartContent === "Bar") {

					if (dFilterBeginDate && dFilterEndDate) {

						_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, "Bar", sChartEntity,
							"", iNewLevel, oLevelText);
					}
					//_drillDownUIControl("Bar", "", "");
				} else {
					if (dFilterBeginDate && dFilterEndDate) {
						_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, sChartContent,
							sChartEntity, "", iNewLevel, oLevelText);
					}
				}
			}
		};

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
			oShakeAnalyBar = this.byId("shakeAnalyBar");
			oShakeAnalyLine = this.byId("shakeAnalyLine");
			oBreadCrumbContainer = this.byId("breadCrumbContainer");
			oBreadCrumbTableContainer = this.byId("breadCrumbTableContainer");
			oBarAxisFeed = this.byId("valueAxisFeed");
			oLineAxisFeed = this.byId("lineValueAxisId");
			oChartContainer = this.byId("shakeAnalyChart");
			oDimensionSelect = this.byId("dimensionSelect");
			oShakeAnalyBarPopover = new sap.viz.ui5.controls.Popover();
			oShakeAnalyLinePopover = new sap.viz.ui5.controls.Popover();
			oResourceBundle = this.getResourceBundle();
			this.byId("valueAxisFeed").setValues([oResourceBundle.getText("shakeMeasure")]);
			this.byId("categoryAxisFeed").setValues([oResourceBundle.getText("locationDimension")]);
			this.byId("lineValueAxisId").setValues([oResourceBundle.getText("shakeMeasure")]);
			this.byId("lineCategoryAxisFeed").setValues([oResourceBundle.getText("dateDimension")]);
			this.byId("lineColor").setValues([oResourceBundle.getText("locationDimension")]);
			//	oFilterBar = this.byId("shakeNearbyFilterBar");
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("shakeAnalyFilter_frag", "hpa.cei.digital_account.view.fragments.ShakeAnalyFilter", this);
				this.getView().addDependent(
					this._oFilterDialog);
				this._oFilterDialog.setModel(oLocationListFilterModel, "locationListFilterModel");
				this._oFilterDialog.setModel(oContentListFilterModel, "contentListFilterModel");
				//		this._oFilterDialog.setModel(oShakeControlModel, "shakeControlView");
				oDateFilter = Fragment.byId("shakeAnalyFilter_frag", "shakeNearbyDateRange");
				oTopFilter = Fragment.byId("shakeAnalyFilter_frag", "shakeNearbyTop");
				///filter
			}

			oShakeAnalyBar.setModel(oShakeAnalyModel, "shakeAnalyModel");
			oShakeAnalyLine.setModel(oShakeAnalyDateModel, "shakeAnalyDateModel");
			//	oFilterBar.setModel(oShakeControlModel, "shakeControlView");
			oChartContainer.setModel(oShakeControlModel, "shakeControlView");
			this.setModel(oShakeControlModel, "shakeControlView");
			// oIntAnalyLine.setModel(oIntAnalyDateModel, "intAnalyDateModel");
			// oDatePeroid = sap.ui.getCore().byId("contactFilterDatePeroidDate");

			sChartContent = "Bar";
			//	this._registerVariantManagement();
			//		oFilterBar.fireInitialise();

			// set the data for the model
			oShakeTableModel.setData([]);

			oShakeTable = this.byId("shakeTable");
			oShakeTable.setModel(oShakeTableModel);

			this.setModel(oShakeTableControlModel, "shakeTableControl");
			var dNowDate = new Date();
			var dBefore30Date = new Date();
			iLevel = 1;
			iTableLevel = 1;
			dBefore30Date.setDate(dNowDate.getDate() - 30);
			oDateFilter.setDateValue(dBefore30Date);
			oDateFilter.setSecondDateValue(dNowDate);
			dFilterBeginDate = dBefore30Date;
			dFilterEndDate = dNowDate;
			oTopFilter.setValue("10");
			sFilterTop = "10";

			// var oPersId = {
			// 	container: "ShakeNearbyAnalysis",
			// 	item: "shakeTable"
			// };
			// Get a personalization service provider from the shell
			//oTablePersoProvider = sap.ushell.Container.getService("Personalization").getPersonalizer(oPersId);

			// Instantiate a controller connecting your table and the persistence service
			// oTablePersoController = new TablePersoController({
			// 	table: oShakeTable,
			// 	persoService: oTablePersoProvider
			// }).activate();
		};
		/**
		 * Called when the shakenearbyanaly controller is destroyed.
		 * @public
		 */
		this.onExit = function() {
			//		oBreadCrumb.removeAllLinks();
			//		oBreadCrumb.destroyLinks();
			oShakeAnalyBar.removeAllFeeds();
			oShakeAnalyBar.destroyFeeds();
			oShakeAnalyLine.removeAllFeeds();
			oShakeAnalyLine.destroyFeeds();
			oBarAxisFeed.destroy();
			oLineAxisFeed.destroy();
			if (this._oFilterDialog) {
				this.getView().removeDependent(
					this._oFilterDialog);
				this._oFilterDialog.destroy();
				this._oFilterDialog = null;
			}

		};
		/**
		 * Open the filter dialog
		 * 
		 * @public
		 */
		this.onFilter = function() {
			this._oFilterDialog.open();
		};

		/**
		 * Called when the filter ok button is pressed
		 * @public
		 */

		this.onShakeFilterConfirm = function(oEvent) {
			dFilterBeginDate = oDateFilter.getDateValue();
			dFilterEndDate = oDateFilter.getSecondDateValue();
			aFilterLocationList = [];
			aFilterContentList = [];
			var aFilterItems = oEvent.getParameters().filterItems;
			var iSepLevel = iLevel;
			var sCEntity = sChartEntity;
			for (var i = 0; i < aFilterItems.length; i++) {
				if (aFilterItems[i].getId().indexOf("shakeLocationFilter") !== -1) {
					aFilterLocationList.push(aFilterItems[i].getKey());
				} else {
					aFilterContentList.push(aFilterItems[i].getKey());
				}
			}

			//			aFilterLocationList = oLocationFilter.getTokens();
			//			aFilterContentList = oContentFilter.getTokens();
			sFilterTop = oTopFilter.getValue();
			if (sChartContent === "Table") {
				oShakeControlModel.setProperty("/canSeeDimTable", true);
				oShakeControlModel.setProperty("/canSeeDimChart", false);
				oShakeControlModel.setProperty("/canSeeBreadTable", true);
				oShakeControlModel.setProperty("/canSeeBreadChart", false);
				iSepLevel = iTableLevel;

				if (oShakeTableControl.first === "Content") {
					sCEntity = "DigitalAccountContentAnalysis";
				} else {
					sCEntity = "DigitalAccountLocationAnalysis";
				}
				// _updateTableBreadcrumbs(1);
				// _listNavigation("location");
			} else if (sChartContent === "Bar") {
				oShakeControlModel.setProperty("/canSeeDimChart", true);
				oShakeControlModel.setProperty("/canSeeDimTable", false);
				oShakeControlModel.setProperty("/canSeeBreadChart", true);
				oShakeControlModel.setProperty("/canSeeBreadTable", false);
			}

			//_initializeFilter(false);
			if (sChartContent === "Bar" && iLevel === 3) {

				_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, "Pie",
					sChartEntity, "", iSepLevel);
			} else {
				_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, sChartContent,
					sCEntity, "", iSepLevel);
			}
			//				this._filterChartData(dDateFrom,dDateTo,aLocationList,aContentList,sTop,sDim,"Line",sEntity,"");
			//	this._filterChartData(dDateFrom, dDateTo, aLocationList, aContentList, sTop, sDim, "Table", sEntity, "");

		};

		/**
		 * Called when change the chart measure select.
		 * @param {sap.ui.base.Event} oEvent event of the select.
		 * @public
		 * 
		 */

		this.onHandleMeasureChange = function(oEvent) {
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();

			var sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyLocFilterTop");
			var sTopFilterPlaceHolderTxt = oResourceBundle.getText("shakeNearbyFilterTopLocPlaceholder");
			var sMeasureTxt = oResourceBundle.getText("shakeMeasure");
			//	var oTopFilter = sap.ui.getCore().byId("ShakeTopFilter");
			if (sSelectedKey === "countbyLoc" || sSelectedKey === "") {
				sChartDim = "Count";
				sChartEntity = "DigitalAccountLocationAnalysis";
				sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyLocFilterTop");
				sTopFilterPlaceHolderTxt = oResourceBundle.getText("shakeNearbyFilterTopLocPlaceholder");
				sMeasureTxt = oResourceBundle.getText("shakeMeasure");

			} else if (sSelectedKey === "personByLoc") {
				sChartDim = "Person";
				sChartEntity = "DigitalAccountLocationAnalysis";
				sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyLocFilterTop");
				sMeasureTxt = oResourceBundle.getText("uniqueShakeMeasure");
				sTopFilterPlaceHolderTxt = oResourceBundle.getText("shakeNearbyFilterTopLocPlaceholder");
				//	oShakeAnalyBar.getDataset().getMeasures()[0].setName("uniqueShakeMeasure");

			} else if (sSelectedKey === "countByCon") {
				sChartDim = "Count";
				sChartEntity = "DigitalAccountContentAnalysis";
				sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyConFilterTop");
				sTopFilterPlaceHolderTxt = oResourceBundle.getText("shakeNearbyFilterTopConPlaceholder");
				sMeasureTxt = oResourceBundle.getText("shakeMeasure");
			} else {
				sChartDim = "Person";
				sChartEntity = "DigitalAccountContentAnalysis";
				sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyConFilterTop");
				sTopFilterPlaceHolderTxt = oResourceBundle.getText("shakeNearbyFilterTopConPlaceholder");
				sMeasureTxt = oResourceBundle.getText("uniqueShakeMeasure");

			}
			Fragment.byId("shakeAnalyFilter_frag", "ShakeTopFilter").setText(sTopFilterLabelTxt);
			Fragment.byId("shakeAnalyFilter_frag", "shakeNearbyTop").setPlaceholder(sTopFilterPlaceHolderTxt);
			oShakeAnalyBar.removeFeed(oBarAxisFeed);
			oBarAxisFeed.setValues([sMeasureTxt]);
			oShakeAnalyBar.addFeed(oBarAxisFeed);
			oShakeAnalyLine.removeFeed(oLineAxisFeed);
			oLineAxisFeed.setValues([sMeasureTxt]);
			oShakeAnalyLine.addFeed(oLineAxisFeed);

			if (dFilterBeginDate && dFilterEndDate) {

				_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, sChartContent,
					sChartEntity, "", iLevel);

			}

		};

		/**
		 * Called when change the table measure select.
		 * @param {sap.ui.base.Event} oEvent event of the select.
		 * @public
		 * 
		 */

		this.onHandleTableMeasureChange = function(oEvent) {
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			var sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyLocFilterTop");

			if (sSelectedKey === "byLocation" || sSelectedKey === "") {
				oShakeTableControl.first = "Location";
				sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyLocFilterTop");

				_getListData("location");
			} else if (sSelectedKey === "byContent") {
				oShakeTableControl.first = "Content";
				sTopFilterLabelTxt = oResourceBundle.getText("shakeNearbyConFilterTop");
				_getListData("content");
			}
			Fragment.byId("shakeAnalyFilter_frag", "ShakeTopFilter").setText(sTopFilterLabelTxt);
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

				oShakeAnalyBarPopover.connect(oShakeAnalyBar.getVizUid());
				oShakeAnalyLinePopover.connect(oShakeAnalyLine.getVizUid());
				oController.byId("searchField").setValue("");

			}

		};

		/**
		 * Called when change the chart type.
		 * initialize the filter and level
		 * @param {sap.ui.base.Event} oEvent event of the selected content.
		 * @public
		 * 
		 */

		this.onChartContentChange = function(oEvent) {
			var sContentId = oEvent.getSource().getSelectedContent().getId();
			if (sContentId.indexOf("Line") !== -1) {
				sChartContent = "Line";
				oShakeControlModel.setProperty("/canSeeDimChart", true);
				oShakeControlModel.setProperty("/canSeeDimTable", false);
				oShakeControlModel.setProperty("/canSeeBreadChart", false);
				oShakeControlModel.setProperty("/canSeeBreadTable", false);
				oShakeControlModel.setProperty("/canEditFilter", true);
				oBreadCrumbContainer.setVisible(false);
				_refreshFilter([], [], -1);

				var sSelectedKey = oDimensionSelect.getSelectedKey();

				//	var oTopFilter = sap.ui.getCore().byId("ShakeTopFilter");
				if (sSelectedKey === "countbyLoc" || sSelectedKey === "") {
					sChartDim = "Count";
					sChartEntity = "DigitalAccountLocationAnalysis";

				} else if (sSelectedKey === "personByLoc") {
					sChartDim = "Person";
					sChartEntity = "DigitalAccountLocationAnalysis";

					//	oShakeAnalyBar.getDataset().getMeasures()[0].setName("uniqueShakeMeasure");

				} else if (sSelectedKey === "countByCon") {
					sChartDim = "Count";
					sChartEntity = "DigitalAccountContentAnalysis";

				} else {
					sChartDim = "Person";
					sChartEntity = "DigitalAccountContentAnalysis";

				}

				_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, sChartContent,
					sChartEntity, "", 1);
				//		oShakeBreadCrumbModel.setProperty("/level0Visible", false);

			} else if (sContentId.indexOf("Bar") !== -1) {
				sChartContent = "Bar";
				oShakeControlModel.setProperty("/canSeeDimChart", true);
				oShakeControlModel.setProperty("/canSeeDimTable", false);
				oShakeControlModel.setProperty("/canSeeBreadChart", true);
				oShakeControlModel.setProperty("/canSeeBreadTable", false);
				if (iLevel > 1) {
					oShakeControlModel.setProperty("/canEditFilter", false);
				} else {
					oShakeControlModel.setProperty("/canEditFilter", true);
				}
				_refreshFilter([], [], -1);
			} else if (sContentId.indexOf("Table") !== -1) {
				sChartContent = "Table";
				oShakeControlModel.setProperty("/canSeeDimChart", false);
				oShakeControlModel.setProperty("/canSeeDimTable", true);
				oShakeControlModel.setProperty("/canSeeBreadChart", false);
				oShakeControlModel.setProperty("/canSeeBreadTable", true);
				_refreshFilter([], [], -1);
				//_updateTableBreadcrumbs(1);
				//_listNavigation("location");
			}

			//	_initializeFilter();

		};

		this.produceProperty = function(dAdjDateFrom, dAdjDateTo, aLocationList, aContentList, sDimen, sViewType, sEntity, sBeaconKey) {
			return _produceProperty(dAdjDateFrom, dAdjDateTo, aLocationList, aContentList, sDimen, sViewType, sEntity, sBeaconKey);

		};

		this.drillDownFun = function(iLevel, sParentId, sParentTxt, sDimensionKey) {
			var aLocationList = [];
			var aContentList = [];
			var sBeaconId = "";
			var sLevel2Txt = "";
			var sLevel3Txt = "";
			var sViewType = "Bar";
			var iNewLevel;
			if (iLevel === 1) {
				sPreviousId = sParentId;
				sPreviousDesc = sParentTxt;
				iNewLevel = 2;
				if (sDimensionKey === "countbyLoc" || sDimensionKey === "") {
					sChartDim = "Count";
					sChartEntity = "IBeaconAnalysis";
					aLocationList = [sParentId];
					aContentList = aFilterContentList;
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("countByBeaconOf", [sParentTxt]);
					}

				} else if (sDimensionKey === "personByLoc") {
					sChartDim = "Person";
					sChartEntity = "IBeaconAnalysis";
					aLocationList = [sParentId];
					aContentList = aFilterContentList;
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("personByBeaconOf", [sParentTxt]);
					}

				} else if (sDimensionKey === "countByCon") {
					sChartDim = "Count";
					sChartEntity = "DigitalAccountLocationAnalysis";
					aLocationList = aFilterLocationList;
					aContentList = [sParentId];
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("countByLocationOf", [sParentTxt]);
					}

				} else {
					sChartDim = "Person";
					sChartEntity = "DigitalAccountLocationAnalysis";
					aLocationList = aFilterLocationList;
					aContentList = [sParentId];
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("personByLocationOf", [sParentTxt]);
					}
				}

			} else if (iLevel === 2) {
				sViewType = "Pie";
				iNewLevel = 3;

				if (sDimensionKey === "countbyLoc" || sDimensionKey === "") {
					sChartDim = "Count";
					sChartEntity = "DigitalAccountContentAnalysis";
					aLocationList = [sPreviousId];
					aContentList = aFilterContentList;
					sBeaconId = [sParentId];
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("countByBeaconOf", [sPreviousDesc]);
						sLevel3Txt = oResourceBundle.getText("countByContentOf", [sParentTxt]);
					}

				} else if (sDimensionKey === "personByLoc") {
					sChartDim = "Person";
					sChartEntity = "DigitalAccountContentAnalysis";
					aLocationList = [sPreviousId];
					aContentList = aFilterContentList;
					sBeaconId = [sParentId];
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("personByBeaconOf", [sPreviousDesc]);
						sLevel3Txt = oResourceBundle.getText("personByContentOf", [sParentTxt]);
					}

				} else if (sDimensionKey === "countByCon") {
					sChartDim = "Count";
					sChartEntity = "IBeaconAnalysis";
					aLocationList = [sParentId];
					aContentList = [sPreviousId];
					if (oResourceBundle) {
						sLevel2Txt = oResourceBundle.getText("countByLocationOf", [sPreviousDesc]);
						sLevel3Txt = oResourceBundle.getText("countByBeaconOf", [sParentTxt]);
					}

				} else {
					sChartDim = "Person";
					sChartEntity = "IBeaconAnalysis";
					aLocationList = [sParentId];
					aContentList = [sPreviousId];
					if (oResourceBundle) {

						sLevel2Txt = oResourceBundle.getText("personByLocationOf", [sPreviousDesc]);
						sLevel3Txt = oResourceBundle.getText("personByBeaconOf", [sParentTxt]);
					}
				}

			}

			var oLevelText = {
				level2Txt: sLevel2Txt,
				level3Txt: sLevel3Txt
			};
			return {
				locationList: aLocationList,
				contentList: aContentList,
				chartDim: sChartDim,
				beaconId: sBeaconId,
				viewType: sViewType,
				newLevel: iNewLevel,
				levelText: oLevelText

			};

		};

		/**
		 * Called when select the bar data.
		 * display the drill down button.
		 * @param {sap.ui.base.Event} oEvent event of the bar data.
		 * @public
		 * 
		 */

		this.onSelectBarData = function(oEvent) {
			//	var oSelectedData = oEvent.getSource();
			//should decide what the id came from.
			var sDeminsionName = oResourceBundle.getText("locationDimension");

			var sParentId = oEvent.getParameters().data[0].data[sDeminsionName];
			var sParentTxt = oEvent.getParameters().data[0].data[sDeminsionName + ".d"];
			// var dDateFrom = oDateFilter.getDateValue();
			// var dDateTo = oDateFilter.getSecondDateValue();
			var sDimensionKey = oDimensionSelect.getSelectedKey();
			// var sTop = oTopFilter.getValue();

			// var aLocationList = [];
			// var aContentList = [];
			// var sBeaconId = "";
			// var sLevel2Txt = "";
			// var sLevel3Txt = "";
			// var sViewType = "Bar";
			// var iNewLevel;
			var fnDrillDown = function() {
				oShakeAnalyBarPopover.close();
				var oDrillDownResults = this.drillDownFun(iLevel, sParentId, sParentTxt, sDimensionKey);
				if (dFilterBeginDate && dFilterEndDate) {
					_filterChartData(oDrillDownResults.locationList, oDrillDownResults.contentList, oDrillDownResults.chartDim, oDrillDownResults.viewType,
						sChartEntity,
						oDrillDownResults.beaconId, oDrillDownResults.newLevel, oDrillDownResults.levelText);
				}
				//	_drillDownUIControl("Bar", sLevel2Txt, sLevel3Txt);

			}.bind(this);
			if (iLevel !== 3) {

				oShakeAnalyBarPopover.setActionItems([{
					type: "action",
					text: oResourceBundle.getText("drilldown"),
					press: jQuery
						.proxy(
							fnDrillDown,
							this)

				}]);
			} else {
				oShakeAnalyBarPopover = new sap.viz.ui5.controls.Popover();
			}
			oShakeAnalyBarPopover.connect(oShakeAnalyBar.getVizUid());

		};

		/**
		 * Called when press the breadcrumb level1.
		 * initialize the level
		 * @param {sap.ui.base.Event} oEvent event of the breadcrumb.
		 * @public
		 * 
		 */

		this.onPressBCLevel1 = function(oEvent) {
			_initializeFilter(false);
		};

		/**
		 * Called by object view.
		 * initialize the filter bar and data
		 *  @public
		 * 
		 */
		this.fnFilterBarInit = function(oObj) {
			oObjectView = oObj;
			//   oObjectView.setBusy(true);
			oChartContainer.setBusyIndicatorDelay(5);
			var sLocationPath = "/DigitalAccounts('" + sAccountId + "')/" + "ShakeFilterLocationSet";
			var sContentPath = "/DigitalAccounts('" + sAccountId + "')/" + "ShakeFilterContentSet";
			oDimensionSelect.setSelectedKey("countbyLoc");
			sChartDim = "Count";
			sChartEntity = "DigitalAccountLocationAnalysis";

			oController.getOwnerComponent().getModel().read(sLocationPath, {

				success: function(oResult) {

					oLocationListFilterModel.setProperty("/LocationList", oResult.results);
					//	var aLocationTokens = [];
					for (var i = 0; i < oResult.results.length; i++) {
						var oLocation = oResult.results[i].LocationKey;
						aFilterLocationList.push(oLocation);

						//	var oToken = new sap.m.Token({key: oResult.results[i].LocationKey, text:oResult.results[i].LocationName});
						//	aLocationTokens.push(oToken);
					}

					var oLocationFilter = Fragment.byId("shakeAnalyFilter_frag", "shakeLocationFilter");
					for (var j = 0; j < oLocationFilter.getItems().length; j++) {
						var oLocationFilterItem = oLocationFilter.getItems()[j];
						oLocationFilterItem.setSelected(true);
					}

					oController.getOwnerComponent().getModel().read(sContentPath, {

						success: function(oConResult) {

							oContentListFilterModel.setProperty("/ContentList", oConResult.results);

							for (var i1 = 0; i1 < oConResult.results.length; i1++) {
								var oContent = oConResult.results[i1].ContentId;
								aFilterContentList.push(oContent);
							}

							var oContentFilter = Fragment.byId("shakeAnalyFilter_frag", "shakeContentFilter");
							for (var j1 = 0; j1 < oContentFilter.getItems().length; j1++) {
								var oContentFilterItem = oContentFilter.getItems()[j1];
								oContentFilterItem.setSelected(true);
							}

							_initializeFilter(true);

							//    oContentFilter.setTokens(aContentTokens);

						}

					});

					//  oLocationFilter.setTokens(aLocationTokens);

				}

			});

		};

		this.changeTableContent = function(sTableType, sFirst) {
			oShakeTableControl.first = sFirst;
			_changeTableContent(sTableType);
			return oShakeTableControlModel;
		};

		/**
		 * Called when press the breadcrumb level2.
		 * change back level
		 * @param {sap.ui.base.Event} oEvent event of the breadcrumb.
		 * @public
		 * 
		 */

		this.onPressBCLevel2 = function(oEvent) {

			var iNewLevel = 2;

			_resetFilterList(2);

			//	var oFilterStatusByLevel = oLevelFilterStatus[2 + sChartContent];

			//			if (oFilterStatusByLevel !== undefined) {

			if (sChartContent === "Table") {
				if (oShakeTableControl.first === "Location") {
					oController.drillDownBeacon(navLocation);
				} else if (oShakeTableControl.first === "Content") {
					oController.drillDownLocation(navContent);
				}
			} else if (sChartContent === "Bar") {
				// var dDateFrom = oDateFilter.getDateValue();
				// var dDateTo = oDateFilter.getSecondDateValue();
				var sDimensionKey = oDimensionSelect.getSelectedKey();
				//	var sTop = oTopFilter.getValue();

				//	var aLocationList = [];
				//	var aContentList = [];

				var sLevel2Txt = "";

				if (sDimensionKey === "countbyLoc" || sDimensionKey === "") {
					sChartDim = "Count";
					sChartEntity = "IBeaconAnalysis";
					//	aLocationList = [sPreviousId];
					//	aContentList = aFilterContentList;

					sLevel2Txt = oResourceBundle.getText("countByBeaconOf", [sPreviousDesc]);

				} else if (sDimensionKey === "personByLoc") {
					sChartDim = "Person";
					sChartEntity = "IBeaconAnalysis";
					//	aLocationList = [sPreviousId];
					//	aContentList = aFilterContentList;
					sLevel2Txt = oResourceBundle.getText("personByBeaconOf", [sPreviousDesc]);

				} else if (sDimensionKey === "countByCon") {
					sChartDim = "Count";
					sChartEntity = "DigitalAccountLocationAnalysis";
					//	aLocationList = aFilterLocationList;
					//	aContentList = [sPreviousId];
					sLevel2Txt = oResourceBundle.getText("countByLocationOf", [sPreviousDesc]);

				} else {
					sChartDim = "Person";
					sChartEntity = "DigitalAccountLocationAnalysis";
					//	aLocationList = aFilterLocationList;
					//	aContentList = [sPreviousId];
					sLevel2Txt = oResourceBundle.getText("countByLocationOf", [sPreviousDesc]);
				}

				var oLevelText = {
					level2Txt: sLevel2Txt,
					level3Txt: ""
				};

				//iLevel = 2;
				//_refreshFilter([],[],-1);

				//oContentListFilterModel.setProperty("/ContentList", oFilterStatusByLevel.ContentList);
			}

			if (dFilterBeginDate && dFilterEndDate) {
				_filterChartData(aFilterLocationList, aFilterContentList, sChartDim, "Bar", sChartEntity, "", iNewLevel, oLevelText);
				//	_drillDownUIControl("Bar", sLevel2Txt, "");
			}
			//}
		};

		/**
		 * Called when drill down location of the table.
		 * 
		 * @param {object} location id and desc of the location.
		 * @public
		 * 
		 */
		this.drillDownBeacon = function(location) {
			//var dDateFrom = oDateFilter.getDateValue();
			//var dDateTo = oDateFilter.getSecondDateValue();
			//var sTop = oTopFilter.getValue();
			var sTableDim = "";
			var sTableEntity = "IBeaconAnalysis";

			navLocation = location;
			var oLevelText = {};
			var iReLevel = 1;
			if (oShakeTableControl.first === "Location") {
				oLevelText = _getTableLevelText(2, {
					location: location
				});
				iReLevel = 2;
			} else if (oShakeTableControl.first === "Content") {
				oLevelText = _getTableLevelText(3, {
					location: location,
					content: navContent
				});
				iReLevel = 3;
			}
			if (dFilterBeginDate && dFilterEndDate) {
				_filterChartData([location.locationKey], aFilterContentList, sTableDim, "Table", sTableEntity, "", iReLevel, oLevelText);
			}
			//	_onTableContentChange("beacon", location.locationName);
		};

		/**
		 * Called when drill down form content of the table.
		 * 
		 * @param {object} content id and desc of the location.
		 * @public
		 * 
		 */
		this.drillDownLocation = function(content) {

			// var dDateFrom = oDateFilter.getDateValue();
			// var dDateTo = oDateFilter.getSecondDateValue();
			// var sTop = oTopFilter.getValue();
			var sTableDim = "";
			var sTableEntity = "DigitalAccountLocationAnalysis";

			navContent = content;

			var oLevelText = _getTableLevelText(2, {
				content: content
			});
			if (dFilterBeginDate && dFilterEndDate) {

				_filterChartData(aFilterLocationList, [content.contentKey], sTableDim, "Table", sTableEntity, "", 2, oLevelText);
			}
			//	_onTableContentChange("location", content.contentTitle);
		};

		/**
		 * Called when drill down from beacon of the table.
		 * 
		 * @param {object} beacon id and desc of the beacon.
		 * @public
		 * 
		 */

		this.drillDownContent = function(beacon) {
			// var dDateFrom = oDateFilter.getDateValue();
			// var dDateTo = oDateFilter.getSecondDateValue();
			// var sTop = oTopFilter.getValue();
			var sTableDim = "";
			var sTableEntity = "DigitalAccountContentAnalysis";

			//		navBeacon = beacon;

			var oLevelText = _getTableLevelText(3, {
				location: navLocation,
				beacon: beacon
			});
			if (dFilterBeginDate && dFilterEndDate) {
				_filterChartData([navLocation.locationKey], aFilterContentList, sTableDim, "Table", sTableEntity, beacon.beaconKey, 3, oLevelText);
				//	_onTableContentChange("content", navLocation.locationName, beacon.beaconDescription);
			}
		};

		/**
		 * handle the press event of the location of the table
		 * called by onTableItemPress
		 * @function
		 * @param {sap.ui.base.Event} oEvent event of the press.
		 * @private
		 */
		this.handleLocDrillDownPress = function(oEvent) {
			var sLocKeyPath = oEvent.getSource().getBindingContext().sPath + "/LocationKey",
				sLocNamePath = oEvent.getSource().getBindingContext().sPath + "/LocationName";
			var locationKey = oEvent.getSource().getModel().getProperty(sLocKeyPath),
				locationName = oEvent.getSource().getModel().getProperty(sLocNamePath);

			this.drillDownBeacon({
				locationKey: locationKey,
				locationName: locationName
			});
		};

		/**
		 * handle the press event of the beacon of the table
		 * called by onTableItemPress
		 * @function
		 * @param {sap.ui.base.Event} oEvent event of the press.
		 * @private
		 */

		this.handleBeaconDrillDownPress = function(oEvent) {
			var sBconKeyPath = oEvent.getSource().getBindingContext().sPath + "/BeaconID",
				sBeaconNamePath = oEvent.getSource().getBindingContext().sPath + "/BeaconDescription";
			//		var sLocKeyPath = oEvent.getSource().getBindingContext().sPath + '/LocationKey',
			//			sLocNamePath = oEvent.getSource().getBindingContext().sPath + '/LocationName';
			var beaconKey = oEvent.getSource().getModel().getProperty(sBconKeyPath),
				beaconDescription = oEvent.getSource().getModel().getProperty(sBeaconNamePath);
			//			var locationKey = oEvent.getSource().getModel().getProperty(sLocKeyPath),
			//				locationName = oEvent.getSource().getModel().getProperty(sLocNamePath);

			this.drillDownContent({
				beaconKey: beaconKey,
				beaconDescription: beaconDescription
			});
		};

		/**
		 * handle the press event of the content of the table
		 * called by onTableItemPress
		 * @function
		 * @param {sap.ui.base.Event} oEvent event of the press.
		 * @private
		 */

		this.handlePageDrillDownPress = function(oEvent) {
			if (oShakeTableControl.first === "Location") {
				this.drillDownBeacon(navLocation);
			} else if (oShakeTableControl.first === "Content") {
				var sContentKeyPath = oEvent.getSource().getBindingContext().sPath + "/ContentKey",
					sContentTitlePath = oEvent.getSource().getBindingContext().sPath + "/ContentTitle";
				var contentKey = oEvent.getSource().getModel().getProperty(sContentKeyPath),
					contentTitle = oEvent.getSource().getModel().getProperty(sContentTitlePath);
				this.drillDownLocation({
					contentKey: contentKey,
					contentTitle: contentTitle
				});
			}
		};

		/**
		 * handle the press event  of the table
		 * @function
		 * @param {sap.ui.base.Event} oEvent event of the press.
		 * @private
		 */

		this.onTableItemPress = function(oEvent) {
			var location = oShakeTableControlModel.getProperty("/location");
			var beacon = oShakeTableControlModel.getProperty("/beacon");
			var content = oShakeTableControlModel.getProperty("/content");
			if (location) {
				this.handleLocDrillDownPress(oEvent);
			} else if (beacon) {
				this.handleBeaconDrillDownPress(oEvent);
			} else if (content) {
				this.handlePageDrillDownPress(oEvent);
			}
		};

		/**
		 * Event handler  for pressing the personalize button of the talbe.
		 * open the personalize dialog
		 * @public
		 */
		this.onPersonalize = function() {
			//oTablePersoController.openDialog();
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
					this._oKeywordFilters = [
						new Filter("LocationName", FilterOperator.Contains, sQuery),
						new Filter("LocCountry", FilterOperator.Contains, sQuery),
						new Filter("LocRegion", FilterOperator.Contains, sQuery),
						new Filter("LocCity", FilterOperator.Contains, sQuery)
					];
					this._oKeywordFilters.push(new Filter("BeaconID", FilterOperator.Contains, sQuery));
					this._oKeywordFilters.push(new Filter("BeaconDescription", FilterOperator.Contains, sQuery));
					this._oKeywordFilters.push(new Filter("ContentTitle", FilterOperator.Contains, sQuery));

				} else {
					this._oKeywordFilters = null;
				}
				this.applyFilter();
			}
		};

		/**
		 * Event handler  for refresh data.
		 * 
		 * @public
		 */
		this.onRefresh = function() {
			oShakeTable.getBinding("items").refresh();
		};

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 *
		 * @private
		 */
		this.applyFilter = function() {
			var aFilters = [];

			if (this._oKeywordFilters && this._oKeywordFilters.length > 0) {
				aFilters = this._oKeywordFilters;
			}
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length > 0) {
				var oTableFilter = new sap.ui.model.Filter({
					filters: aFilters,
					and: false
				});
				oShakeTable.getBinding("items").filter(oTableFilter, "Application");
			} else {
				oShakeTable.getBinding("items").filter([], "Application");
			}
		};
	};

	return BaseController.extend("hpa.cei.digital_account.controller.ShakeNearbyAnaly", new ShakeNearbyAnaly());

});