---
layout: post
pageheader-image : /assets/img/post_backgrounds/home-matrix.png
image-base: /assets/img/secure-code-ci/

title: Secure Software Development durch CI 
description: Teil I - Abhängigkeiten
chapter: Teil I - Abhängigkeiten

audience: [security-interested people, developer, tester]
level: beginner
why: necessary to understand following posts

categories: [ci, securecode, german]

permalink: /securecode/deps/de

toc: true

---

# Einleitung

Heutige Software baut zum großen Teil auf Bibliotheken auf die frei verfügbar sind. Neue Funktionen müssen nicht immer komplett neu implementiert werden, wenn sie schon öffentlich verfügbar vorhanden vorliegen. Oftmals kann ein Entwicklungsteam also auf Bibliotheken der Open-Source Welt zurückgreifen. Das ist kostengünstig und bringt zudem den Vorteil mit sich, dass etwas schon von vielen Augen überdacht und getestet wurde, bevor es in das eigenen Projekt wandert. Man kann sogar sagen, dass die heutige Software aufgrund der Komplexität kaum mehr ohne diese Abhängigkeiten aus der Open-Source-Welt auskommt.

Größere Projekte haben da schonmal unzählige Abhängigkeiten, die sie für verschiedene Features benötigen.

# Sicherheitslücken

Bei der zum Teil riesigen Menge ist es nur eine Frage der Zeit bis eine der Abhängigkeiten eine Sicherheitslücke aufweist.
Das führt dazu das ein System nach und nach für Angriffe anfällig wird, wenn die Lücken nicht beseitigt werden.

Es ist nicht einfach Lücken in Abhängigkeiten manuell zu finden. Das liegt an verschiedenen Gründen: 

1. Der Code kommt von extern, wird also nicht im einbindenden Projekt gewartet.
2. Die externe Bibliothek ist zumeist gezippt und kompiliert eingebunden, wodurch eine Analyse erschwert wird.  
3. Bestehende Abhängigkeiten werden zumeist nicht automatisch geliftet, da dadurch entstehende Seiteneffekte nicht transparent in einem Projekt einsehbar sind, sodass selbst wenn die Entwickler der Abhängigkeit etwas beheben, es unter Umständen nicht direkt in das Projekt hineinwandert.

Das heißt im Umkehrschluss: Das einbindendende Projekt muss anderweitig mitbekommen, dass neue Lücken in Abhängigkeiten vorhanden sind und das zeitnah.
Doch wie können diese fehlerhaften Bibliotheken erkannt und frühzeitig sichtbar gemacht werden?

Dieser erste Teil der Reihe Secure Software Development beschreibt wie man ein Java-Programm auf Abhängigkeiten prüfen kann.

Konkret behandele ich:

