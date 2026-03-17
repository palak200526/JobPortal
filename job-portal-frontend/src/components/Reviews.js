export default function Reviews(){

 const reviews = [
  {name:"Aman",review:"Found my job in 2 weeks!"},
  {name:"Sara",review:"Great platform for freshers"}
 ];

 return(

  <section className="reviews-section">

   <h2>Job Seeker Reviews</h2>

   <div className="reviews-grid">

    {reviews.map((r,i)=>(

     <div key={i} className="review-card">

      <p>"{r.review}"</p>
      <h4>- {r.name}</h4>

     </div>

    ))}

   </div>

  </section>

 );

}