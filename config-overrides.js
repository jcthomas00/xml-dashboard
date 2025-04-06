module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer/"),
    "timers": require.resolve("timers-browserify"),
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "util": require.resolve("util/"),
    "assert": require.resolve("assert/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url/"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "net": false,
    "tls": false,
    "zlib": require.resolve("browserify-zlib"),
  };

  config.plugins = [
    ...config.plugins,
    new (require("webpack")).ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ];

  return config;
}; 