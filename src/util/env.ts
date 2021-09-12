import { LiteralUnion } from "./types";

export class EnvironmentVarError extends Error {
	constructor(key: string) {
		super(`The env variable '${key}' key is missing.`);
	}
}

type Env = {
	DISCORD_TOKEN: string;
	NODE_ENV: "development" | "production";
};

type RealEnv = Env & { [key: string]: string };

/**
 * @description Type-safe way to get env vars
 * @param key The data is located at `process.env[key]`
 * @param fallback Must not be `undefined` when used. To avoid throwing an error, put `""`
 */
export function env<K extends keyof Env, F extends LiteralUnion<Env[K]>>(
	key: LiteralUnion<K>,
	fallback?: F | (() => F)
): LiteralUnion<string extends Env[K] ? F : RealEnv[K] | F> {
	const data = process.env[key] as RealEnv[K] | undefined;
	if (data) {
		return data;
	} else {
		if (fallback === undefined) throw new EnvironmentVarError(key);
		if (typeof fallback === "function") return (fallback as () => unknown)();
		return fallback;
	}
}
