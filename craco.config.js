module.exports = {
  style: {
    postcssOptions: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Aquí puedes configurar tus middlewares si es necesario
      return middlewares;
    },
  },
  babel: {
    presets: [
      '@babel/preset-env',
      // Explicitly set the modern, automatic JSX runtime
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    loaderOptions: (babelLoaderOptions) => {
      babelLoaderOptions.sourceType = "unambiguous";
      return babelLoaderOptions;
    }
  },
};
