import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import * as bcrypt from 'bcryptjs';

type getUserType = Omit<User, '_id' | 'password'>;

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

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User> & {
    getUser: () => getUserType;
    comparePassword: (password: string) => Promise<boolean>;
};

UserSchema.index({ email: 1 }, {unique: true});

// Hash password trước khi lưu vào DB
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
    }
}