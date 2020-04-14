import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import './style.css'

const Search_div = () => {
  return (
    <div className='twitter-search'>Looking for new Twitts..</div> 
  )
}

const App = () => {

  const [trigger, setTrigger] = useState(0);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect( () => {

    const fetchData = async () => {
      setLoading(true)
      const result = await axios.post(
        'src/endpoint.php',
      );

      setData(result.data)
      setBanner(`${result.data[0].banner}`)

      setLoading(false)
    }
    
    fetchData();

    const timer = setInterval( () => { 
      fetchData()
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  function boldString(text) {
    var strRegExp = new RegExp(searchTerm, 'g');
    return text.replace(searchTerm, '<b>'+searchTerm+'</b>');
  }
  
  const filteredData = data.filter(k => k.full_text.includes(searchTerm))

  return (
    <>
      <div className='twitter-app'>
        { loading &&
          <Search_div />
        }

        <div
          className='twitter-headline'
          style={{ backgroundImage: `url(${banner})` }}
        />

        <div className="twitter-actions">
          <input
            type="text"
            placeholder="Search in Twitts"
            onChange={({ target }) => setSearchTerm(target.value)}
            className="twitter-input"
          />
        </div>

        <div className='twitter-container'>
          { filteredData.map(k => {
            const text = boldString(k.full_text)

            return (
              <div key={k.id} className='twitter-widget'>
                <div className='twitter-avatar'>
                  <img src={k.avatar} />
                </div>
                <div className='twitter-body'>
                  <div className='twitter-header'>
                    <div className='twitter-name'>
                      @{k.screen_name}
                    </div>
                    <div className='twitter-data'>
                      {k.date}
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: text }}
                    className='twitter-text'
                  />
                </div>
              </div>
            )
          })}

          { (!loading && filteredData.length === 0) &&
            <div>
              No match!
            </div>
          }
        </div>
      </div>
    </>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App />, root) 

