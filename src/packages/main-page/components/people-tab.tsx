import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../misc/components/loading-component.tsx';
import { fetchAndExtractDetails, ReferenceData } from './main-page.tsx';
import './table-tab.scss'

export interface CharacterData {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: ReferenceData;
  films: ReferenceData[];
  id: string;
}

function PeopleTable() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(new Map<string, string>);
  const [perPage, setPerPage] = useState(4);
  const [newPerPage, setNewPerPage] = useState(4);
  const navigate = useNavigate();

  async function fetchCharacterData() {
    console.log('PRINT')
    setLoading(true);
    let filterString = Array.from(filter).map(([key, value]) => `${key}=${value}`).join('&').replace(new RegExp(' ', 'g'), '%20')
    filterString = filterString+'&page='+currentPage+'&pageCount='+perPage
    const url = 'http://localhost:8000/people?'+filterString; 
    console.log(url);
    const response = await fetch(url) 
    console.log(response);
    const data = await response.json();
    setTotalPages(data.total_pages)
    const results = data.people; 
    console.log(results)

    for (let i = 0; i < +results.length && i < perPage; i++) {
      const character = results[i];
      const homeworld = await fetchAndExtractDetails('planet/'+character.planet_id);
      const films = await Promise.all(character.films.map((film) => fetchAndExtractDetails('film/'+film.id)));

      results[i] = {
        ...character,
        films,
        homeworld,
      };
    }
    setLoading(false);
    setCharacters(results);
  }

  useEffect(() => {
    fetchCharacterData();
  }, [currentPage, perPage]);

  function handleRefClick(url: string, type: string) {
    const apiUrl = type+'/'+url
    navigate('/detail', { state: { apiUrl } });
  }

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
    fetchCharacterData()
    setLoading(true)
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
                <input type="text" onBlur={(e) => handleFilterChange('name',e.target.value)} defaultValue={filter.has('name') ? filter.get('name') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('height',e.target.value)} defaultValue={filter.has('height') ? filter.get('height') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('mass',e.target.value)} defaultValue={filter.has('mass') ? filter.get('mass') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('hair_color',e.target.value)} defaultValue={filter.has('hair_color') ? filter.get('hair_color') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('skin_color',e.target.value)} defaultValue={filter.has('skin_color') ? filter.get('skin_color') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('eye_color',e.target.value)} defaultValue={filter.has('eye_color') ? filter.get('eye_color') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('birth_year',e.target.value)} defaultValue={filter.has('birth_year') ? filter.get('birth_year') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('gender',e.target.value)} defaultValue={filter.has('gender') ? filter.get('gender') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('film',e.target.value)} defaultValue={filter.has('film') ? filter.get('film') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('homeworld',e.target.value)} defaultValue={filter.has('homeworld') ? filter.get('homeworld') : ''} onKeyDown={handleKeyDown}/>
              </th>
          </tr>
        </thead>
        <thead>
            <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Hair Color</th>
            <th>Skin Color</th>
            <th>Eye Color</th>
            <th>Birth Year</th>
            <th>Gender</th>
            <th>Films</th>
            <th>Homeworld</th>
            </tr>
        </thead>
        <tbody>
            {characters.map((character) => (
            <tr key={character.name}>
                <td>
                <td onClick={() => handleRefClick(character.id, 'person')} className='table-main-title'>{character.name}</td>
                </td>
                <td>{character.height}</td>
                <td>{character.mass}</td>
                <td>{character.hair_color}</td>
                <td>{character.skin_color}</td>
                <td>{character.eye_color}</td>
                <td>{character.birth_year}</td>
                <td>{character.gender}</td>
                <td>
                {character.films.map((film) => (
                    <tr key={film.id}>
                        <td onClick={() => handleRefClick(film.id, 'film')} className='table-sub-link'>{film.title}</td>
                    </tr>
                ))}
                </td>
                <td onClick={() => handleRefClick(character.homeworld.id, 'planet')} className='table-sub-link'>{character.homeworld.name}</td>
            </tr>
            ))}
        </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => {setCurrentPage(currentPage - 1)}} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage} of {totalPages}</span>
            <button onClick={() => {setCurrentPage(currentPage + 1)}} disabled={currentPage === totalPages}>Next</button>
        </div>
    </div>
  );
}

export default PeopleTable;