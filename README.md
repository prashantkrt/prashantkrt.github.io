# MyLearningDesk Portfolio — V10

A static, responsive portfolio using the original V3 visual design, with updated skills, experience details, social links, a browser-tab favicon, and a contact form modal. The homepage remains a professional profile; repositories are kept on the separate `projects.html` page.

## Pages and assets
- `index.html` — profile, skills, career timeline, certifications, education, contact modal, Kodi & Nodi chase scene
- `projects.html` — GitHub repository directory and filters, corner Kodi and Nodi
- `thank-you.html` — post-submission confirmation page
- `assets/css/styles.css` — original V3 theme plus contact modal styles, hero Kodi and corner Kodi
- `assets/css/patrol-bear.css` — Kodi & Nodi chase scene, corner Nodi peek, speech bubbles and page animations
- `assets/js/main.js` — navigation, contact form behavior, and the Kodi & Nodi mascot engine
- `assets/js/projects.js` — repository filters
- `assets/github-avatar.png` — profile avatar the mascots are drawn from
- `assets/favicon.svg` — custom PT browser-tab icon
- `CNAME` — `mylearningdesk.in`

## Meet Kodi and Nodi
Two mascots drawn from the GitHub profile avatar (a campfire Moon Bear and a deer):
- **Kodi 🐻 (Code)** — the bear who writes the code. Shown in the hero (`Kodi · Code Bear`, tap or press *Pet*), as a corner companion at the bottom-left, and in the chase scene.
- **Nodi 🦌 (Deploy)** — the deer who deploys it: pods, nodes and clusters. Peeks in from the screen corners (bottom-left, top-right, bottom-right, top-left) and runs ahead of Kodi.
- **Chase scene** — every so often Kodi chases Nodi across the bottom of the screen, alternating direction. They run in profile on two legs, and the gait speeds up and slows down with their pace. They chat in speech bubbles, for example Kodi asking Nodi to get the pods up and running, and Nodi replying.
- **While they run**, the corner Kodi and corner Nodi step aside and return when the run ends.
- **Interactions** — tap the corner Nodi to keep him in view for a chat (bubble, hearts, chime). Tap either runner to make them hop and speak. Hero Kodi has his own messages.
- **Accessibility** — the decorative mascots are hidden from assistive tech, and everything is disabled when the visitor prefers reduced motion.
- **Tuning** — speeds, gaps and pacing are the constants at the top of `window.initPatrolBear` in `assets/js/main.js`. Dialogue lines are the `dialogues` and `tapQuips` lists there; Nodi's corner lines are `quotes` in `initDeerCornerPeek`.
- The CSS and JS are cache-busted with `?v=` query strings in the HTML. Bump them when you change those files.

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


## V10 update
- Added Nodi 🦌 (the deployment deer) alongside Kodi 🐻 (the code bear), drawn from the GitHub avatar, with role labels `Kodi · Code` and `Nodi · Deploy`.
- Rebuilt the bottom chase scene: both characters run upright in profile with a speed-driven gait, chat while running, and hide the corner mascots until the run ends.
- Added corner Nodi peeks with a name tag, speech bubbles and tap reactions; made the corner Kodi larger.
- Fixed the hero Kodi being clipped (and his speech bubble cut off) in windows up to 1120px wide.

## V9 update
- Updated the Projects page Learning Notes to focus on Java/Core Java, Collections, Spring Boot/Security, REST APIs, and Docker/Kubernetes.
- Added a short explanation of why strong fundamentals matter.
- Reduced the security icon to a compact, consistent line icon.
