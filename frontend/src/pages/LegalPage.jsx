import React from "react";
import Navbar from "../components/Navbar.jsx";

const LegalPage = () => {
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
      <div
        className="max-w-[800px] mx-auto px-6 py-12 md:py-20 w-full"
        style={{ lineHeight: 1.7, color: "#e8c8d8" }}
      >
        {/* TERMS AND CONDITIONS */}
        <section style={{ marginBottom: "4rem" }}>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#f3e6ec",
              marginBottom: "1.5rem",
              borderBottom: "1px solid rgba(207,157,184,0.2)",
              paddingBottom: "1rem",
            }}
          >
            Terms and Conditions
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              opacity: 0.8,
            }}
          >
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              fontSize: "0.9rem",
            }}
          >
            <p>
              Welcome to Juvelle ("we", "our", "us"). By accessing or using our
              website (www.juvelle.store) and purchasing our clothing products,
              you agree to be bound by the following Terms and Conditions.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              1. Products and Sizing
            </h3>
            <p>
              We strive to display our apparel (including churidars and other
              garments) as accurately as possible. However, the actual colors
              you see will depend on your monitor. All sizes (S to 5XL) are
              based on the standard Juvelle size chart provided on the product
              pages. Slight variations in measurements may occur.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              2. Orders and Acceptance
            </h3>
            <p>
              By placing an order, you are offering to purchase a product
              subject to these terms. All orders are subject to availability and
              confirmation of the order price. We reserve the right to refuse
              any request made by you. Upon placing an order, you will receive
              an acknowledgement email/notification. This is not an acceptance
              of your order; acceptance occurs when we approve the payment and
              dispatch the goods.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              3. Pricing and Availability
            </h3>
            <p>
              Prices are subject to change without notice. Items in your
              shopping cart reflect the current price displayed on the item's
              product details page. In the rare event of a pricing error, we
              will notify you immediately and give you the option to reconfirm
              your order at the correct price or cancel it.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              4. Payments
            </h3>
            <p>
              We accept secure online payments via Razorpay (Credit/Debit Cards,
              UPI, NetBanking) and offer Cash on Delivery (COD). For Razorpay
              transactions, your payment details are securely processed directly
              by the gateway. We do not store your card or UPI credentials on
              our servers.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              5. Shipping and Delivery
            </h3>
            <p>
              We aim to dispatch orders promptly. Delivery times may vary
              depending on your location. We are not responsible for any delays
              caused by courier services, strikes, or acts of nature.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              6. Returns and Exchanges
            </h3>
            <p>
              Please refer to our Return Policy (if applicable). Garments must
              be returned unworn, unwashed, and with all original tags attached.
              We reserve the right to reject returns that do not meet these
              conditions.
            </p>
          </div>
        </section>

        {/* PRIVACY POLICY */}
        <section>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#f3e6ec",
              marginBottom: "1.5rem",
              borderBottom: "1px solid rgba(207,157,184,0.2)",
              paddingBottom: "1rem",
            }}
          >
            Privacy Policy
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              fontSize: "0.9rem",
            }}
          >
            <p>
              At Juvelle, we are committed to protecting your privacy and
              ensuring the security of your personal data. This Privacy Policy
              outlines how we collect, use, and safeguard your information.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              1. Information We Collect
            </h3>
            <p>
              We collect information you provide directly to us when creating an
              account, placing an order, or contacting us. This includes your
              name, email address, phone number, shipping address, and order
              history.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              2. How We Use Your Information
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "1.5rem",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <li>
                To process and fulfill your orders (including shipping and
                payment verification).
              </li>
              <li>
                To communicate with you regarding your order status or support
                inquiries.
              </li>
              <li>To manage your Juvelle account and order history.</li>
              <li>
                To improve our website functionality and customer experience.
              </li>
            </ul>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              3. Data Sharing and Third Parties
            </h3>
            <p>
              We do not sell or rent your personal information to third parties.
              We only share necessary data with trusted service providers
              required to operate our business, such as:
            </p>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "1.5rem",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <li>
                <strong>Payment Gateways (Razorpay):</strong> To securely
                process transactions.
              </li>
              <li>
                <strong>Courier/Delivery Services:</strong> To ship your
                purchased garments.
              </li>
            </ul>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              4. Data Security
            </h3>
            <p>
              We implement industry-standard security measures to protect your
              personal information. Your account password is cryptographically
              hashed, and all communication between your browser and our servers
              is encrypted via HTTPS.
            </p>

            <h3
              style={{
                color: "#f3e6ec",
                fontSize: "1.1rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              5. Your Rights
            </h3>
            <p>
              You have the right to access, update, or request deletion of your
              personal data. You can update your profile directly via your
              account dashboard or contact us for assistance.
            </p>

            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.5rem",
                background: "rgba(207,157,184,0.05)",
                borderRadius: "6px",
                border: "1px solid rgba(207,157,184,0.2)",
              }}
            >
              <p style={{ margin: 0, color: "#f3e6ec", fontWeight: 500 }}>
                Contact for Privacy/Legal Concerns:
              </p>
              <p style={{ margin: "0.5rem 0 0 0" }}>
                Juvelle Store, owned by Sahil Rahman
              </p>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                Email: juvelle.store@gmail.com
              </p>
              <p style={{ margin: "0.25rem 0 0 0" }}>Phone: +91 9061506630</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LegalPage;
