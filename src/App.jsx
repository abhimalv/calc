import React, { useState, useEffect, useRef } from 'react'
import './App.css'

export default function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNew, setWaitingForNew] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [theme, setTheme] = useState('light')
  const confettiRef = useRef(null)

  // Load persisted settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calc:history')
      if (saved) setHistory(JSON.parse(saved))
    } catch (e) {
      /* ignore */
    }
    try {
      const savedTheme = localStorage.getItem('calc:theme')
      if (savedTheme) setTheme(savedTheme)
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
      }
    } catch (e) {
      /* ignore */
    }
  }, [])

  // Persist history and theme
  useEffect(() => {
    try {
      localStorage.setItem('calc:history', JSON.stringify(history))
    } catch (e) {}
  }, [history])

  useEffect(() => {
    try {
      localStorage.setItem('calc:theme', theme)
    } catch (e) {}
  }, [theme])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(parseInt(e.key))
      if (e.key === '.') handleDecimal()
      if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault()
        handleOperation(e.key)
      }
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        handleEquals()
      }
      if (e.key === 'Backspace' || e.key.toLowerCase() === 'c') {
        e.preventDefault()
        handleClear()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [display, previousValue, operation, waitingForNew])

  const handleNumber = (num) => {
    if (waitingForNew) {
      setDisplay(String(num))
      setWaitingForNew(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
    playSound()
  }

  const handleDecimal = () => {
    if (waitingForNew) {
      setDisplay('0.')
      setWaitingForNew(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
    playSound()
  }

  const handleOperation = (op) => {
    const currentValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
      return
    }

    setOperation(op)
    setWaitingForNew(true)
    playSound()
  }

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return prev / current
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display)
      const result = calculate(previousValue, currentValue, operation)
      const formattedResult = Math.round(result * 100000000) / 100000000
      setDisplay(String(formattedResult))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNew(true)
      playSound()
      addToHistory(`${previousValue} ${operation} ${currentValue} = ${formattedResult}`)
      launchConfetti()
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNew(false)
    playSound()
  }

  const playSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    
    oscillator.frequency.value = 600
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.1, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const addToHistory = (entry) => {
    setHistory((h) => [entry, ...h].slice(0, 10))
  }

  const toggleHistory = () => setShowHistory((s) => !s)

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const launchConfetti = () => {
    const canvas = confettiRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const particles = []
    const colors = ['#ff6b6b', '#51cf66', '#ffd43b', '#748ffc', '#ff8fab']
    const w = (canvas.width = canvas.clientWidth)
    const h = (canvas.height = canvas.clientHeight)
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h - h / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 6 + 2,
        size: Math.random() * 6 + 4,
        color: colors[(i + Math.floor(Math.random() * colors.length)) % colors.length],
        rot: Math.random() * Math.PI
      })
    }

    let running = true
    const start = performance.now()
    const draw = (t) => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15
        p.rot += 0.1
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      })
      if (performance.now() - start > 1400) running = false
      if (running) requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, w, h)
    }
    requestAnimationFrame(draw)
  }

  return (
    <div className={`calculator ${theme}`}>
      <canvas ref={confettiRef} className="confetti-canvas" />
      <div className="calculator-box">
        <div className="topbar">
          <button className="ghost" onClick={toggleHistory}>{showHistory ? 'Hide' : 'History'}</button>
          <button className="ghost" onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'}</button>
        </div>
        <div className="display">{display}</div>
        <div className="buttons">
          <button className="clear" onClick={handleClear}>
            AC
          </button>
          <button className="operator" onClick={() => handleOperation('/')}>
            ÷
          </button>
          <button className="operator" onClick={() => handleOperation('*')}>
            ×
          </button>

          <button className="number" onClick={() => handleNumber(7)}>
            7
          </button>
          <button className="number" onClick={() => handleNumber(8)}>
            8
          </button>
          <button className="number" onClick={() => handleNumber(9)}>
            9
          </button>
          <button className="operator" onClick={() => handleOperation('-')}>
            −
          </button>

          <button className="number" onClick={() => handleNumber(4)}>
            4
          </button>
          <button className="number" onClick={() => handleNumber(5)}>
            5
          </button>
          <button className="number" onClick={() => handleNumber(6)}>
            6
          </button>
          <button className="operator" onClick={() => handleOperation('+')}>
            +
          </button>

          <button className="number" onClick={() => handleNumber(1)}>
            1
          </button>
          <button className="number" onClick={() => handleNumber(2)}>
            2
          </button>
          <button className="number" onClick={() => handleNumber(3)}>
            3
          </button>
          <button className="equals" onClick={handleEquals}>
            =
          </button>

          <button
            className="number"
            style={{ gridColumn: 'span 2' }}
            onClick={() => handleNumber(0)}
          >
            0
          </button>
          <button className="decimal" onClick={handleDecimal}>
            .
          </button>
        </div>
      </div>
      {showHistory && (
        <aside className="history-panel">
          <h4>History</h4>
          <ul>
            {history.length === 0 && <li className="muted">No recent calculations</li>}
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}
