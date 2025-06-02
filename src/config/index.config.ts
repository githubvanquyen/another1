import { AppConfigKey, AppConfigType, AppConfig } from "./app.config";
import { DatabaseConfig, DatabaseConfigKey, DatabaseConfigType } from "./database.config";
import {EmailConfig, EmailConfigKey, EmailConfigType} from "./email.config";

export interface IAllConfig {
    [AppConfigKey]: AppConfigType
    [DatabaseConfigKey]: DatabaseConfigType,
    [EmailConfigKey]: EmailConfigType
}

export default {
    AppConfig,
    DatabaseConfig,
    MailgunConfig: EmailConfig,
}