- ... wie man Abhängigkeiten auf Kommandozeile prüft (Abschnitt [**Prüfung auf der Kommandozeile**](#   prüfung-auf-der-kommandozeile)). 
- ... die gleiche Prüfung in einem nachgelagerten System genannt Jenkins durchführen kann. Der Hauptteil bezieht sich dabei auf dieses System (Abschnitt [**Jenkins**](#jenkins)).
- ... wie man die gleichen Abhängigkeiten über ein Tool namens Sonarqube prüfen kann. Sonarqube dient dazu Metriken in einem Projekt zu berechnen (Abschnitt [**Sonarqube**](#sonarqube)).
- ... schließlich gibt es eine kleine Zusammenfassung dieses Blogs (Abschnitt [**Zusammenfassung**](#zusammenfassung)).

Zunächst schauen wir uns das eigentlich zugrundeliegende Werkzeug dieses gesamten Blogartikels an:

# Prüfung auf der Kommandozeile
 
## OWASP Dependency Check

[**OWASP Dependency Check**](https://www.owasp.org/index.php/OWASP_Dependency_Check) ist ein Tool, mit welchem man die Abhängigkeiten in seinem Projekt auf Sicherheitslücken prüfen kann:  
Es nimmt vorhandenene Bibliotheken eines Projektes und prüft sie gegen eine Datenbank auf Sicherheitslücken. 
Als Datenbank zieht das Tool hierbei die [*National Vulnerability Database*](https://nvd.nist.gov/), kurz **NVD** heran. In dieser Datenbank stehen zu jeder Bibliotheksversion etwaige bereits bekannte Meldungen. 

<img src="{{ page.image-base | prepend:site.baseurl }}nvd.png" alt="nvd" width="100%">

Im Java-Universum kann Dependency Check auf zwei Varianten eingesetzt werden: 

1. Eingebaut in ein Build-Management-System 
2. Per Kommandozeile

Die folgende Beschreibung zeigt, wie man es per Kommandozeile einsetzt und wie man ein Continuous Integration und Inspection-System verwenden kann. 

Ein [**Continuous Integration System**](https://en.wikipedia.org/wiki/Continuous_integration) ermöglicht automatisiert über aktuellen Code zu gehen. Das wird im einfachsten Fall verwendet um zu sehen, ob der aktuelle Stand  durchgebaut bzw. sich beim Einchecken von neuem Code Fehler ergeben haben. 

Ein **Continous Inspection System** auf der anderen Seite zeigt direkt nach Meldung an das System, ob bestimmte Metriken des Codes erfüllt sind.

Sowohl Continuous Integration als auch Inspection melden Fehler und Warnungen z.B. direkt über E-Mail. Sie können nun mit Dependency Check ergänzt werden, sodass nach dem Einbau einer neuen Bibliothek die Entwickler mitbekommen ob es hier zu Problemen kommt.

Zur Veranschaulichung werden wir in diesem Artikel eine Beispiel-Infrastruktur per Docker verwenden, sodass der Leser die einzelnen Schritte direkt selbst nachvollziehen kann und vielleicht vor Einführung in sein Projekt, das Ganze selbst schonmal antesten kann.

Die Schritte hier sind für einen Mac beschrieben, sollten aber ähnlich auch anderen Betriebssystemen funktionieren

## Benötigte Software

Zunächst wird benötigt:

1. OWASP Dependency Checker 
2. Apache maven
3. Docker 

Die Installation von 1 und 2 kann mittels folgendem Befehl durchgeführt werden:

<pre><code class="bash">brew update && brew install maven dependency-check
</code></pre>

Docker kann entsprechend [seiner Homepage](https://www.docker.com/get-docker) installiert werden.

Wir werden nun im Verlauf dieser Anleitung diese Werkzeuge verwenden. 

## Container IDs

In den nachfolgenden Beschreibung zeigt `<containerid_namedescontainer>` die Docker ID des jeweiligen Containers an. Diese ID kann über den Befehl `docker ps -a` bei laufendem Docker ermittelt werden.
   
## Beispielinfrastruktur

Als nächstes bauen wir eine Infrastruktur mit einem Continuous Integration Server auf.
Hierfür verwenden wir [Jenkins](https://jenkins.io/) und Docker.

Zunächst erstellen wir die nötige Verzeichnisstruktur und bauen einen lokalen Git-Server. Wichtig zu beachten: 
Das Wurzelverzeichnis `secureci` ist Ausgangsbasis für viele der nachfolgenden Befehle. Der Leser sollte also darauf achten, dass 
er aus diesem Verzeichnis heraus agiert.

<pre><code class="bash"># Clone repo with branch java
git clone -b java https://github.com/secf00tprint/secureci.git 
cd secureci
# Create mount directories for docker
./init.sh
</code></pre>

Danach sollte das Verzeichnis `secureci` so aussehen:

![secureciinit]({{ page.image-base | prepend:site.baseurl }}secureciinit.png)

## Ein Java-Projekt scannen

{% assign local_reference1 = 'ein-java-projekt-scannen' %}

Um ein Java-Projekt zu mit OWASP Dependency Check zu scannen können folgenden Schritte im Wurzelverzeichnis des `secureci` Projektes ausgeführt werden:

1 Aufsetzen eines Java-Beispiel-Projektes:

<pre><code class="bash">cd localproject

mvn archetype:generate \
-DarchetypeGroupId=org.apache.maven.archetypes \
-DarchetypeArtifactId=maven-archetype-quickstart \
-DarchetypeVersion=1.3 \
-DgroupId=de.mydomain \
-DartifactId=old_depproject \
-Dversion=1.0-SNAPSHOT \
-Dpackage=de.mydomain -B

cd old_depproject
</code></pre>

2 Alte Abhängigkeiten löschen und Herunterladen der aktuellen Abhängigkeiten in das Projekt:

<pre><code class="bash">mvn clean dependency:copy-dependencies
</code></pre>

3 Kopieren aller Abhängigkeiten in ein Unterverzeichnis `alllibs`:

<pre><code class="bash">if [ -d alllibs ]; then; rm -rf ./alllibs; fi;\
mkdir ./alllibs;\
find . -iname '*.jar' -exec cp {} ./alllibs/ \; 2> /dev/null;\
find . -iname '*.class' -exec cp {} ./alllibs/ \; 2> /dev/null
</code></pre>

4 Starten des Scanners:

<pre><code class="bash">dependency-check \
--project "Example Project" \
-s ./alllibs \
-l dependency.log
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckout.png" alt="depcheckout" width="100%">

5 Auswertung der Ergebnisse:

<pre><code class="bash">open dependency-check-report.html
</code></pre>

Um nun ein Ergebnis mit Lücken zu provozieren ergänzen wir die vom Projekt genutzten Abhängigkeiten mit einer Bibliothek die eine Sicherheitslücke beinhaltet.

Hierzu hängen wir einen `dependencies` Abschnitt, in der Datei `pom.xml` an, wodurch Maven die neue Library beim erneuten Bauen miteinbinden wird:

<pre><code class="xml">&#x3C;dependencies&#x3E;
 ...
      &#x3C;dependency&#x3E;
         &#x3C;groupId&#x3E;commons-fileupload&#x3C;/groupId&#x3E;
         &#x3C;artifactId&#x3E;commons-fileupload&#x3C;/artifactId&#x3E;
         &#x3C;version&#x3E;1.2.2&#x3C;/version&#x3E;
     &#x3C;/dependency&#x3E;
&#x3C;/dependencies&#x3E;
</code></pre>

und führen die Schritte 2 bis 5 nochmal aus. 

Jetzt sollte im Ergebnis-Report eine Lücke vorhanden sein: 

<pre><code class="bash">open dependency-check-report.html
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}reportwithfinding.png" alt="reportwithfinding" width="100%">

## Gitserver erstellen

Nun können wir den Gitserver bauen (Der Server basiert auf dem Code von dem [Projekt jkarlosb Gitserver](https://github.com/jkarlosb/git-server-docker) - 
vielen Dank für dieses wirklich coole Docker Image):

<pre><code class="bash">cd gitserver
docker build -t gitserver .
cd ..
</code></pre>

Wir erzeuge einen Schlüsselpaar (jeweils Enter/Enter für die Passphrase):

<pre><code class="bash">cd mykeys
ssh-keygen -t rsa -f gitkey
cp gitkey.pub ../mnt/gitserver/keys
cd ..
</code></pre>

Nun kann man den Gitserver laufen lassen:
Wir müssen darauf achten, dass wir uns im Wurzelverzeichnis befinden.

<pre><code class="bash">docker run -d -p 127.0.0.1:22:22 \
-v `pwd`/mnt/gitserver/keys:/git-server/keys \
-v `pwd`/mnt/gitserver/repos:/git-server/repos \
gitserver
</code></pre>


Eine Prüfung ob man den Server erreichen kann, kann man machen (Wurzelverzeichnis!) mit:

<pre><code class="bash">ssh git@127.0.0.1 -i mykeys/gitkey
</code></pre>

### Anmeldung möglich

Als Rückmeldung sollte kommen:

<pre><code class="bash">Welcome to git-server-docker!
You've successfully authenticated, but I do not
provide interactive shell access.
Connection to 127.0.0.1 closed.
</code></pre>

### Keine Anmeldung möglich

Folgende Fehlermeldung kann erscheinen, sollte man die IP schonmal vergeben haben:

<pre><code class="bash">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
</code></pre>

Zur Lösung die Datei `~/.ssh/known_hosts` öffnen und die entsprechende Zeile mit Server entfernen bzw. mit `#` auskommentieren.

### Erstellen eines externen Git-Repos

Nun erstellen wir lokal ein Git-Projekt und kopieren das Repo in unseren Gitserver:

<pre><code class="bash">cd localproject 
git init --shared=true 
git add . 
git commit -m &quot;my first commit&quot; 
cd .. git clone --bare localproject mnt/gitserver/repos/project.git
docker restart &lt;containerid_gitserver&gt;
</code></pre>

Man kann nun testen ob der Code committed wurde mittels:

<pre><code class="bash">ssh-add mykeys/gitkey
mkdir temp && cd temp
git clone ssh://git@127.0.0.1/git-server/repos/project.git
cd ..
</code></pre>

Danach kann das Temp-Verzeichnis mittels 

<pre><code class="bash">rm -rf temp
</code></pre>

wieder gelöscht werden.

# Jenkins

Im folgenden Kapitel bauen und verwenden wir nun das Continuous Integration System namens [**Jenkins**](https://jenkins.io/).

<img src="{{ page.image-base | prepend:site.baseurl }}jenkins.png" alt="jenkins" width="100%">

## Jenkins zum Laufen bringen

Als nächstes starten wir Jenkins.

Hierfür gehen wir in das Verzeichnis `conintserver`:

<pre><code class="bash">cd conintserver
</code></pre>

und bauen das Image:

<pre><code class="bash">docker build -t conintserver .
cd ..
</code></pre>

Danach starten wir den Server aus dem Wurzelverzeichnis mit:

<pre><code class="bash">docker run -p 127.0.0.1:8080:8080 -p 127.0.0.1:50000:50000 -v `pwd`/mnt/conintserver/jkhome:/var/jenkins_home -v `pwd`/mnt/conintserver/project/:/home conintserver
</code></pre>

Und öffnen den Server im Browser

<pre><code class="bash">open http://127.0.0.1:8080
</code></pre>

In der Docker-Konsole findet sich ein Eintrag:

<pre><code class="bash">*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

XXXXXXXXX

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
*************************************************************
*************************************************************
</code></pre>

Wir kopieren den Code `XXXXXXXXX` aus den Logs in das Browsereingabefeld.

Falls die Ausgabe von Docker gerade nicht verfügbar ist, kann sie auch mittels 

<pre><code class="bash">docker logs &#x3C;containerid_jenkins&#x3E; --tail 30
</code></pre>

angezeigt werden.

<img src="{{ page.image-base | prepend:site.baseurl }}unlockjenkins.png" alt="unlock_jenkins" width="100%">

<img src="{{ page.image-base | prepend:site.baseurl }}unlockjenkins2.png" alt="unlock_jenkins2" width="100%">

Als nächstes klicken wir auf 'Continue'

und auf 'Install suggested plugins':

<img src="{{ page.image-base | prepend:site.baseurl }}installsuggestedplugins.png" alt="installsuggestedplugins" width="100%">

<img src="{{ page.image-base | prepend:site.baseurl }}installsuggestedplugins2.png" alt="installsuggestedplugins2" width="100%">

Im nachfolgenden Formular tragen wir einen Namen, Passwort und E-Mail ein und merken uns diese Daten:

<img src="{{ page.image-base | prepend:site.baseurl }}installsuggestedplugins2.png" alt="installsuggestedplugins2" width="100%">

<img src="{{ page.image-base | prepend:site.baseurl }}createadmin.png" alt="createadmin" width="100%">

Also zB:

| Username      | Password      | Fullname | E-Mail |
| ------------- |:-------------:|:--------:| -----:|
| secf00tprint  | zB mittels `pwgen -ync 40` auf der Kommandozeile | secf00tprint | youraccount@yourdomain.tld |

(pwgen kann installiert werden mit `brew install pwgen`)

Klick auf Speichern und Weiter.

Wir setzen die Jenkins URL:

<img src="{{ page.image-base | prepend:site.baseurl }}jenkinsurl.png" alt="jenkinsurl" width="100%">

und zuletzt speichern wir und beenden.

<img src="{{ page.image-base | prepend:site.baseurl }}startusingjenkins.png" alt="startusingjenkins" width="100%">

## Dependency Check als Plugin installieren

1. Zunächst wählen wir Jenkins managen aus:
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck1.png" alt="installdepcheck1" width="100%">
2. Dann Managen von Plugins:
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck2.png" alt="installdepcheck2" width="100%">
3. Verfügbare Plugins:
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck3.png" alt="installdepcheck3" width="100%">
4. OWASP Dependency Check:
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck4.png" alt="installdepcheck4" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck5.png" alt="installdepcheck5" width="100%">
5. Wir wählen Herunterladen und nach Neustart installieren:
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck6.png" alt="installdepcheck6" width="100%">
6. Wir klicken auf 'Jenkins neustarten, wenn die Installation vollständig ist'
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck7.png" alt="installdepcheck7" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}installdepcheck8.png" alt="installdepcheck8" width="100%">

Wir schauen in die Docker Logs bis `INFO: Jenkins is fully up and running` dort steht.

Am Ende gehen wir auf `http://127.0.0.1:8080` und loggen uns mit den vorhandenen Credentials ein.

## Git Credentials hinterlegen

Zunächst müssen wir für unseren Git Docker die entsprechenden Credentials in Jenkins hinterlegen:

Hierfür gehen wir im Hauptmenü auf 'Credentials':

![addcredentials1]({{ page.image-base | prepend:site.baseurl }}addcredentials1.png)

Dann auf 'Global Credentials', 'Add Credentials' anklicken:

![addcredentials2]({{ page.image-base | prepend:site.baseurl }}addcredentials2.png)

Wählen 'SSH Username with private key':

<img src="{{ page.image-base | prepend:site.baseurl }}addcredentials3.png" alt="addcredentials3" width="100%">

Tragen als Nutzer 'git' ein und den privaten Schlüssel:

<img src="{{ page.image-base | prepend:site.baseurl }}addcredentials4.png" alt="addcredentials4" width="100%">

Den privaten Schlüssel kann man sich zum Kopieren mit 

<pre><code class="bash">cat mykeys/gitkey
</code></pre>

auf der Konsole ausgeben lassen.

Klicken auf 'Ok', damit sind die Credentials für unser Git in Jenkins hinterlegt.

## Varianten OWASP Dependency Check Jenkins

Nun gibt es 2 Möglichkeiten OWASP Dependency Check über sein Projekt laufen zu lassen:

Entweder man führt es als Teil eines Pipeline-Builds aus oder als Teil eines Standard GUI-Builds.

Im folgenden werden beide Varianten erklärt. 

Die beiden Build-Varianten unterscheiden sich auf folgende Weise:

Beim **Jenkins Pipeline-Build** beschreibt das Projekt-Team die Schritte des Builds in einer Textdatei. Dies kann entweder über eine Groovy-ähnliche Skript-Sprache erfolgen oder in einer deklarativen Schreibweise. Die nachfolgenden Beispiele verwenden die deklarative Schreibweise.

Bei einem **Standard GUI Build** klickt das Projekt-Team die entsprechenden Punkte über die GUI zusammen. 

Vorteil der GUI:

Die GUI ist zunächst beim Erstellen der Vorgänge durch Visualisierung mit Grafiken leichter verständlich. Die Syntax und Befehle der Pipeline-Definitionen müssen nicht bekannt sein.

Vorteil der Pipeline: 

Beim Build werden die definierten Einzelschritte schön grafisch dargestellt. Die Logs der einzelnen Schritte können angeklickt werden und der Programmierer kann, wenn es so konfiguriert ist, das Script lokal bearbeiten und einsehen ohne auf den Jenkins per Browser zugreifen zu müssen.

### Jenkins Pipeline einrichten

#### Globale Tools definieren

Wir wählen im Hauptmenü unter 'Manage Jenkins', 'Global Tool Configuration' aus:

<img src="{{ page.image-base | prepend:site.baseurl }}globaltoolconfiguration1.png" alt="globaltoolconfiguration1" width="100%">

Die hier definierten Namen werden später von der Pipeline verwendet.

So setzen wir unter Maven als Name 'Maven 3.3.9' und wählen Maven 3.3.9 aus:

<img src="{{ page.image-base | prepend:site.baseurl }}globaltoolconfiguration2.png" alt="globaltoolconfiguration2" width="100%">

und klicken auf 'Save'.

#### NVD Update Pipeline Item

Um nicht jedes Mal die NVD-Datenbank komplett neu herunterziehen zu müssen, sollte man zunächst ein periodischer Job definieren, der, unabhängig von der eigentlichen Analyse, die Datenbank aktualisiert, sodass diese von dem Prüfungsjob schnell herangezogen werden kann.

Hierfür erzeugen wir ein Pipeline-Projekt:

Wir klicken 'New-Item':

![createnewnvdupdatepipeline]({{ page.image-base | prepend:site.baseurl }}createnewnvdupdatepipeline.png)

wählen Pipeline-Projekt aus, vergeben einen Namen (hier 'depcheck-nvdupdate') und klicken auf 'Ok':

![createnewnvdupdatepipeline2]({{ page.image-base | prepend:site.baseurl }}createnewnvdupdatepipeline2.png)

Als Build Triggers wählen wir 'Build periodically' aus und tragen '@daily' ein, dann wird die Datenbank täglich aktualisiert:

<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdatepipeline3.png" alt="createnewnvdupdatepipeline3" width="100%">

Unter Pipeline tragen wir folgende Deklaration ein und klicken auf 'Save':

<pre><code class="bash">pipeline {
    agent any
    stages {
        stage ('Dependency Check Update') {
            steps {
                dependencyCheckUpdateOnly '/var/jenkins_home/depcheck/nvdupdates'
            }
        }
    }
}
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdatepipeline4.png" alt="createnewnvdupdatepipeline4" width="100%">

Damit wird definiert, dass auf dem Jenkins das Update in dem Verzeichnis `/var/jenkins_home/depcheck/nvdupdates` landet.

Danach bauen wir die Datenbank über 'Build Now':

![runnvdupdate1]({{ page.image-base | prepend:site.baseurl }}runnvdupdate1.png)

Die Ausgabe sollte wie folgt aussehen:

![runnvdupdate2]({{ page.image-base | prepend:site.baseurl }}runnvdupdate2.png)

Die Konsolenausgabe kann man sich über den blauen Ball anzeigen lassen:

![runnvdupdate3]({{ page.image-base | prepend:site.baseurl }}runnvdupdate3.png)

und könnte dann so aussehen:

![runnvdupdate4]({{ page.image-base | prepend:site.baseurl }}runnvdupdate4.png)

#### OWASP Dependency Check Pipeline Item

Nun hinterlegen wir ein Pipeline-Projekt, dass unseren Code prüft:
 
Wir klicken wie im vorherigen Kapitel im Hauptmenü auf 'New Item', wählen 'Pipeline' aus und als Name z.B. 'projectpipeline\_depcheck'.

Nun wählen wir unter 'Pipeline', 'Pipeline script from SCM'. Das bedeutet wir werden das Pipeline-Script aus unserem Repository ziehen, sodass wir es lokal definieren und ändern können:

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckpipeline1.png" alt="depcheckpipeline1" width="100%">

Hier setzen wir die Repository-URL für unseren Docker-Gitserver.

Um die interne IP des Docker-Servers zu bestimmen, geben wir folgendes auf dem Host ein:

<pre><code class="bash">docker inspect &#x3C;containerid_gitserver&#x3E; |grep -i &#x22;\&#x22;ipaddress&#x22;
</code></pre>

Diese verwenden wir und geben als Repository-URL ein:

<pre><code class="bash">ssh://git@&#x3C;ip_gitserver_docker&#x3E;/git-server/repos/project.git
</code></pre>

zum Beispiel:

<pre><code class="bash">ssh://git@172.17.0.4/git-server/repos/project.git
</code></pre>

Als nächstes wählen wir die zuvor definierten Credentials aus - in dem Fall die mit 'git' gekennzeichnete Auswahl im Dropdown-Menü:

![depcheckpipeline2]({{ page.image-base | prepend:site.baseurl }}depcheckpipeline2.png)

Hiernach sollte das Repository erkannt werden.

Als nächstes setzen wir `Jenkinsfile` als ein Pipeline-Script aus unserem Repository.

Danach klicken wir auf 'Save'.

##### Lokales Jenkinsfile definieren - Einleitung

Wir gehen in unser lokales Git-Projekt:

<pre><code class="bash">cd localproject
</code></pre>

und erstellen im Wurzelverzeichnis die Datei `Jenkinsfile` mit folgendem Inhalt:

<pre><code class="bash">pipeline {
    agent any
    tools {
        maven 'Maven 3.3.9'
    }
    stages {
        /*
        stage ('Initialize') {
            steps {
                sh 'echo === init stage ==='
                // e.g. "M2_HOME = ${M2_HOME}"
            }
        }

        stage ('Build') {
            steps {
                sh 'echo === build stage ==='
                sh 'cd old_depproject; mvn -Dmaven.test.failure.ignore=true install'
            }
        }

        stage ('Test') {
            steps {
                sh 'echo === test stage ==='
            }
        }
        */

        stage ('Dependency Check') {
            steps {
                sh 'echo === security stage ==='
                sh 'echo === OWASP dependency check ==='
                sh 'cd old_depproject; mvn clean dependency:copy-dependencies'
                sh 'cd old_depproject; ./aggregatefordepcheck.sh'
                dependencyCheckAnalyzer scanpath: 'old_depproject', \
                  outdir: 'depcheck/report', \
                  datadir: '/var/jenkins_home/depcheck/nvdupdates', \
                  hintsFile: '', \
                  includeVulnReports: true, \
                  includeCsvReports: true, \
                  includeHtmlReports: true, \
                  includeJsonReports: true, \
                  isAutoupdateDisabled: true, \
                  skipOnScmChange: false, \
                  skipOnUpstreamChange: false, \
                  suppressionFile: '', \
                  zipExtensions: ''

               dependencyCheckPublisher pattern: 'depchec/report/dependency-check-report.xml', \
                  failedTotalAll: '0', \
                  usePreviousBuildAsReference: false
            }
        }
    }
}
</code></pre>

##### Lokales Jenkinsfile definieren - Mögliche Parameter

Die hier definierten Parameter für das OWASP Dependency Check Plugin können auch nachgeschlagen werden:

[https://jenkins.io/doc/pipeline/steps/dependency-check-jenkins-plugin/](https://jenkins.io/doc/pipeline/steps/dependency-check-jenkins-plugin/)

Im Wesentlichen kann gesteuert werden:

DependencyCheckAnalyzer:

|Parameter   |   Beschreibung   | Typ |  Beispiel  |
|:----------:|:----------------:|:---:|:----------:|
|`scanpath`|Pfad zum Scannen|`String`|`'old_depproject'`|
|`outdir`|Ausgabeverzeichnis|`String`|`'depcheck/report'`|
|`datadir`|Datenverzeichnis|`String`|`'/var/jenkins_home/depcheck/nvdupdates'`|
|`suppressionFile`|Suppression File (mehr dazu weiter unten)|`String`|`'suppression.xml'`|
|`hintsFile`|Genutzt um [False Negatives zu bestimmen](https://jeremylong.github.io/DependencyCheck/general/hints.html)|`String`|`'hintsfile.xml'`|
|`zipExtensions`|Spezifiziert, welche Dateiendungen als Zip behandelt werden|`String`|`'jar'`|
|`isAutoupdateDisabled`|Deaktiviert das automatische NVD Update beim einem Lauf|`Boolean`|`'true'`|
|`includeHtmlReports`|Erzeugt einen optionalen HTML Report|`Boolean`|`'false'`|
|`includeVulnReports`|Erzeugt einen optionalen Schwachstellen Report|`Boolean`|`'true'`|
|`includeJsonReports`|Erzeugt einen optionalen JSON Report|`Boolean`|`'false'`|
|`includeCsvReports`|Erzeugt einen optionalen CSV Report|`Boolean`|`'true'`|
|`skipOnScmChange`|Überspringe, falls ausgelöst durch SCM Veränderungen|`Boolean`|`'false'`|
|`skipOnUpstreamChange `|Überspringe, falls ausgelöst durch Upstream Veränderungen|`Boolean`|`'true'`|


DependencyCheckPublisher:

|Parameter   |   Beschreibung   | Typ |  Beispiel  |
|:----------:|:----------------:|:---:|:----------:|
|`pattern`|Dependency Check Ergebnis Datei(en)|`String`|`''**/dependency-check-report.xml'`|
|`usePreviousBuildAsReference`|Nutze den vorherigen Build|`Boolean`|`'false'`|

Über bestimmte Parameter kann man dem DependencyCheckPublisher-Aufruf mitgeben, welche Rückmeldungen er bei verschiedenen Findings geben soll. 
Wir nehmen hier erstmal folgenden Parameter:

<pre><code class="bash">failedTotalAll: '0' 
</code></pre>

das heißt der Build schlägt fehl bzw wird rot, sobald mindestens ein Finding gefunden wurde.

Man könnte auch

<pre><code class="bash">unstableTotalAll: '0' 
</code></pre>

setzen.

Dann würde der Build gelb bzw instabil, sobald mindestens ein Finding gefunden wird.

Neben diesen beiden relativ grundlegenden Grenzwerten können auch detailliertere Angaben gemacht werden, wann ein Build gelb oder rot markiert werden soll. 

Folgende Parameter lassen sich Stand Juli 2018 definieren:

| Parameter |
|:---------:|
|`failedNewAll`|
|`failedNewHigh`| 
|`failedNewLow`| 
|`failedNewNormal`| 
|`failedTotalAll`| 
|`failedTotalHigh`| 
|`failedTotalLow`| 
|`failedTotalNormal`| 
|`unstableNewAll`| 
|`unstableNewHigh`| 
|`unstableNewLow`| 
|`unstableNewNormal`| 
|`unstableTotalAll`| 
|`unstableTotalHigh`| 
|`unstableTotalLow`| 
|`unstableTotalNormal`| 

<br>

##### Lokales Jenkinsfile definieren - Aggregieren der Abhängigkeiten

Zum Bauen der Abhängigkeiten erstellen wir noch unter `localproject/olddeproject` folgendes Shell-Skript `aggregatefordepcheck.sh`:

<pre><code class="bash">#! /bin/bash
[[ -d alllibs ]] || mkdir ./alllibs; find . -iname '*.jar' -exec cp {} ./alllibs/ 2>/dev/null \; ; find . -iname '*.class' -exec cp {} ./alllibs/ 2>/dev/null \;
</code></pre>

##### Lokales Jenkinsfile definieren - Finales Pipeline Skript

Alles zusammen pushen wir in unser Docker-Repo:

<pre><code class="bash">git add .
git commit -m "Jenkinsfile and Maven Aggregate Script"
git push origin master
</code></pre>

Wenn wir nun in Jenkins unser Item `projectpipeline_depcheck` auswählen und auf 'Build Now' klicken, sollte folgende Ausgabe erscheinen:

![rundepcheck1]({{ page.image-base | prepend:site.baseurl }}rundepcheck1.png)

bzw als Konsolenausgabe:

<img src="{{ page.image-base | prepend:site.baseurl }}rundepcheck2.png" alt="rundepcheck2" width="100%">

Aus den Logs kann auch der Pfad des Reports auf dem Jenkins-Server entnommen werden:

<pre><code class="bash">open ../mnt/conintserver/jkhome/workspace/projectpipeline_depcheck/depcheck/report/dependency-check-report.html
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}rundepcheck3.png" alt="rundepcheck3" width="100%">

#### Prüfung, ob es funktioniert

Als nächstes fügen wir eine Abhängigkeit ein, welche problematisch ist. 

Wir ergänzen unsere pom.xml mit:

<pre><code class="xml">
&#x3C;!-- https://mvnrepository.com/artifact/commons-fileupload/commons-fileupload --&#x3E;
&#x3C;dependency&#x3E;
    &#x3C;groupId&#x3E;commons-fileupload&#x3C;/groupId&#x3E;
    &#x3C;artifactId&#x3E;commons-fileupload&#x3C;/artifactId&#x3E;
    &#x3C;version&#x3E;1.2.2&#x3C;/version&#x3E;
&#x3C;/dependency&#x3E;
</code></pre>

dazu gehen wir in `localproject/old_depproject` und erweitern den dependencies-Abschnitt:

<img src="{{ page.image-base | prepend:site.baseurl }}checkdepcheckpipeline1.png" alt="checkdepcheckpipeline1" width="100%">

Danach pushen wir die neue `pom.xml` und bauen das Item neu.

<pre><code class="bash">git add pom.xml
git commit -m "add old commons fileupload"
git push origin master
</code></pre>

![checkdepcheckpipeline2]({{ page.image-base | prepend:site.baseurl }}checkdepcheckpipeline2.png)

Ergebnis - der Build sollte fehlschlagen:

<img src="{{ page.image-base | prepend:site.baseurl }}checkdepcheckpipeline3.png" alt="checkdepcheckpipeline3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}checkdepcheckpipeline4.png" alt="checkdepcheckpipeline4" width="100%">

und das entsprechende HTML entnommen aus den Jenkins-Logs spiegelt das Issue auch wieder:

<pre><code class="bash">open ../mnt/conintserver/jkhome/workspace/projectpipeline_depcheck/depcheck/report/dependency-check-report.html
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}checkdepcheckpipeline5.png" alt="checkdepcheckpipeline5" width="100%">

#### Testauswertung modifizieren

Wenn man nicht gleich eine rote Ampel erzeugen möchte, kann man auch anstatt 

`failedTotalAll` ein `unstableTotalAll` im Jenkinsfile verwenden:

<pre><code class="bash">&#x3E; cat Jenkinsfile                                                                     
pipeline {
    agent any
    tools {
        maven 'Maven 3.3.9'
    }
    stages {
        /*
        stage ('Initialize') {
            steps {
                sh 'echo === init stage ==='
                // e.g. "M2_HOME = ${M2_HOME}"
            }
        }

        stage ('Build') {
            steps {
                sh 'echo === build stage ==='
                sh 'cd old_depproject; mvn -Dmaven.test.failure.ignore=true install'
            }
        }

        stage ('Test') {
            steps {
                sh 'echo === test stage ==='
            }
        }
        */

        stage ('Dependency Check') {
            steps {
                sh 'echo === security stage ==='
                sh 'echo === OWASP dependency check ==='
                sh 'cd old_depproject; mvn clean dependency:copy-dependencies'
                sh 'cd old_depproject; ./aggregatefordepcheck.sh'
                dependencyCheckAnalyzer scanpath: 'old_depproject', \
                  outdir: 'depcheck/report', \
                  datadir: '/var/jenkins_home/depcheck/nvdupdates', \
                  hintsFile: '', \
                  includeVulnReports: true, \
                  includeCsvReports: true, \
                  includeHtmlReports: true, \
                  includeJsonReports: true, \
                  isAutoupdateDisabled: true, \
                  skipOnScmChange: false, \
                  skipOnUpstreamChange: false, \
                  suppressionFile: '', \
                  zipExtensions: ''

               dependencyCheckPublisher pattern: 'depcheck/report/dependency-check-report.xml', \
                  unstableTotalAll: '0', \
                  usePreviousBuildAsReference: false
            }
        }
    }
}
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}depchecksetwarning1.png" alt="depchecksetwarning1" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}depchecksetwarning2.png" alt="depchecksetwarning2" width="100%">

### Jenkins Standard Build

Neben der Definition über Pipeline-Skripte kann man das OWASP Dependency Check Plugin auch ganz standardmäßig über die GUI klicken.

Hierbei ist die Konfiguration übersichtlicher, aber die Ausgabe nachher nicht so modular und verständlich.

#### NVD Update GUI Item

Die Konfiguration läuft in diesen Schritten:

1. 'New Item':
<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdategui1.png" alt="createnewnvdupdategui1" width="100%">
2. 'Build Triggers' 'Build periodically':
<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdategui2.png" alt="createnewnvdupdategui2" width="100%">
3. 'Build' 'Add build step' 'Invoke Dependency-Check NVD update only':
<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdategui3.png" alt="createnewnvdupdategui3" width="100%">
4. Data directory: `/var/jenkins_home/depcheck/nvdupdates`
<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdategui4.png" alt="createnewnvdupdategui4" width="100%">
5. 'Save'

Danach über 'Build Now' den Build anstoßen.

<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdategui5.png" alt="createnewnvdupdategui5" width="100%">

Die Konsolenausgabe sollte wie folgt aussehen:

<img src="{{ page.image-base | prepend:site.baseurl }}createnewnvdupdategui6.png" alt="createnewnvdupdategui6" width="100%">

#### OWASP Dependency Check GUI Item

Auf Basis der über das Pipeline-Script oder GUI-Item erzeugten NVD-Datenbank auf dem Jenkins können wir nun die Abhängigkeiten wie folgt testen lassen:

![depcheckgui1]({{ page.image-base | prepend:site.baseurl }}depcheckgui1.png)

Wir klicken auf 'Ok'.

Unter 'Source Code Management' tragen wir den Git Server aus dem Docker Netz ein:

<pre><code class="bash">ssh://git@172.17.0.4/git-server/repos/project.git
</code></pre>

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui2.png" alt="depcheckgui2" width="100%">

und wählen die Credentials 'git' aus:

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui3.png" alt="depcheckgui3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui4.png" alt="depcheckgui4" width="100%">

Dann geht es unter 'Build' zu 'Invoke top-level Maven targets':

![depcheckgui5a]({{ page.image-base | prepend:site.baseurl }}depcheckgui5a.png)

Nun ist das installierte globale Tool auszuwählen:

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui5b.png" alt="depcheckgui5b" width="100%">

Nun entscheiden wir uns für 'Advanced'. Als Goals `clean dependency:copy-dependencies` einstellen und Ort der `pom.xml` wählen

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui5c.png" alt="depcheckgui5c" width="100%">

Under 'Build' we add another build step using 'Add build steps': 'Invoke Dependency-Check analysis':

![depcheckgui6]({{ page.image-base | prepend:site.baseurl }}depcheckgui6.png)

Wir wählen 'Advanced' und dann:

- Path to scan: `old_depproject`
- Output directory: `depcheck/report`
- Data directory: `/var/jenkins_home/depcheck/nvdupdates`

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui7.png" alt="depcheckgui7" width="100%">

'Add post-buid action'

![depcheckgui8]({{ page.image-base | prepend:site.baseurl }}depcheckgui8.png)

Als nächstes ist es 'Advanced':

- Dependency Check results: `depcheck/report/dependency-check-report.xml`
- Status Thresholds, zB:
 - All priorities Warnung bei: `5`, Failure bei: `10`
 - Priority high: Warnung bei: `2`, Failure bei: `10`

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui9.png" alt="depcheckgui9" width="100%">

Danach gehen wir auf 'Save'. 

Über 'Build now' den Buildprozess anstoßen.

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui10.png" alt="depcheckgui10" width="100%">

Das Ergebnis ist gelb, wenn wir die `pom.xml` mit der dependency `commons-fileupload` bestückt haben - ansonsten blau.

Ebenso zeigt die Konsolenausgabe bei veralteter commons-fileupload Abhängigkeit `unstable` an:

<img src="{{ page.image-base | prepend:site.baseurl }}depcheckgui11.png" alt="depcheckgui11" width="100%">

## Findings unterdrücken

Manchmal müssen bestimmte Findings ausgeschaltet werden. Das kann unterschiedliche Gründe haben:

1. Es handelt sich um einen False Positive
2. Man kann die Library aus bestimmten Gründen nicht ändern

Hierfür dient das sogenannte **Suppression File**.

Eine Suppression-File ist eine XML-Datei mit folgendem Aufbau:

<img src="{{ page.image-base | prepend:site.baseurl }}structuresuppressionfile.png" alt="structuresuppressionfile" width="100%">

In den suppress-Bereichen kann dann aufgelistet werden, was nicht beachtet werden soll.

Die Justierung pro suppress-Bereich erfolgt über 2 Suchkriterien:

Zum einen kann angegeben werden, welche Abhängigkeiten nicht beachtet werden sollen, etwa auf bestimmte Jar-Dateien.
Zum anderen definiert man, welche Schwachstelle ausgeschlossen werden soll.

Beispiel:

<pre><code class="xml">&#x3C;suppress&#x3E;
        &#x3C;notes&#x3E;&#x3C;![CDATA[
        This suppresses cpe:/a:csv:csv:1.0 for some.jar in the &#x22;c:\path\to&#x22; directory.
        ]]&#x3E;&#x3C;/notes&#x3E;
        &#x3C;filePath&#x3E;c:\path\to\some.jar&#x3C;/filePath&#x3E;
        &#x3C;cpe&#x3E;cpe:/a:csv:csv:1.0&#x3C;/cpe&#x3E;
&#x3C;/suppress&#x3E;
</code></pre>

unterdrückt das Finding `cpe:/a:csv:csv:1.0` in der Abhängigkeit `c:\path\to\some.jar`.

### Suppress-Sectionen erzeugen

Nachdem ein HTML-Dependency-Check Report erzeugt wurde kann man sich direkt aus dem Report bei einem Finding die zugehörige Unterdrückung, also den Suppress-Abschnitt ausgeben lassen:

<img src="{{ page.image-base | prepend:site.baseurl }}depchecksuppressfromhtmlrep1.png" alt="depchecksuppressfromhtmlrep1" width="100%">

Durch das Klicken auf den Suppress-Button bekommt man direkt das Snippet angezeigt:

<img src="{{ page.image-base | prepend:site.baseurl }}depchecksuppressfromhtmlrep2.png" alt="depchecksuppressfromhtmlrep2" width="100%">

Dieses kann man nun in die XML hineinkopieren.

### Suppression-File in Pipeline-Projekten

Wie weiter oben erwähnt dient zur Definition des Suppression-Files ein Parameter namens 'suppressionFile'.

Ein Auszug aus einem Jenkinsfile könnte wie folgt aussehen:

<pre><code class="bash">pipeline {
    agent any
    ...
    stages {
    ...
        stage ('Dependency Check') {
            steps {
                ...
                dependencyCheckAnalyzer scanpath: 'old_depproject', \
                  outdir: 'depcheck/report', \
                  ...
                  suppressionFile: 'suppression.xml', \
                  zipExtensions: ''

               dependencyCheckPublisher pattern: 'depcheck/report/dependency-check-report.xml', \
                  unstableTotalAll: '0', \
                  usePreviousBuildAsReference: false
            }
        }
    }
}
</code></pre>

### Suppression-File in der GUI

Verwendet man die Standard-GUI, so findet sich das Suppression-File unter 'Build' 'Invoke Dependency-Check analysis' 'Suppression File':

<img src="{{ page.image-base | prepend:site.baseurl }}depchecksuppressionfilegui.png" alt="depchecksuppressionfilegui" width="100%">

# Sonarqube

Neben dem Einbau von Dependency Check in dem Continuous Integration System Jenkins kann das Analysetool auch noch in anderen nachgelagerten Systemen eingebaut werden.

Ein Beispiel ist das Continuous Inspection Werkzeug [**Sonarqube**](https://www.sonarqube.org/) mit dem Entwickler den eingecheckten Code auf bestimmte Metriken prüfen können wie etwa der Testabdeckung.

Dieses Kapitel beschreibt wie man Sonarqube mit OWASP Dependency Check ergänzen kann. 

Wieder wird anhand eines Beispiel-Dockers gearbeitet, sodass vor einer Einführung in das eigene Projekt die Maßnahmen geprüft werden können.

Um Sonarqube per Docker zu starten geben wir folgenden Befehl im Wurzelverzeichnis ein:

    docker run -d --name sonarqube -p 127.0.0.1:9001:9000 -p 127.0.0.1:9092:9092 -v `pwd`/mnt/coninsserver/sonarqube_home/data:/opt/sonarqube/data -v `pwd`/mnt/coninsserver/sonarqube_home/extensions:/opt/sonarqube/extensions sonarqube:7.1

Nach einer gewissen Zeit und wenn der Port nicht belegt sein sollte erscheint im Browser unter `http://127.0.0.1:9001/`:

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqube0.png" alt="sonarqube0" width="100%">

und schließlich:

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqube0b.png" alt="sonarqube0b" width="100%">

## Sonarqube Plugin installieren

Ausgehend von [der GitHub Page von dem Dependency Check Sonar Plugin](https://github.com/stevespringett/dependency-check-sonar-plugin) clonen wir uns zunächst das Plugin und bauen es lokal:

<pre><code class="bash">git clone https://github.com/stevespringett/dependency-check-sonar-plugin.git
cd dependency-check-sonar-plugin
mvn clean package
</code></pre>

Die Ausgabe von Maven zeigt uns an wo es erzeugt wurde:

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubeinstalldepcheckplugin1.png" alt="sonarqubeinstalldepcheckplugin1" width="100%">

Nun kopieren wir die erstellte Jar in den Docker Container in das Unterverzeichnis `/extensions/plugins` im Sonarqube Homeordner.
Der Homeordner findet sich in der Umgebungsvariablen `SONARQUBE_HOME`:

<pre><code class="bash">docker exec &#x3C;containerid_sonarqube&#x3E; env
</code></pre>

<pre><code class="bash">...
LANG=C.UTF-8
JAVA_HOME=/docker-java-home
JAVA_VERSION=8u171
JAVA_DEBIAN_VERSION=8u171-b11-1~deb9u1
CA_CERTIFICATES_JAVA_VERSION=20170531+nmu1
SONAR_VERSION=7.1
SONARQUBE_HOME=/opt/sonarqube
SONARQUBE_JDBC_USERNAME=sonar
SONARQUBE_JDBC_PASSWORD=sonar
SONARQUBE_JDBC_URL=
...
</code></pre>

<pre><code class="bash">docker cp &#x3C;Pfad zur erzeugten Jar&#x3E; &#x3C;containerid_sonarqube&#x3E;:/opt/sonarqube/extensions/plugins/
</code></pre>

zB bei einer Container-ID xyz:

<pre><code class="bash">docker cp sonar-dependency-check-plugin/target/sonar-dependency-check-plugin-1.1.0-SNAPSHOT.jar xyz:/opt/sonarqube/extensions/plugins/
</code></pre>

Um Sonarqube mit dem neuen Plugin auszustatten müssen wir das System neustarten.

Hierfür klicken wir rechts oben auf 'Login':
 
<img src="{{ page.image-base | prepend:site.baseurl }}installsonarqubedepcheckplugin2.png" alt="installsonarqubedepcheckplugin2" width="100%">

Die Standardcredentials sind:

'admin' 'admin'

<img src="{{ page.image-base | prepend:site.baseurl }}installsonarqubedepcheckplugin3.png" alt="installsonarqubedepcheckplugin3" width="100%">

Zunächst werden wir aufgefordert ein Token anzulegen.

Als Name wählen wir hier `project` für unser Beispielprojekt und klicken auf 'Generate': 

![sonarqube0d]({{ page.image-base | prepend:site.baseurl }}sonarqube0d.png)

Als nächstes auf 'Continue':

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqube0e.png" alt="sonarqube0e" width="100%">

Als Programmiersprache wählen wir 'Java' und als Build-Technologie 'Maven'. 
Wir kopieren uns den Kommandozeilenbefehl über den 'Copy'-Knopf' und vermerken ihn für später.

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqube0f.png" alt="sonarqube0f" width="100%">

Dann beenden wir beenden die Anleitung rechts unten mit 'Finish this tutorial',

und gehen auf 'Administration':

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubeclicktoadministration.png" alt="sonarqubeclicktoadministration" width="100%">

Wählen 'System'

![sonarqube0c2]({{ page.image-base | prepend:site.baseurl }}sonarqube0c2.png)

und 'Restart Server'

![sonarqube0c3]({{ page.image-base | prepend:site.baseurl }}sonarqube0c3.png)

'Restart'

![sonarqube0c4]({{ page.image-base | prepend:site.baseurl }}sonarqube0c4.png)
![sonarqube0c5]({{ page.image-base | prepend:site.baseurl }}sonarqube0c5.png)

Nach einer kurzen Zeit sollte folgende Seite angezeigt werden:

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqube0c6.png" alt="sonarqube0c6" width="100%">

Wenn wir nun unter 'Administration' auf 'Configuration' 'General Settings' klicken sollte 'Dependency Check' mit angezeigt werden:

![sonarqube0c7]({{ page.image-base | prepend:site.baseurl }}sonarqube0c7.png)
<img src="{{ page.image-base | prepend:site.baseurl }}sonarqube0c8.png" alt="sonarqube0c8" width="100%">

Wir haben zu diesem Zeitpunkt das Plugin installiert und besitzen ein Token für unser Beispielprojekt.

## Code prüfen lassen

Unter 'Administration' 'Configuration' stellen wir folgende Pfade ein:

- Dependency-Check HTML report path : `reports/dependency-check-report.html` 
- Dependency-Check report path: `reports/dependency-check-report.xml`

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubeclicktoadministration.png" alt="sonarqubeclicktoadministration" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubecodecheck1.png" alt="sonarqubecodecheck1" width="100%">

Nun gehen wir in unser lokales Projekt. 
Das Projekt sollte in der Maven-Konfigurations-Datei `pom.xml` [wie zuvor beschrieben](#{{ page.local_reference1 }}) eine angreifbare Abhängigkeit namens `commons-fileupload` besitzen.
Um den Report für Sonarqube zu erzeugen geben wir im Wurzelverzeichnis auf der Kommandozeile folgendes ein:

<pre><code class="bash">cd localproject/old_depproject
mvn clean dependency:copy-dependencies
./aggregatefordepcheck.sh
[[ -d reports ]] ||mkdir reports
dependency-check --project &#x22;Example Project&#x22; -s ./alllibs -l dependency.log -f ALL -o reports
mvn sonar:sonar -Dsonar.host.url=http://127.0.0.1:9001 \
  -Dsonar.login=&#x22;&#x3C;token&#x3E;&#x22; \
  -Dsonar.dependencyCheck.reportPath=&#x22;reports/dependency-check-report.xml&#x22; \
  -Dsonar.dependencyCheck.htmlReportPath=&#x22;reports/dependency-check-report.html&#x22;
</code></pre>

Wenn wir nun auf 'Projects' gehen so sehen wir folgendes:

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubecodecheck2.png" alt="sonarqubecodecheck2" width="100%">

Und wenn wir auf 'old\_depproject' gehen bekommen wir eine genaue Aufsschlüsselung:

<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubecodecheck2b.png" alt="sonarqubecodecheck2" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubecodecheck3.png" alt="sonarqubecodecheck3" width="100%">
<img src="{{ page.image-base | prepend:site.baseurl }}sonarqubecodecheck4.png" alt="sonarqubecodecheck4" width="100%">

# Zusammenfassung

Wir haben nun eine Infrastruktur in welcher wie Abhängigkeiten in unseren Projekten sowohl über Jenkins als auch Sonarqube prüfen lassen können. Treten neue Sicherheitslücken werden diese von den Systemen erkannt und können gemeldet werden.
Im nächsten [Blogbeitrag]({% post_url 2018-07-17-secure-code-dast-de %}) behandeln wir wie wir neben den Abhängigkeitsanalysen in unseren Projekten, aktive Schwachstellenscans auf unser Projekt über Jenkins laufen lassen können, um so weitere Lücken finden zu können.
