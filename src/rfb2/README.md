private fork of rfb2/rfbclient to handle our particular use case:

* copy rfb2 and change this:

  if (cli.titleLength === 0) {
  cli.title = "";
  delete cli.titleLength;
  this.emit('connect');
  } else {
  stream.get(cli.titleLength, function(titleBuf) {
  cli.title = titleBuf.toString();
  delete cli.titleLength;
  this.emit('connect');
  });
  }

  RfbClient.prototype.end = function()
  {
  this.stream.destroy();
  //this.stream.end();
  }
