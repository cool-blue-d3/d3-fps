/**
 * Created by cool.blue on 2/04/2017.
 */
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  dest: 'bundle.js',
  format: 'umd',
  plugins: [
    resolve({ jsnext: true })
  ]
};