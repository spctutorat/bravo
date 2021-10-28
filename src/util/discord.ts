import axios from "axios";
import FormData from "form-data";
import {
	RESTPostOAuth2AccessTokenResult,
	RESTGetAPIUserResult,
} from "discord-api-types";
import { env } from "./env";

export async function getTokenFromRefresh(
	refreshToken: string
): Promise<RESTPostOAuth2AccessTokenResult> {
	const data = new FormData();
	data.append("client_id", env("DISCORD_ID"));
	data.append("client_secret", env("DISCORD_SECRET"));
	data.append("grant_type", "refresh_token");
	data.append("refresh_token", refreshToken);

	// Fetch token
	const tokenRes = await axios.post(
		"https://discordapp.com/api/oauth2/token",
		data,
		{
			headers: data.getHeaders(),
		}
	);
	const tokenData: RESTPostOAuth2AccessTokenResult = tokenRes.data;
	return tokenData;
}

export async function getTokenFromCode(
	code: string
): Promise<RESTPostOAuth2AccessTokenResult> {
	const data = new FormData();
	data.append("client_id", env("DISCORD_ID"));
	data.append("client_secret", env("DISCORD_SECRET"));
	data.append("grant_type", "authorization_code");
	data.append(
		"redirect_uri",
		env("REDIRECT_URL", () => env("FRONTEND_URL"))
	);
	data.append("scope", "identify");
	data.append("code", code);

	// Fetch token
	const tokenRes = await axios.post(
		"https://discordapp.com/api/oauth2/token",
		data,
		{
			headers: data.getHeaders(),
		}
	);
	const tokenData: RESTPostOAuth2AccessTokenResult = tokenRes.data;
	return tokenData;
}

export async function getUserFromToken(
	accessToken: string
): Promise<RESTGetAPIUserResult> {
	// Fetch user
	const config = {
		headers: {
			authorization: `Bearer ${accessToken}`,
		},
	};
	const response = await axios.get(
		"https://discordapp.com/api/users/@me",
		config
	);
	const userData: RESTGetAPIUserResult = response.data;
	return userData;
}
