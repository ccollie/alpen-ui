import React from 'react';
import './info-sprinkle.module.css';

interface InfoSprinkleProps {
  onClickHandler: (link: string) => void;
  helpLink: string;
}

/**
 * An info sprinkle which can be clicked to perform the work in the
 * onClickHandler. The onClickHandler receives the helpLink argument.
 */
const InfoSprinkle: React.FC<InfoSprinkleProps> = (props) => {

  function handleClick() {
    props.onClickHandler(props.helpLink)
  }

  return (
    <i className="info-sprinkle" onClick={handleClick} />
  );
}

InfoSprinkle.displayName = 'InfoSprinkle';

export default InfoSprinkle;
