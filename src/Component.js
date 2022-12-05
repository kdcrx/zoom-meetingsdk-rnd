import React, { useCallback, useState } from "react";
import ZoomMtgEmbedded from "@zoomus/websdk/embedded";

import "./App.css";

const App = () => {
  const client = ZoomMtgEmbedded.createClient();

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  var signatureEndpoint = "http://localhost:4000";

  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  const sdkKey = "UlNxDsDEHalw8fA9NsGNwiaqQvFVelpV6dwf";
  const role = 0;

  const [formValues, setFormValues] = useState({ passWord: "" });

  const startMeeting = useCallback(
    (signature) => {
      let meetingSDKElement = document.getElementById("meetingSDKElement");

      client.init({
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        customize: {
          meetingInfo: [
            "topic",
            "host",
            "mn",
            "pwd",
            "telPwd",
            "invite",
            "participant",
            "dc",
            "enctype",
          ],
          toolbar: {
            buttons: [
              {
                text: "Custom Button",
                className: "CustomButton",
                onClick: () => {
                  console.log("custom button");
                },
              },
            ],
          },
        },
      });

      client.join({
        sdkKey: sdkKey,
        signature: signature,
        meetingNumber: formValues.meetingNumber,
        password: formValues.passWord,
        userName: formValues.userName,
        userEmail: formValues.userEmail,
      });
    },
    [
      client,
      formValues.meetingNumber,
      formValues.passWord,
      formValues.userEmail,
      formValues.userName,
    ]
  );

  const getSignature = useCallback(
    (e) => {
      e.preventDefault();

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
          startMeeting(response.signature);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [formValues.meetingNumber, signatureEndpoint, startMeeting]
  );

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Component</h1>

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
          placeholder="Meeting Passcode"
          value={formValues.passWord}
          onChange={handleInput}
        />

        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <button onClick={getSignature}>Join Meeting</button>
        <a href="/">Client View</a>
      </main>
    </div>
  );
};

export default App;
