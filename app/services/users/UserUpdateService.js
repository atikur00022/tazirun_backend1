import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import UsersModel from "../../models/users/UsersModel.js";
import cloudinary from "../../config/cloudinary.js";

export const UserUpdateService = async (req, res) => {
    try {
        const userId = new ObjectId(req.headers["user_id"]);

        // Get the current user data first
        const currentUser = await UsersModel.findById(userId);
        if (!currentUser) {
            return {
                status: "error",
                message: "User not found"
            };
        }

        // Initialize variables
        let updateData = {};
        let previousImagePublicId = null;

        // Handle file upload if exists
        if (req.file) {
            // Extract public_id from the current image URL if it exists
            if (currentUser.photo) {
                try {
                    // More reliable way to extract public_id from Cloudinary URL
                    const urlParts = currentUser.photo.split('/');
                    const fileName = urlParts.pop();
                    previousImagePublicId = 'Tajir/users/' + fileName.split('.')[0];
                } catch (err) {
                    console.error("Error extracting public ID:", err);
                }
            }

            // Upload new image to Cloudinary
            const response = await cloudinary.uploader.upload(req.file.path, {
                folder: 'Tajir/users',
            });
            updateData.photo = response.secure_url;

            // Delete previous image from Cloudinary if it exists
            if (previousImagePublicId) {
                try {
                    await cloudinary.uploader.destroy(previousImagePublicId);
                } catch (cloudinaryErr) {
                    console.error("Error deleting previous image from Cloudinary:", cloudinaryErr);
                    // Continue even if deletion fails
                }
            }
        }

        // Handle other fields update
        const fields = ['firstName', 'lastName', 'email', 'mobile', 'password'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Handle password encryption if provided
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Update user in database
        const result = await UsersModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        return {
            status: "success",
            message: "Profile updated successfully",
            data: result
        };

    } catch (e) {
        return {
            status: "error",
            message: e.message
        }
    }
};