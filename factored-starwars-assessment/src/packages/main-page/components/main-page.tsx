import React, { useState } from "react";
import StarWars from "./star-wars.tsx";
import PeopleTable from "./people-tab.tsx";
import FilmsTable from "./films-tab.tsx";
import PlanetsTable from "./planets-tab.tsx";
import ProfileEdit from "../../profile-edit/components/profile-edit.tsx";
import './main-page.scss';

export interface ReferenceData {
  title?: string;
  name?: string;
  id: string;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export async function fetchAndExtractDetails(url: string): Promise<ReferenceData> {
  const response = await fetch('http://localhost:5432/'+url);
  const data = await response.json();
  return { title: data.title, id: data.id, name: data.name };
}

function MainPage() {
  const [currentComponent, setCurrentComponent] = useState("home");

  const handleNavigationClick = (component) => {
    setCurrentComponent(component);
  };

  let componentToRender;
  switch (currentComponent) {
    case "home":
      componentToRender = <StarWars />;
      break;
    case "profile":
      componentToRender = <ProfileEdit />;
      break;
    case "people":
      componentToRender = <PeopleTable />;
      break;
    case "films":
      componentToRender = <FilmsTable />;
      break;
    case "planets":
      componentToRender = <PlanetsTable />;
      break;
    default:
      componentToRender = <StarWars />;
  }

  return (
    <div className="main-page-container">
      <div className="main-page-header">
        <h1>A Long Time Ago, in a Database Far, Far Away</h1>
        <nav>
          <ul>
            <li>
              <button onClick={() => handleNavigationClick("home")}>Home</button>
            </li>
            <li>
              <button onClick={() => handleNavigationClick("profile")}>Profile</button>
            </li>
            <li>
              <button onClick={() => handleNavigationClick("people")}>Characters</button>
            </li>
            <li>
              <button onClick={() => handleNavigationClick("films")}>Films</button>
            </li>
            <li>
              <button onClick={() => handleNavigationClick("planets")}>Planets</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-page-content">{componentToRender}</div>
    </div>
  );
}

export default MainPage;