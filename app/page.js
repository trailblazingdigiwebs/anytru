'use client'
import React, { useState, useEffect, useRef  } from 'react';
import Slider from "react-slick";
import Button from '@mui/material/Button';
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";

import SplashScreen from './components/splashscreen';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function Home() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2500,
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loading]);



  return (
    <main className="main">
        {loading && <SplashScreen />}

        <div className="loginBox">
        <div className="colOne col">
          <div className="fHeadDiv">
            <h3 className="fHeadText fw300">Bring Your Ideas</h3>
            <h2 className="PrimaryTextC fHeadText fw600">To Life</h2>
          </div>
          <div className="carousel">
            <Slider {...settings}>
              <div>
                <img src="/images/carousel-image-1.png"  />
              </div>
              <div>
                <img src="/images/carousel-image-2.jpg"  />
              </div>
              <div>
                <img src="/images/carousel-image-3.png" />
              </div>
              <div>
                <img src="/images/carousel-image-4.jpg" />
              </div>
              <div>
                <img src="/images/carousel-image-5.jpg" />
              </div>
            </Slider>
          </div>
        </div>
        <div className="colTwo col">
          <div className="loginLogo">
            <img src="/images/logo.png" alt="AnyTru" width="333" height="79" />
          </div>
          <p className='signInWith'>Sign in With</p>
          <div className="loginButtons">
          <Link href="/api/google-login" passHref><Button variant="primary" className="loginBtn"><img className="loginBtnImg" src="/images/Google.png" alt="Login With Google" /></Button></Link>
          <Link href="/api/facebook-login" passHref><Button variant="primary" className="loginBtn"><img className="loginBtnImg" src="/images/Facebook.png" alt="Login With Facebook" /></Button></Link>
          {/* <Link href="/homepage" passHref><Button variant="primary" className="loginBtn"><img className="loginBtnImg" src="/images/Apple.png" alt="Login With Apple" /></Button></Link> */}
          </div>
          <Link href="/Homepage-Guest" passHref><p className='exploreWithout'><span className="PrimaryTextC">Explore</span> without Signing In</p></Link>
          <div className="socialDiv">
            <p className="followUs">Follow AnyTru</p>
            <div className="socialIcons">
              <a href="https://www.instagram.com/anytruofficial/"><img src="/images/instagram-social.png" alt="Instagram" /></a>
              <a href="https://www.facebook.com/anytruFB"><img src="/images/facebook-social.png" alt="Facebook" /></a>
              <a href="https://www.youtube.com/channel/UC4CGD8c3P7ed74hJwUIdI_Q"><img src="/images/youtube.png" alt="YouTube" /></a>
              <a href="https://twitter.com/AnyTruOfficial"><img  src="/images/Twitter.png" alt="Twitter" /></a>
            </div>

            <div className="query">
              <Dropdown>
                  <DropdownTrigger>
                    <button>
                        <img src="/images/query.png" alt="Have A Query" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapperTwo" aria-label="Static Actions">
                    <DropdownItem>
                      <div className="queryPopup">
                        <div className="queryPopupRow queryRowOne">
                          <a href="#">How It Works</a>
                          <a href="#">FAQs</a>
                          <a href="#">Careers</a>
                        </div>
                        <div className="queryPopupRow queryRowtwo">
                          <a href="#">Privacy Policy</a>
                          <a href="#">Terms & Conditions</a>
                        </div>
                      </div>             
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
            </div>

          </div>
        </div>
      </div>




    </main>
  );
}
