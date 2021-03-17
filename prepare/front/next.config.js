const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // ANALYZE라는 환경변수가 활성화되어야 실행된다.
});

module.exports = withBundleAnalyzer({
  // 기존 compresion-webpack-plugin이 내장형으로 포함됨
  // 해당 옵션을 통해 빌드파일을 gzip로 압축
  // 브라우저는 이를 알아서 해당 압축을 풀어서 사용자에게 보여줄 수 있다.
  // js, css 파일이 있으면 무조건 해당 메서드를 사용해서 파일을 줄여주는 것이 좋다.
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval', // hidden-source-map 하지않으면 개발에서 소스코드가 모두 노출된다.
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\ko$/),
      ],
      // 커스텀 해야할 것들이 많아지면 하위 설정에 불변성을 지키는 것이 매우 번거로워지므로
      // immer를 사용해서 불변성을 간편하게 지켜주는 것도 좋다.
      /* module: {
        ...config.module,
        rules: [
          ...config.module,
          rules: [
            ...config.module.rules,
            {

            }
          ]
        ]
      } */
    };
  },
});
