---
layout: post
pageheader-image : /assets/img/post_backgrounds/home-matrix.png
image-base: /assets/img/secure-code-ci/

title: Secure Software Development using CI 
description: Part II - Web Application Scanning / DAST
chapter: Part II - Web Application Scanning / DAST

audience: [security-interested people, developer, tester]
level: beginner
why: necessary to understand following posts

categories: [ci, securecode, english]

permalink: /securecode/dast/en

toc: true

---

# Introduction

The [last post] ({% post_url 2018-07-17-secure-code-deps-en %}) showed how we can find and fix insecure dependencies in a project.
In addition to the problem of dependencies issues to fix, which can be present in a large amount in a project, there is another way to harden your own code.

In a running application on the Internet, there is a "noise floor".
That means, any application that presents itself in public is exposed to certain attacks after some time. This can come from botnets, but also people who want to "test", whether you can get something from the page through hacking. 

In order to arm your own application against such attacks before the release, there are **DAST systems**, short for 'Dynamic Application Security Testing'. Here, a tool tries to execute different attack patterns from the outside with different inputs and then evaluates the results for potential vulnerabilities. In principle, this is exactly what the later malicious attacker or botnet is trying to use against the application.
This article differs from the last one in that it does not analyze code, but unleashes a "real" attacker and possible attack requests on the own application.

A popular DAST system for doing this is the open source tool [**OWASP ZAP**](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project).

