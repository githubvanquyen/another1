import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MediaType} from "../enums/media.enum";
import mongoose, {HydratedDocument} from "mongoose";

@Schema({_id: true, timestamps: true, versionKey: false})
export class Media {
    @Prop({ required: true, enum: MediaType })
    type: MediaType

    @Prop({
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    })
    user: mongoose.Types.ObjectId

    @Prop({ required: true })
    path: string;
}

export type MediaDocument = HydratedDocument<Media>;

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({ path: 1 }, { unique: true });
