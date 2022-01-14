# Usage Demo Guide Artifacts

This folder contains sample files that are referenced in the Demo Usage Guide

1. Sample Schema (`iRec_Application_Details.json`)
2. Sample Policy Workflow configuration file (`irec-policy-config.txt`)
3. Demo Usage Guide

## Demo Usage Guide

1. The Guardian reference implementation comes with three predefined users:

- **Root Authority**: A standard registry, or a Root Authority in our scenario, is an organization that establishes science-based standards for measuring, reporting, and verifying (MRV) ecological benefit claims and issues value in the form of credit for claims that meet the standard set. A standard registry also authorizes validation and verification bodies (VVBs) to collect and process claims based on the established standard. The creation of scientific-based standards for MRV is a rigorous discipline that requires independence from commercial influence in the pursuit of accurate accounting of benefit or emissions claims. A standard registry organization can also maintain a central registry of credits they have issued that can be sold directly via the registry itself or established as reference value on networks, exchanges, or marketplaces.
- **Installer**: In our scenario, it can be either the project owner or developer. This is the entity (person or company) that owns the project whose activities will be the source of benefit claims in a process generically called measurement or monitoring, reporting and verification (MRV) to create a credit.
- **Auditor**: This is a 3rd part who will need to view/audit the entire chain of events; from the establishment of the science-based standards through creation of the credit.

