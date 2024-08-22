const { override, useBabelRc } = require('customize-cra');

module.exports = override(
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useBabelRc(),
  function (config) {
    return {
      ...config,
      ignoreWarnings: [
        ...(config.ignoreWarnings || []),
        {
          module: /node_modules\/html5-qrcode/,
        },
      ],
    };
  },
);
