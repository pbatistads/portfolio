import { Gabarito, Libre_Baskerville } from "next/font/google";

export const homeTextFont = Gabarito({
  subsets: ["latin"],
  display: "swap",
});

export const homeTitleFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
