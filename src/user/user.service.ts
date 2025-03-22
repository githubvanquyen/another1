import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema'
import { InjectModel } from "@nestjs/mongoose";
import {FilterQuery, Model, Schema} from "mongoose";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

    async findOne(filter: FilterQuery<UserDocument>) {
        return this.userModel.findOne(filter);
    }


    async create(user: Partial<UserDocument>) {
        return this.userModel.create(user)
    }

    async update(user: Partial<UserDocument>) {
        return this.userModel.updateOne({
            _id: user._id,
        }, user)
    }
}
