'use client'
import React, { useState, useEffect, useRef  } from 'react';
// import Slider from "react-slick";
import Button from '@mui/material/Button';
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";

import SplashScreen from '../components/splashscreen';

// import AwesomeSlider from 'react-awesome-slider';
// import 'react-awesome-slider/dist/styles.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';


// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";


export default function LoginPage() {

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
          <div className='carousel'>
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 2500 }}
              speed={500}
            >
              <SwiperSlide>
                <img src="/images/login/anytru-1.jfif" alt="Slide 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/login/anytru-2.jfif" alt="Slide 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/login/anytru-3.jfif" alt="Slide 3" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/login/anytru-4.jfif" alt="Slide 4" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="colTwo col loginButtonsCol">
          <div className="loginLogo">
            <img src="/images/logo.png" alt="AnyTru" width="333" height="79" />
          </div>
          <div>  
            <p className='signInWith'>Sign Up</p>
            <div className="loginButtons">
            <Link href="/api/google-login" passHref><Button variant="primary" className="loginBtn"><img className="loginBtnImg" src="/images/login/google.svg" alt="Login With Google" /><p>Continue with Google</p><span> </span></Button></Link>
            <Link href="/api/facebook-login" passHref><Button variant="primary" className="loginBtn"><img className="loginBtnImg" src="/images/login/facebook.svg" alt="Login With Facebook" /><p>Continue with Facebook</p><span> </span></Button></Link>
            {/* <Link href="/homepage" passHref><Button variant="primary" className="loginBtn"><img className="loginBtnImg" src="/images/Apple.png" alt="Login With Apple" /></Button></Link> */}
            </div>
            <Link href="/" passHref><p className='exploreWithout'><span className="PrimaryTextC">Explore</span> without Signing In</p></Link>
          </div>
          <div>
            <div className="socialDiv">
              <p className="followUs">Follow AnyTru</p>
              <div className="socialIcons">
                <a href="https://www.instagram.com/anytruofficial/"><img src="/images/login/instagram.svg" alt="Instagram" /></a>
                <a href="https://www.facebook.com/anytruFB"><img src="/images/login/facebook.svg" alt="Facebook" /></a>
                <a href="https://www.youtube.com/channel/UC4CGD8c3P7ed74hJwUIdI_Q"><img className="loginYoutube" src="/images/login/youtube.svg" alt="YouTube" /></a>
                <a href="https://twitter.com/AnyTruOfficial"><img  src="/images/login/twitter.svg" alt="Twitter" /></a>
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
      </div>




    </main>
  );
}
