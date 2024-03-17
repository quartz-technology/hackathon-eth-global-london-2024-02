import { PrismaClient } from "@prisma/client";

import config from "@config";
import CircleUserSDK from "@service/circle";
import ContractSDK from "@service/contract";
import EnsSDK from "@service/ens";

/**
 * The context object is a collection of all the services and resources that are available 
 * to the endpoint handlers.
 * 
 * It contains:
 * - The CircleUserSDK instance
 * - The PrismaClient instance
 */
interface Context {
    circleSDK: CircleUserSDK
    prisma: PrismaClient
    contractSDK: ContractSDK
    ensSDK: EnsSDK
}

let context: Partial<Context> = {}

export function init() {
    console.debug("Initializing context...")

    context.circleSDK = new CircleUserSDK(config.circleAPIKey)
    context.contractSDK = new ContractSDK(config.circleAPIKey, config.contractAddress)
    context.ensSDK = new EnsSDK()
    context.prisma = new PrismaClient()

    console.log("Context initialized!")
}

export default context as Context;