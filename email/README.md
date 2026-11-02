# Email signature

`signature.html` is the signature for the emails you send yourself (replies to boarding passes,
offers…), in the website's look: the dark board strip with the FJ badge and the dotted flight
line, then the contact rows coded like the site's footer (WEB, EML, WAP, LIN, GIT).

It has no images and uses only tables and inline styles, so it looks the same in Outlook, Gmail
and Apple Mail and needs nothing hosted. This folder isn't part of the website.

## Install it

1. Open `signature.html` in your browser (double-click it).
2. Press **Ctrl+A** to select it and **Ctrl+C** to copy it.
3. Paste it (**Ctrl+V**) into your mail app's signature editor:

   - **Outlook (new Outlook for Windows, or Outlook on the web):**
     Settings (⚙) → **Konten** → **Signaturen** (Accounts → Signatures) → **+ Neue Signatur**,
     name it "Frank Jordan", paste. Under **Standardsignaturen**, choose it for new messages
     and for replies and forwards (**Antworten/Weiterleiten**). Save.
   - **IONOS Webmail:** Settings → **E-Mail** → **Signatur**, paste, save.
   - **Gmail:** Settings (⚙) → **See all settings** → **General** → **Signature** → **Create new**,
     paste, choose it for new emails and replies, then **Save changes** at the bottom.

4. Send yourself a test email to check it.

## Changing it

The details (address, phone, links) are written in `signature.html`; keep them in step with
`src/utils/site.ts`. After editing, open the file in your browser again and repeat the steps.
