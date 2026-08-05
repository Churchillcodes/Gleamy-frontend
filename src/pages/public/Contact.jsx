import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getContactFormLink } from "../../utils/whatsappLink";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    // Phone validation (Kenyan format regex: ^(?:\+254|254|0)(7\d{8}|1\d{8})$)
    const kenyanPhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!kenyanPhoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone =
        "Please enter a valid Kenyan phone number (e.g. 0712345678 or +254712345678).";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message or inquiry details.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        "Inquiry details should be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    const { name, phone, message } = formData;
    const link = getContactFormLink(name, phone, message);

    toast.success("Opening WhatsApp to send your inquiry...");

    // Wait a brief moment before opening the link
    setTimeout(() => {
      window.open(link, "_blank", "noopener,noreferrer");
      // Clear form
      setFormData({ name: "", phone: "", message: "" });
    }, 1000);
  };

  const contactDetails = [
    {
      icon: FaMapMarkerAlt,
      title: "Showroom & Workshop",
      content: "Huruma Corner, Nairobi, Kenya",
    },
    {
      icon: FaPhoneAlt,
      title: "Call Support",
      content: "+254 719748944/+254 748667273",
      href: "tel:+254 719748944",
    },
    {
      icon: FaEnvelope,
      title: "Email Address",
      content: "gleamycots@gmail.com",
      href: "mailto:gleamycots@gmail.com",
    },
    {
      icon: FaClock,
      title: "Business Hours",
      content: "Monday - Saturday: 8:00 AM - 7:00 PM (Closed Sundays)",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-walnut-brown leading-tight">
          Contact Gleamy Baby Cots & Furniture
        </h1>
        <p className="text-sm sm:text-base text-charcoal-text/75 font-medium">
          Have questions about pricing, dimensions, wood finishes, or delivery
          options? Fill out the details below to open a direct WhatsApp inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Contact Info (Left) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-walnut-brown/10 shadow-xs space-y-6">
            <h3 className="font-heading text-lg font-bold text-walnut-brown pb-2 border-b border-walnut-brown/10">
              Get in touch
            </h3>

            <div className="space-y-6">
              {contactDetails.map((det, idx) => {
                const Icon = det.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="p-3 rounded-xl bg-walnut-brown/5 text-walnut-brown shrink-0 h-11 w-11 flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-walnut-brown">
                        {det.title}
                      </h4>
                      {det.href ? (
                        <a
                          href={det.href}
                          className="text-xs sm:text-sm text-charcoal-text/75 hover:text-walnut-brown transition-colors font-medium mt-0.5 block"
                        >
                          {det.content}
                        </a>
                      ) : (
                        <p className="text-xs sm:text-sm text-charcoal-text/75 font-medium mt-0.5">
                          {det.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Chat card */}
          <div className="bg-whatsapp-green/5 border border-whatsapp-green/20 p-8 rounded-3xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-whatsapp-green text-white flex items-center justify-center shadow-md">
              <FaWhatsapp size={24} />
            </div>
            <h4 className="font-heading text-base font-bold text-charcoal-text">
              Direct WhatsApp Support
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-text/70 leading-relaxed font-medium">
              Want to start a conversation without using the form? Click below
              to chat directly with Naomi and Ivan about available models.
            </p>
            <a
              href={`https://wa.me/254719748944`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-whatsapp-green hover:bg-whatsapp-green/95 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-98"
            >
              <FaWhatsapp size={16} /> Open Chat
            </a>
          </div>
        </div>

        {/* Contact Form (Right) */}
        <div className="lg:col-span-3 bg-white p-8 sm:p-10 rounded-3xl border border-walnut-brown/10 shadow-xs">
          <h3 className="font-heading text-lg font-bold text-walnut-brown pb-3 border-b border-walnut-brown/10 mb-6">
            Inquiry Form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Your Full Name"
              name="name"
              placeholder="e.g. Naomi Wambui"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              label="Kenyan Phone Number"
              name="phone"
              placeholder="e.g. 0719748944"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />

            <Input
              type="textarea"
              label="Furniture Specifications & Inquiry Details"
              name="message"
              placeholder="Write specifications here. E.g. dimensions, color choice, delivery options, or cots designs you prefer..."
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                icon={FaWhatsapp}
                className="py-3"
              >
                Send Inquiry via WhatsApp
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
