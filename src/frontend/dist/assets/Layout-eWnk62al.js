var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { s as ProtocolError, t as TimeoutWaitingForResponseErrorCode, v as utf8ToBytes, E as ExternalError, w as MissingRootKeyErrorCode, C as Certificate, x as lookupResultToBuffer, y as RequestStatusResponseStatus, U as UnknownError, z as RequestStatusDoneNoReplyErrorCode, A as RejectError, D as CertifiedRejectErrorCode, F as UNREACHABLE_ERROR, I as InputError, G as InvalidReadStateRequestErrorCode, H as ReadRequestType, J as Principal, K as IDL, N as MissingCanisterIdErrorCode, O as HttpAgent, Q as encode, V as QueryResponseStatus, W as UncertifiedRejectErrorCode, X as isV3ResponseBody, Y as isV2ResponseBody, Z as UncertifiedRejectUpdateErrorCode, _ as UnexpectedErrorCode, $ as decode, a0 as Subscribable, a1 as pendingThenable, a2 as resolveEnabled, a3 as shallowEqualObjects, a4 as resolveStaleTime, a5 as noop, a6 as environmentManager, a7 as isValidTimeout, a8 as timeUntilStale, a9 as timeoutManager, aa as focusManager, ab as fetchState, ac as replaceData, ad as notifyManager, ae as hashKey, af as getDefaultState, r as reactExports, ag as shouldThrowError, ah as useQueryClient, ai as useInternetIdentity, aj as createActorWithConfig, c as createLucideIcon, ak as useRouterState, j as jsxRuntimeExports, al as createSlot$1, am as Variant, an as Record, ao as Opt, ap as Vec, aq as Service, ar as Func, as as Nat, at as Int, au as Text, av as Null, aw as Principal$1, ax as Bool, R as React2, p as ReactDOM, ay as Slot, a as cn, az as cva, d as composeRefs, o as reactDomExports, u as useComposedRefs, B as Button, b as BedDouble, L as Link, aA as useAuth, S as Skeleton } from "./index-BHGx-AOT.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp2 = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp2(originalStaleTime(...args)) : clamp2(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$m);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$l);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$k);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$j);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$i);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$h);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$g);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$f);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
];
const Receipt = createLucideIcon("receipt", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z", key: "qazsjp" }],
  ["path", { d: "M15 3v4a2 2 0 0 0 2 2h4", key: "40519r" }]
];
const StickyNote = createLucideIcon("sticky-note", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
var NODES$1 = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive$1 = NODES$1.reduce((primitive, node) => {
  const Slot2 = createSlot$1(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot2 : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
const PlanId$1 = Variant({
  "biannual": Null,
  "annual": Null,
  "quarterly": Null,
  "monthly": Null
});
const StaffInput = Record({
  "joinDate": Int,
  "name": Text,
  "role": Text,
  "monthlySalary": Nat
});
const StaffId = Nat;
const StudentId = Nat;
const ComplaintInput = Record({
  "studentId": Opt(StudentId),
  "description": Text,
  "roomNumber": Text
});
const ComplaintId = Nat;
const NoteId = Nat;
const NotificationType$1 = Variant({
  "emptyRoom": Null,
  "complaintUpdate": Null,
  "paymentOverdue": Null,
  "rentDue": Null
});
const NotificationInput = Record({
  "title": Text,
  "notifType": NotificationType$1,
  "message": Text,
  "relatedId": Opt(Nat)
});
const NotificationId = Nat;
const PaymentStatus$1 = Variant({
  "pending": Null,
  "paid": Null,
  "partial": Null
});
const PaymentInput = Record({
  "status": PaymentStatus$1,
  "month": Nat,
  "studentId": StudentId,
  "note": Opt(Text),
  "year": Nat,
  "rentDue": Nat,
  "paidAmount": Nat
});
const PaymentId = Nat;
const ReminderId = Nat;
const RoomInput = Record({
  "seatCount": Nat,
  "roomNumber": Text
});
const RoomId = Nat;
const SeatType$1 = Variant({ "typeA": Null, "typeB": Null });
const StudentInput = Record({
  "joinDate": Int,
  "name": Text,
  "address": Text,
  "idProofText": Text,
  "phone": Text,
  "roomId": Opt(RoomId),
  "seatType": Opt(SeatType$1)
});
const UdharCategory$1 = Variant({
  "other": Null,
  "milk": Null,
  "grocery": Null
});
const UdharInput = Record({
  "studentId": StudentId,
  "date": Int,
  "description": Text,
  "category": UdharCategory$1,
  "amount": Nat
});
const UdharId = Nat;
const AttendanceStatus$1 = Variant({
  "present": Null,
  "absent": Null
});
const StaffAttendance = Record({
  "status": AttendanceStatus$1,
  "staffId": StaffId,
  "date": Text
});
const BuildingStats = Record({
  "totalEmptyRooms": Nat,
  "totalSeats": Nat,
  "totalActiveStudents": Nat
});
const ComplaintStatus$1 = Variant({
  "resolved": Null,
  "pending": Null,
  "inProgress": Null
});
const Complaint = Record({
  "id": ComplaintId,
  "status": ComplaintStatus$1,
  "studentId": Opt(StudentId),
  "createdAt": Int,
  "description": Text,
  "roomNumber": Text,
  "updatedAt": Int
});
const HostelSettings = Record({ "lateFeePerMonth": Nat });
const Amount = Nat;
const SeatSummary = Record({
  "month": Nat,
  "pricePerSeatA": Amount,
  "pricePerSeatB": Amount,
  "year": Nat,
  "revenueA": Amount,
  "revenueB": Amount,
  "totalBookedSeats": Nat,
  "totalRevenue": Amount,
  "totalCapacity": Nat,
  "emptySeats": Nat,
  "bookedSeatsA": Nat,
  "bookedSeatsB": Nat
});
const MonthKey = Record({ "month": Nat, "year": Nat });
const MonthlyExpenses = Record({
  "key": MonthKey,
  "other": Amount,
  "rent": Amount,
  "electricity": Amount,
  "staffSalary": Amount
});
const MonthlyProfit = Record({
  "month": Nat,
  "revenue": Amount,
  "year": Nat,
  "totalExpenses": Amount,
  "profit": Int
});
const MonthlyStaffExpense = Record({
  "month": Nat,
  "presentDays": Nat,
  "year": Nat,
  "workingDays": Nat,
  "totalSalary": Nat
});
const SubscriptionStatus$1 = Variant({
  "trial": Null,
  "active": Null,
  "expired": Null
});
const SubscriptionRecord = Record({
  "status": SubscriptionStatus$1,
  "planId": Opt(PlanId$1),
  "expiryDate": Opt(Int),
  "userId": Principal$1,
  "trialStartDate": Int
});
const SubscriptionStatusResult = Record({
  "status": SubscriptionStatus$1,
  "daysRemaining": Nat
});
const Note = Record({
  "id": NoteId,
  "title": Text,
  "content": Text,
  "createdAt": Int,
  "updatedAt": Int
});
const Notification = Record({
  "id": NotificationId,
  "title": Text,
  "notifType": NotificationType$1,
  "createdAt": Int,
  "isRead": Bool,
  "message": Text,
  "relatedId": Opt(Nat)
});
const Payment = Record({
  "id": PaymentId,
  "status": PaymentStatus$1,
  "month": Nat,
  "studentId": StudentId,
  "note": Opt(Text),
  "createdAt": Int,
  "year": Nat,
  "dueDate": Int,
  "lateFee": Nat,
  "paidDate": Opt(Int),
  "rentDue": Nat,
  "paidAmount": Nat
});
const Reminder = Record({
  "id": ReminderId,
  "title": Text,
  "remindAt": Int,
  "createdAt": Int,
  "isDone": Bool,
  "message": Text
});
const Room = Record({
  "id": RoomId,
  "createdAt": Int,
  "seatCount": Nat,
  "roomNumber": Text,
  "occupiedSeats": Nat
});
const RoomSummary = Record({
  "id": RoomId,
  "status": Variant({
    "full": Null,
    "empty": Null,
    "partial": Null
  }),
  "seatCount": Nat,
  "roomNumber": Text,
  "occupiedSeats": Nat
});
const SeatConfig = Record({
  "pricePerSeatA": Amount,
  "pricePerSeatB": Amount,
  "totalCapacity": Nat
});
const Staff = Record({
  "id": StaffId,
  "joinDate": Int,
  "name": Text,
  "role": Text,
  "isActive": Bool,
  "monthlySalary": Nat
});
const StaffSalaryEntry = Record({
  "earnedSalary": Nat,
  "staffId": StaffId,
  "presentDays": Nat,
  "name": Text,
  "monthlySalary": Nat,
  "totalWorkingDays": Nat
});
const StaffSalaryReport = Record({
  "month": Nat,
  "totalEarned": Nat,
  "year": Nat,
  "entries": Vec(StaffSalaryEntry),
  "workingDays": Nat
});
const StudentStatus$1 = Variant({
  "active": Null,
  "vacated": Null
});
const Student = Record({
  "id": StudentId,
  "status": StudentStatus$1,
  "documentKey": Opt(Text),
  "joinDate": Int,
  "name": Text,
  "createdAt": Int,
  "photoKey": Opt(Text),
  "address": Text,
  "idProofText": Text,
  "phone": Text,
  "roomId": Opt(RoomId),
  "leaveDate": Opt(Int),
  "seatType": Opt(SeatType$1)
});
const UdharEntry = Record({
  "id": UdharId,
  "studentId": StudentId,
  "date": Int,
  "createdAt": Int,
  "description": Text,
  "isPaid": Bool,
  "category": UdharCategory$1,
  "amount": Nat
});
const UdharSummary = Record({
  "studentId": StudentId,
  "totalOutstanding": Nat,
  "entries": Vec(UdharEntry)
});
const StudentSummary = Record({
  "id": StudentId,
  "status": StudentStatus$1,
  "joinDate": Int,
  "name": Text,
  "roomNumber": Opt(Text),
  "phone": Text,
  "roomId": Opt(RoomId),
  "leaveDate": Opt(Int)
});
const YearlyChartEntry = Record({
  "month": Nat,
  "profit": Int
});
const ExpenseInput = Record({
  "other": Amount,
  "rent": Amount,
  "electricity": Amount,
  "staffSalary": Amount
});
Service({
  "activateSubscription": Func([PlanId$1], [], []),
  "addStaff": Func(
    [StaffInput],
    [Variant({ "ok": StaffId, "err": Text })],
    []
  ),
  "cancelSubscription": Func([], [], []),
  "clearAllNotifications": Func(
    [],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "createComplaint": Func(
    [ComplaintInput],
    [Variant({ "ok": ComplaintId, "err": Text })],
    []
  ),
  "createNote": Func([Text, Text], [NoteId], []),
  "createNotification": Func(
    [NotificationInput],
    [Variant({ "ok": NotificationId, "err": Text })],
    []
  ),
  "createPayment": Func(
    [PaymentInput],
    [Variant({ "ok": PaymentId, "err": Text })],
    []
  ),
  "createReminder": Func([Text, Text, Int], [ReminderId], []),
  "createRoom": Func(
    [RoomInput],
    [Variant({ "ok": RoomId, "err": Text })],
    []
  ),
  "createStudent": Func(
    [StudentInput],
    [Variant({ "ok": StudentId, "err": Text })],
    []
  ),
  "createUdharEntry": Func(
    [UdharInput],
    [Variant({ "ok": UdharId, "err": Text })],
    []
  ),
  "deleteComplaint": Func(
    [ComplaintId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteNote": Func([NoteId], [Bool], []),
  "deletePayment": Func(
    [PaymentId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteReminder": Func([ReminderId], [Bool], []),
  "deleteRoom": Func(
    [RoomId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteStudent": Func(
    [StudentId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteUdharEntry": Func(
    [UdharId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "getAttendanceByMonth": Func(
    [Nat, Nat],
    [Vec(StaffAttendance)],
    ["query"]
  ),
  "getBuildingStats": Func([], [BuildingStats], ["query"]),
  "getComplaints": Func([], [Vec(Complaint)], ["query"]),
  "getHostelSettings": Func([], [HostelSettings], ["query"]),
  "getMonthSeatSummary": Func(
    [Nat, Nat],
    [Opt(SeatSummary)],
    ["query"]
  ),
  "getMonthlyExpenses": Func(
    [Nat, Nat],
    [Opt(MonthlyExpenses)],
    ["query"]
  ),
  "getMonthlyProfit": Func([Nat, Nat], [MonthlyProfit], ["query"]),
  "getMonthlyStaffExpense": Func(
    [Nat, Nat],
    [MonthlyStaffExpense],
    ["query"]
  ),
  "getMySubscription": Func([], [Opt(SubscriptionRecord)], ["query"]),
  "getMySubscriptionStatus": Func([], [SubscriptionStatusResult], []),
  "getNotes": Func([], [Vec(Note)], ["query"]),
  "getNotifications": Func([], [Vec(Notification)], ["query"]),
  "getPayments": Func([], [Vec(Payment)], ["query"]),
  "getReminders": Func([], [Vec(Reminder)], ["query"]),
  "getRoom": Func([RoomId], [Opt(Room)], ["query"]),
  "getRooms": Func([], [Vec(RoomSummary)], ["query"]),
  "getSeatConfig": Func([], [Opt(SeatConfig)], ["query"]),
  "getStaff": Func([], [Vec(Staff)], ["query"]),
  "getStaffAttendance": Func(
    [StaffId, Nat, Nat],
    [Vec(StaffAttendance)],
    ["query"]
  ),
  "getStaffSalaryReport": Func(
    [Nat, Nat],
    [StaffSalaryReport],
    ["query"]
  ),
  "getStudent": Func([StudentId], [Opt(Student)], ["query"]),
  "getStudentPayments": Func([StudentId], [Vec(Payment)], ["query"]),
  "getStudentUdhar": Func([StudentId], [UdharSummary], ["query"]),
  "getStudents": Func([], [Vec(StudentSummary)], ["query"]),
  "getTotalExpenses": Func([Nat, Nat], [Nat], ["query"]),
  "getUdharEntries": Func([], [Vec(UdharEntry)], ["query"]),
  "getUnreadCount": Func([], [Nat], ["query"]),
  "getYearlyProfitChart": Func(
    [Nat],
    [Vec(YearlyChartEntry)],
    ["query"]
  ),
  "markAllNotificationsRead": Func(
    [],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "markAttendance": Func(
    [StaffId, Text, AttendanceStatus$1],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "markNotificationRead": Func(
    [NotificationId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "markReminderDone": Func([ReminderId], [Bool], []),
  "markUdharPaid": Func(
    [UdharId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "removeStaff": Func(
    [StaffId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "setMonthlyBooking": Func([Nat, Nat, Nat, Nat], [], []),
  "setMonthlyExpenses": Func([Nat, Nat, ExpenseInput], [], []),
  "setSeatConfig": Func([Nat, Nat, Nat], [], []),
  "startTrial": Func([], [], []),
  "stripeWebhook": Func([Principal$1, PlanId$1], [], []),
  "updateComplaintStatus": Func(
    [ComplaintId, ComplaintStatus$1],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateHostelSettings": Func(
    [HostelSettings],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateNote": Func([NoteId, Text, Text], [Bool], []),
  "updatePayment": Func(
    [PaymentId, PaymentInput],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateReminder": Func(
    [ReminderId, Text, Text, Int],
    [Bool],
    []
  ),
  "updateRoom": Func(
    [RoomId, RoomInput],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateStaff": Func(
    [StaffId, StaffInput],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateStudent": Func(
    [StudentId, StudentInput],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateStudentDocument": Func(
    [StudentId, Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateStudentPhoto": Func(
    [StudentId, Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateUdharEntry": Func(
    [UdharId, UdharInput],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "vacateStudent": Func(
    [StudentId, Int],
    [Variant({ "ok": Null, "err": Text })],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const PlanId2 = IDL2.Variant({
    "biannual": IDL2.Null,
    "annual": IDL2.Null,
    "quarterly": IDL2.Null,
    "monthly": IDL2.Null
  });
  const StaffInput2 = IDL2.Record({
    "joinDate": IDL2.Int,
    "name": IDL2.Text,
    "role": IDL2.Text,
    "monthlySalary": IDL2.Nat
  });
  const StaffId2 = IDL2.Nat;
  const StudentId2 = IDL2.Nat;
  const ComplaintInput2 = IDL2.Record({
    "studentId": IDL2.Opt(StudentId2),
    "description": IDL2.Text,
    "roomNumber": IDL2.Text
  });
  const ComplaintId2 = IDL2.Nat;
  const NoteId2 = IDL2.Nat;
  const NotificationType2 = IDL2.Variant({
    "emptyRoom": IDL2.Null,
    "complaintUpdate": IDL2.Null,
    "paymentOverdue": IDL2.Null,
    "rentDue": IDL2.Null
  });
  const NotificationInput2 = IDL2.Record({
    "title": IDL2.Text,
    "notifType": NotificationType2,
    "message": IDL2.Text,
    "relatedId": IDL2.Opt(IDL2.Nat)
  });
  const NotificationId2 = IDL2.Nat;
  const PaymentStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "paid": IDL2.Null,
    "partial": IDL2.Null
  });
  const PaymentInput2 = IDL2.Record({
    "status": PaymentStatus2,
    "month": IDL2.Nat,
    "studentId": StudentId2,
    "note": IDL2.Opt(IDL2.Text),
    "year": IDL2.Nat,
    "rentDue": IDL2.Nat,
    "paidAmount": IDL2.Nat
  });
  const PaymentId2 = IDL2.Nat;
  const ReminderId2 = IDL2.Nat;
  const RoomInput2 = IDL2.Record({
    "seatCount": IDL2.Nat,
    "roomNumber": IDL2.Text
  });
  const RoomId2 = IDL2.Nat;
  const SeatType2 = IDL2.Variant({ "typeA": IDL2.Null, "typeB": IDL2.Null });
  const StudentInput2 = IDL2.Record({
    "joinDate": IDL2.Int,
    "name": IDL2.Text,
    "address": IDL2.Text,
    "idProofText": IDL2.Text,
    "phone": IDL2.Text,
    "roomId": IDL2.Opt(RoomId2),
    "seatType": IDL2.Opt(SeatType2)
  });
  const UdharCategory2 = IDL2.Variant({
    "other": IDL2.Null,
    "milk": IDL2.Null,
    "grocery": IDL2.Null
  });
  const UdharInput2 = IDL2.Record({
    "studentId": StudentId2,
    "date": IDL2.Int,
    "description": IDL2.Text,
    "category": UdharCategory2,
    "amount": IDL2.Nat
  });
  const UdharId2 = IDL2.Nat;
  const AttendanceStatus2 = IDL2.Variant({
    "present": IDL2.Null,
    "absent": IDL2.Null
  });
  const StaffAttendance2 = IDL2.Record({
    "status": AttendanceStatus2,
    "staffId": StaffId2,
    "date": IDL2.Text
  });
  const BuildingStats2 = IDL2.Record({
    "totalEmptyRooms": IDL2.Nat,
    "totalSeats": IDL2.Nat,
    "totalActiveStudents": IDL2.Nat
  });
  const ComplaintStatus2 = IDL2.Variant({
    "resolved": IDL2.Null,
    "pending": IDL2.Null,
    "inProgress": IDL2.Null
  });
  const Complaint2 = IDL2.Record({
    "id": ComplaintId2,
    "status": ComplaintStatus2,
    "studentId": IDL2.Opt(StudentId2),
    "createdAt": IDL2.Int,
    "description": IDL2.Text,
    "roomNumber": IDL2.Text,
    "updatedAt": IDL2.Int
  });
  const HostelSettings2 = IDL2.Record({ "lateFeePerMonth": IDL2.Nat });
  const Amount2 = IDL2.Nat;
  const SeatSummary2 = IDL2.Record({
    "month": IDL2.Nat,
    "pricePerSeatA": Amount2,
    "pricePerSeatB": Amount2,
    "year": IDL2.Nat,
    "revenueA": Amount2,
    "revenueB": Amount2,
    "totalBookedSeats": IDL2.Nat,
    "totalRevenue": Amount2,
    "totalCapacity": IDL2.Nat,
    "emptySeats": IDL2.Nat,
    "bookedSeatsA": IDL2.Nat,
    "bookedSeatsB": IDL2.Nat
  });
  const MonthKey2 = IDL2.Record({ "month": IDL2.Nat, "year": IDL2.Nat });
  const MonthlyExpenses2 = IDL2.Record({
    "key": MonthKey2,
    "other": Amount2,
    "rent": Amount2,
    "electricity": Amount2,
    "staffSalary": Amount2
  });
  const MonthlyProfit2 = IDL2.Record({
    "month": IDL2.Nat,
    "revenue": Amount2,
    "year": IDL2.Nat,
    "totalExpenses": Amount2,
    "profit": IDL2.Int
  });
  const MonthlyStaffExpense2 = IDL2.Record({
    "month": IDL2.Nat,
    "presentDays": IDL2.Nat,
    "year": IDL2.Nat,
    "workingDays": IDL2.Nat,
    "totalSalary": IDL2.Nat
  });
  const SubscriptionStatus2 = IDL2.Variant({
    "trial": IDL2.Null,
    "active": IDL2.Null,
    "expired": IDL2.Null
  });
  const SubscriptionRecord2 = IDL2.Record({
    "status": SubscriptionStatus2,
    "planId": IDL2.Opt(PlanId2),
    "expiryDate": IDL2.Opt(IDL2.Int),
    "userId": IDL2.Principal,
    "trialStartDate": IDL2.Int
  });
  const SubscriptionStatusResult2 = IDL2.Record({
    "status": SubscriptionStatus2,
    "daysRemaining": IDL2.Nat
  });
  const Note2 = IDL2.Record({
    "id": NoteId2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "createdAt": IDL2.Int,
    "updatedAt": IDL2.Int
  });
  const Notification2 = IDL2.Record({
    "id": NotificationId2,
    "title": IDL2.Text,
    "notifType": NotificationType2,
    "createdAt": IDL2.Int,
    "isRead": IDL2.Bool,
    "message": IDL2.Text,
    "relatedId": IDL2.Opt(IDL2.Nat)
  });
  const Payment2 = IDL2.Record({
    "id": PaymentId2,
    "status": PaymentStatus2,
    "month": IDL2.Nat,
    "studentId": StudentId2,
    "note": IDL2.Opt(IDL2.Text),
    "createdAt": IDL2.Int,
    "year": IDL2.Nat,
    "dueDate": IDL2.Int,
    "lateFee": IDL2.Nat,
    "paidDate": IDL2.Opt(IDL2.Int),
    "rentDue": IDL2.Nat,
    "paidAmount": IDL2.Nat
  });
  const Reminder2 = IDL2.Record({
    "id": ReminderId2,
    "title": IDL2.Text,
    "remindAt": IDL2.Int,
    "createdAt": IDL2.Int,
    "isDone": IDL2.Bool,
    "message": IDL2.Text
  });
  const Room2 = IDL2.Record({
    "id": RoomId2,
    "createdAt": IDL2.Int,
    "seatCount": IDL2.Nat,
    "roomNumber": IDL2.Text,
    "occupiedSeats": IDL2.Nat
  });
  const RoomSummary2 = IDL2.Record({
    "id": RoomId2,
    "status": IDL2.Variant({
      "full": IDL2.Null,
      "empty": IDL2.Null,
      "partial": IDL2.Null
    }),
    "seatCount": IDL2.Nat,
    "roomNumber": IDL2.Text,
    "occupiedSeats": IDL2.Nat
  });
  const SeatConfig2 = IDL2.Record({
    "pricePerSeatA": Amount2,
    "pricePerSeatB": Amount2,
    "totalCapacity": IDL2.Nat
  });
  const Staff2 = IDL2.Record({
    "id": StaffId2,
    "joinDate": IDL2.Int,
    "name": IDL2.Text,
    "role": IDL2.Text,
    "isActive": IDL2.Bool,
    "monthlySalary": IDL2.Nat
  });
  const StaffSalaryEntry2 = IDL2.Record({
    "earnedSalary": IDL2.Nat,
    "staffId": StaffId2,
    "presentDays": IDL2.Nat,
    "name": IDL2.Text,
    "monthlySalary": IDL2.Nat,
    "totalWorkingDays": IDL2.Nat
  });
  const StaffSalaryReport2 = IDL2.Record({
    "month": IDL2.Nat,
    "totalEarned": IDL2.Nat,
    "year": IDL2.Nat,
    "entries": IDL2.Vec(StaffSalaryEntry2),
    "workingDays": IDL2.Nat
  });
  const StudentStatus2 = IDL2.Variant({
    "active": IDL2.Null,
    "vacated": IDL2.Null
  });
  const Student2 = IDL2.Record({
    "id": StudentId2,
    "status": StudentStatus2,
    "documentKey": IDL2.Opt(IDL2.Text),
    "joinDate": IDL2.Int,
    "name": IDL2.Text,
    "createdAt": IDL2.Int,
    "photoKey": IDL2.Opt(IDL2.Text),
    "address": IDL2.Text,
    "idProofText": IDL2.Text,
    "phone": IDL2.Text,
    "roomId": IDL2.Opt(RoomId2),
    "leaveDate": IDL2.Opt(IDL2.Int),
    "seatType": IDL2.Opt(SeatType2)
  });
  const UdharEntry2 = IDL2.Record({
    "id": UdharId2,
    "studentId": StudentId2,
    "date": IDL2.Int,
    "createdAt": IDL2.Int,
    "description": IDL2.Text,
    "isPaid": IDL2.Bool,
    "category": UdharCategory2,
    "amount": IDL2.Nat
  });
  const UdharSummary2 = IDL2.Record({
    "studentId": StudentId2,
    "totalOutstanding": IDL2.Nat,
    "entries": IDL2.Vec(UdharEntry2)
  });
  const StudentSummary2 = IDL2.Record({
    "id": StudentId2,
    "status": StudentStatus2,
    "joinDate": IDL2.Int,
    "name": IDL2.Text,
    "roomNumber": IDL2.Opt(IDL2.Text),
    "phone": IDL2.Text,
    "roomId": IDL2.Opt(RoomId2),
    "leaveDate": IDL2.Opt(IDL2.Int)
  });
  const YearlyChartEntry2 = IDL2.Record({
    "month": IDL2.Nat,
    "profit": IDL2.Int
  });
  const ExpenseInput2 = IDL2.Record({
    "other": Amount2,
    "rent": Amount2,
    "electricity": Amount2,
    "staffSalary": Amount2
  });
  return IDL2.Service({
    "activateSubscription": IDL2.Func([PlanId2], [], []),
    "addStaff": IDL2.Func(
      [StaffInput2],
      [IDL2.Variant({ "ok": StaffId2, "err": IDL2.Text })],
      []
    ),
    "cancelSubscription": IDL2.Func([], [], []),
    "clearAllNotifications": IDL2.Func(
      [],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "createComplaint": IDL2.Func(
      [ComplaintInput2],
      [IDL2.Variant({ "ok": ComplaintId2, "err": IDL2.Text })],
      []
    ),
    "createNote": IDL2.Func([IDL2.Text, IDL2.Text], [NoteId2], []),
    "createNotification": IDL2.Func(
      [NotificationInput2],
      [IDL2.Variant({ "ok": NotificationId2, "err": IDL2.Text })],
      []
    ),
    "createPayment": IDL2.Func(
      [PaymentInput2],
      [IDL2.Variant({ "ok": PaymentId2, "err": IDL2.Text })],
      []
    ),
    "createReminder": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Int],
      [ReminderId2],
      []
    ),
    "createRoom": IDL2.Func(
      [RoomInput2],
      [IDL2.Variant({ "ok": RoomId2, "err": IDL2.Text })],
      []
    ),
    "createStudent": IDL2.Func(
      [StudentInput2],
      [IDL2.Variant({ "ok": StudentId2, "err": IDL2.Text })],
      []
    ),
    "createUdharEntry": IDL2.Func(
      [UdharInput2],
      [IDL2.Variant({ "ok": UdharId2, "err": IDL2.Text })],
      []
    ),
    "deleteComplaint": IDL2.Func(
      [ComplaintId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteNote": IDL2.Func([NoteId2], [IDL2.Bool], []),
    "deletePayment": IDL2.Func(
      [PaymentId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteReminder": IDL2.Func([ReminderId2], [IDL2.Bool], []),
    "deleteRoom": IDL2.Func(
      [RoomId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteStudent": IDL2.Func(
      [StudentId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteUdharEntry": IDL2.Func(
      [UdharId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "getAttendanceByMonth": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(StaffAttendance2)],
      ["query"]
    ),
    "getBuildingStats": IDL2.Func([], [BuildingStats2], ["query"]),
    "getComplaints": IDL2.Func([], [IDL2.Vec(Complaint2)], ["query"]),
    "getHostelSettings": IDL2.Func([], [HostelSettings2], ["query"]),
    "getMonthSeatSummary": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Opt(SeatSummary2)],
      ["query"]
    ),
    "getMonthlyExpenses": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Opt(MonthlyExpenses2)],
      ["query"]
    ),
    "getMonthlyProfit": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [MonthlyProfit2],
      ["query"]
    ),
    "getMonthlyStaffExpense": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [MonthlyStaffExpense2],
      ["query"]
    ),
    "getMySubscription": IDL2.Func(
      [],
      [IDL2.Opt(SubscriptionRecord2)],
      ["query"]
    ),
    "getMySubscriptionStatus": IDL2.Func([], [SubscriptionStatusResult2], []),
    "getNotes": IDL2.Func([], [IDL2.Vec(Note2)], ["query"]),
    "getNotifications": IDL2.Func([], [IDL2.Vec(Notification2)], ["query"]),
    "getPayments": IDL2.Func([], [IDL2.Vec(Payment2)], ["query"]),
    "getReminders": IDL2.Func([], [IDL2.Vec(Reminder2)], ["query"]),
    "getRoom": IDL2.Func([RoomId2], [IDL2.Opt(Room2)], ["query"]),
    "getRooms": IDL2.Func([], [IDL2.Vec(RoomSummary2)], ["query"]),
    "getSeatConfig": IDL2.Func([], [IDL2.Opt(SeatConfig2)], ["query"]),
    "getStaff": IDL2.Func([], [IDL2.Vec(Staff2)], ["query"]),
    "getStaffAttendance": IDL2.Func(
      [StaffId2, IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(StaffAttendance2)],
      ["query"]
    ),
    "getStaffSalaryReport": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [StaffSalaryReport2],
      ["query"]
    ),
    "getStudent": IDL2.Func([StudentId2], [IDL2.Opt(Student2)], ["query"]),
    "getStudentPayments": IDL2.Func([StudentId2], [IDL2.Vec(Payment2)], ["query"]),
    "getStudentUdhar": IDL2.Func([StudentId2], [UdharSummary2], ["query"]),
    "getStudents": IDL2.Func([], [IDL2.Vec(StudentSummary2)], ["query"]),
    "getTotalExpenses": IDL2.Func([IDL2.Nat, IDL2.Nat], [IDL2.Nat], ["query"]),
    "getUdharEntries": IDL2.Func([], [IDL2.Vec(UdharEntry2)], ["query"]),
    "getUnreadCount": IDL2.Func([], [IDL2.Nat], ["query"]),
    "getYearlyProfitChart": IDL2.Func(
      [IDL2.Nat],
      [IDL2.Vec(YearlyChartEntry2)],
      ["query"]
    ),
    "markAllNotificationsRead": IDL2.Func(
      [],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "markAttendance": IDL2.Func(
      [StaffId2, IDL2.Text, AttendanceStatus2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "markNotificationRead": IDL2.Func(
      [NotificationId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "markReminderDone": IDL2.Func([ReminderId2], [IDL2.Bool], []),
    "markUdharPaid": IDL2.Func(
      [UdharId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "removeStaff": IDL2.Func(
      [StaffId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "setMonthlyBooking": IDL2.Func(
      [IDL2.Nat, IDL2.Nat, IDL2.Nat, IDL2.Nat],
      [],
      []
    ),
    "setMonthlyExpenses": IDL2.Func([IDL2.Nat, IDL2.Nat, ExpenseInput2], [], []),
    "setSeatConfig": IDL2.Func([IDL2.Nat, IDL2.Nat, IDL2.Nat], [], []),
    "startTrial": IDL2.Func([], [], []),
    "stripeWebhook": IDL2.Func([IDL2.Principal, PlanId2], [], []),
    "updateComplaintStatus": IDL2.Func(
      [ComplaintId2, ComplaintStatus2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateHostelSettings": IDL2.Func(
      [HostelSettings2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateNote": IDL2.Func([NoteId2, IDL2.Text, IDL2.Text], [IDL2.Bool], []),
    "updatePayment": IDL2.Func(
      [PaymentId2, PaymentInput2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateReminder": IDL2.Func(
      [ReminderId2, IDL2.Text, IDL2.Text, IDL2.Int],
      [IDL2.Bool],
      []
    ),
    "updateRoom": IDL2.Func(
      [RoomId2, RoomInput2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateStaff": IDL2.Func(
      [StaffId2, StaffInput2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateStudent": IDL2.Func(
      [StudentId2, StudentInput2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateStudentDocument": IDL2.Func(
      [StudentId2, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateStudentPhoto": IDL2.Func(
      [StudentId2, IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateUdharEntry": IDL2.Func(
      [UdharId2, UdharInput2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "vacateStudent": IDL2.Func(
      [StudentId2, IDL2.Int],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var AttendanceStatus = /* @__PURE__ */ ((AttendanceStatus2) => {
  AttendanceStatus2["present"] = "present";
  AttendanceStatus2["absent"] = "absent";
  return AttendanceStatus2;
})(AttendanceStatus || {});
var ComplaintStatus = /* @__PURE__ */ ((ComplaintStatus2) => {
  ComplaintStatus2["resolved"] = "resolved";
  ComplaintStatus2["pending"] = "pending";
  ComplaintStatus2["inProgress"] = "inProgress";
  return ComplaintStatus2;
})(ComplaintStatus || {});
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2["emptyRoom"] = "emptyRoom";
  NotificationType2["complaintUpdate"] = "complaintUpdate";
  NotificationType2["paymentOverdue"] = "paymentOverdue";
  NotificationType2["rentDue"] = "rentDue";
  return NotificationType2;
})(NotificationType || {});
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["pending"] = "pending";
  PaymentStatus2["paid"] = "paid";
  PaymentStatus2["partial"] = "partial";
  return PaymentStatus2;
})(PaymentStatus || {});
var PlanId = /* @__PURE__ */ ((PlanId2) => {
  PlanId2["biannual"] = "biannual";
  PlanId2["annual"] = "annual";
  PlanId2["quarterly"] = "quarterly";
  PlanId2["monthly"] = "monthly";
  return PlanId2;
})(PlanId || {});
var SeatType = /* @__PURE__ */ ((SeatType2) => {
  SeatType2["typeA"] = "typeA";
  SeatType2["typeB"] = "typeB";
  return SeatType2;
})(SeatType || {});
var StudentStatus = /* @__PURE__ */ ((StudentStatus2) => {
  StudentStatus2["active"] = "active";
  StudentStatus2["vacated"] = "vacated";
  return StudentStatus2;
})(StudentStatus || {});
var SubscriptionStatus = /* @__PURE__ */ ((SubscriptionStatus2) => {
  SubscriptionStatus2["trial"] = "trial";
  SubscriptionStatus2["active"] = "active";
  SubscriptionStatus2["expired"] = "expired";
  return SubscriptionStatus2;
})(SubscriptionStatus || {});
var UdharCategory = /* @__PURE__ */ ((UdharCategory2) => {
  UdharCategory2["other"] = "other";
  UdharCategory2["milk"] = "milk";
  UdharCategory2["grocery"] = "grocery";
  return UdharCategory2;
})(UdharCategory || {});
var Variant_full_empty_partial = /* @__PURE__ */ ((Variant_full_empty_partial2) => {
  Variant_full_empty_partial2["full"] = "full";
  Variant_full_empty_partial2["empty"] = "empty";
  Variant_full_empty_partial2["partial"] = "partial";
  return Variant_full_empty_partial2;
})(Variant_full_empty_partial || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async activateSubscription(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.activateSubscription(to_candid_PlanId_n1(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.activateSubscription(to_candid_PlanId_n1(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async addStaff(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addStaff(arg0);
        return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addStaff(arg0);
      return from_candid_variant_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async cancelSubscription() {
    if (this.processError) {
      try {
        const result = await this.actor.cancelSubscription();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelSubscription();
      return result;
    }
  }
  async clearAllNotifications() {
    if (this.processError) {
      try {
        const result = await this.actor.clearAllNotifications();
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.clearAllNotifications();
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async createComplaint(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createComplaint(to_candid_ComplaintInput_n5(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createComplaint(to_candid_ComplaintInput_n5(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async createNote(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createNote(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createNote(arg0, arg1);
      return result;
    }
  }
  async createNotification(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createNotification(to_candid_NotificationInput_n8(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createNotification(to_candid_NotificationInput_n8(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async createPayment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createPayment(to_candid_PaymentInput_n13(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createPayment(to_candid_PaymentInput_n13(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async createReminder(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createReminder(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createReminder(arg0, arg1, arg2);
      return result;
    }
  }
  async createRoom(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createRoom(arg0);
        return from_candid_variant_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createRoom(arg0);
      return from_candid_variant_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async createStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createStudent(to_candid_StudentInput_n19(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createStudent(to_candid_StudentInput_n19(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async createUdharEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createUdharEntry(to_candid_UdharInput_n24(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createUdharEntry(to_candid_UdharInput_n24(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n28(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteComplaint(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteComplaint(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteComplaint(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteNote(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteNote(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteNote(arg0);
      return result;
    }
  }
  async deletePayment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deletePayment(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deletePayment(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteReminder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteReminder(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteReminder(arg0);
      return result;
    }
  }
  async deleteRoom(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteRoom(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteRoom(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteStudent(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteStudent(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteUdharEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteUdharEntry(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteUdharEntry(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAttendanceByMonth(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getAttendanceByMonth(arg0, arg1);
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAttendanceByMonth(arg0, arg1);
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getBuildingStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getBuildingStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getBuildingStats();
      return result;
    }
  }
  async getComplaints() {
    if (this.processError) {
      try {
        const result = await this.actor.getComplaints();
        return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getComplaints();
      return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getHostelSettings() {
    if (this.processError) {
      try {
        const result = await this.actor.getHostelSettings();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getHostelSettings();
      return result;
    }
  }
  async getMonthSeatSummary(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getMonthSeatSummary(arg0, arg1);
        return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMonthSeatSummary(arg0, arg1);
      return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMonthlyExpenses(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getMonthlyExpenses(arg0, arg1);
        return from_candid_opt_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMonthlyExpenses(arg0, arg1);
      return from_candid_opt_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMonthlyProfit(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getMonthlyProfit(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMonthlyProfit(arg0, arg1);
      return result;
    }
  }
  async getMonthlyStaffExpense(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getMonthlyStaffExpense(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMonthlyStaffExpense(arg0, arg1);
      return result;
    }
  }
  async getMySubscription() {
    if (this.processError) {
      try {
        const result = await this.actor.getMySubscription();
        return from_candid_opt_n42(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMySubscription();
      return from_candid_opt_n42(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMySubscriptionStatus() {
    if (this.processError) {
      try {
        const result = await this.actor.getMySubscriptionStatus();
        return from_candid_SubscriptionStatusResult_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMySubscriptionStatus();
      return from_candid_SubscriptionStatusResult_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNotes() {
    if (this.processError) {
      try {
        const result = await this.actor.getNotes();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNotes();
      return result;
    }
  }
  async getNotifications() {
    if (this.processError) {
      try {
        const result = await this.actor.getNotifications();
        return from_candid_vec_n53(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNotifications();
      return from_candid_vec_n53(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPayments() {
    if (this.processError) {
      try {
        const result = await this.actor.getPayments();
        return from_candid_vec_n59(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPayments();
      return from_candid_vec_n59(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReminders() {
    if (this.processError) {
      try {
        const result = await this.actor.getReminders();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReminders();
      return result;
    }
  }
  async getRoom(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getRoom(arg0);
        return from_candid_opt_n65(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRoom(arg0);
      return from_candid_opt_n65(this._uploadFile, this._downloadFile, result);
    }
  }
  async getRooms() {
    if (this.processError) {
      try {
        const result = await this.actor.getRooms();
        return from_candid_vec_n66(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRooms();
      return from_candid_vec_n66(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSeatConfig() {
    if (this.processError) {
      try {
        const result = await this.actor.getSeatConfig();
        return from_candid_opt_n70(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSeatConfig();
      return from_candid_opt_n70(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStaff() {
    if (this.processError) {
      try {
        const result = await this.actor.getStaff();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStaff();
      return result;
    }
  }
  async getStaffAttendance(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.getStaffAttendance(arg0, arg1, arg2);
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStaffAttendance(arg0, arg1, arg2);
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStaffSalaryReport(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getStaffSalaryReport(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStaffSalaryReport(arg0, arg1);
      return result;
    }
  }
  async getStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStudent(arg0);
        return from_candid_opt_n71(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStudent(arg0);
      return from_candid_opt_n71(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStudentPayments(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStudentPayments(arg0);
        return from_candid_vec_n59(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStudentPayments(arg0);
      return from_candid_vec_n59(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStudentUdhar(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStudentUdhar(arg0);
        return from_candid_UdharSummary_n80(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStudentUdhar(arg0);
      return from_candid_UdharSummary_n80(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStudents() {
    if (this.processError) {
      try {
        const result = await this.actor.getStudents();
        return from_candid_vec_n87(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStudents();
      return from_candid_vec_n87(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTotalExpenses(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getTotalExpenses(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTotalExpenses(arg0, arg1);
      return result;
    }
  }
  async getUdharEntries() {
    if (this.processError) {
      try {
        const result = await this.actor.getUdharEntries();
        return from_candid_vec_n82(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUdharEntries();
      return from_candid_vec_n82(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUnreadCount() {
    if (this.processError) {
      try {
        const result = await this.actor.getUnreadCount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUnreadCount();
      return result;
    }
  }
  async getYearlyProfitChart(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getYearlyProfitChart(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getYearlyProfitChart(arg0);
      return result;
    }
  }
  async markAllNotificationsRead() {
    if (this.processError) {
      try {
        const result = await this.actor.markAllNotificationsRead();
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markAllNotificationsRead();
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async markAttendance(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.markAttendance(arg0, arg1, to_candid_AttendanceStatus_n90(this._uploadFile, this._downloadFile, arg2));
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markAttendance(arg0, arg1, to_candid_AttendanceStatus_n90(this._uploadFile, this._downloadFile, arg2));
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async markNotificationRead(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.markNotificationRead(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markNotificationRead(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async markReminderDone(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.markReminderDone(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markReminderDone(arg0);
      return result;
    }
  }
  async markUdharPaid(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.markUdharPaid(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markUdharPaid(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeStaff(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeStaff(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeStaff(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async setMonthlyBooking(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.setMonthlyBooking(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setMonthlyBooking(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async setMonthlyExpenses(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.setMonthlyExpenses(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setMonthlyExpenses(arg0, arg1, arg2);
      return result;
    }
  }
  async setSeatConfig(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.setSeatConfig(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setSeatConfig(arg0, arg1, arg2);
      return result;
    }
  }
  async startTrial() {
    if (this.processError) {
      try {
        const result = await this.actor.startTrial();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.startTrial();
      return result;
    }
  }
  async stripeWebhook(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.stripeWebhook(arg0, to_candid_PlanId_n1(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.stripeWebhook(arg0, to_candid_PlanId_n1(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async updateComplaintStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateComplaintStatus(arg0, to_candid_ComplaintStatus_n92(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateComplaintStatus(arg0, to_candid_ComplaintStatus_n92(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateHostelSettings(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateHostelSettings(arg0);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateHostelSettings(arg0);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateNote(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.updateNote(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateNote(arg0, arg1, arg2);
      return result;
    }
  }
  async updatePayment(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updatePayment(arg0, to_candid_PaymentInput_n13(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updatePayment(arg0, to_candid_PaymentInput_n13(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateReminder(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.updateReminder(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateReminder(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async updateRoom(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateRoom(arg0, arg1);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateRoom(arg0, arg1);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateStaff(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateStaff(arg0, arg1);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateStaff(arg0, arg1);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateStudent(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateStudent(arg0, to_candid_StudentInput_n19(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateStudent(arg0, to_candid_StudentInput_n19(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateStudentDocument(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateStudentDocument(arg0, arg1);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateStudentDocument(arg0, arg1);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateStudentPhoto(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateStudentPhoto(arg0, arg1);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateStudentPhoto(arg0, arg1);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateUdharEntry(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateUdharEntry(arg0, to_candid_UdharInput_n24(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateUdharEntry(arg0, to_candid_UdharInput_n24(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async vacateStudent(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.vacateStudent(arg0, arg1);
        return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.vacateStudent(arg0, arg1);
      return from_candid_variant_n4(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_AttendanceStatus_n32(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n33(_uploadFile, _downloadFile, value);
}
function from_candid_ComplaintStatus_n37(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n38(_uploadFile, _downloadFile, value);
}
function from_candid_Complaint_n35(_uploadFile, _downloadFile, value) {
  return from_candid_record_n36(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationType_n56(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n57(_uploadFile, _downloadFile, value);
}
function from_candid_Notification_n54(_uploadFile, _downloadFile, value) {
  return from_candid_record_n55(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentStatus_n62(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n63(_uploadFile, _downloadFile, value);
}
function from_candid_Payment_n60(_uploadFile, _downloadFile, value) {
  return from_candid_record_n61(_uploadFile, _downloadFile, value);
}
function from_candid_PlanId_n48(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n49(_uploadFile, _downloadFile, value);
}
function from_candid_RoomSummary_n67(_uploadFile, _downloadFile, value) {
  return from_candid_record_n68(_uploadFile, _downloadFile, value);
}
function from_candid_SeatType_n78(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n79(_uploadFile, _downloadFile, value);
}
function from_candid_StaffAttendance_n30(_uploadFile, _downloadFile, value) {
  return from_candid_record_n31(_uploadFile, _downloadFile, value);
}
function from_candid_StudentStatus_n74(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n75(_uploadFile, _downloadFile, value);
}
function from_candid_StudentSummary_n88(_uploadFile, _downloadFile, value) {
  return from_candid_record_n89(_uploadFile, _downloadFile, value);
}
function from_candid_Student_n72(_uploadFile, _downloadFile, value) {
  return from_candid_record_n73(_uploadFile, _downloadFile, value);
}
function from_candid_SubscriptionRecord_n43(_uploadFile, _downloadFile, value) {
  return from_candid_record_n44(_uploadFile, _downloadFile, value);
}
function from_candid_SubscriptionStatusResult_n51(_uploadFile, _downloadFile, value) {
  return from_candid_record_n52(_uploadFile, _downloadFile, value);
}
function from_candid_SubscriptionStatus_n45(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n46(_uploadFile, _downloadFile, value);
}
function from_candid_UdharCategory_n85(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n86(_uploadFile, _downloadFile, value);
}
function from_candid_UdharEntry_n83(_uploadFile, _downloadFile, value) {
  return from_candid_record_n84(_uploadFile, _downloadFile, value);
}
function from_candid_UdharSummary_n80(_uploadFile, _downloadFile, value) {
  return from_candid_record_n81(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n39(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n41(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n42(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_SubscriptionRecord_n43(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n47(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PlanId_n48(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n50(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n58(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n64(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n65(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n70(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n71(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Student_n72(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n76(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n77(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_SeatType_n78(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n31(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_AttendanceStatus_n32(_uploadFile, _downloadFile, value.status),
    staffId: value.staffId,
    date: value.date
  };
}
function from_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_ComplaintStatus_n37(_uploadFile, _downloadFile, value.status),
    studentId: record_opt_to_undefined(from_candid_opt_n39(_uploadFile, _downloadFile, value.studentId)),
    createdAt: value.createdAt,
    description: value.description,
    roomNumber: value.roomNumber,
    updatedAt: value.updatedAt
  };
}
function from_candid_record_n44(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_SubscriptionStatus_n45(_uploadFile, _downloadFile, value.status),
    planId: record_opt_to_undefined(from_candid_opt_n47(_uploadFile, _downloadFile, value.planId)),
    expiryDate: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.expiryDate)),
    userId: value.userId,
    trialStartDate: value.trialStartDate
  };
}
function from_candid_record_n52(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_SubscriptionStatus_n45(_uploadFile, _downloadFile, value.status),
    daysRemaining: value.daysRemaining
  };
}
function from_candid_record_n55(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    title: value.title,
    notifType: from_candid_NotificationType_n56(_uploadFile, _downloadFile, value.notifType),
    createdAt: value.createdAt,
    isRead: value.isRead,
    message: value.message,
    relatedId: record_opt_to_undefined(from_candid_opt_n58(_uploadFile, _downloadFile, value.relatedId))
  };
}
function from_candid_record_n61(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_PaymentStatus_n62(_uploadFile, _downloadFile, value.status),
    month: value.month,
    studentId: value.studentId,
    note: record_opt_to_undefined(from_candid_opt_n64(_uploadFile, _downloadFile, value.note)),
    createdAt: value.createdAt,
    year: value.year,
    dueDate: value.dueDate,
    lateFee: value.lateFee,
    paidDate: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.paidDate)),
    rentDue: value.rentDue,
    paidAmount: value.paidAmount
  };
}
function from_candid_record_n68(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_variant_n69(_uploadFile, _downloadFile, value.status),
    seatCount: value.seatCount,
    roomNumber: value.roomNumber,
    occupiedSeats: value.occupiedSeats
  };
}
function from_candid_record_n73(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_StudentStatus_n74(_uploadFile, _downloadFile, value.status),
    documentKey: record_opt_to_undefined(from_candid_opt_n64(_uploadFile, _downloadFile, value.documentKey)),
    joinDate: value.joinDate,
    name: value.name,
    createdAt: value.createdAt,
    photoKey: record_opt_to_undefined(from_candid_opt_n64(_uploadFile, _downloadFile, value.photoKey)),
    address: value.address,
    idProofText: value.idProofText,
    phone: value.phone,
    roomId: record_opt_to_undefined(from_candid_opt_n76(_uploadFile, _downloadFile, value.roomId)),
    leaveDate: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.leaveDate)),
    seatType: record_opt_to_undefined(from_candid_opt_n77(_uploadFile, _downloadFile, value.seatType))
  };
}
function from_candid_record_n81(_uploadFile, _downloadFile, value) {
  return {
    studentId: value.studentId,
    totalOutstanding: value.totalOutstanding,
    entries: from_candid_vec_n82(_uploadFile, _downloadFile, value.entries)
  };
}
function from_candid_record_n84(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    studentId: value.studentId,
    date: value.date,
    createdAt: value.createdAt,
    description: value.description,
    isPaid: value.isPaid,
    category: from_candid_UdharCategory_n85(_uploadFile, _downloadFile, value.category),
    amount: value.amount
  };
}
function from_candid_record_n89(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_StudentStatus_n74(_uploadFile, _downloadFile, value.status),
    joinDate: value.joinDate,
    name: value.name,
    roomNumber: record_opt_to_undefined(from_candid_opt_n64(_uploadFile, _downloadFile, value.roomNumber)),
    phone: value.phone,
    roomId: record_opt_to_undefined(from_candid_opt_n76(_uploadFile, _downloadFile, value.roomId)),
    leaveDate: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.leaveDate))
  };
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n17(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n28(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n3(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n33(_uploadFile, _downloadFile, value) {
  return "present" in value ? "present" : "absent" in value ? "absent" : value;
}
function from_candid_variant_n38(_uploadFile, _downloadFile, value) {
  return "resolved" in value ? "resolved" : "pending" in value ? "pending" : "inProgress" in value ? "inProgress" : value;
}
function from_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n46(_uploadFile, _downloadFile, value) {
  return "trial" in value ? "trial" : "active" in value ? "active" : "expired" in value ? "expired" : value;
}
function from_candid_variant_n49(_uploadFile, _downloadFile, value) {
  return "biannual" in value ? "biannual" : "annual" in value ? "annual" : "quarterly" in value ? "quarterly" : "monthly" in value ? "monthly" : value;
}
function from_candid_variant_n57(_uploadFile, _downloadFile, value) {
  return "emptyRoom" in value ? "emptyRoom" : "complaintUpdate" in value ? "complaintUpdate" : "paymentOverdue" in value ? "paymentOverdue" : "rentDue" in value ? "rentDue" : value;
}
function from_candid_variant_n63(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "paid" in value ? "paid" : "partial" in value ? "partial" : value;
}
function from_candid_variant_n69(_uploadFile, _downloadFile, value) {
  return "full" in value ? "full" : "empty" in value ? "empty" : "partial" in value ? "partial" : value;
}
function from_candid_variant_n7(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n75(_uploadFile, _downloadFile, value) {
  return "active" in value ? "active" : "vacated" in value ? "vacated" : value;
}
function from_candid_variant_n79(_uploadFile, _downloadFile, value) {
  return "typeA" in value ? "typeA" : "typeB" in value ? "typeB" : value;
}
function from_candid_variant_n86(_uploadFile, _downloadFile, value) {
  return "other" in value ? "other" : "milk" in value ? "milk" : "grocery" in value ? "grocery" : value;
}
function from_candid_vec_n29(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StaffAttendance_n30(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Complaint_n35(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n53(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Notification_n54(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n59(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Payment_n60(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n66(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_RoomSummary_n67(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n82(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_UdharEntry_n83(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n87(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StudentSummary_n88(_uploadFile, _downloadFile, x));
}
function to_candid_AttendanceStatus_n90(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n91(_uploadFile, _downloadFile, value);
}
function to_candid_ComplaintInput_n5(_uploadFile, _downloadFile, value) {
  return to_candid_record_n6(_uploadFile, _downloadFile, value);
}
function to_candid_ComplaintStatus_n92(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n93(_uploadFile, _downloadFile, value);
}
function to_candid_NotificationInput_n8(_uploadFile, _downloadFile, value) {
  return to_candid_record_n9(_uploadFile, _downloadFile, value);
}
function to_candid_NotificationType_n10(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n11(_uploadFile, _downloadFile, value);
}
function to_candid_PaymentInput_n13(_uploadFile, _downloadFile, value) {
  return to_candid_record_n14(_uploadFile, _downloadFile, value);
}
function to_candid_PaymentStatus_n15(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function to_candid_PlanId_n1(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function to_candid_SeatType_n21(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n22(_uploadFile, _downloadFile, value);
}
function to_candid_StudentInput_n19(_uploadFile, _downloadFile, value) {
  return to_candid_record_n20(_uploadFile, _downloadFile, value);
}
function to_candid_UdharCategory_n26(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n27(_uploadFile, _downloadFile, value);
}
function to_candid_UdharInput_n24(_uploadFile, _downloadFile, value) {
  return to_candid_record_n25(_uploadFile, _downloadFile, value);
}
function to_candid_record_n14(_uploadFile, _downloadFile, value) {
  return {
    status: to_candid_PaymentStatus_n15(_uploadFile, _downloadFile, value.status),
    month: value.month,
    studentId: value.studentId,
    note: value.note ? candid_some(value.note) : candid_none(),
    year: value.year,
    rentDue: value.rentDue,
    paidAmount: value.paidAmount
  };
}
function to_candid_record_n20(_uploadFile, _downloadFile, value) {
  return {
    joinDate: value.joinDate,
    name: value.name,
    address: value.address,
    idProofText: value.idProofText,
    phone: value.phone,
    roomId: value.roomId ? candid_some(value.roomId) : candid_none(),
    seatType: value.seatType ? candid_some(to_candid_SeatType_n21(_uploadFile, _downloadFile, value.seatType)) : candid_none()
  };
}
function to_candid_record_n25(_uploadFile, _downloadFile, value) {
  return {
    studentId: value.studentId,
    date: value.date,
    description: value.description,
    category: to_candid_UdharCategory_n26(_uploadFile, _downloadFile, value.category),
    amount: value.amount
  };
}
function to_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    studentId: value.studentId ? candid_some(value.studentId) : candid_none(),
    description: value.description,
    roomNumber: value.roomNumber
  };
}
function to_candid_record_n9(_uploadFile, _downloadFile, value) {
  return {
    title: value.title,
    notifType: to_candid_NotificationType_n10(_uploadFile, _downloadFile, value.notifType),
    message: value.message,
    relatedId: value.relatedId ? candid_some(value.relatedId) : candid_none()
  };
}
function to_candid_variant_n11(_uploadFile, _downloadFile, value) {
  return value == "emptyRoom" ? {
    emptyRoom: null
  } : value == "complaintUpdate" ? {
    complaintUpdate: null
  } : value == "paymentOverdue" ? {
    paymentOverdue: null
  } : value == "rentDue" ? {
    rentDue: null
  } : value;
}
function to_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return value == "pending" ? {
    pending: null
  } : value == "paid" ? {
    paid: null
  } : value == "partial" ? {
    partial: null
  } : value;
}
function to_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return value == "biannual" ? {
    biannual: null
  } : value == "annual" ? {
    annual: null
  } : value == "quarterly" ? {
    quarterly: null
  } : value == "monthly" ? {
    monthly: null
  } : value;
}
function to_candid_variant_n22(_uploadFile, _downloadFile, value) {
  return value == "typeA" ? {
    typeA: null
  } : value == "typeB" ? {
    typeB: null
  } : value;
}
function to_candid_variant_n27(_uploadFile, _downloadFile, value) {
  return value == "other" ? {
    other: null
  } : value == "milk" ? {
    milk: null
  } : value == "grocery" ? {
    grocery: null
  } : value;
}
function to_candid_variant_n91(_uploadFile, _downloadFile, value) {
  return value == "present" ? {
    present: null
  } : value == "absent" ? {
    absent: null
  } : value;
}
function to_candid_variant_n93(_uploadFile, _downloadFile, value) {
  return value == "resolved" ? {
    resolved: null
  } : value == "pending" ? {
    pending: null
  } : value == "inProgress" ? {
    inProgress: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
var jt = (n) => {
  switch (n) {
    case "success":
      return ee;
    case "info":
      return ae;
    case "warning":
      return oe;
    case "error":
      return se;
    default:
      return null;
  }
}, te = Array(12).fill(0), Yt = ({ visible: n, className: e }) => React2.createElement("div", { className: ["sonner-loading-wrapper", e].filter(Boolean).join(" "), "data-visible": n }, React2.createElement("div", { className: "sonner-spinner" }, te.map((t, a) => React2.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${a}` })))), ee = React2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, React2.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" })), oe = React2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", height: "20", width: "20" }, React2.createElement("path", { fillRule: "evenodd", d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z", clipRule: "evenodd" })), ae = React2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, React2.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" })), se = React2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, React2.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" })), Ot = React2.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }, React2.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), React2.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
var Ft = () => {
  let [n, e] = React2.useState(document.hidden);
  return React2.useEffect(() => {
    let t = () => {
      e(document.hidden);
    };
    return document.addEventListener("visibilitychange", t), () => window.removeEventListener("visibilitychange", t);
  }, []), n;
};
var bt = 1, yt = class {
  constructor() {
    this.subscribe = (e) => (this.subscribers.push(e), () => {
      let t = this.subscribers.indexOf(e);
      this.subscribers.splice(t, 1);
    });
    this.publish = (e) => {
      this.subscribers.forEach((t) => t(e));
    };
    this.addToast = (e) => {
      this.publish(e), this.toasts = [...this.toasts, e];
    };
    this.create = (e) => {
      var S;
      let { message: t, ...a } = e, u = typeof (e == null ? void 0 : e.id) == "number" || ((S = e.id) == null ? void 0 : S.length) > 0 ? e.id : bt++, f = this.toasts.find((g) => g.id === u), w = e.dismissible === void 0 ? true : e.dismissible;
      return this.dismissedToasts.has(u) && this.dismissedToasts.delete(u), f ? this.toasts = this.toasts.map((g) => g.id === u ? (this.publish({ ...g, ...e, id: u, title: t }), { ...g, ...e, id: u, dismissible: w, title: t }) : g) : this.addToast({ title: t, ...a, dismissible: w, id: u }), u;
    };
    this.dismiss = (e) => (this.dismissedToasts.add(e), e || this.toasts.forEach((t) => {
      this.subscribers.forEach((a) => a({ id: t.id, dismiss: true }));
    }), this.subscribers.forEach((t) => t({ id: e, dismiss: true })), e);
    this.message = (e, t) => this.create({ ...t, message: e });
    this.error = (e, t) => this.create({ ...t, message: e, type: "error" });
    this.success = (e, t) => this.create({ ...t, type: "success", message: e });
    this.info = (e, t) => this.create({ ...t, type: "info", message: e });
    this.warning = (e, t) => this.create({ ...t, type: "warning", message: e });
    this.loading = (e, t) => this.create({ ...t, type: "loading", message: e });
    this.promise = (e, t) => {
      if (!t) return;
      let a;
      t.loading !== void 0 && (a = this.create({ ...t, promise: e, type: "loading", message: t.loading, description: typeof t.description != "function" ? t.description : void 0 }));
      let u = e instanceof Promise ? e : e(), f = a !== void 0, w, S = u.then(async (i) => {
        if (w = ["resolve", i], React2.isValidElement(i)) f = false, this.create({ id: a, type: "default", message: i });
        else if (ie(i) && !i.ok) {
          f = false;
          let T = typeof t.error == "function" ? await t.error(`HTTP error! status: ${i.status}`) : t.error, F = typeof t.description == "function" ? await t.description(`HTTP error! status: ${i.status}`) : t.description;
          this.create({ id: a, type: "error", message: T, description: F });
        } else if (t.success !== void 0) {
          f = false;
          let T = typeof t.success == "function" ? await t.success(i) : t.success, F = typeof t.description == "function" ? await t.description(i) : t.description;
          this.create({ id: a, type: "success", message: T, description: F });
        }
      }).catch(async (i) => {
        if (w = ["reject", i], t.error !== void 0) {
          f = false;
          let D = typeof t.error == "function" ? await t.error(i) : t.error, T = typeof t.description == "function" ? await t.description(i) : t.description;
          this.create({ id: a, type: "error", message: D, description: T });
        }
      }).finally(() => {
        var i;
        f && (this.dismiss(a), a = void 0), (i = t.finally) == null || i.call(t);
      }), g = () => new Promise((i, D) => S.then(() => w[0] === "reject" ? D(w[1]) : i(w[1])).catch(D));
      return typeof a != "string" && typeof a != "number" ? { unwrap: g } : Object.assign(a, { unwrap: g });
    };
    this.custom = (e, t) => {
      let a = (t == null ? void 0 : t.id) || bt++;
      return this.create({ jsx: e(a), id: a, ...t }), a;
    };
    this.getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id));
    this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}, v = new yt(), ne = (n, e) => {
  let t = (e == null ? void 0 : e.id) || bt++;
  return v.addToast({ title: n, ...e, id: t }), t;
}, ie = (n) => n && typeof n == "object" && "ok" in n && typeof n.ok == "boolean" && "status" in n && typeof n.status == "number", le = ne, ce = () => v.toasts, de = () => v.getActiveToasts(), ue = Object.assign(le, { success: v.success, info: v.info, warning: v.warning, error: v.error, custom: v.custom, message: v.message, promise: v.promise, dismiss: v.dismiss, loading: v.loading }, { getHistory: ce, getToasts: de });
function wt(n, { insertAt: e } = {}) {
  if (typeof document == "undefined") return;
  let t = document.head || document.getElementsByTagName("head")[0], a = document.createElement("style");
  a.type = "text/css", e === "top" && t.firstChild ? t.insertBefore(a, t.firstChild) : t.appendChild(a), a.styleSheet ? a.styleSheet.cssText = n : a.appendChild(document.createTextNode(n));
}
wt(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);
function tt(n) {
  return n.label !== void 0;
}
var pe = 3, me = "32px", ge = "16px", Wt = 4e3, he = 356, be = 14, ye = 20, we = 200;
function M(...n) {
  return n.filter(Boolean).join(" ");
}
function xe(n) {
  let [e, t] = n.split("-"), a = [];
  return e && a.push(e), t && a.push(t), a;
}
var ve = (n) => {
  var Dt, Pt, Nt, Bt, Ct, kt, It, Mt, Ht, At, Lt;
  let { invert: e, toast: t, unstyled: a, interacting: u, setHeights: f, visibleToasts: w, heights: S, index: g, toasts: i, expanded: D, removeToast: T, defaultRichColors: F, closeButton: et, style: ut, cancelButtonStyle: ft, actionButtonStyle: l, className: ot = "", descriptionClassName: at = "", duration: X2, position: st, gap: pt, loadingIcon: rt, expandByDefault: B, classNames: s, icons: P, closeButtonAriaLabel: nt = "Close toast", pauseWhenPageIsHidden: it } = n, [Y, C] = React2.useState(null), [lt, J] = React2.useState(null), [W, H] = React2.useState(false), [A, mt] = React2.useState(false), [L, z] = React2.useState(false), [ct, d] = React2.useState(false), [h, y] = React2.useState(false), [R, j] = React2.useState(0), [p, _] = React2.useState(0), O = React2.useRef(t.duration || X2 || Wt), G = React2.useRef(null), k = React2.useRef(null), Vt = g === 0, Ut = g + 1 <= w, N = t.type, V = t.dismissible !== false, Kt = t.className || "", Xt = t.descriptionClassName || "", dt = React2.useMemo(() => S.findIndex((r) => r.toastId === t.id) || 0, [S, t.id]), Jt = React2.useMemo(() => {
    var r;
    return (r = t.closeButton) != null ? r : et;
  }, [t.closeButton, et]), Tt = React2.useMemo(() => t.duration || X2 || Wt, [t.duration, X2]), gt = React2.useRef(0), U = React2.useRef(0), St = React2.useRef(0), K = React2.useRef(null), [Gt, Qt] = st.split("-"), Rt = React2.useMemo(() => S.reduce((r, m, c) => c >= dt ? r : r + m.height, 0), [S, dt]), Et = Ft(), qt = t.invert || e, ht = N === "loading";
  U.current = React2.useMemo(() => dt * pt + Rt, [dt, Rt]), React2.useEffect(() => {
    O.current = Tt;
  }, [Tt]), React2.useEffect(() => {
    H(true);
  }, []), React2.useEffect(() => {
    let r = k.current;
    if (r) {
      let m = r.getBoundingClientRect().height;
      return _(m), f((c) => [{ toastId: t.id, height: m, position: t.position }, ...c]), () => f((c) => c.filter((b) => b.toastId !== t.id));
    }
  }, [f, t.id]), React2.useLayoutEffect(() => {
    if (!W) return;
    let r = k.current, m = r.style.height;
    r.style.height = "auto";
    let c = r.getBoundingClientRect().height;
    r.style.height = m, _(c), f((b) => b.find((x) => x.toastId === t.id) ? b.map((x) => x.toastId === t.id ? { ...x, height: c } : x) : [{ toastId: t.id, height: c, position: t.position }, ...b]);
  }, [W, t.title, t.description, f, t.id]);
  let $ = React2.useCallback(() => {
    mt(true), j(U.current), f((r) => r.filter((m) => m.toastId !== t.id)), setTimeout(() => {
      T(t);
    }, we);
  }, [t, T, f, U]);
  React2.useEffect(() => {
    if (t.promise && N === "loading" || t.duration === 1 / 0 || t.type === "loading") return;
    let r;
    return D || u || it && Et ? (() => {
      if (St.current < gt.current) {
        let b = (/* @__PURE__ */ new Date()).getTime() - gt.current;
        O.current = O.current - b;
      }
      St.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      O.current !== 1 / 0 && (gt.current = (/* @__PURE__ */ new Date()).getTime(), r = setTimeout(() => {
        var b;
        (b = t.onAutoClose) == null || b.call(t, t), $();
      }, O.current));
    })(), () => clearTimeout(r);
  }, [D, u, t, N, it, Et, $]), React2.useEffect(() => {
    t.delete && $();
  }, [$, t.delete]);
  function Zt() {
    var r, m, c;
    return P != null && P.loading ? React2.createElement("div", { className: M(s == null ? void 0 : s.loader, (r = t == null ? void 0 : t.classNames) == null ? void 0 : r.loader, "sonner-loader"), "data-visible": N === "loading" }, P.loading) : rt ? React2.createElement("div", { className: M(s == null ? void 0 : s.loader, (m = t == null ? void 0 : t.classNames) == null ? void 0 : m.loader, "sonner-loader"), "data-visible": N === "loading" }, rt) : React2.createElement(Yt, { className: M(s == null ? void 0 : s.loader, (c = t == null ? void 0 : t.classNames) == null ? void 0 : c.loader), visible: N === "loading" });
  }
  return React2.createElement("li", { tabIndex: 0, ref: k, className: M(ot, Kt, s == null ? void 0 : s.toast, (Dt = t == null ? void 0 : t.classNames) == null ? void 0 : Dt.toast, s == null ? void 0 : s.default, s == null ? void 0 : s[N], (Pt = t == null ? void 0 : t.classNames) == null ? void 0 : Pt[N]), "data-sonner-toast": "", "data-rich-colors": (Nt = t.richColors) != null ? Nt : F, "data-styled": !(t.jsx || t.unstyled || a), "data-mounted": W, "data-promise": !!t.promise, "data-swiped": h, "data-removed": A, "data-visible": Ut, "data-y-position": Gt, "data-x-position": Qt, "data-index": g, "data-front": Vt, "data-swiping": L, "data-dismissible": V, "data-type": N, "data-invert": qt, "data-swipe-out": ct, "data-swipe-direction": lt, "data-expanded": !!(D || B && W), style: { "--index": g, "--toasts-before": g, "--z-index": i.length - g, "--offset": `${A ? R : U.current}px`, "--initial-height": B ? "auto" : `${p}px`, ...ut, ...t.style }, onDragEnd: () => {
    z(false), C(null), K.current = null;
  }, onPointerDown: (r) => {
    ht || !V || (G.current = /* @__PURE__ */ new Date(), j(U.current), r.target.setPointerCapture(r.pointerId), r.target.tagName !== "BUTTON" && (z(true), K.current = { x: r.clientX, y: r.clientY }));
  }, onPointerUp: () => {
    var x, Q, q, Z;
    if (ct || !V) return;
    K.current = null;
    let r = Number(((x = k.current) == null ? void 0 : x.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), m = Number(((Q = k.current) == null ? void 0 : Q.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), c = (/* @__PURE__ */ new Date()).getTime() - ((q = G.current) == null ? void 0 : q.getTime()), b = Y === "x" ? r : m, I = Math.abs(b) / c;
    if (Math.abs(b) >= ye || I > 0.11) {
      j(U.current), (Z = t.onDismiss) == null || Z.call(t, t), J(Y === "x" ? r > 0 ? "right" : "left" : m > 0 ? "down" : "up"), $(), d(true), y(false);
      return;
    }
    z(false), C(null);
  }, onPointerMove: (r) => {
    var Q, q, Z, zt;
    if (!K.current || !V || ((Q = window.getSelection()) == null ? void 0 : Q.toString().length) > 0) return;
    let c = r.clientY - K.current.y, b = r.clientX - K.current.x, I = (q = n.swipeDirections) != null ? q : xe(st);
    !Y && (Math.abs(b) > 1 || Math.abs(c) > 1) && C(Math.abs(b) > Math.abs(c) ? "x" : "y");
    let x = { x: 0, y: 0 };
    Y === "y" ? (I.includes("top") || I.includes("bottom")) && (I.includes("top") && c < 0 || I.includes("bottom") && c > 0) && (x.y = c) : Y === "x" && (I.includes("left") || I.includes("right")) && (I.includes("left") && b < 0 || I.includes("right") && b > 0) && (x.x = b), (Math.abs(x.x) > 0 || Math.abs(x.y) > 0) && y(true), (Z = k.current) == null || Z.style.setProperty("--swipe-amount-x", `${x.x}px`), (zt = k.current) == null || zt.style.setProperty("--swipe-amount-y", `${x.y}px`);
  } }, Jt && !t.jsx ? React2.createElement("button", { "aria-label": nt, "data-disabled": ht, "data-close-button": true, onClick: ht || !V ? () => {
  } : () => {
    var r;
    $(), (r = t.onDismiss) == null || r.call(t, t);
  }, className: M(s == null ? void 0 : s.closeButton, (Bt = t == null ? void 0 : t.classNames) == null ? void 0 : Bt.closeButton) }, (Ct = P == null ? void 0 : P.close) != null ? Ct : Ot) : null, t.jsx || reactExports.isValidElement(t.title) ? t.jsx ? t.jsx : typeof t.title == "function" ? t.title() : t.title : React2.createElement(React2.Fragment, null, N || t.icon || t.promise ? React2.createElement("div", { "data-icon": "", className: M(s == null ? void 0 : s.icon, (kt = t == null ? void 0 : t.classNames) == null ? void 0 : kt.icon) }, t.promise || t.type === "loading" && !t.icon ? t.icon || Zt() : null, t.type !== "loading" ? t.icon || (P == null ? void 0 : P[N]) || jt(N) : null) : null, React2.createElement("div", { "data-content": "", className: M(s == null ? void 0 : s.content, (It = t == null ? void 0 : t.classNames) == null ? void 0 : It.content) }, React2.createElement("div", { "data-title": "", className: M(s == null ? void 0 : s.title, (Mt = t == null ? void 0 : t.classNames) == null ? void 0 : Mt.title) }, typeof t.title == "function" ? t.title() : t.title), t.description ? React2.createElement("div", { "data-description": "", className: M(at, Xt, s == null ? void 0 : s.description, (Ht = t == null ? void 0 : t.classNames) == null ? void 0 : Ht.description) }, typeof t.description == "function" ? t.description() : t.description) : null), reactExports.isValidElement(t.cancel) ? t.cancel : t.cancel && tt(t.cancel) ? React2.createElement("button", { "data-button": true, "data-cancel": true, style: t.cancelButtonStyle || ft, onClick: (r) => {
    var m, c;
    tt(t.cancel) && V && ((c = (m = t.cancel).onClick) == null || c.call(m, r), $());
  }, className: M(s == null ? void 0 : s.cancelButton, (At = t == null ? void 0 : t.classNames) == null ? void 0 : At.cancelButton) }, t.cancel.label) : null, reactExports.isValidElement(t.action) ? t.action : t.action && tt(t.action) ? React2.createElement("button", { "data-button": true, "data-action": true, style: t.actionButtonStyle || l, onClick: (r) => {
    var m, c;
    tt(t.action) && ((c = (m = t.action).onClick) == null || c.call(m, r), !r.defaultPrevented && $());
  }, className: M(s == null ? void 0 : s.actionButton, (Lt = t == null ? void 0 : t.classNames) == null ? void 0 : Lt.actionButton) }, t.action.label) : null));
};
function _t() {
  if (typeof window == "undefined" || typeof document == "undefined") return "ltr";
  let n = document.documentElement.getAttribute("dir");
  return n === "auto" || !n ? window.getComputedStyle(document.documentElement).direction : n;
}
function Te(n, e) {
  let t = {};
  return [n, e].forEach((a, u) => {
    let f = u === 1, w = f ? "--mobile-offset" : "--offset", S = f ? ge : me;
    function g(i) {
      ["top", "right", "bottom", "left"].forEach((D) => {
        t[`${w}-${D}`] = typeof i == "number" ? `${i}px` : i;
      });
    }
    typeof a == "number" || typeof a == "string" ? g(a) : typeof a == "object" ? ["top", "right", "bottom", "left"].forEach((i) => {
      a[i] === void 0 ? t[`${w}-${i}`] = S : t[`${w}-${i}`] = typeof a[i] == "number" ? `${a[i]}px` : a[i];
    }) : g(S);
  }), t;
}
reactExports.forwardRef(function(e, t) {
  let { invert: a, position: u = "bottom-right", hotkey: f = ["altKey", "KeyT"], expand: w, closeButton: S, className: g, offset: i, mobileOffset: D, theme: T = "light", richColors: F, duration: et, style: ut, visibleToasts: ft = pe, toastOptions: l, dir: ot = _t(), gap: at = be, loadingIcon: X2, icons: st, containerAriaLabel: pt = "Notifications", pauseWhenPageIsHidden: rt } = e, [B, s] = React2.useState([]), P = React2.useMemo(() => Array.from(new Set([u].concat(B.filter((d) => d.position).map((d) => d.position)))), [B, u]), [nt, it] = React2.useState([]), [Y, C] = React2.useState(false), [lt, J] = React2.useState(false), [W, H] = React2.useState(T !== "system" ? T : typeof window != "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), A = React2.useRef(null), mt = f.join("+").replace(/Key/g, "").replace(/Digit/g, ""), L = React2.useRef(null), z = React2.useRef(false), ct = React2.useCallback((d) => {
    s((h) => {
      var y;
      return (y = h.find((R) => R.id === d.id)) != null && y.delete || v.dismiss(d.id), h.filter(({ id: R }) => R !== d.id);
    });
  }, []);
  return React2.useEffect(() => v.subscribe((d) => {
    if (d.dismiss) {
      s((h) => h.map((y) => y.id === d.id ? { ...y, delete: true } : y));
      return;
    }
    setTimeout(() => {
      ReactDOM.flushSync(() => {
        s((h) => {
          let y = h.findIndex((R) => R.id === d.id);
          return y !== -1 ? [...h.slice(0, y), { ...h[y], ...d }, ...h.slice(y + 1)] : [d, ...h];
        });
      });
    });
  }), []), React2.useEffect(() => {
    if (T !== "system") {
      H(T);
      return;
    }
    if (T === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? H("dark") : H("light")), typeof window == "undefined") return;
    let d = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      d.addEventListener("change", ({ matches: h }) => {
        H(h ? "dark" : "light");
      });
    } catch (h) {
      d.addListener(({ matches: y }) => {
        try {
          H(y ? "dark" : "light");
        } catch (R) {
          console.error(R);
        }
      });
    }
  }, [T]), React2.useEffect(() => {
    B.length <= 1 && C(false);
  }, [B]), React2.useEffect(() => {
    let d = (h) => {
      var R, j;
      f.every((p) => h[p] || h.code === p) && (C(true), (R = A.current) == null || R.focus()), h.code === "Escape" && (document.activeElement === A.current || (j = A.current) != null && j.contains(document.activeElement)) && C(false);
    };
    return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
  }, [f]), React2.useEffect(() => {
    if (A.current) return () => {
      L.current && (L.current.focus({ preventScroll: true }), L.current = null, z.current = false);
    };
  }, [A.current]), React2.createElement("section", { ref: t, "aria-label": `${pt} ${mt}`, tabIndex: -1, "aria-live": "polite", "aria-relevant": "additions text", "aria-atomic": "false", suppressHydrationWarning: true }, P.map((d, h) => {
    var j;
    let [y, R] = d.split("-");
    return B.length ? React2.createElement("ol", { key: d, dir: ot === "auto" ? _t() : ot, tabIndex: -1, ref: A, className: g, "data-sonner-toaster": true, "data-theme": W, "data-y-position": y, "data-lifted": Y && B.length > 1 && !w, "data-x-position": R, style: { "--front-toast-height": `${((j = nt[0]) == null ? void 0 : j.height) || 0}px`, "--width": `${he}px`, "--gap": `${at}px`, ...ut, ...Te(i, D) }, onBlur: (p) => {
      z.current && !p.currentTarget.contains(p.relatedTarget) && (z.current = false, L.current && (L.current.focus({ preventScroll: true }), L.current = null));
    }, onFocus: (p) => {
      p.target instanceof HTMLElement && p.target.dataset.dismissible === "false" || z.current || (z.current = true, L.current = p.relatedTarget);
    }, onMouseEnter: () => C(true), onMouseMove: () => C(true), onMouseLeave: () => {
      lt || C(false);
    }, onDragEnd: () => C(false), onPointerDown: (p) => {
      p.target instanceof HTMLElement && p.target.dataset.dismissible === "false" || J(true);
    }, onPointerUp: () => J(false) }, B.filter((p) => !p.position && h === 0 || p.position === d).map((p, _) => {
      var O, G;
      return React2.createElement(ve, { key: p.id, icons: st, index: _, toast: p, defaultRichColors: F, duration: (O = l == null ? void 0 : l.duration) != null ? O : et, className: l == null ? void 0 : l.className, descriptionClassName: l == null ? void 0 : l.descriptionClassName, invert: a, visibleToasts: ft, closeButton: (G = l == null ? void 0 : l.closeButton) != null ? G : S, interacting: lt, position: d, style: l == null ? void 0 : l.style, unstyled: l == null ? void 0 : l.unstyled, classNames: l == null ? void 0 : l.classNames, cancelButtonStyle: l == null ? void 0 : l.cancelButtonStyle, actionButtonStyle: l == null ? void 0 : l.actionButtonStyle, removeToast: ct, toasts: B.filter((k) => k.position == p.position), heights: nt.filter((k) => k.position == p.position), setHeights: it, expandByDefault: w, gap: at, loadingIcon: X2, expanded: Y, pauseWhenPageIsHidden: rt, swipeDirections: e.swipeDirections });
    })) : null;
  }));
});
function useSeatConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["seatConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSeatConfig();
    },
    enabled: !!actor && !isFetching
  });
}
function useSetSeatConfig() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      totalCapacity,
      pricePerSeatA,
      pricePerSeatB
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.setSeatConfig(totalCapacity, pricePerSeatA, pricePerSeatB);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seatConfig"] });
      qc.invalidateQueries({ queryKey: ["seatSummary"] });
      ue.success("Seat configuration saved");
    },
    onError: () => ue.error("Failed to save seat config")
  });
}
function useSeatSummary(year, month) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["seatSummary", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthSeatSummary(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching
  });
}
function useSetMonthlyBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      year,
      month,
      bookedSeatsA,
      bookedSeatsB
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.setMonthlyBooking(
        BigInt(year),
        BigInt(month),
        bookedSeatsA,
        bookedSeatsB
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["seatSummary", vars.year, vars.month]
      });
      qc.invalidateQueries({
        queryKey: ["monthlyProfit", vars.year, vars.month]
      });
      ue.success("Booking updated");
    },
    onError: () => ue.error("Failed to update booking")
  });
}
function useMonthlyExpenses(year, month) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["monthlyExpenses", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyExpenses(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching
  });
}
function useSetMonthlyExpenses() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      year,
      month,
      input
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.setMonthlyExpenses(BigInt(year), BigInt(month), input);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["monthlyExpenses", vars.year, vars.month]
      });
      qc.invalidateQueries({
        queryKey: ["monthlyProfit", vars.year, vars.month]
      });
      ue.success("Expenses saved");
    },
    onError: () => ue.error("Failed to save expenses")
  });
}
function useMonthlyProfit(year, month) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["monthlyProfit", year, month],
    queryFn: async () => {
      if (!actor) {
        return {
          year: BigInt(year),
          month: BigInt(month),
          revenue: 0n,
          totalExpenses: 0n,
          profit: 0n
        };
      }
      return actor.getMonthlyProfit(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching
  });
}
function useYearlyProfitChart(year) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["yearlyProfitChart", year],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getYearlyProfitChart(BigInt(year));
    },
    enabled: !!actor && !isFetching
  });
}
function useMySubscription() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMySubscription();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6e4
  });
}
function useStartTrial() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.startTrial();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mySubscription"] });
    }
  });
}
function useActivateSubscription() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId) => {
      if (!actor) throw new Error("No actor");
      await actor.activateSubscription(planId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mySubscription"] });
      ue.success("Subscription activated!");
    },
    onError: () => ue.error("Failed to activate subscription")
  });
}
function useReminders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReminders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 6e4
  });
}
function useAddReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      message,
      remindAt
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createReminder(title, message, remindAt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      ue.success("Reminder added");
    },
    onError: () => ue.error("Failed to add reminder")
  });
}
function useUpdateReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      message,
      remindAt
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateReminder(id, title, message, remindAt);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      ue.success("Reminder updated");
    },
    onError: () => ue.error("Failed to update reminder")
  });
}
function useDeleteReminder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteReminder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      ue.success("Reminder deleted");
    },
    onError: () => ue.error("Failed to delete reminder")
  });
}
function useMarkReminderDone() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.markReminderDone(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      ue.success("Reminder marked as done");
    },
    onError: () => ue.error("Failed to update reminder")
  });
}
function useNotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddNote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createNote(title, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      ue.success("Note added");
    },
    onError: () => ue.error("Failed to add note")
  });
}
function useUpdateNote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNote(id, title, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      ue.success("Note saved");
    },
    onError: () => ue.error("Failed to update note")
  });
}
function useDeleteNote() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      ue.success("Note deleted");
    },
    onError: () => ue.error("Failed to delete note")
  });
}
function useGetBuildingStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["buildingStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBuildingStats();
    },
    enabled: !!actor && !isFetching
  });
}
function useRooms() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRooms();
    },
    enabled: !!actor && !isFetching
  });
}
function useRoom(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["room", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRoom(id);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateRoom() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createRoom(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      ue.success("Room created");
    },
    onError: (e) => ue.error(e.message || "Failed to create room")
  });
}
function useUpdateRoom() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
      // occupiedSeats is accepted for UI consistency but backend derives it from student assignments
      occupiedSeats: _occupiedSeats
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateRoom(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      qc.invalidateQueries({ queryKey: ["room", vars.id.toString()] });
      ue.success("Room updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update room")
  });
}
function useDeleteRoom() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteRoom(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      ue.success("Room deleted");
    },
    onError: (e) => ue.error(e.message || "Failed to delete room")
  });
}
function useStudents() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudents();
    },
    enabled: !!actor && !isFetching
  });
}
function useStudent(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createStudent(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      ue.success("Student added");
    },
    onError: (e) => ue.error(e.message || "Failed to add student")
  });
}
function useUpdateStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStudent(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      ue.success("Student updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update student")
  });
}
function useVacateStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      leaveDate
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.vacateStudent(id, leaveDate);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      ue.success("Student vacated");
    },
    onError: (e) => ue.error(e.message || "Failed to vacate student")
  });
}
function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteStudent(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      ue.success("Student deleted");
    },
    onError: (e) => ue.error(e.message || "Failed to delete student")
  });
}
function useUpdateStudentPhoto() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      photoKey
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStudentPhoto(id, photoKey);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      ue.success("Photo updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update photo")
  });
}
function useUpdateStudentDocument() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      documentKey
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateStudentDocument(id, documentKey);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["student", vars.id.toString()] });
      ue.success("Document updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update document")
  });
}
function usePayments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPayments();
    },
    enabled: !!actor && !isFetching
  });
}
function useStudentPayments(studentId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["studentPayments", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentPayments(studentId);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreatePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createPayment(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["studentPayments"] });
      ue.success("Payment recorded");
    },
    onError: (e) => ue.error(e.message || "Failed to record payment")
  });
}
function useUpdatePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updatePayment(id, input);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["studentPayments"] });
      ue.success("Payment updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update payment")
  });
}
function useDeletePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deletePayment(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["studentPayments"] });
      ue.success("Payment deleted");
    },
    onError: (e) => ue.error(e.message || "Failed to delete payment")
  });
}
function useHostelSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["hostelSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHostelSettings();
    },
    enabled: !!actor && !isFetching
  });
}
function useUpdateHostelSettings() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateHostelSettings(settings);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hostelSettings"] });
      ue.success("Settings updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update settings")
  });
}
function useUdharEntries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["udharEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUdharEntries();
    },
    enabled: !!actor && !isFetching
  });
}
function useStudentUdhar(studentId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["studentUdhar", studentId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudentUdhar(studentId);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateUdharEntry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createUdharEntry(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      ue.success("Udhar entry added");
    },
    onError: (e) => ue.error(e.message || "Failed to add udhar entry")
  });
}
function useMarkUdharPaid() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markUdharPaid(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      ue.success("Marked as paid");
    },
    onError: (e) => ue.error(e.message || "Failed to mark paid")
  });
}
function useDeleteUdharEntry() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteUdharEntry(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["udharEntries"] });
      qc.invalidateQueries({ queryKey: ["studentUdhar"] });
      ue.success("Udhar entry deleted");
    },
    onError: (e) => ue.error(e.message || "Failed to delete udhar entry")
  });
}
function useComplaints() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComplaints();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateComplaint() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.createComplaint(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      ue.success("Complaint filed");
    },
    onError: (e) => ue.error(e.message || "Failed to file complaint")
  });
}
function useUpdateComplaintStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.updateComplaintStatus(id, status);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      ue.success("Complaint status updated");
    },
    onError: (e) => ue.error(e.message || "Failed to update status")
  });
}
function useDeleteComplaint() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.deleteComplaint(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      ue.success("Complaint deleted");
    },
    onError: (e) => ue.error(e.message || "Failed to delete complaint")
  });
}
function useNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function useUnreadCount() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUnreadCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function useMarkNotificationRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markNotificationRead(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => ue.error("Failed to mark notification read")
  });
}
function useMarkAllNotificationsRead() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markAllNotificationsRead();
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: () => ue.error("Failed to mark all read")
  });
}
function useClearAllNotifications() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const result = await actor.clearAllNotifications();
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
      ue.success("All notifications cleared");
    },
    onError: () => ue.error("Failed to clear notifications")
  });
}
function useStaff() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaff();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.addStaff(input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["monthlyStaffExpense"] });
      ue.success("Staff member added");
    },
    onError: (e) => ue.error(e.message || "Failed to add staff")
  });
}
function useRemoveStaff() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.removeStaff(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["monthlyStaffExpense"] });
      ue.success("Staff member removed");
    },
    onError: (e) => ue.error(e.message || "Failed to remove staff")
  });
}
function useMarkAttendance() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      date,
      status
    }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.markAttendance(staffId, date, status);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, vars) => {
      const [year, month] = vars.date.split("-").map(Number);
      qc.invalidateQueries({
        queryKey: ["staffAttendance", vars.staffId.toString()]
      });
      qc.invalidateQueries({ queryKey: ["attendanceByMonth", year, month] });
      qc.invalidateQueries({ queryKey: ["monthlyStaffExpense", year, month] });
      qc.invalidateQueries({ queryKey: ["staffSalaryReport", year, month] });
    },
    onError: (e) => ue.error(e.message || "Failed to mark attendance")
  });
}
function useAttendanceByMonth(year, month) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["attendanceByMonth", year, month],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendanceByMonth(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching
  });
}
function useStaffSalaryReport(year, month) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["staffSalaryReport", year, month],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStaffSalaryReport(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !isFetching
  });
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive$1.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root$1 = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$1,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const en = {
  dashboard: "Dashboard",
  rooms: "Rooms",
  students: "Students",
  payments: "Payments",
  expenses: "Expenses",
  notes: "Notes",
  reminders: "Reminders",
  chart: "Yearly Chart",
  subscription: "Subscription",
  settings: "Settings",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  search: "Search",
  filter: "Filter",
  name: "Name",
  phone: "Phone",
  address: "Address",
  room: "Room",
  bed: "Bed",
  status: "Status",
  date: "Date",
  amount: "Amount",
  paid: "Paid",
  pending: "Pending",
  partial: "Partial",
  overdue: "Overdue",
  empty: "Empty",
  full: "Full",
  partialRoom: "Partial",
  complaint: "Complaint",
  description: "Description",
  resolved: "Resolved",
  inProgress: "In Progress",
  category: "Category",
  total: "Total",
  outstanding: "Outstanding",
  loading: "Loading…",
  noData: "No data found",
  error: "Something went wrong",
  udhar: "Udhar",
  complaints: "Complaints",
  addRoom: "Add Room",
  addStudent: "Add Student",
  addPayment: "Add Payment",
  addUdhar: "Add Udhar",
  addComplaint: "Add Complaint",
  roomNumber: "Room Number",
  bedId: "Bed",
  joinDate: "Join Date",
  leaveDate: "Leave Date",
  idProof: "ID Proof",
  seatType: "Seat Type",
  rentDue: "Rent Due",
  paidAmount: "Paid Amount",
  lateFee: "Late Fee",
  dueDate: "Due Date",
  student: "Student",
  month: "Month",
  year: "Year",
  note: "Note",
  markPaid: "Mark Paid",
  vacate: "Vacate",
  active: "Active",
  vacated: "Vacated",
  occupied: "Occupied",
  typeA: "Type A (₹8,500)",
  typeB: "Type B (₹8,900)",
  milk: "Milk",
  grocery: "Grocery",
  other: "Other",
  pending_complaint: "Pending",
  notifications: "Notifications",
  markAllRead: "Mark all read",
  clearAll: "Clear all",
  noNotifications: "No notifications"
};
const hi = {
  dashboard: "डैशबोर्ड",
  rooms: "कमरे",
  students: "छात्र",
  payments: "भुगतान",
  expenses: "खर्च",
  notes: "नोट्स",
  reminders: "रिमाइंडर",
  chart: "वार्षिक चार्ट",
  subscription: "सब्सक्रिप्शन",
  settings: "सेटिंग्स",
  add: "जोड़ें",
  edit: "संपादित करें",
  delete: "हटाएं",
  save: "सहेजें",
  cancel: "रद्द करें",
  search: "खोजें",
  filter: "फ़िल्टर",
  name: "नाम",
  phone: "फोन",
  address: "पता",
  room: "कमरा",
  bed: "बिस्तर",
  status: "स्थिति",
  date: "तारीख",
  amount: "राशि",
  paid: "भुगतान हो गया",
  pending: "लंबित",
  partial: "आंशिक",
  overdue: "बकाया",
  empty: "खाली",
  full: "भरा हुआ",
  partialRoom: "आंशिक",
  complaint: "शिकायत",
  description: "विवरण",
  resolved: "हल हो गया",
  inProgress: "प्रगति में",
  category: "श्रेणी",
  total: "कुल",
  outstanding: "बकाया",
  loading: "लोड हो रहा है…",
  noData: "कोई डेटा नहीं मिला",
  error: "कुछ गलत हो गया",
  udhar: "उधार",
  complaints: "शिकायतें",
  addRoom: "कमरा जोड़ें",
  addStudent: "छात्र जोड़ें",
  addPayment: "भुगतान जोड़ें",
  addUdhar: "उधार जोड़ें",
  addComplaint: "शिकायत जोड़ें",
  roomNumber: "कमरा नंबर",
  bedId: "बिस्तर",
  joinDate: "शामिल होने की तारीख",
  leaveDate: "छोड़ने की तारीख",
  idProof: "पहचान प्रमाण",
  seatType: "सीट प्रकार",
  rentDue: "किराया बकाया",
  paidAmount: "भुगतान राशि",
  lateFee: "विलंब शुल्क",
  dueDate: "देय तारीख",
  student: "छात्र",
  month: "महीना",
  year: "वर्ष",
  note: "नोट",
  markPaid: "भुगतान चिह्नित करें",
  vacate: "खाली करें",
  active: "सक्रिय",
  vacated: "खाली",
  occupied: "अधिकृत",
  typeA: "टाइप A (₹8,500)",
  typeB: "टाइप B (₹8,900)",
  milk: "दूध",
  grocery: "किराना",
  other: "अन्य",
  pending_complaint: "लंबित",
  notifications: "सूचनाएं",
  markAllRead: "सभी पढ़ी हुई चिह्नित करें",
  clearAll: "सब साफ करें",
  noNotifications: "कोई सूचना नहीं"
};
const STORAGE_KEY = "hostel-lang";
function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "hi") return stored;
  } catch {
  }
  return "en";
}
function useLanguage() {
  const [language, setLanguageState] = reactExports.useState(getInitialLanguage);
  const setLanguage = reactExports.useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
    }
  }, []);
  const t = reactExports.useCallback(
    (key) => {
      const map = language === "hi" ? hi : en;
      return map[key] ?? key;
    },
    [language]
  );
  return { language, setLanguage, t };
}
function useSubscription() {
  const { data: sub, isLoading } = useMySubscription();
  const startTrial = useStartTrial();
  reactExports.useEffect(() => {
    if (!isLoading && sub === null && !startTrial.isPending && !startTrial.isSuccess) {
      startTrial.mutate();
    }
  }, [isLoading, sub, startTrial]);
  if (isLoading || sub === void 0) {
    return {
      status: "unknown",
      daysRemaining: 0,
      isLoading: true,
      isPremium: false,
      isTrial: false,
      isExpired: false
    };
  }
  if (!sub) {
    return {
      status: "trial",
      daysRemaining: 7,
      isLoading: false,
      isPremium: true,
      isTrial: true,
      isExpired: false
    };
  }
  const now = Date.now();
  const expiryDate = sub.expiryDate ? Number(sub.expiryDate) / 1e6 : null;
  const trialEnd = Number(sub.trialStartDate) / 1e6 + 7 * 24 * 60 * 60 * 1e3;
  let daysRemaining = 0;
  if (sub.status === SubscriptionStatus.trial) {
    daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1e3))
    );
  } else if (sub.status === SubscriptionStatus.active && expiryDate) {
    daysRemaining = Math.max(
      0,
      Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1e3))
    );
  }
  const status = sub.status === SubscriptionStatus.trial ? "trial" : sub.status === SubscriptionStatus.active ? "active" : "expired";
  return {
    status,
    daysRemaining,
    isLoading: false,
    isPremium: status === "trial" || status === "active",
    isTrial: status === "trial",
    isExpired: status === "expired"
  };
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef$1(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
  const Slottable2 = ({ children }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  };
  Slottable2.displayName = `${ownerName}.Slottable`;
  Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable2;
}
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef$1(element) {
  var _a2, _b2;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot2 = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot2 : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) reactDomExports.flushSync(() => target.dispatchEvent(event));
}
var useLayoutEffect2 = (globalThis == null ? void 0 : globalThis.document) ? reactExports.useLayoutEffect : () => {
};
function useStateMachine$1(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : reactExports.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? reactExports.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = reactExports.useState();
  const stylesRef = reactExports.useRef(null);
  const prevPresentRef = reactExports.useRef(present);
  const prevAnimationNameRef = reactExports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine$1(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  reactExports.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || (styles == null ? void 0 : styles.display) === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: reactExports.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return (styles == null ? void 0 : styles.animationName) || "none";
}
function getElementRef(element) {
  var _a2, _b2;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
function createContext2(rootComponentName, defaultContext) {
  const Context = reactExports.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = reactExports.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = reactExports.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a2;
      const { scope, children, ...context } = props;
      const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a2;
      const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
function useCallbackRef(callback) {
  const callbackRef = reactExports.useRef(callback);
  reactExports.useEffect(() => {
    callbackRef.current = callback;
  });
  return reactExports.useMemo(() => (...args) => {
    var _a2;
    return (_a2 = callbackRef.current) == null ? void 0 : _a2.call(callbackRef, ...args);
  }, []);
}
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs2,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs2,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs2 = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs2,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a2;
    const height2 = ((_a2 = context.scrollbarX) == null ? void 0 : _a2.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a2;
    const width2 = ((_a2 = context.scrollbarY) == null ? void 0 : _a2.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function timeAgo(createdAt) {
  const ms = Number(createdAt) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
function notifIcon(type) {
  const cls = "h-4 w-4 shrink-0";
  switch (type) {
    case NotificationType.rentDue:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: cn(cls, "text-amber-400") });
    case NotificationType.paymentOverdue:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: cn(cls, "text-destructive") });
    case NotificationType.emptyRoom:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: cn(cls, "text-primary") });
    case NotificationType.complaintUpdate:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: cn(cls, "text-blue-400") });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: cn(cls, "text-muted-foreground") });
  }
}
function NotificationItem({ notification, onRead }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => {
        if (!notification.isRead) onRead(notification.id);
      },
      "data-ocid": `notifications.item.${notification.id}`,
      className: cn(
        "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-smooth hover:bg-secondary/60 cursor-pointer",
        !notification.isRead && "bg-primary/5"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: notifIcon(notification.notifType) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "truncate text-xs font-medium",
                notification.isRead ? "text-muted-foreground" : "text-foreground"
              ),
              children: notification.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: notification.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground/60", children: timeAgo(notification.createdAt) })
        ] }),
        !notification.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" })
      ]
    }
  );
}
function NotificationBell() {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0n } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const clearAll = useClearAllNotifications();
  const count = Number(unreadCount);
  reactExports.useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      const timeout2 = setTimeout(() => {
        document.addEventListener("mousedown", handler);
      }, 10);
      return () => {
        clearTimeout(timeout2);
        document.removeEventListener("mousedown", handler);
      };
    }
    return void 0;
  }, [open]);
  reactExports.useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: "relative h-9 w-9 text-muted-foreground hover:text-foreground transition-smooth cursor-pointer",
        onClick: () => setOpen((v2) => !v2),
        "aria-label": `Notifications${count > 0 ? `, ${count} unread` : ""}`,
        "aria-expanded": open,
        "aria-haspopup": "true",
        "data-ocid": "notifications.bell_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
          count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-bold text-destructive-foreground",
              "aria-hidden": "true",
              "data-ocid": "notifications.unread_badge",
              children: count > 99 ? "99+" : count
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "aria-label": "Notifications panel",
        className: "absolute right-0 top-11 z-50 w-80 rounded-lg border border-border bg-card shadow-lg",
        "data-ocid": "notifications.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Notifications" }),
              count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 min-w-4 border-primary/30 bg-primary/10 px-1 text-[10px] text-primary", children: count })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer",
                onClick: () => setOpen(false),
                "aria-label": "Close notifications",
                "data-ocid": "notifications.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 border-b border-border/50 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer",
                onClick: () => markAllRead.mutate(),
                disabled: count === 0,
                "data-ocid": "notifications.mark_all_read_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
                  "Mark all read"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer",
                onClick: () => clearAll.mutate(),
                "data-ocid": "notifications.clear_all_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Clear all"
                ]
              }
            )
          ] }),
          notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-2 py-10 text-center",
              "data-ocid": "notifications.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-8 w-8 text-muted-foreground/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No notifications" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2", children: notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            NotificationItem,
            {
              notification: n,
              onRead: (id) => markRead.mutate(id)
            },
            n.id.toString()
          )) }) })
        ]
      }
    )
  ] });
}
function getActiveReminderCount(reminders) {
  const now = Date.now();
  return reminders.filter((r) => {
    if (r.isDone) return false;
    const remindAtMs = Number(r.remindAt) / 1e6;
    return remindAtMs <= now + 60 * 60 * 1e3;
  }).length;
}
function RemindersBadge({ count }) {
  if (count === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      className: "shrink-0 bg-destructive/20 border-destructive/30 text-destructive px-1.5 py-0 text-xs font-bold min-w-[1.25rem] justify-center",
      "data-ocid": "sidebar.reminders_badge",
      children: count > 9 ? "9+" : count
    }
  );
}
function Sidebar({ className, onClose }) {
  const location = useLocation();
  const { data: reminders = [] } = useReminders();
  const activeReminderCount = getActiveReminderCount(reminders);
  const { t } = useLanguage();
  const navLinks = [
    {
      label: t("dashboard"),
      to: "/dashboard",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4" })
    },
    {
      label: t("rooms"),
      to: "/rooms",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" })
    },
    {
      label: t("students"),
      to: "/students",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" })
    },
    {
      label: t("payments"),
      to: "/payments",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" })
    },
    {
      label: t("expenses"),
      to: "/expenses",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-4 w-4" })
    },
    {
      label: t("udhar"),
      to: "/udhar",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" })
    },
    {
      label: t("complaints"),
      to: "/complaints",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" })
    },
    {
      label: t("notes"),
      to: "/notes",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-4 w-4" })
    },
    {
      label: t("chart"),
      to: "/chart",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" })
    },
    {
      label: t("reminders"),
      to: "/reminders",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
      activeBadgeCount: activeReminderCount
    },
    {
      label: "Staff",
      to: "/staff",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" })
    },
    {
      label: t("subscription"),
      to: "/subscription",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4" }),
      badge: "Premium"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      className: cn(
        "flex h-full w-60 flex-col border-r border-border bg-card",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "h-5 w-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-sm font-bold tracking-tight text-foreground", children: "HostelAdmin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Management Portal" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto px-3 py-4", "data-ocid": "sidebar.nav", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 pb-2 text-xs-label text-muted-foreground", children: "Navigation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: navLinks.map((link) => {
            const isActive = location.pathname === link.to || link.to !== "/dashboard" && location.pathname.startsWith(`${link.to}/`);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: link.to,
                onClick: onClose,
                "data-ocid": `sidebar.nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`,
                className: cn(
                  "group flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-smooth",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "shrink-0 transition-smooth",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      ),
                      children: link.icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate", children: link.label }),
                  link.activeBadgeCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(RemindersBadge, { count: link.activeBadgeCount }),
                  link.badge && !link.activeBadgeCount && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "shrink-0 border-orange-500/30 bg-orange-500/10 px-1.5 py-0 text-xs text-orange-400",
                      children: link.badge
                    }
                  ),
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 shrink-0 text-primary" })
                ]
              }
            ) }, link.to);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/60", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-primary transition-smooth",
              children: "caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
function PrincipalBadge({ principal }) {
  if (!principal) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32" });
  const short = `${principal.slice(0, 8)}…${principal.slice(-4)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: short })
  ] });
}
function SubscriptionBadge() {
  const { status, daysRemaining, isLoading, isPremium } = useSubscription();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24" });
  if (status === "trial") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscription", "data-ocid": "layout.trial_badge", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        className: cn(
          "gap-1.5 border-orange-500/40 bg-orange-500/15 text-orange-400",
          "hover:bg-orange-500/25 transition-smooth cursor-pointer"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
          "Trial: ",
          daysRemaining,
          "d left"
        ]
      }
    ) });
  }
  if (status === "active" && isPremium) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        className: "gap-1.5 border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
        "data-ocid": "layout.premium_badge",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
          "Premium"
        ]
      }
    );
  }
  if (status === "expired") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscription", "data-ocid": "layout.expired_badge", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        className: cn(
          "gap-1.5 border-destructive/40 bg-destructive/15 text-destructive",
          "hover:bg-destructive/25 transition-smooth cursor-pointer"
        ),
        children: "Upgrade Now"
      }
    ) });
  }
  return null;
}
function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "sm",
      className: "h-8 gap-0 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth cursor-pointer",
      onClick: () => setLanguage(language === "en" ? "hi" : "en"),
      "aria-label": "Toggle language",
      "data-ocid": "layout.lang_toggle",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "transition-smooth",
              language === "en" ? "text-primary" : "text-muted-foreground"
            ),
            children: "EN"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground/40", children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "transition-smooth",
              language === "hi" ? "text-primary" : "text-muted-foreground"
            ),
            children: "हि"
          }
        )
      ]
    }
  );
}
function Layout({ children, title, subtitle }) {
  const { principal, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen w-full overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ),
        onClick: () => setSidebarOpen(false),
        onKeyDown: (e) => e.key === "Escape" && setSidebarOpen(false),
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "fixed inset-y-0 left-0 z-30 flex h-full w-60 shrink-0 flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { onClose: () => setSidebarOpen(false) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "header",
        {
          className: "flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6",
          "data-ocid": "layout.header",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-9 w-9 shrink-0 md:hidden cursor-pointer",
                  onClick: () => setSidebarOpen(true),
                  "aria-label": "Open navigation",
                  "data-ocid": "layout.menu_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
                }
              ),
              title && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base font-semibold text-foreground", children: title }),
                subtitle && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Separator,
                    {
                      orientation: "vertical",
                      className: "hidden h-4 opacity-50 sm:block"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm text-muted-foreground sm:inline", children: subtitle })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 md:gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageToggle, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SubscriptionBadge, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrincipalBadge, { principal }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: logout,
                  className: "gap-2 text-muted-foreground hover:text-destructive transition-smooth cursor-pointer",
                  "data-ocid": "layout.logout_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "main",
        {
          className: "relative min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-6",
          "data-ocid": "layout.main",
          children
        }
      )
    ] }),
    sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: "fixed left-[15rem] top-3 z-40 h-8 w-8 md:hidden cursor-pointer",
        onClick: () => setSidebarOpen(false),
        "aria-label": "Close navigation",
        "data-ocid": "layout.close_menu_button",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
      }
    )
  ] });
}
export {
  useStudentUdhar as $,
  Primitive as A,
  Building2 as B,
  ChevronRight as C,
  dispatchDiscreteCustomEvent as D,
  createSlot as E,
  useNotes as F,
  TriangleAlert as G,
  useAddNote as H,
  useUpdateNote as I,
  useDeleteNote as J,
  useRooms as K,
  Layout as L,
  useCreateRoom as M,
  useLanguage as N,
  useRoom as O,
  PlanId as P,
  useUpdateRoom as Q,
  Receipt as R,
  StickyNote as S,
  Trash2 as T,
  Users as U,
  Variant_full_empty_partial as V,
  useDeleteRoom as W,
  X,
  useStudents as Y,
  StudentStatus as Z,
  useStudent as _,
  useSetMonthlyBooking as a,
  useVacateStudent as a0,
  useDeleteStudent as a1,
  User as a2,
  SeatType as a3,
  Separator as a4,
  useStudentPayments as a5,
  CreditCard as a6,
  useUpdateStudentPhoto as a7,
  useUpdateStudentDocument as a8,
  useUpdateStudent as a9,
  useRemoveStaff as aA,
  useMarkAttendance as aB,
  AttendanceStatus as aC,
  createContext2 as aD,
  Primitive$1 as aE,
  PaymentStatus as aa,
  useCreateStudent as ab,
  usePayments as ac,
  useHostelSettings as ad,
  useCreatePayment as ae,
  useUpdatePayment as af,
  useDeletePayment as ag,
  useUpdateHostelSettings as ah,
  useUdharEntries as ai,
  Wallet as aj,
  useDeleteUdharEntry as ak,
  UdharCategory as al,
  useCreateUdharEntry as am,
  useMarkUdharPaid as an,
  useComplaints as ao,
  ComplaintStatus as ap,
  useUpdateComplaintStatus as aq,
  useCreateComplaint as ar,
  useDeleteComplaint as as,
  createSlottable as at,
  useLayoutEffect2 as au,
  clamp as av,
  useStaff as aw,
  useAttendanceByMonth as ax,
  useStaffSalaryReport as ay,
  useAddStaff as az,
  useGetBuildingStats as b,
  useSeatConfig as c,
  useSeatSummary as d,
  useMonthlyExpenses as e,
  useMonthlyProfit as f,
  useSetMonthlyExpenses as g,
  useSubscription as h,
  useYearlyProfitChart as i,
  Crown as j,
  useActivateSubscription as k,
  Badge as l,
  useReminders as m,
  useDeleteReminder as n,
  CircleAlert as o,
  Clock as p,
  Bell as q,
  useMarkReminderDone as r,
  useAddReminder as s,
  useUpdateReminder as t,
  useSetSeatConfig as u,
  useCallbackRef as v,
  useDirection as w,
  Presence as x,
  composeEventHandlers as y,
  createContextScope as z
};
