import React, { useEffect, useState } from 'react';
import Card1 from '../assets/card-rail-images/Card1.jpg';
import Card2 from '../assets/card-rail-images/Card2.jpg';
import Card3 from '../assets/card-rail-images/Card3.jpg';
import Card4 from '../assets/card-rail-images/Card4.jpg';
import Card5 from '../assets/card-rail-images/Card5.jpg';
import Card6 from '../assets/card-rail-images/Card6.jpg';
import Card7 from '../assets/card-rail-images/Card7.jpg';
import Card8 from '../assets/card-rail-images/Card8.jpg';
import Card9 from '../assets/card-rail-images/Card9.jpg';
import Card10 from '../assets/card-rail-images/Card10.jpg';
import './CardRail.css';

const CardRail = () => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const addAnimation = () => {
            const scrollers = document.querySelectorAll(".scroller");
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", true);

                const scrollerInner = scroller.querySelector(".scroller__inner");
                const scrollerContent = Array.from(scrollerInner.children);

                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        };

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
            setAnimated(true);
        }

        return () => {
            
        };

    }, []);

    return (
        <div className={`scroller ${animated ? 'animated' : ''}`} data-direction="left" data-speed="slow">
            <div className="scroller__inner">
                <img src={Card1} alt="" />
                <img src={Card2} alt="" />
                <img src={Card3} alt="" />
                <img src={Card4} alt="" />
                <img src={Card5} alt="" />
                <img src={Card6} alt="" />
                <img src={Card7} alt="" />
                <img src={Card8} alt="" />
                <img src={Card9} alt="" />
                <img src={Card10} alt="" />
            </div>
        </div>
    );
};

export default CardRail;
