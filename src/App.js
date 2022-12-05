import React from "react";
import { Route, Routes } from "react-router-dom";

import ClientView from "./Client";
import ComponentView from "./Component";

const App = () => {
  return (
    <Routes>
      <Route path={"/"} element={<ClientView />} />
      <Route path={"/component"} element={<ComponentView />} />
    </Routes>
  );
};

export default App;
