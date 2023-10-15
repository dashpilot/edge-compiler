import edge from "edge-template-engine";
import { compile } from "sfc-vanilla";
import * as fs from "fs";

const pages = compile("./src/");
const components = compile("./src/components/");

const precompile = async () => {
  if (!fs.existsSync("./modules/")) {
    fs.mkdirSync("./modules/");
  }

  if (!fs.existsSync("./modules/components/")) {
    fs.mkdirSync("./modules/components/");
  }

  for (const page in pages.template) {
    // compile
    var compiled = "";
    if (pages.imports[page]) {
      compiled += pages.imports[page] + "\n\n";
    }
    compiled += await edge.compile(pages.template[page], "esm");

    // save the file to disk, so you can import it in the next step
    fs.writeFileSync("./modules/" + page + ".mjs", compiled, "utf8");
  }

  for (const comp in components.template) {
    // compile
    var compiled = "";
    if (components.imports[comp]) {
      compiled += components.imports[comp] + "\n\n";
    }
    compiled += await edge.compile(components.template[comp], "esm");

    // save the file to disk, so you can import it in the next step
    fs.writeFileSync("./modules/components/" + comp + ".mjs", compiled, "utf8");
  }

  console.log("done all");
};

export { precompile };
