var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { degrees, PDFDocument, rbg, StandardFonts } = require('pdf-lib');

/* GET users listing. */
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

	// const sponsorSignature = form.getField(sponsor.sponsorSignature);
	// const todaysDate = form.getField(sponsor.todaysDate);
	// const sponsorName = form.getField(sponsor.sponsorName);
	// const childsName = form.getField(sponsor.childsName);
	// const aNumber = form.getField(sponsor.aNumber);
	// const provider = form.getField('Greensboro ICF');
	// const digitalSite = form.getField('N/A');
	// const child1Name = form.getField(sponsor.child1Name);
	// const child1Dob = form.getField(sponsor.child1Dob);
	// const child2Name = form.getField(sponsor.child2Name);
	// const child2Dob = form.getField(sponsor.child2Dob);
	// const sponsorCompleteName = form.getField(sponsor.sponsorCompleteName);
	// const previousName = form.getField(sponsor.previousName);
	// const datePreviousName = form.getField(sponsor.datePreviousName);
	// const sponsorDob = form.getField(sponsor.sponsorDob);
	// const sponsorCityOfBirth = form.getField(sponsor.sponsorCityOfBirth);
	// const sponsorCountyOfBirth = form.getField(sponsor.sponsorCountyOfBirth);
	// const sponsorStateOfBirth = form.getField(sponsor.sponsorStateOfBirth);
	// const sponsorCountryOfBirth = form.getField(sponsor.sponsorCountyOfBirth);
	// const sponsorCountryOfCitizenship = form.getField(
	// 	sponsor.sponsorCountryOfCitizenship
	// );
	// const sponsorAddress1 = form.getField(sponsor.sponsorAddress1);
	// const sponsorState1 = form.getField(sponsor.sponsorState1);
	// const sponsorZipCode1 = form.getField(sponsor.sponsorZipCode1);
	// const sponsorAddressFrom1 = form.getField(sponsor.sponsorAddressFrom1);
	// const sponsorAddress2 = form.getField(sponsor.sponsorAddress2);
	// const sponsorCity1 = form.getField(sponsor.sponsorCity1);
	// const sponsorCity2 = form.getField(sponsor.sponsorCity2);
	// const sponsorState2 = form.getField(sponsor.sponsorState2);
	// const sponsorZipCode2 = form.getField(sponsor.sponsorZipCode2);
	// const sponsorAddressFrom2 = form.getField(sponsor.sponsorAddressFrom2);
	// const sponsorAddressUntil2 = form.getField(sponsor.sponsorAddressUntil2);
	// const sponsorAddress3 = form.getField(sponsor.sponsorAddress3);
	// const sponsorCity3 = form.getField(sponsor.sponsorCity3);
	// const sponsorState3 = form.getField(sponsor.sponsorState3);
	// const sponsorZipCode3 = form.getField(sponsor.sponsorZipCode3);
	// const sponsorAddressFrom3 = form.getField(sponsor.sponsorAddressFrom3);
	// const sponsorAddressUntil3 = form.getField(sponsor.sponsorAddressUntil3);

	// sponsorSignature.setText();
	// todaysDate.setText();
	// sponsorName.setText();
	// childsName.setText();
	// aNumber.setText();
	// provider.setText();
	// digitalSite.setText();
	// child1Name.setText();
	// child1Dob.setText();
	// child2Name.setText();
	// child2Dob.setText();
	// sponsorCompleteName.setText();
	// previousName.setText();
	// datePreviousName.setText();
	// sponsorDob.setText();
	// sponsorCityOfBirth.setText();
	// sponsorCountyOfBirth.setText();
	// sponsorStateOfBirth.setText();
	// sponsorCountryOfBirth.setText();
	// sponsorCountryOfCitizenship.setText();
	// sponsorAddress1.setText();
	// sponsorState1.setText();
	// sponsorZipCode1.setText();
	// sponsorAddressFrom1.setText();
	// sponsorAddress2.setText();
	// sponsorCity1.setText();
	// sponsorCity2.setText();
	// sponsorState2.setText();
	// sponsorZipCode2.setText();
	// sponsorAddressFrom2.setText();
	// sponsorAddressUntil2.setText();
	// sponsorAddress3.setText();
	// sponsorCity3.setText();
	// sponsorState3.setText();
	// sponsorZipCode3.setText();
	// sponsorAddressFrom3.setText();
	// sponsorAddressUntil3.setText();

	const pdfBytes = await ariPdf.save();
	return pdfBytes;
}
