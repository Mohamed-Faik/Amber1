"use client";
import React from "react";
import contactinfo1 from "../../../public/images/contact-info/contact-info-1.png";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import contactinfo2 from "../../../public/images/contact-info/contact-info-2.png";
import contactinfo3 from "../../../public/images/contact-info/contact-info-3.png";

const ContactInfo = () => {
  const contactItems = [
    {
      icon: Phone,
      title: "Call Us",
      links: [
        { href: "tel:(257)-563-7401", text: "(257) 563-7401" },
        { href: "tel:(372)-587-2335", text: "(372) 587-2335" },
      ],
      image: contactinfo1,
    },
    {
      icon: Mail,
      title: "Mail Us",
      links: [
        { href: "mailto:hello@amberhomes.com", text: "hello@amberhomes.com" },
        { href: "mailto:info@amberhomes.com", text: "info@amberhomes.com" },
      ],
      image: contactinfo2,
    },
    {
      icon: MapPin,
      title: "Visit Us",
      text: "Cecilia Chapman, 711-2880 Nulla St. Mankato Mississippi 96522",
      image: contactinfo3,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
      }}
      className="contact-info-grid"
    >
      {contactItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid #E0E0E0",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
            className="contact-info-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.08)";
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #FF385C 0%, #E61E4D 50%, #D70466 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 4px 12px rgba(255, 56, 92, 0.25)",
              }}
            >
              <IconComponent size={32} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#222222",
                margin: "0 0 16px 0",
                letterSpacing: "-0.3px",
              }}
            >
              {item.title}
            </h3>
            {item.links ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {item.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    style={{
                      fontSize: "15px",
                      color: "#717171",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FF385C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#717171";
                    }}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: "15px",
                  color: "#767676",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {item.text}
              </p>
            )}
          </div>
        );
      })}
      <style jsx>{`
        /* Tablet: 768px - 991px */
        @media (max-width: 991px) {
          .contact-info-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .contact-info-card {
            padding: 24px !important;
          }
        }

        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .contact-info-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .contact-info-card {
            padding: 24px 20px !important;
          }
          .contact-info-card h3 {
            font-size: 18px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .contact-info-card {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactInfo;
