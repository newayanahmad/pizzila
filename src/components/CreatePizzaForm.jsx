import React, { useEffect, useState } from 'react';
import './css/CreatePizzaForm.css'; // Import the CSS file

const CreatePizzaForm = () => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")


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
            console.log(veggieOptions)
            console.log(baseOptions);
            console.log(veggieOptions.map(option => option.ingredient))

        }
        fetchOptions()
    }, [])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleIngredientChange = (e, category) => {
        const { value, checked } = e.target;
        const updatedIngredients = { ...formData.ingredients };
        if (checked) {
            updatedIngredients[category].push(value);
        } else {
            updatedIngredients[category] = updatedIngredients[category].filter(
                (ingredient) => ingredient !== value
            );
        }
        setFormData({
            ...formData,
            ingredients: updatedIngredients,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Print the form data (you can send it to an API or process it as needed)
        console.log(formData);
    };

    return (<>
        <div className="create-pizza-container">
            <form onSubmit={handleSubmit} className=" register-form" style={{ marginTop: '0', minWidth: '60%' }}>
                <h3 className="create-pizza-title">Create New Pizza</h3>
                <input type="text" name='name' id='name' placeholder='Pizza name' value={name} onChange={(e) => setName(e.target.value)} />
                <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} cols="30" rows="3" placeholder='Description...' />
                <input type="number" name='price' id='price' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="text" name='image' id='image' placeholder='Image URL' value={image} onChange={(e) => setImage(e.target.value)} />
                <input type="text" name='category' id='category' placeholder='Category' value={category} onChange={e => setCategory(e.target.value)} />
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "start" }}>
                        <h4>Choose Pizza Base:</h4>
                        <div className="radio-options" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>

                            {baseOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "start" }}>
                        <h4>Choose Sauce:</h4>
                        <div className="radio-options" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            {sauceOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "start" }}>
                        <h4>Choose Cheese:</h4>
                        <div className="radio-options" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            {cheeseOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "start" }}>
                        <h4>Select Veggies:</h4>
                        <div className="radio-options" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                            {veggieOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        id={`veggie-option-${index}`}
                                        value={option.ingredient}
                                        checked={selectedVeggies.includes(option.ingredient)}
                                        onChange={() =>
                                            setSelectedVeggies((prevState) =>
                                                prevState.includes(option.ingredient)
                                                    ? prevState.filter((item) => item !== option.ingredient)
                                                    : [...prevState, option.ingredient]
                                            )
                                        }
                                    />
                                    <label htmlFor={`veggie-option-${index}`}>{option.ingredient}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <input type="submit" value={"Add Pizza"} />
            </form>
        </div>
    </>
    );
};

export default CreatePizzaForm;
