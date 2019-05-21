# pambda-s3-fetch

[Pambda](https://github.com/pambda/pambda) to render contents on S3 bucket.

## Installation

```
npm i pambda-s3-fetch
```

## Usage

``` javascript
import { compose, createLambda } from 'pambda';
import { binarySupport } from 'pambda-binary-support';
import { s3Fetch } from 'pambda-s3-fetch';

export const handler = createLambda(
  compose(
    binarySupport(['image/*']),

    s3Fetch({
      basePath: '/',
      s3Uri: 's3://bucket/base',
      mapper(path) {
        const mapping = {
          '/': '/index.html',
        };

        return mapping[path] || path;
      },
    })
  )
);

```

## s3Fetch(options)

- `options.basePath`
    - A base path for processing with this Pambda.
- `options.s3Uri`
    - A position on the S3 bucket to be rendered.
    - This option can not be combined with `bucket` or `key`.
- `options.bucket`
    - A name of the S3 bucket to be rendered.
- `options.key`
    - A key to be the base point on the S3 bucket to be rendered.
- `options.maxAge`
    - The duration in seconds of the cache.
- `options.mapper(path)`
    - A function for mapping the request path.

## License

MIT
