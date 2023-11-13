import { useEffect, useState } from "react"
import { decode } from "html-entities"

export default function Question({question, answers, answerIndex, gameState, updateAnswersArray, position}){
    const [selected, setSelected] = useState()

    useEffect(() => {
        setSelected(null)
    }, [question])

    const questionText = decode(question)
    const disable = gameState ? true : false
    
    const options = answers.map((option, index) => {
        const text = decode(option)
        const classOption = `option ${!gameState ? selected == index ? 'selected' : ''
                                        : index == answerIndex ? 'correct' 
                                        : selected != answerIndex && index == selected ? 'wrong' : ''}`

        return(
            <button onClick={()=> {
                if(selected == index)
                    setSelected(null)
                else setSelected(index)
                updateAnswersArray(position, index)
            }} key={index} className={`${classOption}`} disabled={disable}>
                {text}
            </button>
        )
    })

    return(
        <>
            <h2>{questionText}</h2>
            <section>
                {options}
            </section>
            <hr/>
        </>
    )
}