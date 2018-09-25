sap.ui.define([
	"hpa/cei/digital_account/model/formatter"
], function(formatter) {
	"use strict";

	QUnit.module("Formatter");

	function numberUnitValueTestCase(assert, sValue, fExpectedNumber) {
		// Act
		var fNumber = formatter.numberUnit(sValue);

		// Assert
		assert.strictEqual(fNumber, fExpectedNumber, "The rounding was correct");
	}

	QUnit.test("Should round down a 3 digit number", function(assert) {
		numberUnitValueTestCase.call(this, assert, "3.123", "3.12");
	});

	QUnit.test("Should round up a 3 digit number", function(assert) {
		numberUnitValueTestCase.call(this, assert, "3.128", "3.13");
	});

	QUnit.test("Should round a negative number", function(assert) {
		numberUnitValueTestCase.call(this, assert, "-3", "-3.00");
	});

	QUnit.test("Should round an empty string", function(assert) {
		numberUnitValueTestCase.call(this, assert, "", "");
	});

	QUnit.test("Should round a zero", function(assert) {
		numberUnitValueTestCase.call(this, assert, "0", "0.00");
	});

	function formatNumberToPercentValueTestCase(assert, sValue, sExpectedNumber) {
		// Act
		var sNumber = formatter.formatNumberToPercent(sValue);

		// Assert
		assert.strictEqual(sNumber, sExpectedNumber, "The format was correct");
	}

	QUnit.test("Should format the number string to %", function(assert) {
		formatNumberToPercentValueTestCase.call(this, assert, "0.03", "3.00%");
	});
	QUnit.test("Should format the no-number string to 0.00%", function(assert) {
		formatNumberToPercentValueTestCase.call(this, assert, "test", "0%");
	});
	QUnit.test("Should format the number string to round2%", function(assert) {
		formatNumberToPercentValueTestCase.call(this, assert, "0.12122", "12.12%");
	});
	QUnit.test("Should format the number string to round2%", function(assert) {
		formatNumberToPercentValueTestCase.call(this, assert, "0.121292", "12.13%");
	});

	function getStatusStateValueTestCase(assert, sValue, sExpectedStatus) {
		// Act
		var sStatus = formatter.getStatusState(sValue);

		// Assert
		assert.strictEqual(sStatus, sExpectedStatus, "The status was correct");
	}

	QUnit.test("Should format the null status to none", function(assert) {
		getStatusStateValueTestCase.call(this, assert, null, "None");
	});
		QUnit.test("Should format the 1 status to warning", function(assert) {
		getStatusStateValueTestCase.call(this, assert, "1", "Warning");
	});
	QUnit.test("Should format the Validated status to Success", function(assert) {
		getStatusStateValueTestCase.call(this, assert, "2", "Success");
	});
	QUnit.test("Should format the Failed status to Error", function(assert) {
		getStatusStateValueTestCase.call(this, assert, "3", "Error");
	});
	QUnit.test("Should format the others to None", function(assert) {
		getStatusStateValueTestCase.call(this, assert, "otherstatus", "None");
	});

	function formatDateValueTestCase(assert, dDate, sExpectedDate) {
		// Act
		var sDate = formatter.formatDate(dDate);

		// Assert
		assert.strictEqual(sDate, sExpectedDate, "The date format was correct");
	}

	QUnit.test("Should format the date to formatted date", function(assert) {
		formatDateValueTestCase.call(this, assert, new Date(99, 5, 24), "Jun 23, 1999");
	});
	QUnit.test("Should format the abap date to formatted date", function(assert) {
		formatDateValueTestCase.call(this, assert, "/Date(1472688000000)/", "Sep 1, 2016");
	});
	QUnit.test("Should format the null date to null", function(assert) {
		formatDateValueTestCase.call(this, assert, null, null);
	});
	QUnit.test("Should format the string to null", function(assert) {
		formatDateValueTestCase.call(this, assert, "date", null);
	});
	
		function adjustDateValueTestCase(assert, dDate, bIsBegin,dExpectedDate) {
			
		// Act
		Date.prototype.getTimezoneOffset = function () {return -480;};
		var dActDate = formatter.adjustDate(dDate,bIsBegin);
		if(dActDate !== null){
			dActDate = dActDate.toString();
		}

		// Assert
		assert.strictEqual(new Date(dActDate).getMonth(),new Date(dExpectedDate).getMonth(), "The date format was correct");
	}
		QUnit.test("Should adjust the date to formatted date", function(assert) {
		adjustDateValueTestCase.call(this, assert, new Date(99, 5, 24),true, new Date(99,5,24,8,0,0).toString());
	});
		QUnit.test("Should adjust the date to formatted date", function(assert) {
		adjustDateValueTestCase.call(this, assert, new Date(99, 5, 24),false, new Date(99,5,24).toString());
	});

	QUnit.test("Should format the null date to null", function(assert) {
		adjustDateValueTestCase.call(this, assert, null, true,null);
	});
	QUnit.test("Should format the string to null", function(assert) {
		adjustDateValueTestCase.call(this, assert, "date",true, null);
	});
	
		function getUTCTestCase(assert, dDate, sExpectedDate) {
		// Act
		var sDate = formatter.getUTC(dDate);

		// Assert
		assert.strictEqual(sDate, sExpectedDate, "The date format was correct");
	}
		QUnit.test("Should get the UTC", function(assert) {
			Date.prototype.getTimezoneOffset = function () {return -120;};
		getUTCTestCase.call(this, assert, new Date(), "UTC+2");
	});
	
		QUnit.test("Should get the neg UTC", function(assert) {
			Date.prototype.getTimezoneOffset = function () {return 120;};
		getUTCTestCase.call(this, assert, new Date(), "UTC-2");
	});

	QUnit.test("Should format the null date to null", function(assert) {
		getUTCTestCase.call(this, assert, null, null);
	});
	QUnit.test("Should format the string to null", function(assert) {
		getUTCTestCase.call(this, assert, "date", null);
	});
	
	function getIconTestCase(assert,sIconUrl,sAvatar,sExpectedIconUrl){
		var sRetIconUrl = formatter.getIcon(sIconUrl,sAvatar);
		assert.strictEqual(sRetIconUrl, sExpectedIconUrl, "The Icon was correct");
	}
		QUnit.test("Should get the avatar iconurl", function(assert) {
		getIconTestCase.call(this, assert, "testurl", "testAvatar","testAvatar");
	});

	QUnit.test("Should get the  icon when avatar is null", function(assert) {
		getIconTestCase.call(this, assert, "testurl",null, "testurl");
	});
	QUnit.test("Should get the  icon when avatar is empty", function(assert) {
		getIconTestCase.call(this, assert, "testurl","", "testurl");
	});
	QUnit.test("Should get the default icon when empty", function(assert) {
		getIconTestCase.call(this, assert, "","", "sap-icon://discussion");
	});
		QUnit.test("Should get the default icon when null", function(assert) {
		getIconTestCase.call(this, assert, null,null, "sap-icon://discussion");
	});
	
		function getCommIconTestCase(assert,sIconUrl,sExpectedIconUrl){
		var sRetIconUrl = formatter.getCommIcon(sIconUrl);
		assert.strictEqual(sRetIconUrl, sExpectedIconUrl, "The Comm icon url was correct");
	}
		QUnit.test("Should get the UTC", function(assert) {
		getCommIconTestCase.call(this, assert, "testurl", "testurl");
	});

	QUnit.test("Should get the default icon when null", function(assert) {
		getCommIconTestCase.call(this, assert, null, "sap-icon://discussion");
	});
	QUnit.test("Should get the default icon when empty", function(assert) {
		getCommIconTestCase.call(this, assert, "", "sap-icon://discussion");
	});
	
		function isLongTermSelectedTestCase(assert,sKey,sExpectedSelected){
		var sRetSelected = formatter.isLongTermSelected(sKey);
		assert.strictEqual(sRetSelected, sExpectedSelected, "The selected return was correct");
	}
		QUnit.test("Should get true", function(assert) {
		isLongTermSelectedTestCase.call(this, assert, "1", true);
	});

	QUnit.test("Should get false", function(assert) {
		isLongTermSelectedTestCase.call(this, assert, "2", false);
	});
	
	function isDynamicSelectedTestCase(assert,sKey,sExpectedSelected){
		var sRetSelected = formatter.isDynamicSelected(sKey);
		assert.strictEqual(sRetSelected, sExpectedSelected, "The selected return was correct");
	}
		QUnit.test("Should get true", function(assert) {
		isDynamicSelectedTestCase.call(this, assert, "2", true);
	});

	QUnit.test("Should get false", function(assert) {
		isDynamicSelectedTestCase.call(this, assert, "1", false);
	});


});