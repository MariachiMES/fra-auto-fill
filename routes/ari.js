var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { degrees, PDFDocument, rbg, StandardFonts } = require('pdf-lib');

/* POST route for sending user data to write ari.pdf. */
router.post('/', async (req, res, next) => {
	const newAriDoc = await fillAri(req.body);
});

module.exports = router;

async function fillAri(sponsor) {
	const ariData = fs.readFileSync(path.join(__dirname, `../ari-template.pdf`), {
		encoding: 'base64',
		flag: 'r',
	});

	const ariPdf = await PDFDocument.load(ariData);

	const form = ariPdf.getForm();
	const fields = form.getFields();
	fields.forEach((field) => {
		const fieldName = field.getName();
		console.log(fieldName);
	});

	const sponsorSignature = form.getField('sponsorSignature');
	const todaysDate = form.getField('todaysDate');
	const sponsorName = form.getField('sponsorName');
	const childsName = form.getField('childsName');
	const aNumber = form.getField('aNumber');
	const provider = form.getField('provider');
	const digitalSite = form.getField('digitalSite');
	const child1Name = form.getField('child1Name');
	const child1Dob = form.getField('child1Dob');
	const child2Name = form.getField('child2Name');
	const child2Dob = form.getField('child2Dob');
	const sponsorCompleteName = form.getField('sponsorCompleteName');
	const previousName = form.getField('previousName');
	const datePreviousName = form.getField('datePreviousName');
	const sponsorDob = form.getField('sponsorDob');
	const sponsorCityOfBirth = form.getField('sponsorCityOfBirth');
	const sponsorCountyOfBirth = form.getField('sponsorCountyOfBirth');
	const sponsorStateOfBirth = form.getField('sponsorStateOfBirth');
	const sponsorCountryOfBirth = form.getField('sponsorCountryOfBirth');
	const sponsorCountryOfCitizenship = form.getField(
		'sponsorCountryOfCitizenship'
	);
	const sponsorAddress1 = form.getField('sponsorAddress1');
	const sponsorState1 = form.getField('sponsorState1');
	const sponsorZipCode1 = form.getField('sponsorZipCode1');
	const sponsorAddressFrom1 = form.getField('sponsorAddressFrom1');
	const sponsorAddress2 = form.getField('sponsorAddress2');
	const sponsorCity1 = form.getField('sponsorCity1');
	const sponsorCity2 = form.getField('sponsorCity2');
	const sponsorState2 = form.getField('sponsorState2');
	const sponsorZipCode2 = form.getField('sponsorZipCode2');
	const sponsorAddressFrom2 = form.getField('sponsorAddressFrom2');
	const sponsorAddressUntil2 = form.getField('sponsorAddressUntil2');
	const sponsorAddress3 = form.getField('sponsorAddress3');
	const sponsorCity3 = form.getField('sponsorCity3');
	const sponsorState3 = form.getField('sponsorState3');
	const sponsorZipCode3 = form.getField('sponsorZipCode3');
	const sponsorAddressFrom3 = form.getField('sponsorAddressFrom3');
	const sponsorAddressUntil3 = form.getField('sponsorAddressUntil3');

	sponsorSignature.setText(sponsor);
	todaysDate.setText(new Date().toLocaleDateString());
	sponsorName.setText(sponsor);
	childsName.setText(sponsor);
	aNumber.setText(sponsor);
	provider.setText(sponsor);
	digitalSite.setText(sponsor);
	child1Name.setText(sponsor);
	child1Dob.setText(sponsor);
	child2Name.setText(sponsor);
	child2Dob.setText(sponsor);
	sponsorCompleteName.setText(sponsor);
	previousName.setText(sponsor);
	datePreviousName.setText(sponsor);
	sponsorDob.setText(sponsor);
	sponsorCityOfBirth.setText(sponsor);
	sponsorCountyOfBirth.setText(sponsor);
	sponsorStateOfBirth.setText(sponsor);
	sponsorCountryOfBirth.setText(sponsor);
	sponsorCountryOfCitizenship.setText(sponsor);
	sponsorAddress1.setText(sponsor);
	sponsorState1.setText(sponsor);
	sponsorZipCode1.setText(sponsor);
	sponsorAddressFrom1.setText(sponsor);
	sponsorAddress2.setText(sponsor);
	sponsorCity1.setText(sponsor);
	sponsorCity2.setText(sponsor);
	sponsorState2.setText(sponsor);
	sponsorZipCode2.setText(sponsor);
	sponsorAddressFrom2.setText(sponsor);
	sponsorAddressUntil2.setText(sponsor);
	sponsorAddress3.setText(sponsor);
	sponsorCity3.setText(sponsor);
	sponsorState3.setText(sponsor);
	sponsorZipCode3.setText(sponsor);
	sponsorAddressFrom3.setText(sponsor);
	sponsorAddressUntil3.setText(sponsor);

	const pdfBytes = await ariPdf.save();
	return pdfBytes;
}
