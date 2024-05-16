---
layout: post
pageheader-image : /assets/img/post_backgrounds/home-matrix.png
image-base: /assets/img/secure-code-ci/

title: Secure Software Development durch CI 
description: Teil II - Web Application Scanning / DAST
chapter: Teil II - Web Application Scanning / DAST

audience: [security-interested people, developer, tester]
level: beginner
why: necessary to understand following posts

categories:  [ci, securecode, german]

permalink: /securecode/dast/de

toc: true

---

# Einführung

Der [letzte Beitrag]({% post_url 2018-07-17-secure-code-deps-de %}) hat gezeigt wie wir unsichere Abhängigkeiten in einem Projekt finden und beheben können.
Neben dem Problem der mangelnde Abhängigkeiten zu beheben, die in einem Projekt in großer Anzahl vorhanden sein können, gibt es eine weitere Möglichkeit den eigenen Code zu härten.

Bei einer laufenden Anwendung im Internet gibt es ein "Grundrauschen". Das heißt, jede Anwendung die sich öffentlich präsentiert ist nach gewisser Zeit bestimmten Angriffen ausgesetzt. Das kann von Botnetzen kommen, aber auch Personen, die mal "testen" wollen, ob man auf der Seite durch Hacking etwas holen kann. 

Um die eigene Anwendung gegen solche Angriffe schon vor der Veröffentlichung zu wappnen gibt es **DAST-Systeme**, kurz für 'Dynamic Application Security Testing'. Hierbei versucht ein Tool von außen verschiedene Angriffsmuster mit verschiedenen Eingaben auszuführen und wertet dann die Ergebnisse auf potenzielle Lücken aus. Im Prinzip ist das genau das, was der spätere bösartige Angreifer oder das Botnetz auch auf die Anwendung versucht.
Dieser Beitrag unterscheidet sich von dem letzten dadurch, dass nicht Code analysiert wird, sondern ein "echter" Angreifer und mögliche Angriffs-Anfragen auf die eigene Anwendung losgelassen werden.

Ein populäres DAST-System, um das zu machen, ist das Open-Source-Werkzeug [**OWASP ZAP**](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project).

Im Nachfolgenden wird beschrieben wie man OWASP ZAP in Jenkins integrieren kann. 

