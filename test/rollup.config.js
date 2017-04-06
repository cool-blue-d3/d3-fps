/**
 * Created by cool.blue on 2/04/2017.
 */
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'test',
  dest: 'bundle.js',
  plugins: [
    postcss({
      extensions: [ '.css' ]
    }),
    resolve({ jsnext: true })
  ]
};