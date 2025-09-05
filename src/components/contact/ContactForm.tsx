"use client";

import React, { useState } from "react";
import { 
  Column, 
  Row, 
  Input, 
  Button, 
  Text, 
  useToast, 
  Textarea,
  Select,
  Icon
} from "@once-ui-system/core";
import styles from "./ContactForm.module.scss";

interface ContactFormData {
  name: string;
  email: string;
  role: string;
  linkedin: string;
  phone: string;
  message: string;
  subscribeNewsletter: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    role: "",
    linkedin: "",
    phone: "",
    message: "",
    subscribeNewsletter: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { addToast } = useToast();

  const roleOptions = [
    { label: "Developer", value: "Developer" },
    { label: "Designer", value: "Designer" },
    { label: "Project Manager", value: "Project Manager" },
    { label: "Product Manager", value: "Product Manager" },
    { label: "Student", value: "Student" },
    { label: "Other", value: "Other" },
  ];

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof ContactFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewsletterChange = () => {
    if (formData.subscribeNewsletter) {
      setShowConfirmDialog(true);
    } else {
      setFormData(prev => ({
        ...prev,
        subscribeNewsletter: true,
      }));
    }
  };

  const confirmUnsubscribe = () => {
    setFormData(prev => ({
      ...prev,
      subscribeNewsletter: false,
    }));
    setShowConfirmDialog(false);
  };

  const cancelUnsubscribe = () => {
    setShowConfirmDialog(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Collect attributes for Listmonk (without message)
      const listmonkAttributes: Record<string, any> = {};
      
      if (formData.role) {
        listmonkAttributes.role = formData.role;
      }
      
      if (formData.linkedin) {
        listmonkAttributes.linkedin = formData.linkedin;
      }
      
      if (formData.phone) {
        listmonkAttributes.phone = formData.phone;
      }

      // Collect all attributes including message for email
      const emailAttributes: Record<string, any> = { ...listmonkAttributes };
      if (formData.message) {
        emailAttributes.message = formData.message;
      }

      // Create the submission form data for Listmonk (without message)
      const listmonkData = new FormData();
      listmonkData.append('email', formData.email);
      listmonkData.append('name', formData.name);
      
      // Add attributes as JSON string for Listmonk (without message)
      if (Object.keys(listmonkAttributes).length > 0) {
        listmonkData.append('attribs', JSON.stringify(listmonkAttributes));
      }
      
      // Always add the contact me list
      listmonkData.append('l', process.env.NEXT_PUBLIC_CONTACT_LIST_ID || 'a4428028-1751-4c8e-8e40-0f2ab839131d');
      
      // Add the newsletter subscription if checked
      if (formData.subscribeNewsletter) {
        listmonkData.append('l', process.env.NEXT_PUBLIC_NEWSLETTER_LIST_ID || '5d80e417-542e-422a-b15e-0b478dcd894c');
      }

      // Submit to Listmonk
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: listmonkData,
      });

      const result = await response.json();

      if (result.success) {
        // Send email notification with all data including message
        try {
          const emailData = new FormData();
          emailData.append('email', formData.email);
          emailData.append('name', formData.name);
          emailData.append('attribs', JSON.stringify(emailAttributes)); // Includes message
          
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            body: emailData,
          });
          
