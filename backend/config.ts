interface Config {
    port: number;
    circleAPIKey: string
}

const port = Number(Bun.env.LISTENING_PORT) || 8080;
const circleAPIKey = Bun.env.CIRCLE_API_KEY;

if (!circleAPIKey) {
    throw new Error("CIRCLE_API_KEY is required in environment");
}

export default {
    port,
    circleAPIKey
};