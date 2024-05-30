const assert = require("assert");
const path = require("path");
const fs = require("fs/promises");
const Module = require("../dist/gs");

before(async function () {
  await fs.mkdir(path.join(__dirname, "out"), { recursive: true });
});

describe("all", function () {
  it("should render eps to png", async function () {
    const exitStatus = await callMain([
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=png16m",
      "-dGraphicsAlphaBits=4",
      "-sOutputFile=out/tiger.png",
      "assets/tiger.eps",
    ]);
    assert.equal(exitStatus, 0);
  });

  it("should render pdf to png", async function () {
    const exitStatus = await callMain([
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=png16m",
      "-r96",
      "-dGraphicsAlphaBits=4",
      "-dTextAlphaBits=4",
      "-dPDFSETTINGS=/printer",
      "-sOutputFile=out/sample.png",
      "assets/sample.pdf",
    ]);
    assert.equal(exitStatus, 0);
  });

  // Ensure this doesn't call `process.exit`
  it("should exit properly on error", async function () {
    const exitStatus = await callMain(["unknown-subcommand"]);
    assert.equal(exitStatus, 1);
  });
});

async function callMain(args) {
  const mod = await Module();
  const working = "/working";
  mod.FS.mkdir(working);
  mod.FS.mount(mod.NODEFS, { root: __dirname }, working);
  mod.FS.chdir(working);
  return mod.callMain(args);
}
