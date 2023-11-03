import { Flex } from "~/components/Flex";
import { Heading } from "~/components/Heading";

export default function Page() {
  return (
    <Flex direction="column" gap="3rem">
      <Flex as="header" direction="column" gap="1.5rem">
        <Heading as="h1" size="large">
          Privacy policy
        </Heading>

        <p>
          Last updated on <strong>October 27th, 2023</strong>.
        </p>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          1. Introduction
        </Heading>

        <p>
          This document outlines how we, at Workoelho, collect, use, and
          safeguard your data.
        </p>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          2. Information we collect
        </Heading>

        <ul>
          <li>
            <p>
              <strong>
                <abbr title="Personal Identifiable Information">PII</abbr>
              </strong>
              . In order to use our service, you will be required to provide
              personal information, such as your name and email address.
            </p>
          </li>
          <li>
            <p>
              <strong>Organization information</strong>. You'll also have to
              provide information about your company or organization, such as
              name and details of its operation.
            </p>
          </li>
          <li>
            <p>
              <strong>Browser and system information</strong>. We also collect
              browser and system information, such as user-agent identification,
              resolution and <abbr title="Internet Protocol">IP</abbr> address.
            </p>
          </li>
        </ul>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          3. How we use your information
        </Heading>
        <p>We use the information collected for the following purposes:</p>
        <ul>
          <li>
            <strong>Authentication</strong>. To verify your identity and grant
            you access to our platform.
          </li>
          <li>
            <strong>Service customization</strong>. To provide you with a
            personalized experience based on your company's needs.
          </li>
          <li>
            <strong>Service improvement</strong>. We may analyze aggregated,
            non-personal data to enhance and improve our services.
          </li>
        </ul>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          4. Data sharing and security
        </Heading>

        <ul>
          <li>
            We do not display ads or share user submitted data with third
            parties.
          </li>
          <li>
            Your data is securely stored and protected against unauthorized
            access or disclosure.
          </li>
        </ul>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          5. Data retention
        </Heading>

        <p>
          We retain your data only for as long as necessary to fulfill the
          purposes outlined in this document or as required by law.
        </p>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          6. Your choices and rights
        </Heading>

        <p>
          You have the right to access, rectify, or delete your personal
          information. You can submit related requests via email to
          help@workoelho.com.
        </p>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          7. Contact us
        </Heading>

        <p>
          If you have any questions or concerns about your privacy or this
          document, please contact us at help@workoelho.com.
        </p>
      </Flex>

      <Flex as="section" direction="column" gap="1.5rem">
        <Heading as="h2" size="medium">
          8. Changes to the policy
        </Heading>

        <p>
          We may update this document from time to time to reflect changes in
          our practices or for legal reasons. We'll notify users when that
          happens.
        </p>
      </Flex>
    </Flex>
  );
}
