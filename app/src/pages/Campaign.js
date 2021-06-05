import React from 'react';

import './Campaign.css';
import CampaignHeader from '../components/CampaignHeader';
import MediaCampaign from '../components/MediaCampaign';

function Campaign(props) {
  const { campaign_name, campaign_icon_url, medias, pay_per_install } =
    props.campaign;

  return (
    <div>
      <CampaignHeader
        image={campaign_icon_url}
        name={campaign_name}
        ppi={pay_per_install}
      ></CampaignHeader>

      <div className='hs'>
        {medias &&
          medias.map((media) => (
            <MediaCampaign
              key={media.download_url}
              media={media}
            ></MediaCampaign>
          ))}
      </div>
    </div>
  );
}

export default Campaign;
