import { config as configEnv } from "dotenv";

configEnv();

(async () => {
	// Initiate DB connection
	// Launch program
	require("./server");
	require("./bot");
})();
