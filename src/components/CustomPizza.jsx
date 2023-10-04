import React, { useEffect, useState } from 'react';
import './css/MenuSection.css'
import Modal from 'react-modal'

const CustomPizza = ({ addToCart }) => {
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedBase, setSelectedBase] = useState(null);
    const [selectedSauce, setSelectedSauce] = useState(null);
    const [selectedCheese, setSelectedCheese] = useState(null);
    const [selectedVeggies, setSelectedVeggies] = useState([]);

    const [baseOptions, setBaseOptions] = useState([])
    const [sauceOptions, setSauceOptions] = useState([])
    const [cheeseOptions, setCheeseOptions] = useState([])
    const [veggieOptions, setVeggieOptions] = useState([])

    useEffect(() => {
        const fetchOptions = async () => {
            const i = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-inventory`, {
                method: 'POST'
            })
            const options = await i.json()
            setBaseOptions(options.filter(option => option.category === 'base'));
            setSauceOptions(options.filter(option => option.category === 'sauce'));
            setCheeseOptions(options.filter(option => option.category === 'cheese'));
            setVeggieOptions(options.filter(option => option.category === 'veggies'));
        }
        fetchOptions()
    }, [])

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Reset selections and step when closing the modal
        setSelectedBase(null);
        setSelectedSauce(null);
        setSelectedCheese(null);
        setSelectedVeggies([]);
        setStep(1);
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handleBackStep = () => {
        setStep(step - 1);
    };

    const handleAddToCart = () => {
        // Create a custom pizza object with selected options
        const pizza = {
            base: selectedBase,
            sauce: selectedSauce,
            cheese: selectedCheese,
            veggies: selectedVeggies,
        };

        // Call the addToCart function with the custom pizza object
        addToCart(pizza);
        handleCloseModal()

    };

    return (
        <>

            <div key={'custom'} className='pizza' onClick={() => handleOpenModal(true)}>
                <img src={"custom.jpg"} alt={"Custom Pizza"} style={{ backgroundColor: 'white', cursor: 'pointer' }} />
                <div className="">
                    <div className="pizza-info">
                        <h4>Click to Create Custom Pizza</h4>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Custom Pizza Modal"
                ariaHideApp={false}
                style={{
                    content: {
                        height: 'fit-content',
                        width: 'fit-content',
                        minWidth: '50%',
                        margin: 'auto',
                    },
                }}
            >

                {step === 1 && (
                    <>
                        <h4>Choose Pizza Base:</h4>
                        <div className="radio-options">
                            {baseOptions.map((option, index) => (
                                <div key={index}>
                                    <input required
                                        type="radio"
                                        name="base"
                                        id={`base-option-${index}`}
                                        value={option.ingredient}
                                        checked={selectedBase === option.ingredient}
                                        onChange={() => setSelectedBase(option.ingredient)}
                                    />
                                    <label htmlFor={`base-option-${index}`}>{option.ingredient}</label>
                                </div>
                            ))}
                        </div>
                        <button className="next-button" onClick={handleNextStep}>
                            Next
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h4>Choose Sauce:</h4>
                        <div className="radio-options">
                            {sauceOptions.map((option, index) => (
                                <div key={index}>
                                    <input required
                                        type="radio"
                                        name="sauce"
                                        id={`sauce-option-${index}`}
                                        value={option.ingredient}
                                        checked={selectedSauce === option.ingredient}
                                        onChange={() => setSelectedSauce(option.ingredient)}
                                    />
                                    <label htmlFor={`sauce-option-${index}`}>{option.ingredient}</label>
                                </div>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBackStep}>
                                Back
                            </button>
                            <button className="next-button" onClick={handleNextStep}>
                                Next
                            </button>
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h4>Choose Cheese:</h4>
                        <div className="radio-options">
                            {cheeseOptions.map((option, index) => (
                                <div key={index}>
                                    <input required
                                        type="radio"
                                        name="cheese"
                                        id={`cheese-option-${index}`}
                                        value={option.ingredient}
                                        checked={selectedCheese === option.ingredient}
                                        onChange={() => setSelectedCheese(option.ingredient)}
                                    />
                                    <label htmlFor={`cheese-option-${index}`}>{option.ingredient}</label>
                                </div>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBackStep}>
                                Back
                            </button>
                            <button className="next-button" onClick={handleNextStep}>
                                Next
                            </button>
                        </div>
                    </>
                )}
                {step === 4 && (
                    <>
                        <h4>Select Veggies:</h4>
                        <div className="radio-options">
                            {veggieOptions.map((option, index) => (
                                <div key={index}>
                                    <input required
                                        type="checkbox"
                                        id={`veggie-option-${index}`}
                                        value={option.ingredient}
                                        checked={selectedVeggies.includes(option.ingredient)}
                                        onChange={() =>
                                            setSelectedVeggies((prevState) =>
                                                [...prevState, option.ingredient]
                                            )
                                        }
                                    />
                                    <label htmlFor={`veggie-option-${index}`}>{option.ingredient}</label>
                                </div>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBackStep}>
                                Back
                            </button>
                            <button className="add-button" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                    </>

                )}
            </Modal>
        </>
    );
};

export default CustomPizza;
