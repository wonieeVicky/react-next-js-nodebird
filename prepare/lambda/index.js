const AWS = require('aws-sdk');
const sharp = require('sharp');

// 별도로 AWS.config.update({}) 미실행 : lambda는 AWS 소스코드를 업로드 후 사용되므로
// 알아서 내 사용자 정보를 가져온다.
// 백엔드 서비스는 EC2에서 돌아가므로 넣어줘야함
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // vicky-nodebird-s3
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/123123_abc.png
  console.log(Bucket, key);

  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('filename', filename, 'ext', ext);

  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log('original', s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: 'inside' })
      .toFormat(requiredFormat)
      .toBuffer();
    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        Body: resizedImage,
      })
      .promise();
    console.log('put', resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (err) {
    console.error(err);
    return callback(err);
  }
};
