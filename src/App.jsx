import React, { useState } from 'react'
import './App.css'

export default function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNew, setWaitingForNew] = useState(false)

  const handleNumber = (num) => {
    if (waitingForNew) {
      setDisplay(String(num))
      setWaitingForNew(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (waitingForNew) {
      setDisplay('0.')
      setWaitingForNew(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperation = (op) => {
    const currentValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setOperation(op)
    setWaitingForNew(true)
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
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNew(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNew(false)
  }

  return (
    <div className="calculator">
      <div className="calculator-box">
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
    </div>
  )
}
