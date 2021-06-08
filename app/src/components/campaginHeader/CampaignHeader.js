import React from 'react';

import './CampaignHeader.css';

function CampaignHeader(props) {
  const { image, name, ppi } = props;

  return (
    <div className='campHeader'>
      <div className='itemsCampImg'>
        <img src={image} className='logo' alt='' />
      </div>

      <div className='itemsCamp'>
        <div className='itemsCampName'>{name}</div>
        <div className='itemsCampPpi'>
          {' '}
          <span style={{ fontWeight: 'bold' }}>{ppi}</span> per install
        </div>
      </div>
    </div>
  );
}

export default CampaignHeader;
