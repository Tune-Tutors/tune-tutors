// App.js
import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/clerk-react";
import "./App.css";
// Import your API service
import apiService from "./apiService"; // Adjust the path if necessary

// BackgroundCanvas Component
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();

    const musicNotes = ["♩", "♪", "♫", "♬"];

    const fontSize = 20;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(219, 113, 177, 0.5)";
      ctx.font = `${fontSize}px sans-serif`;

      for (let i = 0; i < drops.length; i++) {
        const text = musicNotes[Math.floor(Math.random() * musicNotes.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    window.addEventListener("resize", setCanvasDimensions);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-canvas" />;
};

// Main App Component
function App() {
  return (
    <ClerkProvider publishableKey="pk_test_d2FudGVkLWxlbXVyLTM3LmNsZXJrLmFjY291bnRzLmRldiQ">
      <Router>
        <Layout />
      </Router>
    </ClerkProvider>
  );
}

function Layout() {
  return (
    <div className="App">
      <BackgroundCanvas />
      <Navbar />
      <SignedIn>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPageWrapper />} />
          <Route path="/search/:subject" element={<SearchPageWrapper />} />
          {/* Add other routes as needed */}
        </Routes>
      </SignedIn>
      <SignedOut>
        <div className="layout-container">
          <div className="clerk-signin">
            <SignIn
              path="/sign-in"
              routing="path"
              appearance={{
                variables: {
                  colorPrimary: "#db71b1",
                  fontFamily: '"Roboto", sans-serif',
                },
                elements: {
                  card: "cl-card",
                  headerTitle: "cl-header-title",
                  formButtonPrimary: "cl-form-button-primary",
                  formFieldInput: "cl-form-field-input",
                },
              }}
            />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

// Navbar Component
const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">TuneTutor</Link>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li>
          <a href="#features" onClick={() => setMenuActive(false)}>
            Features
          </a>
        </li>
        <li>
          <a href="#about" onClick={() => setMenuActive(false)}>
            About Us
          </a>
        </li>
        <li>
          <a href="#contact" onClick={() => setMenuActive(false)}>
            Contact
          </a>
        </li>
      </ul>
      <SignedIn>
        <div className="user-button">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "user-avatar",
              },
            }}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="auth-links">
          <a href="/sign-in" className="auth-link">
            Sign In
          </a>
        </div>
      </SignedOut>
    </nav>
  );
};

// Home Component
const Home = () => (
  <>
    <Hero />
    <Features />
    <Footer />
  </>
);
const Hero = () => (
  <section className="hero">
    <h1>Changing Education's Status Quo Through Music</h1>
    <p>
      Meet TuneTutor, the intelligent music guru that helps you create songs
      based on any topic.
    </p>
    <Link to="/search" className="navigate-btn">
      Dive In
    </Link>
  </section>
);

// Features Component
const Features = () => (
  <section id="features" className="features">
    <h2>Why Us?</h2>
    <div className="feature-list">
      <div className="feature-item">
        <h3>Unique Learning</h3>
        <p>AI-driven music for you to master your subject of choice.</p>
      </div>
      <div className="feature-item">
        <h3>Auditory Emphasis</h3>
        <p>
          Providing new solutions for the visually impaired or auditory
          learners.
        </p>
      </div>
      <div className="feature-item">
        <h3>Interactive Exercises</h3>
        <p>
          Engaging exercises to test your knowledge and build your skillset.
        </p>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="footer">
    <p>&copy; 2024 TuneTutor | Empowering education through AI</p>
    <ul className="footer-links">
      <li>
        <a href="#terms">Terms of Service</a>
      </li>
      <li>
        <a href="#privacy">Privacy Policy</a>
      </li>
    </ul>
  </footer>
);

