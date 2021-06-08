import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';
import DraggableDiv from './components/draggableDiv/DraggableDiv';
import CampaignView from './components/campaignView/campaignView';

function App() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const setRefreshing = () => {
    setRefresh(true);
  };

  useEffect(() => {
    axios
      .get('https://www.plugco.in/public/take_home_sample_feed')
      .then((response) => {
        setData(response.data);
      });
  }, []);

  useEffect(() => {
    if (refresh === true) {
      axios
        .get('https://www.plugco.in/public/take_home_sample_feed')
        .then((response) => {
          setData(response.data);
          const timeout = setTimeout(() => {
            setRefresh(false);
          }, 1000);
          return () => clearTimeout(timeout);
        });
    }
  }, [refresh]);

  return (
    <div className='divMob'>
      <DraggableDiv refreshContent={setRefreshing} isRefreshing={refresh}>
        {data.campaigns &&
          data.campaigns.map((campaign) => (
            <CampaignView key={campaign.id} campaign={campaign}></CampaignView>
          ))}
      </DraggableDiv>
    </div>
  );
}

export default App;
