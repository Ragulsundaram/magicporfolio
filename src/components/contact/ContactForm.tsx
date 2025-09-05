"use client";

import React, { useState } from "react";
import { Column, Row, Input, Button, Text, useToast } from "@once-ui-system/core";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement Listmonk API integration here
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      addToast({
        variant: "success",
        message: "Thank you for your message! I'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      addToast({
        variant: "danger",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column 
      as="form" 
      onSubmit={handleSubmit}
      fillWidth 
      gap="24"
    >
      <Row gap="16" wrap>
        <Column flex={1} minWidth="16">
          <Input
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange("name")}
            placeholder="Your name"
            required
          />
        </Column>
        <Column flex={1} minWidth="16">
          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            placeholder="your.email@example.com"
            required
          />
        </Column>
      </Row>

      <Input
        id="subject"
        label="Subject"
        value={formData.subject}
        onChange={handleInputChange("subject")}
        placeholder="What's this about?"
        required
      />

      <Column gap="8">
        <Text variant="label-default-s" onBackground="neutral-medium">
          Message
        </Text>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleInputChange("message")}
          placeholder="Tell me about your project, idea, or just say hello..."
          required
          rows={6}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid var(--neutral-alpha-medium)",
            backgroundColor: "var(--neutral-alpha-weak)",
            borderRadius: "8px",
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            outline: "none",
            color: "var(--neutral-on-background-medium)",
          }}
        />
      </Column>

      <Row horizontal="end">
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </Row>
    </Column>
  );
}
