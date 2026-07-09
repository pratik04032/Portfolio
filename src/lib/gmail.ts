export const sendEmail = async (accessToken: string, to: string, fromName: string, fromEmail: string, messageText: string) => {
  const emailLines = [];
  emailLines.push(`To: ${to}`);
  emailLines.push('Content-type: text/html;charset=iso-8859-1');
  emailLines.push('MIME-Version: 1.0');
  emailLines.push(`Subject: Portfolio Contact from ${fromName}`);
  emailLines.push('');
  emailLines.push(`<p>You received a new message from your portfolio website.</p><p><strong>Name:</strong> ${fromName}</p><p><strong>Email:</strong> ${fromEmail}</p><p><strong>Message:</strong><br/>${messageText.replace(/\n/g, '<br/>')}</p>`);

  const email = emailLines.join('\r\n').trim();

  // URL-safe base64 encoding
  let base64EncodedEmail = btoa(unescape(encodeURIComponent(email)));
  base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64EncodedEmail,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Failed to send email: ${errorData.error?.message || res.statusText}`);
  }
};
