declare namespace NodeJS {
    export interface ProcessEnv {
        API_PORT: string,
        DATABASE_PORT: string,
        DATABASE_PASSWORD: string,
        DATABASE_USER: string,
        DATABASE_HOST: string,
        DATABASE: string
    }
}