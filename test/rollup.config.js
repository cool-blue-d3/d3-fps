/**
 * Created by cool.blue on 2/04/2017.
 */
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import bundleWorker from 'rollup-plugin-bundle-worker';
// import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'test',
  dest: 'bundle.js',
  plugins: [
    postcss({
      extensions: [ '.css' ]
    }),
    resolve({ jsnext: true }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    // (process.env.NODE_ENV === 'production' && uglify()),
    bundleWorker({include: 'worker'}),
  ]
};