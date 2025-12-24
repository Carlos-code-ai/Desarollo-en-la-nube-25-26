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
};
