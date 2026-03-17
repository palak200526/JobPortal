export default function JobCategories(){

 const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "UI/UX Designer",
  "Product Manager",
  "Cyber Security"
 ];

 return(

  <section className="categories-section">

   <h2>Popular Job Categories</h2>

   <div className="category-grid">

    {categories.map((cat,index)=>(
      <div key={index} className="category-card">
        {cat}
      </div>
    ))}

   </div>

  </section>

 );

}