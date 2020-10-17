sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/Dialog",
], function(Controller, JSONModel, Button, Dialog) {
	"use strict";

	return Controller.extend("sap.ui.demo.todo.controller.App", {

		onInit: function () {
			var oEnteredTextJSON = {
				title: "",
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
				lastRhyme: "incognito",
				userSyllable: null
			});
			sap.ui.getCore().setModel(oJSONModel, "rhymes");

			var that = this;

			// on enter listener function for title input
			this.getView().byId("titleInput").onsapenter = function (e) {
				that.setTitle();
			};

			// on enter listener function for the text input
			this.getView().byId("textMultiInput").onsapenter = function (e) {
				that.addLine();
			};

			// on enter listener function for the combo box
			this.getView().byId("rhymesComboBox").onsapenter = function (e) {
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
			var oSyllableInput = oView.byId("userSyllable");
			oSyllableInput.setModel(oRhymesModel);

			// token validator for multiinput
			var that = this;
			this.getView().byId("textMultiInput").addValidator(function (args) {
				console.log(args)
				that.addLineFromValidator(args.text);
			});

			// add list to scrollcontainer
			// more and more bugs
			var oScrollContainer = oView.byId("lyricsContainer");
			var oList = new sap.m.List("enteredLines", {
				mode: "Delete",
				noDataText: "Fresh lines you write will appear here...",
			});
			oList.attachDelete(this.deleteLine, this)
			oScrollContainer.addContent(oList);
			this.getRhymes("incognito");
			this.getView().byId("rhymesComboBox").setValue("incognito");
		},

		// getting the rhyme the user needs to rhyme with - its the last word in the text input!
		setLastRhyme: function(sTextContent) {
			var sLastRhyme = sTextContent.split(" ").splice(-1);

			this.getView().byId("rhymesComboBox").setValue(sLastRhyme);
			// now get the rhymes as well
			this.getRhymes(sLastRhyme);
		},

		// changes the syllable count in the edit Input while the user types, also adds green or red depending on matching of syllables
		liveInputChange: function() {
			console.log('in here!')
			var sTextContent = sap.ui.getCore().getModel("enteredText").getProperty("/textContent");
			var iLength = this.syllableCount(sTextContent); // call syllable count function passing the bound value from our model
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

			this.setLastRhyme(sTextContent);

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
			this.addDragAndDrop(oList);
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
					// Update the syllable count and last rhyme as they write in the input
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
				title: 'Edit your fresh line!',
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

			// a bit of focus work to ensure that the cursor is at the end of the input
			oInput.focus();
			var sValue = oInput.getValue();
			oInput.setValue('');
			oInput.setValue(sValue);
		},

		addDragAndDrop: function(oList) {
			var sId = oList.getId()
			var sUlId = "#" + sId + "-listUl";
			$(document).ready(function () {
				$(sUlId).addClass("ui-sortable")
				$(sUlId).sortable({
					connectWith: ".ui-sortable"
				}).disableSelection();
			})
		},

		deleteLine: function (oEvent) {
			var oList = oEvent.getSource();
			var oItem = oEvent.getParameter("listItem");
			oItem.destroy();
			var oContent = sap.ui.getCore().byId("enteredLines").getItems();
			if (oContent.length > 0) {
				this.setLastRhyme(oContent[oContent.length - 1].getTitle())
			}

			// add the drag and drop functionality to the list (call every time because of new items added)
			this.addDragAndDrop(oList);
		},

		getRhymes: function (sWord, oComboBox) {
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
					if (oComboBox) {
						oComboBox.setOpen(true);
					}
				}
			});
		},

		userRhyme: function () {
			var oView = this.getView();
			var oComboBox = oView.byId("rhymesComboBox");
			var sUserRhymeValue = oComboBox.getValue();
			this.getRhymes(sUserRhymeValue, oComboBox);

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

		onDeleteAll: function() {
			var oText = new sap.m.Text("deleteAllEnsureText", {
				text: "Are you sure you want to delete ALL the lines of your fresh rap?"
			});

			var that = this;
			var oDialog = new Dialog({
				title: 'Really delete all?',
				type: 'Message',
				content: [oText],
				beginButton: new Button({
					icon: "sap-icon://accept",
					text: 'Yes',
					press: function () {
						that.deleteAll();
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
			oDialog.open();
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
