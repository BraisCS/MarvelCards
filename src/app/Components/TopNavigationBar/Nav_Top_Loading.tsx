import Image from "next/image";
import "./Nav_Top_Loading.css";
import { useEffect, useState } from "react";
import { useGlobal } from "@/app/Context/Global_Context";

export default function Nav_Top_Loading({ likedCount } : any) {

  const { likedCharacters } = useGlobal();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
    <nav className="Nav_Top">
      <a href="/" >
        <Image height={100} width={100} src={"/Marvel_Icon.svg"} alt="Icono Marvel" className="Nav_Major_Icon"/>
      </a>

      <div className="Nav_Heart">
        <a  className="Nav_Minor" >
          <Image height={100} width={100} src={"/Header_Heart.svg"} alt="Icono Marvel" className="Nav_Minor_Icon"/>
        </a>
        {hydrated ? <p className="Nav_Number_Heart">{likedCharacters.length}</p> : null}
      </div>
    </nav>
    <div className="R-Line"></div>
    </>
  );
}