import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import { generateWhatsAppLink } from "../../utils/whatsappLink";
import { FaWhatsapp } from "react-icons/fa";

export default function LeadModal({ isOpen, onClose, baseMessage }) {
  const [source, setSource] = useState("Instagram");
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");

  const sources = [
    "Instagram",
    "Facebook",
    "Google Search",
    "Friend / Recommendation",
    "Ngong Road Showroom",
    "Other",
  ];

  const handleProceed = () => {
    setError("");
    let finalSource = source;

    if (source === "Other") {
      if (!otherText.trim()) {
        setError("Please specify how you heard about us.");
        return;
      }
      finalSource = otherText.trim();
    }

    // Append the source to the base inquiry message
    const finalMessage = `${baseMessage}\n\n(I heard about gleamy via: ${finalSource})`;
    const link = generateWhatsAppLink(finalMessage);

    // Open WhatsApp
    window.open(link, "_blank", "noopener,noreferrer");

    // Reset state & close
    setOtherText("");
    onClose();
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
        <p className="text-xs text-charcoal-text/80 leading-relaxed font-medium">
          Naomi & Ivan would love to know: **How did you hear about gleamy Baby
          Cots & Furniture?**
        </p>

        <div className="grid grid-cols-1 gap-2.5 pt-2">
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
      </div>
    </Modal>
  );
}
