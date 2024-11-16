import { Request } from 'express';
import mongoose, { Document, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUserRequest extends Request {
    user?: any;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    isAdmin: boolean;
    token?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

// Pre-save hook for password hashing
UserSchema.pre<IUser>("save", async function(next) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        // Explicitly typing the error to CallbackError
        next(error as CallbackError);  // TypeScript now knows the error is of type CallbackError
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
    const user = this as IUser;
    return await bcrypt.compare(enteredPassword, user.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
