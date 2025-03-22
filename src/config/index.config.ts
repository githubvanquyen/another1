import { AppConfigKey, AppConfigType, AppConfig } from "./app.config";
import { DatabaseConfig, DatabaseConfigKey, DatabaseConfigType } from "./database.config";

export interface IAllConfig {
    [AppConfigKey]: AppConfigType
    [DatabaseConfigKey]: DatabaseConfigType
}

export default {
    AppConfig,
    DatabaseConfig
}