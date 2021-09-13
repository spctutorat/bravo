import express, { ErrorRequestHandler } from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { env } from "./util/env";

// Express web server
const app = express();

Sentry.init({
	dsn: env("SENTRY_DSN"),
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
	],

	tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
	res.end("Hello world!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
	if (!err) return next();
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.status(500).json({ code: "UNHANDLED_ERROR" });
} as ErrorRequestHandler);

app.use((req, res) => {
	res.status(404).send();
});

app.listen(3001, () => {
	console.log("Listening on port 3001");
});
