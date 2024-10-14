<template>
  <div>
    <div class="landing">
      <div class="landing__header">
        <HeaderBox />
      </div>

      <div class="info">
        <div class="info__box info__content">
          <h2>Expressed below are the terms of data privacy for TradexQuant Trade</h2>

          <div class="info__display--content preview" ref="textcontent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import termsmixin from "@/mixins/terms";

export default {
  mixins: [termsmixin],
  data() {
    return {
      textarray: [
        "Privacy Policy Introduction: Your privacy is critically important to us. At TradexQuant, we have a few fundamental principles: We are thoughtful about the personal information we ask you to provide and the personal information that we collect about you through the operation of our services. We aim to make it as simple as possible for you to control what information on the website is shared publicly (or kept private), indexed by search engines, and permanently deleted.",
        "This Privacy Policy applies to information that we collect about you when you use: Our websites (including TradexQuant Trade); Our mobile applications (if any); Other products and services that are available on or through our websites (collectively, the 'Services'). Throughout this Privacy Policy we’ll refer to our websites, mobile applications, and other products and services collectively as 'Services.'",
        "Please note that this privacy policy does not apply to any of our products or services that have a separate privacy policy. Below we explain how we collect, use, and share information about you, along with the choices that you have with respect to that information.",
        "Information We Collect: We only collect information about you if we have a reason to do so — for example, to provide our Services, to communicate with you, or to make our Services better. We collect this information from three sources: if and when you provide information to us, automatically through operating our Services, and from outside sources. Let’s go over the information that we collect.",
        "Information You Provide to Us: It’s probably no surprise that we collect information that you provide to us directly. Here are some examples: Basic account information: We ask for basic information from you in order to set up your account. For example, we require individuals who sign up for a TradexQuant Trade account to provide an email address and password, along with a username or name — and that’s it.",
        "Public Profile Information: If you have an account with us, we collect the information that you provide for your public profile. Your public profile information is just that — public — so please keep that in mind when deciding what information you would like to include.",
        "Content Information: You might provide us with information about you in draft and published content (a blog post or comment that includes biographic information about you, or any media or files you upload).",
        "Communications with Us: You may also provide us information when you respond to surveys, communicate with our engineers about a support question, post a question in our public forums, or sign up for a newsletter.",
        "Transaction and Billing Information: If you buy something from us or earn revenue through our Services, we’ll collect information about the purchase or transaction. This includes your payment information, such as your credit or debit card number and other card information, and other account and authentication information, as well as billing, shipping, and contact details.",

        "Information Collected Automatically: We also collect some information automatically: Log Information: Like most online service providers, we collect information that web browsers, mobile devices, and servers typically make available, such as the browser type, IP address, unique device identifiers, language preference, referring site, the date and time of access, operating system, and mobile network information.",
        "Usage Information: We collect information about your usage of our Services. We use this information to get insights on how people use our Services, so we can make our Services better.",
        "Location Information: We may determine the approximate location of your device from your IP address. We collect and use this information to, for example, calculate how many people visit our Services from certain geographic regions.",
        "Information from Cookies & Other Technologies: A cookie is a string of information that a website stores on a visitor’s computer, and that the visitor’s browser provides to the website each time the visitor returns. Pixel tags (also called web beacons) are small blocks of code placed on websites and emails. We use cookies and other technologies like pixel tags to help us identify and track visitors, usage, and access preferences for our Services, as well as track and understand email campaign effectiveness and to deliver targeted ads.",
        "Information We Collect from Other Sources: We may also get information about you from other sources. For instance, if you create or log into your TradexQuant Trade account through another service (like Google), we will receive information from that service (such as your username, basic profile information, and friends list) via the authorization procedures for that service.",
        "How We Use Information: We use information about you for the purposes listed below: To provide our Services — for example, to set up and maintain your account, host your website, backup and restore your website, charge you for any of our paid Services, and provide customer support and technical assistance;",
        "To further develop our Services — for example, by adding new features that we think our users will enjoy or will help them to create and manage their websites more efficiently;",
        "To monitor and analyze trends and better understand how users interact with our Services, which helps us improve our Services and make them easier to use;",
        "To measure, gauge, and improve the effectiveness of our advertising, and better understand user retention and attrition — for example, we may analyze how many individuals purchased a plan after receiving a marketing message or the features used by those who continue to use our Services after a certain length of time;",
        "To monitor and prevent any problems with our Services, protect the security of our Services, detect and prevent fraudulent transactions and other illegal activities, fight spam, and protect the rights and property of TradexQuant and others, which may result in us declining a transaction or the use of our Services;",
        "To communicate with you, for example through an email, about offers and promotions offered by TradexQuant and others we think will be of interest to you, solicit your feedback, or keep you up to date on TradexQuant and our products; and",
        "To personalize your experience using our Services, provide content recommendations, target our marketing messages to groups of our users (for example, those who have a particular plan with us or have been our user for a certain length of time), and serve relevant advertisements.",
        "Sharing Information: How We Share Information: We do not sell our users' private personal information. We share information about you in the limited circumstances spelled out below and with appropriate safeguards on your privacy:",
        "Subsidiaries, Employees, and Independent Contractors: We may disclose information about you to our subsidiaries, our employees, and individuals who are our independent contractors that need to know the information in order to help us provide our Services or to process the information on our behalf.",
        "Third Party Vendors: We may share information about you with third party vendors who need to know information about you in order to provide their services to us, or to provide their services to you or your site. This group includes vendors that help us provide our Services to you (like payment providers that process your credit and debit card information, fraud prevention services that allow us to analyze fraudulent payment transactions, postal and email delivery services that help us stay in touch with you, customer chat and email support services that help us communicate with you), those that help us understand and enhance our Services (like analytics providers) We require vendors to agree to privacy commitments in order to share information with them.",

        "Legal Requests: We may disclose information about you in response to a subpoena, court order, or other governmental request.",
        "Business Transfers: In connection with any merger, sale of company assets, or acquisition of all or a portion of our business by another company, or in the unlikely event that TradexQuant goes out of business or enters bankruptcy, user information would likely be one of the assets that is transferred or acquired by a third party.",
        "Aggregated or De-Identified Information: We may share information that has been aggregated or reasonably de-identified so that the information could not reasonably be used to identify you. For instance, we may publish aggregate statistics about the use of our services.",
        "Published Support Requests: If you send us a request (for example, via a support email or one of our feedback mechanisms), we reserve the right to publish that request in order to help us clarify or respond to your request or to help us support other users.",
        "With Your Consent: We may share and disclose information with your consent or at your direction. For example, we may share your information with third parties with which you authorize us to do so.",
        "Information Shared Publicly: Information that you choose to make public is disclosed publicly. That means, of course, that information like your public profile, posts, other content that you make public on your website, and your 'Likes' and comments on other websites, are all available to others — and we hope you get a lot of views!",
        "How Long We Keep Information: We generally discard information about you when we no longer need the information for the purposes for which we collect and use it — which are described in the section above on How We Use Information — and we are not legally required to continue to keep it.",
        "For example, we keep the web server logs that record information about a visitor to one of TradexQuant's websites, such as the visitor’s IP address, browser type, and operating system, for approximately 30 days. We retain the logs for this period of time in order to, among other things, analyze traffic to TradexQuant's websites and investigate issues if something goes wrong on one of our websites.",
        "As another example, when you delete a post, page, or comment from your TradexQuant site, it stays in your Trash folder for thirty days just in case you change your mind and would like restore that content — because starting again from scratch is no fun, after all. After the thirty days are up, the deleted content may remain on our backups and caches until purged.",
        "Security: While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so, such as monitoring our Services for potential vulnerabilities and attacks.",
        "Choices: You have several choices available when it comes to information about you: Limit the Information that You Provide: If you have an account with us, you can choose not to provide the optional account information, profile information, and transaction and billing information. Please note that if you do not provide this information, certain features of our Services may not be accessible.",
        "Opt-Out of Electronic Communications: You may opt out of receiving promotional messages from us. Just follow the instructions in those messages. If you opt out of promotional messages, we may still send you other messages, like those about your account and legal notices.",
        "Set Your Browser to Reject Cookies: You can choose to set your browser to remove or reject browser cookies before using TradexQuant's websites, with the drawback that certain features of TradexQuant's websites may not function properly without the aid of cookies.",

        "Close Your Account: While we’d be very sad to see you go, if you no longer want to use our Services, you can close your account. Please note that we may continue to retain your information after closing your account, as described in 'How Long We Keep Information' above — for example, when that information is reasonably needed to comply with (or demonstrate our compliance with) legal obligations such as law enforcement requests, or reasonably needed for our legitimate business interests.",
        "Your Rights: If you are located in certain countries, including those that fall under the scope of the European General Data Protection Regulation (GDPR), data protection laws give you rights with respect to your personal data, subject to any exemptions provided by the law, including the rights to:",
        "Request access to your personal data;",
        "Request correction or deletion of your personal data;",
        "Object to our use and processing of your personal data;",
        "Request that we limit our use and processing of your personal data; and",
        "Request portability of your personal data.",
      ],
    };
  },
};
</script>
