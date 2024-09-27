import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Recorder = () => {
  // const [showTextbox, setShowTextbox] = useState(false);
  const [data, setData] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [error, setError] = useState(""); // State to hold error messages
  const [language, setLanguage] = useState("en"); // State to manage the language
  const [editableTranscript, setEditableTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [completedText, setCompletedText] = useState(""); // Add state to hold the completed text

  const handleDownloadAudio = async (text) => {
    try {
      let response = await axios.post(
        "http://localhost:4000/",
        { text, translation: englishText },
        {
          responseType: "json",
        }
      );

      // Decode base64 audio data
      const audioBase64 = response.data.audio;
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: "audio/mp3" });

      let audioUrl = window.URL.createObjectURL(audioBlob);
      setData(audioUrl);
      setCompletedText(response.data.text); // Set the completed text

      return response.data.text; // Return the completed text
    } catch (error) {
      console.error("Error downloading audio:", error);
      setError("Failed to download audio.");
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (editableTranscript.trim() === "") return;

    const userMessage = { text: editableTranscript, sender: "user" };

    // Send the user's message to the server and get the bot's response
    const botResponseText = await handleDownloadAudio(editableTranscript);

    if (botResponseText) {
      const botResponse = { text: botResponseText, sender: "bot" };
      setConversation([...conversation, userMessage, botResponse]);
    }

    setEditableTranscript("");
    resetTranscript();
  };

  const commands = [
    {
      command: "delete",
      callback: () => resetTranscript(),
    },
    {
      command: "puista",
      callback: () => resetTranscript(),
    },
  ];

  // Let the contents of the transcipt variable change to reflect the string of words that have been spoken

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  // Implement speech recognition

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language }).catch(
        (error) => {
          console.error("Error starting speech recognition:", error);
          setError("Microphone permission denied or not supported.");
        }
      );
    } else {
      setError("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition, language]); // Restart listening when language changes

  // Allow the user to type whatever they want into the transcript.

  useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  // Handle the user desiring to change the language

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h4>Listening in {language === "fi" ? "Finnish" : "English"}</h4>{" "}
      {/* Display the current language */}
      <MicIcon style={{ fontSize: "50px" }}></MicIcon>
      <div
        style={{
          width: "100%",
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {conversation.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor:
                  message.sender === "user" ? "#d1e7dd" : "#f8d7da",
              }}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={editableTranscript}
        onChange={(e) => setEditableTranscript(e.target.value)}
      />
      <audio src={data} autoPlay controls />
      <br />
      <div style={{ display: "flex", margin: "20px" }}>
        <button
          className="btn btn-primary"
          style={{ margin: "20px" }}
          onClick={handleSendMessage}
        >
          Send
        </button>
        <button
          className="btn btn-danger"
          style={{ margin: "20px" }}
          onClick={resetTranscript}
        >
          Clear
        </button>
        <br />
      </div>
      <p>{completedText}</p> {/* Display the completed text */}
      <br />
      <p>{englishText}</p> {/* Display the completed text */}
      <br />
      <p>Set Listening Language</p>
      <div style={{ display: "flex" }}>
        <button
          className="btn btn-primary"
          style={{ margin: "20px" }}
          onClick={() => handleLanguageChange("fi")}
        >
          Finnish
        </button>
        <button
          className="btn btn-primary"
          style={{ margin: "20px" }}
          onClick={() => handleLanguageChange("en")}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default Recorder;
