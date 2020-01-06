sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/ButtonType"
], function (Controller, JSONModel, DateFormat, Button, Dialog, Text, ButtonType) {
	"use strict";

	return Controller.extend("openui5-rap-helper.openui5-rap-helper.controller.OpenUI5RapHelper", {

		onInit: function () {
			var oEnteredTextJSON = {
				textContent: "",
				textLength: 0,
				editContent: "",
				editLength: 0
			};
			var oEnteredTextModel = new JSONModel(oEnteredTextJSON);
			sap.ui.getCore().setModel(oEnteredTextModel, "enteredText");

			// rhymes finding model
			var oJSONModel = new JSONModel({
				rhymeList: [],
				lastRhyme: "[write a line]",
				userRhyme: "",
				userSyllable: null
			});
			sap.ui.getCore().setModel(oJSONModel, "rhymes");

			var that = this;

			// on enter listener function for the text input 
			this.getView().byId("textInput").onsapenter = function (e) {
				that.addLine();
			};
			// on enter listener function for the user rhyme
			this.getView().byId("userRhyme").onsapenter = function (e) {
				that.userRhyme();
			};
			// on enter listener function for the user syllable restrict
			this.getView().byId("userSyllable").onsapenter = function (e) {
				that.userSyllable();
			};

		},
		onAfterRendering: function () {
			// set models to various view elements
			var oView = this.getView();
			var oEnteredTextModel = sap.ui.getCore().getModel("enteredText");
			oView.setModel(oEnteredTextModel);
			var oComboBox = oView.byId("rhymesComboBox");
			var oRhymesModel = sap.ui.getCore().getModel("rhymes");
			oComboBox.setModel(oRhymesModel);
			var oRhymeInput = oView.byId("userRhyme");
			oRhymeInput.setModel(oRhymesModel);
			var oSyllableInput = oView.byId("userSyllable");
			oSyllableInput.setModel(oRhymesModel);

			// token validator for multiinput
			var that = this;
			this.getView().byId("textMultiInput").addValidator(function (args) {
				that.addLineFromValidator(args.txt);
			});

			// add list to scrollcontainer
			// more and more bugs
			var oScrollContainer = oView.byId("lyricsContainer");
			var oList = new sap.m.List("enteredLines", {
				mode: "Delete",
				noDataText: "Fresh lyrics you write will appear here...",
				delete: this.deleteLine
			});
			oScrollContainer.addContent(oList);
		},
		liveInputChange: function () { // changes the syllable count in the edit Input while the user types, also adds green or red depending on matching of syllables
			var iLength = this.syllableCount(sap.ui.getCore().getModel("enteredText").getProperty("/textContent")); // call syllable count function passing the bound value from our model
			sap.ui.getCore().getModel("enteredText").setProperty("/textLength", iLength);
			var oContent = sap.ui.getCore().byId("enteredLines").getItems();
			if (oContent.length === 0) {
				return; // this means no previous line, we can't change the color
			}
			var sPrevLengthText = oContent[oContent.length - 1].getInfo(); // get the last element in content; this was the last typed line by the user
			console.log(sPrevLengthText);
			var iPrevLength = parseInt(sPrevLengthText.substring(12).replace(")", ""), 0);
			var oText = this.getView().byId("syllableText");
			if (iLength === iPrevLength) {
				if (oText.hasStyleClass("red")) {
					oText.removeStyleClass("red");
					oText.addStyleClass("green");
				}
			} else {
				if (oText.hasStyleClass("green")) {
					oText.removeStyleClass("green");
					oText.addStyleClass("red");
				}
			}
		},
		liveInputEditChange: function () { // changes the syllable count in the edit Input while the user types
			var iLength = this.syllableCount(sap.ui.getCore().getModel("enteredText").getProperty("/editContent")); // call syllable count function passing the bound value from our model
			sap.ui.getCore().getModel("enteredText").setProperty("/editLength", iLength);
		},
		syllableCount: function (sString) {
			sString = sString.toLowerCase();
			if (sString.length === 0) {
				return 0;
			}

			var iCount = sString.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
				.replace(/^y/, '')
				.match(/[aeiouy]{1,2}/g);

			if (iCount) {
				iCount = iCount.length;
			} else {
				iCount = 0;
			}

			return iCount;
		},
		addLine: function () {
			var sTextContent = sap.ui.getCore().getModel("enteredText").getProperty("/textContent");
			var sLength = sap.ui.getCore().getModel("enteredText").getProperty("/textLength").toString();

			// getting the rhyme the user needs to rhyme with
			var sLastRhyme = sTextContent.split(" ").splice(-1);
			this.getRhymes(sLastRhyme);

			// clear the text value
			sap.ui.getCore().getModel("enteredText").setProperty("/textContent", "");

			// reset the syllable number
			sap.ui.getCore().getModel("enteredText").setProperty("/textLength", 0);
			var oText = this.getView().byId("syllableText");
			if (oText.hasStyleClass("green")) {
				oText.removeStyleClass("green");
				oText.addStyleClass("red");
			}

			// create standard list item
			var that = this;
			var oStandardListItem = new sap.m.StandardListItem({
				type: "Active",
				press: function (oEvent) {
					that.editLine(oEvent, that);
				},
				title: sTextContent,
				info: "(Syllables: " + sLength + ")"
			});

			var oList = sap.ui.getCore().byId("enteredLines");
			oList.addItem(oStandardListItem);

			// add the drag and drop functionality to the list (call every time because of new items added)
			var sId = oList.getId()
			var sUlId = "#" + sId + "-listUl";
			$(document).ready(function () {
				$(sUlId).addClass("ui-sortable")
				$(sUlId).sortable({
					connectWith: ".ui-sortable"
				}).disableSelection();
			});

		},
		addLineFromValidator: function (sText) {
			// create standard list item
			var sLength = this.syllableCount(sText);
			var oStandardListItem = new sap.m.StandardListItem({
				title: sText,
				info: "(Syllables: " + sLength + ")"
			});
			oStandardListItem.setType("Active");

			var oList = sap.ui.getCore().byId("enteredLines");
			oList.addItem(oStandardListItem);
			this.getView().byId("textMultiInput").setValue("");
		},

		// creates an input modal so the user can edit a previously written lines
		editLine: function (oEvent, oController) {
			var oStandardListItem = oEvent.getSource();
			var oEditContentModel = sap.ui.getCore().getModel("enteredText");

			// get text of the line they want to edit (which in this case is technically the 'title' of the StandardListItem)
			var sText = oStandardListItem.getTitle();

			// bind that text to the editContent property of teh model
			oEditContentModel.setProperty("/editContent", sText);
			var oInput = new sap.m.Input("modalInput", {
				value: "{/editContent}",
				valueLiveUpdate: true,
				liveChange: function () {
					// Update the syllable count as they edit
					oController.liveInputEditChange();
				}
			});
			oInput.setLayoutData(new sap.ui.layout.GridData({
				span: "L8 M8 S8"
			}));
			oInput.setModel(oEditContentModel);
			var oText = new sap.m.Text("editSyllables", {
				text: "(Syllables: {/editLength})"
			});
			oText.addStyleClass("sapUiSmallMargin");
			oText.setLayoutData(new sap.ui.layout.GridData({
				span: "L2 M2 S2"
			}));
			oText.setModel(oEditContentModel);

			var oDialog = new Dialog({
				title: 'Edit your fresh lyric!',
				type: 'Message',
				content: [oInput, oText],
				beginButton: new Button({
					icon: "sap-icon://accept",
					text: 'OK',
					press: function () {
						var sEditedContent = sap.ui.getCore().getModel("enteredText").getProperty("/editContent");
						oStandardListItem.setTitle(sEditedContent);
						oDialog.close();
					}
				}),
				endButton: new Button({
					icon: "sap-icon://sys-cancel",
					text: 'Cancel',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			// make sure to attach this on enter function
			sap.ui.getCore().byId("modalInput").onsapenter = function (e) {
				var sEditedContent = sap.ui.getCore().getModel("enteredText").getProperty("/editContent");
				oStandardListItem.setTitle(sEditedContent);
				oDialog.close();
			};


			// update syllable count so it is correct
			oController.liveInputEditChange();

			oDialog.open();
			
			
			oInput.focus();
			var sValue = oInput.getValue(); //store the value of the element
			oInput.setValue(''); //clear the value of the element
			oInput.setValue(sValue); //set that value back.  
		},

		deleteLine: function (oEvent) {
			var oList = oEvent.getSource();
			var oItem = oEvent.getParameter("listItem");
			oItem.destroy();
			var oContent = sap.ui.getCore().byId("enteredLines").getItems();
			var sLastRhyme = oContent[oContent.length - 1].getTitle().split(" ").splice(-1);
			sap.ui.getCore().getModel("rhymes").setProperty("/lastRhyme", sLastRhyme); // set the rhyme to the last word of the last list item in the list
			this.getRhymes(sLastRhyme);

			// add the drag and drop functionality to the list (call every time because of new items added)
			var sId = oList.getId()
			var sUlId = "#" + sId + "-listUl";
			$(document).ready(function () {
				$(sUlId).addClass("ui-sortable")
				$(sUlId).sortable({
					connectWith: ".ui-sortable"
				}).disableSelection();
			});
		},

		getRhymes: function (sWord) {
			// Rhyme API URL root
			var sURL = "https://rhymebrain.com/talk?function=getRhymes&word=";

			// set the word in the combobox to this word
			sap.ui.getCore().getModel("rhymes").setProperty("/lastRhyme", sWord);

			// make AJAX call
			$.ajax({
				url: sURL + sWord,
				type: "GET",
				success: function (data) {
					sap.ui.getCore().getModel("rhymes").setProperty("/rhymeList", data);
				}
			});
		},

		userRhyme: function () {
			var sUserRhyme = sap.ui.getCore().getModel("rhymes").getProperty("/userRhyme");
			console.log(sUserRhyme);
			this.getRhymes(sUserRhyme);
		},

		userSyllable: function () {
			var iUserSyllable = sap.ui.getCore().getModel("rhymes").getProperty("/userSyllable");
			var sUserSyllable = iUserSyllable.toString();
			console.log(this.getView().byId("rhymesComboBox"));
			var oBinding = this.getView().byId("rhymesComboBox").getBinding("items");
			console.log(sUserSyllable);
			var oFilter = new sap.ui.model.Filter("syllables", sap.ui.model.FilterOperator.EQ, sUserSyllable);
			oBinding.filter([oFilter]);
		},

		save: function () {
			var oContent = sap.ui.getCore().byId("enteredLines").getItems();
			var sText = "";
			for (var i = 0; i < oContent.length; i++) {
				sText = sText + oContent[i].getTitle(); // actual line
				sText = sText + "\t\t\t\t" + oContent[i].getInfo(); // syllable count
				sText = sText + "\n";
			}
			console.log(sText);
			if (sText !== "") {
				var link = document.createElement('a');
				link.setAttribute('download', "rap_annotations.txt");
				link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sText));
				link.click();
			}
		},

		saveNoAnno: function () {
			var oContent = sap.ui.getCore().byId("enteredLines").getItems();
			var sText = "";
			for (var i = 0; i < oContent.length; i++) {
				sText = sText + oContent[i].getTitle(); // actual written line
				sText = sText + "\n";
			}
			console.log(sText);
			if (sText !== "") {
				var link = document.createElement('a');
				link.setAttribute('download', "rap_no_annotations.txt");
				link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sText));
				link.click();
			}
		},

		autoScroll: function () {
			var oContent = sap.ui.getCore().byId("enteredLines").getItems();
			var iLength = oContent.length * 36; // total height of content
			var iTime = oContent.length * 2500; // two seconds per element
			console.log(iLength);
			console.log(iTime);
			//var oElement = oContent[oContent.length - 1];
			this.getView().byId("lyricsContainer").scrollTo(0, iLength, iTime);
		},

		deleteAll: function () {
			sap.ui.getCore().byId("enteredLines").destroyItems();
			var oText = this.getView().byId("syllableText");
			if (oText.hasStyleClass("red")) { // also fix the
				oText.removeStyleClass("red");
				oText.addStyleClass("green");
			}
		}
	});
});