import React from "react";
import Recorder from "../components/recorder";

const Landing = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginLeft: "10vh",
      }}
    >
      <Recorder></Recorder>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    backgroundColor: "#282c34",
    padding: "20px",
    color: "white",
  },
  main: {
    margin: "20px 0",
  },
  footer: {
    marginTop: "20px",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
  },
};

export default Landing;
