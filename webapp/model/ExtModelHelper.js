sap.ui.define(["hpa/cei/digital_account/util/Const"], function(Constants) {
	"use strict";



	return {

		

		/**
		 * Retrieves the an array of CollectionFacets to a view and an entity name (e.g. "Offer") from the metadata. Each
		 * CollectionFacet is the foundation for one ObjectPageSection and therefore one Smartform.
		 * 
		 * @param {string}
		 *          sEntityName Entitity name, e.g. "Offer" or "OfferContent"
		 * @param {object}
		 *          oModel Relevant model
		 * @return {array} Array with the CollectionFacets corresponding to the entitiy and view annotations
		 */
		getCollectionFacetsFromAnnotations: function(sEntityName, oModel) {
		//	var oModel = oView.getModel();
			var oNamespace = Constants.schema.Namespace;
			var oAnnotations = oModel.getServiceAnnotations()[oNamespace + "." + sEntityName];

			var aCollectionFacets = [];

			jQuery.each(oAnnotations, function(key, value) {
				// Process only annotations flagged as UI.Facets
				if (key.startsWith("UI.Facets")) {

					jQuery.each(value, function(index, sFacet) {
						aCollectionFacets.push(sFacet);
					});
				}
			});

			return aCollectionFacets;
		},

		



		/**
		 * generateSmartFormFromFilteredAnnotations - Creates a new SmartForm based on the view-contained annotations and
		 * returns it
		 * 
		 * @param {string}
		 *          sEntityName Name of the relevant annotation entity, e.g. "Offer" or "OfferContent"
		 * @param {int}
		 *          iNumberOfColumns Determines the layout of the FieldGroups
		 * @param {object}
		 *          oView The corresponding view
		 * @param {string}
		 *          sSmartFormID The smartform id
		 * @param {object}
		 *          oCollectionFacet The collection facet
		 * @return {object} Generated smart form
		 */
		generateSmartFormFromFilteredAnnotations: function(sEntityName, iNumberOfColumns, oView, sSmartFormID, oCollectionFacet) {
			var oModel = oView.getModel();
			var oNamespace = Constants.schema.Namespace;
			var oAnnotations = oModel.getServiceAnnotations()[oNamespace + "." + sEntityName];
	//		var mPropertyAnnotations = oModel.getServiceAnnotations().propertyAnnotations[oNamespace + "." + sEntityName];
	
			var oLayout;
	
			if (iNumberOfColumns > 0) {
				oLayout = new sap.ui.comp.smartform.Layout({
					columnsL: iNumberOfColumns
				});
			}
			
			var oSmartForm = new sap.ui.comp.smartform.SmartForm(oView.createId(sSmartFormID), {
				editable: "{ScreenState>/EditMode}",
				layout: oLayout,
				flexEnabled: false,
				title: oCollectionFacet.Label.String
			});

			// No Facets property -> Section has no Fieldgroups -> just return an empty SmartForm
			if (oCollectionFacet.Facets === undefined) {
				return oSmartForm;
			}

			jQuery.each(oCollectionFacet.Facets, function(index, oCurrentReferenceFacet) {

				jQuery.each(oAnnotations, function(key, value) {

					// Process only annotations flagged as UI.FieldGroup
					if (key.startsWith("UI.FieldGroup")) {

						// var annotationsPath = oCurrentReferenceFacet.Target.AnnotationPath.substr(1);

						// if (key !== annotationsPath) {
						// 	return true;
						// }

						var oSmartGroup = new sap.ui.comp.smartform.Group({
							label: value.Label.String
						});

						jQuery.each(value.Data, function(innerIndex, innerValue) {
							// Build SmartField
							var mSettings = {
								value: "{" + innerValue.Value.PropertyPath + "}"
							};
							// if (mPropertyAnnotations && mPropertyAnnotations[innerValue.Value.PropertyPath]
							// 		&& mPropertyAnnotations[innerValue.Value.PropertyPath]["com.sap.vocabularies.UI.v1.MultiLineText"]) {
							// 	jQuery.extend(true, mSettings, mMultiLineSettings);
							// }

							var oSmartField = new sap.ui.comp.smartfield.SmartField(mSettings);

							// Build Configuration for dropdown box
							var oConfiguration = new sap.ui.comp.smartfield.Configuration({
								controlType: sap.ui.comp.smartfield.ControlType.dropDownList,
								displayBehaviour: sap.ui.comp.smartfield.DisplayBehaviour.descriptionOnly
							});

							// Add dropdown configuration to SmartField
							oSmartField.setConfiguration(oConfiguration);

							// Build GroupElement
							var oGroupElement = new sap.ui.comp.smartform.GroupElement();

							// Add SmartField to GroupElement
							oGroupElement.addElement(oSmartField);

							// Add GroupElement to Group
							oSmartGroup.addGroupElement(oGroupElement);
						});
						// Add Group to SmartForm
						oSmartForm.addGroup(oSmartGroup);
					}
				});
			});
			return oSmartForm;
		},
		
		setSmartFieldEditable: function(oInfo, bIsEditable) {
			
			oInfo.setEditable(bIsEditable);
			var oInfoElements = oInfo.getGroups();
			//	MessageBox.alert(this.byId("accIdText").getBindingContext());
			for (var i = 0; i < oInfoElements.length; i++) {
				for (var j = 0; j < oInfoElements[i].getGroupElements().length; j++) {
					for (var k = 0; k < oInfoElements[i].getGroupElements()[j].getElements().length; k++) {
						var oSmartElement = oInfoElements[i].getGroupElements()[j].getElements()[k];
						if (oSmartElement.getMetadata().getName() === "sap.ui.comp.smartfield.SmartField") {
							oSmartElement.setContextEditable(bIsEditable);
							//	oSmartElement.setEditable(bIsEditable);

							//	MessageBox.alert(oSmartElement.getBindingPath("value"));
						}
					}
				}

			}
		},

		/**
		 * addSmartFormToNewSectionOnObjectPage - Creates a new ObjectPageSection + one SubSection on a given ObjectPage and
		 * adds a given SmartForm to it
		 * 
		 * @param {object}
		 *          oSmartForm The SmartForm with the content
		 * @param {string}
		 *          sObjectPageLayoutID ID of the ObjectPage
		 * @param {string}
		 *          sSectionID ID of the section, if it exists nothing happens
		 * @param {string}
		 *          sSectionText Text to be displayed as tab caption
		 * @param {object}
		 *          oView The view for adding the created controls
		 */
		addSmartFormToNewSectionOnObjectPage: function(oSmartForm, sObjectPageLayoutID, sSectionID, 
				sSectionText, oView,bIsVisible) {
	if (sSectionID && oView.byId(sSectionID) !== undefined) {
				return;
			}

			// Build SubSection (represented as new "tab")
			var oSubSection = new sap.uxap.ObjectPageSubSection();

			// Add SmartForm to SubSection
			oSubSection.addBlock(oSmartForm);

			// Create new Section
			var sId = "";
			if(sSectionID){
				sId = oView.createId(sSectionID);
			}
			var sText = "";
			if(sSectionText){
				sText = sSectionText;
			}
			var oSection = new sap.uxap.ObjectPageSection(sId, {
				title: sText
			});
			// Add image to section if it exists
			

			oSection.addSubSection(oSubSection);
             oSection.setVisible(bIsVisible);
			// Add Section to ObjectPage
			var oLayout = oView.byId(sObjectPageLayoutID);
			oLayout.addSection(oSection);
		}

	
	};
});