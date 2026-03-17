import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import JobCategories from "@/components/JobCategories";
import FeaturedJobs from "@/components/FeaturedJobs";
import Reviews from "@/components/Reviews";
import Articles from "@/components/Articles";
import Footer from "@/components/Footer";

export default function Dashboard() {
  return (
    <div>

      <Navbar />

      <h1 style={{textAlign:"center", marginTop:"20px"}}>
        Job Seeker Dashboard
      </h1>

      <ResumeUpload />
      <JobCategories />
      <FeaturedJobs />
      <Reviews />
      <Articles />
      <Footer />

    </div>
  );
}