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
  Icon,
  Checkbox,
  Feedback,
  Dialog
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
      // User is trying to uncheck - show confirmation dialog
      setShowConfirmDialog(true);
    } else {
      // User is checking the box - allow it
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
          message: "Message sent successfully! I'll get back to you soon.",
        });
      } else {
        // Handle subscription error gracefully
        let errorMessage = "Something went wrong. Please try again.";
        
        if (result.error) {
          // Check if the error contains "Subscription failed:" prefix
          if (typeof result.error === 'string' && result.error.includes('Subscription failed:')) {
            // Extract the JSON part after "Subscription failed: "
            const jsonPart = result.error.replace('Subscription failed: ', '');
            try {
              const parsedError = JSON.parse(jsonPart);
              if (parsedError.message) {
                errorMessage = `Subscription failed: ${parsedError.message}`;
              }
            } catch {
              // If JSON parsing fails, use the original error
              errorMessage = result.error;
            }
          } else if (typeof result.error === 'string') {
            try {
              // Try to parse JSON error message and extract just the message value
              const parsedError = JSON.parse(result.error);
              if (parsedError.message) {
                errorMessage = parsedError.message;
              }
            } catch {
              // If not JSON, use the string as is
              errorMessage = result.error;
            }
          } else if (result.error.message) {
            errorMessage = result.error.message;
          }
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = "Something went wrong. Please try again later.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      addToast({
        variant: "danger",
        message: errorMessage,
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
      >
        <Feedback
          variant="success"
          title="Message Sent Successfully!"
          description="Thank you for reaching out. I'll get back to you as soon as possible."
        />
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
          gap="24"
        >
          {/* Name Field */}
          <Input
            id="name"
            label="Name *"
            value={formData.name}
            onChange={handleInputChange("name")}
            hasPrefix={<Icon name="person" size="xs" onBackground="neutral-weak" marginLeft="4" />}
            required
          />

          {/* Email Field */}
          <Input
            id="email"
            label="Email *"
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            hasPrefix={<Icon name="email" size="xs" onBackground="neutral-weak" marginLeft="4" />}
            required
          />

          {/* Role Selection */}
          <Select
            id="role"
            label="Role *"
            options={roleOptions}
            value={formData.role}
            onSelect={handleSelectChange("role")}
            searchable={false}
            hasPrefix={<Icon name="role" size="xs" onBackground="neutral-weak" marginLeft="4" />}
          />

          {/* LinkedIn Field */}
          <Input
            id="linkedin"
            label="LinkedIn Profile"
            type="url"
            value={formData.linkedin}
            onChange={handleInputChange("linkedin")}
            hasPrefix={<Icon name="linkedin" size="xs" onBackground="neutral-weak" marginLeft="4" />}
          />

          {/* Phone Field */}
          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            hasPrefix={<Icon name="phone" size="xs" onBackground="neutral-weak" marginLeft="4" />}
          />

          {/* Message */}
          <Textarea
            id="message"
            label="Message"
            value={formData.message}
            onChange={handleInputChange("message")}
            lines={6}
            resize="vertical"
          />

          {/* Newsletter Subscription */}
          <Checkbox
            id="newsletter"
            label="Subscribe to Newsletter"
            description="Weekly updates on design, tech, and product insights"
            isChecked={formData.subscribeNewsletter}
            onToggle={handleNewsletterChange}
          />

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
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Are you sure?"
        maxWidth={16}
        padding="12"
        s={{ maxWidth: 14, padding: "8" }}
        style={{
          height: "fit-content",
          maxHeight: "80vh",
          marginTop: "20vh",
          marginBottom: "20vh"
        }}
        footer={
          <Row gap="8" horizontal="end" fillWidth>
            <Button 
              variant="secondary" 
              onClick={cancelUnsubscribe}
              size="s"
            >
              Keep Subscription
            </Button>
            <Button 
              onClick={confirmUnsubscribe}
              size="s"
            >
              Unsubscribe
            </Button>
          </Row>
        }
      >
        <Column fillWidth>
          <Text variant="body-default-s" style={{ marginBottom: "2px" }}>
            You'll miss out on exclusive resources and content
          </Text>
        </Column>
      </Dialog>
    </>
  );
}
