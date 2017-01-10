module.exports = {
    entry: './src/dbind.js',
    output: {
        path: './lib',
        filename: 'dbind.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    }
}