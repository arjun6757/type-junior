import { useState, useEffect, useRef, useCallback } from "react"
import { Clock, RotateCcw } from "lucide-react"

export default function MonkeyType() {
  // Sample text for typing test
  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
    "Programming is the process of taking an algorithm and encoding it into a notation, a programming language, so that it can be executed by a computer.",
    "The best way to predict the future is to invent it. Computer science education cannot make anybody an expert programmer any more than studying brushes and pigment can make somebody an expert painter.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  ]

  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [incorrectChars, setIncorrectChars] = useState(new Set())

  const containerRef = useRef(null)
  const timerRef = useRef(null)

  // Initialize with a random text
  useEffect(() => {
    resetTest()
  }, [])

  // Timer logic
  useEffect(() => {
    if (isActive && !completed) {
      timerRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000
        setTimeElapsed(elapsedTime)

        // Calculate WPM: (characters typed / 5) / minutes elapsed
        // 5 characters is considered as one word
        const minutes = elapsedTime / 60
        if (minutes > 0) {
          const wordsTyped = charCount / 5
          setWpm(Math.round(wordsTyped / minutes))
        }
      }, 100)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, startTime, charCount, completed])

  // Focus the container when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  const resetTest = useCallback(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    setText(randomText)
    setUserInput("")
    setStartTime(0)
    setWordCount(0)
    setCharCount(0)
    setWpm(0)
    setAccuracy(100)
    setIsActive(false)
    setTimeElapsed(0)
    setCompleted(false)
    setCurrentCharIndex(0)
    setIncorrectChars(new Set())

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      // Prevent default behavior for certain keys
      if (e.key === "Tab") {
        e.preventDefault()
        resetTest()
        return
      }

      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return

      // Start the timer on first keypress
      if (!isActive && !completed) {
        setIsActive(true)
        setStartTime(Date.now())
      }

      if (completed) return

      if (e.key === "Backspace") {
        e.preventDefault()
        if (currentCharIndex > 0) {
          const newIndex = currentCharIndex - 1
          setCurrentCharIndex(newIndex)

          // Remove the character from incorrect set if it was there
          const newIncorrectChars = new Set(incorrectChars)
          newIncorrectChars.delete(newIndex)
          setIncorrectChars(newIncorrectChars)

          // Update user input
          setUserInput((prev) => prev.slice(0, -1))

          // Update char count
          setCharCount((prev) => Math.max(0, prev - 1))
        }
        return
      }

      // Only process printable characters (length 1)
      if (e.key.length === 1) {
        e.preventDefault()

        // Check if we've reached the end of the text
        if (currentCharIndex >= text.length) {
          return
        }

        const expectedChar = text[currentCharIndex]
        const isCorrect = e.key === expectedChar

        // Update incorrect characters set
        const newIncorrectChars = new Set(incorrectChars)
        if (!isCorrect) {
          newIncorrectChars.add(currentCharIndex)
        }
        setIncorrectChars(newIncorrectChars)

        // Update user input
        setUserInput((prev) => prev + e.key)

        // Move to next character
        const newIndex = currentCharIndex + 1
        setCurrentCharIndex(newIndex)

        // Update character count
        setCharCount((prev) => prev + 1)

        // Update word count if space is typed
        if (e.key === " ") {
          setWordCount((prev) => prev + 1)
        }

        // Calculate accuracy
        const totalChars = newIndex
        const incorrectCount = newIncorrectChars.size
        const newAccuracy = Math.round(((totalChars - incorrectCount) / totalChars) * 100)
        setAccuracy(newAccuracy)

        // Check if test is completed
        if (newIndex === text.length) {
          setCompleted(true)
          setIsActive(false)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }
    },
    [isActive, completed, currentCharIndex, text, incorrectChars, resetTest],
  )

  // Render the text with highlighting for current position and errors
  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-gray-400" // Default: not typed yet

      if (index < currentCharIndex) {
        // Already typed
        className = incorrectChars.has(index) ? "text-red-500" : "text-green-500"
      } else if (index === currentCharIndex) {
        // Current character
        className = "bg-gray-300 text-gray-800"
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">MonkeyType Clone</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-xl">{timeElapsed.toFixed(1)}s</span>
            </div>
            <button
              onClick={resetTest}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-md transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="stat-box">
            <span className="text-3xl font-bold">{wpm}</span>
            <span className="text-gray-400 text-sm">WPM</span>
          </div>
          <div className="stat-box">
            <span className="text-3xl font-bold">{accuracy}%</span>
            <span className="text-gray-400 text-sm">Accuracy</span>
          </div>
          <div className="stat-box">
            <span className="text-3xl font-bold">{charCount}</span>
            <span className="text-gray-400 text-sm">Characters</span>
          </div>
        </div>

        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative bg-gray-800 p-6 rounded-lg mb-6 font-mono text-lg leading-relaxed outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        >
          <div className="text-wrap">{renderText()}</div>
        </div>

        {completed ? (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Test Completed!</h2>
            <p>
              You typed at {wpm} WPM with {accuracy}% accuracy.
            </p>
            <button
              onClick={resetTest}
              className="mt-4 bg-green-800 hover:bg-green-700 text-green-100 px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-gray-400 mb-2">{isActive ? "Keep typing..." : "Start typing to begin the test"}</p>
            <p className="text-gray-500 text-sm">Press Tab to reset the test</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .stat-box {
          background-color: rgba(31, 41, 55, 0.5);
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }
      `}</style>
    </div>
  )
}