![Guardian step 1](https://user-images.githubusercontent.com/40637665/137935335-1c1cf58e-9b83-4080-9c76-125d2ec9af34.png)

2. After running the installation commands, open a tab on your browser and navigate to http://localhost:3002/. Typically the way we start the reference implementation demonstration is by logging in as the Root Authority. Click the **Demo Admin Panel** drop-down located in the upper right-hand corner of the login screen and select the **Root Authority** user.

![guardian step 2](https://user-images.githubusercontent.com/40637665/137934753-e51db424-6142-42f8-8016-40cf9f38401e.png)

3. You'll now be prompted to configure your Root Authority account. Press the **Generate** button to generate a Hedera Operator ID and an Operator Key and enter the name of your Root Authority. Press **Connect** when finished. This will now create Hedera Consensus Service Topics, fill the account with test hBar, create a DID document, create a Verifiable Credential, etc.

![Guardian step 3](https://user-images.githubusercontent.com/40637665/137956842-d9b3d0a3-7021-4304-9d1b-83d06ac115e2.png)

4. Next, we move over to the **Schemas** tab. Some schemas are populated during the build of the solution. These schemas are the structure of which Verifiable Credentials will be filled out. You can click on the **document** link on the right-hand side and notice fields that correlate to business requirements. Remember the iRec Policy we mentioned at the beginning of the section? We will be creating the first step of that Policy; which is to create an iRec registration applicant form. The current version of the solution allows you to either build schemas from scratch or import schemas. Download the `iRec_Application_Details.json` file found within this folder. Then click on the **Import** button and upload the `iRec_Application_Details.json` file.

---
**NOTE**

Created or imported schema needs to be published via the **Publish** button after. This makes it available for inclusion in a policy.

---

![Guardian step 4](https://user-images.githubusercontent.com/40637665/137962816-b2791931-552e-4cbc-8290-002909421abb.png)

5. The next step of the flow is to create a token. Click the **Tokens** tab and click on **Create Token.** Here, we can fill out the necessary token information and token parameters such as Fungible/Non-Fungible (for this demo flow we will select Non-Fungible), Freeze, KYC, etc. For purposes of this demo, let us keep everything selected. When you click "OK", this action triggers Hedera Token Service to create the token on Hedera's Testnet. Clicking on the "Token ID" will bring you to the Dragon Glass Hedera Testnet explorer to track all token activity.

![Guardian step 5](https://user-images.githubusercontent.com/40637665/137963264-09779e4a-2127-4e4b-949f-f9c510350634.png)

6. This could be one of the most interesting parts of the reference implementation. Now we will be creating the Policy. In our case, we will mimic the iRec Policy. Click **Create Policy** and fill the required information in the dialog box. Please note that you will need to create new **Tag** and **Version** numbers for each policy. identical Tags and Versions will cause an error. Once the Policy is complete, we have just **_created our first Policy Workflow and Policy Action Execution instance!_**

![Guardian step 6](https://user-images.githubusercontent.com/40637665/137963683-cd49e1a6-c372-4165-b150-7441da3a2818.png)

7. On the right-hand side of the Policies tab, click the **Edit** button. This will open the Guardian's Policy workflow editor. As described in the Hedera Improvement Proposal 28 (HIP-28), a Policy Workflow contains:

   - Policy Workflow Workgroups
   - Policy Workflow Actions
   - Policy Workflow State Objects
   - Policy Workflow State Transactions

   The quickest way to go through this demo while learning how to configure a Policy Workflow is to import the configPolicy.ts file. To do so, copy everything inside the `irec-policy-config.txt` file found within this folder. Go back into the Policy editor and click on the "code" icon on the upper right-hand side. Paste the mock configuration.

   ---
   **NOTE**

   If you build and run the Guardian manually (without using Docker containers), you need to replace the entry `http://message-broker:3003/mrv` with `http://localhost:3003/mrv` in the pasted text.

   ---

   ![Guardian step 7](https://user-images.githubusercontent.com/40637665/137964384-6e05ee6e-1e5a-41c3-801b-ec94a50de916.png)
   
   Click on the "block" icon that is just to the right of the "code" icon. You'll notice that the Policy configuration editor now visually shows the Policy Workflow with all of the necessary Workgroups, Actions, State Objects, and Transactions. Click through on several blocks, and you'll notice that you can edit some elements on the right-hand side. Depending on what you are clicking on, different properties will display on the right-bottom box. You can edit properties from permissions, dependencies, tags, UI elements, etc. Moving along with our flow. Click on the **mint_token** block and select the token we created from the properties box in the right hand side. 
   
   ![image](https://user-images.githubusercontent.com/40637665/142920856-cfdaa439-2ca0-4c49-a696-87882d317a2b.png)
   
   We will now press the **Save** button and the **Publish** button.
   
   ![Guardian step 7 2](https://user-images.githubusercontent.com/40637665/137965045-951900d7-fd64-489a-9282-8131ca9216b4.png)

8. Click on the Root Authority's profile icon and select "Log Out." We will now go back into the **Admin Panel**. This time we will select **Installer**

![Guardian step 8](https://user-images.githubusercontent.com/40637665/137965200-bc63668e-cd94-4451-a495-ef0f32cd2b7c.png)

9. When signing into the Installer profile, you must follow similar configuration steps as the Root Authority. Click the **Generate** button, then select **Submit**. After generating the Hedera Operating ID and Key, the Installer profile will be configured, test HBAR will be credited to the account, and a DID will be created.

![Guardian step 9](https://user-images.githubusercontent.com/40637665/137965583-00d980fd-aa27-4dd4-b62e-2adc96b116ed.png)

10. Next, navigate to the **Token** tab and click the **link** icon to associate the Installer to the token we created as the Root Authority.

![Guardian step 10](https://user-images.githubusercontent.com/40637665/137965789-6e5b888d-88a2-4a6d-917e-fd797b060b2d.png)

11. Now, we can click on the **Policies** tab. This is where the specific actions required by the Policy Workflow will be found. We can click the **Open** button to the right of the iRec Policy the Root Authority created. 

![Guardian step 11](https://user-images.githubusercontent.com/40637665/137966063-7add24f7-319b-472e-a93d-418075a74999.png)

   Here we will see the form that is based on the imported schema in step 4. This form is one of the Policy Workflow State Objects. Once you fill out the required information, press the **OK** button. Note: There is a known issue that no dialogue box comes up to let you know the form is completed. That's ok for now, we are working to provide a UI update. Everything works, so just move onto the next step :)
   
![Guardian step 11 2](https://user-images.githubusercontent.com/40637665/137966739-1872360d-a7bd-45a3-8fe5-7fd7d59af66d.png)

12. The next step of our flow is to log out and sign back in as the Root Authority. Navigate to the **Policies** tab and click the **Open** button on the far right. Here you will find the approval actions based on our Policy Workflow required by the Root Authority. You will be able to view the Verifiable Credential prior to approval by selecting the **View Document** link. Once you are ready to approve the document, you can click on the **Approve** button.

![Guardian step 12](https://user-images.githubusercontent.com/40637665/137966774-7ffbe24e-0a41-40ab-b270-fa6252fced86.png)

13. Navigate to the **Tokens** tab and click on the blue people icon on the far right. This view shows the Root Authority all of the users who have been associated with the tokens the Root Authority created. We will now click the **Grant KYC** button.

![Guardian step 13](https://user-images.githubusercontent.com/40637665/137966876-52614098-c782-48d8-97bf-58a971a9e56a.png)

14. We can now log out of the Root Authority account and back in as the Installer. Navigate to the **Policies** tab and click the **Open** button on the far right. The next Policy Workflow Action required by the Installer is to register their sensors. Click the **New Sensors** button, fill out the required information in the dialog box, and select **OK**.

![Guardian step 14](https://user-images.githubusercontent.com/40637665/137967290-51ae0339-4272-4fbc-b628-eb39bf5e4e74.png)

15. You'll notice that you just created a sensor (refreshing the page may be needed), and that sensor has been assigned a Decentralized Identifier and a Verifiable Credential. Click the **Configuration** button. This will begin the download of the Sensor configuration file. Save that in a handy place because we will need it.

![Guardian step 15](https://user-images.githubusercontent.com/40637665/137970980-19ba060d-0686-4718-8e4e-2aede5db693e.png)

16. Open another tab on your browser and enter http://localhost:3005/. We now see our IoT simulator. You can either drag and drop the sensor configuration file to the big `+` sign in the upper left, or you click the button to browse your computer. For simplicity's sake, click the button next to **Random Value** for the IoT simulator to generate random Measurement, Reporting, and Validation (MRV) data. Click **OK**.

![Guardian step 16](https://user-images.githubusercontent.com/40637665/137971538-94b68559-a8e2-464d-b595-fd13f23b97e9.png)

  Press the **green triangle** to begin generating the data. Navigate back to the Guardian Policies tab, and you can click into the **MRV** tab. Here, you will see the data that the IoT sensor generated, such as date, period, amount, etc.
  
  ![Guardian step 16 2](https://user-images.githubusercontent.com/40637665/137971702-79cc597f-90a7-4038-8058-caa9f85a55e0.png)

17. The last step is to log out of the Installer account and log into the Auditor account. 

![Guardian step 17](https://user-images.githubusercontent.com/40637665/137971921-041a209a-fec2-4f0a-854b-d46c7b26eaf7.png)

  There are two tabs in this view: **Audit** and **Trust Chain**. Clicking into the Audit tab offers high-level public information from our reference implementation such as the Verifiable Presentation ID, the Hash of the Verifiable Presentation, the DID of the sensor, the date information the Verifiable Presentation was created, the type of activity, and the ability to view the Verifiable Presentation.
  
  ![Guardian step 17 2](https://user-images.githubusercontent.com/40637665/137972020-ea74c1ad-2ec3-49b4-9089-c807ed79241b.png)

18. Lastly, let's navigate to The Trust Chain tab. The Trust Chain tab will ask for one of two pieces of information, either the Verifiable Presentation ID (which can be found either in the Audit tab or the memo field of the transaction field on a Hedera explorer-like Dragon Glass) or the Transaction Hash. Entering either of those important identifiers will open all necessary information for you to discover. 

![Guardian step 18](https://user-images.githubusercontent.com/40637665/137972170-7970a07e-7a76-410b-90a7-22a9f3586103.png)

The **Trust Chain** view displays important elements that can be publicly discovered. Elements include token information, Policy information, and all of the important information regarding the Verifiable Credentials that make up the Verifiable Presentation. You'll notice "Cards" on the bottom of the screen. Those cards are Verifiable Credentials displayed in chronological order. For example, you will see when the Root Authority was created, when the policy was created, when the Installer submitted documentation, etc. Feel free to explore!

![Guardian step 19](https://user-images.githubusercontent.com/40637665/137972740-a40ed2cb-2502-4da5-a9f2-3047c30e6773.png)

<p align="right">(<a href="#top">back to top</a>)</p>
