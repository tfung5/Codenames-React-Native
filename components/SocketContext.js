import React from "react";

const SocketContext = React.createContext({
  socket: null,
  setContext: () => {}
});

export default SocketContext;
