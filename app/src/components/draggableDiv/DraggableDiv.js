import React from 'react';

import './DraggableDiv.css';

class DraggableDiv extends React.Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.state = {
      scrollTop: 0,
    };
  }

  onScroll = () => {
    // const scrollY = window.scrollY; //Don't get confused by what's scrolling - It's not the window
    const scrollviewOffsetY = this.divRef.current.scrollTop; //aka scrollTop
    const scrollviewFrameHeight =
      document.getElementById('dragContainer').clientHeight;
    const scrollviewContentHeight =
      document.getElementById('dragContainer').scrollHeight;
    var sum = scrollviewOffsetY + scrollviewFrameHeight;

    if (sum <= scrollviewFrameHeight) {
      // the top reached
      this.setState({ isRefreshing: true });
      this.props.refreshContent();
    } else if (sum >= scrollviewContentHeight) {
      // the bottom reached
    }

    // console.log( `onScroll, window.scrollY: ${scrollY} divRef.scrollTop: ${scrollTop}`);
    this.setState({
      scrollTop: scrollviewOffsetY,
    });
  };

  render() {
    const { isRefreshing } = this.props;

    return (
      <div
        id='dragContainer'
        ref={this.divRef}
        onScroll={this.onScroll}
        className='divCont'
      >
        {isRefreshing && <div className='infinit-table-spinner'></div>}
        {this.props.children}
      </div>
    );
  }
}

export default DraggableDiv;
