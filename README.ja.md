# pambda-s3-fetch

S3バケット上のコンテンツをレンダリングする Pambda.

## Installation

```
npm i pambda-s3-fetch -S
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
    - この Pambda で処理する基点となるパス。
- `options.s3Uri`
    - レンダリング対象となるS3バケット上の位置。
    - `bucket` や `key` オプションと同時に指定することはできない。
- `options.bucket`
    - レンダリング対象となるS3バケットの名前。
- `options.key`
    - レンダリング対象となるS3バケット上の基点となるキー。
- `options.maxAge`
    - キャッシュの有効期限を秒数単位で指定する。
- `options.mapper(path)`
    - リクエストパスをマップするための関数。

## License

MIT
