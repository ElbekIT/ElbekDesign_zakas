import Link from "next/link";
import styles from "@/styles/novbar.module.scss";
import { MdOutlineDesignServices } from "react-icons/md";

function Novbar() {
  return (
    <header className="max-w-full w-svw relative ">
      <div className="  hidden  ">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.header}>
        <div className={`${styles.header__logo}`}>
          <Link href="/" className=" ">
            <MdOutlineDesignServices />
            <span className="">ELBEK Design</span>
  
          </Link>
        </div>
        <nav className={`${styles.navbar} `}>
          <ul className={styles.navbar__menu}>
            <li className={styles.navbar__item}>
              <Link href="/" className={styles.navbar__link}>
                <i data-feather="home"></i>
                <span>Buyurtma berish</span>{" "}
              </Link>
            </li>
            {/* <li className={styles.navbar__item}>
              <Link href="/about" className={styles.navbar__link}>
                <i data-feather="message-square"></i>
                <span>About</span>
              </Link>
            </li> */}
            <li className={styles.navbar__item}>
              <Link href="/zakaz" className={styles.navbar__link}>
                <i data-feather="users"></i>
                <span>Orders</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Novbar;
