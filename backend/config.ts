import dotenv from 'dotenv'; 

dotenv.config();
interface Config {
    port: number;
    circleAPIKey: string
    contractAddress: string
    privateKey: string
}

const port = Number(process.env.LISTENING_PORT) || 8080;

const circleAPIKey = process.env.CIRCLE_API_KEY;
if (!circleAPIKey) {
    throw new Error("CIRCLE_API_KEY is required in environment");
}

const contractAddress = process.env.CONTRACT_ADDRESS;
if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is required in environment")
}

const privateKey = process.env.BUDAL_PRIVATE_KEY
if (!privateKey) {
    throw new Error("BUDAL_PRIVATE_KEY is required in environment")
}

export default {
    port,
    circleAPIKey,
    contractAddress,
    privateKey
};