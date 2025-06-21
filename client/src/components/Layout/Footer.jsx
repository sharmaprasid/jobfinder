import { useContext } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Context } from "../../main";
function Footer() {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved by SDLC-Group 16.</div>
      <div>
        <Link to={"https://github.com/sharmaprasid"} target="github">
          <FaGithub></FaGithub>
        </Link>

        <Link to={"https://www.linkedin.com/in/prasid-poudel-sharma-2046601b4/"} target="linkedin">
          <FaLinkedin></FaLinkedin>
        </Link>
        <Link to={"https://www.facebook.com/prasid.sharma.73/"} target="instagram">
          <RiInstagramFill></RiInstagramFill>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
