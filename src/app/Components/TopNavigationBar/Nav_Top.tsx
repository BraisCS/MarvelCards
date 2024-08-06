import Image from "next/image";
import "./Nav_Top.css";
import { useGlobal } from "@/app/Context/Global_Context";
import { useEffect, useState } from "react";

interface NavTopProps {
  likedCount: number;
  onShowAll: () => void;
  onShowLiked: () => void;
}

const Nav_Top: React.FC<NavTopProps> = ({ onShowAll, onShowLiked }) => {
  const { likedCharacters } = useGlobal();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (
    <nav className="Nav_Top">
      <a onClick={onShowAll} href="/" >
        <Image height={100} width={100} src={"/Marvel_Icon.svg"} alt="Icono Marvel" className="Nav_Major_Icon" />
      </a>
      <div className="Nav_Heart">
        <button onClick={onShowLiked} className="Nav_Button_Minor">
          <Image height={100} width={100} src={"/Header_Heart.svg"} alt="Icono Heart" className="Nav_Minor_Icon" />
        </button>
        {hydrated ? <p className="Nav_Number_Heart">{likedCharacters.length}</p> : null}
      </div>
    </nav>
  );
};

export default Nav_Top;
