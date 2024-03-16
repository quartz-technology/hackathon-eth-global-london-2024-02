import config from "../config";
import CircleUserSDK from "../service/circle";

interface Context {
    circleSDK: CircleUserSDK
}

let context: Partial<Context> = {}

export function init() {
    console.debug("Initializing context...")

    context.circleSDK = new CircleUserSDK(config.circleAPIKey)

    console.log("Context initialized!")
}

export default context as Context;