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
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [category, setCategory] = useState(subject || "Math");
  const [allVersesCompleted, setAllVersesCompleted] = useState(false);
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

    // Split lyrics into lines
    const lines = lyricsText.split("\n").filter((line) => line.trim() !== "");

    // Initialize an array to hold verses
    const verses = [];
    let currentVerse = [];

    lines.forEach((line) => {
      if (
        line.toLowerCase().includes("verse") ||
        line.toLowerCase().includes("chorus")
      ) {
        // If line contains "Verse" or "Chorus", start a new verse
        if (currentVerse.length > 0) {
          verses.push(currentVerse);
          currentVerse = [];
        }
      } else {
        currentVerse.push(line);
      }
    });

    // Add the last verse if not empty
    if (currentVerse.length > 0) {
      verses.push(currentVerse);
    }

    // Now process each verse
    const processedVerses = verses.map((verse) => {
      return verse.map((line) => {
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
    });

    return processedVerses;
  };

  const toggleBlanks = () => {
    setShowBlanks(!showBlanks);
  };

  const handleUserInput = (verseIndex, lineIndex, wordIndex, value) => {
    setSongData((prevData) => {
      const newLyrics = JSON.parse(JSON.stringify(prevData.lyrics));
      newLyrics[verseIndex][lineIndex].words[wordIndex].userInput = value;
      return { ...prevData, lyrics: newLyrics };
    });
  };

  const handleKeyDown = (e, verseIndex, lineIndex, wordIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Use functional setState to ensure we're working with the latest state
      setSongData((prevSongData) => {
        // Clone the previous songData to avoid mutating state directly
        const newSongData = JSON.parse(JSON.stringify(prevSongData));
        const wordObj =
          newSongData.lyrics[verseIndex][lineIndex].words[wordIndex];
        const isCorrect =
          wordObj.userInput.trim().toLowerCase() ===
          wordObj.word.trim().toLowerCase();

        if (isCorrect) {
          wordObj.isCorrect = true;
        } else {
          wordObj.attempts += 1;
          wordObj.isCorrect = false;
          if (wordObj.attempts >= 2) {
            wordObj.userInput = wordObj.word;
            wordObj.isCorrect = true;
          }
        }

        // Now, check if all blanks in the current line are filled
        const currentLine = newSongData.lyrics[verseIndex][lineIndex];
        const allBlanksInLineFilled = currentLine.words.every(
          (word) =>
            !word.isBlank || word.isCorrect === true || word.attempts >= 2
        );

        if (allBlanksInLineFilled) {
          const isLastLineInVerse =
            lineIndex >= newSongData.lyrics[verseIndex].length - 1;
          if (isLastLineInVerse) {
            // Check if all verses are completed
            checkIfVerseCompleted(verseIndex, newSongData);
          } else {
            // Move to the next line
            setCurrentLineIndex((prevIndex) => prevIndex + 1);
          }
        } else {
          // Move to next blank in the current line
          moveToNextBlank(verseIndex, lineIndex, wordIndex, newSongData);
        }

        return newSongData;
      });
    }
  };

  const moveToNextBlank = (
    verseIndex,
    lineIndex,
    wordIndex,
    updatedSongData
  ) => {
    const songDataToUse = updatedSongData || songData;
    let vIndex = verseIndex;
    let lIndex = lineIndex;
    let wIndex = wordIndex + 1;

    // Find the next blank in the current line
    while (
      wIndex < songDataToUse.lyrics[vIndex][lIndex].words.length &&
      (!songDataToUse.lyrics[vIndex][lIndex].words[wIndex].isBlank ||
        songDataToUse.lyrics[vIndex][lIndex].words[wIndex].isCorrect === true)
    ) {
      wIndex++;
    }

    // If a next blank is found in the current line, focus on it
    if (
      wIndex < songDataToUse.lyrics[vIndex][lIndex].words.length &&
      songDataToUse.lyrics[vIndex][lIndex].words[wIndex].isBlank &&
      songDataToUse.lyrics[vIndex][lIndex].words[wIndex].isCorrect !== true
    ) {
      // Focus on the next input
      const inputId = `input-${vIndex}-${lIndex}-${wIndex}`;
      const nextInput = document.getElementById(inputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      // No more blanks in the current line
      // Do nothing; handleKeyDown will manage moving to the next line when appropriate
    }
  };

  const checkIfVerseCompleted = (verseIndex, updatedSongData) => {
    const songDataToUse = updatedSongData || songData;
    const currentVerse = songDataToUse.lyrics[verseIndex];
    const allBlanksInVerseFilled = currentVerse.every((line) =>
      line.words.every(
        (word) =>
          !word.isBlank || word.isCorrect === true || word.attempts >= 2
      )
    );
    if (allBlanksInVerseFilled) {
      if (verseIndex + 1 < songDataToUse.lyrics.length) {
        // Move to the next verse
        setCurrentVerseIndex(verseIndex + 1);
        setCurrentLineIndex(0);
      } else {
        // All verses completed
        setAllVersesCompleted(true);
      }
    } else {
      // Reset currentLineIndex to 0 for the next verse
      setCurrentLineIndex(0);
    }
  };

  const restartSong = () => {
    setSongData(null);
    setQuery("");
    setAllVersesCompleted(false);
    setCurrentVerseIndex(0);
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

        // Optionally, you can set up audio synchronization here
        // For now, we'll skip updating currentLineIndex based on audio time
      };

      audio.addEventListener("loadedmetadata", handleAudioLoaded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleAudioLoaded);
      };
    }
  }, [audioRef, songData]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (allVersesCompleted) {
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
          {songData.lyrics[currentVerseIndex].map((line, index) => {
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
                          id={`input-${currentVerseIndex}-${index}-${wordIdx}`}
                          value={wordObj.userInput}
                          onChange={(e) =>
                            handleUserInput(
                              currentVerseIndex,
                              index,
                              wordIdx,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(
                              e,
                              currentVerseIndex,
                              index,
                              wordIdx
                            )
                          }
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
