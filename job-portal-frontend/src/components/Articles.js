export default function Articles(){

 const articles = [
   "How to prepare for tech interviews",
   "Top 10 resume mistakes",
   "Best skills for 2026"
 ];

 return(

  <section className="articles-section">

   <h2>Latest Articles</h2>

   <div className="articles-grid">

    {articles.map((a,i)=>(

     <div key={i} className="article-card">
      {a}
     </div>

    ))}

   </div>

  </section>

 );

}