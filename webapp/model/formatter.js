sap.ui.define([
	"sap/ui/core/format/DateFormat"

], function(DateFormat) {
	"use strict";
	
		var oDateTimeFormatter = DateFormat.getDateInstance({
		style: "medium",
		UTC: true
	});

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		formatNumberToPercent: function(sValue) {
			if (isNaN(sValue)) {
				return "0%";
			} else {
				return parseFloat(sValue * 100).toFixed(2).toString() + "%";
			}
		},

		getStatusState: function(sStatus) {
			if (!sStatus) {
				return "None";
			} else if (sStatus === "2") {
				return "Success";
			} else if (sStatus === "3") {
				return "Error";
			} else if (sStatus === "1") {
				return "Warning";
			} else {
				return "None";
			}
		},

		formatDate: function(oDate) {

			if (oDate && oDate instanceof Date) {
			return oDateTimeFormatter.format(oDate);
			} else if (oDate && oDate.indexOf('Date') !== -1) {
				var iEnd = oDate.indexOf(')/');
				var oAdjDate = new Date(oDate.substr(6,iEnd-6)*1);
				return oDateTimeFormatter.format(oAdjDate);
			} else {

				return null;
			}
		},
		adjustDate:function(oDate,bIsBegin){
			if(oDate && oDate instanceof Date){
				if(bIsBegin){
						oDate.setHours(0);
			oDate.setMinutes(0);
			oDate.setSeconds(0);
				}else{
						oDate.setHours(23);
			oDate.setMinutes(59);
			oDate.setSeconds(59);
				}
			
				var iTZOffsetMs = oDate.getTimezoneOffset() * 60 * 1000;
			return new Date(oDate.getTime() - iTZOffsetMs);
			}else{
				return null;
			}
		},
		
		getUTC:function(oDate){
			if(oDate && oDate instanceof Date){
					var sTimeZone = "UTC";
			var iTimeZone = 0 - (oDate.getTimezoneOffset() / 60);
			if (iTimeZone > 0) {
				sTimeZone = "UTC+" + iTimeZone;
			} else if (iTimeZone < 0) {
				sTimeZone = "UTC" + iTimeZone;

			}
			return sTimeZone;
		}else{
			return null;
		}
		},
		
		getIcon:function(sIconUrl,sAvatar){
			if(sAvatar !== null && sAvatar !== ""){
				return sAvatar;
			}else if(sIconUrl !== null && sIconUrl !== ""){
			
					return sIconUrl;
				}else{
					return "sap-icon://discussion";
				}
		
		},
		
		getCommIcon:function(sIconUrl){
			if(sIconUrl !== null && sIconUrl !== ""){
			
					return sIconUrl;
				}else{
					return "sap-icon://discussion";
				}
		},
		isLongTermSelected:function(sKey){
			if(sKey === "1"){
				return true;
			}else{
				return false;
			}
		},
		
		isDynamicSelected:function(sKey){
			if(sKey === "2"){
				return true;
			}else{
				return false;
			}
		}
		

	};

});