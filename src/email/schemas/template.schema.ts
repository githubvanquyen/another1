import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema({
    _id: true,
    versionKey: false,
    timestamps: true,
})
export class EmailTemplate {
    @Prop()
    subject: string;

    @Prop()
    body: string;
}

export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;
export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
