import React, { useCallback, useEffect, useState } from "react";
import { ZoomMtg } from "@zoomus/websdk";

import "./App.css";

const App = () => {
  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  const signatureEndpoint = "http://localhost:4000";

  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  const sdkKey = "";
  const role = 0;
  const leaveUrl = "http://localhost:3000";

  useEffect(() => {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.9.0/lib", "/av");

    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    // loads language files, also passes any error messages to the ui
    ZoomMtg.i18n.load("en-US");
    ZoomMtg.i18n.reload("en-US");
  }, []);

  const [formValues, setFormValues] = useState({ passWord: "" });

  const startClient = useCallback(
    (signature) => {
      document.getElementById("zmmtg-root").style.display = "block";

      ZoomMtg.init({
        leaveUrl: leaveUrl,
        success: (success) => {
          console.log(success);

          ZoomMtg.join({
            signature: signature,
            meetingNumber: formValues.meetingNumber,
            userName: formValues.userName,
            sdkKey: sdkKey,
            userEmail: formValues.userEmail,
            passWord: formValues.passWord,
            success: (success) => {
              console.log(success);
            },
            error: (error) => {
              console.log(error);
            },
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    },
    [formValues, sdkKey]
  );

  const getSignature = useCallback(() => {
    fetch(signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: formValues.meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log({ responseSignature: response.signature });
        startClient(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [formValues.meetingNumber, startClient]);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleClientView = useCallback(() => {
    const signature = getSignature();
    startClient(signature);
  }, [getSignature, startClient]);

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Client</h1>

        <input
          name="userName"
          placeholder="Display Name"
          value={formValues.userName}
          onChange={handleInput}
        />

        <input
          name="userEmail"
          placeholder="Email"
          value={formValues.userEmail}
          onChange={handleInput}
        />

        <input
          name="meetingNumber"
          placeholder="Meeting ID"
          value={formValues.meetingNumber}
          onChange={handleInput}
        />

        <input
          name="passWord"
          placeholder="Password"
          value={formValues.passWord}
          onChange={handleInput}
        />

        <button onClick={handleClientView}>Join Meeting</button>

        <a href="/component">Component View</a>
      </main>
    </div>
  );
};

export default App;
