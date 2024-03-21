module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            components: "./src/components", // Define your aliases
            screens: "./src/screens",
            assets: "./src/assets",
            images: "./src/assets/images",
            icons: "./src/assets/icons",
            collabScreens: "./src/assets/collabScreen",
            constants: "./src/constants",
            navigations: "./src/navigations",
            // Add more aliases as needed
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
    
  };
};