Viele Beschreibungen basieren auf der super Dokumentation [Jenkins at your Service! Integrating ZAP in Continuous Delivery](https://www.we45.com/blog/how-to-integrate-zap-into-jenkins-ci-pipeline-we45-blog):

Die einzelnen Abschnitte sind aufgeteilt in:

- [**Installation OWASP ZAP in Jenkins**](#installation-owasp-zap-in-jenkins)
- [**Konfiguration eines ZAP Jobs**](#zusammenfassung)
- [**Zusammenfassung des Blogs**](#zusammenfassung)

Die hier beschriebenen Schritte wurden auf einem Mac OS X durchgeführt. Dies betrifft insbesondere das Kapitel in dem OWASP ZAP als Desktop-Anwendung installiert wird.
Man kann die Schritte auch auf einem anderen Betriebssystem durchführen. Hierzu muss man dann allerdings die entsprechenden Kommandozeilen-Äquivalente auf einem anderen OS nachschlagen.

# Installation OWASP ZAP in Jenkins

## Alte Docker Container stoppen

Wer noch aus dem alten Kapitel folgt:
Für die folgenden Erläuterungen benötigen wir den Git-Server erstmal nicht mehr. Wir können ihn stoppen mit:

<pre><code class="bash">docker stop &lt;containerid_gitserver&gt;
</code></pre>

## Installation

Als nächstes installieren wir OWASP ZAP in Jenkins.

### Installation notwendiger Plugins

Zur Installation verwenden wir die Docker-Infrastruktur, welcher wir im letzten Kapitel beschrieben haben. 

Als nächstes benötigen wir:

- das offizielle 'OWASP ZAP Plugin', das wir für die Scans gegen unsere Anwendung verwenden werden
- das 'Custom Tool Plugin' - zur vereinfachten Installation und 
- das 'HTML Publisher Plugin', , um uns die Ergebnisse in den Builds anschauen zu können. 

Hierfür folgende Schritte ausführen:

![owaspzapinstallation1]({{ page.image-base | prepend:site.baseurl }}owaspzapinstallation1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation2.png" alt="owaspzapinstallation2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation3.png" alt="owaspzapinstallation3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation4.png" alt="owaspzapinstallation4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation5.png" alt="owaspzapinstallation5" width="100%">

Wir klicken auf 'Official OWASP ZAP':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation7.png" alt="owaspzapinstallation7" width="100%">

Ebenfalls wählen wir 'Custom Tool' aus. Das können wir über das Filter-Feld oben rechts machen. Danach klicken wir auf 'Download now and install after restart' und 'Restart Jenkins when installation is complete and no jobs are running':

![customtoolsinstallation1]({{ page.image-base | prepend:site.baseurl }}customtoolsinstallation1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}customtoolsinstallation2.png" alt="customtoolsinstallation2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}customtoolsinstallation3.png" alt="customtoolsinstallation3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}customtoolsinstallation4.png" alt="customtoolsinstallation4" width="100%">

Wir gehen nun auf die Standard-Jenkins-Seite:

![owaspzapinstallation9]({{ page.image-base | prepend:site.baseurl }}owaspzapinstallation9.png)
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapinstallation10.png" alt="owaspzapinstallation10" width="100%">

Nach etwas Zeit sollte dann der Login-Screen von Jenkins wieder erscheinen und man kann sich einloggen.

<img src="{{ page.image-base | prepend:site.baseurl }}loginafterrestart.png" alt="loginafterrestart" width="100%">

#### Konfiguration Custom Tools

Wir suchen das fertige Installations-Paket 'OWASP ZAP 2.7.0' für Linux:

Auf [der GitHub Release 2.7.0 Seite](https://github.com/zaproxy/zaproxy/releases/tag/2.7.0) findet sich der Link auf das Linux Release:
[https://github.com/zaproxy/zaproxy/releases/download/2.7.0/ZAP\_2.7.0\_Linux.tar.gz](https://github.com/zaproxy/zaproxy/releases/download/2.7.0/ZAP_2.7.0_Linux.tar.gz)

Und setzen es als Installations-Quelle:

![installowaspzapbycustomtools1]({{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools2.png" alt="installowaspzapbycustomtools2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools3.png" alt="installowaspzapbycustomtools3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools4.png" alt="installowaspzapbycustomtools4" width="100%">

Als Eingaben unter 'Custom Tool' verwenden wir:

- 'Custom tool'
 - Name : `ZAP_2.7.0`
 - Install automatically
 - Download URL for binary archive: `https://github.com/zaproxy/zaproxy/releases/download/2.7.0/ZAP_2.7.0_Linux.tar.gz`
 - Subdirectory of extracted archive: `ZAP_2.7.0` 

<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbycustomtools5.png" alt="installowaspzapbycustomtools5" width="100%">

und klicken schließlich auf 'Save'.

#### Konfiguration Port ZAP

![managejenkins]({{ page.image-base | prepend:site.baseurl }}managejenkins.png)
![configuresystem]({{ page.image-base | prepend:site.baseurl }}configuresystem.png)

Unter 'ZAP':

Wir setzen den Port auf etwas Seltenes, zB. 12123:

- Default Host: `localhost`
- Default Port: `12123`

<img src="{{ page.image-base | prepend:site.baseurl }}configowaspzapport.png" alt="configowaspzapport" width="100%">

'Save'

# Konfiguration eines OWASP ZAP Jobs

Nun erstellen wir unseren ersten 'OWASP ZAP Scan Job':

![newitem]({{ page.image-base | prepend:site.baseurl }}newitem.png)

Hierfür 'zap\_scan\_demo' eingeben und 'Ok' klicken

![zapscandemo1]({{ page.image-base | prepend:site.baseurl }}zapscandemo1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo2.png" alt="zapscandemo2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo3.png" alt="zapscandemo3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo4.png" alt="zapscandemo4" width="100%">

Nun für 'Tool Selection': `ZAP_2.7.0`

<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo6.png" alt="zapscandemo6" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo7.png" alt="zapscandemo7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo8.png" alt="zapscandemo8" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo9.png" alt="zapscandemo9" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo10.png" alt="zapscandemo10" width="100%">

Wir geben an wo wir OWASP ZAP hin installiert haben möchten:

- Path: `/var/jenkins_home/owaspzap`
- Persist session: `owasp_webgoat_zap_session`

<img src="{{ page.image-base | prepend:site.baseurl }}zapscandemo11.png" alt="zapscandemo11" width="100%">

## Konfiguration der Ziel-URL

Als nächstes müssen wir Angaben über die Ziel-URL machen, also die URL die wir angreifen wollen.

Hierfür benötigen wir folgende Angaben:

- Session Properties
 - Include in Context: Welche URLs liegen im Test-Rahmen? Wir möchten keine URLs außerhalb scannen und uns unter Umständen strafbar machen
 - Authentification: Hier kann eingestellt werden, wie sich der Scanner in die Anwendung einloggen kann und wie er das bemerkt. Jegliche Anwendung mit einem Login, die man auch innerhalb testen möchte, benötigt diese Einstellung. 
- Attack Mode
 - Starting Point: Die Adresse von der aus wir den Scan starten möchten.
 - Spider Scan: Hier können wir auswählen ob der Scanner zuvor versucht anhand vorhandener Links in der Wurzel-Seite weitere Seiten zu finden. Das macht Sinn, da wir ja nicht nur eine Seite testen möchten.
 - Active Scan: Hier können wir die Scan-Policy auswählen. Solange wir noch keine erstellt haben wird die Default Policy von OWASP ZAP genommen.
- Finalize Run: Hier kann man definieren, wie der Report erzeugt werden soll.

Anhand einer kleinen Beispiel-Anwendung, welche für XSS anfällig ist, erläutere ich zunächst wie wir die einzelnen Punkte konfigurieren können. Danach gehe ich auf die Authentifizierung in Anwendungen ein, und wie man diese im Scanner einstellt. Mit dem Gezeigten sollte es am Ende möglich sein auch ein größeres Projekt konfigurieren zu können.

### Konfiguration OWASP ZAP

#### Installation 

Um die Einstellungen einfacher vorzunehmen installieren wir uns lokal die originäre Anwendung von OWASP ZAP. 

Um alles besser nachvollziehen zu können verwenden wir eine feste Version : `2.7.0`. Dafür verwenden wir einen bestimmten Git-Hash in der URL der speziell Version `2.7.0` installiert:

<pre><code class="bash">brew cask install https://raw.githubusercontent.com/caskroom/homebrew-cask/645dbb8228ec2f1f217ed1431e188687aac13ca5/Casks/owasp-zap.rb`
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}installowaspzapbrewcask.png" alt="installowaspzapbrewcask" width="100%">

Man kann das Programm nun über den Mac durch Eingabe von `OWASP ZAP` in Spotlight starten:

<img src="{{ page.image-base | prepend:site.baseurl }}startowaspzap.png" alt="startowaspzap" width="100%">

Jetzt '`No, I do not want to persist this session at this moment in time`' anklicken

<img src="{{ page.image-base | prepend:site.baseurl }}notpersistingsessionowaspzap.png" alt="notpersistingsessionowaspzap" width="100%">

Danach 'Start' ansteuern:

<img src="{{ page.image-base | prepend:site.baseurl }}notpersistingsessionowaspzap2.png" alt="notpersistingsessionowaspzap2" width="100%">

#### Konfiguration Proxy ZAP

Wir klicken auf das kleine Rädchen:

<img src="{{ page.image-base | prepend:site.baseurl }}preferencesowaspzap1.png" alt="preferencesowaspzap1" width="100%">

und setzen bei 'Local Proxies' folgende Daten:

- Address: `127.0.0.1`
- Port: `9000`

sowie speichern mit `Ok`.

#### Konfiguration FoxyProxy

Im Browser konfigurieren wir uns einen Proxy für `localhost:9000`.

Dafür kann man sowohl in Firefox (unter Add-ons) als auch Chrome (unter Extensions), die Erweiterung FoxyProxy verwenden. 

Zunächst installieren wir die Erweiterung.

<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyfirefox.png" alt="foxyproxyfirefox" width="100%">

Danach öffnen wir sie über den Klick auf das Icon oben rechts im Browser:

![foxyproxyconfig1]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig1.png)

Und stellen folgendes ein:

![foxyproxyconfig2]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig2.png)
![foxyproxyconfig3]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig3.png)

- Proxy Type: `HTTP`
- Title or Description (optional): `OWASP ZAP 127.0.0.1:9000`
- IP address, DNS name, server name: `127.0.0.1`
- Port: `9000`

<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyconfig4.png" alt="foxyproxyconfig4" width="100%">

`Save`

<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyconfig5.png" alt="foxyproxyconfig5" width="100%">

Nun können wir den Proxy auswählen:

![foxyproxyconfig1]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig1.png)
<img src="{{ page.image-base | prepend:site.baseurl }}foxyproxyconfig6.png" alt="foxyproxyconfig6" width="100%">

Das Icon wird zu:

![foxyproxyconfig7]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig7.png)

Nun läuft der Traffic über den Proxy.

### Beispiel-Anwendung XSS

Wir starten eine Anwendung, welche anfällig ist für XSS:

<pre><code class="bash">docker run -ti --rm -p 127.0.0.1:1185:1185 \
-d secf00tprint/victim_easy_xss_server`
</code></pre>

Wenn wir die Anwendung öffnen sehen wir Texteingabefelder für Kommentare. Hier kann man Code injizieren:

<pre><code class="bash">open http://127.0.0.1:1185
</code></pre>

![victim_easy_xss1]({{ page.image-base | prepend:site.baseurl }}victim_easy_xss1.png)

Wir ermitteln die IP im Docker-Netz:

<pre><code class="bash">docker inspect &#x3C;containerid_victim_easy_xss_server&#x3E;|grep &#x22;IPA&#x22;
</code></pre>

#### Jenkins Session Properties

Danach tragen wir unter 'Session Properties' ein:

- Context Name: `zap_scan_demo`
- Include in Context: `http://&#x3C;ermittelte_IP&#x3E;:1185/.*`, z.B. `http://172.17.0.4:1185/.*`

<img src="{{ page.image-base | prepend:site.baseurl }}sessionpropertiessimplexss_owaspzap.png" alt="sessionpropertiessimplexss_owaspzap" width="100%">

Unter 'Attack Mode' geben wir die Wurzel-URL ein: 

`http://&#x3C;ermittelte_IP&#x3E;:1185/` z.B.

`http://172.17.0.4:1185/`

<img src="{{ page.image-base | prepend:site.baseurl }}sessionpropertiessimplexss_owaspzap2.png" alt="sessionpropertiessimplexss_owaspzap2" width="100%">

'Save'

Danach bauen wir das Item das erste mal.

'Build Now'

![buildnow]({{ page.image-base | prepend:site.baseurl }}buildnow.png)

<img src="{{ page.image-base | prepend:site.baseurl }}sessionpropertiessimplexss_owaspzap3.png" alt="sessionpropertiessimplexss_owaspzap3" width="100%">

Danach sollte ZAP im Ordner `/var/jenkins_home/owaspzap` installiert sein.

#### Die Schwachstelle in der Beispiel-Anwendung prüfen

Wenn wir unseren Proxy starten und im Browser `http://127.0.0.1:1185` aufrufen, 

![foxyproxyconfig7]({{ page.image-base | prepend:site.baseurl }}foxyproxyconfig7.png)
<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln1.png" alt="xss_easy_vuln1" width="100%">

sollte dies in OWASP ZAP erscheinen:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln2a.png" alt="xss_easy_vuln2a" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln2b.png" alt="xss_easy_vuln2b" width="100%">

Wir gehen nun wieder in den Browser und geben im GET-Feld folgendes ein:

- Comment (using GET): `Test`

'Show'

Ergebnis: 

Die URL zeigt `http://127.0.0.1:1185/?comment=Test&enter_comment=Show` und das Kommentar erscheint:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln3.png" alt="xss_easy_vuln3" width="100%">

Klicken wir auf 'Back', geben 

<pre><code class="javascript">
&lt;script&gt;alert(1)&lt;/script&gt;
</code></pre>

ein und klicken auf 'Save', sehen wir ein Pop-up:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln4.png" alt="xss_easy_vuln4" width="100%">

Das heißt die Anwendung ist anfällig für [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting).

OWASP ZAP müsste diese finden. Das schauen wir uns doch jetzt mal etwas genauer an:

#### Konfiguration Scan Policy 

Unter dem Icon mit dem Mischpult können wir einstellen wie wir scannen wollen:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy1.png" alt="owaspzapscanpolicy1" width="100%">

Zunächst klicken wir auf 'Add'

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy2.png" alt="owaspzapscanpolicy2" width="100%">

und wählen folgende Werte:

- Scan Policy
 - Policy: `XSS`
 - Default Alert Threshold: `Medium`
 - Default Attack Strength: `Low`
 - Information Gathering: Threshold: `OFF`, Strength: `Default`
 - Server Security: Threshold: `OFF`, Strength: `Default`

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy3.png" alt="owaspzapscanpolicy3" width="100%">

Unter 'Injection' setzen wir alles auf 'Threshold': `OFF` und Strength: `Default`, außer Einträge mit Cross-Site-Scripting. Diese setzen wir auf `Low`:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy4.png" alt="owaspzapscanpolicy4" width="100%">

'Miscellaneous', 'External Redirect', 'Threshold' schalten wir auf `OFF`, Strength auf `Default` und 'Script Active Scan Rules' auf `Low`, `Default`:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy5.png" alt="owaspzapscanpolicy5" width="100%">

'Ok'

Dann 'XSS' und 'Export' und speichern die Datei als 'XSS.policy':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy6.png" alt="owaspzapscanpolicy6" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy7.png" alt="owaspzapscanpolicy7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy8.png" alt="owaspzapscanpolicy8" width="100%">

'Save'

Wenn wir uns die Datei anschauen, sehen wir dass es sich um eine XML-Datei handelt, die sich an ein bestimmtes Format hält. 

![owaspzapscanpolicy8b]({{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy8b.png)

Die einzelnen Einträge können nachgeschlagen werden:

[Policy Kürzel für aktive und passive Scans](https://github.com/zaproxy/zaproxy/wiki/ZAP-API-Scan#configuration-file)

![owaspzapscanpolicy9]({{ page.image-base | prepend:site.baseurl }}owaspzapscanpolicy9.png)

Wir merken uns den Ort der Datei, wo wir sie abgelegt haben, da wir sie nachher für Jenkins benötigen.

#### XSS Scan

Wir suchen nun in der 'History' von OWASP ZAP den Request in welchem wir 'Test' eingegeben haben:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln5.png" alt="xss_easy_vuln5" width="100%">

und wählen unter 'Attack','Active Scan':

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln6.png" alt="xss_easy_vuln6" width="100%">

Unter 'Policy' wählen wir 'XSS' aus:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln7.png" alt="xss_easy_vuln7" width="100%">

und klicken auf 'Start Scan'.

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln8.png" alt="xss_easy_vuln8" width="100%">

Wenn wir nun auf 'Alerts' klicken

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln9.png" alt="xss_easy_vuln9" width="100%">

Sehen wir dass ein XSS gefunden wurde:

<img src="{{ page.image-base | prepend:site.baseurl }}xss_easy_vuln10.png" alt="xss_easy_vuln10" width="100%">

Dieses Finding wollen wir im Jenkins ebenfalls nachvollziehen.

#### Jenkins Attack Mode

Zunächst müssen wir die Policy in Jenkins kopieren. Hierfür folgenden Befehl in der Kommandozeile eingeben im Verzeichnis, wo `XSS.policy` abgelegt wurde:

<pre><code class="bash">docker cp XSS.policy &#x3C;containerid_jenkins&#x3E;:/var/jenkins_home/owaspzap/policies/
</code></pre>

Wenn wir nun die Konfigurationsseite OWASP ZAP in Jenkins öffnen können wir die Policy auswählen. 

Attack Mode:

- Starting point: `http://&#x3C;ermittelte_IP&#x3E;:1185/?comment=test&#x26;enter_comment=Show` z.B. `http://172.17.0.3:1185/?comment=test&enter_comment=Show`
- Spider Scan: True
 - Recurse: True
 - Subtree Only: Max Children to Crawl: `2`
- Active Scan 
 - Policy: `XSS` wählen 

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapattackmode1.png" alt="owaspzapattackmode1" width="100%"> 
 
#### Jenkins Report

Um einen entsprechenden Report zu generieren,

setzen wir unter 'Finalize Run':

- Generate Reports: True
- Clean Workspace Reports: True
- Filename: `JENKINS_ZAP_VULNERABILITY_REPORT_${BUILD_ID}`
- Generate Report: True
 - Format: xml und html auswählen

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport1.png" alt="owaspzapreport1" width="100%">
   
Unter 'Add post-build action', 'Archive the artifacts':

![owaspzapreport2]({{ page.image-base | prepend:site.baseurl }}owaspzapreport2.png)

- Archive the artifacts
 - Files to archive: `logs/*,reports/*`

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport3.png" alt="owaspzapreport3" width="100%">

und 'Add post-build action' 'Publish HTML Reports':

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport4.png" alt="owaspzapreport4" width="100%">

'Add'

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport5.png" alt="owaspzapreport5" width="100%">

- Publish HTML reports: Reports
 - HTML directory to archive: `reports/`
 - Index page[s]: `JENKINS_ZAP_VULNERABILITY_REPORT_${BUILD_ID}`
 - Report title: `ZAP Scan Demo`

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapreport6.png" alt="owaspzapreport6" width="100%">

und schließlich klicken wir auf 'Save'.

#### Finaler Scan

Um den finalen Scan zu starten wählen wir 'Build now':

![buildnow]({{ page.image-base | prepend:site.baseurl }}buildnow.png)

Der durchgeführte Scan sollte den XSS finden:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscandemofinal1.png" alt="owaspzapscandemofinal1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscandemofinal2.png" alt="owaspzapscandemofinal2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapscandemofinal3.png" alt="owaspzapscandemofinal3" width="100%">

### Authentifizierung

Im folgenden Abschnitt werde ich nun erklären, wie man eine Authentifizierung einrichten kann. Um es besser zu verdeutlichen nehmen ich 2 Anwendungen: OWASP WebGoat und OWASP Juice Shop:

#### OWASP Juice Shop

Um diese Anwendung zu starten setzen wir folgenden Befehl auf der Kommandozeile ab:

`docker run --rm -p 127.0.0.1:3000:3000 -d bkimminich/juice-shop`

und öffnen die gestartete Anwendung im Browser:

`open http://127.0.0.1:3000`

Im Browser sollte der Proxy für OWASP ZAP gesetzt sein (vgl Kapitel [Konfiguration FoxyProxy](#konfiguration-foxyproxy)). 

Nun gehen wir auf die Login-Maske:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop1.png" alt="juicyshop1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop2.png" alt="juicyshop2" width="100%">

Wir melden uns an mit:

- User: `' or 1=1;--`
- Password: beliebig

In der 'History' in OWASP ZAP müssten wir einen POST sehen:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3.png" alt="juicyshop3" width="100%">

#### Username / Password Parameter

Das OWASP-ZAP Plugin in Jenkins benötigt für eine erfolgreiche Authentifizierung, welche Parameter für das Login verwendet werden:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3b.png" alt="juicyshop3b" width="100%">

Man kann sie in diesem Fall aus dem POST-Request ermitteln:

- `{"email":"' or 1=1;--","password":"p"}`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3a.png" alt="juicyshop3a" width="100%">

Das können wir schon mal in Jenkins eintragen:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3c.png" alt="juicyshop3c" width="100%">

Ebenfalls können wir die Login-Credentials

- Username: `' or 1=1;--`
- Password: beliebig

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3d.png" alt="juicyshop3d" width="100%">

und die Login-URL aus ZAP entnehmen:

`http://127.0.0.1:3000/rest/user/login`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3e.png" alt="juicyshop3e" width="100%">

Wobei wir hier die IP noch mit der IP austauschen müssen, welche im Docker-Netz vorhanden ist, zB:

`http://172.17.0.3:3000/rest/user/login`

Das tragen wir in Jenkins ein:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop3f.png" alt="juicyshop3f" width="100%">

##### Logged-in String

Um zu bestimmen, wann der Nutzer eingeloggt ist muss in Jenkins ein Logged-In-String angegeben werden:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop4.png" alt="juicyshop4" width="100%">

Wenn man auf das Fragezeichen rechts klickt bekommt man angezeigt wie dieser ermittelt wird:

> The Logged in indicator, when present in a response message (either the header or the body), signifies that the response message corresponds to an authenticated request.

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop5.png" alt="juicyshop5" width="100%">

Dafür schauen wir uns die Response in OWASP ZAP für einen erfolgreichen Login an:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop5b.png" alt="juicyshop5b" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6.png" alt="juicyshop6" width="100%">

Und speichern diesen Response unter dem Namen `response.raw.out`:

Rechte Maustaste, 'Save raw', 'Response', 'All':

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6aa.png" alt="juicyshop6aa" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6ab.png" alt="juicyshop6ab" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juiceshop8.png" alt="juiceshop8" width="100%">

Nun loggen wir uns in Juicy Shop wieder aus 

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6ac.png" alt="juicyshop6ac" width="100%">

und versuchen uns mit falschen Credentials anzumelden.

Wir nehmen

- Username: `test`
- Passwort: `test`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6ad.png" alt="juicyshop6ad" width="100%">

und suchen den POST-Request in ZAP:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6a.png" alt="juicyshop6a" width="100%">

Dann klicken wir auf Response:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6b.png" alt="juicyshop6b" width="100%">

Und speichern diesen:

Rechte Maustaste, 'Save raw':

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6d.png" alt="juicyshop6d" width="100%">

'Response', 'All':

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop6e.png" alt="juicyshop6e" width="100%">

Wir nehmen wieder eine Text-Datei:

- Save As: `response2.out`
- File Format: `Raw`

<img src="{{ page.image-base | prepend:site.baseurl }}juiceshop7.png" alt="juiceshop7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juiceshop7.png" alt="juiceshop8" width="100%">

Wenn wir nun die beiden Responses vergleichen (zB mittels vim-Tools `vimdiff response.out.raw response2.out.raw`),

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop9.png" alt="juicyshop9" width="100%">

sehen wir, dass ein Login an dem Aufkommen des Strings `authentication` in der Response zu erkennen ist.

Das heißt wir setzen in Jenkins folgenden Reg-Ex für den Logged-In Indicator:

- `.*\Qauthentication\E.*`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshop10.png" alt="juicyshop10" width="100%">

##### Logged-out String

Um zu bestimmen, wann wir ausgeloggt werden, schauen wir uns an welcher String nur auf Login-Page zu finden ist. Hierfür im Browser mit der Maus auf 'Login' hovern, rechte Maustaste drücken und das Element untersuchen:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshoploggedout1.png" alt="juicyshoploggedout1" width="100%">

Wir verwenden den String `TITLE_LOGIN`:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshoploggedout2.png" alt="juicyshoploggedout2" width="100%">

und tragen in in Jenkins ein:

- `.*\QTITLE_LOGIN\E.*`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshoploggedout3.png" alt="juicyshoploggedout3" width="100%">

#### Fehlende Daten

Um unseren Scan zu vervollständigen tragen wir noch folgende Parameter ein:

- Session Properties
- Include in Context: `http://&#x3C;ermittelte_IP&#x3E;:3000/.*` zB `http://172.17.0.3:3000/.*`

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata1.png" alt="juicyshopaddmissingdata1" width="100%">

Authentication sollte folgendermaßen aussehen:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata2.png" alt="juicyshopaddmissingdata2" width="100%">

Für den 'Attack Mode' setzen wir:

- Starting Point: `http://&#x3C;ermittelte_IP&#x3E;:3000/`, z.B. `http://172.17.0.3:3000/`. Achtung: Es ist hier wichtig den abschließenden Slash zu setzen, sonst funktioniert der Spider und Scanner unter Umständen nicht richtig.
- Spider Scan
 - Recurse: True
 - Subtree Only: True
  - Max Children To Crawl: `2`
- Active Scan
 - Policy: `Default Policy`, welche mit MEDIUM Stärke scannt
 - Recurse: True
   
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata3.png" alt="juicyshopaddmissingdata3" width="100%"> 

'Finalize Run' und die Post-Build Aktionen belassen wir wie gehabt:

<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata4.png" alt="juicyshopaddmissingdata4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}juicyshopaddmissingdata5.png" alt="juicyshopaddmissingdata5" width="100%">

#### Scan starten

Nun können wir den Build / Scan starten. Dies wird einige Zeit in Anspruch nehmen. 

![buildnow]({{ page.image-base | prepend:site.baseurl }}buildnow.png)
<img src="{{ page.image-base | prepend:site.baseurl }}scanowaspzapjuicyshop.png" alt="scanowaspzapjuicyshop" width="100%">

### OWASP Web Goat

Eine weitere Anwendung anhand derer wir die Authentifizierung veranschaulichen wollen ist [OWASP WebGoat](https://www.owasp.org/index.php/Category:OWASP_WebGoat_Project).

Wir starten sie mit:

<pre><code class="bash">docker run -p 127.0.0.1:10394:8080 -it webgoat/webgoat-8.0 /home/webgoat/start.sh open http://127.0.0.1:10394/WebGoat/
</code></pre>

#### Nutzer erstellen

Zunächst müssen wir einen Nutzer registrieren:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_registernewuser1.png" alt="webgoat_registernewuser1" width="100%">

Wir nehmen

- Username: `webgoat` 
- Password: `webgoat`

, akzeptieren die Nutzungsbedingungen und klicken auf 'Sign up':

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_registernewuser2.png" alt="webgoat_registernewuser2" width="100%">

#### Logged-in / Logged-out Indicators

Bei Aufruf der URL `http://127.0.0.1:10394/WebGoat/` werden wir auf `http://127.0.0.1:10394/WebGoat/login` weitergeleitet.

Wenn wir uns nun mit den Credentials einloggen, OWASP ZAP mitschneiden lassen, und Requests und Responses für einen erfolgreichen und nicht erfolgreichen Login genauer anschauen, erkennen wir:

- Login-Parameter (POST): `username=webgoat&password=webgoat` 
 - Username Parameter: `username`
 - Password Parameter: `password`
- Login-URL: `http://172.17.0.5:8080/WebGoat/login`, die IP und Port sind diejenigen im Dockernetz. Beides kann über `docker inspect <containerid_webgoat>|grep "IPA"` (IP) bzw aus dem obigen docker-Aufruf ausgelesen werden (Port).
- Username: `webgoat`
- Password: `webgoat`

Für einen erfolgreichen Login:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators1.png" alt="webgoat_loginlogoutindicators1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicator1b.png" alt="webgoat_loginlogoutindicator1b" width="100%">

Für einen nicht-erfolgreichen Login:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators2.png" alt="webgoat_loginlogoutindicators2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators2b.png" alt="webgoat_loginlogoutindicators2b" width="100%">

Im Header unterscheidet sich die Location:

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators3.png" alt="webgoat_loginlogoutindicators3" width="100%">

Das verwenden wir für den Logged-In-Indicator:

`.*\QLocation: http://172.17.0.5:8080/WebGoat/welcome.mvc\E.*`

<img src="{{ page.image-base | prepend:site.baseurl }}webgoat_loginlogoutindicators4.png" alt="webgoat_loginlogoutindicators4" width="100%">

Für den Logged-out-Indicator nehmen wir die URL der Login-Seite:

`.*\Qhttp://127.0.0.5:8080/WebGoat/login\E.*`

Sollte diese sich in der einer der Responses befinden, gehen wir davon aus, dass das System den Nutzer ausgeloggt hat.

#### Finale Einstellung WebGoat

Die finale Einstellung zum Scan sieht dann wie folgt aus:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal2.png" alt="owaspzapwebgoatfinal2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal1.png" alt="owaspzapwebgoatfinal1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal3.png" alt="owaspzapwebgoatfinal3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal4.png" alt="owaspzapwebgoatfinal4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapwebgoatfinal5.png" alt="owaspzapwebgoatfinal5" width="100%">

## Best Practices

Aufgrund der Dauer und des Traffics die so ein Scan in Anspruch nehmen kann, empfiehlt es sich diesen nur einmal über Nacht oder einmal die Woche laufen zu lassen.

Einen täglichen Scan kann man über 'Build Triggers' einstellen:

<img src="{{ page.image-base | prepend:site.baseurl }}owaspzapjenkinsbestpractices1.png" alt="owaspzapjenkinsbestpractices1" width="100%">

# Zusammenfassung

In diesem Artikel wurde zusammengefasst wie man OWASP ZAP im Continuous Integration System Jenkins einbauen und verwenden kann. 

