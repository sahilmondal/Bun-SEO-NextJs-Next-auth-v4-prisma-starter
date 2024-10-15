import { PrismaClient } from "@prisma/client";

const prismaclientingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaclientingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaclientingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
export default prisma;
