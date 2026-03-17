import axios from "axios";
import { useState } from "react";

export default function ResumeUpload(){

 const [file,setFile] = useState(null);

 const uploadResume = async () => {

   const formData = new FormData();
   formData.append("resume",file);

   const res = await axios.post(
   "http://localhost:5000/api/resume/upload",
   formData
   );

   console.log(res.data);

 };

 return(

  <section className="resume-section">

   <h2>Upload Your Resume</h2>

   <input
    type="file"
    onChange={(e)=>setFile(e.target.files[0])}
   />

   <button className="primary-btn" onClick={uploadResume}>
    Upload Resume
   </button>

  </section>

 );

}