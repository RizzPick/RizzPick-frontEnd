import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {GoDotFill, GoDot} from "react-icons/go"
import {GrPrevious,GrNext} from "react-icons/gr"


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  }
};

type Props = {
    children: React.ReactNode
}


const CustomDot = ({ onMove, index, onClick, active } : any) => {
  return (
    <li
      className={active ? "active" : "inactive"}
      onClick={() => onClick()}
    >
      { active ? <GoDotFill /> : <GoDot /> }
    </li>
  );
};

export const LeftArrow = () => {
return <div className='cursor-pointer'><GrPrevious type="left" style={{ position: 'absolute', left: 5, fontSize: 15 }} /></div>};


function MultiCarousel({ children }: Props) {
  return (
      <Carousel
      customDot={<CustomDot/>}
      showDots={true}
      infinite
      customTransition="all .5"
      ssr={true}
      responsive={responsive}
      itemClass="carousel-item-padding-40-px"
      >
        {children}
      </Carousel>
  )
}

export default MultiCarousel;