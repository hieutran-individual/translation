import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const rollUp = [
  // ES Modules
  {
    input: "index.tsx",
    output: {
      file: "dist/index.es.js",
      format: "es",
    },
    plugins: [typescript(), babel({ extensions: [".ts"] })],
  },

  // UMD
  {
    input: "index.tsx",
    output: {
      file: "dist/index.umd.min.js",
      format: "umd",
      name: "translation",
      indent: false,
    },
    plugins: [
      typescript(),
      babel({ extensions: [".ts", ".tsx"], exclude: "node_modules/**" }),
      terser(),
    ],
  },
];

export default rollUp;
