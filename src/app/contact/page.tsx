import { Column, Heading, Meta, Schema, Row, Text, Card, Icon, Button } from "@once-ui-system/core";
import { baseURL, about, person, contact } from "@/resources";
import { ContactForm } from "@/components";
import styles from "./Contact.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: contact.title,
    description: contact.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(contact.title)}`,
    path: contact.path,
  });
}

export default function Contact() {
  return (
    <Column maxWidth="l" paddingTop="24" paddingX="16">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={contact.path}
        title={contact.title}
        description={contact.description}
        image={`/api/og/generate?title=${encodeURIComponent(contact.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      
      {/* Hero Section */}
      <Column gap="24" marginBottom="64" horizontal="center">
        <Heading variant="heading-strong-xl" align="center">
          <Text onBackground="neutral-strong">Let's </Text>
          <Text onBackground="brand-medium">Connect</Text>
        </Heading>
        
        <Column horizontal="center" maxWidth={32}>
          <Text 
            variant="body-default-l" 
            onBackground="neutral-weak" 
            align="center"
          >
            Ready to collaborate or have questions?
          </Text>
        </Column>
      </Column>

      {/* Main Content - Properly Responsive Layout */}
      <div className={styles.responsiveLayout}>
        
        {/* Left Column - Profile & Social */}
        <div className={styles.leftColumn}>
          <Column gap="32">
            
            {/* Contact Info Card */}
            <Card
              radius="l"
              border="neutral-alpha-medium"
              background="neutral-alpha-weak"
              padding="24"
              fillWidth
            >
              <Row gap="16" vertical="start">
                {/* Profile Photo */}
                <Column fillWidth={false}>
                  <img
                    src="/images/avatar.jpg"
                    alt="Ragul Sundaram"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "16px",
                      objectFit: "cover",
                      border: "2px solid var(--brand-medium)",
                    }}
                  />
                </Column>
                
                {/* Profile Info */}
                <Column gap="12" flex={1}>
                  {/* Available Status */}
                  <Row gap="8" vertical="center">
                    <div 
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "var(--brand-medium)",
                        borderRadius: "50%",
                        opacity: 1,
                      }}
                    />
                    <Text variant="body-default-xs" onBackground="brand-medium">
                      Available To Work
                    </Text>
                  </Row>
                  
                  {/* Name & Role */}
                  <Column gap="4">
                    <Text variant="label-strong-l" onBackground="neutral-strong">
                      Ragul Sundaram
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      Product Manager
                    </Text>
                  </Column>
                  
                  {/* Contact Details */}
                  <Column gap="8">
                    <Row gap="8" vertical="center">
                      <Icon name="email" size="xs" onBackground="brand-medium" />
                      <Text variant="body-default-s" onBackground="neutral-medium">
                        ragul@ragulsundaram.in
                      </Text>
                    </Row>
                    
                    <Row gap="8" vertical="center">
                      <Icon name="globe" size="xs" onBackground="brand-medium" />
                      <Text variant="body-default-s" onBackground="neutral-medium">
                        Chennai, India
                      </Text>
                    </Row>
                  </Column>
                </Column>
              </Row>
            </Card>

            {/* Social Links */}
            <Column gap="16">
              <Text variant="label-strong-m" onBackground="neutral-strong">
                Follow Me
              </Text>
              
              <Column gap="12">
                <Card
                  href="https://www.linkedin.com/in/ragulsundaram/"
                  radius="m"
                  border="neutral-alpha-medium"
                  background="neutral-alpha-weak"
                  padding="16"
                  fillWidth
                >
                  <Row gap="12" vertical="center">
                    <Icon name="linkedin" size="m" onBackground="brand-medium" />
                    <Column gap="2">
                      <Text variant="label-default-m" onBackground="neutral-strong">
                        LinkedIn
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        18K+ Followers • Professional Updates
                      </Text>
                    </Column>
                  </Row>
                </Card>
                
                <Card
                  href="https://www.instagram.com/ragulsundaram/"
                  radius="m"
                  border="neutral-alpha-medium"
                  background="neutral-alpha-weak"
                  padding="16"
                  fillWidth
                >
                  <Row gap="12" vertical="center">
                    <Icon name="instagram" size="m" onBackground="brand-medium" />
                    <Column gap="2">
                      <Text variant="label-default-m" onBackground="neutral-strong">
                        Instagram
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        17K+ Followers • Behind the Scenes
                      </Text>
                    </Column>
                  </Row>
                </Card>
              </Column>
            </Column>
          </Column>
        </div>

        {/* Right Column - Contact Form */}
        <div className={styles.rightColumn}>
          <Card
            radius="l"
            border="neutral-alpha-medium"
            background="neutral-alpha-weak"
            padding="32"
            fillWidth
          >
            <Column gap="24">
              <Column gap="12">
                <Text variant="heading-strong-l" onBackground="neutral-strong">
                  Send me a message
                </Text>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Fill out the form below and I'll get back to you as soon as possible.
                </Text>
              </Column>
              
              <ContactForm />
            </Column>
          </Card>
        </div>
      </div>
    </Column>
  );
}