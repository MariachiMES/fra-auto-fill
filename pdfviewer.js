const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const uc = {
	ucName: 'david ortiz',
	aNumber: '915468156',
	gender: 'male',
};

const malePronouns = {
	pronoun: 'el',
	ending: 'o',
};

const femalePronouns = {
	pronoun: 'la',
	ending: 'a',
};

function getGender(child) {
	if (child.gender.toUpperCase() === 'MALE') {
		return malePronouns;
	} else {
		return femalePronouns;
	}
}

async function fillFRA(child) {
	const pdfData = fs.readFileSync(path.join(__dirname, '/fra-template.pdf'), {
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
	const financialSupport = form.getField('financialSupport');
	const medicalInfo1 = form.getField('medicalInfo1');
	const medicalInfo2 = form.getField('medicalInfo2');
	const sponsorSignature = form.getField('sponsorSignature');
	const signingDate = form.getField('signingDate');

	childName.setText(child.ucName);
	childRelationship.setText();
	sponsorName.setText();
	otherNames.setText();
	sponsorCoo.setText();
	sponsorDob.setText();
	sponsorPhone.setText();
	secondaryPhone.setText();
	email.setText();
	sponsorLanguage.setText('Espanol');
	sponsorAddress.setText();
	sponsorCity.setText();
	sponsorState.setText();
	sponsorZip.setText();
	acgName.setText();
	acgDob.setText();
	acgPhone.setText();
	acgAddress.setText();
	acgCity.setText();
	acgState.setText();
	acgZip.setText();
	acgRelationship.setText();
	sponsorAcg.setText();
	carePlan.setText(`
    Nos encargamos de darle a comer a ${getGender(uc).pronoun} nin${
		getGender(uc).ending
	} llevarl${
		getGender(uc).ending
	} a la escuela, a sus citas medicas, \n \n y a su cita del acorte.`);
	financialSupport.setText();
	medicalInfo1.setText(
		`Nadie en casa sufre de ninguna enfermedad grave/contagiosa.  `
	);
	medicalInfo2.setText(
		`No hay ningun condicion medica que ${getGender(uc).pronoun} nin${
			getGender(uc).ending
		} puede tener. `
	);
	sponsorSignature.setText();
	signingDate.setText(new Date().toLocaleDateString());
	const pdfBytes = await pdfDoc.save();
	fs.writeFileSync(`${child.aNumber}_SP_DO_FRA.pdf`, pdfBytes);
}

console.log(fillFRA(uc));
