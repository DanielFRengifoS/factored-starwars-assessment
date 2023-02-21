import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FilmData } from '../../main-page/components/films-tab';
import { fetchAndExtractDetails } from '../../main-page/components/main-page.tsx';
import { CharacterData } from '../../main-page/components/people-tab';
import { PlanetData } from '../../main-page/components/planets-tab';
import './detail-panel.scss'; 

function DetailsPanel() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState<FilmData | CharacterData | PlanetData>();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>('people');

  useEffect(() => {
    if (state.apiUrl.includes('person')) {
      setType('people')
    } else if (state.apiUrl.includes('film')) {
      setType('films')
    } else {
      setType('planets')
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch('http://localhost:8000/'+state.apiUrl);
      let json = await response.json();
      
      if (type === 'films') {
        const release = formatDate(json.release_date);
        const characters = await Promise.all(json.people.map((person) => fetchAndExtractDetails('person/'+person.id)));
        const planets = await Promise.all(json.planets.map((planet) => fetchAndExtractDetails('planet/'+planet.id)));
        json = {
          ...json,
          release,
          characters,
          planets,
        };
        setData(json);
      } else if (type === 'people') {
        const homeworld = await fetchAndExtractDetails('planet/'+json.planet_id);
        const films = await Promise.all(json.films.map((film) => fetchAndExtractDetails('film/'+film.id)));
        json = {
          ...json,
          homeworld,
          films,
        };
        setData(json);
      } else {
        const films = await Promise.all(json.films.map((film) => fetchAndExtractDetails('film/'+film.id)));
        json = {
          ...json,
          films,
        };
        setData(json);
      }
      setLoading(false);
    };

    fetchData();
  }, [type]);

  function formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }

  function handleRefClick(url: string, type: string, query: string) {
    setType(type);
    setLoading(true);
    const apiUrl = query+'/'+url
    navigate('/detail', { state: { apiUrl } });
  }

  if (loading || data === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className='details-panel'>
      <h1>Jedi Archives: Details Revealed</h1>
      <table>
        <tbody>
          { (type === 'films') && ( 
            <tr key={(data as FilmData).title}>
                <td className='table-main-title'>{(data as FilmData).title}</td>
                <td>{(data as FilmData).episode_id}</td>
                <td>{(data as FilmData).opening_crawl}</td>
                <td>{(data as FilmData).director}</td>
                <td>{(data as FilmData).producer}</td>
                <td>{(data as FilmData).release_date}</td>
                <td>
                {(data as FilmData).characters.map((character) => (
                    <tr key={character.id}>
                        <td onClick={() => handleRefClick(character.url, 'people', 'person')} className='table-sub-link'>{character.name}</td>
                    </tr>
                ))}
                </td>
                <td>
                {(data as FilmData).planets.map((planet) => (
                    <tr key={planet.id}>
                        <td onClick={() => handleRefClick(planet.url, 'planets', 'planet')} className='table-sub-link'>{planet.name}</td>
                    </tr>
                ))}
                </td>
              </tr> ) }
          { (type === 'people') && ( 
            <tr key={(data as CharacterData).name}>
            <td className='table-main-title'>{(data as CharacterData).name}</td>
            <td>{(data as CharacterData).height}</td>
            <td>{(data as CharacterData).mass}</td>
            <td>{(data as CharacterData).hair_color}</td>
            <td>{(data as CharacterData).skin_color}</td>
            <td>{(data as CharacterData).eye_color}</td>
            <td>{(data as CharacterData).birth_year}</td>
            <td>{(data as CharacterData).gender}</td>
            <td onClick={() => handleRefClick((data as CharacterData).homeworld.id, 'planets', 'planet')} className='table-sub-link'>{(data as CharacterData).homeworld.name}</td>
            <td>
            {(data as CharacterData).films.map((film) => (
                <tr key={film.id}>
                    <td onClick={() => handleRefClick(film.url, 'films', 'film')} className='table-sub-link'>{film.title}</td>
                </tr>
            ))}
            </td>
        </tr> ) }
        { (type === 'planets') && ( 
            <tr key={(data as PlanetData).name}>
                <td className='table-main-title'>{(data as PlanetData).name}</td>
                <td>{(data as PlanetData).rotation_period}</td>
                <td>{(data as PlanetData).orbital_period}</td>
                <td>{(data as PlanetData).diameter}</td>
                <td>{(data as PlanetData).climate}</td>
                <td>{(data as PlanetData).gravity}</td>
                <td>{(data as PlanetData).terrain}</td>
                <td>{(data as PlanetData).surface_water}</td>
                <td>{(data as PlanetData).population}</td>
                <td>
                {(data as PlanetData).films.map((film) => (
                    <tr key={film.id}>
                        <td onClick={() => handleRefClick(film.id, 'films', 'film')} className='table-sub-link'>{film.title}</td>
                    </tr>
                ))}
                </td>
            </tr> ) }
        </tbody>
      </table>
    </div>
  );
}

export default DetailsPanel;