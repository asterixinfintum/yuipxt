<template>
  <div>
    <div class="landing">
      <div class="landing__header">
        <HeaderBox />
      </div>

      <div class="info">
        <div class="info__box info__content">
          <h2>Expressed below are the terms of use for Tradex Quant</h2>

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
        "Welcome to our website. By accessing or using our service, you agree to be bound by the terms and conditions set forth below. If you do not wish to be bound by these terms and conditions, you may not access or use the service. We may modify this agreement at any time, and such modifications shall be effective immediately upon posting of the modified agreement on the site. You agree to review the agreement periodically to be aware of such modifications and your continued access or use of the service shall be deemed your conclusive acceptance of the modified agreement.",

        "Your use of the service is at your sole risk. The service is provided on an 'as is' and 'as available' basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.",

        "We make no warranty that (i) the service will meet your requirements, (ii) the service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the service will be accurate or reliable, (iv) the quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations, and (v) any errors in the software will be corrected.",

        "Any material downloaded or otherwise obtained through the use of the service is done at your own discretion and risk and you will be solely responsible for any damage to your computer system or loss of data that results from the download of any such material.",

        "No advice or information, whether oral or written, obtained by you from us or through or from the service shall create any warranty not expressly stated in the terms of service.",

        "You expressly understand and agree that we shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if we have been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the service; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the service; (iii) unauthorized access to or alteration of your transmissions or data; (iv) statements or conduct of any third party on the service; or (v) any other matter relating to the service.",

        "You agree to indemnify and hold us, and our subsidiaries, affiliates, officers, agents, co-branders or other partners, and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of content you submit, post, transmit or make available through the service, your use of the service, your connection to the service, your violation of the terms of service, or your violation of any rights of another.",

        "The section titles in the terms of service are for convenience only and have no legal or contractual effect.",

        "You acknowledge and agree that all content and information on the site is protected by proprietary rights and laws. You agree not to copy, distribute, reproduce, or create derivative works from any part of the service or the site without the express authorization of the company.",

        "The service may include links to other websites not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that we shall not be responsible for any loss or damage caused by the use of any such content available on or through any such sites or services.",

        "The Company generates revenue exclusively from withdrawal fees, which are set at a standard rate of 10% of the withdrawal amount. Clients are required to pay this 10% fee upfront before any withdrawal is processed, for the following reasons: \nIn the past, some clients have initiated legal action against the Company after transaction fees were deducted from their trading accounts. Additionally, some clients who requested to pay the fees after withdrawal failed to fulfill their payment obligations, leaving the fees unpaid.\n To prevent such issues, the Company now mandates the upfront payment of the 10% withdrawal fee.",

        "We may terminate your access to the site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of this agreement that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",

        "Account closure requires a minimum of 21 completed trades to ensure liquidity remains locked long enough for the software to execute automated trades across various assets and asset classes based on indicator-driven strategies.",

        "A certain deposit threshold must be met to qualify for borrowing margin and utilizing additional leverage.",

        "Certain trades require clients to meet specific deposit requirements to participate.",

        "The service is controlled and operated from its facilities in its country of origin. We make no representations that the service is appropriate or available for use in other locations. Those who access or use the service from other jurisdictions do so at their own volition and are responsible for compliance with local law.",

        "You agree to defend, indemnify, and hold harmless the company and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the service, by you or any person using your account and password; b) a breach of these terms, or c) content posted on the service.",

        "In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.",

        "Your use of the service is at your sole risk. The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.",

        "These Terms shall be governed and construed in accordance with the laws of the jurisdiction of the company's registration, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our service, and supersede and replace any prior agreements we might have had between us regarding the service.",

        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",

        "By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.",
        
      ],
    };
  },
};
</script>
