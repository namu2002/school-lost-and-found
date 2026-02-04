// client/src/pages/ReportPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

// The function is named ReportPage
function ReportPage() {
    // These lines create state variables to hold the form data.
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState('');

    // This function runs when the form is submitted.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the browser from reloading the page

        // This is a placeholder for your real user authentication token
        const userToken = "YOUR_HARDCODED_TOKEN_HERE";

        const newItem = {
            itemName,
            description,
            location,
            type: 'lost', // Assuming 'lost' is the correct type
            date: new Date().toISOString(),
        };

        try {
            // Sends the data to your backend API. [17, 19, 21, 23, 25]
            const response = await axios.post('http://localhost:5000/api/lost-items', newItem, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            // If successful, show a success message and clear the form
            setMessage('Item reported successfully! Thank you.');
            setItemName('');
            setDescription('');
            setLocation('');
        } catch (error) {
            // If there's an error, show a failure message
            setMessage('Failed to report item. Please try again later.');
            console.error("There was an error submitting the form:", error);
        }
    };

    // This is the JSX that renders the form on the page.
    return (
        <div className="form-container">
            <h2>Report a Lost Item</h2>
            <p>Please fill out the details of the item you found.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Name:</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location Found:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Report</button>
            </form>
            {/* This line displays the success or error message after submission */}
            {message && <p>{message}</p>}
        </div>
    );
}

// This is the corrected line that exports the component properly.
export default ReportPage;