var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const AWS = require('aws-sdk');
require('dotenv').config();

/* POST route for sending user data to write fra.PDF. */
router.post('/', async (req, res, next) => {
	console.log('this is the incoming body. ', req.body);
	AWS.config.update({
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION, // e.g., 'us-east-1'
	});
	const s3 = new AWS.S3();

	// Specify the bucket name and file path
	const bucketName = 'orr-file-bucket';

	const newPdfDoc = await fillFRA(req.body);
	const documentTitle = `${req.body.aNumber}_SP_${getInitials(
		req.body.sponsorFirstName,
		req.body.sponsorLastName
	)}_FRA.pdf`;
	const writeFile = await fs.writeFile(
		documentTitle,
		newPdfDoc,
		{ encoding: 'base64' },
		() => {
			console.log('about to do readfilesync');
			const fileContent = fs.readFileSync(documentTitle);
			const params = {
				Bucket: bucketName,
				Key: documentTitle, // Set the desired path in your S3 bucket
				Body: fileContent,
			};
			console.log(params, 'these are the params');
			s3.upload(params, (err, data) => {
				if (err) {
					console.error(err);
				} else {
					console.log(
						'File uploaded successfully. S3 Location:',
						data.Location
					);
					const signingParams = {
						Bucket: bucketName,
						Key: documentTitle, // Same key used for upload
						Expires: 3600, // Set the expiration time for the URL in seconds (e.g., 1 hour)
					};

					// Generate the pre-signed URL
					const signedUrl = s3.getSignedUrl('getObject', signingParams);

					console.log('Pre-signed URL:', signedUrl);
					res.send(signedUrl);
				}
			});
		}
	);
});

async function fillFRA(child) {
	const pdfData = fs.readFileSync(path.join(__dirname, '../fra-template.pdf'), {
		encoding: 'base64',
		flag: 'r',
	});
	const pdfDoc = await PDFDocument.load(pdfData);

	const form = pdfDoc.getForm();

	const fields = form.getFields();

	fields.forEach((field) => {
		const fieldName = field.getName();
		console.log(fieldName);
	});
	const childName = form.getField('nameOfChild');
	const childRelationship = form.getField('relationshipToChild');
	const sponsorName = form.getField('sponsorName');
	const otherNames = form.getField('otherNames');
	const sponsorCoo = form.getField('sponsorCoo');
	const sponsorDob = form.getField('sponsorDob');
	const sponsorPhone = form.getField('primaryPhone');
	const secondaryPhone = form.getField('secondaryPhone');
	const email = form.getField('email');
	const sponsorLanguage = form.getField('sponsorSpokenLanguages');
	const sponsorAddress = form.getField('address');
	const sponsorCity = form.getField('city');
	const sponsorState = form.getField('state');
	const sponsorZip = form.getField('zip');
	const hhm1Name = form.getField('hhm1Name');
	const hhm1Dob = form.getField('hhm1Dob');
	const hhm1RelationToSponsor = form.getField('hhm1RelationToSponsor');
	const hhm1ChildRelationship = form.getField('hhm1ChildRelationship');
	const acgName = form.getField('acgName');
	const acgDob = form.getField('acgDob');
	const acgPhone = form.getField('acgPhone');
	const acgAddress = form.getField('acgAddress');
	const acgCity = form.getField('acgCity');
	const acgState = form.getField('acgState');
	const acgZip = form.getField('acgZip');
	const acgRelationship = form.getField('acgRelationship');
	const sponsorAcg = form.getField('sponsorAcgRelationship');
	const carePlan = form.getField('carePlan');
	const carePlan2 = form.getField('carePlan2');
	const financialSupport = form.getField('financialSupport');
	const medicalInfo1 = form.getField('medicalInfo1');
	const medicalInfo2 = form.getField('medicalInfo2');
	const sponsorSignature = form.getField('sponsorSignature');
	const signingDate = form.getField('signingDate');

	childName.setText(child.childsName);
	childRelationship.setText(child.relationship);
	sponsorName.setText(`${child.sponsorFirstName} ${child.sponsorLastName}`);
	otherNames.setText('ningun');
	sponsorCoo.setText(child.coo);
	sponsorDob.setText(child.sponsorDob);
	sponsorPhone.setText(child.phone);
	secondaryPhone.setText('0000000000');
	email.setText(getEmail(child.sponsorFirstName));
	sponsorLanguage.setText('Espanol');
	sponsorAddress.setText(child.address);
	sponsorCity.setText(child.city);
	sponsorState.setText(child.state);
	sponsorZip.setText(child.zipCode);
	hhm1Name.setText(`${child.sponsorFirstName} ${child.sponsorLastName}`);
	hhm1Dob.setText(child.sponsorDob);
	hhm1RelationToSponsor.setText('Yo');
	hhm1ChildRelationship.setText(
		translateRelationship(child.relationship.toUpperCase())
	);
	acgName.setText();
	acgDob.setText();
	acgPhone.setText();
	acgAddress.setText(child.address);
	acgCity.setText(child.city);
	acgState.setText(child.state);
	acgZip.setText(child.zipCode);
	acgRelationship.setText();
	sponsorAcg.setText();
	carePlan.setText(`
    Nos encargamos de darle a comer a ${getGender(child).pronoun} nin${
		getGender(child).ending
	} llevarl${getGender(child).ending} a la escuela, `);

	carePlan2.setText(`a sus citas medicas, y a su cita del acorte.`);
	financialSupport.setText(`yo trabajo lunes a viernes 7am -3pm`);
	medicalInfo1.setText(
		`Nadie en casa sufre de ninguna enfermedad grave/contagiosa.  `
	);
	medicalInfo2.setText(
		`No hay ningun condicion medica que ${getGender(child).pronoun} nin${
			getGender(child).ending
		} puede tener. `
	);
	sponsorSignature.setText(
		child.sponsorFirstName + ' ' + child.sponsorLastName
	);
	signingDate.setText(new Date().toLocaleDateString());
	const pdfBytes = await pdfDoc.save();

	return pdfBytes;
}

const malePronouns = {
	pronoun: 'el',
	ending: 'o',
};

const femalePronouns = {
	pronoun: 'la',
	ending: 'a',
};

function getGender(child) {
	if (child.childGender.toUpperCase() === 'MALE') {
		return malePronouns;
	} else {
		return femalePronouns;
	}
}

function getEmail(firstName) {
	const firstNameArr = firstName.split(' ');
	if (firstNameArr.length > 1) {
		return firstNameArr[0] + '@email.com';
	}
	return `${firstName}@email.com`;
}

function translateRelationship(relationship) {
	const relationships = {
		MOTHER: 'Madre',
		FATHER: 'Padre',
		BROTHER: 'Hermano',
		SISTER: 'Hermana',
		UNCLE: 'Tio',
		AUNT: 'Tia',
		GRANDMOTHER: 'Abuela',
		GRANDMA: 'Abuela',
		GRANDFATHER: 'Abuelo',
		GRANDPA: 'Abuelo',
		'PATERNAL AUNT': 'Tia',
		'MATERNAL AUNT': 'Tia',
		'MATERNAL UNCLE': 'Tio',
		'PATERNAL UNCLE': 'Tio',
	};
	if (!relationships[relationship]) {
		return relationship;
	} else {
		return relationships[relationship];
	}
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
