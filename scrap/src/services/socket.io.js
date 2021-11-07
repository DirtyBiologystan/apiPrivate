const io = require("socket.io")({
  cors: {
    origin: "*",
  },
  serveClient: false,
});

io.listen(3000);

io.on("connection", (socket) => {
  socket.on("newPixel",()=>{
    socket.join("newPixel");
  });
  socket.on("changePixel",()=>{
    socket.join("changePixel");
  });
  socket.on("total",()=>{
    socket.join("total");
  });
});


module.exports= io;
