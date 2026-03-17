import axios from "axios";
import { useEffect, useState } from "react";

export default function FeaturedJobs(){

 const [jobs,setJobs] = useState([]);
 const [loading,setLoading] = useState(true);

 useEffect(()=>{

  axios.get("http://localhost:5000/api/jobs/featured")
   .then(res=>{
     setJobs(res.data);
     setLoading(false);
   })
   .catch(err=>{
     console.log(err);
     setLoading(false);
   });

 },[]);

 if(loading){
   return <p className="loading">Loading jobs...</p>
 }

 return(

  <section className="featured-section">

   <h2>Featured Jobs</h2>

   <div className="job-grid">

   {jobs.map(job => (

    <div key={job.id} className="job-card">

      <h3>{job.title}</h3>
      <p>{job.company}</p>

      <button className="primary-btn">
        Apply
      </button>

    </div>

   ))}

   </div>

  </section>

 );

}