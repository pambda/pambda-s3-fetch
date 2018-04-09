const assert = require('assert');
const { parse } = require('url');
const { join, relative } = require('path');
const { get } = require('caseless-get');
const { callbackify } = require('lambda-callbackify');

const s3Fetch = options => {
  const {
    s3Uri,
    maxAge = 3600 * 24 * 365,
    mapper = path => path,
    basePath = '/',
  } = options;

  let {
    bucket,
    key,
  } = options;

  const cacheControl = `no-cache, max-age=${maxAge}`;

  /*
   * Parse s3Uri.
   */
  if (s3Uri) {
    const urlObj = parse(s3Uri, true);

    assert(urlObj.protocol === 's3:', 'options.s3Uri must start with "s3:"');

    bucket = urlObj.hostname;
    key = urlObj.pathname;
  }

  if (!key) {
    key = '';
  } else if (key[0] === '/') {
    key = key.substr(1);
  }

  /*
   * Cache.
   */
  let S3 = null;

  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      const { httpMethod } = event;

      if (httpMethod !== 'GET' && httpMethod !== 'HEAD') {
        return next(event, context, callback);
      }

      let { path } = event;

      if (!path.startsWith(basePath)) {
        return next(event, context, callback);
      }

      path = mapper(path);

      if (!path) {
        return next(event, context, callback);
      }

      const s3 = context.S3 || S3 || (S3 = new (require('aws-sdk').S3)());

      const params = {
        Bucket: bucket,
        Key: join(key, relative(basePath, path)),
        IfNoneMatch: get(event.headers, 'If-None-Match'),
      };

      s3.getObject(params, (err, data) => {
        if (err) {
          if (err.statusCode === 304) {
            /*
             * Make for the client to use cache.
             */
            return callback(null, {
              statusCode: 304,
              headers: {},
            });
          }

          if (err.code === 'NoSuchKey') {
            return next(event, context, callback);
          }

          return callback(err);
        }

        callback(null, {
          statusCode: 200,
          headers: {
            'Cache-Control': cacheControl,
            'Content-Length': data.ContentLength,
            'Content-Type': data.ContentType,
            'ETag': data.ETag,
          },
          body: data.Body,
        });
      });
    };
  };
};

/*
 * Exports.
 */
exports.s3Fetch = s3Fetch;
