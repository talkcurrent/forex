import React from "react";
import { makeStyles } from "@material-ui/core";
import Header from "../components/Home/Header";

const useStyles = makeStyles((theme) => ({
  body: {
    maxWidth: 1200,
    margin: "auto",
    textAlign: "left",
    marginTop: 100,
    [theme.breakpoints.down("xs")]: {
      padding: "0px 20px"
    }
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
  },
  text_div: {
    marginTop: 50,
  },
  general_title: {
    fontSize: 25,
    fontWeight: "700",
  },
  general_text: {
    marginTop: 20,
  },
  inform_div: {
    marginTop: 50,
  },
  ul: {
    marginTop: 20,
  },
  list: {
    marginTop: 20,
  },
  below_informed: {
    marginTop: 50,
  },
  last_text: {
    fontWeight: "600"
  }
}));

const TermsAndConditions = () => {
  const classes = useStyles();
  return (
    <div>
      <Header />
      <div className={classes.body}>
        <div>
          <p className={classes.title}>Bivestcoin Terms and Conditions</p>

          <div className={classes.text_div}>
            <p className={classes.general_title}>General </p>
            <div className={classes.general_text}>
              <p>
                By clicking "I agree" to accept any Bivestcoin Services, you
                acknowledge that you have read, understood, and agreed to all of
                the terms and conditions outlined in this Agreement, as well as
                any other agreement you may be asked to accept, such as the
                Privacy Policy. Please carefully read these terms as they govern
                your usage of the Services. THESE TERMS CONTAIN IMPORTANT
                PROVISIONS, INCLUDING AN ARBITRATION AND MEDIATION PROVISION
                REQUIRING ALL CLAIMS TO BE RESOLVED THROUGH MEDIATION AND
                LEGALLY BINDING ARBITRATION. BY USING THE SERVICES, YOU
                ACKNOWLEDGE AND AGREE THAT: 1) YOU ARE AWARE OF THE RISKS
                ASSOCIATED WITH CRYPTOCURRENCIES AND THEIR DERIVATIVES; 2) YOU
                SHALL ASSUME ALL RISKS RELATED TO THE USE OF SERVICES AND
                TRANSACTIONS OF CRYPTOCURRENCIES AND THEIR DERIVATIVES; AND 3)
                WE SHALL UNDER NO CIRCUMSTANCES BE LIABLE FOR ANY SUCH RISKS OR
                ADVERSE OUTCOMES RESULTED THEREFROM
              </p>

              <div className={classes.inform_div}>
                <p>You are hereby informed that:</p>
                <ul className={classes.ul}>
                  <li className={classes.list}>
                    We retain the right, at our sole discretion, to decide,
                    alter, or change any of the contents of this Website at any
                    time. We have taken reasonable steps to ensure the accuracy
                    of the information on the Website; however, we do not
                    guarantee the degree of such accuracy, and we cannot be held
                    liable for any loss resulting directly or indirectly from
                    the information on this Website, or any delay or failure
                    caused by a failure to connect to the internet, transmit or
                    receive any notice or information.
                  </li>
                  <li className={classes.list}>
                    Risks associated with using internet-based trading systems
                    include, but are not limited to, software, hardware, and
                    Internet link failures. We shall not be liable for any
                    distortion, delay, or link failure since we cannot control
                    the Internet's dependability and availability.
                  </li>
                  <li className={classes.list}>
                    It is prohibited to use this Website to engage in any
                    illegal transaction activities or illegitimate activities,
                    such as money laundering, smuggling, and commercial bribery.
                    If any suspected illegal transaction activities or
                    illegitimate activities are uncovered, this Website will
                    adopt all available measures, including but not limited to
                    freezing the offender’s account, notifying relevant
                    authorities, etc., and we will not assume any of the
                    responsibilities arising therefrom and reserve the right to
                    hold relevant persons accountable.
                  </li>
                </ul>
              </div>

              <div className={classes.below_informed}>
                <p>
                  By creating an account with Bivestcoin you agree to maintain
                  the security and confidentiality of your login credentials and
                  restrict access to your Account and your computer, tablet, or
                  mobile device and take legal responsibility for all activities
                  that occur under your Account and accept all risks of
                  unauthorized access.
                </p>
                <p style={{ marginTop: 20 }}>
                  We reserve the right to make changes or modifications to the
                  Agreement, affiliated service terms, activities terms, or
                  announcements from time to time, in our sole discretion
                  without notice. The amended terms will be deemed effective
                  immediately upon posting. You may check back for the latest
                  Agreement. Your continued use of this site and the services
                  acts as acceptance of such changes or modifications. If you do
                  not agree to any amended terms, you must discontinue using or
                  accessing our Service. By using and accessing our service, you
                  are deemed to agree to and fully understand the Agreement and
                  contents in other affiliated service terms, including the
                  amended terms made by Gate.io from time to time.
                </p>
              </div>
            </div>
          </div>

          <div className={classes.text_div}>
            <p className={classes.general_title}>Eligibility</p>
            <div className={classes.general_text}>
              <p style={{ marginTop: 40 }}>
                By accessing or using our Services, You represent and warrant
                that You are at least 18 years old and have not previously been
                suspended or removed from the Site or Services.
              </p>
            </div>
          </div>

          <div className={classes.text_div}>
            <p className={classes.general_title}>Risk Disclosure Statement</p>
            <div className={classes.general_text}>
              <p style={{ marginTop: 40 }}>
                Trading blockchain assets can be extremely risky. Trading
                markets are volatile and shift quickly. The blockchain networks
                may go offline due to attacks, bugs, hard forks, or other
                unforeseeable reasons. Bivestcoin may experience sophisticated
                cyber-attacks, unexpected surges in activity, or other
                operational or technical difficulties that may cause service
                interruptions. You are solely responsible and liable for all
                trading and non-trading activity for your account on the site
                and fully responsible for safeguarding access to your account
                and any information provided through the site.
              </p>
            </div>
          </div>

          <div className={classes.text_div}>
            <p className={classes.general_title}>Privacy Policy</p>
            <div className={classes.general_text}>
              <p style={{ marginTop: 40 }}>
                We will implement reasonable security practices to help protect
                the security of your information and will not disclose your
                non-public information, including name, password, and phone
                number, to any other third party without your prior permission,
                except for the following cases disclose your information to
                yourself or a third party with your consent. disclose your
                information with your consent so that you may use products or
                services disclose or share your information to comply with our
                legal obligations to authorities stipulated by laws and
                regulations, including without limitation, administrative
                authorities, and financial authorities. 6.2.4 when we believe,
                in our sole discretion, that the disclosure of your information
                is necessary to prevent physical harm or financial loss, to
                report suspected illegal activity, or to investigate violations
                of or enforce our user agreements or other policies and
                agreements.
              </p>
            </div>
          </div>

          <div className={classes.text_div}>
            <p className={classes.general_title}>
              Limitation of Liability & Waiver
            </p>
            <div className={classes.general_text}>
              <p style={{ marginTop: 40 }}>
                Bivestcoin is not responsible for damages caused by delay or
                failure to perform undertakings when the delay or failure is due
                to fires; strikes; floods; cyber-attacks; hacks; power outages
                or failures; acts of God or the state’s enemies; lawful acts of
                public authorities; all market movements, shifts, or volatility;
                computer, server, or Internet malfunctions; security breaches or
                cyberattacks; criminal acts; delays or defaults caused by common
                carriers; acts or omissions of third parties; or, any other
                delays, defaults, failures or interruptions that cannot
                reasonably be foreseen or provided against. In the event of
                force majeure, Gate.io is excused from all. Given the specialty
                of the Internet, Bivestcoin does not guarantee our service will
                not be interrupted and does not guarantee the timeliness, and
                safety of services, and does not take liability for damages not
                directly caused by Bitcoin.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 50, marginBottom: 50 }}>
            <p className={classes.last_text}>
              By accessing, using, or attempting to use Bivestcoin Services in
              any capacity, you acknowledge that you accept and agree to be
              bound by these Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
