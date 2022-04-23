let sslRedirect = require("heroku-ssl-redirect").default;
const onHeaders = require("on-headers");
const cors = require("cors");
const path = require("path");
const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

if ("development" === process.env.NODE_ENV) {
  require("dotenv").config();
}

function getDirectoryListing(directory) {
  return fs.readdirSync(directory).map((entry) => path.join(directory, entry));
}

function createNoCacheStaticAssetHandler(filePath) {
  return (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    // the response object is passed as `this` of the handler function
    onHeaders(res, function () {
      this.removeHeader("etag");
    });

    res.sendFile(filePath, {
      cacheControl: false,
    });
  };
}

const BUILD_DIR = path.join(__dirname, "./dist");
const DISABLE_BROWSER_CACHE_FOR = [path.join(BUILD_DIR, "index.html")];

const ROOT_STATIC_ASSETS = getDirectoryListing(BUILD_DIR).filter(
  (entry) => !DISABLE_BROWSER_CACHE_FOR.includes(entry)
);

app.use(cors());
app.use(sslRedirect());
ROOT_STATIC_ASSETS.forEach((fullPath) => {
  const url = "/" + path.basename(fullPath);
  app.use(url, express.static(fullPath));
  console.log(`Serving ${url} from ${fullPath}`);
});

app.get(
  "/*",
  createNoCacheStaticAssetHandler(path.join(BUILD_DIR, "index.html"))
);

app.listen(port, () => {
  console.log(`Server is up on :${port}`);
});
