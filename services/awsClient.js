require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(filePath, keyName) {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: keyName,
    Body: fileStream,
  };

  try {
    const result = await s3.send(new PutObjectCommand(uploadParams));
    console.log('Upload success:', result);
  } catch (err) {
    console.error('Upload error:', err);
  }
}

// Example usage
// uploadFile('./test.jpg', 'uploads/test.jpg');
module.exports = {
  uploadFile,
};
