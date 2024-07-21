import Elysia from "elysia";
import { Logestic } from "logestic";

export const logger = new Elysia({
  name: "logger",
  seed: {
    prefix: "/logger",
  }
}).use(Logestic.preset("fancy")); 