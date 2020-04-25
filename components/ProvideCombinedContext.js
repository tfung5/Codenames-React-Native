// Credit: https://stackoverflow.com/questions/53988193/how-to-get-multiple-static-contexts-in-new-context-api-in-react-v16-6

import React from "react";
import SocketContext from "./SocketContext";
import GameContext from "./GameContext";
import CombinedContext from "./CombinedContext";

// This is a reusable piece that could be used by any component that requires both contexts.
const ProvideCombinedContext = (props) => {
  return (
    <SocketContext.Consumer>
      {(SocketContext) => (
        <GameContext.Consumer>
          {(GameContext) => (
            <CombinedContext.Provider value={{ SocketContext, GameContext }}>
              {props.children}
            </CombinedContext.Provider>
          )}
        </GameContext.Consumer>
      )}
    </SocketContext.Consumer>
  );
};

export default ProvideCombinedContext;
