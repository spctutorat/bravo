import { config as configEnv } from "dotenv";

configEnv();

// Launch program
require("./server");
require("./bot");
