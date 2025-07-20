import unjs from "eslint-config-unjs";

export default unjs({
  ignores: ["build", "src/generated"],
  rules: {
    "@typescript-eslint/no-require-imports": "off",
    "unicorn/no-process-exit": "off",
    "unicorn/prefer-top-level-await": "off",
  },
});
