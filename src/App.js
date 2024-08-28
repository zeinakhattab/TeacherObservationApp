import React, { useState, useRef } from 'react';
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from 'microphone-stream';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import { OpenAI } from 'openai'; 


function App() {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const micStreamRef = useRef(null);
  const client = new TranscribeStreamingClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });


  const startTranscription = async () => {
    try {
      micStreamRef.current = new MicrophoneStream();
      micStreamRef.current.setStream(
        await window.navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        })
      );

      const audioStream = async function* () {
        for await (const chunk of micStreamRef.current) {
          yield { AudioEvent: { AudioChunk: pcmEncodeChunk(chunk) } };
        }
      };

      const command = new StartStreamTranscriptionCommand({
        LanguageCode: "en-US",
        MediaEncoding: "pcm",
        MediaSampleRateHertz: 44100,
        AudioStream: audioStream(),
      });

      const response = await client.send(command);
      console.log('Transcription started');

      for await (const event of response.TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const results = event.TranscriptEvent.Transcript.Results;
          results.forEach((result) => {
            if (!result.IsPartial) {
              result.Alternatives.forEach((alternative) => {
                const newTranscript = alternative.Items.map((item) => item.Content).join(' ');
                console.log('Final Transcript:', newTranscript);
                setTranscript((prev) => prev + ' ' + newTranscript);
              });
            }
          });
        }
      }
    } catch (e) {
      console.error('Error during transcription:', e);
    }
  };

  const stopTranscription = () => {
    if (micStreamRef.current) {
      micStreamRef.current.stop();
      micStreamRef.current = null;
      console.log('Transcription stopped');
    }
  };

  const handleTranscriptionButtonClick = () => {
    if (isTranscribing) {
      stopTranscription();
      clearInterval(intervalId);
    } else {
      startTranscription();
      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
    setIsTranscribing(!isTranscribing);
  };

  const pcmEncodeChunk = (chunk) => {
    const input = MicrophoneStream.toRaw(chunk);
    var offset = 0;
    var buffer = new ArrayBuffer(input.length * 2);
    var view = new DataView(buffer);
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  };

  const extractKeyPoints = async (text) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Extract the key points from the following transcriptions made by the teachers. The transcriptions are observations made by teachers of the students performances in an assessment."
          },
          {
            role: "user",
            content: text
          }
        ],
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error extracting key points:', error);
      return text;
    }
  };

  const handleSubmit = async () => {
    const keyPoints = await extractKeyPoints(transcript);
    const params = {
      TableName: 'Transcriptions',
      Item: {
        'TranscriptionId': { S: uuidv4() },
        'Transcription': { S: transcript },
        'KeyPhrases': { S: keyPoints },
        'created_date': { S: formatISO(new Date()) }
      }
    };

    try {
      await dynamoClient.send(new PutItemCommand(params));
      console.log('Transcription saved to DynamoDB');
    } catch (error) {
      if (error.name === 'ValidationException') {
        alert('Please record an observation.');
      } else {
        console.error('Error saving transcription to DynamoDB:', error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="App">
      <div className="logo-container">
        <img className="logo" src="/Alpaca-logo.png" alt="Logo" />
        <span className="title">Recording</span>
      </div>
      <div className="top-right-container">
        <div style={{ width: '66px', height: '60px', left: '27px', top: '0px', position: 'absolute', background: '#4C4C4C', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '9999px' }}></div>
        <div style={{ width: '39px', height: '40px', left: '83px', top: '10px', position: 'absolute', background: '#4C4C4C', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}></div>
        <div style={{ width: '39px', height: '40px', left: '0px', top: '10px', position: 'absolute', background: '#4C4C4C', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}></div>
        <img style={{ width: '45px', height: '45px', left: '38px', top: '7px', position: 'absolute' }} src="/avatar.png" alt="Avatar" />
        <img style={{ width: '30px', height: '30px', left: '4px', top: '15px', position: 'absolute' }} src="/home_icon.png" alt="Home" />
        <img style={{ width: '30px', height: '30px', left: '89px', top: '15px', position: 'absolute' }} src="/logout_icon.png" alt="Logout" />
      </div>
      <div className="rounded-rect">
        <div className="submit-container">
          <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
        </div>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="textarea" />
        <div className="record-button-container">
          <div className="timer">{formatTime(timer)}</div>
          <button id="recordButton" onClick={handleTranscriptionButtonClick} className={`text-white font-bold py-2 px-4 ${isTranscribing ? 'recording' : ''}`}>
            <div className="record-button-icon"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;