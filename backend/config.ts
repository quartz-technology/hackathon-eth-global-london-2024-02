import dotenv from 'dotenv'; 

dotenv.config();
interface Config {
    port: number;
    circleAPIKey: string
}

const port = Number(process.env.LISTENING_PORT) || 8080;
const circleAPIKey = process.env.CIRCLE_API_KEY;

if (!circleAPIKey) {
    throw new Error("CIRCLE_API_KEY is required in environment");
}

export default {
    port,
    circleAPIKey
};