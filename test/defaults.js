const test = require('ava');
const cfntest = require('@cfn-modules/test');

test.serial('defaults', async t => {
  const stackName = cfntest.stackName();
  try {
    t.log(await cfntest.createStack(`${__dirname}/defaults.yml`, stackName, {
      HostedZoneId: 'Z06496441UUZUWB5DC4QT'
    }));
    // what could we test here?
  } finally {
    t.log(await cfntest.deleteStack(stackName));
    t.pass();
  }
});
