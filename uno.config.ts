import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  rules: [
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${parseInt(d) / 4}rem` })],
  ],
  shortcuts: {
    // "btn": "bg-primary text-white px-4 py-2 rounded hover:(bg-red-600) transition-all duration-200 outline-none",
    // "text-btn": "text-primary hover:(text-red-600) transition-all duration-200 outline-none",
  },
  theme: {
    colors: {
      // primary: "#ff0000",
    },
    breakpoints: {
    },
  },
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Roboto",
        mono: ["Fira Code", "Fira Mono:400,700"],
      },
    }),
  ],
});
