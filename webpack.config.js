module.exports = {
    entry: './src/observer/Observer.js',
    output: {
        path: './',
        filename: 'index.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-class-properties']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    }
}