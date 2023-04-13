import AWS from "aws-sdk";

const sendEmail = async (errorSource) => {
  console.log("trigger email notification");
  const sendTo = ["rajeev@daffodilhealth.com"];
  const message = `<div style='font-size:16px;'> Our server having some problem with ${errorSource}. Please check as soon as possible</div>`;
  const textMessage = `Our server having some problem with ${errorSource}. Please check as soon as possible`;
  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const params = {
    Destination: {
      ToAddresses: sendTo,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        Text: {
          Charset: "UTF-8",
          Data: textMessage,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Server Error",
      },
    },
    Source: "Engineering<team@daffodilhealth.com>",
  };
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
  console.log(sendPromise);
  sendPromise
    .then((data) => {
      console.log(data.MessageId);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });
};
export default sendEmail;
