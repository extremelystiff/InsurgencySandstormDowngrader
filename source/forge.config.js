module.exports = {
  packagerConfig: {
    // This tells the packager to bundle your app's source code into an asar archive.
    // It's good practice and makes the app feel more like a single unit.
    asar: true,
    // Define the name of the final executable file.
    executableName: 'SandstormDowngrader',
    // (Optional) Add an icon! Create an `icon.ico` file in your Fiddler project.
    // The icon must be a .ico file for Windows.
    icon: './icon' // The .ico extension is added automatically
  },
  makers: [
    {
      // This is the maker that creates a portable ZIP file instead of an installer.
      name: '@electron-forge/maker-zip',
      platforms: ['win32'], // Specify we are building for Windows
    },
  ],
  // This section is used to customize the metadata within the final .exe file.
  // It's very important for giving your app a proper identity.
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  // Although package.json is overwritten, this part of the config helps
  // ensure the final executable has the correct properties.
  rebuildConfig: {},
  publishers: [],
  // This configuration is for the Squirrel.Windows maker, which we aren't using,
  // but it's good practice to keep it here in case you want to switch back.
  // We've replaced its functionality with maker-zip above.
  windowsStoreConfig: {
    packageName: '',
    name: 'sandstormdowngrader'
  }
};

// We manually inject the productName and author into the packager config
// to ensure it overrides any defaults from the auto-generated package.json.
module.exports.packagerConfig.name = "Advanced Sandstorm Downgrader";
module.exports.packagerConfig.productName = "Advanced Sandstorm Downgrader";
module.exports.packagerConfig.author = "ExtremelyStiff";