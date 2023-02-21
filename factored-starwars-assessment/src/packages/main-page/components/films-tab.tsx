import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ITEMS_PER_PAGE = 2;

function FilmsTable() {
  const [films, setFilms] = useState<FilmData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(new Map<string, string>);
  const navigate = useNavigate();

  async function fetchFilmData() {
    setLoading(true); 
    let filterString = Array.from(filter).map(([key, value]) => `${key}=${value}`).join('&').replace(new RegExp(' ', 'g'), '%20')
    const url = 'http://localhost:5432/films?'+filterString;
    const response = await fetch(url);
    const results = await response.json();

    for (let i = (currentPage-1)*ITEMS_PER_PAGE; i < ((currentPage-1)*ITEMS_PER_PAGE)+results.length && i < (currentPage)*ITEMS_PER_PAGE; i++) {
      const film = results[i];
      const release = formatDate(film.release_date);
      const characters = await Promise.all(film.people.map((person) => fetchAndExtractDetails('person/'+person.id)));
      const planets = await Promise.all(film.planets.map((planet) => fetchAndExtractDetails('planet/'+planet.id)));

      results[i] = {
        ...film,
        release,
        characters,
        planets,
      };
    }
    const totalPages = Math.ceil( results.length / ITEMS_PER_PAGE);
    setLoading(false);
    setTotalPages(totalPages);
    setFilms(results);
  }

  useEffect(() => {
    fetchFilmData();
  }, [currentPage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  function handleFilterChange(key: string, value: string) {
    const emptyStringRegex = /^\s*$/;
    if (emptyStringRegex.test(value)) {
      console.log(filter.has(key))
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
    return <p>Loading...</p>;
  }

  return (
    <div>
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
            {films.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((film) => (
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