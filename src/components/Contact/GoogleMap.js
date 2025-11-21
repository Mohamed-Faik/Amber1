"use client";
import React from "react";

const GoogleMap = () => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
      className="google-map-container"
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91556.60989837555!2d-94.1333386232166!3d44.18349857602407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f430a6041e8569%3A0x7133c5f5ac64ed0!2sMankato%2C%20MN%2C%20USA!5e0!3m2!1sen!2sbd!4v1691042374679!5m2!1sen!2sbd"
        width="100%"
        height="450"
        style={{
          border: "0",
          display: "block",
        }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="AmberHomes Location"
      />
      <style jsx>{`
        /* Tablet: 768px - 991px */
        @media (max-width: 991px) {
          .google-map-container iframe {
            height: 400px !important;
          }
        }

        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .google-map-container iframe {
            height: 350px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .google-map-container iframe {
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GoogleMap;
