export default function Page() {
  return (
    <article className="flex flex-col max-w-5xl gap-6 p-12 mx-auto">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>

      <p>Last updated on September 23rd 2024.</p>

      <p>
        This Privacy Policy outlines how we collect, use, and protect your
        information when you use this website (the "Service"). By using the
        Service, you agree to the practices described in this policy.
      </p>

      <h2 className="text-xl font-bold">Information We Collect</h2>

      <ul className="pl-6 list-disc">
        <li>
          <strong>Email Address</strong>: When creating an account, we collect
          your email address to identify you and communicate important
          information about the Service.
        </li>
        <li>
          <strong>Optional Name</strong>: You may choose to provide your real
          name. This is optional and only used for personalization.
        </li>
        <li>
          <strong>Request IP Address</strong>: We temporarily store IP addresses
          and user agent information in server logs for security purposes,
          including monitoring and troubleshooting.
        </li>
        <li>
          <strong>Browser Information</strong>: If you report a bug, we collect
          details about your browser and environment to help resolve the issue.
        </li>
      </ul>

      <h2 className="text-xl font-bold">2. How We Use Your Information</h2>

      <p>We use the collected information to:</p>
      <ul className="pl-6 list-disc">
        <li>Facilitate account creation and maintain your profile.</li>
        <li>Communicate essential updates or information about the Service.</li>
        <li>Improve the Service through bug fixes and troubleshooting.</li>
        <li>Ensure the security and integrity of the Service.</li>
      </ul>

      <h2 className="text-xl font-bold">3. What We Don't Collect</h2>

      <ul className="pl-6 list-disc">
        <li>
          We do not collect any personal information beyond what is explicitly
          mentioned above.
        </li>
        <li>We do not track your activity while using the Service.</li>
        <li>
          We do not sell, rent, or share your information with third parties.
        </li>
      </ul>

      <h2 className="text-xl font-bold">4. Data Security</h2>

      <p>
        We take reasonable measures to protect your data, including secure
        transmission and storage of information. However, no method of
        transmission over the internet or electronic storage is 100% secure, and
        we cannot guarantee its absolute security.
      </p>

      <h2 className="text-xl font-bold">5. Your Choices</h2>

      <p>
        You may request to access or delete your account or personal information
        at any time by contacting us.
      </p>

      <h2 className="text-xl font-bold">6. Changes to This Policy</h2>

      <p>
        We may update this Privacy Policy occasionally to reflect changes in our
        practices. Any changes will be posted on this page with a revised "Last
        updated" date.
      </p>

      <h2 className="text-xl font-bold">7. Contact Us</h2>

      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at{" "}
        <a
          href="mailto:help@totallyacurateexchange.crz.li?subject=About+your+privacy+policy"
          className="font-bold underline"
        >
          help@totallyacurateexchange.crz.li
        </a>
        .
      </p>
    </article>
  );
}
