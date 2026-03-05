import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Store from "../components/Store.jsx";
import AuthModal from "../components/AuthModal.jsx";

const StorePage = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <Store onOpenAuth={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default StorePage;