The following describes how to integrate OWASP ZAP into Jenkins. Many descriptions are based on the great documentation [Jenkins at your Service! Integrating ZAP in Continuous Delivery](https://www.we45.com/blog/how-to-integrate-zap-into-jenkins-ci-pipeline-we45-blog):

The individual sections are divided into:

- [**Installing OWASP ZAP in Jenkins**](#installing-owasp-zap-in-jenkins)
- [**Configuring a ZAP job**](#configuring-a-zap-job)
- [**Summary of the Blog**](#summary)

The steps described here have been performed on a Mac OS X. This applies in particular to the chapter where OWASP ZAP is installed as a desktop application.
You can also perform the steps on another operating system. However, for this you have to look up the corresponding command line equivalents in another OS.

# Installing OWASP ZAP in Jenkins

## Stopping old docker container

Those who follow from the [old chapter]({% post_url 2018-07-17-secure-code-deps-en%}):
For the following explanations, we do not need the git server anymore. We can stop it with:

<pre><code class="bash">docker stop &#x3C;containerid_gitserver&#x3E;
</code></pre>

## Installation

Next we install OWASP ZAP in Jenkins.

### Installation of necessary plugins

For installation, we use the Docker infrastructure, which we described in the [last chapter]({% post_url 2018-07-17-secure-code-deps-en%}). 

Next we need:

- the official 'OWASP ZAP Plugin', which we will use for the scans against our application
- the 'Custom Tool Plugin' - for easy installation and 
- the 'HTML Publisher Plugin', to view the results in the builds. 

To do this, follow these steps:

![owaspzapinstallation1]({{ page.image-base | prepend:site.baseurl }}owaspzapinstallation1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation2.png" alt="owaspzapinstallation2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation3.png" alt="owaspzapinstallation3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation4.png" alt="owaspzapinstallation4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation5.png" alt="owaspzapinstallation5" width="100%">

Click on 'Official OWASP ZAP':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation7.png" alt="owaspzapinstallation7" width="100%">

Also choose 'Custom Tool'. We can do that via the filter field in the top right corner. Afterwards we click on 'Download now and install after restart' and 'Restart Jenkins when installation is complete and no jobs are running':

![customtoolsinstallation1]({{ page.image-base | prepend:site.baseurl }}customtoolsinstallation1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}customtoolsinstallation2.png" alt="customtoolsinstallation2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}customtoolsinstallation3.png" alt="customtoolsinstallation3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}customtoolsinstallation4.png" alt="customtoolsinstallation4" width="100%">

We now go to the standard Jenkins page:

![owaspzapinstallation9]({{ page.image-base | prepend:site.baseurl }}owaspzapinstallation9.png)
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation10.png" alt="owaspzapinstallation10" width="100%">

After some time, the login screen of Jenkins should reappear and you can log in.

<img src="{{ page.image-base | prepend:site.baseurl }}loginafterrestart.png" alt="loginafterrestart" width="100%">

#### Configuring Custom Tools

We are looking for the installation package 'OWASP ZAP 2.7.0' for Linux:

On the [GitHub release 2.7.0 page](https://github.com/zaproxy/zaproxy/releases/tag/2.7.0) you can find the link to the linux release:
[https://github.com/zaproxy/zaproxy/releases/download/2.7.0/ZAP\_2.7.0\_Linux.tar.gz](https://github.com/zaproxy/zaproxy/releases/download/2.7.0/ZAP_2.7.0_Linux.tar.gz)

And set it as an installation source:

![installowaspzapbycustomtools1]({{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools2.png" alt="installowaspzapbycustomtools2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools3.png" alt="installowaspzapbycustomtools3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools4.png" alt="installowaspzapbycustomtools4" width="100%">

As input under 'custom tool' we use:

- 'custom tool'
 - name : `ZAP_2.7.0`
 - install automatically
 - download URL for binary archive: `https://github.com/zaproxy/zaproxy/releases/download/2.7.0/ZAP_2.7.0_Linux.tar.gz`
 - subdirectory of extracted archive: `ZAP_2.7.0` 

<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools5.png" alt="installowaspzapbycustomtools5" width="100%">

and finally click on 'Save'.

#### Configuring the port for ZAP

![managejenkins]({{ page.image-base | prepend:site.baseurl }}managejenkins.png)
![configuresystem]({{ page.image-base | prepend:site.baseurl }}configuresystem.png)

Under 'ZAP':

We set the port to something rare, like 12123:

- default host: `localhost`
- default port: `12123`

<img src="{{ page.image-base | prepend:site.baseurl }}configowaspzapport.png" alt="configowaspzapport" width="100%">

'Save'

# Configuring a ZAP job

Now we create our first 'OWASP ZAP scan job':

![newitem]({{ page.image-base | prepend:site.baseurl }}newitem.png)

Enter 'zap\_scan\_demo' and click 'Ok'.

![zapscandemo1]({{ page.image-base | prepend:site.baseurl }}zapscandemo1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo2.png" alt="zapscandemo2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo3.png" alt="zapscandemo3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo4.png" alt="zapscandemo4" width="100%">

Now for 'Tool Selection': `ZAP_2.7.0`.

<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo6.png" alt="zapscandemo6" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo7.png" alt="zapscandemo7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo8.png" alt="zapscandemo8" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo9.png" alt="zapscandemo9" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo10.png" alt="zapscandemo10" width="100%">

We deliver where we want OWASP ZAP to be installed:

- path: `/var/jenkins_home/owaspzap`
- persist session: `owasp_webgoat_zap_session`

<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo11.png" alt="zapscandemo11" width="100%">

## Configuring the target URL

Next, we need to specify the target URL, the URL we want to attack.

For this we need the following information:

- session properties
 - include in context: which URLs are in the test frame? We do not want to scan URLs outside this and which may be liable to prosecution.
 - authentification: Here you can set how the scanner can log in to the application and how it notices this. Any application with a login that you want to test inside needs this setting. 
- attack mode
 - starting point: The address from which we want to start the scan.
 - spider scan: Here we can choose if the scanner tries to find further pages using existing links in the root page. This makes sense, as we don't want to test just one page.
 - active scan: Here we can select the scan policy. As long as we haven't created one yet, the default policy of OWASP ZAP will be taken.
- finalize run: Here you can define how the report should be generated.

Using a small sample application that is vulnerable to XSS, I'll first explain how we can configure each item. Then I'll go into the topic of authentication in applications and how to set them in the scanner. With the shown it should be possible to configure a larger project at the end.

### Configuring OWASP ZAP

#### Installation 

To make the settings easier, we install the original application of OWASP ZAP locally.

To be able to understand everything better we use a fixed version : `2.7.0`. Therefore we use a specific git hash in the URL to install specifically version `2.7.0`:

<pre><code class="bash">brew cask install https://raw.githubusercontent.com/caskroom/homebrew-cask/645dbb8228ec2f1f217ed1431e188687aac13ca5/Casks/owasp-zap.rb
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbrewcask.png" alt="installowaspzapbrewcask" width="100%">

You can now launch the application from your Mac by typing `OWASP ZAP` into Spotlight:

<img src="{{ page.image-base | prepend:site.baseurl }}startowaspzap.png" alt="startowaspzap" width="100%">

Now click '`No, I do not want to persist this session at this moment in time`': 

<img src="{{ page.image-base | prepend:site.baseurl }}notpersistingsessionowaspzap.png" alt="notpersistingsessionowaspzap" width="100%">

Then select 'Start':

<img src="{{ page.image-base | prepend:site.baseurl }}notpersistingsessionowaspzap2.png" alt="notpersistingsessionowaspzap2" width="100%">

#### Configuring Proxy ZAP

We click on the little wheel:

<img src="{{ page.image-base | prepend:site.baseurl }}preferencesowaspzap1.png" alt="preferencesowaspzap1" width="100%">

and set the following data for 'Local Proxies':

- address: `127.0.0.1`
- port: `9000`

and save with `Ok`.

#### Configuring FoxyProxy

In the browser we configure a proxy for `localhost:9000`.

For that, you can use the extension FoxyProxy in Firefox (under Add-ons) as well as in Chrome (under Extensions). 

First we install the extension.

<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyfirefox.png" alt="foxyproxyfirefox" width="100%">

Then we open it by clicking on the icon at the top right of the browser:

![foxyproxyconfig1]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig1.png)

And set this:

![foxyproxyconfig2]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig2.png)
![foxyproxyconfig3]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig3.png)

- Proxy Type: `HTTP`
- Title or Description (optional): `OWASP ZAP 127.0.0.1:9000`
- IP address, DNS name, server name: `127.0.0.1`
- Port: `9000`

<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyconfig4.png" alt="foxyproxyconfig4" width="100%">

`Save`

<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyconfig5.png" alt="foxyproxyconfig5" width="100%">

Now we can select the proxy:

![foxyproxyconfig1]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyconfig6.png" alt="foxyproxyconfig6" width="100%">

The icon changes to:

![foxyproxyconfig7]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig7.png)

Now the traffic runs through the proxy.

### Example application XSS

We launch an application that is vulnerable to XSS:

<pre><code class="bash">docker run -ti --rm -p 127.0.0.1:1185:1185 \
-d secf00tprint/victim_easy_xss_server
</code></pre>

When we open the application we see text input fields for comments. Here you can inject code:

<pre><code class="bash">open http://127.0.0.1:1185
</code></pre>

![victim_easy_xss1]({{ page.image-base | prepend:site.baseurl }}victim_easy_xss1.png)

We determine the IP on the docker network:

<pre><code class="bash">docker inspect &#x3C;containerid_victim_easy_xss_server&#x3E;|grep &#x22;IPA&#x22;
</code></pre>

#### Jenkins Session Properties

Then we enter under 'Session Properties':

- Context Name: `zap_scan_demo`
- Include in Context: `http://&#x3C;determined_IP&#x3E;:1185/.*`, e.g. `http://172.17.0.4:1185/.*`

<img src="{{ page.image-base | prepend:site.baseurl }}sessionpropertiessimplexss_owaspzap.png" alt="sessionpropertiessimplexss_owaspzap" width="100%">

Under 'Attack Mode' we enter the root URL: 

<pre><code class="bash">http://&#x3C;determined_IP&#x3E;:1185/ 
</code></pre>

e.g.

<pre><code class="bash">http://172.17.0.4:1185/ 
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}sessionpropertiessimplexss_owaspzap2.png" alt="sessionpropertiessimplexss_owaspzap2" width="100%">

'Save'

Then we build the item for the first time.

'Build Now'

![buildnow]({{ page.image-base | prepend:site.baseurl }}buildnow.png)

<img src="{{ page.image-base | prepend:site.baseurl }}sessionpropertiessimplexss_owaspzap3.png" alt="sessionpropertiessimplexss_owaspzap3" width="100%">

Then ZAP should be installed in the folder `/var/jenkins_home/owaspzap`.

#### Checking the vulnerability in the Example Application

If we start our proxy and call `http://127.0.0.1:1185` in the browser, 

![foxyproxyconfig7]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig7.png)
<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln1.png" alt="xss_easy_vuln1" width="100%">

this should appear in OWASP ZAP:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln2a.png" alt="xss_easy_vuln2a" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln2b.png" alt="xss_easy_vuln2b" width="100%">

We now go back to the browser and enter the following in the GET-field:

- Comment (using GET): `Test`

'Show'

Result: 

The URL shows `http://127.0.0.1:1185/?comment=Test&enter_comment=Show` and the comment appears:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln3.png" alt="xss_easy_vuln3" width="100%">

If we click on 'Back', enter 

<pre><code class="javascript">&lt;script&gt;alert(1)&lt;/script&gt;
</code></pre>

x and click on 'Save', we see a pop-up:  

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln4.png" alt="xss_easy_vuln4" width="100%">

This means the application is vulnerable to [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting).

OWASP ZAP should find this. Let's take a closer look now:

#### Configuring Scan Policy 

We can use the icon with the mixer to set how we want to scan:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy1.png" alt="owaspzapscanpolicy1" width="100%">

First we click on 'Add' 

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy2.png" alt="owaspzapscanpolicy2" width="100%">

and select the following values:

- Scan policy
 - Policy: `XSS`
 - Default alert threshold: `Medium`
 - Default attack strength: `Low`
 - Information gathering: Threshold: `OFF`, Strength: `Default`
 - Server security: Threshold: `OFF`, Strength: `Default`

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy3.png" alt="owaspzapscanpolicy3" width="100%">

Under 'Injection' we set everything to 'Threshold': `OFF` and Strength: `Default`, except entries with cross-site scripting. These we set to `Low`:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy4.png" alt="owaspzapscanpolicy4" width="100%">

'Miscellaneous', 'External Redirect', 'Threshold' we switch to `OFF`, Strength to `Default` and 'Script Active Scan Rules' to `Low`, `Default`:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy5.png" alt="owaspzapscanpolicy5" width="100%">

'Ok'

Then 'XSS' and 'Export' and save the file as 'XSS.policy':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy6.png" alt="owaspzapscanpolicy6" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy7.png" alt="owaspzapscanpolicy7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy8.png" alt="owaspzapscanpolicy8" width="100%">

'Save'

If we look at the file, we see that it is an XML file that adheres to a certain format. 

![owaspzapscanpolicy8b]({{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy8b.png)

The individual entries can be looked up:

[Policy abbreviations for active and passive scans](https://github.com/zaproxy/zaproxy/wiki/ZAP-API-Scan#configuration-file)

![owaspzapscanpolicy9]({{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy9.png)

We remember the location of the file where we put it, because we need it afterwards for Jenkins.

#### XSS Scan

We now look in the 'History' of OWASP ZAP for the request in which we entered 'Test':

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln5.png" alt="xss_easy_vuln5" width="100%">

and select 'Attack', 'Active Scan':

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln6.png" alt="xss_easy_vuln6" width="100%">

Under 'Policy' we select 'XSS':

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln7.png" alt="xss_easy_vuln7" width="100%">

and click on 'Start Scan'.

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln8.png" alt="xss_easy_vuln8" width="100%">

If we now click on 'Alerts'

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln9.png" alt="xss_easy_vuln9" width="100%">

we can see that an XSS has been found:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln10.png" alt="xss_easy_vuln10" width="100%">

We also want to reproduce this finding in Jenkins.

#### Jenkins Attack Mode

First, we need to copy the policy in Jenkins. To do this, type the following command on the command line in the directory where `XSS.policy` was placed:

<pre><code class="bash">docker cp XSS.policy &#x3C;containerid_jenkins&#x3E;:/var/jenkins_home/owaspzap/policies/
</code></pre>

If we now open the configuration page OWASP ZAP in Jenkins we can select the policy. 

Attack Mode:

- Starting point: `http://&#x3C;determined_IP&#x3E;:1185/?comment=test&#x26;enter_comment=Show` e.g. `http://172.17.0.3:1185/?comment=test&enter_comment=Show`
- Spider Scan: True
 - Recurse: True
 - Subtree Only: Max Children to Crawl: `2`
- Active Scan 
 - Policy: `XSS` wählen 

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapattackmode1.png" alt="owaspzapattackmode1" width="100%"> 
 
#### Jenkins Report

To generate a corresponding report, 

we set 'Finalize Run':

- Generate Reports: True
- Clean Workspace Reports: True
- Filename: `JENKINS_ZAP_VULNERABILITY_REPORT_${BUILD_ID}`
- Generate Report: True
 - Format: choose xml and html

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport1.png" alt="owaspzapreport1" width="100%">
   
Under 'Add post-build action', 'Archive the artifacts':

![owaspzapreport2]({{ page.image-base | prepend:site.baseurl }}owaspzapreport2.png)

- Archive the artifacts
 - Files to archive: `logs/*,reports/*`

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport3.png" alt="owaspzapreport3" width="100%">

and 'Add post-build action', 'Publish HTML Reports':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport4.png" alt="owaspzapreport4" width="100%">

'Add'

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport5.png" alt="owaspzapreport5" width="100%">

- Publish HTML reports: Reports
 - HTML directory to archive: `reports/`
 - Index page[s]: `JENKINS_ZAP_VULNERABILITY_REPORT_${BUILD_ID}`
 - Report title: `ZAP Scan Demo`

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport6.png" alt="owaspzapreport6" width="100%">

and finally we click on 'Save'.

#### Final Scan

To start the final scan we select 'Build now':

![buildnow]({{ page.image-base | prepend:site.baseurl }}buildnow.png)

The performed scan should find the XSS:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscandemofinal1.png" alt="owaspzapscandemofinal1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscandemofinal2.png" alt="owaspzapscandemofinal2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscandemofinal3.png" alt="owaspzapscandemofinal3" width="100%">

### Authentication

In the following section I will explain how to set up authentication. To make it clearer I take 2 applications: OWASP WebGoat and OWASP Juice Shop:

#### OWASP Juice Shop

To start this application we type in the following command on the command line

<pre><code class="bash">docker run --rm -p 127.0.0.1:3000:3000 -d bkimminich/juice-shop
</code></pre>

and open the started application in the browser:

<pre><code class="bash">open http://127.0.0.1:3000
</code></pre>

The proxy for OWASP ZAP should be set in the browser (cf. chapter [Configuring FoxyProxy](#configuring-foxyproxy)). 

Now we go to the login mask:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop1.png" alt="juicyshop1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop2.png" alt="juicyshop2" width="100%">

We'll sign up with:

- User: `' or 1=1;--`
- Password: anything

In the 'History' in OWASP ZAP we should see a POST:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3.png" alt="juicyshop3" width="100%">

#### Username / Password Parameter

The OWASP-ZAP plugin in Jenkins needs for a successful authentication which parameters are used for the login:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3b.png" alt="juicyshop3b" width="100%">

In this case, you can determine them from the POST request:

- `{"email":"' or 1=1;--","password":"p"}`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3a.png" alt="juicyshop3a" width="100%">

We can put that down in Jenkins:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3c.png" alt="juicyshop3c" width="100%">

We can also take the login credentials

- Username: `' or 1=1;--`
- Password: beliebig

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3d.png" alt="juicyshop3d" width="100%">

and the login URL from ZAP:

`http://127.0.0.1:3000/rest/user/login`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3e.png" alt="juicyshop3e" width="100%">

Whereby we still have to exchange the IP with the IP which is present in the Docker network, e.g.:

`http://172.17.0.3:3000/rest/user/login`

We'll put that in Jenkins:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3f.png" alt="juicyshop3f" width="100%">

##### Logged-in String

To determine when the user is logged in, a logged-in string must be specified in Jenkins:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop4.png" alt="juicyshop4" width="100%">

If you click on the question mark on the right you will see how it is determined:

> The Logged in indicator, when present in a response message (either the header or the body), signifies that the response message corresponds to an authenticated request.

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop5.png" alt="juicyshop5" width="100%">

Therefore we look at the response in OWASP ZAP for a successful login:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop5b.png" alt="juicyshop5b" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6.png" alt="juicyshop6" width="100%">

And save this response under the name `response.raw.out`:

Right mouse button, 'Save raw', 'Response', 'All':

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6aa.png" alt="juicyshop6aa" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6ab.png" alt="juicyshop6ab" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juiceshop8.png" alt="juiceshop8" width="100%">

Now we log out of Juicy Shop 

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6ac.png" alt="juicyshop6ac" width="100%">

and try to log in with wrong credentials.

We use

- User name: `test`
- Password: `test`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6ad.png" alt="juicyshop6ad" width="100%">

And search the POST request in ZAP:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6a.png" alt="juicyshop6a" width="100%">

Then we click on Response:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6b.png" alt="juicyshop6b" width="100%">

And save this one:

Right mouse button, 'Save raw':

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6d.png" alt="juicyshop6d" width="100%">

'Response', 'All':

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6e.png" alt="juicyshop6e" width="100%">

We'll take another text file:

- Save As: `response2.out`
- File Format: `Raw`

<img src="{{ page.image-base | prepend:site.baseurl }}juiceshop7.png" alt="juiceshop7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juiceshop7.png" alt="juiceshop8" width="100%">

If we now compare the two responses (e.g. using vim tools `vimdiff response.out.raw response2.out.raw`),

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop9.png" alt="juicyshop9" width="100%">

we see that a login can be recognized by the occurrence of the string `authentication` in the response.

That means we set in Jenkins the following Reg-Ex for the Logged-In Indicator:

- `.*\Qauthentication\E.*`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop10.png" alt="juicyshop10" width="100%">

##### Logged-out String

To determine when we will be logged out, we look at which string can only be found on login page. To do this, hover the mouse over 'Login' in the browser, press the right mouse button and examine the element:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshoploggedout1.png" alt="juicyshoploggedout1" width="100%">

We use the string `TITLE_LOGIN`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshoploggedout2.png" alt="juicyshoploggedout2" width="100%">

and put it in Jenkins:

- `.*\QTITLE_LOGIN\E.*`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshoploggedout3.png" alt="juicyshoploggedout3" width="100%">

#### Missing data

To complete our scan we enter the following parameters:

- Session Properties
- Include in Context: `http://&#x3C;determined_IP&#x3E;:3000/.*` e.g. `http://172.17.0.3:3000/.*`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata1.png" alt="juicyshopaddmissingdata1" width="100%">

Authentication should look like this:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata2.png" alt="juicyshopaddmissingdata2" width="100%">

For the 'Attack Mode' we set:

- Starting Point: `http://&#x3C;determined_IP&#x3E;:3000/`, e.g. `http://172.17.0.3:3000/`. Attention: It is important to set the final slash, otherwise the spider and scanner may not work properly.
- Spider Scan
 - Recurse: True
 - Subtree Only: True
  - Max Children To Crawl: `2`
- Active Scan
 - Policy: `Default Policy`, which scans with MEDIUM strength
 - Recurse: True
   
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata3.png" alt="juicyshopaddmissingdata3" width="100%"> 

Finalize Run' and the Post-Build actions we leave as usual:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata4.png" alt="juicyshopaddmissingdata4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata5.png" alt="juicyshopaddmissingdata5" width="100%">

#### Start Scan

Now we can start the build / scan. This will take some time. 

![buildnow]({{ page.image-base | prepend:site.baseurl }}buildnow.png)
<img src="{{ page.image-base | prepend:site.baseurl }}scanowaspzapjuicyshop.png" alt="scanowaspzapjuicyshop" width="100%">

### OWASP Web Goat

Another application we will use to illustrate authentication is [OWASP WebGoat](https://www.owasp.org/index.php/Category:OWASP_WebGoat_Project).

We'll launch it with you:

<pre><code class="bash">docker run -p 127.0.0.1:10394:8080 -it webgoat/webgoat-8.0 /home/webgoat/start.sh
open http://127.0.0.1:10394/WebGoat/
</code></pre>

#### Creating a user

First we have to register a user:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_registernewuser1.png" alt="webgoat_registernewuser1" width="100%">

We use

- Username: `webgoat` 
- Password: `webgoat`

accept the terms of service and click on 'Sign up':

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_registernewuser2.png" alt="webgoat_registernewuser2" width="100%">

#### Logged-in / Logged-out Indicators

When calling the URL `http://127.0.0.1:10394/WebGoat/` we are redirected to `http://127.0.0.1:10394/WebGoat/login`.

If we now log in with the credentials, have OWASP ZAP recorded, and take a closer look at requests and responses for a successful and unsuccessful login, we see:

- Login-Parameter (POST): `username=webgoat&password=webgoat` 
 - Username Parameter: `username`
 - Password Parameter: `password`
- Login-URL: `http://172.17.0.5:8080/WebGoat/login`, die IP und Port sind diejenigen im Dockernetz. Beides kann über `docker inspect <containerid_webgoat>|grep "IPA"` (IP) bzw aus dem obigen docker-Aufruf ausgelesen werden (Port).
- Username: `webgoat`
- Password: `webgoat`

For a successful login:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators1.png" alt="webgoat_loginlogoutindicators1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicator1b.png" alt="webgoat_loginlogoutindicator1b" width="100%">

For a non-successful login:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators2.png" alt="webgoat_loginlogoutindicators2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators2b.png" alt="webgoat_loginlogoutindicators2b" width="100%">

In the header the location is different:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators3.png" alt="webgoat_loginlogoutindicators3" width="100%">

This is what we use for the Logged-In Indicator:

`.*\QLocation: http://172.17.0.5:8080/WebGoat/welcome.mvc\E.*`

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators4.png" alt="webgoat_loginlogoutindicators4" width="100%">

For the Logged-out-Indicator we take the URL of the login page:

`.*\Qhttp://127.0.0.5:8080/WebGoat/login\E.*`

If this is in one of the responses, we assume that the system has logged out the user.

#### Final setting WebGoat

The final setting for the scan then looks as follows:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal2.png" alt="owaspzapwebgoatfinal2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal1.png" alt="owaspzapwebgoatfinal1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal3.png" alt="owaspzapwebgoatfinal3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal4.png" alt="owaspzapwebgoatfinal4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal5.png" alt="owaspzapwebgoatfinal5" width="100%">

## Best Practices

Due to the duration and traffic such a scan can take, it is recommended to run it only once overnight or once a week.

A daily scan can be set via 'Build Triggers':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapjenkinsbestpractices1.png" alt="owaspzapjenkinsbestpractices1" width="100%">

# Summary

This article summarizes how to install and use OWASP ZAP in the Continuous Integration System Jenkins. 

