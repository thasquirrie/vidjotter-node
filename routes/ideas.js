const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/ideas', ensureAuthenticated, (req, res) => {
    Idea.find().sort().then(ideas => {
        res.render('ideas', {
            ideas
        })
    })
})

router.get('/ideas/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please enter a title' });
    }

    if (!req.body.details) {
        errors.push({ text: 'Please enter idea details for the title' });
    }

    if (errors.length > 0) {
        console.log(errors)
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }

        new Idea(newUser).save().then(() => {
            console.log("Idea saved")
            req.flash('success.msg', 'Videa idea added')
            res.redirect('/ideas')
        })
    }
})

router.get('/ideas/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        res.render('ideas/edit', {
            idea,
            title: req.body.title,
            details: req.body.details
        })
    })
})

router.put('/ideas/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title
        idea.details = req.body.details


        idea.save().then(() => {
            req.flash('success_msg', 'Video idea edited')
            res.redirect('/ideas')
        })
    })
})

router.delete('/ideas/:id', ensureAuthenticated, (req, res) => {
    Idea.findOneAndDelete({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video idea deleted')
        res.redirect('/ideas')
    })
})


module.exports = router;