import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAndExtractDetails, ReferenceData, formatDate  } from './main-page.tsx';
import './table-tab.scss'

export interface PlanetData {
  name: string;
  rotation_period: string;
  orbital_period: string,
  diameter: string, 
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  films: ReferenceData[];
  id: string;
}

const ITEMS_PER_PAGE = 5;

function PlanetsTable() {
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(new Map<string, string>);
  const navigate = useNavigate();

  
  async function fetchPlanetData() {
    setLoading(true);
    let filterString = Array.from(filter).map(([key, value]) => `${key}=${value}`).join('&').replace(new RegExp(' ', 'g'), '%20')
    const url = 'http://localhost:5432/planets?'+filterString;
    const response = await fetch(url);

    const results = await response.json();

    for (let i = (currentPage-1)*ITEMS_PER_PAGE; i < ((currentPage-1)*ITEMS_PER_PAGE)+results.length && i < (currentPage)*ITEMS_PER_PAGE; i++) {
      const planet = results[i];
      const films = await Promise.all(planet.films.map((film) => fetchAndExtractDetails('film/'+film.id)));

      results[i] = {
        ...planet,
        films,
      };
    }
    const totalPages = Math.ceil( results.length / ITEMS_PER_PAGE);
    setLoading(false);
    setTotalPages(totalPages);
    setPlanets(results);
  }

  useEffect(() => {
    fetchPlanetData();
  }, [currentPage]);

  function handleRefClick(url: string, type: string) {
    const apiUrl = type+'/'+url
    navigate('/detail', { state: { apiUrl } })
    setLoading(true)
  }

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
    fetchPlanetData()
    setLoading(true)
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
                <input type="text" onBlur={(e) => handleFilterChange('name',e.target.value)} defaultValue={filter.has('name') ? filter.get('name') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('rotation_period',e.target.value)} defaultValue={filter.has('rotation_period') ? filter.get('rotation_period') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('orbital_period',e.target.value)} defaultValue={filter.has('orbital_period') ? filter.get('orbital_period') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('diameter',e.target.value)} defaultValue={filter.has('diameter') ? filter.get('diameter') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('climate',e.target.value)} defaultValue={filter.has('climate') ? filter.get('climate') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('gravity',e.target.value)} defaultValue={filter.has('gravity') ? filter.get('gravity') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('terrain',e.target.value)} defaultValue={filter.has('terrain') ? filter.get('terrain') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('surface_water',e.target.value)} defaultValue={filter.has('surface_water') ? filter.get('surface_water') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('population',e.target.value)} defaultValue={filter.has('population') ? filter.get('population') : ''} onKeyDown={handleKeyDown}/>
              </th>
              <th>
                <input type="text" onBlur={(e) => handleFilterChange('film',e.target.value)} defaultValue={filter.has('film') ? filter.get('film') : ''} onKeyDown={handleKeyDown}/>
              </th>
          </tr>
        </thead>
        <thead>
            <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            </tr>
        </thead>
        <tbody>
            {planets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((planet) => (
            <tr key={planet.name}>
                <td>
                <td onClick={() => handleRefClick(planet.id, 'planet')} className='table-main-title'>{planet.name}</td>
                </td>
                <td>{planet.rotation_period}</td>
                <td>{planet.orbital_period}</td>
                <td>{planet.diameter}</td>
                <td>{planet.climate}</td>
                <td>{planet.gravity}</td>
                <td>{planet.terrain}</td>
                <td>{planet.surface_water}</td>
                <td>{planet.population}</td>
                <td>
                {planet.films.map((film) => (
                    <tr key={film.id}>
                        <td onClick={() => handleRefClick(film.id, 'film')} className='table-sub-link'>{film.title}</td>
                    </tr>
                ))}
                </td>
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

export default PlanetsTable;