
const { useState, useEffect, useRef } = React

const cards = [{
    id: 1,
    text: "Bojack Horseman",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYWQwMDNkM2MtODU4OS00OTY3LTgwOTItNjE2Yzc0MzRkMDllXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg"
},
{
    id: 2,
    text: "The Crown",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/6c/The_Crown_season_1.jpeg"
},
{
    id: 3,
    text: "Breaking Bad",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BN2VjOTkwMjgtYWEyMy00MzNmLTllMjktNDI1ZmRhYTAwYTg1XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg"
},
{
    id: 4,
    text: "Better Call Saul",
    imageUrl: "https://static.displate.com/280x392/displate/2022-11-09/97ac69cbbf1a512142da736fefefc709_97687434d98c212f29f1b90872af504c.jpg"
},
{
    id: 5,
    text: "Call Me By Your Name",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_.jpg"
},
{
    id: 6,
    text: "Queen's Gambit",
    imageUrl: "https://peliomanta.com/wp-content/uploads/2020/10/Peli-o-Manta-Gambito-de-dama-Poster.jpg"
},
{
    id: 7,
    text: "Mad Men",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNTgxNDZlODQtNDcwOC00NWQ5LTljNWMtMDhjY2U5YTUzMTc4XkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_.jpg"
},
{
    id: 8,
    text: "Capitán América 2",
    imageUrl: "https://blogdesuperheroes.es/wp-content/plugins/BdSGallery/BdSGaleria/24359.jpg"
},
{
    id: 9,
    text: "Rocketman",
    imageUrl: "https://m.media-amazon.com/images/I/91b0eQjOoVL._AC_SL1500_.jpg"
},
{
    id: 10,
    text: "Parasite",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg"
}


]

const App = () => {

    const [refresh, setRefresh] = useState(false);
    const [cardsList, setCardsList] = useState(null);
    const [numberOfPairs, setNumberOfPairs] = useState(1);
    const [attemptCount, setAttemptCount] = useState(0);
    const [numberOfHits, setNumberOfHits] = useState(0);
    const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);



    useEffect(() => {
        const cardsRandomlySorted = orderArrayRandomly(cards)
        setCardsList(cardsRandomlySorted.slice(0, numberOfPairs))
        console.log("hola")
    }, [refresh, numberOfPairs]);

    useEffect(() => {
        if (numberOfHits === numberOfPairs) showWinnerModal()
    }, [numberOfHits]);

    const handleCorrectAttemptsNumberChange = number => {
        setNumberOfHits(number)
    }

    const handleNewAttempt = () => {
        setAttemptCount(val => val + 1)
    }

    const restartGame = () => {
        setRefresh(value => !value)
        setAttemptCount(0)
        setNumberOfHits(0)
    }

    useEffect(() => {
        console.log(isWinnerModalVisible?.valueOf())
    }, [isWinnerModalVisible]);

    const showWinnerModal = () => {
        setTimeout(() => setIsWinnerModalVisible(true), 700)
    }

    const onCloseWinnerModal = () => {
        setIsWinnerModalVisible(false)
    }

    return (
        <div className="app-container">
            <div className="game-header">
                <div className="attempt-counter">
                    <h4>Intentos: </h4>
                    <span>{attemptCount}</span>
                </div>

                <div className="card-finded-counter">
                    <h4>Aciertos:</h4>
                    <span>{`${numberOfHits} de ${numberOfPairs}`}</span>
                </div>
            </div>
            {cardsList && <CardsGrid cardsData={cardsList}
                setCorrectAttemptsNumber={handleCorrectAttemptsNumberChange}
                addNewAttempt={handleNewAttempt}

            />}

            {isWinnerModalVisible && <WinnerModal restartEvent={restartGame} onClose={onCloseWinnerModal} />}
        </div>
    )
}

const CardsGrid = ({ cardsData, setCorrectAttemptsNumber, addNewAttempt }) => {

    const [cardsList, setCardsList] = useState(null);
    const [lockCardsFlip, setlockCardsFlip] = useState(false);
    const [cardsFinded, setCardsFinded] = useState([]);
    const [cardsFlippedIndex, setCardsFlippedIndex] = useState([]);

    useEffect(() => {
        const pairs = [...cardsData, ...cardsData]

        if (cardsFinded?.length !== 0 || cardsFlippedIndex?.length !== 0)

            setTimeout(() => setCardsList(orderArrayRandomly(pairs)), 1100) //Esperar a que las cartas se volteen
        else
            setCardsList(orderArrayRandomly(pairs))

        //Resetear cartas volteadas y encontradas
        setCardsFinded([])
        setCardsFlippedIndex([])


    }, [cardsData]);

    useEffect(() => {
        //Enviar numero de intentos correctos
        setCorrectAttemptsNumber(cardsFinded.length)
    }, [cardsFinded]);

    const handleSelectedCardId = cardIndex => {

        setCardsFlippedIndex(lastValue => [...lastValue, cardIndex]) //voltea la carta
        addNewAttempt() //aumentar contador

        //id de la carta
        const { id } = cardsList[cardIndex]


        //Primera carta volteada
        if (cardsFlippedIndex.length === 0) return


        //segunda carta girada
        const { id: previousCardId } = cardsList[cardsFlippedIndex[0]]


        setlockCardsFlip(true)

        const clearAttempt = () => {
            setCardsFlippedIndex([])
            setlockCardsFlip(false)
        }

        //intento exitoso
        if (id === previousCardId) {
            setCardsFinded(lastValue => [...lastValue, previousCardId])
            clearAttempt()
        } else {
            setTimeout(clearAttempt, 1500)
        }

    }

    return (
        <div className="cards-grid">
            {cardsList?.map((data, index) => <Card {...data}
                key={index}
                cardIndex={index}
                selectCard={handleSelectedCardId}
                lockFlip={lockCardsFlip}
                flip={cardsFlippedIndex.includes(index) || cardsFinded.includes(data.id)}
            />)}
        </div>
    )
}

const Card = ({ cardIndex, text, imageUrl, flip, selectCard, lockFlip }) => {


    const handleCardClick = (e) => {
        if (lockFlip || flip) return
        console.log("girando")
        selectCard(cardIndex)
    }

    return (
        <div className={`card ${flip ? "rotate" : ""}`} onClick={handleCardClick}>
            <div className="card-container">
                <div className="card-front">
                    <h3 className="front-title">{text}</h3>
                    <img src={imageUrl} alt={text} />
                </div>
                <div className="card-back">
                    <img src="./img/card-icon.svg" alt="Logo" className="card-icon" />
                    <h3 className="back-title">Memoria</h3>
                </div>
            </div>
        </div>
    )

}

const WinnerModal = ({ restartEvent, onClose }) => {

    const modalRef = useRef()

    useEffect(() => {
        modalRef.current.showModal()
    }, []);

    const closeModal = () => modalRef.current.close()

    const handleRestart = () => {
        closeModal()
        restartEvent()
    }

    return (
        <dialog className="winner-modal" ref={modalRef} onClose={onClose}>
            <div className="modal-container">
                <h2 className="modal-title">¡Lo lograste!</h2>
                <img src="./img/winner-icon.svg" alt="Trofeo" />
                <div className="game-results">
                    <h4>Cartas volteadas: </h4>
                    <span>50</span>
                </div>
                <div className="action-butons">
                    <button className="restart" onClick={handleRestart}>Volver a jugar</button>
                    <button className="close" onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </dialog>

    )
}


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)