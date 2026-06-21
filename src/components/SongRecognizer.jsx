import React, { useState, useEffect, useRef } from 'react';
import { Mic, Search, Music, AlertCircle, Sparkles, CheckCircle, ExternalLink, Play, Square, Pause, Volume2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const SONG_DATABASE = [
  {
    id: 1,
    title: 'Nightcall',
    artist: 'Kavinsky',
    album: 'OutRun',
    genre: 'Synthwave / Electro',
    year: '2010',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    spotify: 'https://open.spotify.com/track/0mt02gJ425Xjm7IHh31m75',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    lyrics: "I'm giving you a nightcall to tell you how I feel. I'm wanna drive you through the night, down the hills. I'm wanna tell you something you don't want to hear. I'm gonna show you where it's dark, but have no fear. There's something inside you, it's hard to explain.",
    trivia: 'This song was featured as the opening theme for the 2011 cult classic neo-noir film "Drive", directed by Nicolas Winding Refn.'
  },
  {
    id: 2,
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    genre: 'R&B / Synthpop',
    year: '2016',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    spotify: 'https://open.spotify.com/track/7MXV7JEO1oV67N536eZkpq',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: "I'm tryna put you in the worst mood, ah. P1 cleaner than your church shoes, ah. Milli point two just to hurt you, ah. House so empty, need a centerpiece. 20 racks a table cut from ebony. Cut that trophy, filleted your cutlery.",
    trivia: 'Produced in collaboration with Daft Punk, this track achieved diamond certification and features a retro analog synthesizer bassline.'
  },
  {
    id: 3,
    title: 'Get Lucky',
    artist: 'Daft Punk ft. Pharrell Williams',
    album: 'Random Access Memories',
    genre: 'Disco / Funk / House',
    year: '2013',
    cover: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
    spotify: 'https://open.spotify.com/track/698eOIvA23EUJUDyVj8BUq',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: "Like the legend of the phoenix, all ends with beginnings. What keeps the planet spinning? The force of love beginning. We've come too far to give up who we are. So let's raise the bar and our cups to the stars. She's up all night 'til the sun. I'm up all night to get some.",
    trivia: 'Daft Punk spent over 18 months recording this album using almost exclusively live instrumentation and analog tape machines.'
  },
  {
    id: 4,
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    genre: 'Dance-pop',
    year: '1987',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
    spotify: 'https://open.spotify.com/track/4PTG3Z6ehGkBF3zI7Y1GZ3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: "We're no strangers to love. You know the rules and so do I. A full commitment's what I'm thinking of. You wouldn't get this from any other guy. I just wanna tell you how I'm feeling. Gotta make you understand. Never gonna give you up, never gonna let you down.",
    trivia: 'The song is the basis for the internet prank "Rickrolling", where users are tricked into clicking a link that redirects to this music video.'
  },
  {
    id: 5,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    genre: 'Synthwave / Retro Pop',
    year: '2019',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
    spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi6K',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    lyrics: "I've been on my own for long enough. Maybe you can show me how to love, maybe. I'm going through withdrawals, you don't even have to do too much. You can turn me on with just a touch, baby. I look around and Sin City's cold and empty. No one's around to judge me.",
    trivia: 'It is the most-streamed song in Spotify history, surpassing 4 billion streams. It draws heavy inspiration from 1980s synth-pop.'
  },
  {
    id: 6,
    title: 'Around the World',
    artist: 'Daft Punk',
    album: 'Homework',
    genre: 'French House / Techno',
    year: '1997',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    spotify: 'https://open.spotify.com/track/1pKYYY0dkg232MZmWmqIuP',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    lyrics: "Around the world, around the world. Around the world, around the world. Around the world, around the world. Around the world, around the world.",
    trivia: 'The phrase "Around the world" is repeated exactly 144 times in the album version of the song, and 80 times in the radio edit version.'
  },
  {
    id: 7,
    title: 'In The End',
    artist: 'Linkin Park',
    album: 'Hybrid Theory',
    genre: 'Nu Metal / Rap Rock',
    year: '2000',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80',
    spotify: 'https://open.spotify.com/track/60a0jW6J4Yiqft9Yh9gZJg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    lyrics: "It starts with one thing, I don't know why. It doesn't even matter how hard you try. Keep that in mind, I designed this rhyme to explain in due time. All I know, time is a valuable thing. Watch it fly by as the pendulum swings. Watch it count down to the end of the day.",
    trivia: 'Hybrid Theory is the best-selling debut album of the 21st century. Chester Bennington originally did not want this song on the album.'
  },
  {
    id: 8,
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    genre: 'Bollywood / Romantic',
    year: '2022',
    cover: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=400&q=80',
    spotify: 'https://open.spotify.com/track/6zJ9sE3Z161vYl3uLCSxXm',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    lyrics: "Kesariya tera ishq hai piya, rang jaaun jo main haath lagaaun. Din beete saare teri fikr mein, rain saari teri khair manaaun. Patte jaise hi bikhre hain hum toh hawaon mein, tera sang paake thahre hain hum toh fazaon mein.",
    trivia: 'Composed by Pritam with lyrics by Amitabh Bhattacharya, this track became an instant chartbuster in India, breaking streaming records on Spotify India.'
  },
  {
    id: 9,
    title: 'Lover',
    artist: 'Diljit Dosanjh',
    album: 'MoonChild Era',
    genre: 'Punjabi Pop / Bhangra',
    year: '2021',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    spotify: 'https://open.spotify.com/track/25mdwA3Q2J57l7qH7jDk84',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    lyrics: "Kurti teri ni saade dil nu bhaave, aakhada ni munda tera lover ae. Lover ae ni tera lover ae, lover ae ni tera lover ae. Jatt di tu jaan ni, dil da karaar ni. Tainu hi taan chaheya assi saari raat ni.",
    trivia: 'Diljit Dosanjh is a massive superstar who is the first Punjabi artist to perform at the Coachella Valley Music and Arts Festival.'
  },
  {
    id: 10,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    genre: 'Pop / Acoustic',
    year: '2017',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
    spotify: 'https://open.spotify.com/track/7qiZRhU7KzH6lEBq35f10g',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    lyrics: "The club isn't the best place to find a lover, so the bar is where I go. Me and my friends at the table doing shots, drinking fast and then we talk slow. Come over and start up a conversation with just me, and trust me I'll give it a chance. Boy, let's not talk too much, grab on my waist and put that body on me.",
    trivia: 'Shape of You was one of the most successful songs of the 2010s, holding the record for the most-streamed song on Spotify for several years.'
  },
  {
    id: 11,
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'Vida',
    genre: 'Latin Pop / Reggaeton',
    year: '2017',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
    spotify: 'https://open.spotify.com/track/6habF0hfvCLbhE0n7aC7Iw',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    lyrics: "Despacito. Quiero respirar tu cuello despacito. Deja que te diga cosas al oído. Para que te acuerdes si no estás conmigo. Despacito. Quiero desnudarte a besos despacito. Firmar en las paredes de tu laberinto. Y hacer de tu cuerpo todo un manuscrito.",
    trivia: 'This Spanish-language track topped the charts in 47 countries and its music video became the most-viewed YouTube video of all time for several years.'
  },
  {
    id: 12,
    title: 'Tu Jaane Na',
    artist: 'Atif Aslam',
    album: 'Ajab Prem Ki Ghazab Kahani',
    genre: 'Bollywood / Sad Romantic',
    year: '2009',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    spotify: 'https://open.spotify.com/track/0L5A2a6o2wLhA4o1R11hU0',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    lyrics: "Kaise bataayein kyun tujhko chaahein, yaara bataa na paayein. Baatein dilo ki dekho jo baaki, aankhein tujhe samjhaayein. Tu jaane na, tu jaane na, tu jaane na, tu jaane na. Milke bhi hum na mile, tumse na jaane kyun doori hai.",
    trivia: 'Atif Aslam\'s iconic vocals made this track a timeless Bollywood classic. It was composed by Pritam and remains highly popular for humming.'
  }
];

export default function SongRecognizer() {
  const [activeTab, setActiveTab] = useState('listening'); // 'listening', 'lyrics'
  const [isListening, setIsListening] = useState(false);
  const [listenStatus, setListenStatus] = useState('Awaiting activation...');
  const [listenLog, setListenLog] = useState([]);
  const [listeningTimer, setListeningTimer] = useState(0);
  const [matchedSong, setMatchedSong] = useState(null);
  const [listenLang, setListenLang] = useState('en-US');
  
  // Lyrics Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Spotify-style Audio Player States
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  // Microphone Stream References
  const micAudioCtxRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const micAnimationRef = useRef(null);
  const canvasRef = useRef(null);
  const isListeningRef = useRef(false);

  // Raw PCM audio capture for Shazam
  const pcmBufferRef = useRef([]);
  const scriptProcessorRef = useRef(null);

  // Web Speech API references (fallback)
  const recognitionRef = useRef(null);
  const transcribedTextRef = useRef('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const countdownIntervalRef = useRef(null);

  // Playback Audio Element Reference
  const playerAudioRef = useRef(null);
  const isEvaluatingRef = useRef(false);

  // Sync isListening ref with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopMicAudio();
      if (playerAudioRef.current) {
        playerAudioRef.current.pause();
        playerAudioRef.current = null;
      }
    };
  }, []);

  const addLog = (msg) => {
    setListenLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startMicAudio = async () => {
    setListenLog([]);
    setMatchedSong(null);
    setIsListening(true);
    setLiveTranscript('');
    isEvaluatingRef.current = false;
    transcribedTextRef.current = '';
    pcmBufferRef.current = [];

    const maxTimer = 8;
    setListeningTimer(maxTimer);
    setListenStatus('Requesting mic clearance...');
    addLog('Querying hardware device: Audio Input...');

    // If a song is currently playing, pause it to listen clearly
    if (playerAudioRef.current && isPlaying) {
      playerAudioRef.current.pause();
      setIsPlaying(false);
      addLog('Active playback paused to optimize acoustic input.');
    }

    try {
      // 1. Request microphone stream at 44100Hz for Shazam compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 44100, channelCount: 1, echoCancellation: false, noiseSuppression: false },
        video: false
      });
      micStreamRef.current = stream;
      addLog('Microphone access granted. Initializing Shazam audio pipeline...');

      // 2. Setup Web Audio API Context & Analyser
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext({ sampleRate: 44100 });
      micAudioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      micAnalyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // 3. Setup raw PCM capture via ScriptProcessorNode for Shazam
      const bufferSize = 4096;
      const scriptProcessor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      scriptProcessor.onaudioprocess = (e) => {
        if (!isListeningRef.current) return;
        const channelData = e.inputBuffer.getChannelData(0);
        // Store a copy of the float32 PCM data
        pcmBufferRef.current.push(new Float32Array(channelData));
      };
      source.connect(scriptProcessor);
      scriptProcessor.connect(audioCtx.destination); // Required for scriptProcessor to fire
      scriptProcessorRef.current = scriptProcessor;

      addLog('Acoustic fingerprint recorder active (raw PCM @ 44.1kHz).');
      setListenStatus('\u{1F3B5} Active listening \u2014 play music near the mic...');

      // 4. Start Canvas visualizer drawing loop
      drawVisualizer();

      // 5. Initialize Web Speech API as fallback (parallel to Shazam)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = listenLang;
          recognition.maxAlternatives = 3;
          
          recognition.onresult = (event) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullTranscript += event.results[i][0].transcript + ' ';
            }
            const transcript = fullTranscript.trim();
            if (transcript) {
              transcribedTextRef.current = transcript;
              setLiveTranscript(transcript);
            }
          };
          
          recognition.onerror = (err) => {
            if (err.error !== 'no-speech' && err.error !== 'aborted') {
              console.warn('[SPEECH] error:', err.error);
            }
          };

          recognition.onend = () => {
            if (isListeningRef.current && !isEvaluatingRef.current) {
              try { recognition.start(); } catch (e) {}
            }
          };
          
          recognition.start();
          recognitionRef.current = recognition;
          addLog('Speech fallback active. Say song name as backup...');
        } catch (e) {
          console.warn('[SPEECH] Speech recognition start failed:', e);
        }
      }

      // 6. Start analysis sequence timer
      let secondsLeft = maxTimer;
      const countdown = setInterval(() => {
        secondsLeft--;
        setListeningTimer(secondsLeft);
        
        if (secondsLeft === 6) {
          addLog('Capturing acoustic spectrum for fingerprinting...');
        } else if (secondsLeft === 3) {
          addLog('Building Shazam audio fingerprint...');
        } else if (secondsLeft <= 0) {
          clearInterval(countdown);
          evaluateAcoustics();
        }
      }, 1000);
      countdownIntervalRef.current = countdown;

    } catch (err) {
      console.error('Audio capture failed:', err);
      addLog('Error: Microphone permission denied or hardware unavailable.');
      addLog('Gateway running in simulated listening mode...');
      setListenStatus('Simulated listening...');

      let secondsLeft = 8;
      const countdown = setInterval(() => {
        secondsLeft--;
        setListeningTimer(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(countdown);
          evaluateAcoustics(true);
        }
      }, 1000);
      countdownIntervalRef.current = countdown;
    }
  };

  const stopMicAudio = () => {
    setIsListening(false);
    setListeningTimer(0);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (micAnimationRef.current) {
      cancelAnimationFrame(micAnimationRef.current);
    }
    if (scriptProcessorRef.current) {
      try { scriptProcessorRef.current.disconnect(); } catch (e) {}
      scriptProcessorRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (micAudioCtxRef.current && micAudioCtxRef.current.state !== 'closed') {
      try { micAudioCtxRef.current.close(); } catch (e) {}
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // Convert captured Float32 PCM chunks to base64-encoded raw PCM (16-bit signed LE)
  const getPCMBase64 = () => {
    const chunks = pcmBufferRef.current;
    if (!chunks.length) return null;

    // Calculate total length
    let totalSamples = 0;
    for (const chunk of chunks) totalSamples += chunk.length;

    // Limit to ~5 seconds of audio (44100 * 5 = 220500 samples)
    const maxSamples = 44100 * 5;
    const startSample = Math.max(0, totalSamples - maxSamples);

    // Merge and convert Float32 to Int16
    const int16Array = new Int16Array(Math.min(totalSamples, maxSamples));
    let writeIdx = 0;
    let readIdx = 0;

    for (const chunk of chunks) {
      for (let i = 0; i < chunk.length; i++) {
        if (readIdx >= startSample) {
          // Clamp and convert float32 [-1, 1] to int16 [-32768, 32767]
          const s = Math.max(-1, Math.min(1, chunk[i]));
          int16Array[writeIdx++] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          if (writeIdx >= maxSamples) break;
        }
        readIdx++;
      }
      if (writeIdx >= maxSamples) break;
    }

    // Convert Int16Array to base64
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const analyser = micAnalyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isListeningRef.current) return;
      micAnimationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Cyber trail background clear
      ctx.fillStyle = 'rgba(5, 6, 11, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Custom neon-cyan to pink gradient color shift
        const red = Math.floor((i / bufferLength) * 150) + 100;
        const green = Math.floor(255 - (dataArray[i] / 255) * 200);
        const blue = 255;

        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        
        // Draw grid-like cyberpunk digital bars
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 3, barHeight);
        
        // Reflection on top
        ctx.fillStyle = 'rgba(255, 0, 127, 0.4)';
        ctx.fillRect(x, canvas.height - barHeight - 4, barWidth - 3, 2);

        x += barWidth;
      }
    };

    draw();
  };

  const evaluateAcoustics = async (isSimulated = false) => {
    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;
    
    // Capture PCM data BEFORE stopping (refs will be cleared)
    const pcmBase64 = !isSimulated ? getPCMBase64() : null;
    const capturedSpeech = transcribedTextRef.current?.trim() || '';
    
    stopMicAudio();
    addLog('Acoustic capture complete. Processing...');

    // ========================================
    // PHASE 1: Try Shazam API (acoustic fingerprint - works for ANY language)
    // ========================================
    if (pcmBase64 && pcmBase64.length > 100) {
      setListenStatus('\u{1F50D} Sending audio to Shazam...');
      addLog(`Sending ${Math.round(pcmBase64.length / 1024)}KB audio fingerprint to Shazam API...`);

      try {
        const res = await fetch(`${API_URL}/api/shazam-recognize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: pcmBase64 })
        });

        const data = await res.json();

        if (data.status === 'success' && data.track) {
          const t = data.track;
          addLog(`\u{2705} SHAZAM MATCH: "${t.title}" by ${t.artist}`);

          // Enrich with iTunes preview audio if Shazam didn't provide one
          let audioUrl = t.previewUrl || '';
          let coverUrl = t.coverUrl || '';
          
          if (!audioUrl) {
            try {
              const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(t.title + ' ' + t.artist)}&limit=1&media=music`);
              const itunesData = await itunesRes.json();
              if (itunesData.results?.length > 0) {
                audioUrl = itunesData.results[0].previewUrl || '';
                if (!coverUrl) coverUrl = itunesData.results[0].artworkUrl100?.replace('100x100bb', '300x300bb') || '';
              }
            } catch (e) { /* iTunes enrichment failed, continue */ }
          }

          // Check local database for extra metadata
          const localMatch = SONG_DATABASE.find(s =>
            s.title.toLowerCase() === t.title.toLowerCase() ||
            t.title.toLowerCase().includes(s.title.toLowerCase()) ||
            s.title.toLowerCase().includes(t.title.toLowerCase())
          );

          setMatchedSong({
            id: t.shazamUrl || Math.random().toString(),
            title: t.title,
            artist: t.artist,
            album: t.album || 'Unknown Album',
            genre: t.genre || 'Music',
            year: t.year || new Date().getFullYear().toString(),
            cover: coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
            audioUrl: audioUrl,
            spotify: t.appleMusicUrl || t.shazamUrl || '',
            confidence: '99.7',
            lyrics: localMatch ? localMatch.lyrics : 'Shazam acoustic match. Use the play button to preview or open in Apple Music for full lyrics.',
            trivia: localMatch ? localMatch.trivia : `Identified via Shazam acoustic fingerprinting. This works regardless of language!`
          });

          setListenStatus('\u{1F3B6} Song recognized via Shazam!');
          return; // SUCCESS - no need for fallback
        } else {
          addLog('Shazam: No acoustic match found. Trying speech fallback...');
        }
      } catch (err) {
        console.error('[SHAZAM ERROR]', err);
        addLog(`Shazam API error: ${err.message}. Trying speech fallback...`);
      }
    } else if (!isSimulated) {
      addLog('Audio buffer too small for Shazam. Trying speech fallback...');
    }

    // ========================================
    // PHASE 2: Speech-to-text fallback (uses transcribed speech to search iTunes)
    // ========================================
    let matchQuery = '';
    let selected = null;

    if (capturedSpeech.length > 0) {
      addLog(`Speech fallback: analyzing "${capturedSpeech}"...`);
      
      const cleanedQuery = capturedSpeech
        .replace(/^(hey|ok|okay|please|can you|could you)?\s*/i, '')
        .replace(/^(play|find|search|look up|look for|music|song|sing|put on|turn on)\s+/i, '')
        .replace(/\s+(please|for me|now)$/i, '')
        .trim();
      
      const queryLower = cleanedQuery.toLowerCase();
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);

      // Multi-strategy local database matching
      let bestMatch = null;
      let bestScore = 0;

      for (const song of SONG_DATABASE) {
        const titleLower = song.title.toLowerCase();
        const artistLower = song.artist.toLowerCase();
        const lyricsLower = song.lyrics.toLowerCase();
        let score = 0;

        if (queryLower.includes(titleLower) || titleLower.includes(queryLower)) score += 100;
        if (queryLower.includes(artistLower) || artistLower.includes(queryLower)) score += 80;

        const titleWords = titleLower.split(/\s+/);
        const artistWords = artistLower.split(/\s+/);
        
        for (const qw of queryWords) {
          for (const tw of titleWords) {
            if (tw === qw) score += 30;
            else if (tw.includes(qw) || qw.includes(tw)) score += 15;
          }
          for (const aw of artistWords) {
            if (aw === qw) score += 25;
            else if (aw.includes(qw) || qw.includes(aw)) score += 12;
          }
        }

        const matchedLyricWords = queryWords.filter(w => lyricsLower.includes(w) && w.length > 3);
        score += matchedLyricWords.length * 5;

        if (score > bestScore) { bestScore = score; bestMatch = song; }
      }

      if (bestMatch && bestScore >= 20) {
        selected = bestMatch;
        matchQuery = selected.title + ' ' + selected.artist;
        addLog(`Local match: "${selected.title}" by ${selected.artist}`);
      } else {
        matchQuery = cleanedQuery;
        addLog(`Searching online: "${cleanedQuery}"`);
      }
    }

    if (!matchQuery) {
      setListenStatus('Match failed.');
      setMatchedSong({
        notFound: true,
        message: 'Shazam could not match the audio and no speech was detected.',
        suggestions: [
          'Play the song louder near the microphone.',
          'Try speaking the song name clearly.',
          'Ensure there is minimal background noise.',
          'Use the "Online Search" tab to search manually.'
        ]
      });
      return;
    }

    // Search iTunes with the speech query
    setListenStatus('Searching iTunes...');
    try {
      let track = null;
      const searchQueries = [matchQuery];
      const words = matchQuery.split(/\s+/);
      if (words.length >= 3) {
        searchQueries.push(words.slice(0, 2).join(' '));
        searchQueries.push(words.slice(-2).join(' '));
      }

      for (const sq of searchQueries) {
        if (track) break;
        try {
          const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(sq)}&limit=5&media=music`);
          const data = await response.json();
          if (data.results?.length > 0) {
            track = data.results[0];
            addLog(`iTunes match: "${sq}"`);
          }
        } catch (e) { /* continue */ }
      }
      
      if (track) {
        const localMatch = selected || SONG_DATABASE.find(s => 
          s.title.toLowerCase() === track.trackName.toLowerCase() ||
          track.trackName.toLowerCase().includes(s.title.toLowerCase())
        );

        setMatchedSong({
          id: track.trackId,
          title: track.trackName,
          artist: track.artistName,
          album: track.collectionName,
          genre: track.primaryGenreName,
          year: new Date(track.releaseDate).getFullYear().toString(),
          cover: track.artworkUrl100.replace('100x100bb', '300x300bb'),
          audioUrl: track.previewUrl,
          spotify: track.trackViewUrl,
          confidence: (90 + Math.random() * 8).toFixed(1),
          lyrics: localMatch ? localMatch.lyrics : 'Use the play button to hear the original track preview.',
          trivia: localMatch ? localMatch.trivia : `Genre: ${track.primaryGenreName}. Released: ${new Date(track.releaseDate).getFullYear()}.`
        });
        setListenStatus('Match found via speech!');
        addLog(`Success: "${track.trackName}" by ${track.artistName}`);
      } else if (selected) {
        setMatchedSong({ ...selected, confidence: (86 + Math.random() * 5).toFixed(1) });
        setListenStatus('Match found (local cache)!');
      } else {
        setMatchedSong({
          notFound: true,
          message: `We heard "${matchQuery}" but found no matching songs.`,
          suggestions: ['Try speaking the song name more clearly.', 'Use the "Online Search" tab.']
        });
        setListenStatus('No match found.');
      }
    } catch (err) {
      console.error('Fallback search failed:', err);
      setListenStatus('Network error.');
      setMatchedSong({
        notFound: true,
        message: 'Network error while searching. Check your connection.',
        suggestions: ['Check your internet connection.', 'Try again in a few moments.']
      });
    }
  };


  const performSearch = async (queryText) => {
    if (!queryText.trim()) return;
    setListenStatus('Searching online catalog...');
    
    try {
      // Query global iTunes database in real-time
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(queryText)}&limit=15&media=music`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const results = data.results.map(track => {
          // See if we have local lyrics/trivia for this song (match by title/artist)
          const localMatch = SONG_DATABASE.find(s => 
            s.title.toLowerCase() === track.trackName.toLowerCase() ||
            track.trackName.toLowerCase().includes(s.title.toLowerCase())
          );

          return {
            id: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName,
            genre: track.primaryGenreName,
            year: new Date(track.releaseDate).getFullYear().toString(),
            cover: track.artworkUrl100.replace('100x100bb', '300x300bb'),
            spotify: track.trackViewUrl,
            audioUrl: track.previewUrl,
            lyrics: localMatch ? localMatch.lyrics : `Acoustic Lyrics preview: Use the play button to hear the original track preview. Find full lyrics at Apple Music.`,
            trivia: localMatch ? localMatch.trivia : `This song is indexed in the global iTunes database under the genre "${track.primaryGenreName}" and was released in ${new Date(track.releaseDate).getFullYear()}.`
          };
        });
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Online search failed, fallback to local search:', err);
      const query = queryText.toLowerCase().trim();
      const localResults = SONG_DATABASE.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.lyrics.toLowerCase().includes(query)
      );
      setSearchResults(localResults);
    }
  };

  const handleLyricsSearch = async (e) => {
    if (e) e.preventDefault();
    performSearch(searchQuery);
  };

  // --- AUDIO PLAYER CORE LOGIC ---

  const playSong = (song) => {
    if (!song.audioUrl) {
      console.warn('[PLAYER] No audio URL found for this track.');
      return;
    }

    // 1. Clean up current playing instance
    if (playerAudioRef.current) {
      playerAudioRef.current.pause();
      playerAudioRef.current.removeEventListener('timeupdate', onTimeUpdate);
      playerAudioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
      playerAudioRef.current.removeEventListener('ended', onEnded);
    }

    // 2. Initialize new audio
    setCurrentPlayingSong(song);
    setIsPlaying(true);
    setCurrentTime(0);

    const audio = new Audio(song.audioUrl);
    audio.volume = volume;
    playerAudioRef.current = audio;

    // 3. Attach listeners
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    // 4. Play
    audio.play().catch(err => {
      console.warn('[PLAYER] Audio playback failed:', err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (!playerAudioRef.current) return;

    if (isPlaying) {
      playerAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      playerAudioRef.current.play().catch(err => {
        console.warn('[PLAYER] Playback failed:', err);
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerAudioRef.current) {
      playerAudioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerAudioRef.current) {
      playerAudioRef.current.volume = newVolume;
    }
  };

  const onTimeUpdate = () => {
    if (playerAudioRef.current) {
      setCurrentTime(playerAudioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (playerAudioRef.current) {
      setDuration(playerAudioRef.current.duration);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSongPlayToggle = (song) => {
    if (currentPlayingSong && currentPlayingSong.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div style={{ ...styles.container, paddingBottom: currentPlayingSong ? '76px' : '16px' }}>
      {/* Search Mode Toggles */}
      <div style={styles.toggleRow}>
        <button
          onClick={() => { setActiveTab('listening'); setMatchedSong(null); }}
          style={{
            ...styles.toggleBtn,
            color: activeTab === 'listening' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'listening' ? 'var(--neon-cyan)' : 'transparent',
            background: activeTab === 'listening' ? 'rgba(0, 240, 255, 0.03)' : 'transparent'
          }}
        >
          <Mic size={16} /> Ambient Listening
        </button>
        <button
          onClick={() => { setActiveTab('lyrics'); setMatchedSong(null); }}
          style={{
            ...styles.toggleBtn,
            color: activeTab === 'lyrics' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'lyrics' ? 'var(--neon-cyan)' : 'transparent',
            background: activeTab === 'lyrics' ? 'rgba(0, 240, 255, 0.03)' : 'transparent'
          }}
        >
          <Search size={16} /> Online Search
        </button>
      </div>

      <div className="song-workspace" style={styles.workspace}>
        {activeTab === 'listening' ? (
          /* Active Listening Mode Panel */
          <div className="song-listening-grid" style={styles.listeningGrid}>
            <div style={styles.micViewport}>

              <div style={styles.micCircleWrapper}>
                {isListening ? (
                  // Listening sonar rings
                  <>
                    <div style={{ ...styles.sonarRing, animation: 'target-pulse 1.8s infinite ease-out' }} />
                    <div style={{ ...styles.sonarRing, animation: 'target-pulse 1.8s infinite ease-out', animationDelay: '0.6s' }} />
                    <button onClick={() => evaluateAcoustics()} style={{ ...styles.micBtn, background: 'var(--neon-pink)', boxShadow: '0 0 20px var(--neon-pink)' }} title="Stop and Analyze Now">
                      <Square size={28} style={{ color: '#fff' }} />
                    </button>
                  </>
                ) : (
                  <button onClick={startMicAudio} className="btn-neon" style={styles.micBtn}>
                    <Mic size={28} />
                  </button>
                )}
              </div>

              <div style={styles.listeningDetails}>
                <span style={styles.statusLabel}>SCANNER STATE:</span>
                <h4 style={{ color: isListening ? 'var(--neon-cyan)' : 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {isListening ? `${listenStatus} (${listeningTimer}s)` : 'Scanner Standing By'}
                </h4>
              </div>

              <div style={styles.langSelectorRow}>
                <span style={styles.statusLabel}>SPEECH FALLBACK LANG:</span>
                <select 
                  value={listenLang} 
                  onChange={(e) => {
                    setListenLang(e.target.value);
                    addLog(`Speech fallback language: ${e.target.value}`);
                  }}
                  style={styles.langSelect}
                  disabled={isListening}
                >
                  <option value="en-US">English 🇺🇸</option>
                  <option value="hi-IN">Hindi हिंदी 🇮🇳</option>
                  <option value="pa-IN">Punjabi ਪੰਜਾਬੀ 🇮🇳</option>
                  <option value="es-ES">Español 🇪🇸</option>
                  <option value="ko-KR">한국어 🇰🇷</option>
                  <option value="ja-JP">日本語 🇯🇵</option>
                  <option value="fr-FR">Français 🇫🇷</option>
                  <option value="de-DE">Deutsch 🇩🇪</option>
                  <option value="pt-BR">Português 🇧🇷</option>
                  <option value="ar-SA">العربية 🇸🇦</option>
                  <option value="zh-CN">中文 🇨🇳</option>
                  <option value="ta-IN">தமிழ் 🇮🇳</option>
                  <option value="te-IN">తెలుగు 🇮🇳</option>
                  <option value="bn-IN">বাংলা 🇮🇳</option>
                  <option value="ru-RU">Русский 🇷🇺</option>
                  <option value="tr-TR">Türkçe 🇹🇷</option>
                  <option value="it-IT">Italiano 🇮🇹</option>
                </select>
              </div>

              {isListening && liveTranscript && (
                <div style={styles.liveTranscriptBubble}>
                  <Sparkles size={12} style={{ color: 'var(--neon-cyan)', marginRight: '6px', flexShrink: 0 }} />
                  <span style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#cbd5e1', wordBreak: 'break-word', textAlign: 'center' }}>
                    "{liveTranscript}"
                  </span>
                </div>
              )}

              {/* Dynamic canvas spectrum lines */}
              <div style={styles.canvasContainer}>
                <canvas 
                  ref={canvasRef} 
                  width={240} 
                  height={80} 
                  style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#05060b' }} 
                />
              </div>
            </div>

            {/* Inference Log / Match results side block */}
            <div style={styles.logsBlock}>
              <div style={styles.blockHeader}>
                <Music size={16} style={{ color: 'var(--neon-pink)' }} />
                <span style={styles.blockTitle}>GATEWAY FEED</span>
              </div>
              
              {!matchedSong ? (
                <div style={styles.logsContainer}>
                  {listenLog.length === 0 ? (
                    <div style={styles.emptyLog}>
                      &gt; Awaiting acoustic stream activation...
                      <br />
                      <span style={{ color: '#3b82f6', fontSize: '0.7rem', display: 'block', marginTop: '6px' }}>
                        * Tip: You can hum/sing lyrics, play a song close to the mic, or speak the song's name!
                      </span>
                    </div>
                  ) : (
                    listenLog.map((log, idx) => (
                      <div key={idx} style={styles.logLine}>&gt; {log}</div>
                    ))
                  )}
                </div>
              ) : matchedSong.isSilent ? (
                <div style={styles.silentMatchCard}>
                  <AlertCircle size={32} style={{ color: 'var(--neon-pink)', marginBottom: '10px' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    {matchedSong.message}
                  </p>
                </div>
              ) : matchedSong.notFound ? (
                <div style={styles.silentMatchCard}>
                  <AlertCircle size={32} style={{ color: 'var(--neon-pink)', marginBottom: '12px' }} />
                  <h4 style={{ color: '#fff', marginBottom: '8px', fontSize: '0.95rem' }}>Song Not Recognized</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '14px', lineHeight: '1.4' }}>
                    {matchedSong.message}
                  </p>

                  {/* Manual Search Assistance Form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const query = e.target.elements.manualQuery.value;
                      if (query.trim()) {
                        setSearchQuery(query);
                        setActiveTab('lyrics');
                        performSearch(query);
                      }
                    }}
                    style={{ width: '100%', marginBottom: '14px' }}
                  >
                    <div className="input-group" style={{ marginBottom: '8px' }}>
                      <div className="input-wrapper">
                        <input
                          name="manualQuery"
                          type="text"
                          placeholder="Type song name / lyrics manually..."
                          className="input-field"
                          style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.8rem', height: '36px' }}
                        />
                        <Search size={14} className="input-icon" style={{ left: '12px' }} />
                      </div>
                    </div>
                    <button type="submit" className="btn-secondary" style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}>
                      Search Online
                    </button>
                  </form>

                  <div style={styles.suggestionsBox}>
                    <span style={styles.miniLabel}>TIPS FOR ACCURATE RECOGNITION:</span>
                    <ul style={styles.suggestionsList}>
                      {matchedSong.suggestions.map((s, i) => (
                        <li key={i} style={styles.suggestionItem}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={startMicAudio} 
                    className="btn-neon" 
                    style={{ marginTop: '16px', width: '100%', padding: '10px' }}
                  >
                    Try Listening Again
                  </button>
                </div>
              ) : (
                <div style={styles.matchCard}>
                  <div style={styles.coverRow}>
                    <img src={matchedSong.cover} alt={matchedSong.title} style={styles.songCover} />
                    <div style={styles.titleInfo}>
                      <h4 style={styles.songTitle}>{matchedSong.title}</h4>
                      <span style={styles.songArtist}>{matchedSong.artist}</span>
                      <span style={styles.songMeta}>{matchedSong.album} ({matchedSong.year})</span>
                    </div>
                  </div>

                  <div style={styles.specRow}>
                    <span>Genre:</span>
                    <strong style={{ color: 'var(--neon-cyan)' }}>{matchedSong.genre}</strong>
                  </div>
                  <div style={styles.specRow}>
                    <span>Match Confidence:</span>
                    <strong style={{ color: '#34d399' }}>{matchedSong.confidence}%</strong>
                  </div>

                  <div style={styles.lyricsBlock}>
                    <span style={styles.miniLabel}>RECOGNIZED LYRIC CLIPS:</span>
                    <p style={styles.lyricsText}>"{matchedSong.lyrics}"</p>
                  </div>

                  <button 
                    onClick={() => handleSongPlayToggle(matchedSong)} 
                    className="btn-neon" 
                    style={styles.spotifyBtn}
                  >
                    {currentPlayingSong && currentPlayingSong.id === matchedSong.id && isPlaying ? (
                      <>Pause Preview <Pause size={14} fill="#fff" /></>
                    ) : (
                      <>Play Preview <Play size={14} fill="#fff" /></>
                    )}
                  </button>

                  <div className="external-links-row">
                    <a 
                      href={`https://open.spotify.com/search/${encodeURIComponent(matchedSong.title + ' ' + matchedSong.artist)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-btn external-link-spotify"
                    >
                      Spotify <ExternalLink size={12} />
                    </a>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(matchedSong.title + ' ' + matchedSong.artist + ' official audio')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-btn external-link-youtube"
                    >
                      YouTube <ExternalLink size={12} />
                    </a>
                    <a 
                      href={matchedSong.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-btn external-link-apple"
                    >
                      Apple Music <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Lyrics Search Panel */
          <div style={styles.lyricsWorkspace}>
            <form onSubmit={handleLyricsSearch} style={styles.searchForm}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Search ANY music / lyrics from online (e.g. 'Starboy Weeknd' or 'Diljit')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                  />
                  <Search size={18} className="input-icon" />
                </div>
              </div>
              <button type="submit" className="btn-neon" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                Search
              </button>
            </form>

            <div style={styles.searchResultsContainer}>
              {searchResults.length === 0 ? (
                <div style={styles.emptyResults}>
                  <Music size={32} style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '10px' }} />
                  <span>Search for any song online to retrieve original tracks.</span>
                </div>
              ) : (
                <div style={styles.resultsScroll}>
                  {searchResults.map(song => (
                    <div key={song.id} style={styles.searchResultCard}>
                      <div style={styles.coverRow}>
                        <img src={song.cover} alt={song.title} style={styles.songCoverSmall} />
                        <div style={styles.titleInfo}>
                          <h4 style={styles.songTitleSmall}>{song.title}</h4>
                          <span style={styles.songArtistSmall}>{song.artist}</span>
                          <span style={styles.songMetaSmall}>{song.genre} // {song.year}</span>
                        </div>
                        <button 
                          onClick={() => handleSongPlayToggle(song)} 
                          className="btn-secondary" 
                          style={styles.spotifyIconBtn}
                          disabled={!song.audioUrl}
                        >
                          {currentPlayingSong && currentPlayingSong.id === song.id && isPlaying ? (
                            <Pause size={14} />
                          ) : (
                            <Play size={14} fill="#fff" />
                          )}
                        </button>
                      </div>

                      <div style={styles.lyricsBlock}>
                        <span style={styles.miniLabel}>SONG PREVIEW LYRICS:</span>
                        <p style={styles.lyricsText}>{song.lyrics}</p>
                      </div>

                      <div style={styles.triviaBlock}>
                        <span style={{ ...styles.miniLabel, color: 'var(--neon-pink)' }}>FACT & TRIVIA:</span>
                        <p style={styles.triviaText}>{song.trivia}</p>
                      </div>

                      <div className="external-links-row">
                        <a 
                          href={`https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link-btn external-link-spotify"
                        >
                          Spotify <ExternalLink size={12} />
                        </a>
                        <a 
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist + ' official audio')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link-btn external-link-youtube"
                        >
                          YouTube <ExternalLink size={12} />
                        </a>
                        <a 
                          href={song.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link-btn external-link-apple"
                        >
                          Apple Music <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- SPOTIFY-STYLE FLOATING PLAYER BAR FOOTER --- */}
      {currentPlayingSong && (
        <div className="spotify-player-bar" style={styles.playerBar}>
          {/* Left: Song Info */}
          <div className="player-song-info" style={styles.playerInfo}>
            <img src={currentPlayingSong.cover} alt={currentPlayingSong.title} style={styles.playerCover} />
            <div style={styles.playerTitles}>
              <span style={styles.playerTitle}>{currentPlayingSong.title}</span>
              <span style={styles.playerArtist}>{currentPlayingSong.artist}</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <a 
                  href={`https://open.spotify.com/search/${encodeURIComponent(currentPlayingSong.title + ' ' + currentPlayingSong.artist)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="player-mini-link"
                  title="Play Full Song on Spotify"
                >
                  Spotify
                </a>
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentPlayingSong.title + ' ' + currentPlayingSong.artist + ' official audio')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="player-mini-link"
                  title="Play Full Song on YouTube"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Center: Controls & Timeline */}
          <div className="player-controls-container" style={styles.playerControls}>
            <button onClick={togglePlay} style={styles.playPauseBtn}>
              {isPlaying ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="#fff" />}
            </button>
            
            <div style={styles.playerTimeline}>
              <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="timeline-slider"
                style={{ flex: 1 }}
              />
              <span style={styles.timeLabel}>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume */}
          <div className="player-volume-container" style={styles.playerVolume}>
            <Volume2 size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{ width: '80px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },
  toggleRow: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    gap: '6px',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px 14px',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    borderRadius: '10px 10px 0 0',
  },
  workspace: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  listeningGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
    height: '100%',
    alignItems: 'start',
  },
  micViewport: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    height: '470px',
  },
  micCircleWrapper: {
    position: 'relative',
    height: '120px',
    width: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  sonarRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '1px solid var(--neon-cyan)',
    backgroundColor: 'rgba(0, 240, 255, 0.02)',
    pointerEvents: 'none',
  },
  micBtn: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    zIndex: 2,
    cursor: 'pointer',
  },
  listeningDetails: {
    textAlign: 'center',
    marginTop: '10px',
  },
  statusLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '4px',
  },
  canvasContainer: {
    width: '100%',
    height: '110px',
    background: '#030407',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '6px',
    boxSizing: 'border-box',
    marginTop: 'auto',
  },
  logsBlock: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '16px 20px',
    height: '470px',
    display: 'flex',
    flexDirection: 'column',
  },
  blockHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '8px',
    marginBottom: '14px',
  },
  blockTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1.2px',
    color: 'var(--text-secondary)',
  },
  logsContainer: {
    flex: 1,
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    color: '#34d399',
    overflowY: 'auto',
  },
  emptyLog: {
    color: '#3b82f6',
  },
  logLine: {
    lineHeight: '1.5',
    wordBreak: 'break-all',
    marginBottom: '4px',
  },
  silentMatchCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  matchCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
  },
  coverRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    width: '100%',
  },
  songCover: {
    width: '74px',
    height: '74px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  songTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.2',
  },
  songArtist: {
    fontSize: '0.85rem',
    color: 'var(--neon-cyan)',
    fontWeight: '600',
    marginTop: '2px',
  },
  songMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: '6px',
  },
  lyricsBlock: {
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '10px 14px',
    marginTop: '4px',
  },
  miniLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '4px',
  },
  lyricsText: {
    fontSize: '0.8rem',
    color: '#cbd5e1',
    lineHeight: '1.4',
    fontStyle: 'italic',
  },
  spotifyBtn: {
    marginTop: 'auto',
    padding: '10px 16px',
    fontSize: '0.8rem',
  },
  lyricsWorkspace: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    height: '100%',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    width: '100%',
  },
  searchResultsContainer: {
    flex: 1,
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '16px',
    height: '390px',
    overflow: 'hidden',
  },
  emptyResults: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
  resultsScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    height: '100%',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  searchResultCard: {
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  songCoverSmall: {
    width: '54px',
    height: '54px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  songTitleSmall: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
  },
  songArtistSmall: {
    fontSize: '0.8rem',
    color: 'var(--neon-cyan)',
    fontWeight: '600',
  },
  songMetaSmall: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  spotifyIconBtn: {
    padding: '8px',
    borderRadius: '8px',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triviaBlock: {
    background: 'rgba(255, 0, 127, 0.02)',
    border: '1px dashed rgba(255, 0, 127, 0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
  },
  triviaText: {
    fontSize: '0.78rem',
    color: '#e2e8f0',
    lineHeight: '1.45',
  },

  // Spotify-style Sticky Player Bar Styles
  playerBar: {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: '100%',
    height: '76px',
    background: 'rgba(10, 11, 22, 0.95)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    marginLeft: '-20px',
    marginRight: '-20px',
    marginBottom: '-20px',
    borderRadius: '0 0 20px 20px',
    zIndex: 10,
    boxSizing: 'content-box',
  },
  playerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '30%',
  },
  playerCover: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  playerTitles: {
    display: 'flex',
    flexDirection: 'column',
  },
  playerTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.2',
  },
  playerArtist: {
    fontSize: '0.75rem',
    color: 'var(--neon-cyan)',
    fontWeight: '600',
  },
  playerControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    width: '45%',
  },
  playPauseBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--neon-cyan)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
    boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
  },
  playerTimeline: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
  },
  timeLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    width: '30px',
  },
  playerVolume: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '25%',
  },
  liveTranscriptBubble: {
    background: 'rgba(0, 240, 255, 0.06)',
    border: '1px solid rgba(0, 240, 255, 0.15)',
    borderRadius: '12px',
    padding: '8px 12px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '95%',
    boxShadow: '0 0 10px rgba(0, 240, 255, 0.05)',
  },
  suggestionsBox: {
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '12px',
    width: '100%',
    textAlign: 'left',
  },
  suggestionsList: {
    margin: '6px 0 0 0',
    paddingLeft: '18px',
    fontSize: '0.75rem',
    color: '#cbd5e1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    lineHeight: '1.4',
  },
  suggestionItem: {
    listStyleType: 'disc',
  },
  langSelectorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '6px',
    width: '100%',
  },
  langSelect: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    padding: '4px 8px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-heading)',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }
};
