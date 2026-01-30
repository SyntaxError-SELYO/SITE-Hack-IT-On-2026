const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    program: {
        type: String
    },
    yearLevel: {
        type: Number,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model('User', userSchema)
