const AWS = require('aws-sdk');
const response = require('cfn-response');
const acm = new AWS.ACM({apiVersion: '2015-12-08'});

const WAIT_IN_MS = 5000;

exports.handler = (event, context, cb) => {
  console.log(JSON.stringify(event));
  const error = (err) => {
    console.log(JSON.stringify(err));
    response.send(event, context, response.FAILED);
  };
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS);
  } else if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const awaitStatus = () => {
      console.log(`awaitStatus()`);
      const wait = () => {
        if (context.getRemainingTimeInMillis() > 2*WAIT_IN_MS) {
          setTimeout(awaitStatus, WAIT_IN_MS);
        } else {
          error(new Error(`timeout: ${context.getRemainingTimeInMillis()} ms remaining`));
        }
      }
      const describeCertificateParams = {
        CertificateArn: event.ResourceProperties.CertificateArn
      };
      console.log(JSON.stringify(describeCertificateParams));
      acm.describeCertificate(describeCertificateParams, (err, describeCertificateData) => {
        if (err) {
          error(err);
        } else {
          console.log(JSON.stringify(describeCertificateData));
          if (describeCertificateData.Certificate.Status === 'PENDING_VALIDATION') {
             wait();
          } else if (describeCertificateData.Certificate.Status === 'ISSUED') {
             response.send(event, context, response.SUCCESS);
          } else {
            error(new Error(`unsupported certificate status: ${describeCertificateData.Certificate.Status}`));
          }
        }
      });
    };
    awaitStatus();
  } else {
    error(new Error(`unsupported request type: ${event.RequestType}`));
  }
};
