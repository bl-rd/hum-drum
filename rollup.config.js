import resolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/humdrum.js',
    format: 'cjs',
    plugins: [
        resolve()
    ],
    dest: 'index.js'
};