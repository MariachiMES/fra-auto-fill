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

	const newPdfDoc = await fillMedicalAuth(req.body);
	const documentTitle = `${req.body.aNumber}_Medical_Auth.pdf`;
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

async function fillMedicalAuth(child) {
	const pdfData = fs.readFileSync(
		path.join(__dirname, '../medical-auth-template.pdf'),
		{
			encoding: 'base64',
			flag: 'r',
		}
	);
	const pdfDoc = await PDFDocument.load(pdfData);

	const form = pdfDoc.getForm();

	const fields = form.getFields();

	fields.forEach((field) => {
		const fieldName = field.getName();
		console.log(fieldName);
	});
	const childName = form.getField('childName');
	const dob = form.getField('dob');
	const coo = form.getField('coo');
	const aNumber = form.getField('aNumber');
	const date1 = form.getField('date1');
	const date2 = form.getField('date2');

	childName.setText(child.childsName);
	coo.setText(child.coo);
	aNumber.setText(child.aNumber);
	dob.setText(child.childsDob);
	date1.setText(new Date().toLocaleDateString());
	date2.setText(new Date().toLocaleDateString());

	const pdfBytes = await pdfDoc.save();

	return pdfBytes;
}

module.exports = router;
