import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import { generateWhatsAppLink } from "../../utils/whatsappLink";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { leadApi } from "../../api/leadApi";
import {
  saveCustomerDetails,
  loadCustomerDetails,
  clearCustomerDetails,
} from "../../utils/customerStorage";

export default function LeadModal({ isOpen, onClose, baseMessage, product }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [source, setSource] = useState("Instagram");

  useEffect(() => {
    if (!isOpen) return;

    const saved = loadCustomerDetails();

    if (saved) {
      setCustomerName(saved.customerName);
      setCustomerPhone(saved.customerPhone);
    }
  }, [isOpen]);

  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");

  const sources = [
    "Instagram",
    "Facebook",
    "Google Search",
    "Friend / Recommendation",
    "Huruma Corner Showroom",
    "Other",
  ];

  const handleProceed = async () => {
    try {
      setError("");

      if (!customerName.trim()) {
        setError("Please enter your name");
        return;
      }

      if (!customerPhone.trim()) {
        setError("Please enter your phone number");
        return;
      }

      let finalSource = source;

      if (source === "Other") {
        if (!otherText.trim()) {
          setError("Please specify how you heard about us.");
          return;
        }

        finalSource = otherText.trim();
      }

      await leadApi.createLead({
        customerName,
        customerPhone,
        source: finalSource,
        product: product._id,
        productName: product.name,
      });

      const finalMessage =
        `${baseMessage}\n\n` + `(Lead Source: ${finalSource})`;

      const link = generateWhatsAppLink(finalMessage);

      window.open(link, "_blank", "noopener,noreferrer");

      saveCustomerDetails({
        customerName,
        customerPhone,
      });
      toast.success("Redirecting to WhatsApp...");

      setOtherText("");
      setSource("Instagram");

      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save inquiry.");
    }
  };

  const footerActions = (
    <div className="flex gap-2 w-full justify-end">
      <Button variant="outline" size="sm" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="whatsapp"
        size="sm"
        onClick={handleProceed}
        icon={FaWhatsapp}
      >
        Continue to WhatsApp
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Question before WhatsApp"
      footerActions={footerActions}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-charcoal-text/80 leading-relaxed">
          Before we connect on WhatsApp, we'd love to know a little about you.
          This information helps us understand where our customers come from and
          improve our service.
        </p>

        <p className="text-xs text-charcoal-text/60">
          We'll remember your name and phone number on this device for 30 days
          so future inquiries are quicker. You can remove them anytime below.
        </p>

        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            setError("");
          }}
          required
        />

        <Input
          label="Phone Number"
          placeholder="07XXXXXXXX"
          value={customerPhone}
          onChange={(e) => {
            setCustomerPhone(e.target.value);
            setError("");
          }}
          required
        />

        <div className="pt-2">
          <p className="text-xs font-semibold text-charcoal-text mb-2">
            How did you hear about Gleamy?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {sources.map((src) => (
            <label
              key={src}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                source === src
                  ? "border-walnut-brown bg-walnut-brown/5 text-walnut-brown"
                  : "border-walnut-brown/10 hover:border-walnut-brown/25 text-charcoal-text bg-white"
              }`}
            >
              <input
                type="radio"
                name="leadSource"
                value={src}
                checked={source === src}
                onChange={() => {
                  setSource(src);
                  setError("");
                }}
                className="text-walnut-brown focus:ring-walnut-brown/30 w-4 h-4 cursor-pointer"
              />
              <span>{src}</span>
            </label>
          ))}
        </div>

        {source === "Other" && (
          <div className="animate-fadeIn pt-1">
            <Input
              placeholder="e.g. Tiktok, Pinterest, Flyer"
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value);
                setError("");
              }}
              error={error}
              required
            />
          </div>
        )}

        {error && source !== "Other" && (
          <p className="text-xs text-red-600 font-semibold pl-1 animate-fadeIn">
            {error}
          </p>
        )}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              clearCustomerDetails();
              setCustomerName("");
              setCustomerPhone("");
              toast.success("Saved details removed.");
            }}
            className="text-xs text-walnut-brown/60 hover:text-walnut-brown underline transition-colors"
          >
            Clear saved name & phone
          </button>
        </div>
      </div>
    </Modal>
  );
}
