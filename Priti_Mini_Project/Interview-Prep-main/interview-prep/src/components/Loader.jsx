import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper className="flex justify-center items-center w-full h-screen">
      <div className="newtons-cradle">
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .newtons-cradle {
    --uib-size: 50px; /* default size */
    --uib-speed: 1.2s;
    --uib-color: #474554;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--uib-size);
    height: var(--uib-size);
  }

  .newtons-cradle__dot {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    width: 25%;
    transform-origin: center top;
  }

  .newtons-cradle__dot::after {
    content: '';
    display: block;
    width: 100%;
    height: 25%;
    border-radius: 50%;
    background-color: var(--uib-color);
  }

  .newtons-cradle__dot:first-child {
    animation: swing var(--uib-speed) linear infinite;
  }

  .newtons-cradle__dot:last-child {
    animation: swing2 var(--uib-speed) linear infinite;
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: ease-out;
    }
    25% {
      transform: rotate(70deg);
      animation-timing-function: ease-in;
    }
    50% {
      transform: rotate(0deg);
      animation-timing-function: linear;
    }
  }

  @keyframes swing2 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: linear;
    }
    50% {
      transform: rotate(0deg);
      animation-timing-function: ease-out;
    }
    75% {
      transform: rotate(-70deg);
      animation-timing-function: ease-in;
    }
  }

  /* Responsive sizing */
  @media (max-width: 640px) {
    .newtons-cradle {
      --uib-size: 40px;
    }
  }

  @media (min-width: 640px) {
    .newtons-cradle {
      --uib-size: 60px;
    }
  }

  @media (min-width: 1024px) {
    .newtons-cradle {
      --uib-size: 80px;
    }
  }
`;

export default Loader;
