var express = require('express');
var router = express.Router();
var isThisAdmin = require('../isThisAdmin');
var session = require('express-session');
var fs=require('fs');
var path=require('path');

// Initialize an in-memory store for participants
let participants = [
    {
        "email": "example@example.com",
        "personalInfo": {
            "firstname": "John Updates",
            "lastname": "Doe",
            "dob": "1990/06/15"
        },
        "work": {
            "companyname": "New Acme Inc",
            "salary": 55000,
            "currency": "USD"
        },
        "home": {
            "country": "USA",
            "city": "Chicago"
        }
    }
];

router.use(isThisAdmin);

//index page of participants

router.get('/index',function(req,res) {

    res.render('participants', {
        title: 'Census Application',
        username: req.session.username
    })
})

// POST request for adding a participant
router.post('/', function(req, res) {
    const newParticipant = req.body;
    const validationError = validateParticipant(newParticipant);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    // Check for duplicate email
    const existingParticipant = participants.find(p => p.email === newParticipant.email);
    if (existingParticipant) {
        return res.status(409).json({ error: 'Duplicate entry', message: 'A participant with the same email already exists.' });
    }

    participants.push(newParticipant);
    res.status(201).json({ message: 'Participant added successfully' });
});

// GET request to fetch all participants
router.get('/', function(req, res) {
    res.json({
        status: "success",
        count: participants.length,
        data: participants
    });
});

// GET request for fetching personal details of all participants
router.get('/details', function(req, res) {
    const details = participants.map(participant => ({
        firstname: participant.personalInfo.firstname,
        lastname: participant.personalInfo.lastname,
        dob: participant.personalInfo.dob
    }));

    res.json(details);
});

// GET request for fetching details of a participant by email
router.get('/details/:email', function(req, res) {
    const participant = participants.find(p => p.email === req.params.email);
    if (!participant) {
        return res.status(404).json({ error: 'Participant not found' });
    }

    const details = {
        firstname: participant.personalInfo.firstname,
        lastname: participant.personalInfo.lastname,
        dob: participant.personalInfo.dob,
        work: participant.work,
        home: participant.home,
        email: participant.email,
        salary: participant.work.salary,
        currency: participant.work.currency
    };

    res.json({ status: "success", data: details });
});

// DELETE request to remove a participant by email
router.delete('/:email', function(req, res) {
    const index = participants.findIndex(p => p.email === req.params.email);
    if (index === -1) {
        return res.status(404).json({ error: 'Participant not found' });
    }

    participants.splice(index, 1);
    res.status(200).json({ message: 'Participant deleted successfully' });
});

// PUT request to update a participant by email
router.put('/:email', function(req, res) {
    const index = participants.findIndex(p => p.email === req.params.email);
    if (index === -1) {
        return res.status(404).json({ error: 'Participant not found' });
    }

    // Assuming req.body has all the necessary fields to replace the existing participant
    participants[index] = req.body;
    res.status(200).json({ message: 'Participant updated successfully' });
});

// GET request for fetching work details of a participant by email
router.get('/work/:email', function(req, res) {
    const email = req.params.email;

    // Find the participant by email
    const participant = participants.find(p => p.email === email);

    if (!participant) {
        return res.status(404).json({ error: 'Participant not found' });
    }

    // Check if work details exist and are not marked as deleted
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
});

// GET request for fetching home details of a participant by email
router.get('/home/:email', function(req, res) {
    const email = req.params.email;

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
});



module.exports = router;



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