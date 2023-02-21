import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../misc/components/loading-component.tsx';
import { fetchAndExtractDetails, ReferenceData, formatDate } from './main-page.tsx';
import './table-tab.scss'

export interface FilmData {
  title: string;
  episode_id: string;
  opening_crawl: string,
  director: string, 
  producer: string;
  release_date: string;
  characters: ReferenceData[];
  planets: ReferenceData[];
  id: string;
}

function FilmsTable() {
  const [films, setFilms] = useState<FilmData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(new Map<string, string>);
  const [perPage, setPerPage] = useState(2);
  const [newPerPage, setNewPerPage] = useState(2);
  const navigate = useNavigate();

  async function fetchFilmData() {
    setLoading(true); 
    let filterString = Array.from(filter).map(([key, value]) => `${key}=${value}`).join('&').replace(new RegExp(' ', 'g'), '%20')
    filterString = filterString+'&page='+currentPage+'&pageCount='+perPage
    const url = 'http://localhost:8000/films?'+filterString;
    const response = await fetch(url);

    const data = await response.json();
    setTotalPages(data.total_pages)
    const results = data.films; 

    for (let i = 0; i < +results.length && i < perPage; i++) {
      const film = results[i];
      const release_date = formatDate(film.release_date);
      const characters = await Promise.all(film.people.map((person) => fetchAndExtractDetails('person/'+person.id)));
      const planets = await Promise.all(film.planets.map((planet) => fetchAndExtractDetails('planet/'+planet.id)));

      results[i] = {
        ...film,
        release_date,
        characters,
        planets,
      };
    }
    setLoading(false);
    setFilms(results);
  }

  useEffect(() => {
    fetchFilmData();
  }, [currentPage, perPage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  function handleFilterChange(key: string, value: string) {
    const emptyStringRegex = /^\s*$/;
    if (emptyStringRegex.test(value)) {
      if (filter.has(key)) {
        filter.delete(key)
      } else {
        return
      }
    } else {
      filter.set(key, value)
    }
    fetchFilmData()
    setLoading(true)
  }
  function handleRefClick(url: string, type: string) {
    const apiUrl = type+'/'+url
    navigate('/detail', { state: { apiUrl } });
  }

  if (loading) {
    return <Loading/>;
  }

  return (
    <div>
      <div className="per-page">
        <label htmlFor="per-page-input">Per Page:</label>
        <input
          type="number"
          defaultValue={perPage}
          onChange={(e) => {setNewPerPage(parseInt(e.target.value))}}
          onKeyDown={handleKeyDown}
          min="1"
        />
        <button onClick={(e) => {setPerPage(newPerPage)}}>Submit</button>
      </div>
        <table>
        <thead> 
          <tr>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('title',e.target.value)} defaultValue={filter.has('title') ? filter.get('title') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('episode_id',e.target.value)} defaultValue={filter.has('episode_id') ? filter.get('episode_id') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('opening_crawl',e.target.value)} defaultValue={filter.has('opening_crawl') ? filter.get('opening_crawl') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('director',e.target.value)} defaultValue={filter.has('director') ? filter.get('director') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('producer',e.target.value)} defaultValue={filter.has('producer') ? filter.get('producer') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('release_date',e.target.value)} defaultValue={filter.has('release_date') ? filter.get('release_date') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('person',e.target.value)} defaultValue={filter.has('person') ? filter.get('person') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('planet',e.target.value)} defaultValue={filter.has('planet') ? filter.get('planet') : ''} onKeyDown={handleKeyDown}/>
              </th>
          </tr>
        </thead>
        <thead>
            <tr>
            <th>Title</th>
            <th>Episode</th>
            <th>Opening Crawl</th>
            <th>Director</th>
            <th>Producer</th>
            <th>Release Date</th>
            <th>Characters</th>
            <th>Planets</th>
            </tr>
        </thead>
        <tbody>
            {films.map((film) => (
            <tr key={film.title}>
                <td>
                <td onClick={() => handleRefClick(film.id, 'film')} className='table-main-title'>{film.title}</td>
                </td>
                <td>{film.episode_id}</td>
                <td>{film.opening_crawl}</td>
                <td>{film.director}</td>
                <td>{film.producer}</td>
                <td>{film.release_date}</td>
                <td>
                {film.characters.map((character) => (
                    <tr key={character.url}>
                        <td onClick={() => handleRefClick(character.id, 'person')} className='table-sub-link'>{character.name}</td>
                    </tr>
                ))}
                </td>
                <td>
                {film.planets.map((planet) => (
                    <tr key={planet.id}>
                        <td onClick={() => handleRefClick(planet.id, 'planet')} className='table-sub-link'>{planet.name}</td>
                    </tr>
                ))}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => {setCurrentPage(currentPage - 1); setLoading(true)}} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage} of {totalPages}</span>
            <button onClick={() => {setCurrentPage(currentPage + 1); setLoading(true)}} disabled={currentPage === totalPages}>Next</button>
        </div>
    </div>
  );
}

export default FilmsTable;