sap.ui.define(
	function() {
		"use strict";

		return {
			accountTypeConst: {
				service: "WEC_SERACC",
				sub: "WEC_SUBACC",
				line: "LINE_BOT",
				line_ofc: "LINE_OFC"
			},
			commMediaConst: {
				wechat: "WEC",
				line: "LINE"

			},
			accountCommMedium: {
				wechat: "WEC",
				line: "LINE"
			},
			typeCommMedium:{
				WEC_SERACC:"WEC",
				WEC_SUBACC:"WEC",
				LINE_BOT:"LINE",
				LINE_OFC:"LINE"
			},
			errorMsgConst: {
				keyCheckError: "CM_CUAN_DA/008",
				invalidAppError: "CM_CUAN_DA/002",
				noCommAreaError: "business/error/000",
				longTermTokenError: "CM_CUAN_DA/003",
				createTGError: "CM_CUAN_DA/050",
				origIdError: "CM_CUAN_DA/010",
				channelIdError:"CM_CUAN_DA/004",
				channelSecretError:"CM_CUAN_DA/005"
			},
			
			handledErrorCodeArray:[
				"CM_CUAN_DA/002","CM_CUAN_DA/003","CM_CUAN_DA/050","CM_CUAN_DA/004","CM_CUAN_DA/005","CM_CUAN_DA/011","CM_CUAN_DA/012"
				],
			viewTypeConst: {
				bar: "Bar",
				line: "Line",
				pie: "Pie",
				table: "Table"
			},
			schema: {
				Namespace: "CUAN_DIGITAL_ACCOUNT_SRV"
			},

			lineAuthMethod: {
				longTerm: "1",
				dynamic: "2"

			},
			accountViewControl: {
				WEC_SERACC: {

					contactList: true,
					contactAnaly: true,
					interactionAnaly: true,
					shakeNearbyAnaly: true

				},

				WEC_SUBACC: {

					contactList: true,
					contactAnaly: true,
					interactionAnaly: true,
					shakeNearbyAnaly: true
				},
				LINE_BOT: {
					contactList: true,
					contactAnaly: true,
					interactionAnaly: true,
					shakeNearbyAnaly: false
				},
				LINE_OFC: {
					contactList: true,
					contactAnaly: true,
					interactionAnaly: true,
					shakeNearbyAnaly: false
				}
			}

		};
	});
// hpa.cei.digital_account.util.accountTypeConst = {
//     service: "WEC_SERACC",
//     sub: "WEC_SUBACC"
// };

// hpa.cei.digital_account.util.errorMsgConst={
//   keyCheckError:"IDENTKEY",
//   invalidAppError:"business/error/001",
//   noCommAreaError:"business/error/000",
//   createTGError:"business/error/002"
// };

// hpa.cei.digital_account.util.viewTypeConst = {
// 	bar: "Bar",
// 	line: "Line",
// 	pie: "Pie",
// 	table: "Table"
// };

// hpa.cei.digital_account.util.schema = {
// 	Namespace: "CUAN_DIGITAL_ACCOUNT_SRV"
// };

// hpa.cei.digital_account.util.digitalAccountViewTab = [""]