function loadFreshApp() {
  jest.resetModules();
  return require("../../src/server");
}

test("app.start listens on default port when PORT is unset", () => {
  const previousPort = process.env.PORT;
  delete process.env.PORT;

  const app = loadFreshApp();
  const listenSpy = jest.spyOn(app, "listen").mockImplementation((port, cb) => {
    if (typeof cb === "function") cb();
    return { close: jest.fn() };
  });

  app.start();

  expect(listenSpy).toHaveBeenCalledWith(3000, expect.any(Function));

  listenSpy.mockRestore();
  process.env.PORT = previousPort;
});

test("app.start respects PORT env var", () => {
  const previousPort = process.env.PORT;
  process.env.PORT = "4567";

  const app = loadFreshApp();
  const listenSpy = jest.spyOn(app, "listen").mockImplementation((port, cb) => {
    if (typeof cb === "function") cb();
    return { close: jest.fn() };
  });

  app.start();

  expect(listenSpy).toHaveBeenCalledWith("4567", expect.any(Function));

  listenSpy.mockRestore();
  process.env.PORT = previousPort;
});

