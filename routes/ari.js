var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const { degrees, PDFDocument, rbg, StandardFonts } = require('pdf-lib');
require('dotenv').config();
const AWS = require('aws-sdk');

/* POST route for sending user data to write ari.pdf. */
router.post('/', async (req, res, next) => {
	console.log(req.body, 'this is the body');
	AWS.config.update({
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	});
	const s3 = new AWS.S3();

	const bucketName = 'orr-file-bucket';
	const newAriDoc = await fillAri(req.body);
	const ariTitle = `${req.body.aNumber}_SP_${getInitials(
		req.body.sponsorFirstName,
		req.body.sponsorLastName
	)}_ARI.pdf`;

	const writeFile = await fs.writeFile(
		ariTitle,
		newAriDoc,
		{ encoding: 'base64' },
		() => {
			console.log('read file sync');
			const fileContent = fs.readFileSync(ariTitle);
			const params = {
				Bucket: bucketName,
				Key: ariTitle,
				Body: fileContent,
			};
			s3.upload(params, (err, data) => {
				if (err) {
					console.log(err, 'there was an error uploading the ARI');
				} else {
					console.log('ARI successfully uploaded', data.Location);
					const signingParams = {
						Bucket: bucketName,
						Key: ariTitle,
						Expires: 3600,
					};

					const signedUrl = s3.getSignedUrl('getObject', signingParams);

					console.log('pre-signed url', signedUrl);
					res.send(signedUrl);
				}
			});
		}
	);
});

async function fillAri(child) {
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

	sponsorSignature.setText(
		`${child.sponsorFirstName} ${child.sponsorLastName}`
	);
	todaysDate.setText(new Date().toLocaleDateString());
	sponsorName.setText(`${child.sponsorFirstName} ${child.sponsorLastName}`);
	childsName.setText(child.childsName);
	aNumber.setText(child.aNumber);
	provider.setText('Greensboro ICF');
	digitalSite.setText('N/A');
	child1Name.setText(child.childsName);
	child1Dob.setText(child.childsDob);
	child2Name.setText();
	child2Dob.setText();
	sponsorCompleteName.setText(
		`${child.sponsorFirstName} ${child.sponsorLastName}`
	);
	previousName.setText('ningun');
	datePreviousName.setText('n/a');
	sponsorDob.setText(child.sponsorDob);
	sponsorCityOfBirth.setText();
	sponsorCountyOfBirth.setText(child.coo);
	sponsorStateOfBirth.setText();
	sponsorCountryOfBirth.setText(child.coo);
	sponsorCountryOfCitizenship.setText(child.coo);
	sponsorAddress1.setText(child.address);
	sponsorState1.setText(child.state);
	sponsorZipCode1.setText(child.zipCode);
	sponsorAddressFrom1.setText();
	sponsorAddress2.setText('Calle De Mi Tierra');
	sponsorCity1.setText(child.city);
	sponsorCity2.setText(child.coo);
	sponsorState2.setText();
	sponsorZipCode2.setText();
	sponsorAddressFrom2.setText();
	sponsorAddressUntil2.setText();
	sponsorAddress3.setText();
	sponsorCity3.setText();
	sponsorState3.setText();
	sponsorZipCode3.setText();
	sponsorAddressFrom3.setText();
	sponsorAddressUntil3.setText();

	const pdfBytes = await ariPdf.save();
	return pdfBytes;
}
function getInitials(firstName, lastName) {
	const fnArr = firstName.split(' ');
	const lnArr = lastName.split(' ');
	let namesArr = [];
	fnArr.forEach((item) => {
		namesArr.push(item.charAt(0).toUpperCase());
	});

	lnArr.forEach((item) => {
		namesArr.push(item.charAt(0).toUpperCase());
	});
	return namesArr.join('');
}

module.exports = router;