          const emailResult = await emailResponse.json();
          if (!emailResult.success) {
            console.error('Email notification failed:', emailResult.error);
            // Don't fail the main submission if email fails
          }
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't fail the main submission if email fails
        }
        
        setIsSubmitted(true);
        addToast({
          variant: "success",
          message: "Thank you for your message! I'll get back to you soon.",
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      addToast({
        variant: "danger",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Column 
        fillWidth 
        gap="24" 
        horizontal="center" 
        vertical="center"
        padding="40"
        minHeight="20"
        radius="l"
        border="neutral-alpha-medium"
        background="neutral-alpha-weak"
      >
        <Icon name="email" size="xl" onBackground="brand-medium" />
        <Column gap="8" horizontal="center">
          <Text variant="heading-strong-l" align="center">
            <Text onBackground="neutral-strong">Submitted</Text>{' '}
            <Text onBackground="brand-medium">Successfully!</Text>
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            Thank you for reaching out, I'll get back to you soon.
          </Text>
        </Column>
      </Column>
    );
  }

  return (
    <>
      <div className={styles.contactForm}>
        <Column 
          as="form" 
          onSubmit={handleSubmit}
          fillWidth 
          gap="32"
        >
          {/* Name and Email Row - Responsive */}
          <Row gap="16" wrap>
            <Column flex={1} minWidth="16" gap="8">
              <div style={{ paddingLeft: "16px" }}>
                <Text variant="label-default-s" onBackground="neutral-medium">
                  Name *
                </Text>
              </div>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Your full name"
                hasPrefix={<Icon name="person" size="xs" onBackground="neutral-weak" />}
                required
              />
            </Column>
            <Column flex={1} minWidth="16" gap="8">
              <div style={{ paddingLeft: "16px" }}>
                <Text variant="label-default-s" onBackground="neutral-medium">
                  Email *
                </Text>
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="your.email@example.com"
                hasPrefix={<Icon name="email" size="xs" onBackground="neutral-weak" />}
                required
              />
            </Column>
          </Row>

          {/* Role Selection */}
          <Column gap="8">
            <div style={{ paddingLeft: "16px" }}>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Role *
              </Text>
            </div>
            <Select
              id="role"
              options={roleOptions}
              value={formData.role}
              onSelect={handleSelectChange("role")}
              searchable={false}
            />
          </Column>

          {/* LinkedIn and Phone Row - Responsive */}
          <Row gap="16" wrap>
            <Column flex={1} minWidth="16" gap="8">
              <div style={{ paddingLeft: "16px" }}>
                <Text variant="label-default-s" onBackground="neutral-medium">
                  LinkedIn Profile
                </Text>
              </div>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleInputChange("linkedin")}
                placeholder="https://linkedin.com/in/yourprofile"
                hasPrefix={<Icon name="linkedin" size="xs" onBackground="neutral-weak" />}
              />
            </Column>
            <Column flex={1} minWidth="16" gap="8">
              <div style={{ paddingLeft: "16px" }}>
                <Text variant="label-default-s" onBackground="neutral-medium">
                  Phone Number
                </Text>
              </div>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="+91 12345 67890"
              />
            </Column>
          </Row>

          {/* Message */}
          <Column gap="8">
            <div style={{ paddingLeft: "16px" }}>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Message
              </Text>
            </div>
            <Textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange("message")}
              placeholder="Tell me about your project, ideas, or how I can help you..."
              lines={6}
              resize="vertical"
            />
          </Column>

          {/* Newsletter Subscription */}
          <Column gap="16">
            <Text variant="label-default-s" onBackground="neutral-medium">
              Subscribe to
            </Text>
            
            <Column gap="8">
              <Row gap="8" vertical="center">
                <Icon name="email" size="s" onBackground="brand-medium" />
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Contact Me List (automatically included)
                </Text>
              </Row>
              
              <Row gap="12" vertical="center">
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={formData.subscribeNewsletter}
                  onChange={handleNewsletterChange}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "var(--brand-medium)",
                  }}
                />
                <Column gap="4">
                  <Text variant="body-default-s" onBackground="neutral-strong">
                    Subscribe to Newsletter
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Weekly updates on design, tech, and product insights
                  </Text>
                </Column>
              </Row>
            </Column>
          </Column>

          {/* Submit Button */}
          <Row horizontal="end">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!formData.name || !formData.email || !formData.role}
              prefixIcon="email"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </Row>
        </Column>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "16px",
          }}
        >
          <Column
            background="page"
            radius="l"
            padding="32"
            maxWidth="20"
            border="neutral-alpha-medium"
            gap="24"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Column gap="16" horizontal="center">
              <Text variant="heading-strong-l" onBackground="neutral-strong" align="center">
                Are you sure?
              </Text>
              <Text variant="body-default-m" onBackground="neutral-weak" align="center">
                You'll miss out on exclusive resources and content
              </Text>
            </Column>
            
            <Row gap="12">
              <Button
                variant="tertiary"
                fillWidth
                onClick={confirmUnsubscribe}
              >
                Unsubscribe
              </Button>
              <Button
                variant="primary"
                fillWidth
                onClick={cancelUnsubscribe}
              >
                Keep Subscription
              </Button>
            </Row>
          </Column>
        </div>
      )}
    </>
  );
}
