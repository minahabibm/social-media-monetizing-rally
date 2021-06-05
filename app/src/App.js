import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';
import Campaign from './pages/Campaign';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('https://www.plugco.in/public/take_home_sample_feed')
      .then((response) => {
        setData(response.data);
      });
  }, []);

  return (
    <div className='divMob'>
      <div className='divCont'>
        {data.campaigns &&
          data.campaigns.map((campaign) => (
            <Campaign key={campaign.id} campaign={campaign}></Campaign>
          ))}
      </div>
    </div>
  );
}

export default App;
