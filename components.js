
const { useState, useEffect, useRef } = React


const App = ({ cards }) => {

    const [refresh, setRefresh] = useState(false);
    const [cardsList, setCardsList] = useState(null);
    const [numberOfPairs, setNumberOfPairs] = useState(2);
    const [attemptCount, setAttemptCount] = useState(0);
    const [numberOfHits, setNumberOfHits] = useState(0);
    const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);



    useEffect(() => {
        const cardsRandomlySorted = orderArrayRandomly(cards)
        setCardsList(cardsRandomlySorted.slice(0, numberOfPairs))
        setAttemptCount(0)
        setNumberOfHits(0)
    }, [refresh, numberOfPairs]);

    useEffect(() => {
        if (numberOfHits === numberOfPairs) showWinnerModal()
    }, [numberOfHits]);

    const handleNumberOfPairsChange = e => {
        if (isNaN(e.target.value)) return

        const value = parseInt(e.target.value)

        if (value >= 2 && value <= cards.length) setNumberOfPairs(parseInt(value))
        else if (value < 2) setNumberOfPairs(2)
        else setNumberOfPairs(cards.length)
    }

    const handleCorrectAttemptsNumberChange = number => {
        setNumberOfHits(number)
    }

    const handleNewAttempt = () => {
        setAttemptCount(val => val + 1)
    }

    const restartGame = () => {
        setRefresh(value => !value)
        
    }

    useEffect(() => {
        console.log(isWinnerModalVisible?.valueOf())
    }, [isWinnerModalVisible]);

    const showWinnerModal = () => {
        console.log("WINNING")
        setTimeout(() => setIsWinnerModalVisible(true), 700)
    }

    const onCloseWinnerModal = () => {
        setIsWinnerModalVisible(false)
    }

    return (
        <div className="app-container">
            <div className="game-header">
                <div className="attempt-counter">
                    <h4>Movimientos: </h4>
                    <span className="count-value">{attemptCount}</span>
                </div>

                <div className="restart-container">
                    <input type="number"
                        className="input-number-pairs "
                        placeholder="# parejas"
                        title="Número de parejas"
                        onChange={handleNumberOfPairsChange}
                        value={numberOfPairs}
                        min={2} />

                    <button className="restart-game" title="Reiniciar juego" onClick={restartGame}>
                        Reiniciar
                        <span ></span>
                    </button>
                </div>

                <div className="card-finded-counter">
                    <h4>Aciertos:</h4>
                    <span className="count-value">{`${numberOfHits} de ${numberOfPairs}`}</span>
                </div>
            </div>
            {cardsList && <CardsGrid cardsData={cardsList}
                setCorrectAttemptsNumber={handleCorrectAttemptsNumberChange}
                addNewAttempt={handleNewAttempt}

            />}

            {isWinnerModalVisible && <WinnerModal restartEvent={restartGame} 
            onClose={onCloseWinnerModal} 
            attemptCount={attemptCount}
            />}
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

const WinnerModal = ({ restartEvent, onClose, attemptCount }) => {

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
                    <span>{attemptCount}</span>
                </div>
                <div className="action-butons">
                    <button className="restart" onClick={handleRestart}>Volver a jugar</button>
                    <button className="close" onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </dialog>

    )
}



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
    imageUrl: "https://i0.wp.com/www.lacasadeel.net/wp-content/uploads/2014/03/captain-america-2-nuevo-poster.jpg"
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
},

{
    id:11,
    text:"Tick Tick Boom",
    imageUrl:"https://m.media-amazon.com/images/M/MV5BZmMyMmE0M2UtN2E2MC00YzVmLTkwODgtOTVhYjVlOTBhY2RjXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg"
},
{
    id:12,
    text:"Verano del 85",
    imageUrl:"https://www.lahiguera.net/cinemania/pelicula/9552/verano_del_85-cartel-9572.jpg"
},
{
    id:13,
    text:"It",
    imageUrl:"https://static.posters.cz/image/750/posters/it-georgie-i57743.jpg",
},
{
    id:14,
    text:"Stranger Things",
    imageUrl:"https://i.redd.it/8fa9st2ajlv71.jpg"
},
{
    id:15,
    text:"The Boys",
    imageUrl:"https://cloudfront-us-east-1.images.arcpublishing.com/infobae/CKKRZQEJAFEJLIP4SCYEUDD5OM.jpg"
},
{
    id:16,
    text:"Bohemian Rhapsody",
    imageUrl:"https://pics.filmaffinity.com/Bohemian_Rhapsody-748186150-large.jpg",
},
{
    id:17,
    text:"WALL-E",
    imageUrl:"https://lumiere-a.akamaihd.net/v1/images/p_walle_19753_69f7ff00.jpeg"
},
{
    id: 18,
    text:"Django",
    imageUrl:"https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2012%2F04%2Fdjango-poster_510.jpg&q=60"
},
{
    id:19,
    text:"Inglorius Bastards",
    imageUrl:"https://i.etsystatic.com/8315225/r/il/cd182f/504349442/il_570xN.504349442_hk11.jpg"
},
{
    id:20,
    text:"Little Women",
    imageUrl:"https://www.ecartelera.com/carteles/14600/14677/008.jpg"
}


]

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App cards={cards}/>)