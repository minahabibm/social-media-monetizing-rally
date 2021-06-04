import React from 'react';

import './MediaCampaign.css';
import CampaignMediaFooter from '../components/CampaignMediaFooter';
import VideoJs from './videoJs';

function MediaCampaign(props) {
  const { cover_photo_url, download_url, media_type, tracking_link } =
    props.media;

  const isSafari = () => {
    // Detect Safari
    const agentHas = (brows) => navigator.userAgent.indexOf(brows) > -1;
    return (
      (!!window.ApplePaySetupFeature || !!window.safari) &&
      agentHas('Safari') &&
      !agentHas('Chrome') &&
      !agentHas('CriOS')
    );
  };

  let videoUrl = isSafari()
    ? '/stream-safari?url=' + btoa(download_url)
    : download_url;
  const videoJsOptions = {
    poster: cover_photo_url,
    // autoplay: true,
    controls: true,
    responsive: true,
    sources: [
      {
        type: 'video/mp4',
        src: videoUrl,
      },
    ],
  };

  return (
    <div>
      <div>
        {media_type === 'video' ? (
          <VideoJs {...videoJsOptions} />
        ) : (
          <img src={cover_photo_url} width='101' height='179' alt='media' />
        )}
      </div>

      <CampaignMediaFooter
        downloadUrl={download_url}
        trackingLin={tracking_link}
      >
        {' '}
      </CampaignMediaFooter>
    </div>
  );
}

export default MediaCampaign;
