module.exports = function(ctx) {
    var plugins = [
        require('autoprefixer')
    ];

    // Minify when outputting to dist
    if (ctx.env === 'production') {
        plugins.push(require('cssnano')({ preset: 'default' }));
    }

    return { plugins: plugins };
};
