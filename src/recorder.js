import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const Recorder = () => {
    const [data, setData] = useState("");
    const [completedText, setCompletedText] = useState(""); // Add state to hold the completed text
    const [englishText, setEnglishText] = useState("");
    const [error, setError] = useState(""); // State to hold error messages
    const [language, setLanguage] = useState('fi'); // State to manage the language

    const handleDownloadAudio = async () => {
        try {
            let response = await axios.post("http://localhost:5000/", { text: transcript, translation: englishText }, {
                responseType: "json"
            });

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
            setEnglishText(response.data.translation);
            resetTranscript();
        } catch (error) {
            console.error("Error downloading audio:", error);
            setError("Failed to download audio.");
        }
    }

    const commands = [
        {
            command: 'delete',
            callback: () => resetTranscript()
        },
        {
            command: 'puista',
            callback: () => resetTranscript()
        },
    ];

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.startListening({ continuous: true, language })
                .catch(error => {
                    console.error("Error starting speech recognition:", error);
                    setError("Microphone permission denied or not supported.");
                });
        } else {
            setError("Browser doesn't support speech recognition.");
        }
    }, [browserSupportsSpeechRecognition, language]); // Restart listening when language changes

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);

    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "500px", justifyContent: "center", alignItems: "center" }}>
            <h4>Listening in {language === 'fi' ? 'Finnish' : 'English'}</h4> {/* Display the current language */}
            <MicIcon style={{ fontSize: "50px" }}></MicIcon>
            <p>{transcript}</p>
            <audio src={data} autoPlay controls />
            <br />
            <div style={{ display: "flex", margin: "20px"}}>
                <button className='btn btn-primary' style={{ margin: "20px"}} onClick={handleDownloadAudio}>Send</button>
                <button className='btn btn-danger' style={{ margin: "20px"}} onClick={resetTranscript}>Clear</button>
            <br />
            </div>
            <p>{completedText}</p> {/* Display the completed text */}
            <br />
            <p>{englishText}</p> {/* Display the completed text */}
            <br />
            <p>Set Listening Language</p>
            <div style={{ display: "flex"}}>
                <button className='btn btn-primary' style={{ margin: "20px"}} onClick={() => handleLanguageChange('fi')}>Finnish</button>
                <button className='btn btn-primary' style={{ margin: "20px"}} onClick={() => handleLanguageChange('en')}>English</button>
            </div>
        </div>
    );
};

export default Recorder;