const SearchPage = ({ subject }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState(null);
  const [showBlanks, setShowBlanks] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [category, setCategory] = useState(subject || "Math");
  const [allBlanksFilled, setAllBlanksFilled] = useState(false);
  const audioRef = useRef(null);

  const numLinesToShow = 2; // Number of lines to show at a time

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiService(query); // Assuming this returns { url, lyrics }
      console.log(result);
      const processedLyrics = processLyrics(result.lyrics);
      setSongData({ url: result.url, lyrics: processedLyrics });
    } catch (error) {
      console.error("Failed to fetch song data:", error);
      // Optionally, set an error state here to inform the user
    } finally {
      setLoading(false);
    }
  };

  const processLyrics = (lyricsText) => {
    if (!lyricsText || typeof lyricsText !== "string") {
      return [];
    }

    // Split lyrics string into lines based on newlines
    const lines = lyricsText.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line) => {
      const words = line.split(" ");
      const numBlanks = Math.ceil(words.length * 0.3); // 30% blanks
      const indices = [];
      while (indices.length < numBlanks) {
        const idx = Math.floor(Math.random() * words.length);
        if (!indices.includes(idx)) {
          indices.push(idx);
        }
      }
      const newWords = words.map((word, idx) => ({
        word,
        isBlank: indices.includes(idx),
        userInput: "",
        isCorrect: null, // To track correctness
        attempts: 0, // Initialize attempts
      }));
      return { text: line, words: newWords };
    });
  };

  const toggleBlanks = () => {
    setShowBlanks(!showBlanks);
  };

  const handleUserInput = (lineIndex, wordIndex, value) => {
    setSongData((prevData) => {
      const newLyrics = [...prevData.lyrics];
      newLyrics[lineIndex].words[wordIndex].userInput = value;
      return { ...prevData, lyrics: newLyrics };
    });
  };

  const handleKeyDown = (e, lineIndex, wordIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const wordObj = songData.lyrics[lineIndex].words[wordIndex];
      const isCorrect =
        wordObj.userInput.trim().toLowerCase() ===
        wordObj.word.trim().toLowerCase();
      if (isCorrect) {
        wordObj.isCorrect = true;

        // Move to the next blank
        moveToNextBlank(lineIndex, wordIndex);
      } else {
        wordObj.attempts += 1; // Increment attempts
        wordObj.isCorrect = false; // To trigger incorrect styling
        if (wordObj.attempts >= 2) {
          // Reveal the correct word
          wordObj.userInput = wordObj.word;
          wordObj.isCorrect = true; // Mark as correct to prevent further editing
          moveToNextBlank(lineIndex, wordIndex);
        }
      }
      setSongData({ ...songData });

      // Check if all blanks in the current line are filled or attempts exhausted
      const currentLine = songData.lyrics[lineIndex];
      const allBlanksInLineFilled = currentLine.words.every(
        (word) =>
          !word.isBlank || word.isCorrect === true || word.attempts >= 2
      );
      if (allBlanksInLineFilled) {
        // Move to the next line
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const moveToNextBlank = (currentLineIndex, currentWordIndex) => {
    let nextLineIndex = currentLineIndex;
    let nextWordIndex = currentWordIndex + 1;

    // Find the next blank in the current line
    while (
      nextWordIndex < songData.lyrics[nextLineIndex].words.length &&
      (!songData.lyrics[nextLineIndex].words[nextWordIndex].isBlank ||
        songData.lyrics[nextLineIndex].words[nextWordIndex].isCorrect === true)
    ) {
      nextWordIndex++;
    }

    // If no more blanks in current line
    if (nextWordIndex >= songData.lyrics[nextLineIndex].words.length) {
      // Check if all blanks are filled in the current line
      const currentLine = songData.lyrics[currentLineIndex];
      const allBlanksInLineFilled = currentLine.words.every(
        (word) =>
          !word.isBlank || word.isCorrect === true || word.attempts >= 2
      );
      if (allBlanksInLineFilled) {
        // Move to the next line
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
      }
      return;
    }

    // If a next blank is found, focus on it
    if (
      nextLineIndex < songData.lyrics.length &&
      nextWordIndex < songData.lyrics[nextLineIndex].words.length &&
      songData.lyrics[nextLineIndex].words[nextWordIndex].isBlank &&
      songData.lyrics[nextLineIndex].words[nextWordIndex].isCorrect !== true
    ) {
      // Focus on the next input
      const inputId = `input-${nextLineIndex}-${nextWordIndex}`;
      const nextInput = document.getElementById(inputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      // Check if all blanks are filled or attempts are exhausted
      const allFilled = songData.lyrics.every((line) =>
        line.words.every(
          (word) =>
            !word.isBlank || word.isCorrect === true || word.attempts >= 2
        )
      );
      if (allFilled) {
        setAllBlanksFilled(true);
      }
    }
  };

  const restartSong = () => {
    setSongData(null);
    setQuery("");
    setAllBlanksFilled(false);
    setCurrentLineIndex(0);
  };

  useEffect(() => {
    if (audioRef.current && songData) {
      const audio = audioRef.current;

      const handleAudioLoaded = () => {
        // Auto-play the audio
        audio.play().catch((err) => {
          console.log("Auto-play failed:", err);
          // Optionally, prompt the user to click a play button
        });

        const duration = audio.duration;
        const timePerLine = duration / songData.lyrics.length;

        const newLyrics = songData.lyrics.map((line, index) => ({
          ...line,
          startTime: index * timePerLine,
          endTime: (index + 1) * timePerLine,
        }));

        setSongData((prevData) => ({
          ...prevData,
          lyrics: newLyrics,
        }));
      };

      const updateLyrics = () => {
        const currentTime = audio.currentTime;
        const index = songData.lyrics.findIndex(
          (line) => line.endTime > currentTime
        );
        if (index !== -1 && index !== currentLineIndex) {
          setCurrentLineIndex(index);
        }
      };

      audio.addEventListener("loadedmetadata", handleAudioLoaded);
      audio.addEventListener("timeupdate", updateLyrics);
      return () => {
        audio.removeEventListener("loadedmetadata", handleAudioLoaded);
        audio.removeEventListener("timeupdate", updateLyrics);
      };
    }
  }, [audioRef, songData, currentLineIndex]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // **Add a check to ensure songData is not null before accessing songData.lyrics**
  if (songData && (allBlanksFilled || currentLineIndex >= songData.lyrics.length)) {
    return (
      <div className="song-screen">
        <h2>Congratulations! You've completed the song.</h2>
        <button onClick={restartSong} className="restart-btn">
          Restart
        </button>
      </div>
    );
  }

  if (songData) {
    return (
      <div className="song-screen">
        <audio ref={audioRef} src={songData.url} controls />
        <button onClick={toggleBlanks} className="toggle-blanks-btn">
          {showBlanks ? "Show Full Lyrics" : "Fill in the Blanks"}
        </button>
        <div className="lyrics-display">
          {songData.lyrics.map((line, index) => {
            // Only show lines from currentLineIndex to currentLineIndex + numLinesToShow - 1
            if (
              index < currentLineIndex ||
              index > currentLineIndex + numLinesToShow - 1
            ) {
              return null;
            }

            const isCurrentLine = index === currentLineIndex;
            const isNextLine = index === currentLineIndex + 1;
            const lineClass = isCurrentLine
              ? "current-line"
              : isNextLine
              ? "next-line"
              : "";

            return (
              <p key={index} className={lineClass}>
                {line.words.map((wordObj, wordIdx) => {
                  if (showBlanks && wordObj.isBlank) {
                    if (isCurrentLine) {
                      if (wordObj.attempts >= 2) {
                        // After two wrong attempts, display the correct word
                        return (
                          <span key={wordIdx} className="missed-word">
                            {wordObj.word}{" "}
                          </span>
                        );
                      }
                      return (
                        <input
                          type="text"
                          key={wordIdx}
                          id={`input-${index}-${wordIdx}`}
                          value={wordObj.userInput}
                          onChange={(e) =>
                            handleUserInput(index, wordIdx, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index, wordIdx)}
                          className={`blank-input ${
                            wordObj.isCorrect === true
                              ? "correct"
                              : wordObj.isCorrect === false
                              ? "incorrect"
                              : ""
                          }`}
                          disabled={wordObj.isCorrect === true}
                        />
                      );
                    } else {
                      return (
                        <span key={wordIdx} className="blank-space">
                          _____{" "}
                        </span>
                      );
                    }
                  } else {
                    return <span key={wordIdx}>{wordObj.word} </span>;
                  }
                })}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <h1>Generate Your Learning Song</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="category-selection">
          <label>Select a Category:</label>
          <div className="category-options">
            <button
              type="button"
              className={`category-btn ${category === "Math" ? "active" : ""}`}
              onClick={() => setCategory("Math")}
            >
              Math
            </button>
            <button
              type="button"
              className={`category-btn ${
                category === "English" ? "active" : ""
              }`}
              onClick={() => setCategory("English")}
            >
              English
            </button>
            <button
              type="button"
              className={`category-btn ${
                category === "Science" ? "active" : ""
              }`}
              onClick={() => setCategory("Science")}
            >
              Science
            </button>
            <button
              type="button"
              className={`category-btn ${
                category === "History" ? "active" : ""
              }`}
              onClick={() => setCategory("History")}
            >
              History
            </button>
          </div>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Enter a topic in ${category}`}
          className="search-input"
          required
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </div>
  );
};



const SearchPageWrapper = () => {
  const { subject } = useParams();
  // Default subject if none is provided
  const defaultSubject = subject || "General";

  return <SearchPage subject={defaultSubject} />;
};

export default App;
