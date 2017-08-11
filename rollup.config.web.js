import resolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/web.js',
    format: 'iife',
    plugins: [
        resolve()
    ],
    dest: 'hum-drum.web.js'
};