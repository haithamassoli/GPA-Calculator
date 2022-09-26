module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@Components": "./src/components",
            "@Navigation": "./src/navigation",
            "@Screens": "./src/screens",
            "@Types": "./src/types",
            "@GlobalStyle": "./src/styles",
            "@Assets": "./assets",
            "@Utils": "./src/utils",
            "@Store": "./src/store",
            "@Src": "./src",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  };
};
