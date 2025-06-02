import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import * as bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";
import * as env from "dotenv";
import {ConfigService} from "@nestjs/config";
import {AppConfigKey, AppConfigType} from "../../config/app.config";
import mongoose from "mongoose";
env.config();

type getUserType = Omit<User, '_id' | 'password'> & {
    refreshToken: string;
    accessToken: string;
};

@Schema({
    _id: true,
    versionKey: false,
    timestamps: true
})
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    age: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

}

export function createUserSchema (configService: ConfigService | null): mongoose.Schema<User> {
    const UserSchema = SchemaFactory.createForClass(User);

    UserSchema.index({ email: 1 }, {unique: true});

    UserSchema.pre("save", async function (next) {
        const user = this as UserDocument;

        if (!user.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        next();
    });

    UserSchema.methods.comparePassword = function(password: string): Promise<boolean> {
        const hashPassword = this.password;
        return bcrypt.compare(password, hashPassword)
    }

    UserSchema.methods.getUser = function (): getUserType {
        return {
            email: this.email,
            name: this.name,
            phone: this.phone,
            address: this.address,
            age: this.age,
            refreshToken: jwt.sign({
                email: this.email,
                name: this.name,
                phone: this.phone,
                id: this._id,
            }, configService?.get<AppConfigType>(AppConfigKey)?.jwtSecretKey || "token", {expiresIn: '7d'}),
            accessToken: jwt.sign({
                email: this.email,
                name: this.name,
                phone: this.phone,
                id: this._id,
            }, configService?.get<AppConfigType>(AppConfigKey)?.jwtSecretKey || "token", {expiresIn: '1m'})
        }
    }
    return UserSchema;
}

export const UserSchema = createUserSchema(null);

export type UserDocument = HydratedDocument<User> & {
    getUser: () => getUserType;
    comparePassword: (password: string) => Promise<boolean>;
};