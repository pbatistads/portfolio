import { Gabarito, Libre_Baskerville, Outfit } from "next/font/google";

export const homeTextFont = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const footerFont = Gabarito({
  subsets: ["latin"],
  display: "swap",
});

export const homeTitleFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
