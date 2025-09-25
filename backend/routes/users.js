const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Getting the user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({ success: true, user});
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Updating the user profile
router.put('/profile', auth, async (req, res) => {

    try {
        const { name, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;

        await user.save();

        const updatedUser = await User.findById(req.user._id).select('-password');
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// To change the password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // 1) validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // 2) load user
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 3) verify current password
        const ok = await user.comparePassword(currentPassword);
        if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

        // 4) ensure new password is different
        const same = await bcrypt.compare(newPassword, user.password);
        if (same) {
            return res.status(400).json({ message: 'New password must be different from the current password' });
        }

        // 5) set + save (pre-save hook hashes it)
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user addresses
router.get('/addresses', auth, async (req, res) => {

    try {
        const user = await User.findById(req.user._id).select('addresses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ success: true, addresses: user.addresses || [] });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Adding the new address
router.post('/addresses', auth, async (req, res) => {

    try {
        const {
            title,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            country,
            isDefault
        } = req.body;

        // Validating required fields
        if (!title || !fullName || !phone || !addressLine1 || !city || !state || !zipCode || !country) {
            return res.status(400).json({
                message: 'All required fields must be provided'
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = {
            id: Date.now().toString(), // Generating simple ID
            title: title.trim(),
            fullName: fullName.trim(),
            phone: phone.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2?.trim() || '',
            city: city.trim(),
            state: state.trim(),
            zipCode: zipCode.trim(),
            country: country.trim(),
            isDefault: isDefault || false
        };

        // If newly added address is set as default, remove the default from the other address
        if (newAddress.isDefault) {
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }
        user.addresses.push(newAddress);
        await user.save();

        res.json({
            success: true,
            message: 'Address added successfully',
            address: newAddress
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Updating the address
router.put('/addresses/:addressId', auth, async (req, res) => {

    try {
        const { addressId } = req.params;
        const updateData = req.body;

        const user = await User.findById(req.user._id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If setting this address as default, remove default from others
        if (updateData.isDefault) {
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }

        // Updating the address
        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex],
            ...updateData,
            id: addressId // Preserve the ID
        };

        await user.save();

        res.json({
            success: true,
            message: 'Address updated successfully',
            address: user.addresses[addressIndex]
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// To delete the address
router.delete('/addresses/:addressId', auth, async (req, res) => {

    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        user.addresses.splice(addressIndex, 1);
        await user.save();
        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// For setting the default address
router.put('/addresses/:addressId/default', auth, async (req, res) => {

    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressExists = user.addresses.some(addr => addr.id === addressId);
        if (!addressExists) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Remove default from addresses before setting the new one as default
        user.addresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));

        await user.save();

        res.json({
            success: true,
            message: 'Default address updated successfully',
        });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;