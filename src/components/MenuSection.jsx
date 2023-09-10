import React from 'react';
import './css/MenuSection.css'; // Import the CSS file

const pizzas = [
    { id: 1, name: 'Margherita', price: 299, image: 'ideogram (1).jpeg', quantity: 1 },
    { id: 2, name: 'Pepperoni', price: 199, image: 'ideogram (2).jpeg', quantity: 1 },
    { id: 3, name: 'Vegetarian', price: 289, image: 'ideogram (3).jpeg', quantity: 1 },
    { id: 3, name: 'Vegetarian', price: 289, image: 'ideogram (3).jpeg', quantity: 1 },
    { id: 3, name: 'Vegetarian', price: 289, image: 'ideogram (3).jpeg', quantity: 1 },
    { id: 3, name: 'Vegetarian', price: 289, image: 'ideogram (3).jpeg', quantity: 1 },
    { id: 3, name: 'Vegetarian', price: 289, image: 'ideogram (3).jpeg', quantity: 1 },
];

const MenuSection = () => (
    <div className="menu">
        <div className="menu-container">
            <h2>Our Pizzas</h2>
            <div className="pizzas">
                {pizzas.map((pizza) => (
                    <div key={pizza.id} className="pizza">
                        <img src={pizza.image} alt={pizza.name} />
                        <div className="">

                            <div className="pizza-info">
                                <h3>{pizza.name}</h3>
                                <p>${pizza.price.toFixed(2)}</p>
                            </div>
                            <button className="add-button">Add +</button> {/* Add button */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default MenuSection;
