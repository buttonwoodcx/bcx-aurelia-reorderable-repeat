// A mini dev server.
// Uses standard Nodejs http or https server.
// Uses "connect" for various middlewares.
// Uses "socket.io" for live-reload in watch mode.
// Uses "open" to automatically open user browser.
const connect = require("connect");
const _open = require("open");
const serveStatic = require("serve-static");
const http = require("http");
const historyApiFallback = require("connect-history-api-fallback");
const injector = require("connect-injector");
const socketIO = require("socket.io");

// Use dedicated path for the dev server socket.io.
// In order to avoid possible conflict with user app socket.io.
const socketIOPath = "/__dev_socket.io";
// Tell user browser to reload.
const socketIOSnippet = `
<script src="${socketIOPath}/socket.io.js"></script>
<script>
  var socket = io({path: '${socketIOPath}'});
  socket.on('reload', function() {
    console.log('Reload the page');
    window.location.reload();
  });
</script>
`;
let io;

exports.run = function ({
  port = 9000,
  open = false, // automatically open a browser window
} = {}) {
  const app = connect()
    // Inject socket.io snippet for live-reload.
    // Note connect-injector is a special middleware,
    // has to be applied before all other middlewares.
    .use(injector(
      (req, res) => {
        const contentType = res.getHeader("content-type");
        return contentType &&
          (contentType.toLowerCase().indexOf("text/html") >= 0);
      },
      (content, req, res, callback) => {
        const injected = content.toString().replace(
          /<\/head>/i,
          socketIOSnippet + "\n</head>",
        );
        callback(null, injected);
      },
    ))
    // connect-history-api-fallback is a tool to help SPA dev.
    // So in dev mode, http://localhost:port/some/route will get
    // the same /index.html as content, instead of 404 at /some/route.html
    .use(historyApiFallback())
    .use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    })
    .use(serveStatic("."));

  const server = http.createServer(app);
  io = socketIO(server, { path: socketIOPath });
  server.listen(port);
  const url = `http://localhost:${port}`;
  console.log(`\x1b[36m\nDev server is started at: ${url}\n\x1b[0m`);
  if (open) _open(url);
};

exports.reload = function () {
  io && io.emit("reload");
};
