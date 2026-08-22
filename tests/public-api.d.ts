import type {
  Headers,
  MNConnection,
  MNConnectionRequestOptions,
  MNDocument,
  MNNotebook,
  Response,
  Runtime,
  RuntimeLifecycleHandler,
} from "../index";

declare const notebook: MNNotebook;
declare const document: MNDocument;
declare const response: Response;
declare const headers: Headers;
declare const connection: typeof MNConnection;
declare const requestOptions: MNConnectionRequestOptions;

type RegisteredLifecycle = ReturnType<typeof Runtime.registerLifecycle>;
type RegisteredRoute = ReturnType<typeof Runtime.registerRoute>;
type FetchResult = ReturnType<typeof MNConnection.fetchDev>;

declare const registeredLifecycle: RegisteredLifecycle;
declare const registeredRoute: RegisteredRoute;
declare const fetched: FetchResult;

type Assert<T extends true> = T;
type PublicApiChecks = [
  Assert<typeof notebook.title extends string ? true : false>,
  Assert<typeof document.docTitle extends string | undefined ? true : false>,
  Assert<ReturnType<typeof response.headers.get> extends string | null ? true : false>,
  Assert<ReturnType<typeof headers.get> extends string | null ? true : false>,
  Assert<typeof registeredLifecycle extends RuntimeLifecycleHandler ? true : false>,
  Assert<typeof registeredRoute extends (...args: never[]) => unknown ? true : false>,
  Assert<typeof fetched extends Promise<Response | undefined> ? true : false>
];
