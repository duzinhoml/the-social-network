import { User, Thought } from '../models/index.js';

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-__v');
        res.status(200).json(users);
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};


// Get single user
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v');
        
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            };
            res.status(200).json(user);
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Create a user
export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        };
        res.status(200).json(updatedUser);
    } 
    catch (err) {
       res.status(500).json({ error: err.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
        };

        await User.updateMany(
            { friends: req.params.userId },
            { $pull: { friends: req.params.userId } }
        );

        await Thought.deleteMany(
            { _id: {
                $in: deletedUser.thoughts
            }}
        );

        res.status(200).send({ message: 'User and associated thoughts deleted' });
    } 
    catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

// Friends

// Add a friend to user
export const addFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId},
            { $addToSet: {
                friends: req.params.friendId
            }},
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        };

        res.status(200).send({ message: 'Friend added' });
    } 
    catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

// Remove a friend from user
export const removeFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: {
                friends: req.params.friendId
            }},
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        };

        res.status(200).send({ message: 'Friend removed' });
    } 
    catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};