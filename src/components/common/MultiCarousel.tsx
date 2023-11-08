import React, { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GoDotFill, GoDot } from "react-icons/go";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

type Props = {
  children: React.ReactNode[]
}

const CustomDot = ({ onMove, index, onClick, active }: any) => {
  return (
    <li
      className={`${active ? "active" : "inactive"}`}
      onClick={() => onClick()}
    >
      {active ? <GoDotFill /> : <GoDot />}
    </li>
  );
};

function MultiCarousel({ children }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Carousel
        // customDot={<CustomDot />}
        // showDots={children.length > 1}
        arrows={isHovered}
        infinite
        customTransition="all .5"
        responsive={responsive}
      >
        {children}
      </Carousel>
    </div>
  );
}

export default MultiCarousel;
