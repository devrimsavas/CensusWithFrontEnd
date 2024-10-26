//participants endpoint all routes are protected by express session


var express = require('express');
var router = express.Router();
var fs = require('fs').promises;
var path = require('path');

var isThisAdmin = require('../isThisAdmin');
var session = require('express-session');

// we can use router.use to protect all routes  by express session 

router.use(isThisAdmin);



// POST request for adding the provided participant’s data to the Global Object Variable. Keep in mind the Participant record use case mentioned earlier.

router.post('/', async function(req, res) {
    const newParticipant = req.body;
    const validationError = validateParticipant(newParticipant);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const filepath = path.join(__dirname, '../data', 'participants.json');
    try {
        let data;
        try {
            data = await fs.readFile(filepath, { encoding: 'utf-8' });
        } catch (readErr) {
            console.error('Error reading the file:', readErr);
            // Initialize an empty array if there's an error reading the file
            data = '[]';
        }

        const participants = JSON.parse(data);

        // Check for duplicate email
        const existingParticipant = participants.find(p => p.email === newParticipant.email);
        if (existingParticipant) {
            return res.status(409).json({ error: 'Duplicate entry', message: 'A participant with the same email already exists.' });
        }

        participants.push(newParticipant);

        try {
            await fs.writeFile(filepath, JSON.stringify(participants, null, 2));
            res.status(201).json({ message: 'Participant added successfully' });
        } catch (writeErr) {
            console.error('Error writing to the file:', writeErr);
            res.status(500).json({ error: 'Failed to update participant data' });
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Failed to process participant data' });
    }
});



// GET request to fetch all participants wrapped in an object
router.get('/', async function(req, res) {
    const filepath = path.join(__dirname, '../data', 'participants.json');
    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        const participants = JSON.parse(data);  // Parse the JSON data

        // Return participants wrapped in an object
        res.json({
            status: "success",
            count: participants.length,
            data: participants
        });
    } catch (err) {
        console.error('Failed to read participants:', err);
        res.status(500).json({ error: 'Failed to retrieve participants' });
    }
});



// GET request for fetching personal details of all participants
router.get('/details', async function(req, res) {
    const filepath = path.join(__dirname, '../data', 'participants.json');
    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        const participants = JSON.parse(data);

        // Assuming all participants are active, filter might be added if an 'isActive' flag exists
        const activeParticipants = participants; // Modify this line to filter based on activity if needed

        // Extracting only the first name and last name for each participant
        const details = activeParticipants.map(participant => ({
            firstname: participant.personalInfo.firstname,
            lastname: participant.personalInfo.lastname,
            dob: participant.personalInfo.dob
        }));

        res.json(details);
    } catch (err) {
        console.error('Failed to read participants:', err);
        res.status(500).json({ error: 'Failed to retrieve participant details' });
    }
});



// GET request for fetching details of a participant by email
router.get('/details/:email', async function(req, res) {
    const email = req.params.email;

    console.log("details request for email: " + email);
    const filepath = path.join(__dirname, '../data', 'participants.json');

    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        const participants = JSON.parse(data);

        // Find the participant by email
        const participant = participants.find(p => p.email === email);

        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Assuming 'active' is part of the participant's object
        const details = {
            firstname: participant.personalInfo.firstname,
            lastname: participant.personalInfo.lastname,
            //if needs payload  json message with other datas below
            //active: participant.active,// 
            //email: participant.email,
            //work: participant.work,
            //home: participant.home,

        };

        res.json( {
            status: "success", 
            data: details} ) // Return the details wrapped in an object with status 'success' and data details);
    } catch (err) {
        console.error('Error accessing the file:', err);
        res.status(500).json({ error: 'Failed to retrieve participant details' });
    }
});


// GET request for fetching work details of a participant by email
router.get('/work/:email', async function(req, res) {
    const email = req.params.email;
    const filepath = path.join(__dirname, '../data', 'participants.json');

    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        const participants = JSON.parse(data);

        // Find the participant by email
        const participant = participants.find(p => p.email === email);

        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Assuming there is a flag in the work details to indicate if it's deleted or not
        if (participant.work && !participant.work.deleted) {
            const workDetails = {
                companyname: participant.work.companyname,
                salary: participant.work.salary,
                currency: participant.work.currency
            };
            res.json(workDetails);
        } else {
            res.status(404).json({ message: 'No active work details available for this participant' });
        }
    } catch (err) {
        console.error('Error accessing the file:', err);
        res.status(500).json({ error: 'Failed to retrieve work details' });
    }
});



// GET request for fetching home details of a participant by email
router.get('/home/:email', async function(req, res) {
    const email = req.params.email;
    const filepath = path.join(__dirname, '../data', 'participants.json');

    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        const participants = JSON.parse(data);

        // Find the participant by email
        const participant = participants.find(p => p.email === email);

        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Check if home details exist and are not marked as deleted
        if (participant.home && !participant.home.deleted) {
            const homeDetails = {
                country: participant.home.country,
                city: participant.home.city
            };
            res.json(homeDetails);
        } else {
            res.status(404).json({ message: 'No active home details available for this participant' });
        }
    } catch (err) {
        console.error('Error accessing the file:', err);
        res.status(500).json({ error: 'Failed to retrieve home details' });
    }
});


// DELETE request to remove a participant by email
router.delete('/:email', async function(req, res) {
    const email = req.params.email;
    const filepath = path.join(__dirname, '../data', 'participants.json');

    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        let participants = JSON.parse(data);

        // Find the index of the participant with the given email
        const index = participants.findIndex(p => p.email === email);

        if (index === -1) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Remove the participant from the array
        participants.splice(index, 1);

        // Write the updated array back to the file
        await fs.writeFile(filepath, JSON.stringify(participants, null, 2));
        res.status(200).json({ message: 'Participant deleted successfully' });
    } catch (err) {
        console.error('Error accessing the file:', err);
        res.status(500).json({ error: 'Failed to delete participant' });
    }
});

// PUT request to update a participant by email
router.put('/:email', async function(req, res) {
    const email = req.params.email;
    const updatedParticipant = req.body;
    const filepath = path.join(__dirname, '../data', 'participants.json');

    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        let participants = JSON.parse(data);

        // Find the index of the participant with the given email
        const index = participants.findIndex(p => p.email === email);

        if (index === -1) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Update the participant with the new data
        participants[index] = updatedParticipant;

        // Write the updated array back to the file
        await fs.writeFile(filepath, JSON.stringify(participants, null, 2));
        res.status(200).json({ message: 'Participant updated successfully' });
    } catch (err) {
        console.error('Error accessing the file:', err);
        res.status(500).json({ error: 'Failed to update participant' });
    }
});
 


module.exports=router;


//seperate function to validate participants data so we can keep routes clean 

function validateParticipant(data) {
    const { email, personalInfo, work, home } = data;
    
    // Validate top-level and nested properties
    if (!email || !personalInfo || !work || !home) {
      return 'All main sections (email, personalInfo, work, home) must be provided';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Invalid email format';
    }
    if (!personalInfo.firstname || !personalInfo.lastname || !personalInfo.dob) {
      return 'Missing fields in personalInfo';
    }
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(personalInfo.dob)) {
      return 'DOB must be in YYYY/MM/DD format';
    }
    if (!work.companyname || work.salary === undefined || !work.currency) {
      return 'Missing fields in work';
    }
    if (typeof work.salary !== 'number') {
      return 'Salary must be a number';
    }
    if (!home.country || !home.city) {
      return 'Missing fields in home';
    }  
    
    return null; // No errors found
  }
  