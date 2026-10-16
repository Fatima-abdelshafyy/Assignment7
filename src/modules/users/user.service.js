import { UserModel } from "../../DB/models/user.model.js";

export const signUp = async (req, res) => {
    try {

        const { name, email, password, phone, age } = req.body;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const newUser = await UserModel.create({
            name,
            email,
            password,
            phone,
            age
        });

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {

        const { id } = req.params;

        const { name, email, phone, age } = req.body;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (email && email !== user.email) {

            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phone,
                age
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {

        const { id } = req.query;

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getUser = async (req, res) => {
    try {

        const { id } = req.query;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};