
jsx
// client/src/ReportItemForm.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Import axios to make API calls

function ReportItemForm() {
    // These 'state' variables will hold the data the user types into the form fields
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState(''); // To show success or error messages

    // This function runs when the user clicks the "Submit" button
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the browser from reloading the page

        // This is the hard-coded token from Thunder Client.
        // In a real app, you would get this from logging in. For now, we'll just paste it.
        const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDQxNTNkNTU5NGFkNDlkOTZkMGQyZiIsImlhdCI6MTc2NjA3MTEwMCwiZXhwIjoxNzY2MDc0NzAwfQ.uph2QRwa84lDyTsXdli3LNI_sJT2HZ6e1ivk4RzuTpA";

        // This is the data object we will send to the back-end.
        // The keys (itemName, description) MUST match your Mongoose schema!
        const newItem = {
            itemName: itemName,
            description: description,
            location: location,
            type: 'lost', // We'll hard-code this for now
            date: new Date().toISOString(), // Use today's date
        };

        try {
            // This is the API call!
            const response = await axios.post(
                'http://localhost:5000/api/lost-items', // Your back-end URL
                newItem, // The data to send
                {
                    headers: {
                        // This is how you send the token for authorization!
                        'Authorization': `Bearer ${userToken}`
                    }
                }
            );

            // If the API call is successful...
            console.log('Success:', response.data);
            setMessage('Item reported successfully!');
            
            // Clear the form fields
            setItemName('');
            setDescription('');
            setLocation('');

        } catch (error) {
            // If the API call fails...
            console.error('Error reporting item:', error.response ? error.response.data : error.message);
            setMessage('Failed to report item. Check the console for details.');
        }
    };

    // This is the HTML that the user sees
    return (
        <div>
            <h2>Report a Lost Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Name: </label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description: </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location Found: </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Report</button>
            </form>
            {/* Display the success or error message here */}
            {message && <p>{message}</p>}
        </div>
    );
}

export default ReportItemForm;