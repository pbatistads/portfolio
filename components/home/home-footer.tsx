import { footerFont } from "./fonts";

export function HomeFooter({ credit = "standard" }: { credit?: "standard" | "vibe" }) {
  return (
    <footer className={`${footerFont.className} portfolio-footer`}>
      <p>designed &amp; {credit === "vibe" ? "[vibe] coded" : "coded"} by Poliana Batista</p>
    </footer>
  );
}
