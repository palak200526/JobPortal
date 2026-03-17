import Link from "next/link";

export default function Navbar(){

 return(

  <nav className="navbar">

   <h2 className="logo">AuraJobs</h2>

   <div className="nav-links">
     <Link href="#">Find Jobs</Link>
     <Link href="#">Companies</Link>
     <Link href="#">Resources</Link>
   </div>

   <div className="nav-buttons">
     <button className="logout-btn">Log Out</button>
   </div>

  </nav>

 );

}