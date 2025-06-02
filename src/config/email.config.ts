import {ConfigType, registerAs} from "@nestjs/config";
import * as process from "node:process";

export const EmailConfigKey = 'email'
export const EmailConfig = registerAs(EmailConfigKey, () => ({
    MAILGUN_KEY: process.env.MAILGUN_KEY,
    EMAIL_SENDER: process.env.EMAIL_SENDER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
}))

export type EmailConfigType = ConfigType<typeof EmailConfig>