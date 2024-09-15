// SearchPage.js
import React, { useState, useEffect, useRef } from "react";
import "./SearchPage.css";
import apiService from "./apiService";

const SearchPage = ({ subject }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState(null);
  const [showBlanks, setShowBlanks] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
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
      setSongData((prevData) => {
        const newLyrics = [...prevData.lyrics];
        const wordObj = newLyrics[lineIndex].words[wordIndex];
        const isCorrect =
          wordObj.userInput.trim().toLowerCase() ===
          wordObj.word.trim().toLowerCase();
        wordObj.isCorrect = isCorrect;
        return { ...prevData, lyrics: newLyrics };
      });
    }
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
        const index =
          songData.lyrics.findIndex((line) => line.endTime > currentTime);
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
                      return <span key={wordIdx}>_____ </span>;
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
      <h1>Choose Your {subject} Topic</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${subject}`}
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
