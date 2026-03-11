import React from "react";
import Navbar from "../components/Navbar.jsx";
import { FiInstagram, FiFacebook } from "react-icons/fi";

const AboutPage = () => {
  return (
    <div className="bg-midnight-truffle min-h-screen text-ivory-blush font-poppins">
      <Navbar />
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20 w-full">
        <h1 className="font-montserrat font-bold text-[clamp(2rem,5vw,3rem)] text-ivory-blush mb-8 border-b border-velvet-rose-mist/20 pb-4">
          About Juvelle
        </h1>

        <div className="flex flex-col gap-6 text-[0.95rem] leading-[1.7] text-velvet-rose-mist/90">
          <p className="m-0">
            Welcome to <strong className="text-ivory-blush">Juvelle</strong>,
            your premier destination for elegant, meticulously woven clothing.
            We believe that fashion is an art form - a delicate balance of
            intricate design, quality threads, and timeless style.
          </p>
          <p className="m-0">
            At Juvelle, we specialize in offering a curated collection of
            premium garments, with a special focus on beautifully crafted
            churidars and contemporary ethnic wear. Every piece in our store is
            selected with an eye for detail, ensuring our customers receive only
            the finest quality apparel.
          </p>
          <p className="m-0">
            Our mission is simple: to provide a seamless, premium shopping
            experience from the moment you browse our collection to the day your
            order arrives at your doorstep. Whether you're dressing up for a
            special occasion or elevating your everyday wardrobe, Juvelle is
            here to bring elegance to your closet.
          </p>

          <div className="mt-8 bg-cocoa-orchid p-8 rounded-lg border border-velvet-rose-mist/20">
            <h2 className="font-montserrat font-semibold text-xl text-ivory-blush m-0 mb-4">
              Contact Us
            </h2>
            <p className="m-0 mb-2">
              Juvelle is proudly owned and operated by{" "}
              <strong className="text-ivory-blush">Sahil Rahman</strong>. We are
              always here to help you with your orders, inquiries, or feedback.
            </p>
            <ul className="list-none p-0 m-0 mt-4 flex flex-col gap-2">
              <li className="m-0">
                <strong className="text-velvet-rose-mist">Owner:</strong> Sahil
                Rahman
              </li>
              <li className="m-0">
                <strong className="text-velvet-rose-mist">Phone:</strong>{" "}
                <a
                  href="tel:+919061506630"
                  className="text-ivory-blush no-underline hover:text-velvet-rose-mist transition-colors"
                >
                  +91 9061506630
                </a>
              </li>
              <li className="m-0">
                <strong className="text-velvet-rose-mist">Email:</strong>{" "}
                <a
                  href="mailto:juvelle.store@gmail.com"
                  className="text-ivory-blush no-underline hover:text-velvet-rose-mist transition-colors"
                >
                  juvelle.store@gmail.com
                </a>
              </li>
              <li className="m-0 mt-2">
                <strong className="text-velvet-rose-mist mb-2 block">Social Media:</strong>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/juvelle.store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ivory-blush no-underline hover:text-royal-plum-veil transition-colors"
                  >
                    <FiInstagram size={20} /> Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/people/JuvelleStore/61586948523920"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ivory-blush no-underline hover:text-royal-plum-veil transition-colors"
                  >
                    <FiFacebook size={20} /> Facebook
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
