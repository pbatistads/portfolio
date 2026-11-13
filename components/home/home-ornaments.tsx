import Image from "next/image";

export function HomeOrnaments() {
  return (
    <div className="home-ornaments" aria-hidden="true">
      {Array.from({ length: 15 }, (_, index) => (
        <Image key={index} src={`/images/home/${index % 2 === 0 ? "asterisk" : "flower"}.svg`}
          alt="" width={16} height={16} unoptimized />
      ))}
    </div>
  );
}
