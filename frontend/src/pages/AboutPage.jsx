import React from "react";
import Navbar from "../components/Navbar.jsx";

const AboutPage = () => {
  return (
    <div
      style={{
        background: "#2e1f24",
        minHeight: "100vh",
        color: "#f3e6ec",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Navbar />
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20 w-full">
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#f3e6ec",
            marginBottom: "2rem",
            borderBottom: "1px solid rgba(207,157,184,0.2)",
            paddingBottom: "1rem",
          }}
        >
          About Juvelle
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "#e8c8d8",
          }}
        >
          <p>
            Welcome to <strong>Juvelle</strong>, your premier destination for
            elegant, meticulously woven clothing. We believe that fashion is an
            art form - a delicate balance of intricate design, quality threads,
            and timeless style.
          </p>
          <p>
            At Juvelle, we specialize in offering a curated collection of
            premium garments, with a special focus on beautifully crafted
            churidars and contemporary ethnic wear. Every piece in our store is
            selected with an eye for detail, ensuring our customers receive only
            the finest quality apparel.
          </p>
          <p>
            Our mission is simple: to provide a seamless, premium shopping
            experience from the moment you browse our collection to the day your
            order arrives at your doorstep. Whether you're dressing up for a
            special occasion or elevating your everyday wardrobe, Juvelle is
            here to bring elegance to your closet.
          </p>

          <div
            style={{
              marginTop: "2rem",
              background: "#413038",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid rgba(207,157,184,0.2)",
            }}
          >
            <h2
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "1.25rem",
                color: "#f3e6ec",
                marginBottom: "1rem",
              }}
            >
              Contact Us
            </h2>
            <p style={{ marginBottom: "0.5rem" }}>
              Juvelle is proudly owned and operated by{" "}
              <strong>Sahil Rahman</strong>. We are always here to help you with
              your orders, inquiries, or feedback.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "1rem 0 0 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>
                <strong style={{ color: "#cf9db8" }}>Owner:</strong> Sahil
                Rahman
              </li>
              <li>
                <strong style={{ color: "#cf9db8" }}>Phone:</strong>{" "}
                <a
                  href="tel:+919061506630"
                  style={{ color: "#f3e6ec", textDecoration: "none" }}
                >
                  +91 9061506630
                </a>
              </li>
              <li>
                <strong style={{ color: "#cf9db8" }}>Email:</strong>{" "}
                <a
                  href="mailto:juvelle.store@gmail.com"
                  style={{ color: "#f3e6ec", textDecoration: "none" }}
                >
                  juvelle.store@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
