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
    const deleteCertificateParams = {
      CertificateArn: event.PhysicalResourceId
    };
    console.log(JSON.stringify(deleteCertificateParams));
    acm.deleteCertificate(deleteCertificateParams, (err) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          response.send(event, context, response.SUCCESS);
        } else {
          error(err);
        }
      } else {
        response.send(event, context, response.SUCCESS);
      }
    });
  } else if (event.RequestType === 'Create') {
    const awaitDomainValidationOptions = (certificateArn) => {
      console.log(`awaitDomainValidationOptions(${certificateArn})`);
      const wait = () => {
        if (context.getRemainingTimeInMillis() > 2*WAIT_IN_MS) {
          setTimeout(() => awaitDomainValidationOptions(certificateArn), WAIT_IN_MS);
        } else {
          error(new Error(`timeout: ${context.getRemainingTimeInMillis()} ms remaining`));
        }
      }
      const describeCertificateParams = {
        CertificateArn: certificateArn
      };
      console.log(JSON.stringify(describeCertificateParams));
      acm.describeCertificate(describeCertificateParams, (err, describeCertificateData) => {
        if (err) {
          error(err);
        } else {
          console.log(JSON.stringify(describeCertificateData));
          if ('DomainValidationOptions' in describeCertificateData.Certificate && describeCertificateData.Certificate.DomainValidationOptions.length > 0) {
            if ('ResourceRecord' in describeCertificateData.Certificate.DomainValidationOptions[0]) {
              response.send(event, context, response.SUCCESS, {
                ValidationResourceRecordName: describeCertificateData.Certificate.DomainValidationOptions[0].ResourceRecord.Name,
                ValidationResourceRecordType: describeCertificateData.Certificate.DomainValidationOptions[0].ResourceRecord.Type,
                ValidationResourceRecordValue: describeCertificateData.Certificate.DomainValidationOptions[0].ResourceRecord.Value
              }, certificateArn);
            } else {
              wait();
            }
          } else {
            wait();
          }
        }
      });
    };
    const requestCertificateParams = {
      DomainName: `${event.ResourceProperties.HostedZoneName}`,
      ValidationMethod: 'DNS',
      SubjectAlternativeNames: [`*.${event.ResourceProperties.HostedZoneName}`],
      IdempotencyToken: event.RequestId.replace(/\-/g, '')
    };
    console.log(JSON.stringify(requestCertificateParams));
    acm.requestCertificate(requestCertificateParams, (err, requestCertificateData) => {
      if (err) {
        error(err);
      } else {
        console.log(JSON.stringify(requestCertificateData));
        awaitDomainValidationOptions(requestCertificateData.CertificateArn);
      }
    });
  } else {
    error(new Error(`unsupported request type: ${event.RequestType}`));
  }
};
