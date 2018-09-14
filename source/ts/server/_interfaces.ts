import { Stream } from "./stream";

export enum ErrorScope {
	SERVER,
	SESSION,
	STREAM,
	REQUEST,
	ROUTING
}

export enum Method {
	GET,
	HEAD,
	POST,
	PUT,
	DELETE,
	CONNECT,
	OPTIONS,
	TRACE,
	PATCH
}

export type Next = () => void;
export type Handler = (stream: Stream, next?: Next) => void;

export type ErrorHandler = (scope: ErrorScope, err: Error) => void;
