import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Recorder = () => {
  const [data, setData] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [error, setError] = useState(""); // State to hold error messages
  const [language, setLanguage] = useState("en"); // State to manage the language
  const [editableTranscript, setEditableTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [completedText, setCompletedText] = useState(""); // Add state to hold the completed text
  const messagesEndRef = useRef(null);

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
      setEnglishText(response.data.translation); // Set the English translation

      return response.data.text; // Return the completed text
    } catch (error) {
      console.error("Error downloading audio:", error);
      setError("Failed to download audio.");
      return null;
    }
  };

  // Handle the user sending a message

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

  // Verbal commands to delete the transcript

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

  // Scroll to the bottom of the conversation

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Scroll to the bottom of the conversation

  const getLanguageName = (language) => {
    switch (language) {
      case "fi":
        return "Finnish";
      case "es-MX":
        return "Spanish";
      case "de-DE":
        return "German";
      case "fr-FR":
        return "French";
      case "en":
        return "English";
      default:
        return "English";
    }
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
      <style>
        {`
        /* Custom scrollbar styles */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        div::-webkit-scrollbar-track {
          background-color: #f1f1f1;
          border-radius: 4px;
        }`}
      </style>
      <div style={{ display: "flex", alignItems: "center" }}>
        <MicIcon style={{ fontSize: "20px", marginRight: "10px" }}></MicIcon>
        <p style={{ margin: "0", marginTop: "1px" }}>Listening in</p>
        <select
          className="btn btn-primary"
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="en">English</option>
          <option value="es-MX">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="fi">Finnish</option>
        </select>
      </div>
      {/* <h4>Listening in {getLanguageName(language)}</h4> */}
      {/* Display the current language */}
      <br></br>
      {/* Display the conversation */}
      {conversation.length > 0 && (
        <div
          style={{
            width: "100%",
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "12px", // Rounded corners
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
            transform: "scale(0.95)", // Start smaller
            opacity: 0, // Initially invisible
            animation: "growIn 0.5s ease forwards", // Animation to grow
          }}
        >
          {conversation.map(
            (message, index) =>
              message.text && (
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
                      padding: "8px 12px",
                      borderRadius: "12px",
                      backgroundColor:
                        message.sender === "user" ? "#4c97a8" : "#e3e5e6",
                      color: message.sender === "user" ? "#f2f9fa" : "#070808",
                      maxWidth: "60%",
                      wordWrap: "break-word",
                      animation: "growIn 0.3s ease forwards", // Animation to grow
                    }}
                  >
                    {message.text}
                  </span>
                </div>
              )
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      <style>
        {`
        @keyframes growIn {
          0% {
            transform: scale(0.95); /* Smaller at the start */
            opacity: 0; /* Invisible at the start */
          }
          100% {
            transform: scale(1); /* Full size */
            opacity: 1; /* Fully visible */
          }
        }
      `}
      </style>
      <audio
        src={data}
        autoPlay
        controls
        style={{ width: "100%", margin: "10px 0" }}
      />
      {/* Display the editable transcript */}
      <input
        type="text"
        placeholder="Type your message here..."
        value={editableTranscript}
        onChange={(e) => setEditableTranscript(e.target.value)}
        style={{
          width: "calc(100% - 40px)",
          padding: "10px",
          margin: "10px 20px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
      
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
      {/* Just show the english version */}
      <br />
      <p>{englishText}</p> {/* Display the completed text */}
      <br />
    </div>
  );
};

export default Recorder;
