const test = require('tape');
const { s3Fetch } = require('..');

test('test', t => {
  t.plan(1);

  const pambda = s3Fetch({
    s3Uri: 's3://bucket/key',
  });

  const lambda = pambda();

  t.equal(typeof(lambda), 'function');
});
