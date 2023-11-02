import { useState, useEffect } from 'react'
import Question from './Components/Question'

function App() {
  const [questionData, setQuestionData] = useState([])
  const [questionsArray, setQuestionsArray] = useState([])
  const [userAnswersArray, setUserAnswersArray] = useState(new Array(5))
  const [loading, setLoading] = useState(true)
  const [gameState, setGameState] = useState(-1)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  useEffect(() => {
    dataFetch()
  }, [])

  useEffect(() => {
    if (questionData?.length > 0) {
      setQuestionsArray(getQuestionsArray())
      setLoading(false)
    }
  }, [questionData])

  async function dataFetch() {
    try {
      const rss = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      const data = await rss.json()
      setQuestionData(data.results)
    } catch (error) {
      console.log(error)
    }
  }

  function getQuestionsArray() {
    const questions = questionData.map(({ incorrect_answers, correct_answer, question }) => {
      const { array, randIndex } = shuffle(incorrect_answers, correct_answer)
      return {
        question: question,
        answers: array,
        answerIndex: randIndex,
      }
    })
    return questions
  }

  function shuffle(array, answer) {
    const randIndex = Math.floor(Math.random() * array.length)
    array.splice(randIndex, 0, answer)
    return { array, randIndex }
  }

  function checkAnswers() {
    userAnswersArray.forEach((answer, index) => {
      console.log(answer, questionsArray[index].answerIndex)
      if (answer == questionsArray[index].answerIndex)
        setCorrectAnswers(prev => prev + 1)
    })
    setGameState(1)
  }

  function setNewGame() {
    setCorrectAnswers(0)
    setGameState(0)
    setLoading(true)
    dataFetch()
  }

  function updateAnswersArray(index, answer) {
    const newArray = [...userAnswersArray]
    newArray[index] = answer
    setUserAnswersArray(newArray)
  }

  const quizzForm = questionsArray.map(({ question, answers, answerIndex }, index) => {
    return (
      <Question
        key={index}
        question={question}
        answers={answers}
        answerIndex={answerIndex}
        gameState={gameState}
        updateAnswersArray={updateAnswersArray}
        position={index}
      />
    )
  })

  return (
    <>
      {
        gameState == -1 ? <button className='submit-button' onClick={() => setGameState(0)}>Start the game</button> :
          !loading ?
            <div className='container'>
              {quizzForm}
              <div> 
                {
                  gameState ?
                    <>
                      <p>You got {correctAnswers} </p>
                      <button onClick={setNewGame} className='submit-button'>Load new quizz</button>
                    </> :
                    <button onClick={checkAnswers} className='submit-button'>Check answers</button>
                }
              </div>
            </div>
            :
            <h1>Loading...</h1>
      }
    </>
  )
}

export default App
