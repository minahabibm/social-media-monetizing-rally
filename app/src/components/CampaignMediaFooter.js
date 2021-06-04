import React from 'react';
import axios from 'axios';

import './CampaignMediaFooter.css';
import { ReactComponent as DownloadLogo } from '../assets/download.svg';
import { ReactComponent as LinkLogo } from '../assets/link.svg';

const downloadFile = (url) => {
  var encodedUrl = btoa(url); // base64
  var pathname = new URL(url).pathname;
  var pathnameArr = pathname.split('/');
  let fileName = pathnameArr[pathnameArr.length - 1].replace('%', '_');

  // https://cors-anywhere.herokuapp.com/ , works around cors for client side.
  // axios.request({
  //     url: 'https://cors-anywhere.herokuapp.com/' + url,
  //     method: 'GET',
  //     responseType: 'blob', // important
  //   })
  axios
    .get('/download?url=' + encodedUrl, { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
};

function CampaignMediaFooter(props) {
  const { downloadUrl, trackingLin } = props;

  return (
    <div className='campaignFoo'>
      <button
        className='buttonSty lef'
        onClick={() => navigator.clipboard.writeText(trackingLin)}
      >
        <LinkLogo></LinkLogo>
      </button>

      <button
        className='buttonSty rig'
        onClick={() => downloadFile(downloadUrl)}
      >
        <DownloadLogo></DownloadLogo>
      </button>
    </div>
  );
}

export default CampaignMediaFooter;
