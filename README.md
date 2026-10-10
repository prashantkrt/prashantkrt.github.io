# MyLearningDesk Portfolio — V9

A static, responsive portfolio using the original V3 visual design, with updated skills, experience details, social links, a browser-tab favicon, and a contact form modal. The homepage remains a professional profile; repositories are kept on the separate `projects.html` page.

## Pages and assets
- `index.html` — profile, skills, career timeline, certifications, education, contact modal
- `projects.html` — GitHub repository directory and filters
- `thank-you.html` — post-submission confirmation page
- `assets/css/styles.css` — original V3 theme plus contact modal styles
- `assets/js/main.js` — navigation and contact form behavior
- `assets/js/projects.js` — repository filters
- `assets/favicon.svg` — custom PT browser-tab icon
- `CNAME` — `mylearningdesk.in`

## Preview
Run `python3 -m http.server 8000` in this folder, then visit `http://localhost:8000`.

## Contact form setup (important)
The form currently uses FormSubmit to deliver submissions to `hello@mylearningdesk.in`.
1. Publish the site on your domain.
2. Submit a test message through the contact form.
3. FormSubmit will send an activation/confirmation email to the destination inbox on first use. Open it and activate the form.
4. Confirm the redirect URL in the form is `https://mylearningdesk.in/thank-you.html` and that the domain serves HTTPS.
5. Test a successful submission and the spam/CAPTCHA challenge before announcing the form publicly.

The visible “I'm a real person” checkbox is a basic user confirmation, not a security-grade CAPTCHA. FormSubmit's `_captcha=true` enables its CAPTCHA/spam challenge. Email delivery is not considered active until FormSubmit's first-time activation is completed. The form sends name, email, optional contact details, topic, and message to the email above.

## Before publishing
- Check the experience dates and role titles against your final resume.
- Verify the certification names and add credential URLs if available.
- Keep the contact email correct and perform a live submission test after hosting.
- The website has not been deployed by this ZIP generation step.


## V9 update
- Updated the Projects page Learning Notes to focus on Java/Core Java, Collections, Spring Boot/Security, REST APIs, and Docker/Kubernetes.
- Added a short explanation of why strong fundamentals matter.
- Reduced the security icon to a compact, consistent line icon.
