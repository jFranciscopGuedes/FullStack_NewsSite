import { useEffect, useState } from "react"
import NewsCard from "../../components/NewsCard"
import '../../css/Home.css'
import {getAllNews} from '../../api/newsApi'

function Home(){
    const [searchQuery, setSearchQuery] = useState("")
    const [news, setNews] = useState([])
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const loadNews = async (search="")=>{
            try{
                const allNews = await getAllNews(search)
                setNews(allNews)
                setError(null);
            }catch(err){
                console.log(err)
                setError("Failed to load news")
                setNews([]);
            }finally{
                setLoading(false)
            }
        }
        loadNews()
    },[])

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const results = await getAllNews(searchQuery);
            setNews(results);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Notícia não encontrada");
            setNews([]);
        } finally {
            setLoading(false);
        }
        setSearchQuery("");
    };

    return(
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Procurar Noticia"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Procurar</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading"> Loading ....</div>
            ):(
            <div className="news-grid">
                {news.map((n) => (
                    <NewsCard news={n} key={n.id}/>
                ))}
            </div>
            )}
        </div>
    )
}

export default Home