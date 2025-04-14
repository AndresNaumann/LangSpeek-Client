import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import phrasesEsData from "../data/phrases_es.json";
import phrasesFiData from "../data/phrases_fi.json";
import phrasesData from "../data/phrases.json";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";

const Recorder = ({ lessonData }) => {

  // console.log(userNativeLanguage);
  const [data, setData] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [completedText, setCompletedText] = useState("");
  const [randomPhrases, setRandomPhrases] = useState([]);
  const [customDictionary, setCustomDictionary] = useState([]);
  const [showEnglishIndex, setShowEnglishIndex] = useState(null);
  const [showOriginalIndex, setShowOriginalIndex] = useState(null);
  const [hoveredPhraseIndex, setHoveredPhraseIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showDictionary, setShowDictionary] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const fetchUserLanguage = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setLanguage(userData.openChatDefaultLearningLanguage || "en-US");
        }
      }
    };

    fetchUserLanguage();
  }, [auth]);

  //// HANDLE DOWNLOAD ////

  const handleDownloadAudio = async (text, lessonData) => {

    try {
      let response = await axios.post(
        "http://localhost:4000/",
        {
          text,
          lessonData
        },
        { responseType: "json" }
      );

      setCompletedText(response.data.text);
      return response.data;
    } catch (error) {
      console.error("Error downloading response:", error);
      setError("Failed to download response.");
      return null;
    }
  };

  //// HANDLE GETTING A MESSAGE BACK FROM THE API ////

  const handleSendMessage = async () => {
    if (!editableTranscript.trim()) return;

    const currentUser = auth.currentUser;
    const lessonId = lessonData ? lessonData.uid : "Open Chat";

    const botResponseData = await handleDownloadAudio(editableTranscript, lessonData);

    const userMessage = { text: editableTranscript, sender: "user", translation: "", original: editableTranscript };
    const botMessage = { text: botResponseData.text, sender: "bot", translation: botResponseData.translation, original: botResponseData.text };

    try {
      // Ensure the conversation document exists
      let conversationId = conversationStarted;

      if (!conversationStarted) {
        const conversationDoc = await addDoc(collection(db, "conversations"), {
          startTime: serverTimestamp(),
          userId: currentUser.uid,
          lessonId: lessonId
        });

        conversationId = conversationDoc.id; // Get the conversation UID
        setConversationStarted(conversationId); // Store it to avoid recreating
      }


      // Add the user message
      const userMessageDoc = await addDoc(collection(db, "messages"), {
        text: editableTranscript,
        sender: "user",
        userId: currentUser.uid,
        conversationId, // Link to the conversation
        lessonId: lessonId,
        timestamp: serverTimestamp(),
      });

      // Add the bot message if it exists
      if (botMessage) {
        await addDoc(collection(db, "messages"), {
          text: botResponseData.text,
          sender: "bot",
          userId: currentUser.uid,
          conversationId, // Link to the conversation
          lessonId: lessonId,
          timestamp: serverTimestamp(),
        });

        setConversation(prevConversation => [
          ...prevConversation,
          userMessage,
          ...(botMessage ? [botMessage] : [])
        ]);
      }

      const phrases = phrasesData.common_phrases.map(phrase => phrase[language]);
      const selectedPhrases = phrases.sort(() => 0.5 - Math.random()).slice(0, 3);
      setRandomPhrases(selectedPhrases);

      setEditableTranscript("");
      resetTranscript();
    } catch (error) {
      console.error("Error handling messages:", error);
    }
  };

  //// IMPLEMENT SPEECH RECOGNITION

  const clearText = () => {
    setEditableTranscript("");  // Clears the text input field
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

  // Set the editableTranscript variable to update when ever the user types or says anything

  useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);


  //Make the conversation scroll the bottom when ever a new message is added.

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [conversation]);

  // Handle the language when the user selects a different language from the drop down

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  // Display the english translation or original text

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div
      className="container d-flex justify-content-center p-4"
      style={{ position: "relative" }}
    >
      <div className="w-200" style={{ maxWidth: "800px", width: "800px" }}>

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
              value={language}
              onChange={handleLanguageChange}
              style={{ maxWidth: "120px" }}
            >
              <option value="en-US">English</option>
              <option value="es-MX">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="fi">Finnish</option>
            </select>
          </div>

          <div className="conversation-container border rounded p-3 mb-3" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {conversation.map((message, index) => (
              <div key={index} className={`d-flex ${message.sender === "user" ? "justify-content-end" : ""}`} style={{ marginBottom: "10px" }}>
                <span className={`p-2 rounded ${message.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`} style={{ maxWidth: "75%", wordWrap: "break-word" }}>
                  {message.text}

                  {message.sender === "bot" && (
                    <>

                      {showEnglishIndex === index && (
                        <div className="mt-2">
                          <small style={{ color: 'grey' }}>{message.translation}</small>
                        </div>
                      )}
                    </>
                  )}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* <audio src={data} autoPlay controls className="w-200 mb-3" /> */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message here..."
            value={editableTranscript}
            onChange={(e) => setEditableTranscript(e.target.value)}
            className="form-control mb-3"
          />

          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleSendMessage}>
              Send
            </button>
            <button className="btn btn-secondary" onClick={resetTranscript}>Clear</button> {/* Clear button */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Recorder;
