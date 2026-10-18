import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavBar/NavbarComponent";
import BannerComponent from "./components/Banner/BannerComponent";
import DealsComponent from "./components/Deals/DealsComponent";
import NewArrivalComponent from "./components/NewArrival/NewArrivalComponent";
import SavingZoneComponents from "./components/Savings/SavingZoneComponents";
import ShopNowComponent from "./components/ShopNow/ShopNowComponent";
import CardsMenComponent from "./components/CardsMen/CardsMenComponent";
import CardsWomenComponent from "./components/CardsWomen/CardsWomenComponent";

import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <NavbarComponent />
        <BannerComponent />
        <DealsComponent />
        <NewArrivalComponent />
        <SavingZoneComponents />
        <ShopNowComponent />
        <CardsMenComponent />
        <CardsWomenComponent />
      </div>
    </Router>
  );
}

export default App;
