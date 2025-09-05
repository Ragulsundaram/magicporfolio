import { Column, Heading, Meta, Schema, Row, Text, Card, Icon, Button } from "@once-ui-system/core";
import { baseURL, about, person, contact } from "@/resources";
import { ContactForm } from "@/components";

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
    <Column maxWidth="m" paddingTop="24">
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
      
      {/* Page Header */}
      <Column gap="24" marginBottom="40">
        <Heading marginBottom="l" variant="heading-strong-xl" align="center">
          {contact.label}
        </Heading>
        
        {contact.intro.display && (
          <Column gap="16" horizontal="center" maxWidth={32}>
            <Heading variant="heading-strong-l" align="center">
              {contact.intro.title}
            </Heading>
            <Text 
              variant="body-default-l" 
              onBackground="neutral-weak" 
              align="center"
            >
              {contact.intro.description}
            </Text>
          </Column>
        )}
      </Column>

      {/* Contact Methods */}
      {contact.methods.display && (
        <Column gap="32" marginBottom="64">
          <Row gap="24" wrap horizontal="center">
            {contact.methods.items.map((method, index) => (
              <Card
                key={index}
                href={method.link}
                radius="l"
                border="neutral-alpha-medium"
                background="neutral-alpha-weak"
                padding="24"
                direction="column"
                gap="16"
                minWidth="16"
                horizontal="start"
                vertical="center"
              >
                <Row gap="12" vertical="center">
                  <Icon 
                    name={method.icon} 
                    size="l" 
                    onBackground="brand-medium"
                  />
                  <Column gap="4">
                    <Text variant="label-strong-m" onBackground="neutral-strong">
                      {method.name}
                    </Text>
                    <Text variant="body-default-s" onBackground="brand-medium">
                      {method.value}
                    </Text>
                  </Column>
                </Row>
                {method.description && (
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {method.description}
                  </Text>
                )}
              </Card>
            ))}
          </Row>
        </Column>
      )}

      {/* Contact Form */}
      {contact.form.display && (
        <Column gap="24">
          <Column gap="12" horizontal="center" maxWidth={32}>
            <Heading variant="heading-strong-l" align="center">
              {contact.form.title}
            </Heading>
            {contact.form.description && (
              <Text 
                variant="body-default-m" 
                onBackground="neutral-weak" 
                align="center"
              >
                {contact.form.description}
              </Text>
            )}
          </Column>
          
          <Card
            radius="l"
            border="neutral-alpha-medium"
            background="neutral-alpha-weak"
            padding="32"
            maxWidth={32}
            horizontal="center"
          >
            <ContactForm />
          </Card>
        </Column>
      )}
    </Column>
  );
}
