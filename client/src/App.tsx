import * as React from 'react';
import TravelListing from "./routes/TravelListing";
import { Route, Routes } from "react-router-dom";

export default function App() {
    return (
        <div>
            <div className="App">
                <Routes>
                    <Route path="/" element={ <TravelListing /> } />
                </Routes>
            </div>
      </div>
    );
}