import Navbar from "../components/Navbar"
import Ranking from "../components/Ranking"

const HomePage = () => {
  return (
   <>
    <Navbar/>
    <div className="container flex flex-wrap justify-around">
    <Ranking/>
    </div>
   </>
  )
}

export default HomePage
