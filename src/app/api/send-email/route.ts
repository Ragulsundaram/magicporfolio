import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function createEmailHTML(name: string, email: string, role?: string, linkedin?: string, phone?: string, message?: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <!-- Header -->
      <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      
      <!-- Main Content -->
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px; line-height: 1.5;">
          Hi Ragul,
        </p>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 30px; line-height: 1.5;">
          <strong>${name}</strong> wants to connect with you. Here are their contact details:
        </p>
        
        <!-- Contact Details Container -->
        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #10b981; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email:</strong>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${email}</p>
          </div>
          
          ${role ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #10b981; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Role:</strong>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${role}</p>
          </div>
          ` : ''}
          
          ${linkedin ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #10b981; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">LinkedIn Profile:</strong>
            <p style="margin: 5px 0 0 0; font-size: 16px;">
              <a href="${linkedin}" style="color: #10b981; text-decoration: none;" target="_blank" rel="noopener noreferrer">
                ${linkedin}
              </a>
            </p>
          </div>
          ` : ''}
          
          ${phone ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #10b981; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number:</strong>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #333;">${phone}</p>
          </div>
          ` : ''}
          
          ${message ? `
          <div style="margin-bottom: 0;">
            <strong style="color: #10b981; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message:</strong>
            <p style="margin: 5px 0 0 0; font-size: 16px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          ` : ''}
        </div>
        
        <!-- Call to Action -->
        <div style="text-align: center; margin-top: 30px;">
          <a 
            href="mailto:${email}?subject=Re: Contact Form Submission"
            style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;"
          >
            Reply to ${name}
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; padding: 15px; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">This email was sent from your contact form at ragulsundaram.in</p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    
    // Parse attributes from JSON string
    let role: string | undefined
    let linkedin: string | undefined  
    let phone: string | undefined
    let message: string | undefined
    
    const attribsString = formData.get('attribs') as string
    if (attribsString) {
      try {
        const attribs = JSON.parse(attribsString)
        role = attribs.role
        linkedin = attribs.linkedin
        phone = attribs.phone
        message = attribs.message
      } catch (error) {
        console.error('Error parsing attributes:', error)
      }
    }

    console.log('Email data:', { name, email, role, linkedin, phone, message })

    // Check if Resend is properly configured
    if (!resend) {
      console.error('Resend API key not configured')
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send email notification to you
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Using Resend's default sender
      to: [process.env.NOTIFICATION_EMAIL || 'ragulsundaram15@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: createEmailHTML(name, email, role, linkedin, phone, message),
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send email notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully',
      emailId: data?.id 
    })
  } catch (error) {
    console.error('Error in email API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
