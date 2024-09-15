import React, { useState, useRef, useEffect } from "react";
import apiService from "./apiService"; // Adjust the path if necessary
import './App.css'
const SearchPage = ({ subject }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState(null);
  const [showBlanks, setShowBlanks] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [category, setCategory] = useState(subject || "Math");
  const [allBlanksFilled, setAllBlanksFilled] = useState(false);
  const audioRef = useRef(null);

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
        wordObj.isCorrect = false;
      }
      setSongData({ ...songData });
    }
  };

  const moveToNextBlank = (currentLineIndex, currentWordIndex) => {
    let nextLineIndex = currentLineIndex;
    let nextWordIndex = currentWordIndex + 1;

    // Find the next blank in the current line
    while (
      nextWordIndex < songData.lyrics[nextLineIndex].words.length &&
      !songData.lyrics[nextLineIndex].words[nextWordIndex].isBlank
    ) {
      nextWordIndex++;
    }

    // If no more blanks in current line, move to the next line
    while (
      nextWordIndex >= songData.lyrics[nextLineIndex].words.length &&
      nextLineIndex < songData.lyrics.length - 1
    ) {
      nextLineIndex++;
      nextWordIndex = 0;
      // Find the next blank in the new line
      while (
        nextWordIndex < songData.lyrics[nextLineIndex].words.length &&
        !songData.lyrics[nextLineIndex].words[nextWordIndex].isBlank
      ) {
        nextWordIndex++;
      }
    }

    // If a next blank is found, focus on it
    if (
      nextLineIndex < songData.lyrics.length &&
      nextWordIndex < songData.lyrics[nextLineIndex].words.length &&
      songData.lyrics[nextLineIndex].words[nextWordIndex].isBlank &&
      !songData.lyrics[nextLineIndex].words[nextWordIndex].isCorrect
    ) {
      // Focus on the next input
      const inputId = `input-${nextLineIndex}-${nextWordIndex}`;
      const nextInput = document.getElementById(inputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      // All blanks are filled
      setAllBlanksFilled(true);
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

  if (allBlanksFilled) {
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
            // Show only previous lines (dimmed), current line, and next line
            if (index < currentLineIndex - 1 || index > currentLineIndex + 1) {
              return null;
            }

            const isCurrentLine = index === currentLineIndex;
            const isPreviousLine = index < currentLineIndex;
            const lineClass = isCurrentLine
              ? "current-line"
              : isPreviousLine
              ? "dimmed-line"
              : "";

            return (
              <p key={index} className={lineClass}>
                {line.words.map((wordObj, wordIdx) => {
                  if (showBlanks && wordObj.isBlank) {
                    if (isCurrentLine) {
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

export default SearchPage;
