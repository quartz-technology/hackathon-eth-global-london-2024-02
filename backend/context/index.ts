import { PrismaClient } from "@prisma/client";

import config from "@config";
import CircleUserSDK from "@service/circle";

interface Context {
    circleSDK: CircleUserSDK
    prisma: PrismaClient
}

let context: Partial<Context> = {}

export function init() {
    console.debug("Initializing context...")

    context.circleSDK = new CircleUserSDK(config.circleAPIKey)
    context.prisma = new PrismaClient()

    console.log("Context initialized!")
}

export default context as Context;