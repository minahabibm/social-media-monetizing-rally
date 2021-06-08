import React from 'react';

import './campaignView.css';
import CampaignHeader from '../campaginHeader/CampaignHeader';
import CampaignMedia from '../campaignMedia/campaignMedia';

function CampaignView(props) {
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
            <CampaignMedia
              key={media.download_url}
              media={media}
            ></CampaignMedia>
          ))}
      </div>
    </div>
  );
}

export default CampaignView;
