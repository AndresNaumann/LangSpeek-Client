import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import phrasesEsData from "../data/phrases_es.json";
import phrasesFiData from "../data/phrases_fi.json";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";

const Recorder = ({ lessonData }) => {
  const [data, setData] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [completedText, setCompletedText] = useState("");
  const [randomPhrases, setRandomPhrases] = useState([]);
  const [customDictionary, setCustomDictionary] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showDictionary, setShowDictionary] = useState(false);

  //// HANDLE DOWNLOAD ////

  const handleDownloadAudio = async (text, lessonData) => {
    try {
      let response = await axios.post(
        "http://localhost:4000/",
        { 
          text, 
          translation: englishText,
          lessonData: lessonData || null,  
        },
        { responseType: "json" }
      );
      const audioBlob = new Blob(
        [
          new Uint8Array(
            atob(response.data.audio)
              .split("")
              .map((char) => char.charCodeAt(0))
          ),
        ],
        { type: "audio/mp3" }
      );
      setData(URL.createObjectURL(audioBlob));
      setCompletedText(response.data.text);
      setEnglishText(response.data.translation);
      return response.data.text;
    } catch (error) {
      console.error("Error downloading audio:", error);
      setError("Failed to download audio.");
      return null;
    }
  };

  //// HANDLE GETTING A MESSAGE BACK FROM THE API ////

  const handleSendMessage = async () => {
    if (!editableTranscript.trim()) return;
    const userMessage = { text: editableTranscript, sender: "user" };
    const botResponseText = await handleDownloadAudio(editableTranscript, lessonData);
    if (botResponseText) {
      setConversation([
        ...conversation,
        userMessage,
        { text: botResponseText, sender: "bot" },
      ]);
    }
    setEditableTranscript("");
    resetTranscript();
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands: [{ command: "delete", callback: () => resetTranscript() }],
  });

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language }).catch(
        () => {
          setError("Microphone permission denied or not supported.");
        }
      );
    } else {
      setError("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition, language]);

  useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    setRandomPhrases(
      (language === "es-MX"
        ? phrasesEsData.common_phrases_spanish
        : phrasesFiData.common_phrases_finnish || []
      ).slice(0, 4)
    );
  }, [language]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [conversation]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleShowEnglish = (index) => {
    const updatedConversation = [...conversation];
    updatedConversation[index].text = englishText;
    setConversation(updatedConversation);
  };

  const handleShowOriginal = (index) => {
    const updatedConversation = [...conversation];
    updatedConversation[index].text = completedText;
    setConversation(updatedConversation);
  };

  const handleAddToDictionary = (word) => {
    setCustomDictionary([...customDictionary, word]);
  };

  const renderWordPopover = (word) => (
    <Popover id="popover-basic">
      <Popover.Body>
        <Button size="sm" onClick={() => handleAddToDictionary(word)}>
          Add to Dictionary
        </Button>
      </Popover.Body>
    </Popover>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div
      className="container d-flex justify-content-center p-4"
      style={{ position: "relative" }}
    >
      <div className="w-200" style={{ maxWidth: "800px" }}>
        
        {/* Dictionary Sidebar */}
        <button
          className="btn mb-3"
          style={{
            position: "fixed",
            top: "70px",
            right: "1rem",
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            transition: "box-shadow 0.2s ease-in-out",
            display: showDictionary ? "none" : "block", // Hide button when dictionary is shown
            opacity: showDictionary ? 0 : 1, // Fade out when dictionary is shown
          }}
          onClick={() => setShowDictionary(!showDictionary)}
        >
          Dictionary
        </button>
        <div
          className={`dictionary-sidebar ${showDictionary ? "show" : ""}`}
          style={{
            position: "fixed",
            top: "70px",
            right: "0",
            height: "calc(100% - 70px)",
            width: "250px",
            backgroundColor: "white",
            boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)", // Lighter shadow
            padding: "1rem",
            overflowY: "auto",
            transition: "transform 0.3s ease-in-out",
            transform: showDictionary ? "translateX(0)" : "translateX(100%)",
            zIndex: 999,
            borderRadius: "8px", // Rounded corners
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowDictionary(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              cursor: "pointer",
            }}
          >
            &times; {/* "X" symbol */}
          </button>

          {/* Dictionary Content */}
          <h5>Dictionary</h5>
          <ul className="list-unstyled">
            {customDictionary.map((word, index) => (
              <li key={index}>
                <strong>{word}</strong>
              </li>
            ))}
          </ul>
        </div>
        {/* Main Content */}
        <div>
          <h4>{lessonData && <p>Lesson Name: {lessonData.lessonTitle}</p>}</h4>

          <div className="d-flex align-items-center mb-4">
            <MicIcon className="me-4" />
            <p className="m-0">Listening in</p>
            <select
              className="form-select ms-4"
              onChange={handleLanguageChange}
              style={{ maxWidth: "120px" }}
            >
              <option value="en">English</option>
              <option value="es-MX">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="fi">Finnish</option>
            </select>
          </div>

          <div
            className="conversation-container border rounded p-3 mb-3"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`d-flex ${
                  message.sender === "user" ? "justify-content-end" : ""
                }`}
              >
                <span
                  className={`p-2 rounded ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "75%", wordWrap: "break-word" }}
                >
                  {message.text.split(" ").map((word, i) => (
                    <OverlayTrigger
                      key={i}
                      trigger="click"
                      placement="top"
                      overlay={renderWordPopover(word)}
                    >
                      <span className="mx-1" style={{ cursor: "pointer" }}>
                        {word}
                      </span>
                    </OverlayTrigger>
                  ))}
                  {message.sender === "bot" && (
                    <>
                      <button
                        className="btn btn-link btn-sm p-0 ms-2"
                        onClick={() => handleShowEnglish(index)}
                      >
                        English
                      </button>
                      <button
                        className="btn btn-link btn-sm p-0 ms-2"
                        onClick={() => handleShowOriginal(index)}
                      >
                        Original
                      </button>
                    </>
                  )}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <audio src={data} autoPlay controls className="w-100 mb-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message here..."
            value={editableTranscript}
            onChange={(e) => setEditableTranscript(e.target.value)}
            className="form-control mb-3"
          />

          <div className="d-flex gap-2 flex-wrap mb-3">
            {randomPhrases.map((phrase, index) => (
              <button
                key={index}
                className="btn btn-light btn-sm"
                onClick={() =>
                  setEditableTranscript((prev) =>
                    `${prev} ${phrase.spanish}`.trim()
                  )
                }
              >
                <strong>
                  {language === "es-MX" ? phrase.spanish : phrase.finnish}
                </strong>
              </button>
            ))}
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleSendMessage}>
              Send
            </button>
            <button className="btn btn-danger" onClick={() => setEditableTranscript("")}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recorder;
