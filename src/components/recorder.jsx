import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import phrasesEsData from "../data/phrases_es.json";
import phrasesFiData from "../data/phrases_fi.json";
import MicIcon from "@mui/icons-material/Mic";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Recorder = () => {
  const [data, setData] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [completedText, setCompletedText] = useState("");
  const [randomPhrases, setRandomPhrases] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleDownloadAudio = async (text) => {
    try {
      let response = await axios.post(
        "http://localhost:4000/",
        { text, translation: englishText },
        { responseType: "json" }
      );
      const audioBlob = new Blob([new Uint8Array(atob(response.data.audio).split("").map((char) => char.charCodeAt(0)))], { type: "audio/mp3" });
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

  const handleSendMessage = async () => {
    if (!editableTranscript.trim()) return;
    const userMessage = { text: editableTranscript, sender: "user" };
    const botResponseText = await handleDownloadAudio(editableTranscript);
    if (botResponseText) {
      setConversation([...conversation, userMessage, { text: botResponseText, sender: "bot" }]);
    }
    setEditableTranscript("");
    resetTranscript();
  };

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
    commands: [{ command: "delete", callback: () => resetTranscript() }],
  });

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language }).catch(() => {
        setError("Microphone permission denied or not supported.");
      });
    } else {
      setError("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition, language]);

  useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    setRandomPhrases((language === "es-MX" ? phrasesEsData.common_phrases_spanish : phrasesFiData.common_phrases_finnish || []).slice(0, 5));
  }, [language]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [conversation]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleShowEnglish = (index) => {
    const updatedConversation = [...conversation];
    updatedConversation[index].text = englishText;
    setConversation(updatedConversation); // Assuming you have a state to store the conversation
  };

  const handleShowOriginal = (index) => {
    const updatedConversation = [...conversation];
    updatedConversation[index].text = completedText;
    setConversation(updatedConversation); // Assuming you have a state to store the conversation
  };

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container d-flex justify-content-center p-4">
      <div className="w-200" style={{ maxWidth: "800px" }}>
        <div className="d-flex align-items-center mb-2">
          <MicIcon className="me-2" />
          <p className="m-0">Listening in</p>
          <select className="form-select ms-3" onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="es-MX">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="fi">Finnish</option>
          </select>
        </div>
        <div className="conversation-container border rounded p-3 mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {conversation.map((message, index) => (
            <div key={index} className={`d-flex ${message.sender === "user" ? "justify-content-end" : ""}`}>
              <span className={`p-2 rounded ${message.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`} style={{ maxWidth: "75%", wordWrap: "break-word" }}>
                {message.text}
                {message.sender === "bot" && (
                  <>
                    <button className="btn btn-link btn-sm p-0 ms-2" onClick={() => handleShowEnglish(index)}>English</button>
                    <button className="btn btn-link btn-sm p-0 ms-2" onClick={() => handleShowOriginal(index)}>Original</button>
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
            <button key={index} className="btn btn-light btn-sm" onClick={() => setEditableTranscript((prev) => `${prev} ${phrase.spanish}`.trim())}>
              <strong>{language === 'es-MX' ? phrase.spanish : phrase.finnish}</strong>
            </button>
          ))}
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
          <button className="btn btn-danger" onClick={resetTranscript}>Clear</button>
        </div>
      </div>
    </div>
  );
  
};

export default Recorder;
