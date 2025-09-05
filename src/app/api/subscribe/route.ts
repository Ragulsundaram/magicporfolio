import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract data from form
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const attribs = formData.get('attribs') ? JSON.parse(formData.get('attribs') as string) : {}
    
    // Get list IDs and convert UUIDs to integers
    const lists = []
    const listEntries = formData.getAll('l')
    
    // Map UUIDs to their integer IDs
    const listMapping: Record<string, number> = {
      [process.env.NEXT_PUBLIC_CONTACT_LIST_ID || 'a4428028-1751-4c8e-8e40-0f2ab839131d']: parseInt(process.env.CONTACT_LIST_INT_ID || '1'),
      [process.env.NEXT_PUBLIC_NEWSLETTER_LIST_ID || '5d80e417-542e-422a-b15e-0b478dcd894c']: parseInt(process.env.NEWSLETTER_LIST_INT_ID || '2')
    }
    
    for (const listId of listEntries) {
      const intId = listMapping[listId as string]
      if (intId) {
        lists.push(intId)
      }
    }

    console.log('Submitting to Listmonk:', { email, name, lists, attribs })

    // Prepare data for private API
    const subscriberData = {
      email,
      name,
      status: 'enabled',
      lists,
      attribs,
      preconfirm_subscriptions: true
    }

    // Use the private API with authentication
    const response = await fetch(`${process.env.LISTMONK_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.LISTMONK_USERNAME}:${process.env.LISTMONK_PASSWORD}`).toString('base64')
      },
      body: JSON.stringify(subscriberData)
    })

    const responseText = await response.text()
    console.log('Listmonk response status:', response.status)
    console.log('Listmonk response:', responseText)

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      console.error('Listmonk error:', responseText)
      return NextResponse.json(
        { success: false, error: `Subscription failed: ${responseText}` },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
