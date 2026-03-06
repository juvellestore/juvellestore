import React from "react";
import Navbar from "../components/Navbar.jsx";

const LegalPage = () => {
  return (
    <div className="bg-midnight-truffle min-h-screen text-ivory-blush font-poppins">
      <Navbar />
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20 w-full leading-[1.7] text-[#e8c8d8]">
        {/* TERMS AND CONDITIONS */}
        <section className="mb-16">
          <h1 className="font-montserrat font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-ivory-blush mb-6 border-b border-velvet-rose-mist/20 pb-4">
            Terms and Conditions
          </h1>
          <p className="text-[0.85rem] mb-6 opacity-80">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="flex flex-col gap-5 text-[0.9rem]">
            <p>
              Welcome to Juvelle ("we", "our", "us"). By accessing or using our
              website (www.juvelle.store) and purchasing our clothing products,
              you agree to be bound by the following Terms and Conditions.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              1. Products and Sizing
            </h3>
            <p>
              We strive to display our apparel (including churidars and other
              garments) as accurately as possible. However, the actual colors
              you see will depend on your monitor. All sizes (S to 5XL) are
              based on the standard Juvelle size chart provided on the product
              pages. Slight variations in measurements may occur.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
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

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              3. Pricing and Availability
            </h3>
            <p>
              Prices are subject to change without notice. Items in your
              shopping cart reflect the current price displayed on the item's
              product details page. In the rare event of a pricing error, we
              will notify you immediately and give you the option to reconfirm
              your order at the correct price or cancel it.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              4. Payments
            </h3>
            <p>
              We accept secure online payments via Razorpay (Credit/Debit Cards,
              UPI, NetBanking) and offer Cash on Delivery (COD). For Razorpay
              transactions, your payment details are securely processed directly
              by the gateway. We do not store your card or UPI credentials on
              our servers.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              5. Shipping and Delivery
            </h3>
            <p>
              We aim to dispatch orders promptly. Delivery times may vary
              depending on your location. We are not responsible for any delays
              caused by courier services, strikes, or acts of nature.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
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
          <h1 className="font-montserrat font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-ivory-blush mb-6 border-b border-velvet-rose-mist/20 pb-4">
            Privacy Policy
          </h1>

          <div className="flex flex-col gap-5 text-[0.9rem]">
            <p>
              At Juvelle, we are committed to protecting your privacy and
              ensuring the security of your personal data. This Privacy Policy
              outlines how we collect, use, and safeguard your information.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              1. Information We Collect
            </h3>
            <p>
              We collect information you provide directly to us when creating an
              account, placing an order, or contacting us. This includes your
              name, email address, phone number, shipping address, and order
              history.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              2. How We Use Your Information
            </h3>
            <ul className="list-disc pl-6 m-0 flex flex-col gap-1">
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

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              3. Data Sharing and Third Parties
            </h3>
            <p>
              We do not sell or rent your personal information to third parties.
              We only share necessary data with trusted service providers
              required to operate our business, such as:
            </p>
            <ul className="list-disc pl-6 m-0 flex flex-col gap-1">
              <li>
                <strong>Payment Gateways (Razorpay):</strong> To securely
                process transactions.
              </li>
              <li>
                <strong>Courier/Delivery Services:</strong> To ship your
                purchased garments.
              </li>
            </ul>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              4. Data Security
            </h3>
            <p>
              We implement industry-standard security measures to protect your
              personal information. Your account password is cryptographically
              hashed, and all communication between your browser and our servers
              is encrypted via HTTPS.
            </p>

            <h3 className="text-ivory-blush text-[1.1rem] mt-4 mb-2">
              5. Your Rights
            </h3>
            <p>
              You have the right to access, update, or request deletion of your
              personal data. You can update your profile directly via your
              account dashboard or contact us for assistance.
            </p>

            <div className="mt-6 p-6 bg-velvet-rose-mist/5 rounded-md border border-velvet-rose-mist/20">
              <p className="m-0 text-ivory-blush font-medium">
                Contact for Privacy/Legal Concerns:
              </p>
              <p className="mt-2 mb-0">Juvelle Store, owned by Sahil Rahman</p>
              <p className="mt-1 mb-0">Email: juvelle.store@gmail.com</p>
              <p className="mt-1 mb-0">Phone: +91 9061506630</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LegalPage;
