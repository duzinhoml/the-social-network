import { Thought, User } from '../models/index.js';

// Get all thoughts

export const getThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find({})
            .select('-__v');
        res.status(200).json(thoughts);
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Get a single thought
export const getSingleThought = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');

        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
        };
        res.status(200).json(thought);
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Create a thought
export const createThought = async (req, res) => {
    try {
        const newThought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: {
                thoughts: newThought._id
            }},
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'Thought created but user not found' });
        }
        res.status(201).send({ message: 'Thought created' });
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Update a thought
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
           { _id: req.params.thoughtId},
           { $set: req.body },
           { new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
        }
        res.status(200).json(thought);
    } 
    catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

// Delete a thought
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
        }

        await User.updateMany(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } }
        );

        res.status(200).send({ message: 'Thought deleted' });
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Reactions

// Add a reaction to a thought
export const addReaction = async (req, res) => {
    try {
       const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: {
            reactions: {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            }
        }},
        { new: true }
       );

       if (!reaction) {
           res.status(404).json({ message: 'Thought not found' });
       }
       res.status(201).send({ message: 'Reaction added' });
    } 
    catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

// Remove a reaction from a thought
export const removeReaction = async (req, res) => {
    try {
        console.log(`Received reactionId: ${req.params.reactionId} for thoughtId: ${req.params.thoughtId}`);

        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: {
                reactions: {
                    reactionId: req.params.reactionId
                }
            }},
            { new: true }
        );

        if (!reaction) {
            res.status(404).json({ message: 'Reaction not found' });
        }
        res.status(200).send({ message: 'Reaction removed' });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};