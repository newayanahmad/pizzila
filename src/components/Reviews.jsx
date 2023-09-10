import React from 'react';
import './css/Reviews.css';

const reviews = [
    {
        name: 'John Doe',
        rating: 5,
        comment: 'Great pizza and fast delivery! 🍕🚀',
    },
    {
        name: 'Jane Smith',
        rating: 4,
        comment: 'The pizza was delicious, but the delivery took longer than expected. 😋⏱️',
    },
    {
        name: 'Bob Johnson',
        rating: 3,
        comment: 'The pizza was okay, but nothing special. 🍕😐',
    },
    {
        name: 'Alice Williams',
        rating: 5,
        comment: 'The best pizza in town! The crust is just perfect. 🍕👌',
    },
    {
        name: 'Grace Hopper',
        rating: 5,
        comment: 'Excellent pizza! The sauce is to die for. 🍕😋',
    },
    {
        name: 'Isaac Newton',
        rating: 5,
        comment: 'Gravity-defyingly good pizza! 🍕🪐',
    }
];


const Star = ({ filled }) => (
    <span className={`star ${filled ? 'filled' : ''}`}>★</span>
);

const Reviews = () => (
    <div className="reviews">
        <div className="reviews-container">
            <h2>Customer Reviews</h2>
            {reviews.map((review) => (
                <div key={review.name} className="review">
                    <h3>{review.name}</h3>
                    <div className="rating">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} filled={i < review.rating} />
                        ))}
                    </div>
                    <p>{review.comment}</p>
                </div>
            ))}
        </div>
    </div>
);

export default Reviews;
