import {Injectable} from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import {EmailConfigKey, EmailConfigType} from "../config/email.config";
import * as nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class EmailService {
    private readonly transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
    constructor(
        private readonly configService: ConfigService,
    ) {
        const emailSender =  this.configService.get<EmailConfigType>(EmailConfigKey)?.EMAIL_SENDER;
        const emailPassword =  this.configService.get<EmailConfigType>(EmailConfigKey)?.EMAIL_PASSWORD;

        this.transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailSender,
                pass: emailPassword,
            }
        })
    }

    async send(from: string, to: string, subject: string, html: string): Promise<any> {
        try {
            const response = await this.transport.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: html,
            })
            console.log(response)
            return response;
        } catch (e) {
            console.error(e);
            throw e
        }
    }
}
