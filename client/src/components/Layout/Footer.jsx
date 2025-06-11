import React, { useContext } from 'react'
import {Context} from "../../main"
import {Link} from "react-router-dom"
import { FaGithub , FaLinkedin} from "react-icons/fa"
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill} from "react-icons/ri"
function Footer() {
  const {isAuthorized}  = useContext(Context)
  return (
    <footer className= {isAuthorized ? "footerShow" : "footerHide"}>
<div>&copy; All Rights Reserved by Prasid.</div>
<div>
  <Link to={'https://github.com/sharmaprasid'} target='github'><FaGithub></FaGithub></Link>

  <Link to={'https://www.linkedin.com/in/prasid-poudel-sharma-2046601b4/'} target='linkedin'><FaLinkedin></FaLinkedin></Link>
  <Link to={'https://www.facebook.com/prasid.sharma.73/'} target='instagram'><RiInstagramFill></RiInstagramFill></Link>
</div>
      
    </footer>
  )
}

export default Footer