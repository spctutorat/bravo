import { config as configEnv } from "dotenv";
import * as Sentry from "@sentry/node";

configEnv();

// Launch program
require("./server");
require("./bot");
