import { useRef, useState } from "react"

const FaqsCard = (props) => {

    const answerElRef = useRef()
    const [state, setState] = useState(false)
    const [answerH, setAnswerH] = useState('0px')
    const { faqsList, idx } = props

    const handleOpenAnswer = () => {
        const answerElH = answerElRef.current.childNodes[0].offsetHeight
        setState(!state)
        setAnswerH(`${answerElH + 20}px`)
    }

    return (
        <div 
            className="faqs-card"
            key={idx}
            onClick={handleOpenAnswer}
        >
            <h4>
                {faqsList.q}
                {
                    state ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    )
                }
            </h4>
            <div
                ref={answerElRef} className="answer-container"
                style={state ? {height: answerH } : {height: '0px'}}
            >
                <div>
                    <p>
                        {faqsList.a}
                    </p>
                </div>
            </div>
        </div>
    )
}

// eslint-disable-next-line
export default () => {
const faqsList = [
    {
        q: "What’s unique about NITT’s computer center?",
        a: "The Octagon Computer Centre operates 24x7 and has over 1600 computers connected to the LAN—it’s been running round the clock since 1990!"
    },
    {
        q: "Is there a fun tradition at NITT?",
        a: "Yes! Festember and Pragyan are two of the biggest student-run fests in India, drawing participants from all over the country."
    },
    {
        q: "Does NITT have a cool library?",
        a: "Definitely. The library has over 1 lakh volumes and access to 2000+ e-journals. It even stays open till 9 PM for late-night learners."
    },
    {
        q: "What’s something surprising about NITT’s campus?",
        a: "It’s home to a deer park! You might just spot a few deer wandering near the hostels—nature and tech in harmony."
    },
    {
        q: "Any fun fact about NITT’s alumni?",
        a: "NITT alumni have gone on to become CEOs, startup founders, and even space scientists—talk about launching careers into orbit!"
    }
];
  
    return (
        <section className="faqs-secondary">
            <div className="faqs-header">
                <h1>
                    Random Facts About NITT
                </h1>
                <p>
                    ...This are some random facts about NITT...
                </p>
            </div>
            <div className="faqs-container">
                {
                    faqsList.map((item, idx) => (
                        <FaqsCard
                            key={idx}
                            faqsList={item}
                        />
                    ))
                }
            </div>
        </section>
    )
}