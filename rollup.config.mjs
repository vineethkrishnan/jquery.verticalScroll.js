import terser from '@rollup/plugin-terser';

var banner = '/*! @vineethnkrishnan/jquery.verticalscroll | Vineeth N Krishnan | MIT Licensed */';

export default [
  // UMD build (minified, for CDN / script tags)
  {
    input: 'src/js/index.js',
    external: ['jquery'],
    output: {
      file: 'dist/js/jquery.verticalscroll.min.js',
      format: 'umd',
      name: 'jQueryVerticalScroll',
      globals: { jquery: 'jQuery' },
      sourcemap: true,
      banner: banner
    },
    plugins: [
      terser({
        output: { comments: /^!/ }
      })
    ]
  },
  // UMD build (unminified, for development / testing)
  {
    input: 'src/js/index.js',
    external: ['jquery'],
    output: {
      file: 'dist/js/jquery.verticalscroll.js',
      format: 'umd',
      name: 'jQueryVerticalScroll',
      globals: { jquery: 'jQuery' },
      sourcemap: true,
      banner: banner
    }
  },
  // ESM build (for modern bundlers)
  {
    input: 'src/js/index.js',
    external: ['jquery'],
    output: {
      file: 'dist/js/jquery.verticalscroll.esm.js',
      format: 'es',
      sourcemap: true,
      banner: banner
    }
  }
];
